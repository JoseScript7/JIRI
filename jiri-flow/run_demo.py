import os
import sys
import time
import threading
import webbrowser
import uvicorn
import argparse
from app.api.server import app as fastapi_app
from app.orchestrator import JiriOrchestrator, check_network_status


def start_server():
    print("[Demo] Starting FastAPI server on port 8000...")
    # Run uvicorn programmatically
    uvicorn.run(fastapi_app, host="0.0.0.0", port=8000, log_level="error")


def main():
    parser = argparse.ArgumentParser(description="JIRI Flow Demo Runner")
    parser.add_argument(
        "--routine",
        type=str,
        default="routines/morning_tea.json",
        help="Path to routine JSON",
    )
    parser.add_argument(
        "--headless-sim",
        action="store_true",
        help="Run offline simulation without webcam",
    )
    args = parser.parse_args()

    # Start FastAPI server in a daemon thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    # Wait for server to boot
    time.sleep(2)

    # Open dashboard in default browser
    dashboard_url = "http://localhost:8000/"
    print(f"[Demo] Opening dashboard in browser: {dashboard_url}")
    try:
        webbrowser.open(dashboard_url)
    except Exception as e:
        print(f"[Demo] Could not open browser automatically: {e}")

    # Check network status (proving offline capability)
    net_status = check_network_status()
    print(
        f"\nNETWORK STATUS: {net_status} — core loop does not require network regardless of this status.\n"
    )

    # Start the orchestrator loop in the main thread
    print(f"[Demo] Starting JIRI Flow Orchestrator with routine: {args.routine}")
    orch = JiriOrchestrator(routine_path=args.routine, headless_sim=args.headless_sim)

    try:
        orch.start()
    except KeyboardInterrupt:
        print("\n[Demo] Shutting down JIRI Flow...")


if __name__ == "__main__":
    main()
