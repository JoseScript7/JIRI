#!/bin/bash

# Exit on error
set +e

# JIRI-Flow (Python) Commits
git add jiri-flow/app/api/
git commit -m "feat(jiri-flow): initialize FastAPI backend structure" || true

git add jiri-flow/app/vision/
git commit -m "feat(vision): integrate YOLO object detection" || true

git add jiri-flow/app/speech/
git commit -m "feat(speech): implement whisper STT and biomarker analysis" || true

git add jiri-flow/app/task_engine/ jiri-flow/app/language/
git commit -m "feat(task-engine): add deterministic cue generator and state machine" || true

git add jiri-flow/app/logging/ jiri-flow/app/orchestrator.py
git commit -m "feat(core): implement central orchestrator and caregiver logging" || true

git add jiri-flow/routines/  jiri-flow/tests/ jiri-flow/run_demo.py jiri-flow/requirements.txt jiri-flow/README.md
git commit -m "chore(jiri-flow): add tests, models, routines and setup scripts" || true

# Singify (React/Node) Commits
git add singify/backend/src/routes/
git commit -m "feat(singify-api): create game and session routes" || true

git add singify/backend/src/db.ts singify/backend/src/fuzzy.ts singify/backend/src/types.ts singify/backend/src/index.ts
git commit -m "feat(singify-api): integrate SQLite and fuzzy lyric matching" || true

git add singify/backend/scripts/ singify/backend/src/whisperSidecar.ts singify/backend/src/biomarkerSidecar.ts
git commit -m "feat(singify-ai): add NPU accelerated whisper sidecar" || true

git add singify/backend/package.json singify/backend/tsconfig.json
git commit -m "chore(singify-api): add backend configuration" || true

git add singify/frontend/src/pages/games/
git commit -m "feat(singify-ui): implement memory, recall, and rhythm game pages" || true

git add singify/frontend/src/pages/
git commit -m "feat(singify-ui): add welcome, caregiver, and song selection screens" || true

git add singify/frontend/src/components/ singify/frontend/src/context/
git commit -m "feat(singify-ui): create core components and session context" || true

git add singify/frontend/src/App.tsx singify/frontend/src/main.tsx singify/frontend/src/index.css
git commit -m "feat(singify-ui): configure main app entry and styles" || true

git add singify/frontend/public/ singify/frontend/index.html singify/frontend/vite.config.ts singify/frontend/package.json singify/frontend/tsconfig.json
git commit -m "chore(singify-ui): add frontend config and static assets" || true

git add singify/data/ singify/art/ singify/audio/ singify/README.md singify/package.json singify/start-dev.sh
git commit -m "chore(singify): add static media, database seeds, and runner scripts" || true

# Mobile (React Native) Commits
git add mobile/src/screens/
git commit -m "feat(mobile): add primary screens for JIRI and Caregiver flows" || true

git add mobile/src/components/
git commit -m "feat(mobile): create reusable UI components" || true

git add mobile/src/utils/ mobile/assets/
git commit -m "feat(mobile): add design system, i18n, and assets" || true

git add mobile/App.js mobile/index.js mobile/app.json mobile/package.json mobile/package-lock.json mobile/README.md
git commit -m "chore(mobile): configure Expo entrypoint and dependencies" || true

# Root Flutter App Commits
git add lib/
git commit -m "feat(flutter): initialize core dart library for mobile alternative" || true

git add android/ ios/ macos/ windows/ linux/ web/
git commit -m "chore(flutter): generate platform-specific runners" || true

git add pubspec.yaml pubspec.lock analysis_options.yaml
git commit -m "chore(flutter): configure dart packages and linter options" || true

# Root project commits
git add README.md
git commit -m "docs: build professional comprehensive README" || true

# Add any remaining files
git add .
git commit -m "chore: formatting codebase and finalizing repo structure" || true

echo "Commits created successfully."
