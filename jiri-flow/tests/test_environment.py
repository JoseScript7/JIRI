import sys


def test_imports():
    packages = [
        "qai_hub_models",
        "cv2",  # opencv-python
        "sounddevice",
        "numpy",
        "pydantic",
        "fastapi",
        "uvicorn",
    ]

    all_ok = True
    for pkg in packages:
        try:
            __import__(pkg)
            print(f"[{pkg}] OK")
        except Exception as e:
            print(f"[{pkg}] FAILED: {e}")
            all_ok = False

    # Check onnxruntime explicitly for QNN support
    try:
        import onnxruntime as ort

        print("[onnxruntime] OK")
        providers = ort.get_available_providers()
        if "QNNExecutionProvider" not in providers:
            print(
                "\n*** FLAG: QNN Execution Provider not found or failed to initialize! ***"
            )
            print(
                "Note: onnxruntime-qnn requires Windows ARM64/AMD64 Snapdragon hardware."
            )
            print("Continuing development against the CPU/ONNX fallback.")
            print(
                "************************************************************************\n"
            )
    except ImportError as e:
        print(f"[onnxruntime] FAILED: {e}")
        print("\n*** FLAG: onnxruntime failed to import! ***")
        print("Note: onnxruntime-qnn requires Windows ARM64/AMD64 Snapdragon hardware.")
        print("Continuing development against the CPU/ONNX fallback.")
        print(
            "************************************************************************\n"
        )

    if all_ok:
        print("Base packages imported successfully!")
        sys.exit(0)
    else:
        print("Some base packages failed to import.")
        sys.exit(1)


if __name__ == "__main__":
    test_imports()
