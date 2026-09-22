import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import multer from "multer";
import fs from "fs";
import os from "os";
import { getDb } from "../../db";
import { whisperSidecar } from "../../whisperSidecar";
import { biomarkerSidecar } from "../../biomarkerSidecar";

const router = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, os.tmpdir()),
    filename: (_req, _file, cb) =>
      cb(
        null,
        `recall_${Date.now()}_${Math.random().toString(36).slice(2)}.webm`,
      ),
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB ceiling for recall audio
});

// POST /api/games/recall/start
router.post("/start", (req: Request, res: Response) => {
  const { session_id } = req.body;
  if (!session_id) {
    res.status(400).json({ error: "Missing session_id" });
    return;
  }

  const db = getDb();
  const id = randomUUID();
  const started_at = Date.now();

  try {
    db.prepare(
      `
      INSERT INTO game_results (id, session_id, game_type, started_at)
      VALUES (?, ?, 'recall', ?)
    `,
    ).run(id, session_id, started_at);
    res.status(201).json({ game_id: id, started_at });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/games/recall/submit
router.post(
  "/submit",
  upload.single("audio"),
  async (req: Request, res: Response) => {
    const { game_id } = req.body;
    const file = req.file;

    if (!game_id) {
      res.status(400).json({ error: "Missing game_id" });
      return;
    }

    if (!file) {
      res.status(400).json({ error: "No audio file provided" });
      return;
    }

    const db = getDb();
    const ended_at = Date.now();

    try {
      // 1. Transcribe audio with Whisper
      const WHISPER_LANG = process.env.WHISPER_LANG ?? "as";
      const text = await whisperSidecar.transcribe(file.path, WHISPER_LANG);

      // 2. Extract Biomarkers
      const biomarkers = await biomarkerSidecar.extract(text);

      // 3. Save to biomarkers table
      const timestamp = new Date().toISOString();
      const session = db
        .prepare("SELECT session_id FROM game_results WHERE id = ?")
        .get(game_id) as any;
      const session_id = session ? session.session_id : null;

      db.prepare(
        `
      INSERT INTO biomarkers (
        timestamp, session_id, game_result_id, source,
        ttr, brunets_index, honore_statistic, mean_word_length,
        pause_rate, content_word_density, mean_utterance_length,
        semantic_coherence, risk_score, word_count, raw_text
      ) VALUES (?, ?, ?, 'singify', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      ).run(
        timestamp,
        session_id,
        game_id,
        biomarkers.ttr,
        biomarkers.brunets_index,
        biomarkers.honore_statistic,
        biomarkers.mean_word_length,
        biomarkers.pause_rate,
        biomarkers.content_word_density,
        biomarkers.mean_utterance_length,
        biomarkers.semantic_coherence,
        biomarkers.risk_score,
        biomarkers.word_count,
        text,
      );

      // 4. Update game_results
      db.prepare(
        `
      UPDATE game_results
      SET ended_at = ?, score = ?, max_score = ?, accuracy_pct = ?, details = ?
      WHERE id = ? AND game_type = 'recall'
    `,
      ).run(
        ended_at,
        biomarkers.word_count, // rough proxy for score in free recall
        0, // unbounded
        0, // N/A
        JSON.stringify({ text, biomarkers }),
        game_id,
      );

      res.json({ success: true, text, biomarkers });
    } catch (err: any) {
      console.error("[Recall] Submit error:", err);
      res.status(500).json({ error: err.message });
    } finally {
      if (file?.path) fs.unlink(file.path, () => {});
    }
  },
);

export default router;
