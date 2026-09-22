import { Router, Request, Response } from "express";
import { getDb } from "../db";

const router = Router();

// ── GET /api/caregiver/report ─────────────────────────────────────────────────
/**
 * Returns an aggregated report for the caregiver dashboard:
 *   - total_sessions
 *   - avg_latency_by_session: [{session_id, started_at, avg_latency_ms}]  (for line chart)
 *   - accuracy_by_session:    [{session_id, started_at, accuracy_pct}]    (for line chart)
 *   - hardest_words: top-5 words with the lowest accuracy %
 */
router.get("/report", (_req: Request, res: Response) => {
  const db = getDb();

  // 1. Total sessions
  const { total_sessions } = db
    .prepare("SELECT COUNT(*) AS total_sessions FROM sessions")
    .get() as { total_sessions: number };

  // 2. Per-session accuracy & latency (only completed rounds)
  const sessionStats = db
    .prepare(
      `
      SELECT
        s.id            AS session_id,
        s.started_at,
        ROUND(AVG(r.latency_ms), 0)                             AS avg_latency_ms,
        ROUND(100.0 * SUM(r.is_correct) / COUNT(r.id), 1)      AS accuracy_pct,
        COUNT(r.id)                                             AS rounds_played
      FROM sessions s
      LEFT JOIN rounds r
        ON r.session_id = s.id AND r.answered_at IS NOT NULL
      GROUP BY s.id
      ORDER BY s.started_at ASC
    `,
    )
    .all() as {
    session_id: string;
    started_at: number;
    avg_latency_ms: number | null;
    accuracy_pct: number | null;
    rounds_played: number;
  }[];

  // 3. Hardest words — words with the most incorrect answers (top 5)
  const hardestWords = db
    .prepare(
      `
      SELECT
        r.line_id,
        r.song_id,
        COUNT(r.id)                                             AS total_attempts,
        SUM(r.is_correct)                                       AS correct_count,
        ROUND(100.0 * SUM(r.is_correct) / COUNT(r.id), 1)      AS accuracy_pct
      FROM rounds r
      WHERE r.answered_at IS NOT NULL
      GROUP BY r.line_id
      HAVING total_attempts > 0
      ORDER BY accuracy_pct ASC, total_attempts DESC
      LIMIT 5
    `,
    )
    .all() as {
    line_id: string;
    song_id: string;
    total_attempts: number;
    correct_count: number;
    accuracy_pct: number;
  }[];

  // 4. Global totals
  const globalStats = db
    .prepare(
      `
      SELECT
        COUNT(*)                                                    AS total_rounds,
        SUM(is_correct)                                             AS total_correct,
        ROUND(100.0 * SUM(is_correct) / NULLIF(COUNT(*), 0), 1)   AS global_accuracy_pct,
        ROUND(AVG(latency_ms), 0)                                   AS global_avg_latency_ms
      FROM rounds
      WHERE answered_at IS NOT NULL
    `,
    )
    .get() as {
    total_rounds: number;
    total_correct: number;
    global_accuracy_pct: number | null;
    global_avg_latency_ms: number | null;
  };

  res.json({
    total_sessions,
    global_stats: globalStats,
    avg_latency_by_session: sessionStats.map((s) => ({
      session_id: s.session_id,
      started_at: s.started_at,
      avg_latency_ms: s.avg_latency_ms,
      rounds_played: s.rounds_played,
    })),
    accuracy_by_session: sessionStats.map((s) => ({
      session_id: s.session_id,
      started_at: s.started_at,
      accuracy_pct: s.accuracy_pct,
      rounds_played: s.rounds_played,
    })),
    hardest_words: hardestWords,
  });
});

export default router;
