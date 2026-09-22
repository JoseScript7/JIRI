# JIRI Flow

JIRI Flow is an on-device cognitive task guidance assistant for dementia care, running entirely locally on Snapdragon via Qualcomm AI Hub models. It observes a familiar daily routine through camera and microphone, and provides exactly one gentle next-step cue at a time using a deterministic task-state engine.

## Setup Instructions

1. **Create and Activate Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Requirements**
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: This includes `qai-hub-models`, `transformers`, `torch`, `opencv-python`, `SpeechRecognition`, `pyttsx3`, `fastapi`, and `uvicorn`)*

## How to Run the Demo

To launch the full end-to-end demo (Live Dashboard + Vision Tracker + AI Cue Generator):

```bash
python run_demo.py
```
This single command will:
1. Start the FastAPI caregiver dashboard in the background.
2. Automatically open the dashboard in your default web browser.
3. Check and log your network status (proving the core loop executes fully offline).
4. Launch the Object Detector, Speech Listener, and AI Cue Generator loops.

### Running with a Simulation (No Webcam Needed)
If you want to test the orchestrator's state engine and language generation without physical props or a webcam, use the headless simulator:
```bash
python run_demo.py --headless-sim
```

## Adding a New Routine (One-Time Setup)

Caregivers can easily add new routines without touching code:
1. Start the demo using `python run_demo.py`.
2. Navigate to [http://localhost:8000/configure](http://localhost:8000/configure) in your browser.
3. Add a Routine Name (e.g., "Evening Medication").
4. Add sequential steps, defining the instruction string (e.g., "get medication box") and selecting the required objects from the dropdown.
5. Click **Save Routine**. 
6. To run your new routine, launch the demo with:
   `python run_demo.py --routine routines/rt_evening_medication.json`

## Known Limitations

- **COCO Class Approximations**: The current standard YOLOv8 model relies on the 80 COCO classes. Some objects require approximations (e.g., detecting a "bottle" instead of a "kettle", or a "book" instead of a "medication box"). **For production, we recommend swapping this for YOLO-World** (`qai_hub_models.models.yolo_world`), which utilizes open-vocabulary text prompting to detect exact native objects without approximations.
- **Whisper Transcription Accuracy**: The lightweight, localized `openai/whisper-tiny.en` model may struggle with accuracy on non-standard accents or high-noise environments.
- **NPU Benchmarking Status**: NPU hardware acceleration has been successfully implemented in the code (explicitly requesting the `QNNExecutionProvider` in ONNX Runtime), but is **not yet benchmarked on target hardware**. Latency metrics from cloud VM simulations will fall back to CPU execution times.
