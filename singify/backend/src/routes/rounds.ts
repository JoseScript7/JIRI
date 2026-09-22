import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import { getDb } from "../db";
import { fuzzyMatch, fuzzyMatchVoice } from "../fuzzy";
import { Song, RoundRow } from "../types";

const router = Router();

const SONGS_PATH = path.resolve(__dirname, "../../../data/songs.json");

function findLine(songId: string, lineId: string) {
  try {
    const raw = fs.readFileSync(SONGS_PATH, "utf-8");
    const { songs } = JSON.parse(raw) as { songs: Song[] };
    const song = songs.find((s) => s.id === songId);
    if (!song) return null;
    const line = song.lines.find((l) => l.line_id === lineId);
    return line ?? null;
  } catch {
    return null;
  }
}

// ── POST /api/round/start ─────────────────────────────────────────────────────
router.post("/start", (req: Request, res: Response) => {
  const { session_id, song_id, line_id } = req.body as {
    session_id?: string;
    song_id?: string;
    line_id?: string;
  };

  // Validate required fields
  if (!session_id || !song_id || !line_id) {
    res.status(400).json({
      error: "Missing required fields: session_id, song_id, line_id",
    });
    return;
  }

  const db = getDb();

  // Verify the session exists and is still open
  const session = db
    .prepare("SELECT id, ended_at FROM sessions WHERE id = ?")
    .get(session_id) as { id: string; ended_at: number | null } | undefined;

  if (!session) {
    res.status(404).json({ error: `Session '${session_id}' not found` });
    return;
  }
  if (session.ended_at !== null) {
    res.status(409).json({ error: "Session has already ended" });
    return;
  }

  // Verify the line exists in songs.json
  const line = findLine(song_id, line_id);
  if (!line) {
    res
      .status(404)
      .json({ error: `Song '${song_id}' / line '${line_id}' not found` });
    return;
  }

  // Record presented_at server-side (critical for latency accuracy)
  const id = randomUUID();
  const presented_at = Date.now();

  db.prepare(
    `
    INSERT INTO rounds (id, session_id, song_id, line_id, presented_at)
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(id, session_id, song_id, line_id, presented_at);

  res.status(201).json({ round_id: id, presented_at });
});

// ── POST /api/round/:roundId/answer ──────────────────────────────────────────
router.post("/:roundId/answer", (req: Request, res: Response) => {
  const { roundId } = req.params;
  const { submitted_word, input_mode } = req.body as {
    submitted_word?: string;
    input_mode?: string;
  };

  // Validate
  // Voice mode: empty string is allowed — it means Whisper returned no speech.
  // It will be scored as incorrect and stored as '[unrecognised]' for analytics.
  if (typeof submitted_word !== "string") {
    res.status(400).json({ error: "submitted_word must be a string" });
    return;
  }
  const isTap = input_mode === "tap";
  const isVoice = input_mode === "voice";
  if (isTap && submitted_word.trim() === "") {
    res
      .status(400)
      .json({ error: "submitted_word must be non-empty for tap mode" });
    return;
  }
  if (!isTap && !isVoice) {
    res.status(400).json({ error: "input_mode must be 'voice' or 'tap'" });
    return;
  }

  const db = getDb();
  const round = db.prepare("SELECT * FROM rounds WHERE id = ?").get(roundId) as
    RoundRow | undefined;

  if (!round) {
    res.status(404).json({ error: `Round '${roundId}' not found` });
    return;
  }
  if (round.answered_at !== null) {
    res.status(409).json({ error: "Round already answered" });
    return;
  }

  // Look up the correct answer
  const line = findLine(round.song_id, round.line_id);
  if (!line) {
    res
      .status(500)
      .json({ error: "Song/line data missing — cannot score round" });
    return;
  }

  const answered_at = Date.now();
  const latency_ms = answered_at - round.presented_at;

  // Normalise: empty voice submission stored as '[unrecognised]'
  const stored_word = submitted_word.trim() || "[unrecognised]";

  // Voice mode uses the more-lenient fuzzyMatchVoice (Levenshtein ≤ 2 OR similarity ≥ 0.7)
  const is_correct =
    input_mode === "voice"
      ? fuzzyMatchVoice(stored_word, line.blank_word)
      : fuzzyMatch(stored_word, line.blank_word);

  db.prepare(
    `
    UPDATE rounds
    SET answered_at    = ?,
        latency_ms     = ?,
        submitted_word = ?,
        is_correct     = ?,
        input_mode     = ?
    WHERE id = ?
  `,
  ).run(
    answered_at,
    latency_ms,
    stored_word,
    is_correct ? 1 : 0,
    input_mode,
    roundId,
  );

  res.json({
    is_correct,
    correct_word: line.blank_word,
    submitted_word: stored_word,
    latency_ms,
  });
});

export default router;
