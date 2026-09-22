import time
import numpy as np
import sys
import os

# Add parent directory to path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.vision.detector import ObjectDetector


def run_benchmark(use_qnn: bool, num_runs: int = 20):
    print(f"\n{'='*50}")
    print(f"BENCHMARK: ObjectDetector (QNN={use_qnn})")
    print(f"{'='*50}")

    # Initialize the detector
    detector = ObjectDetector(use_qnn=use_qnn)

    # Create a dummy image (640x640 BGR)
    dummy_frame = np.zeros((640, 640, 3), dtype=np.uint8)

    # Warmup
    print("Warming up model...")
    for _ in range(3):
        detector.detect_objects(dummy_frame)

    print(f"Running {num_runs} consecutive inferences...")
    latencies = []

    for i in range(num_runs):
        start_time = time.perf_counter()
        detector.detect_objects(dummy_frame)
        end_time = time.perf_counter()
        latencies.append((end_time - start_time) * 1000)  # Convert to ms

    avg_latency = sum(latencies) / len(latencies)
    p90_latency = np.percentile(latencies, 90)

    print(f"\nRESULTS (QNN={use_qnn}):")
    print(f"Average Latency: {avg_latency:.2f} ms")
    print(f"90th Percentile: {p90_latency:.2f} ms")
    print(f"FPS: {(1000/avg_latency):.2f}\n")

    return avg_latency


if __name__ == "__main__":
    print("Starting JIRI Flow Hardware Benchmark...")

    # 1. Run CPU Baseline
    cpu_latency = run_benchmark(use_qnn=False)

    # 2. Run QNN/NPU Target
    qnn_latency = run_benchmark(use_qnn=True)

    print(f"{'='*50}")
    print("FINAL COMPARISON:")
    print(f"CPU-Only Latency: {cpu_latency:.2f} ms")
    print(f"Hexagon NPU Latency: {qnn_latency:.2f} ms")

    # Note: On this VM we expect them to be similar due to fallback,
    # but the script structure proves it to the user.
    if qnn_latency < cpu_latency and (cpu_latency - qnn_latency) > 5:
        speedup = cpu_latency / qnn_latency
        print(f"NPU Speedup: {speedup:.2f}x faster!")
    else:
        print(
            "Note: Significant NPU speedup not observed (this is expected if running on a VM without the QNN SDK/Hexagon hardware where both fallback to CPU)."
        )
    print(f"{'='*50}")
