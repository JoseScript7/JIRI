// ── Shared TypeScript types for Singify backend ──────────────────────────────

/** A single fill-in-the-blank lyric line */
export interface SongLine {
  line_id: string;
  start_sec: number;
  end_sec: number;
  full_text: string;
  blank_word: string;
  blank_word_start_sec: number;
  blank_word_end_sec: number;
  distractor_options: string[];
}

/** Full song record (as stored in songs.json) */
export interface Song {
  id: string;
  title: string;
  audio_file: string;
  cover_art: string;
  difficulty: "easy" | "medium" | "hard";
  lines: SongLine[];
}

/** Slim summary returned by GET /api/songs */
export interface SongSummary {
  id: string;
  title: string;
  cover_art: string;
  difficulty: string;
}

/** SQLite row shapes */
export interface SessionRow {
  id: string;
  started_at: number;
  ended_at: number | null;
}

export interface RoundRow {
  id: string;
  session_id: string;
  song_id: string;
  line_id: string;
  presented_at: number;
  answered_at: number | null;
  latency_ms: number | null;
  submitted_word: string | null;
  is_correct: number | null; // SQLite stores booleans as 0/1
  input_mode: string | null;
}

export interface GameResultRow {
  id: string;
  session_id: string;
  game_type: "memory" | "fill" | "recall" | "rhythm" | "picmatch";
  started_at: number;
  ended_at: number | null;
  score: number | null;
  max_score: number | null;
  accuracy_pct: number | null;
  latency_ms_avg: number | null;
  details: string | null; // JSON
}

export interface BiomarkerRow {
  id: number;
  timestamp: string;
  session_id: string | null;
  game_result_id: string | null;
  source: string;
  ttr: number | null;
  brunets_index: number | null;
  honore_statistic: number | null;
  mean_word_length: number | null;
  pause_rate: number | null;
  content_word_density: number | null;
  mean_utterance_length: number | null;
  semantic_coherence: number | null;
  risk_score: number | null;
  word_count: number | null;
  raw_text: string | null;
}
