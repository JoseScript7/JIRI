import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

// Simple placeholder for the Fill Game.
// In a full implementation, this would load a song with multiple blanks,
// play it, and collect answers for each blank sequentially.

export default function FillGamePage() {
  const navigate = useNavigate();
  const { sessionId } = useSession();

  const [gameState, setGameState] = useState<"intro" | "playing" | "done">(
    "intro",
  );
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!sessionId) navigate("/");
  }, [sessionId, navigate]);

  const startGame = () => {
    fetch("/api/games/fill/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((d) => {
        setGameState("playing");
        const activeGameId = d.game_id;

        // Simulate playing the game for 5 seconds
        setTimeout(() => {
          setScore(3); // Mock score
          setGameState("done");

          fetch("/api/games/fill/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              game_id: activeGameId,
              score: 3,
              max_score: 3,
              accuracy_pct: 100,
              details: { blanks: 3, correct: 3 },
            }),
          }).catch(console.warn);
        }, 5000);
      })
      .catch((e) => {
        console.warn("Backend failed, simulating game anyway", e);
        setGameState("playing");
        setTimeout(() => {
          setScore(3);
          setGameState("done");
        }, 5000);
      });
  };

  if (gameState === "intro") {
    return (
      <div style={fullPageStyle}>
        <h2>খালী ঠাই পূৰণ (Fill the Blanks)</h2>
        <p>গানটো শুনক আৰু খালী ঠাইবোৰ পূৰণ কৰক।</p>
        <button onClick={startGame} style={btnStyle}>
          আৰম্ভ কৰক (Start)
        </button>
      </div>
    );
  }

  if (gameState === "playing") {
    return (
      <div style={fullPageStyle}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ fontSize: "4rem" }}
        >
          🎶
        </motion.div>
        <h2>গান বাজি আছে... খালী ঠাই পূৰণ কৰক!</h2>
      </div>
    );
  }

  return (
    <div style={fullPageStyle}>
      <h2>ফলাফল (Result)</h2>
      <div style={{ fontSize: "5rem", margin: "1rem 0" }}>🌟</div>
      <p style={{ fontSize: "2rem" }}>আপোনাৰ স্ক’ৰ: {score} / 3</p>
      <button onClick={() => navigate("/songs")} style={btnStyle}>
        ঘূৰি যাওক (Back)
      </button>
    </div>
  );
}

const fullPageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  background: "linear-gradient(160deg, #FDF6EC 0%, #F9EDDA 60%, #F0D9B5 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem",
};

const btnStyle: React.CSSProperties = {
  marginTop: "2rem",
  padding: "1rem 3rem",
  fontSize: "1.5rem",
  background: "#0D6E6E",
  color: "white",
  border: "none",
  borderRadius: "2rem",
  cursor: "pointer",
};
