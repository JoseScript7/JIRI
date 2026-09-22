/**
 * GamePage — "/play/:songId"
 *
 * Full karaoke game loop:
 *  1. Load all songs' lines, build an 8-round queue.
 *  2. LISTEN phase: play audio pre-blank → soft tone for blank → audio post-blank.
 *     POST /api/round/start fires the moment the tone begins.
 *  3. ANSWER phase: simultaneous mic button + word tiles.
 *  4. FEEDBACK phase: replay full line, show result, warm message.
 *  5. After 8 rounds: POST /api/session/:id/end → navigate to /complete.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "../context/SessionContext";

// Welcome audio files (replayed by help button mid-game)
const WELCOME_AUDIO = [
  "/audio/welcome_01.mp3",
  "/audio/welcome_02.mp3",
  "/audio/welcome_03.mp3",
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface SongLine {
  line_id: string;
  start_sec: number;
  end_sec: number;
  full_text: string;
  blank_word: string;
  blank_word_start_sec: number;
  blank_word_end_sec: number;
  distractor_options: string[];
}

interface Song {
  id: string;
  title: string;
  audio_file: string;
  cover_art: string;
  difficulty: string;
  lines: SongLine[];
}

interface SongSummary {
  id: string;
}

interface RoundItem {
  songId: string;
  songTitle: string;
  audioUrl: string;
  line: SongLine;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const MAX_ROUNDS = 8;

// ── Audio helpers (module-level, pure functions) ──────────────────────────────
function playAudioSegment(
  audio: HTMLAudioElement,
  startSec: number,
  endSec: number,
  isCancelled: () => boolean,
): Promise<void> {
  return new Promise<void>((resolve) => {
    const duration = Math.max(0, endSec - startSec) * 1000;
    if (duration === 0) {
      resolve();
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      audio.pause();
      clearInterval(poll);
      clearTimeout(fallback);
      resolve();
    };

    const poll = setInterval(() => {
      if (isCancelled()) {
        finish();
        return;
      }
      if (audio.currentTime >= endSec) finish();
    }, 25);

    const fallback = setTimeout(finish, duration + 2500);

    audio.currentTime = startSec;
    audio.play().catch(() => {
      // Audio not available — use timer-only fallback
      clearInterval(poll);
      clearTimeout(fallback);
      setTimeout(finish, duration);
    });
  });
}

function playBlankTone(durationSec: number): Promise<void> {
  return new Promise<void>((resolve) => {
    if (durationSec <= 0) {
      resolve();
      return;
    }
    try {
      const ac = new AudioContext();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = 880; // Soft A5
      osc.connect(gain);
      gain.connect(ac.destination);

      const fade = Math.min(0.08, durationSec * 0.15);
      gain.gain.setValueAtTime(0, ac.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ac.currentTime + fade);
      gain.gain.setValueAtTime(0.1, ac.currentTime + durationSec - fade);
      gain.gain.linearRampToValueAtTime(0, ac.currentTime + durationSec);

      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + durationSec);

      setTimeout(
        () => {
          try {
            ac.close();
          } catch {
            /* ignore */
          }
          resolve();
        },
        durationSec * 1000 + 80,
      );
    } catch {
      setTimeout(resolve, durationSec * 1000);
    }
  });
}

