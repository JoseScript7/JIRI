import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

interface MemoryWord {
  word: string;
  translation: string;
  language: "as" | "en";
  audio: string;
}

interface WordSet {
  id: string;
  words: MemoryWord[];
}

type GameState = "loading" | "presenting" | "delay" | "recalling" | "feedback";

export default function MemoryGamePage() {
  const navigate = useNavigate();
  const { sessionId } = useSession();

  const [gameState, setGameState] = useState<GameState>("loading");
  const [wordSet, setWordSet] = useState<WordSet | null>(null);
  const [presentIndex, setPresentIndex] = useState(0);
  const [delayTime, setDelayTime] = useState(10);

  const [shuffledOptions, setShuffledOptions] = useState<MemoryWord[]>([]);
  const [selectedWords, setSelectedWords] = useState<MemoryWord[]>([]);
  const [score, setScore] = useState(0);

  const [gameId, setGameId] = useState<string | null>(null);

  // Initialize Game
  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    // 1. Fetch word sets
    fetch("/data/memory_words.json")
      .then((res) => res.json())
      .then((data) => {
        const randomSet =
          data.sets[Math.floor(Math.random() * data.sets.length)];
        setWordSet(randomSet);

        // Add 3 distractors to make 8 options total
        const allWords = data.sets.flatMap((s: any) => s.words);
        const distractors = allWords
          .filter(
            (w: MemoryWord) =>
              !randomSet.words.some((rw: MemoryWord) => rw.word === w.word),
          )
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [...randomSet.words, ...distractors].sort(
          () => 0.5 - Math.random(),
        );
        setShuffledOptions(options);

        // 2. Start Game Session in DB
        fetch("/api/games/memory/start", {
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
            setGameState("presenting");
          })
          .catch((e) => {
            console.warn("Backend failed, using mock game_id", e);
            setGameId("mock_id");
            setGameState("presenting");
          });
      })
      .catch((e) => {
        console.error("Failed to load memory_words.json", e);
      });
  }, [sessionId, navigate]);

  // Handle Presentation Phase
  useEffect(() => {
    if (gameState !== "presenting" || !wordSet) return;

    if (presentIndex < wordSet.words.length) {
      const timer = setTimeout(() => {
        // In a real app we'd play the wordSet.words[presentIndex].audio here
        setPresentIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setGameState("delay");
    }
  }, [gameState, presentIndex, wordSet]);

  // Handle Delay Phase
  useEffect(() => {
    if (gameState !== "delay") return;

    if (delayTime > 0) {
      const timer = setTimeout(() => setDelayTime((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameState("recalling");
    }
  }, [gameState, delayTime]);

  const handleSelectWord = (word: MemoryWord) => {
    if (selectedWords.length >= 5) return;

    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    } else {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    }
  };

  const handleSubmit = () => {
    if (!wordSet || !gameId) return;

    let correctCount = 0;
    // Score based on correct words (regardless of order)
    selectedWords.forEach((w) => {
      if (wordSet.words.some((rw) => rw.word === w.word)) {
        correctCount++;
      }
    });

    // Score based on exact serial order
    let serialScore = 0;
    selectedWords.forEach((w, i) => {
      if (wordSet.words[i] && wordSet.words[i].word === w.word) {
        serialScore++;
      }
    });

    const finalScore = correctCount + serialScore;
    setScore(finalScore);

    fetch("/api/games/memory/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_id: gameId,
        score: finalScore,
        max_score: 10, // 5 for words, 5 for order
        accuracy_pct: (finalScore / 10) * 100,
        details: { selectedWords, correctCount, serialScore },
      }),
    }).then(() => setGameState("feedback"));
  };

  if (gameState === "loading") {
    return (
      <div style={fullPageStyle}>
        <p>খেল আৰম্ভ হৈছে (Loading)...</p>
      </div>
    );
  }

  if (gameState === "presenting" && wordSet) {
    const currentWord = wordSet.words[presentIndex];
    return (
      <div style={fullPageStyle}>
        <h2>শব্দটো মনত ৰাখক (Remember the word)</h2>
        <motion.div
          key={presentIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            color: "#0D6E6E",
            margin: "2rem 0",
          }}
        >
          {currentWord ? currentWord.word : ""}
        </motion.div>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          {presentIndex + 1} / 5
        </p>
      </div>
    );
  }

  if (gameState === "delay") {
    return (
      <div style={fullPageStyle}>
        <h2>অলপ ৰওক (Wait a moment)</h2>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: "5rem", margin: "2rem 0" }}
        >
          ⏳
        </motion.div>
        <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{delayTime}</p>
      </div>
    );
  }

  if (gameState === "recalling") {
    return (
      <div style={fullPageStyle}>
        <h2>আপুনি শুনা ৫টা শব্দ বাছক (Select the 5 words you heard)</h2>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "800px",
            margin: "2rem 0",
          }}
        >
          {shuffledOptions.map((word, i) => {
            const isSelected = selectedWords.includes(word);
            const selectionIndex = selectedWords.indexOf(word) + 1;
            return (
              <button
                key={i}
                onClick={() => handleSelectWord(word)}
                style={{
                  padding: "1.5rem 2rem",
                  fontSize: "1.8rem",
                  borderRadius: "1rem",
                  border: isSelected ? "4px solid #0D6E6E" : "2px solid #ccc",
                  background: isSelected ? "#E0F2F1" : "white",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      background: "#0D6E6E",
                      color: "white",
                      borderRadius: "50%",
                      width: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                    }}
                  >
                    {selectionIndex}
                  </span>
                )}
                {word.word}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          disabled={selectedWords.length !== 5}
          style={{
            padding: "1rem 3rem",
            fontSize: "1.5rem",
            background: selectedWords.length === 5 ? "#0D6E6E" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "2rem",
            cursor: selectedWords.length === 5 ? "pointer" : "not-allowed",
          }}
        >
          জমা দিয়ক (Submit)
        </button>
      </div>
    );
  }

  return (
    <div style={fullPageStyle}>
      <h2>ফলাফল (Result)</h2>
      <div style={{ fontSize: "5rem", margin: "1rem 0" }}>
        {score >= 8 ? "🌟" : "👍"}
      </div>
      <p style={{ fontSize: "2rem" }}>আপোনাৰ স্ক’ৰ: {score} / 10</p>
      <button
        onClick={() => navigate("/songs")}
        style={{
          marginTop: "2rem",
          padding: "1rem 3rem",
          fontSize: "1.5rem",
          background: "#0D6E6E",
          color: "white",
          border: "none",
          borderRadius: "2rem",
          cursor: "pointer",
        }}
      >
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
  textAlign: "center",
  padding: "2rem",
};
