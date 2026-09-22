import Database from "better-sqlite3";
import path from "path";

// Store the DB file in /data alongside songs.json
const DB_PATH = path.resolve(__dirname, "../../data/singify.db");

let _db: Database.Database | null = null;

/** Returns the singleton DB connection, initialising the schema on first call. */
export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent read performance
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  _db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id          TEXT PRIMARY KEY,
      started_at  INTEGER NOT NULL,   -- Unix ms
      ended_at    INTEGER             -- Unix ms, NULL until ended
    );

    CREATE TABLE IF NOT EXISTS rounds (
      id             TEXT PRIMARY KEY,
      session_id     TEXT NOT NULL REFERENCES sessions(id),
      song_id        TEXT NOT NULL,
      line_id        TEXT NOT NULL,
      presented_at   INTEGER NOT NULL,    -- Unix ms (server-set)
      answered_at    INTEGER,             -- Unix ms
      latency_ms     INTEGER,
      submitted_word TEXT,
      is_correct     INTEGER,             -- 0 | 1 | NULL
      input_mode     TEXT                 -- 'voice' | 'tap'
    );

    -- Cognitive mini-game results (Memory, Fill, Recall, Rhythm, PicMatch)
    CREATE TABLE IF NOT EXISTS game_results (
      id             TEXT PRIMARY KEY,
      session_id     TEXT NOT NULL REFERENCES sessions(id),
      game_type      TEXT NOT NULL,   -- 'memory' | 'fill' | 'recall' | 'rhythm' | 'picmatch'
      started_at     INTEGER NOT NULL,
      ended_at       INTEGER,
      score          INTEGER,
      max_score      INTEGER,
      accuracy_pct   REAL,
      latency_ms_avg REAL,
      details        TEXT             -- JSON blob of game-specific fields
    );

    -- Biomarkers from Recall and voice-answer transcripts
    CREATE TABLE IF NOT EXISTS biomarkers (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp            TEXT NOT NULL,
      session_id           TEXT,
      game_result_id       TEXT,
      source               TEXT NOT NULL DEFAULT 'singify',
      ttr                  REAL,
      brunets_index        REAL,
      honore_statistic     REAL,
      mean_word_length     REAL,
      pause_rate           REAL,
      content_word_density REAL,
      mean_utterance_length REAL,
      semantic_coherence   REAL,
      risk_score           REAL,
      word_count           INTEGER,
      raw_text             TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_rounds_session      ON rounds(session_id);
    CREATE INDEX IF NOT EXISTS idx_rounds_line         ON rounds(line_id);
    CREATE INDEX IF NOT EXISTS idx_game_results_session ON game_results(session_id);
    CREATE INDEX IF NOT EXISTS idx_game_results_type   ON game_results(game_type);
  `);

  console.log(`📦 SQLite connected: ${DB_PATH}`);
  return _db;
}
