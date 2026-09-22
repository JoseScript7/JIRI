#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# test_stt_e2e.sh
#
# End-to-end test for the Whisper STT pipeline.
# Runs against a live backend on $BASE_URL (default: http://localhost:4000).
#
# Usage:
#   bash test_stt_e2e.sh                # uses port 4000
#   BASE_URL=http://localhost:4001 bash test_stt_e2e.sh
#
# Requires:  curl, python3, ffmpeg
# ─────────────────────────────────────────────────────────────────────────────
set -uo pipefail

BASE_URL="${BASE_URL:-http://localhost:4000}"
PASS=0
FAIL=0

red()    { printf "\033[0;31m%s\033[0m\n" "$*"; }
green()  { printf "\033[0;32m%s\033[0m\n" "$*"; }
yellow() { printf "\033[0;33m%s\033[0m\n" "$*"; }
header() { printf "\n\033[1;36m── %s ──\033[0m\n" "$*"; }

assert_eq() {
  local label="$1" expected="$2" actual="$3"
  if [[ "$actual" == "$expected" ]]; then
    green "  ✓ $label"
    ((PASS++))
  else
    red   "  ✗ $label"
    red   "    expected: $expected"
    red   "    actual:   $actual"
    ((FAIL++))
  fi
}

assert_contains() {
  local label="$1" needle="$2" haystack="$3"
  if echo "$haystack" | grep -q "$needle"; then
    green "  ✓ $label"
    ((PASS++))
  else
    red "  ✗ $label (missing '$needle')"
    red "    actual: $haystack"
    ((FAIL++))
  fi
}

# ── 0. Health check ───────────────────────────────────────────────────────────
header "0. Backend health"
HEALTH=$(curl -sf "$BASE_URL/api/health" || echo "FAIL")
assert_contains "GET /api/health → {status:ok}" '"ok"' "$HEALTH"

# ── 1. STT with empty multipart (no audio) ───────────────────────────────────
header "1. POST /api/stt — no file → 400"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/stt" || true)
assert_eq "HTTP 400 for missing audio" "400" "$STATUS"

# ── 2. STT with a synthetic 440Hz tone WAV ───────────────────────────────────
header "2. POST /api/stt — synthetic audio → transcription response"

TMPWAV=$(mktemp /tmp/stt_test_XXXX.wav)
# Generate 2s of 440 Hz sine wave (A4) as WAV via ffmpeg
ffmpeg -f lavfi -i "sine=frequency=440:duration=2" -ar 16000 "$TMPWAV" -y -loglevel quiet

RESULT=$(curl -sf -X POST "$BASE_URL/api/stt" \
  -F "audio=@${TMPWAV};type=audio/wav" 2>&1 || echo '{"error":"curl failed"}')

rm -f "$TMPWAV"

assert_contains "Response has 'transcribed_word' field" '"transcribed_word"' "$RESULT"
assert_contains "Response has 'mock:false'"             '"mock":false'       "$RESULT"

echo "  STT result: $RESULT"

# ── 3. Full round lifecycle with voice input ──────────────────────────────────
header "3. Full round lifecycle — voice mode"

# 3a. Create session
SESSION=$(curl -sf -X POST "$BASE_URL/api/session/start")
SID=$(echo "$SESSION" | python3 -c "import sys,json; print(json.load(sys.stdin)['session_id'])")
echo "  session_id: $SID"
assert_contains "session_id is UUID" "-" "$SID"

# 3b. Fetch song to get a real line_id
SONGS=$(curl -sf "$BASE_URL/api/songs")
SONG_ID=$(echo "$SONGS"  | python3 -c "import sys,json; print(json.load(sys.stdin)['songs'][0]['id'])")
LINE_ID=$(curl -sf "$BASE_URL/api/songs/$SONG_ID" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['song']['lines'][0]['line_id'])")
BLANK=$(curl -sf "$BASE_URL/api/songs/$SONG_ID" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['song']['lines'][0]['blank_word'])")
echo "  song_id=$SONG_ID  line_id=$LINE_ID  blank_word=$BLANK"

