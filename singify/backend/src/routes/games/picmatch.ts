import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { getDb } from "../../db";

const router = Router();

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
      VALUES (?, ?, 'picmatch', ?)
    `,
    ).run(id, session_id, started_at);
    res.status(201).json({ game_id: id, started_at });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/submit", (req: Request, res: Response) => {
  const { game_id, score, max_score, accuracy_pct, latency_ms_avg, details } =
    req.body;
  if (!game_id) {
    res.status(400).json({ error: "Missing game_id" });
    return;
  }

  const db = getDb();
  const ended_at = Date.now();

  try {
    db.prepare(
      `
      UPDATE game_results
      SET ended_at = ?, score = ?, max_score = ?, accuracy_pct = ?, latency_ms_avg = ?, details = ?
      WHERE id = ? AND game_type = 'picmatch'
    `,
    ).run(
      ended_at,
      score,
      max_score,
      accuracy_pct,
      latency_ms_avg,
      JSON.stringify(details || {}),
      game_id,
    );
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
