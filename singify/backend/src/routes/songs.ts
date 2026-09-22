import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Song, SongSummary } from "../types";

const router = Router();

// Resolve songs.json once at module load
const SONGS_PATH = path.resolve(__dirname, "../../../data/songs.json");

function loadSongs(): Song[] {
  try {
    const raw = fs.readFileSync(SONGS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as { songs: Song[] };
    return parsed.songs;
  } catch (err) {
    console.error("Failed to load songs.json:", err);
    return [];
  }
}

// ── GET /api/songs ────────────────────────────────────────────────────────────
// Returns slim summaries only — no line details exposed to clients
router.get("/", (_req: Request, res: Response) => {
  const songs = loadSongs();
  const summaries: SongSummary[] = songs.map(
    ({ id, title, cover_art, difficulty }) => ({
      id,
      title,
      cover_art,
      difficulty,
    }),
  );
  res.json({ songs: summaries });
});

// ── GET /api/songs/:songId ────────────────────────────────────────────────────
router.get("/:songId", (req: Request, res: Response) => {
  const { songId } = req.params;
  const songs = loadSongs();
  const song = songs.find((s) => s.id === songId);

  if (!song) {
    res.status(404).json({ error: `Song '${songId}' not found` });
    return;
  }

  res.json({ song });
});

export default router;