function playSuccessChime() {
  try {
    const ac = new AudioContext();
    const freqs = [523.25, 659.25, 783.99]; // C5-E5-G5 major arpeggio
    freqs.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ac.destination);
      const t = ac.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
      osc.start(t);
      osc.stop(t + 0.9);
    });
    setTimeout(() => {
      try {
        ac.close();
      } catch {
        /* ignore */
      }
    }, 2500);
  } catch {
    /* ignore if AudioContext unavailable */
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

// ── Main component ─────────────────────────────────────────────────────────────
type GamePhase = "loading" | "listen" | "answering" | "feedback" | "error";
type AudioSubPhase = "before" | "tone" | "after" | "idle";

export default function GamePage() {
  const { songId } = useParams<{ songId: string }>();
  const { sessionId, setSessionId } = useSession();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<GamePhase>("loading");
  const [audioSub, setAudioSub] = useState<AudioSubPhase>("idle");
  const [roundQueue, setRoundQueue] = useState<RoundItem[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [roundId, setRoundId] = useState<string | null>(null);
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctWord, setCorrectWord] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [continueEnabled, setContinueEnabled] = useState(false);
  const [loadError, setLoadError] = useState("");
  // Live backend badge — fetched from /api/health, never hardcoded
  const [whisperBackend, setWhisperBackend] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionIdRef = useRef(sessionId);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // ── Fetch live backend mode from server on mount ─────────────────────────────
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setWhisperBackend(d.whisper_backend ?? "openai"))
      .catch(() => setWhisperBackend("openai"));
  }, []);

  // ── 1. Load all songs → build round queue ───────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // Ensure we have a session
        let sid = sessionIdRef.current;
        if (!sid) {
          const sr = await fetch("/api/session/start", { method: "POST" });
          const sd = (await sr.json()) as { session_id: string };
          sid = sd.session_id;
          setSessionId(sid);
        }

        // Fetch the selected song + full list in parallel
        const [mainRes, listRes] = await Promise.all([
          fetch(`/api/songs/${songId}`),
          fetch("/api/songs"),
        ]);
        if (!mainRes.ok) throw new Error("Song not found");

        const { song: mainSong } = (await mainRes.json()) as { song: Song };
        const { songs: summaries } = (await listRes.json()) as {
          songs: SongSummary[];
        };

        // Fetch other songs' full data (for cycling)
        const otherSongs = await Promise.all(
          summaries
            .filter((s) => s.id !== songId)
            .map((s) =>
              fetch(`/api/songs/${s.id}`)
                .then((r) => r.json())
                .then((d) => d.song as Song),
            ),
        );

        // Build queue: selected song first, then others, cycled to MAX_ROUNDS
        const allItems: RoundItem[] = [
          ...mainSong.lines.map((line) => ({
            songId: mainSong.id,
            songTitle: mainSong.title,
            audioUrl: mainSong.audio_file,
            line,
          })),
          ...otherSongs.flatMap((s) =>
            s.lines.map((line) => ({
              songId: s.id,
              songTitle: s.title,
              audioUrl: s.audio_file,
              line,
            })),
          ),
        ];

        const queue: RoundItem[] = Array.from(
          { length: MAX_ROUNDS },
          (_, i) => allItems[i % allItems.length],
        );

        if (!mounted) return;
        setRoundQueue(queue);
        setPhase("listen");
      } catch (e) {
        if (!mounted) return;
        setLoadError("Gaan load howa nai. Pechha jao.");
        setPhase("error");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [songId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. Listen phase effect ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "listen" || roundQueue.length === 0) return;
    const item = roundQueue[roundIdx];
    if (!item) return;

    let cancelled = false;
    const isCancelled = () => cancelled;

    const audio = new Audio(item.audioUrl);
    audioRef.current = audio;

    // Pre-buffer the audio
    audio.preload = "auto";
    audio.load();

    async function run() {
      const line = item.line;

      // ── Before blank ──────────────────────────────────────────────────────
      setAudioSub("before");
      await playAudioSegment(
        audio,
        line.start_sec,
        line.blank_word_start_sec,
        isCancelled,
      );
      if (isCancelled()) return;

      // ── Blank tone + POST round/start in parallel ─────────────────────────
      setAudioSub("tone");
      const toneDuration = line.blank_word_end_sec - line.blank_word_start_sec;

      // Fire round/start while tone plays (don't block on it)
      (async () => {
        try {
          const sid = sessionIdRef.current;
          const res = await fetch("/api/round/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: sid,
              song_id: item.songId,
              line_id: line.line_id,
            }),
          });
          const data = (await res.json()) as { round_id: string };
          if (!cancelled) setRoundId(data.round_id);
        } catch {
          /* round_id stays null — submit will handle gracefully */
        }
      })();

      await playBlankTone(toneDuration);
      if (isCancelled()) return;

      // ── After blank ───────────────────────────────────────────────────────
      setAudioSub("after");
      await playAudioSegment(
        audio,
        line.blank_word_end_sec,
        line.end_sec,
        isCancelled,
      );
      if (isCancelled()) return;

      // ── Done listening ────────────────────────────────────────────────────
      setAudioSub("idle");
      setWordOptions(shuffle([...line.distractor_options, line.blank_word]));
      setPhase("answering");
    }

    run();

    return () => {
      cancelled = true;
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [phase, roundIdx, roundQueue]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3. Feedback audio replay ────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "feedback" || roundQueue.length === 0) return;
    const item = roundQueue[roundIdx];
    if (!item) return;

    let cancelled = false;
    const isCancelled = () => cancelled;
    const audio = new Audio(item.audioUrl);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.load();

    async function replayFull() {
      const line = item.line;
      await sleep(400); // brief pause before replay
      if (isCancelled()) return;
      await playAudioSegment(audio, line.start_sec, line.end_sec, isCancelled);
      if (!cancelled) setContinueEnabled(true);
    }

    replayFull();

    return () => {
      cancelled = true;
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [phase, roundIdx, roundQueue]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 4. Submit answer ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (word: string, mode: "tap" | "voice") => {
      if (submitting) return;
      setSubmitting(true);

      // Stop ongoing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      const item = roundQueue[roundIdx];

      if (roundId) {
        try {
          const res = await fetch(`/api/round/${roundId}/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ submitted_word: word, input_mode: mode }),
          });
          const data = (await res.json()) as {
            is_correct: boolean;
            correct_word: string;
            latency_ms: number;
          };
          if (data.is_correct) playSuccessChime();
          setIsCorrect(data.is_correct);
          setCorrectWord(data.correct_word);
        } catch {
          // API error — show the line's blank_word as correct and move on warmly
          setIsCorrect(false);
          setCorrectWord(item?.line.blank_word ?? "");
          setContinueEnabled(true);
        }
      } else {
        // round/start never completed — derive result locally
        const correct =
          word.trim().toLowerCase() ===
          (item?.line.blank_word ?? "").toLowerCase();
        if (correct) playSuccessChime();
        setIsCorrect(correct);
        setCorrectWord(item?.line.blank_word ?? "");
        setContinueEnabled(true);
      }

      setSubmitting(false);
      setPhase("feedback");
      setContinueEnabled(false); // feedback audio replay will enable it
    },
    [submitting, roundId, roundIdx, roundQueue],
  );

  // ── 5. Continue to next round ────────────────────────────────────────────────
  const handleContinue = useCallback(async () => {
    if (!continueEnabled) return;
    const isLast = roundIdx >= MAX_ROUNDS - 1;

    if (isLast) {
      const sid = sessionIdRef.current;
      if (sid) {
        try {
          await fetch(`/api/session/${sid}/end`, { method: "POST" });
        } catch {
          /* ok */
        }
      }
      navigate("/complete");
    } else {
      // Reset round state and advance
      setRoundIdx((r) => r + 1);
      setRoundId(null);
      setIsCorrect(null);
      setCorrectWord("");
      setSubmitting(false);
      setContinueEnabled(false);
      setWordOptions([]);
      setPhase("listen");
    }
  }, [continueEnabled, roundIdx, navigate]);

  // ── Render ───────────────────────────────────────────────────────────────────
  const item = roundQueue[roundIdx];

  return (
    <div style={shellStyle}>
      {/* Progress bar + Help button row */}
      {phase !== "loading" && phase !== "error" && (
        <div
          style={{
            width: "100%",
            maxWidth: "680px",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <ProgressBar current={roundIdx} total={MAX_ROUNDS} />
          </div>
          <HelpButton />
        </div>
      )}

      {/* Live inference-backend badge — sourced from /api/health, not hardcoded */}
      {whisperBackend !== null && (
        <div
          style={{
            position: "fixed",
            bottom: "1.2rem",
            right: "1.2rem",
            padding: "0.35rem 0.8rem",
            borderRadius: "9999px",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background:
              whisperBackend === "qnn"
                ? "rgba(139,92,246,0.25)"
                : "rgba(30,41,59,0.8)",
            color: whisperBackend === "qnn" ? "#c4b5fd" : "#94a3b8",
            border:
              whisperBackend === "qnn"
                ? "1px solid rgba(139,92,246,0.5)"
                : "1px solid rgba(148,163,184,0.3)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            cursor: "default",
          }}
          title={`WHISPER_BACKEND=${whisperBackend} (read live from /api/health)`}
        >
          {whisperBackend === "qnn" ? "⚡ NPU · QNN" : "🖥 CPU · Whisper"}
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === "loading" && <LoadingView key="loading" />}
        {phase === "error" && <ErrorView key="error" message={loadError} />}

        {phase === "listen" && item && (
          <ListenView
            key={`listen-${roundIdx}`}
            item={item}
            audioSub={audioSub}
          />
        )}

        {phase === "answering" && item && (
          <AnswerView
            key={`answer-${roundIdx}`}
            item={item}
            wordOptions={wordOptions}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        )}

        {phase === "feedback" && item && (
          <FeedbackView
            key={`feedback-${roundIdx}`}
            item={item}
            isCorrect={isCorrect}
            correctWord={correctWord}
            continueEnabled={continueEnabled}
            isLast={roundIdx >= MAX_ROUNDS - 1}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-views ─────────────────────────────────────────────────────────────────

function LoadingView() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={centreCol}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ fontSize: "3.5rem" }}
      >
        🎵
      </motion.div>
      <p style={{ fontSize: "1.5rem", color: "#4A4A4A", marginTop: "1.5rem" }}>
        Gaan anibo...
      </p>
    </motion.div>
  );
}

function ErrorView({ message }: { message: string }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ ...centreCol, gap: "2rem" }}
    >
      <p style={{ fontSize: "1.5rem", color: "#8B1A1A", textAlign: "center" }}>
        {message}
      </p>
      <button onClick={() => navigate("/songs")} style={backBtnStyle}>
        ← Pechha Jao
      </button>
    </motion.div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <span style={{ fontSize: "1.1rem", color: "#4A4A4A", fontWeight: 500 }}>
          Round {current + 1} / {total}
        </span>
      </div>
      <div
        style={{
          height: "8px",
          background: "#F0D9B5",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "#0D6E6E",
            borderRadius: "999px",
          }}
        />
      </div>
    </div>
  );
}

function ListenView({
  item,
  audioSub,
}: {
  item: RoundItem;
  audioSub: AudioSubPhase;
}) {
  const isPlaying = audioSub !== "idle";
  const label =
    audioSub === "before"
      ? "Gaan xunibo..."
      : audioSub === "tone"
        ? "🎵 Xobdo bicharibo..."
        : audioSub === "after"
          ? "Gaan xunibo..."
          : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      style={{
        ...centreCol,
        flex: 1,
        gap: "2rem",
        width: "100%",
        maxWidth: "680px",
      }}
    >
      <SongHeader title={item.songTitle} />

      {/* Line display */}
      <LineText
        fullText={item.line.full_text}
        blankWord={item.line.blank_word}
        showWord={false}
        phase="listen"
      />

      {/* Waveform */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Waveform active={isPlaying} />
        <motion.p
          key={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "1.3rem",
            color: "#4A4A4A",
            margin: 0,
            fontWeight: 500,
          }}
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  );
}

function AnswerView({
  item,
  wordOptions,
  submitting,
  onSubmit,
}: {
  item: RoundItem;
  wordOptions: string[];
  submitting: boolean;
  onSubmit: (word: string, mode: "tap" | "voice") => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      style={{
        ...centreCol,
        flex: 1,
        gap: "2rem",
        width: "100%",
        maxWidth: "680px",
      }}
    >
      <SongHeader title={item.songTitle} />

      <LineText
        fullText={item.line.full_text}
        blankWord={item.line.blank_word}
        showWord={false}
        phase="answer"
      />

      <p
        style={{
          fontSize: "1.4rem",
          color: "#4A4A4A",
          margin: 0,
          fontWeight: 600,
        }}
      >
        Xahi xobdoto baachodh korok:
      </p>

      {/* Word tiles */}
      <WordTiles
        options={wordOptions}
        disabled={submitting}
        onSelect={(w) => onSubmit(w, "tap")}
      />

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          width: "100%",
          maxWidth: "480px",
        }}
      >
        <div style={{ flex: 1, height: "1.5px", background: "#E0D0B0" }} />
        <span style={{ fontSize: "1rem", color: "#4A4A4A", fontWeight: 500 }}>
          nohoy
        </span>
        <div style={{ flex: 1, height: "1.5px", background: "#E0D0B0" }} />
      </div>

      {/* Mic button */}
      <MicButton disabled={submitting} onWord={(w) => onSubmit(w, "voice")} />
    </motion.div>
  );
}

function FeedbackView({
  item,
  isCorrect,
  correctWord,
  continueEnabled,
  isLast,
  onContinue,
}: {
  item: RoundItem;
  isCorrect: boolean | null;
  correctWord: string;
  continueEnabled: boolean;
  isLast: boolean;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4 }}
      style={{
        ...centreCol,
        flex: 1,
        gap: "2rem",
        width: "100%",
        maxWidth: "680px",
      }}
    >
      <SongHeader title={item.songTitle} />

      {/* Full line with correct word highlighted */}
      <LineText
        fullText={item.line.full_text}
        blankWord={item.line.blank_word}
        showWord
        phase="feedback"
      />

      {/* Result messaging — ALWAYS warm, never negative */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        {/* Correct indicator (only if correct) */}
        <AnimatePresence>
          {isCorrect && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 16 }}
              style={{
                width: "84px",
                height: "84px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0D6E6E, #1A9090)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.8rem",
                boxShadow: "0 6px 24px rgba(13,110,110,0.35)",
              }}
            >
              ✓
            </motion.div>
          )}
        </AnimatePresence>

        {/* Warm affirming message — always shown */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#0D6E6E",
            margin: 0,
            textAlign: "center",
          }}
        >
          Eiya hoise! 🎶
        </motion.p>

        {/* Extra praise only if correct */}
        <AnimatePresence>
          {isCorrect && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: "1.6rem",
                fontWeight: 600,
                color: "#095A5A",
                margin: 0,
                textAlign: "center",
              }}
            >
              Bhal hoise! 🌟
            </motion.p>
          )}
        </AnimatePresence>

        {/* Correct word label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: "1.1rem", color: "#4A4A4A", margin: 0 }}
        >
          Xahi xobdo:{" "}
          <strong style={{ color: "#0D6E6E" }}>{correctWord}</strong>
        </motion.p>
      </div>

      {/* Continue button */}
      <motion.button
        id="continue-btn"
        animate={{
          opacity: continueEnabled ? 1 : 0.45,
          scale: continueEnabled ? 1 : 0.98,
        }}
        whileHover={continueEnabled ? { scale: 1.03 } : {}}
        whileTap={continueEnabled ? { scale: 0.97 } : {}}
        onClick={onContinue}
        disabled={!continueEnabled}
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "1.35rem 2rem",
          background: continueEnabled ? "#0D6E6E" : "#8AABAB",
          color: "#FFFDF7",
          fontSize: "1.75rem",
          fontWeight: 700,
          borderRadius: "1.25rem",
          border: "none",
          cursor: continueEnabled ? "pointer" : "wait",
          boxShadow: continueEnabled
            ? "0 6px 28px rgba(13,110,110,0.35)"
            : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          transition: "background 300ms, box-shadow 300ms",
        }}
      >
        {isLast ? "🏁 Shesh Koru" : "Agoloi Jao →"}
      </motion.button>

      {/* Subtle replay hint while audio plays */}
      {!continueEnabled && (
        <p style={{ fontSize: "1rem", color: "#4A4A4A", margin: 0 }}>
          Gaan xunibo...
        </p>
      )}
    </motion.div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function SongHeader({ title }: { title: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontSize: "1.1rem",
          color: "#4A4A4A",
          margin: "0 0 0.2rem",
          fontWeight: 500,
        }}
      >
        🎵 Gaan
      </p>
      <h2
        style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "#1A1A1A",
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function LineText({
  fullText,
  blankWord,
  showWord,
  phase,
}: {
  fullText: string;
  blankWord: string;
  showWord: boolean;
  phase: "listen" | "answer" | "feedback";
}) {
  const idx = fullText.toLowerCase().indexOf(blankWord.toLowerCase());
  const before = idx === -1 ? fullText : fullText.slice(0, idx);
  const word = idx === -1 ? "" : fullText.slice(idx, idx + blankWord.length);
  const after = idx === -1 ? "" : fullText.slice(idx + blankWord.length);

  const blankEl = (
    <motion.span
      key={String(showWord)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: "inline-block",
        minWidth: `${Math.max(3, blankWord.length)}ch`,
        borderBottom: showWord ? "3px solid #0D6E6E" : "3px solid #CCC",
        color: showWord ? "#0D6E6E" : "#BBBBBB",
        fontWeight: 800,
        paddingBottom: "2px",
        textAlign: "center",
      }}
    >
      {showWord ? word : "_ _ _"}
    </motion.span>
  );

  const fontSize = phase === "feedback" ? "1.85rem" : "1.7rem";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "2px solid #F0D9B5",
        borderRadius: "1.25rem",
        padding: "1.5rem 2rem",
        textAlign: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        width: "100%",
      }}
    >
      <p
        style={{
          fontSize,
          fontWeight: 600,
          color: "#1A1A1A",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {before}
        {blankEl}
        {after}
      </p>
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  const bars = [0.45, 0.75, 0.55, 1.0, 0.7, 0.9, 0.5, 0.65, 0.8];
  return (
    <div
      style={{
        display: "flex",
        gap: "7px",
        alignItems: "center",
        height: "72px",
      }}
    >
      {bars.map((h, i) => (
        <motion.div
          key={i}
          animate={
            active
              ? {
                  scaleY: [h, h * 1.5, h * 0.45, h * 1.3, h],
                  opacity: [0.8, 1, 0.6, 1, 0.8],
                }
              : { scaleY: 0.12, opacity: 0.3 }
          }
          transition={
            active
              ? {
                  duration: 0.65 + i * 0.04,
                  repeat: Infinity,
                  delay: i * 0.07,
                  ease: "easeInOut",
                }
              : { duration: 0.4 }
          }
          style={{
            width: "10px",
            height: "52px",
            borderRadius: "5px",
            background: "linear-gradient(to top, #0D6E6E, #27B0B0)",
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

function WordTiles({
  options,
  disabled,
  onSelect,
}: {
  options: string[];
  disabled: boolean;
  onSelect: (word: string) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "14px",
        width: "100%",
        maxWidth: "540px",
      }}
    >
      {options.map((word, i) => (
        <motion.button
          key={`${word}-${i}`}
          id={`word-tile-${i}`}
          whileHover={!disabled ? { scale: 1.04, borderColor: "#0D6E6E" } : {}}
          whileTap={!disabled ? { scale: 0.96 } : {}}
          onClick={() => !disabled && onSelect(word)}
          disabled={disabled}
          style={{
            padding: "1.1rem 0.75rem",
            background: "white",
            border: "2.5px solid #F0D9B5",
            borderRadius: "1rem",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1A1A1A",
            minHeight: "72px",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            transition: "border-color 150ms, background 150ms",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {word}
        </motion.button>
      ))}
    </div>
  );
}

function MicButton({
  onWord,
  disabled,
}: {
  onWord: (w: string) => void;
  disabled: boolean;
}) {
  const [state, setState] = useState<"idle" | "recording" | "processing">(
    "idle",
  );
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleClick = async () => {
    if (state !== "idle" || disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setState("processing");

        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const fd = new FormData();
          fd.append("audio", blob, "rec.webm");

          // Whisper on CPU can take several seconds — wait patiently
          const res = await fetch("/api/stt", { method: "POST", body: fd });
          const data = (await res.json()) as {
            transcribed_word: string;
            full_text?: string;
          };

          console.log("[MicButton] STT result:", data);
          setState("idle");
          // Always call onWord — empty string triggers warm "unrecognised" flow
          onWord(data.transcribed_word ?? "");
        } catch (err) {
          console.error("[MicButton] STT fetch error:", err);
          setState("idle");
          // Still call onWord with empty so the round completes warmly
          onWord("");
        }
      };

      recorder.start();
      setState("recording");
      // Auto-stop after 4 seconds
      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 4000);
    } catch {
      setState("idle");
    }
  };

  const bg =
    state === "recording"
      ? "#8B1A1A"
      : state === "processing"
        ? "#095A5A"
        : "#0D6E6E";

  const icon = state === "idle" ? "🎤" : state === "recording" ? "⏺" : "⏳";

  const sublabel =
    state === "idle"
      ? "Mik (Bolibo)"
      : state === "recording"
        ? "Xunixa ase..."
        : "Bhabibo...";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.6rem",
      }}
    >
      <motion.button
        id="mic-btn"
        animate={
          state === "recording"
            ? {
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 4px 20px rgba(139,26,26,0.4)",
                  "0 8px 32px rgba(139,26,26,0.65)",
                  "0 4px 20px rgba(139,26,26,0.4)",
                ],
              }
            : {}
        }
        transition={
          state === "recording" ? { duration: 0.7, repeat: Infinity } : {}
        }
        onClick={handleClick}
        disabled={disabled || state === "processing"}
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: bg,
          border: "none",
          color: "#FFFDF7",
          fontSize: "2.3rem",
          cursor:
            state === "processing"
              ? "wait"
              : disabled
                ? "not-allowed"
                : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(13,110,110,0.35)",
          transition: "background 300ms",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {icon}
      </motion.button>
      <span style={{ fontSize: "1.05rem", color: "#4A4A4A", fontWeight: 500 }}>
        {sublabel}
      </span>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const shellStyle: React.CSSProperties = {
  minHeight: "100dvh",
  background: "linear-gradient(160deg, #FDF6EC 0%, #F9EDDA 55%, #F0D9B5 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "1.5rem 1.25rem 2.5rem",
  gap: "1.5rem",
};

const centreCol: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1.75rem",
};

const backBtnStyle: React.CSSProperties = {
  padding: "1rem 2rem",
  background: "#0D6E6E",
  color: "#FFFDF7",
  border: "none",
  borderRadius: "1rem",
  fontSize: "1.35rem",
  fontWeight: 700,
  cursor: "pointer",
};

// ── HelpButton ────────────────────────────────────────────────────────────────
/**
 * Small floating help button in the top-right of the game progress row.
 * Tapping it replays the welcome narration audio sequence so a confused
 * patient can hear the instructions again without leaving the game.
 */
function HelpButton() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const idxRef = useRef(0);

  const stop = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.src = "";
    audioRef.current = null;
    setPlaying(false);
    idxRef.current = 0;
  };

  const playIdx = (i: number) => {
    if (i >= WELCOME_AUDIO.length) {
      stop();
      return;
    }
    idxRef.current = i;
    const a = new Audio(WELCOME_AUDIO[i]);
    audioRef.current = a;
    a.onended = () => playIdx(i + 1);
    a.onerror = () => playIdx(i + 1); // placeholder file — skip gracefully
    a.play().catch(() => playIdx(i + 1));
  };

  const handleReplay = () => {
    stop();
    setPlaying(true);
    playIdx(0);
    setOpen(false);
  };

  // Clean up on unmount
  useEffect(() => () => stop(), []);

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {/* Trigger button */}
      <motion.button
        id="help-btn"
        aria-label="Replay welcome instructions"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: open ? "#0D6E6E" : "white",
          border: "2px solid #0D6E6E",
          color: open ? "white" : "#0D6E6E",
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          transition: "background 200ms, color 200ms",
        }}
      >
        ?
      </motion.button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute",
              top: "56px",
              right: 0,
              background: "white",
              border: "1.5px solid #F0D9B5",
              borderRadius: "1rem",
              padding: "1rem 1.25rem",
              minWidth: "220px",
              boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#1A1A1A",
                margin: 0,
              }}
            >
              Sahayta Lagibo?
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#4A4A4A",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Welcome narration punar xunibo.
            </p>
            <button
              id="help-replay-btn"
              onClick={handleReplay}
              style={{
                background: playing ? "#095A5A" : "#0D6E6E",
                color: "#FFFDF7",
                border: "none",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {playing ? "⏸ Xunixa ase…" : "🔊 Aaru ebar xuno"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
