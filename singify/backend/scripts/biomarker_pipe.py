#!/usr/bin/env python3
"""
biomarker_pipe.py — stdin/stdout JSON sidecar for biomarker extraction.

Protocol (same pattern as whisper_server.py):
  STARTUP  → prints {"status":"ready"} to stdout
  REQUEST  → reads one JSON line from stdin: {"text": "..."}
  RESPONSE → prints one JSON line to stdout: {"result": {...}} or {"error":"..."}

Called from singify/backend/src/routes/games/recall.ts after each voice submission.
"""

import sys
import json
import os
import warnings

# Suppress librosa warnings
warnings.filterwarnings('ignore')

# Ensure jiri-flow app is importable from this script location
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
_JIRI_ROOT = os.path.normpath(os.path.join(_THIS_DIR, "../../jiri-flow"))
if _JIRI_ROOT not in sys.path:
    sys.path.insert(0, _JIRI_ROOT)

def _extract_acoustic_features(audio_path: str) -> dict:
    try:
        sys.path.insert(0, os.path.join(_JIRI_ROOT, "venv/lib/python3.12/site-packages"))
        from surfboard.sound import Sound
        sound = Sound(path=audio_path)
        # Extract features using Sound class
        mfcc = sound.extract_mfcc()
        shimmer = sound.extract_shimmer()
        jitter = sound.extract_jitter()
        
        # Taking mean of MFCCs as they are returned as an array
        return {
            "mfcc_mean": float(mfcc.mean()),
            "shimmer": float(shimmer["localShimmer"]),
            "jitter": float(jitter["localJitter"])
        }
    except Exception as e:
        return {"error": str(e)}

def main():
    # Lazy import after path is set
    try:
        from app.speech.biomarker import extract
    except ImportError as e:
        sys.stdout.write(json.dumps({"status": "error", "reason": str(e)}) + "\n")
        sys.stdout.flush()
        sys.exit(1)

    sys.stdout.write(json.dumps({"status": "ready"}) + "\n")
    sys.stdout.flush()

    for raw_line in sys.stdin:
        raw_line = raw_line.strip()
        if not raw_line:
            continue
        try:
            req = json.loads(raw_line)
            text = req.get("text", "")
            audio_path = req.get("audio_path", "")
            
            result = extract(text).to_dict()
            
            # Add acoustic features if audio is provided
            if audio_path and os.path.exists(audio_path):
                acoustic_features = _extract_acoustic_features(audio_path)
                result["acoustic"] = acoustic_features
                
            sys.stdout.write(json.dumps({"result": result}) + "\n")
        except Exception as exc:
            sys.stdout.write(json.dumps({"error": str(exc)}) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()

