/**
 * WelcomePage — "/" route
 *
 * Elder-friendly full-screen welcome for Singify.
 * Tablet-first layout (768px+ optimal).
 *
 * Features:
 *  - Animated avatar with gentle idle breathing
 *  - Assamese narration lines, karaoke-highlighted as audio plays
 *  - Sequential audio playback (welcome_01 → 02 → 03), auto-starts on mount
 *  - Replay button restarts the audio sequence
 *  - Single CTA button: calls POST /api/session/start, stores session_id, navigates to /songs
 */

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

// ── Editable content ─────────────────────────────────────────────────────────
const WELCOME_LINES = [
  "Singify loi swagatam!",
  "Apuni ejon gaan xunibo.",
  "Gaan tor majot eta xobdo bicharibo lagibo.",
];

const AUDIO_FILES = [
  "/audio/welcome_01.mp3",
  "/audio/welcome_02.mp3",
  "/audio/welcome_03.mp3",
];
// ─────────────────────────────────────────────────────────────────────────────

type PlayState = "idle" | "playing" | "done" | "error";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { setSessionId } = useSession();

  const [activeLineIndex, setActiveLineIndex] = useState<number>(-1);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [starting, setStarting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentLineRef = useRef<number>(-1);

  // ── Audio playback ──────────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
  }, []);

  const playLine = useCallback((index: number) => {
    if (index >= AUDIO_FILES.length) {
      setActiveLineIndex(-1);
      setPlayState("done");
      currentLineRef.current = -1;
      return;
    }

    currentLineRef.current = index;
    setActiveLineIndex(index);
    setPlayState("playing");

    const audio = new Audio(AUDIO_FILES[index]);
    audioRef.current = audio;

    audio.onended = () => {
      // Small gap between lines for readability
      setTimeout(() => playLine(index + 1), 400);
    };

    audio.onerror = () => {
      // File missing (placeholder) — advance gracefully after a display delay
      setTimeout(() => playLine(index + 1), 1800);
    };

    audio.play().catch(() => {
      // Autoplay blocked — show each line briefly and move on
      setTimeout(() => playLine(index + 1), 1800);
    });
  }, []);

  const startSequence = useCallback(() => {
    stopAudio();
    setPlayState("idle");
    setActiveLineIndex(-1);
    // Tiny delay so the reset renders before playing starts
    setTimeout(() => playLine(0), 80);
  }, [stopAudio, playLine]);

  // Auto-play on mount
  useEffect(() => {
    startSequence();
    return () => stopAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Session start ───────────────────────────────────────────────────────────
  const handleStart = async () => {
    if (starting) return;
    setStarting(true);
    setApiError(null);
    stopAudio();

    try {
      const res = await fetch("/api/session/start", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { session_id: string };
      setSessionId(data.session_id);
      navigate("/songs");
    } catch {
      setApiError("Connection failed. Please try again.");
      setStarting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(160deg, #FDF6EC 0%, #F9EDDA 55%, #F0D9B5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "2.5rem 1.5rem",
        gap: "2rem",
      }}
    >
      {/* ── Avatar section ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          paddingTop: "1rem",
        }}
      >
        <Avatar playState={playState} />

        {/* Replay button — appears after sequence ends */}
        <AnimatePresence>
          {(playState === "done" || playState === "error") && (
            <motion.button
              id="replay-narration-btn"
              key="replay"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              onClick={startSequence}
              aria-label="Play narration again"
              style={{
                background: "transparent",
                border: "2.5px solid #0D6E6E",
                borderRadius: "999px",
                padding: "0.6rem 1.8rem",
                color: "#0D6E6E",
                fontSize: "1.25rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "background 200ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(13,110,110,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: "1.5rem" }}>🔊</span> Aaru ebar xuno
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Narration lines (karaoke highlight) ────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          width: "100%",
          maxWidth: "720px",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {WELCOME_LINES.map((line, i) => (
          <NarrationLine
            key={i}
            text={line}
            index={i}
            activeIndex={activeLineIndex}
          />
        ))}
      </div>

      {/* ── CTA button ─────────────────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          paddingBottom: "1rem",
        }}
      >
        <AnimatePresence>
          {apiError && (
            <motion.p
              key="err"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                color: "#8B1A1A",
                fontSize: "1.2rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              {apiError}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          id="start-playing-btn"
          onClick={handleStart}
          disabled={starting}
          whileHover={{ scale: starting ? 1 : 1.03 }}
          whileTap={{ scale: starting ? 1 : 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            width: "100%",
            padding: "1.4rem 2rem",
            background: starting ? "#095A5A" : "#0D6E6E",
            color: "#FFFDF7",
            fontSize: "1.75rem",
            fontWeight: 700,
            borderRadius: "1.25rem",
            border: "none",
            cursor: starting ? "wait" : "pointer",
            boxShadow: "0 6px 28px rgba(13, 110, 110, 0.40)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            letterSpacing: "-0.01em",
            transition: "background 200ms, box-shadow 200ms",
          }}
        >
          {starting ? (
            <>
              <SpinnerIcon />
              Ahe...
            </>
          ) : (
            <>
              <span style={{ fontSize: "2rem" }}>🎵</span>
              Khela Suru Koru
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Animated mascot avatar */
function Avatar({ playState }: { playState: PlayState }) {
  const isTalking = playState === "playing";

  return (
    <div style={{ position: "relative", width: "160px", height: "160px" }}>
      {/* Soft glow ring behind avatar */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: "-12px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(13,110,110,0.25) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Main avatar circle — breathing animation */}
      <motion.div
        animate={
          isTalking
            ? { scale: [1, 1.05, 1, 1.05, 1], y: [0, -4, 0, -4, 0] }
            : { scale: [1, 1.025, 1], y: [0, -5, 0] }
        }
        transition={
          isTalking
            ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          position: "relative",
          zIndex: 1,
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "linear-gradient(145deg, #1A9090, #0D6E6E)",
          boxShadow:
            "0 8px 32px rgba(13,110,110,0.35), inset 0 -4px 10px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {/* Eyes */}
        <div style={{ display: "flex", gap: "22px", marginBottom: "4px" }}>
          <Eye blinking={!isTalking} />
          <Eye blinking={!isTalking} />
        </div>

        {/* Mouth — changes when talking */}
        <MouthShape talking={isTalking} />
      </motion.div>
    </div>
  );
}

function Eye({ blinking }: { blinking: boolean }) {
  return (
    <motion.div
      animate={blinking ? { scaleY: [1, 1, 0.1, 1, 1] } : { scaleY: 1 }}
      transition={
        blinking
          ? {
              duration: 3.5,
              repeat: Infinity,
              times: [0, 0.45, 0.5, 0.55, 1],
              ease: "easeInOut",
            }
          : {}
      }
      style={{
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        background: "#FFFDF7",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
        transformOrigin: "center",
      }}
    />
  );
}

function MouthShape({ talking }: { talking: boolean }) {
  return (
    <motion.div
      animate={
        talking
          ? { scaleY: [0.5, 1.2, 0.5], scaleX: [1, 0.85, 1] }
          : { scaleY: 0.6, scaleX: 1 }
      }
      transition={
        talking ? { duration: 0.35, repeat: Infinity } : { duration: 0.3 }
      }
      style={{
        width: "34px",
        height: "14px",
        borderRadius: "0 0 20px 20px",
        background: "#FFFDF7",
        transformOrigin: "top center",
        boxShadow: "inset 0 2px 5px rgba(0,0,0,0.15)",
      }}
    />
  );
}

/** A single narration line with karaoke-style highlight */
function NarrationLine({
  text,
  index,
  activeIndex,
}: {
  text: string;
  index: number;
  activeIndex: number;
}) {
  const isActive = activeIndex === index;
  const wasDone = activeIndex > index;

  return (
    <motion.div
      animate={{
        scale: isActive ? 1.04 : 1,
        opacity: isActive ? 1 : wasDone ? 0.55 : 0.4,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        padding: "1.1rem 2rem",
        borderRadius: "1.25rem",
        textAlign: "center",
        background: isActive
          ? "linear-gradient(135deg, rgba(13,110,110,0.14), rgba(13,110,110,0.06))"
          : "transparent",
        border: isActive
          ? "2.5px solid rgba(13,110,110,0.45)"
          : "2.5px solid transparent",
        transition: "background 300ms, border 300ms",
        width: "100%",
      }}
    >
      <p
        style={{
          fontSize: isActive ? "2rem" : "1.7rem",
          fontWeight: isActive ? 700 : 500,
          color: isActive ? "#0D6E6E" : "#4A4A4A",
          margin: 0,
          lineHeight: 1.4,
          transition: "font-size 200ms, color 200ms, font-weight 200ms",
          letterSpacing: "-0.01em",
        }}
      >
        {isActive && (
          <motion.span
            style={{ marginRight: "0.5rem", display: "inline-block" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            🎵
          </motion.span>
        )}
        {text}
      </p>
    </motion.div>
  );
}

/** Minimal inline spinner */
function SpinnerIcon() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      style={{ display: "inline-block", fontSize: "1.6rem" }}
    >
      ⏳
    </motion.span>
  );
}
