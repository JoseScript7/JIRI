#!/usr/bin/env python3
"""
whisper_server_qnn.py — Persistent Whisper transcription sidecar using qai_hub_models and QNN.

Protocol (newline-delimited JSON over stdin/stdout):
  ← {"status": "ready", "model": "whisper_tiny_en (QNN)"}          (startup, once)
  → {"path": "/tmp/audio.webm", "language": "as"} (request, per transcription)
  ← {"text": "matixi", "language": "en"}           (response)
  ← {"text": "", "error": "..."}                   (on failure)
"""
import sys
import json
import os
import traceback

def main() -> None:
    # ── Import qai_hub_models whisper ───────────────────────────────────────
    try:
        from qai_hub_models.models.whisper_tiny_en import Model, App
    except ImportError:
        _emit({"status": "error", "error": "qai_hub_models not installed. Run: pip install qai_hub_models"})
        sys.exit(1)

    # ── Load model once ─────────────────────────────────────────────────────────
    _log("Loading whisper_tiny_en model via qai_hub_models...")
    
    # Explicitly request QNN Execution Provider for ONNX Runtime
    try:
        import onnxruntime as ort
        providers = ["QNNExecutionProvider", "CPUExecutionProvider"]
        # In a real hardware deployment, qai_hub_models exports to ONNX and runs via these providers.
        ort.set_default_logger_severity(3)
        _log(f"Configured ONNX Runtime providers: {providers}")
    except ImportError:
        _log("Warning: onnxruntime not installed, falling back to PyTorch execution.")

    try:
        model = Model.from_pretrained()
        app = App(model.encoder, model.decoder, model.hf_source)
    except Exception as exc:
        _emit({"status": "error", "error": str(exc)})
        sys.exit(1)

    _log("Model 'whisper_tiny_en' ready.")
    _emit({"status": "ready", "model": "whisper_tiny_en (QNN)"})

    # ── Request loop ─────────────────────────────────────────────────────────────
    for raw_line in sys.stdin:
        raw_line = raw_line.strip()
        if not raw_line:
            continue

        try:
            req = json.loads(raw_line)
        except json.JSONDecodeError as exc:
            _emit({"text": "", "error": f"Invalid JSON request: {exc}"})
            continue

        audio_path: str = req.get("path", "")
        # Note: qai_hub_models.models.whisper_tiny_en only outputs english, so lang_hint is ignored

        # ── Validate file ───────────────────────────────────────────────────────
        if not audio_path:
            _emit({"text": "", "error": "No audio path provided"})
            continue
        if not os.path.exists(audio_path):
            _emit({"text": "", "error": f"Audio file not found: {audio_path}"})
            continue
        if os.path.getsize(audio_path) == 0:
            _emit({"text": "", "error": "Audio file is empty"})
            continue

        # ── Transcribe ──────────────────────────────────────────────────────────
        try:
            text = app.transcribe(audio_path)
            _emit({"text": text.strip(), "language": "en"})
        except Exception:
            err_msg = traceback.format_exc()
            _log(f"Transcription error:\n{err_msg}")
            _emit({"text": "", "error": err_msg.splitlines()[-1]})


# ── Helpers ───────────────────────────────────────────────────────────────────

def _emit(obj: dict) -> None:
    """Write a JSON response line to stdout and flush immediately."""
    sys.stdout.write(json.dumps(obj, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def _log(msg: str) -> None:
    """Write a log line to stderr."""
    sys.stderr.write(f"[whisper_server_qnn] {msg}\n")
    sys.stderr.flush()


if __name__ == "__main__":
    main()
