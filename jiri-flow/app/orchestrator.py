import time
import threading
import argparse
import sys
import os
import cv2
import multiprocessing

# Ensure we can import from the app module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.vision.detector import ObjectDetector, TaskRelevantFilter
from app.task_engine.state_machine import TaskStateEngine, TransitionStatus
from app.speech.listener import AudioListener
from app.language.cue_generator import CueGenerator
from app.logging.caregiver_log import CaregiverLogger
import socket


def _run_tts(text: str):
    """Isolated process to run pyttsx3, bypassing all thread-affinity deadlocks on Linux/macOS."""
    try:
        import pyttsx3

        engine = pyttsx3.init()
        rate = engine.getProperty("rate")
        engine.setProperty("rate", rate - 30)
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"TTS Error: {e}")


def check_network_status():
    """Checks if there is an active internet connection."""
    try:
        import socket

        socket.setdefaulttimeout(1)
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect(("8.8.8.8", 53))
        return "ONLINE"
    except Exception:
        return "OFFLINE"


class JiriOrchestrator:
    def __init__(self, routine_path: str, headless_sim: bool = False):
        self.headless_sim = headless_sim
        self.engine = TaskStateEngine()
        self.engine.load_routine(routine_path)

        required_objects = set()
        for step in self.engine.routine.steps:
            required_objects.update(step.required_objects)

        self.vision_filter = TaskRelevantFilter(list(required_objects))

        # Don't initialize real hardware if simulating
        if not self.headless_sim:
            self.detector = ObjectDetector()
            self.listener = AudioListener()

        print("Initializing LLM for Cue Generation...")
        self.cue_gen = CueGenerator()
        self.cue_lock = threading.Lock()

        # Note on Text-to-Speech:
        # Unlike cloud TTS services (e.g. ElevenLabs, Google Cloud TTS) which require
        # internet access, API keys, and incur latency/cost per request, pyttsx3 interfaces
        # directly with local system speech engines (like espeak on Linux, NSSpeechSynthesizer
        # on macOS, or SAPI5 on Windows). This ensures maximum privacy, zero network latency,

        print("Initializing Caregiver Logger...")
        self.logger = CaregiverLogger()
        self.logger.clear_logs()  # Reset logs for the current session
        self.logger.log_event("ROUTINE_STARTED", f"Started routine: {routine_path}")

        self.running = False
        self.stuck_cooldown = False

    def play_cue(self, text: str):
        print(f"\n[SPEAKER]: {text}\n")
        # Run in a separate process so it doesn't block the vision loop or deadlock the threads
        p = multiprocessing.Process(target=_run_tts, args=(text,))
        p.start()

    def _generate_and_play(self, step_name: str, is_retry: bool = False):
        with self.cue_lock:
            cue = self.cue_gen.generate_cue(step_name, is_retry=is_retry)
            self.play_cue(cue)

            event_type = "CUE_RETRY" if is_retry else "CUE_GENERATED"
            self.logger.log_event(event_type, f"Step '{step_name}': {cue}")

    def start(self):
        self.running = True
        print("\n=== Starting JIRI Flow Orchestrator ===")

        # Reset the logic timer so it doesn't count initialization time
        self.engine.last_progress_time = time.time()

        # Announce first step
        first_step = self.engine.current_step()
        if first_step:
            self._generate_and_play(first_step.name, is_retry=False)

        # Start speech listener on a background thread
        speech_thread = threading.Thread(target=self.speech_loop, daemon=True)
        speech_thread.start()

        # Vision/Logic blocks on the main thread
        self.vision_loop()

    def handle_speech(self, text: str):
        text = text.lower()

        # Log speech for biomarker extraction
        try:
            self.logger.log_biomarker(text, source="jiri")
        except Exception as e:
            print(f"[SYS] Error logging biomarker: {e}")

        if "what" in text and ("next" in text or "do" in text):
            step = self.engine.current_step()
            if step:
                print(
                    f"[SYS] Received explicit user request for help. Generating immediate cue."
                )
                self.logger.log_event("MIC_HELP_REQUEST", f"User asked: '{text}'")
                self._generate_and_play(step.name, is_retry=False)

    def speech_loop(self):
        """Continuously listens for microphone input. If simulating, fires a fake event."""
        if self.headless_sim:
            # Simulate a user asking for help at second 9 (after step 2 is complete but before stuck timer fires)
            time.sleep(9)
            if self.running:
                print("\n[MIC] User speaking: 'what do I do next?'")
                self.logger.log_event(
                    "MIC_HELP_REQUEST", "User asked: 'what do I do next?'"
                )
                self.handle_speech("what do I do next")
            return

        import sounddevice as sd

        sample_rate = 16000
        duration = 4

        while self.running:
            try:
                # Naive continuous recording loop
                audio = sd.rec(
                    int(duration * sample_rate),
                    samplerate=sample_rate,
                    channels=1,
                    dtype="float32",
                )
                sd.wait()
                text = self.listener.transcribe(audio, sample_rate)
                if text and text.strip():
                    print(f"[MIC] Heard: {text}")
                    self.logger.log_event("MIC_HELP_REQUEST", f"User asked: '{text}'")
                    self.handle_speech(text)
            except Exception as e:
                time.sleep(1)

    def _map_detections_to_routine(self, detected_labels: list[str]) -> list[str]:
        """Map raw COCO classes into the classes the Routine expects."""
        mapped = set()
        for label in detected_labels:
            for routine_obj, coco_labels in self.vision_filter.coco_mapping.items():
                if label in coco_labels:
                    mapped.add(routine_obj)
            if label in self.vision_filter.acceptable_coco_classes:
                mapped.add(label)
        return list(mapped)

    def vision_loop(self):
        """Main loop grabbing frames, running detection, and advancing the state engine."""
        cap = None
        if not self.headless_sim:
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                print("Error: Could not open webcam.")
                self.running = False
                return

        # Dynamically build a simulation timeline based on the loaded routine
        sim_timeline = []
        elapsed_sec = 2
        for step in self.engine.routine.steps:
            coco_labels = []
            for req_obj in step.required_objects:
                if req_obj in self.vision_filter.coco_mapping:
                    coco_labels.append(
                        self.vision_filter.coco_mapping[req_obj][0]
                    )  # pick first mapping
                else:
                    coco_labels.append(req_obj)
            sim_timeline.append((elapsed_sec, coco_labels))
            elapsed_sec += 15  # Add 15s between steps to allow cue generation to finish and stuck timers to potentially fire

        start_time = time.time()
        try:
            while self.running:
                step = self.engine.current_step()
                if not step:
                    break

                detected_labels = []

                if self.headless_sim:
                    elapsed = time.time() - start_time
                    for t, objects in reversed(sim_timeline):
                        if elapsed >= t:
                            detected_labels = objects
                            break
                    time.sleep(1)
                else:
                    ret, frame = cap.read()
                    if not ret:
                        break

                    frame = cv2.resize(frame, (640, 640))
                    raw = self.detector.detect_objects(frame)
                    filtered = self.vision_filter.filter_detections(raw)
                    detected_labels = [d["label"] for d in filtered]
                    time.sleep(1)  # Rate limit: 1 frame per second

                # Update Logic
                mapped_objects = self._map_detections_to_routine(detected_labels)
                transition = self.engine.update(mapped_objects)

                if transition.status == TransitionStatus.ADVANCED:
                    print(f"\n--- STEP COMPLETED: {transition.previous_step.name} ---")
                    self.logger.log_event(
                        "STEP_COMPLETED", f"Completed: {transition.previous_step.name}"
                    )
                    self.stuck_cooldown = False
                    if transition.current_step:
                        self.logger.log_event(
                            "STEP_STARTED", f"Started: {transition.current_step.name}"
                        )
                        self._generate_and_play(
                            transition.current_step.name, is_retry=False
                        )
                elif transition.status == TransitionStatus.COMPLETED:
                    print(
                        f"\n--- ROUTINE COMPLETED: {transition.previous_step.name} ---"
                    )
                    self.logger.log_event(
                        "ROUTINE_COMPLETED",
                        f"Routine completed on step: {transition.previous_step.name}",
                    )
                    self.play_cue("You have finished the routine. Great job!")
                    self.running = False
                    break

                # Stuck timer check
                if self.engine.time_since_last_progress() > 8.0:
                    if not self.stuck_cooldown:
                        print(
                            f"\n[SYS] No progress for 8s. Triggering automatic retry cue for '{step.name}'."
                        )
                        self.logger.log_event(
                            "STUCK_DETECTED",
                            f"No progress for 8s on step '{step.name}'.",
                        )
                        self._generate_and_play(step.name, is_retry=True)
                        self.stuck_cooldown = True

        finally:
            self.running = False
            if cap:
                cap.release()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--headless-sim", action="store_true", help="Run offline sim without webcam"
    )
    parser.add_argument(
        "--routine",
        type=str,
        default="routines/morning_tea.json",
        help="Path to the routine JSON file",
    )
    args = parser.parse_args()

    net_status = check_network_status()
    print(
        f"\nNETWORK STATUS: {net_status} — core loop does not require network regardless of this status.\n"
    )

    orch = JiriOrchestrator(args.routine, headless_sim=args.headless_sim)
    orch.start()
