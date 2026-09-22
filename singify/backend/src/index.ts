import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { getDb } from "./db";
import { whisperSidecar } from "./whisperSidecar";
import sessionRouter from "./routes/sessions";
import songRouter from "./routes/songs";
import roundRouter from "./routes/rounds";
import caregiverRouter from "./routes/caregiver";
import sttRouter from "./routes/stt";

const app = express();
const PORT = process.env.PORT ?? 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Static assets ─────────────────────────────────────────────────────────────
app.use("/audio", express.static(path.resolve(__dirname, "../../audio")));
app.use("/art", express.static(path.resolve(__dirname, "../../art")));

// ── API routes ────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    whisper_backend: process.env.WHISPER_BACKEND ?? "openai",
    whisper_model: process.env.WHISPER_MODEL ?? "base",
  });
});

app.use("/api/session", sessionRouter);
app.use("/api/songs", songRouter);
app.use("/api/round", roundRouter);
app.use("/api/caregiver", caregiverRouter);
app.use("/api/stt", sttRouter);

import memoryRouter from "./routes/games/memory";
import fillRouter from "./routes/games/fill";
import recallRouter from "./routes/games/recall";
import rhythmRouter from "./routes/games/rhythm";
import picmatchRouter from "./routes/games/picmatch";
import { biomarkerSidecar } from "./biomarkerSidecar";

app.use("/api/games/memory", memoryRouter);
app.use("/api/games/fill", fillRouter);
app.use("/api/games/recall", recallRouter);
app.use("/api/games/rhythm", rhythmRouter);
app.use("/api/games/picmatch", picmatchRouter);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Unhandled error]", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
// Initialise DB before accepting requests
getDb();

// Start the Whisper sidecar (model loads in background; ~15-30s for 'base')
whisperSidecar.start();
biomarkerSidecar.start();

app.listen(PORT, () => {
  console.log(`🎵 Singify backend listening on http://localhost:${PORT}`);
});

export default app;
