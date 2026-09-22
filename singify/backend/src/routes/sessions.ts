import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { getDb } from "../db";

const router = Router();

// ── POST /api/session/start ───────────────────────────────────────────────────
router.post("/start", (_req: Request, res: Response) => {
  const db = getDb();
  const id = randomUUID();
  const now = Date.now();

  db.prepare(
    "INSERT INTO sessions (id, started_at, ended_at) VALUES (?, ?, NULL)",
  ).run(id, now);

  res.status(201).json({ session_id: id, started_at: now });
});

// ── POST /api/session/:id/end ─────────────────────────────────────────────────
router.post("/:id/end", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const now = Date.now();

  const session = db
    .prepare("SELECT id, ended_at FROM sessions WHERE id = ?")
    .get(id) as { id: string; ended_at: number | null } | undefined;

  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  if (session.ended_at !== null) {
    res.status(409).json({ error: "Session already ended" });
    return;
  }

  db.prepare("UPDATE sessions SET ended_at = ? WHERE id = ?").run(now, id);

  res.json({ session_id: id, ended_at: now });
});

export default router;
