/**
 * App.tsx — root application shell
 *
 * Additions in this pass:
 *  1. Branded splash screen (1.8s on first load, then fade-out)
 *  2. Smooth page transitions (300ms fade+slide via AnimatePresence + useLocation)
 */

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import SplashScreen from "./components/SplashScreen";
import CaregiverPage from "./pages/CaregiverPage";
import GamePage from "./pages/GamePage";
import SessionCompletePage from "./pages/SessionCompletePage";
import SongSelectionPage from "./pages/SongSelectionPage";
import WelcomePage from "./pages/WelcomePage";

// ── Page transition variants ──────────────────────────────────────────────────
const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};
const PAGE_TRANSITION = { duration: 0.3, ease: "easeInOut" } as const;

import MemoryGamePage from "./pages/games/MemoryGamePage";
import FillGamePage from "./pages/games/FillGamePage";
import RecallGamePage from "./pages/games/RecallGamePage";
import RhythmGamePage from "./pages/games/RhythmGamePage";
import PicMatchGamePage from "./pages/games/PicMatchGamePage";

/** Inner component that has access to router hooks */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={PAGE_TRANSITION}
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Routes location={location}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/songs" element={<SongSelectionPage />} />
          <Route path="/play/:songId" element={<GamePage />} />
          <Route path="/complete" element={<SessionCompletePage />} />
          <Route path="/caregiver" element={<CaregiverPage />} />
          <Route path="/games/memory" element={<MemoryGamePage />} />
          <Route path="/games/fill" element={<FillGamePage />} />
          <Route path="/games/recall" element={<RecallGamePage />} />
          <Route path="/games/rhythm" element={<RhythmGamePage />} />
          <Route path="/games/picmatch" element={<PicMatchGamePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Root app ──────────────────────────────────────────────────────────────────
const SPLASH_DURATION_MS = 1800;

export default function App() {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <SplashScreen visible={splash} />
      <SessionProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </SessionProvider>
    </>
  );
}
