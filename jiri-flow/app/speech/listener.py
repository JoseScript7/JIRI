import numpy as np
import warnings
import os

warnings.filterwarnings("ignore")

try:
    import sounddevice as sd
except OSError:
    sd = None

import librosa
from qai_hub_models.models.whisper_tiny_en import Model, App


class AudioListener:
    def __init__(self):
        print("Loading Whisper Tiny EN model...")
        # Note: We load the exact same openai/whisper-tiny.en model that qai_hub_models uses,
        # but we use transformers.pipeline directly for inference because the qai_hub_models.App
        # custom decoding loop hallucinates on the Linux CPU fallback.
        from transformers import pipeline

        self.pipe = pipeline(
            "automatic-speech-recognition", model="openai/whisper-tiny.en"
        )

    def transcribe(self, audio_clip: np.ndarray, sample_rate: int) -> str:
        """Transcribe an audio clip using Whisper Tiny."""
        # Convert audio to mono if it's stereo
        if len(audio_clip.shape) > 1 and audio_clip.shape[1] > 1:
            audio_clip = np.mean(audio_clip, axis=1)

        # pipeline accepts a raw numpy array if sample rate matches the model
        result = self.pipe(audio_clip)
        return result.get("text", "")


def create_synthetic_audio(text: str, filename: str):
    """Creates a synthetic audio file using gTTS (used when mic is unavailable)."""
    from gtts import gTTS

    tts = gTTS(text, lang="en")
    tts.save(filename)
    return filename


def main():
    listener = AudioListener()

    sample_rate = 16000  # Standard for Whisper

    if sd is not None:
        duration = 4.0
        print(f"Recording for {duration} seconds. Say 'what do I do next' out loud!")
        try:
            recording = sd.rec(
                int(duration * sample_rate),
                samplerate=sample_rate,
                channels=1,
                dtype="float32",
            )
            sd.wait()
            print("Recording complete. Transcribing...")
            audio_data = recording.flatten()
            text = listener.transcribe(audio_data, sample_rate)
            print(f"Transcribed Text: '{text.strip()}'")
            return
        except Exception as e:
            print(f"sounddevice recording failed: {e}")
            print("Falling back to synthetic audio test...")

    # Fallback / headless test mode when microphone (PortAudio) is missing
    print("Microphone not available (PortAudio missing). Running synthetic test...")
    print("Synthesizing audio: 'what do I do next'")
    temp_audio = "temp_mock_speech.mp3"
    create_synthetic_audio("what do I do next", temp_audio)

    print("Loading synthetic audio for transcription...")
    audio_data, sr = librosa.load(temp_audio, sr=sample_rate)

    print("Transcribing...")
    text = listener.transcribe(audio_data, sr)
    print(f"\nTranscribed Text: '{text.strip()}'\n")

    if os.path.exists(temp_audio):
        os.remove(temp_audio)


if __name__ == "__main__":
    main()
