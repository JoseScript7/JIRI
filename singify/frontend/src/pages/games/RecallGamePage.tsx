import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

export default function RecallGamePage() {
  const navigate = useNavigate();
  const { sessionId } = useSession();

  const [gameState, setGameState] = useState<
    "intro" | "listening" | "recording" | "processing" | "done"
  >("intro");
  const [gameId, setGameId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!sessionId) navigate("/");
  }, [sessionId, navigate]);

  const startGame = () => {
    fetch("/api/games/recall/start", {
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
        setGameState("listening");
        // Simulate song playing
        setTimeout(() => setGameState("recording"), 3000);
      })
      .catch((e) => {
        console.warn("Backend failed, simulating game anyway", e);
        setGameId("mock_id");
        setGameState("listening");
        setTimeout(() => setGameState("recording"), 3000);
      });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        submitAudio(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setGameState("processing");
    }
  };

  const submitAudio = (audioBlob: Blob) => {
    const fd = new FormData();
    fd.append("audio", audioBlob, "recall.webm");
    fd.append("game_id", gameId || "");

    fetch("/api/games/recall/submit", {
      method: "POST",
      body: fd,
    })
      .then((r) => r.json())
      .then((d) => {
        setResult(d);
        setGameState("done");
      })
      .catch((e) => {
        console.error(e);
        setGameState("done");
      });
  };

  return (
    <div style={fullPageStyle}>
      {gameState === "intro" && (
        <>
          <h2>কাহিনী কোৱা (Story Recall)</h2>
          <p>সম্পূৰ্ণ গানটো শুনক, তাৰ পিছত আপুনি কি মনত ৰাখিলে সেয়া কওক।</p>
          <button onClick={startGame} style={btnStyle}>
            আৰম্ভ কৰক (Start)
          </button>
        </>
      )}

      {gameState === "listening" && (
        <>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "4rem" }}
          >
            🎧
          </motion.div>
          <h2>গানটো শুনক... (Listen...)</h2>
        </>
      )}

      {gameState === "recording" && (
        <>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ fontSize: "4rem" }}
          >
            🎙️
          </motion.div>
          <h2>আপুনি কি মনত ৰাখিলে? (What do you remember?)</h2>
          {!mediaRecorderRef.current ||
          mediaRecorderRef.current.state === "inactive" ? (
            <button
              onClick={startRecording}
              style={{ ...btnStyle, background: "#D32F2F" }}
            >
              কোৱা আৰম্ভ কৰক (Start Speaking)
            </button>
          ) : (
            <button
              onClick={stopRecording}
              style={{ ...btnStyle, background: "#388E3C" }}
            >
              মই কৈ শেষ কৰিলো (Done)
            </button>
          )}
        </>
      )}

      {gameState === "processing" && (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: "4rem" }}
          >
            ⏳
          </motion.div>
          <h2>বিশ্লেষণ কৰা হৈছে... (Processing...)</h2>
        </>
      )}

      {gameState === "done" && (
        <>
          <h2>ফলাফল (Result)</h2>
          <div
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "600px",
              textAlign: "left",
            }}
          >
            <p>
              <strong>You said:</strong> {result?.text || "(Nothing detected)"}
            </p>
            <p>
              <strong>Words spoken:</strong>{" "}
              {result?.biomarkers?.word_count || 0}
            </p>
            <p>
              <strong>Vocabulary Richness (TTR):</strong>{" "}
              {result?.biomarkers?.ttr || 0}
            </p>
          </div>
          <button onClick={() => navigate("/songs")} style={btnStyle}>
            ঘূৰি যাওক (Back)
          </button>
        </>
      )}
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
