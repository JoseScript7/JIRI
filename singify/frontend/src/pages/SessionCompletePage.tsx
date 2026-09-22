/**
 * SessionCompletePage — "/complete"
 *
 * Warm closing screen shown after all rounds finish.
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SessionCompletePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "linear-gradient(160deg, #FDF6EC 0%, #F9EDDA 55%, #F0D9B5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1.5rem",
        gap: "2.5rem",
        textAlign: "center",
      }}
    >
      {/* Animated trophy / star */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
        style={{ fontSize: "6rem", lineHeight: 1 }}
      >
        🌟
      </motion.div>

      {/* Messages */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "600px",
        }}
      >
        <h1
          style={{
            fontSize: "2.75rem",
            fontWeight: 800,
            color: "#0D6E6E",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Bhal hoise!
        </h1>
        <p
          style={{
            fontSize: "1.75rem",
            color: "#3A3A3A",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Apuni aaji khub bhalo gaan gaalibo!
        </p>
        <p
          style={{
            fontSize: "1.4rem",
            color: "#4A4A4A",
            margin: 0,
          }}
        >
          Dhanyabad! 🙏
        </p>
      </motion.div>

      {/* Home button */}
      <motion.button
        id="go-home-btn"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/")}
        style={{
          background: "#0D6E6E",
          color: "#FFFDF7",
          fontSize: "1.75rem",
          fontWeight: 700,
          padding: "1.25rem 3rem",
          border: "none",
          borderRadius: "1.25rem",
          cursor: "pointer",
          boxShadow: "0 6px 28px rgba(13,110,110,0.35)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        🏠 Ghori Jao
      </motion.button>
    </div>
  );
}