# 3c. Start round
ROUND=$(curl -sf -X POST "$BASE_URL/api/round/start" \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"$SID\",\"song_id\":\"$SONG_ID\",\"line_id\":\"$LINE_ID\"}")
RID=$(echo "$ROUND" | python3 -c "import sys,json; print(json.load(sys.stdin)['round_id'])")
echo "  round_id: $RID"
assert_contains "round_id is UUID" "-" "$RID"

# 3d. Submit voice answer with exact blank word → should be is_correct:true
ANSWER=$(curl -sf -X POST "$BASE_URL/api/round/$RID/answer" \
  -H "Content-Type: application/json" \
  -d "{\"submitted_word\":\"$BLANK\",\"input_mode\":\"voice\"}")
echo "  answer response: $ANSWER"
assert_contains "is_correct field present" '"is_correct"' "$ANSWER"
assert_contains "exact match → is_correct:true" '"is_correct":true' "$ANSWER"

# 3e. Submit empty string voice (unrecognised Whisper output) — should NOT 400
header "4. Empty voice submission (unrecognised Whisper output)"
ROUND2=$(curl -sf -X POST "$BASE_URL/api/round/start" \
  -H "Content-Type: application/json" \
  -d "{\"session_id\":\"$SID\",\"song_id\":\"$SONG_ID\",\"line_id\":\"$LINE_ID\"}" 2>/dev/null || echo '{}')
RID2=$(echo "$ROUND2" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('round_id','SKIP'))" 2>/dev/null || echo "SKIP")

if [[ "$RID2" != "SKIP" && "$RID2" != "" ]]; then
  EMPTY_ANS=$(curl -s -X POST "$BASE_URL/api/round/$RID2/answer" \
    -H "Content-Type: application/json" \
    -d '{"submitted_word":"","input_mode":"voice"}')
  STATUS2=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/round/$RID2/answer" \
    -H "Content-Type: application/json" \
    -d '{"submitted_word":"","input_mode":"voice"}' 2>/dev/null || echo "0")
  echo "  empty voice answer response: $EMPTY_ANS"
  # Empty voice should return 200 (is_correct:false), not 400
  assert_contains "empty voice → is_correct:false" '"is_correct":false' "$EMPTY_ANS"
else
  yellow "  ⚠ Skipping empty-voice test (session may be ended)"
fi

# ── 5. Fuzzy match tests (direct) ────────────────────────────────────────────
header "5. Fuzzy voice match — near-miss words"

check_voice_match() {
  local submitted="$1" target="$2" expect="$3"
  # Start a fresh round each time — reuse existing session
  local R
  R=$(curl -sf -X POST "$BASE_URL/api/round/start" \
    -H "Content-Type: application/json" \
    -d "{\"session_id\":\"$SID\",\"song_id\":\"$SONG_ID\",\"line_id\":\"$LINE_ID\"}" 2>/dev/null || echo '{}')
  local RID3
  RID3=$(echo "$R" | python3 -c "import sys,json; print(json.load(sys.stdin).get('round_id',''))" 2>/dev/null || echo "")
  if [[ -z "$RID3" ]]; then
    yellow "  ⚠ Could not create round for fuzzy test ($submitted vs $target) — skipping"
    return
  fi
  local ANS
  ANS=$(curl -sf -X POST "$BASE_URL/api/round/$RID3/answer" \
    -H "Content-Type: application/json" \
    -d "{\"submitted_word\":\"$submitted\",\"input_mode\":\"voice\"}" 2>/dev/null || echo '{}')
  local GOT
  GOT=$(echo "$ANS" | python3 -c "import sys,json; d=json.load(sys.stdin); print('true' if d.get('is_correct') else 'false')" 2>/dev/null || echo "false")
  assert_eq "voice '$submitted' vs '$target' → $expect" "$expect" "$GOT"
}

# These test the fuzzyMatchVoice logic
check_voice_match "$BLANK"   "$BLANK" "true"   # exact → true
check_voice_match "${BLANK}x" "$BLANK" "true"  # dist=1 → true

# ── Summary ───────────────────────────────────────────────────────────────────
header "Results"
echo "  Passed: $PASS"
echo "  Failed: $FAIL"
if [[ "$FAIL" -eq 0 ]]; then
  green "All tests passed! ✓"
  exit 0
else
  red "$FAIL test(s) failed"
  exit 1
fi
