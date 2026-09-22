#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# start-dev.sh
# Launch the Singify backend and frontend dev servers in one terminal.
# Press Ctrl+C to stop both.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Default ports, allow override via env vars
BACKEND_PORT="${PORT:-4004}" # Changed default from 4000 to 4004 to avoid MediCore collision
FRONTEND_PORT="${VITE_PORT:-5175}"

# Kill any leftover processes on our ports
cleanup() {
  echo ""
  echo "🛑 Shutting down…"
  kill -- -$$   2>/dev/null || true
  lsof -ti:$BACKEND_PORT | xargs -r kill -9 2>/dev/null || true
  lsof -ti:$FRONTEND_PORT | xargs -r kill -9 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

echo "🎵 Starting Singify dev environment…"
echo "   Backend  → http://localhost:$BACKEND_PORT"
echo "   Frontend → http://localhost:$FRONTEND_PORT"
echo ""

# Backend (ts-node, background)
(cd "$REPO/backend" && PORT=$BACKEND_PORT npm run dev 2>&1 | sed 's/^/[backend] /') &

# Small pause so backend boots before Vite tries to proxy
sleep 3

# Frontend (Vite, background)
(cd "$REPO/frontend" && VITE_BACKEND_PORT=$BACKEND_PORT npm run dev -- --port $FRONTEND_PORT --strictPort 2>&1 | sed 's/^/[frontend] /') &

# Wait for both
wait
