import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

export default function PicMatchGamePage() {
  const navigate = useNavigate();
  const { sessionId } = useSession();

  const [gameState, setGameState] = useState<
    "loading" | "intro" | "playing" | "done"
  >("loading");
  const [sets, setSets] = useState<any[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) navigate("/");

    fetch("/data/picmatch_sets.json")
      .then((r) => r.json())
      .then((d) => {
        setSets(d.sets.sort(() => 0.5 - Math.random()));
        setGameState("intro");
      })
      .catch(console.error);
  }, [sessionId, navigate]);

  const startGame = () => {
    fetch("/api/games/picmatch/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((d) => {
        setGameId(d.game_id);
        setGameState("playing");
      })
      .catch((e) => {
        console.warn("Backend failed, using mock game_id", e);
        setGameId("mock_id");
        setGameState("playing");
      });
  };

  const handleSelect = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 1);

    if (currentSetIndex + 1 < sets.length) {
      setCurrentSetIndex((i) => i + 1);
    } else {
      const finalScore = isCorrect ? score + 1 : score;
      setGameState("done");

      fetch("/api/games/picmatch/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: gameId,
          score: finalScore,
          max_score: sets.length,
          accuracy_pct: (finalScore / sets.length) * 100,
          details: {},
        }),
      });
    }
  };

  if (gameState === "loading")
    return <div style={fullPageStyle}>Loading...</div>;

  if (gameState === "intro") {
    return (
      <div style={fullPageStyle}>
        <h2>ছবি মিলোৱা (PicMatch)</h2>
        <p>শব্দটো শুনক আৰু সঠিক ছবিখন বাছক।</p>
        <button onClick={startGame} style={btnStyle}>
          আৰম্ভ কৰক (Start)
        </button>
      </div>
    );
  }

  if (gameState === "playing") {
    const currentSet = sets[currentSetIndex];
    // Mix correct image with distractors
    const options = [
      { url: currentSet.image_correct, isCorrect: true },
      ...currentSet.distractors.map((url: string) => ({
        url,
        isCorrect: false,
      })),
    ].sort(() => 0.5 - Math.random());

    return (
      <div style={fullPageStyle}>
        <h2
          style={{ fontSize: "3rem", color: "#0D6E6E", marginBottom: "2rem" }}
        >
          {currentSet.word}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(opt.isCorrect)}
              style={{
                background: "white",
                borderRadius: "1rem",
                padding: "1rem",
                border: "2px solid #ccc",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={opt.url}
                alt="Option"
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "contain",
                  borderRadius: "0.5rem",
                }}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/200?text=?";
                }}
              />
            </motion.button>
          ))}
        </div>
        <p style={{ marginTop: "2rem" }}>
          {currentSetIndex + 1} / {sets.length}
        </p>
      </div>
    );
  }

  return (
    <div style={fullPageStyle}>
      <h2>ফলাফল (Result)</h2>
      <div style={{ fontSize: "5rem", margin: "1rem 0" }}>
        {score === sets.length ? "🌟" : "👍"}
      </div>
      <p style={{ fontSize: "2rem" }}>
        আপোনাৰ স্ক’ৰ: {score} / {sets.length}
      </p>
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
  textAlign: "center",
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
