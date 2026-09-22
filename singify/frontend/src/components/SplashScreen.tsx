/**
 * SplashScreen.tsx
 *
 * Branded loading screen shown briefly on first app load.
 * Displays the Singify musical-note + sound-wave logo, then fades out.
 * Rendered by App.tsx and removed after SPLASH_DURATION ms.
 */

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  visible: boolean;
}

export default function SplashScreen({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "linear-gradient(155deg, #0D6E6E 0%, #095A5A 45%, #064040 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            {/* Musical note + wave icon */}
            <SingifyLogoMark />

            {/* Wordmark */}
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: "3.5rem",
                  fontWeight: 800,
                  color: "#FFFDF7",
                  margin: 0,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                Singify
              </h1>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "rgba(255,253,247,0.7)",
                  margin: "0.5rem 0 0",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Music · Memory · Joy
              </p>
            </div>
          </motion.div>

          {/* Animated loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ display: "flex", gap: "10px" }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 0.75,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "rgba(255,253,247,0.6)",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** SVG-based musical note + sound wave brand mark */
function SingifyLogoMark() {
  return (
    <motion.div
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width: "110px",
        height: "110px",
        borderRadius: "28px",
        background: "rgba(255,253,247,0.12)",
        border: "2px solid rgba(255,253,247,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        boxShadow: "0 12px 48px rgba(0,0,0,0.3)",
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Musical note */}
        <path
          d="M24 44V18l24-5v22"
          stroke="#FFFDF7"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Note head 1 */}
        <ellipse cx="21" cy="44" rx="6" ry="4" fill="#FFFDF7" opacity="0.95" />
        {/* Note head 2 */}
        <ellipse cx="45" cy="35" rx="6" ry="4" fill="#FFFDF7" opacity="0.95" />
        {/* Sound wave arcs */}
        <path
          d="M6 28 C6 18 12 11 20 11"
          stroke="rgba(255,253,247,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M2 32 C2 14 14 4 28 4"
          stroke="rgba(255,253,247,0.25)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
