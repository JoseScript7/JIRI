#!/usr/bin/env python3
"""
whisper_server.py — Persistent Whisper transcription sidecar.

Protocol (newline-delimited JSON over stdin/stdout):
  ← {"status": "ready", "model": "base"}          (startup, once)
  → {"path": "/tmp/audio.webm", "language": "as"} (request, per transcription)
  ← {"text": "matixi", "language": "as"}           (response)
  ← {"text": "", "error": "..."}                   (on failure)

The sidecar loads the model ONCE at startup. All subsequent transcriptions
reuse the in-memory model — no reload latency.
"""
import sys
import json
import os
import traceback


def main() -> None:
    model_name = os.environ.get("WHISPER_MODEL", "base")

    # ── Import whisper ──────────────────────────────────────────────────────────
    try:
        import whisper          # type: ignore
    except ImportError:
        _emit({"status": "error",
               "error": "openai-whisper not installed. Run: pip install openai-whisper"})
        sys.exit(1)

    # ── Load model once ─────────────────────────────────────────────────────────
    _log(f"Loading model '{model_name}'…")
    try:
        model = whisper.load_model(model_name)
    except Exception as exc:
        _emit({"status": "error", "error": str(exc)})
        sys.exit(1)

    # Probe supported languages so we can validate the hint later
    supported_langs: set[str] = set(whisper.tokenizer.LANGUAGES.keys())

    _log(f"Model '{model_name}' ready. Supported languages: {len(supported_langs)}")
    _emit({"status": "ready", "model": model_name})

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
        lang_hint: str | None = req.get("language") or None   # "" → None

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
            kwargs: dict = {"fp16": False, "verbose": False}

            if lang_hint:
                if lang_hint in supported_langs:
                    kwargs["language"] = lang_hint
                else:
                    _log(f"Language '{lang_hint}' not in Whisper LANGUAGES — auto-detecting")

            result = model.transcribe(audio_path, **kwargs)
            text: str     = (result.get("text") or "").strip()
            detected: str = result.get("language", "unknown")

            _emit({"text": text, "language": detected})

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
    sys.stderr.write(f"[whisper_server] {msg}\n")
    sys.stderr.flush()


if __name__ == "__main__":
    main()
