/**
 * SongSelectionPage — "/songs"
 * Fetches GET /api/songs and renders a 2-column tablet grid of tappable cards.
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SongSummary {
  id: string;
  title: string;
  cover_art: string;
  difficulty: string;
}

// Per-song gradient fallback when cover art image is missing
const CARD_GRADIENTS = [
  "linear-gradient(145deg, #0D6E6E, #095A5A)",
  "linear-gradient(145deg, #8B6914, #6B4F0E)",
  "linear-gradient(145deg, #8B1A1A, #6F1212)",
];

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "সহজ", // Sahoz
  medium: "মধ্যম", // Madhyam
  hard: "কঠিন", // Kothin
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "#0D6E6E",
  medium: "#8B6914",
  hard: "#8B1A1A",
};

export default function SongSelectionPage() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<SongSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/songs")
      .then((r) => r.json())
      .then((d: { songs: SongSummary[] }) => setSongs(d.songs))
      .catch(() => setError("Gaan load howa nai. Punar koribe."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={fullPageStyle}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: "3.5rem" }}
        >
          🎵
        </motion.div>
        <p
          style={{ fontSize: "1.5rem", color: "#4A4A4A", marginTop: "1.5rem" }}
        >
          Gaan anibo...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={fullPageStyle}>
        <p
          style={{ fontSize: "1.5rem", color: "#8B1A1A", textAlign: "center" }}
        >
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(160deg, #FDF6EC 0%, #F9EDDA 55%, #F0D9B5 100%)",
        padding: "2.5rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: "center" }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎶</div>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#0D6E6E",
            margin: 0,
          }}
        >
          Gaan Bolok
        </h1>
        <p
          style={{ fontSize: "1.25rem", color: "#4A4A4A", marginTop: "0.5rem" }}
        >
          Apunar gaan baachodh korok
        </p>
      </motion.div>

      {/* Cognitive Games Section */}
      <div style={{ width: "100%", maxWidth: "720px", marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            color: "#0D6E6E",
            marginBottom: "1rem",
            paddingLeft: "0.5rem",
          }}
        >
          মগজুৰ খেল (Brain Games)
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <GameCard
            title="শব্দ মনত ৰখা (Word Memory)"
            icon="🧠"
            onClick={() => navigate("/games/memory")}
            delay={0.1}
          />
          <GameCard
            title="খালী ঠাই পূৰণ (Fill Blanks)"
            icon="📝"
            onClick={() => navigate("/games/fill")}
            delay={0.2}
          />
          <GameCard
            title="কাহিনী কোৱা (Story Recall)"
            icon="🎙️"
            onClick={() => navigate("/games/recall")}
            delay={0.3}
          />
          <GameCard
            title="তালত টিপা (Rhythm Tap)"
            icon="🥁"
            onClick={() => navigate("/games/rhythm")}
            delay={0.4}
          />
          <GameCard
            title="ছবি মিলোৱা (PicMatch)"
            icon="🖼️"
            onClick={() => navigate("/games/picmatch")}
            delay={0.5}
          />
        </div>
      </div>

      {/* Karaoke Songs Section */}
      <div style={{ width: "100%", maxWidth: "720px" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            color: "#0D6E6E",
            marginBottom: "1rem",
            paddingLeft: "0.5rem",
          }}
        >
          কৰাওকে গান (Karaoke Songs)
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
            width: "100%",
          }}
        >
          {songs.map((song, i) => (
            <SongCard
              key={song.id}
              song={song}
              gradient={CARD_GRADIENTS[i % CARD_GRADIENTS.length]}
              delay={i * 0.1}
              onClick={() => navigate(`/play/${song.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Song card ──────────────────────────────────────────────────────────────────
function SongCard({
  song,
  gradient,
  delay,
  onClick,
}: {
  song: SongSummary;
  gradient: string;
  delay: number;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const diffColor = DIFFICULTY_COLOR[song.difficulty] ?? "#0D6E6E";
  const diffLabel = DIFFICULTY_LABEL[song.difficulty] ?? song.difficulty;

  return (
    <motion.button
      id={`song-card-${song.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 12px 36px rgba(13,110,110,0.25)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: "white",
        border: "2px solid #F0D9B5",
        borderRadius: "1.25rem",
        overflow: "hidden",
        cursor: "pointer",
        textAlign: "left",
        padding: 0,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        transition: "border-color 200ms",
        display: "flex",
        flexDirection: "column",
        minHeight: "220px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0D6E6E")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#F0D9B5")}
    >
      {/* Cover art */}
      <div
        style={{
          height: "130px",
          background: gradient,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {!imgError && (
          <img
            src={song.cover_art}
            alt={song.title}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
            }}
          />
        )}
        {/* Music note overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3.5rem",
            opacity: imgError ? 0.6 : 0.15,
          }}
        >
          🎵
        </div>
      </div>

      {/* Text area */}
      <div
        style={{
          padding: "1.1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#1A1A1A",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {song.title}
        </p>
        <span
          style={{
            display: "inline-block",
            background: diffColor + "18",
            color: diffColor,
            fontSize: "1rem",
            fontWeight: 600,
            padding: "0.25rem 0.75rem",
            borderRadius: "999px",
            alignSelf: "flex-start",
            border: `1.5px solid ${diffColor}40`,
          }}
        >
          {diffLabel}
        </span>
      </div>
    </motion.button>
  );
}

const fullPageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  background: "linear-gradient(160deg, #FDF6EC 0%, #F9EDDA 60%, #F0D9B5 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

// ── Game card ──────────────────────────────────────────────────────────────────
function GameCard({
  title,
  icon,
  delay,
  onClick,
}: {
  title: string;
  icon: string;
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 12px 36px rgba(13,110,110,0.25)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: "white",
        border: "2px solid #F0D9B5",
        borderRadius: "1.25rem",
        overflow: "hidden",
        cursor: "pointer",
        textAlign: "left",
        padding: "1.5rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        transition: "border-color 200ms",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0D6E6E")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#F0D9B5")}
    >
      <div style={{ fontSize: "3rem" }}>{icon}</div>
      <div
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#1A1A1A",
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
    </motion.button>
  );
}
