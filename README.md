# JIRI 

**An On-Device Cognitive Task Guidance Assistant & Elder-Friendly Companion Platform**

JIRI is a comprehensive ecosystem designed for dementia care and elder assistance. Running primarily on edge devices, it combines real-time vision and speech intelligence with interactive music and cognitive games to provide gentle, non-intrusive guidance through daily routines.

Built for the Snapdragon AI Hub, JIRI guarantees privacy by processing visual and audio data completely offline while offering caregivers a unified dashboard to track physical routines and cognitive engagement.

---

## 🌟 Overview

The JIRI ecosystem consists of three unified modules:

1. **JIRI Flow** — A localized deterministic task-state engine powered by Qualcomm AI Hub models. It observes daily routines through camera/microphone and provides single, gentle next-step cues for patients with dementia.
2. **Singify** — An interactive, elder-friendly karaoke and cognitive games hub featuring Assamese-language content, fuzzy-lyric recall, and NPU-accelerated Whisper voice processing.
3. **JIRI Mobile** — An Expo React Native application that wraps both JIRI Flow and Singify into a seamless mobile experience, featuring a Caregiver Dashboard that unifies physical routine signals and cognitive milestones.

---

## ✨ Key Features

- **Edge AI Room Analysis** — Uses localized YOLO object detection (or YOLO-World via `qai_hub_models`) to continuously monitor objects and activities in the room without uploading frames to the cloud.
- **On-Device Voice Prompts** — NPU-accelerated speech-to-text (Whisper) processes patient responses instantly, adjusting cues based on verbal feedback.
- **Deterministic Cue Generator** — State-machine driven logic ensures the patient only ever receives *one* gentle instruction at a time to prevent cognitive overload.
- **Singify Companion App** — Built-in music therapy via karaoke and memory games (Fill-in-the-Blanks, Picture Match, Rhythm games) to stimulate cognitive functions.
- **Caregiver Dashboard** — Unified timeline merging physical routine progress with cognitive game accuracy/latency scores, providing a holistic view of the elder's wellbeing.

---

## 🏗 Architecture & Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Mobile App** | Expo (React Native), `react-native-webview` |
| **Frontend (Singify)** | React, Vite, TypeScript, Tailwind CSS, Framer Motion |
| **Backend (Singify)** | Node.js, Express, TypeScript, SQLite (`better-sqlite3`) |
| **Backend (JIRI Flow)** | Python 3.12, FastAPI, Uvicorn |
| **AI / ML** | ONNX Runtime (`QNNExecutionProvider`), `qai-hub-models`, Whisper, YOLOv8 |

---

## 🚀 Quick Start

### 1. JIRI Flow (AI Task Guidance)
The core orchestrator runs locally using Python.
```bash
cd jiri-flow
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Launch Dashboard + Vision Tracker + AI Cue Generator
python run_demo.py
```
*(Runs locally on `http://localhost:8000`)*

### 2. Singify (Music & Cognitive Games)
Start both the React frontend and Node.js backend concurrently.
```bash
cd singify
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5173`, Backend on `http://localhost:4000`)*

### 3. JIRI Mobile (Unified App)
Wrap it all into a single native mobile interface.
```bash
cd mobile
npm install
npm run start
```
*(Use the Expo Go app or press `i`/`a` to launch in the simulator)*

---

## 📂 Repository Structure

```text
.
├── jiri-flow/       # Python orchestrator, Vision/Speech pipelines, FastAPI dashboard
├── singify/         # React + Node.js karaoke and memory games hub
├── mobile/          # Expo React Native wrapper unifying the UI
├── lib/             # Legacy/Alternative Flutter implementation
└── README.md        # You are here
```

---

## 🧠 Qualcomm AI Hub / Snapdragon Integration

This platform heavily leverages local NPU hardware for privacy-preserving elder care:
- **Accelerated Whisper sidecar**: Uses `qai_hub_models.models.whisper_tiny_en` configured with ONNX Runtime (`QNNExecutionProvider`).
- **Edge Vision**: Fully local object detection loops designed to eliminate cloud dependencies and latency.

---

## 📜 License

Released under the [MIT License](./mobile/LICENSE).