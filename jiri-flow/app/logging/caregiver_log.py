import sqlite3
import datetime
import os
import threading
import json as _json


class CaregiverLogger:
    def __init__(self, db_path: str = "logs/jiri_flow.db"):
        self.db_path = db_path
        # Ensure the directory exists
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.lock = threading.Lock()
        self._init_db()

    def _init_db(self):
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        timestamp TEXT NOT NULL,
                        event_type TEXT NOT NULL,
                        details TEXT NOT NULL,
                        source TEXT NOT NULL DEFAULT 'jiri'
                    )
                """)
                # ── Biomarkers table (Fraser et al. 2015; Yuan et al. 2020) ──
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS biomarkers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        timestamp TEXT NOT NULL,
                        session_id TEXT,
                        source TEXT NOT NULL DEFAULT 'jiri',
                        ttr REAL,
                        brunets_index REAL,
                        honore_statistic REAL,
                        mean_word_length REAL,
                        pause_rate REAL,
                        content_word_density REAL,
                        mean_utterance_length REAL,
                        semantic_coherence REAL,
                        risk_score REAL,
                        word_count INTEGER,
                        raw_text TEXT
                    )
                """)
                # Add source column to existing DBs that predate this migration
                try:
                    cursor.execute(
                        "ALTER TABLE logs ADD COLUMN source TEXT NOT NULL DEFAULT 'jiri'"
                    )
                except Exception:
                    pass  # column already exists
                conn.commit()

    def log_event(self, event_type: str, details: str, source: str = "jiri"):
        """Logs an event securely from any thread."""
        now_str = datetime.datetime.now().isoformat()
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO logs (timestamp, event_type, details, source) VALUES (?, ?, ?, ?)",
                    (now_str, event_type, details, source),
                )
                conn.commit()

    def merge_external_report(self, source_name: str, report_json: dict) -> None:
        """
        Normalise an external report (e.g. from Singify) into the JIRI Flow
        SQLite event log schema so both systems share a single timeline.

        Singify report shape expected:
          {
            "total_sessions": int,
            "global_stats": {total_rounds, total_correct, global_accuracy_pct, global_avg_latency_ms},
            "avg_latency_by_session": [{session_id, started_at, avg_latency_ms, rounds_played}],
            "accuracy_by_session":    [{session_id, started_at, accuracy_pct, rounds_played}],
            "hardest_words":          [{line_id, song_id, total_attempts, correct_count, accuracy_pct}]
          }
        """
        import json

        # One summary event for the global stats
        global_stats = report_json.get("global_stats") or {}
        total_sessions = report_json.get("total_sessions", 0)
        summary_details = (
            f"Sessions: {total_sessions} | "
            f"Rounds: {global_stats.get('total_rounds', 0)} | "
            f"Accuracy: {global_stats.get('global_accuracy_pct', 'N/A')}% | "
            f"Avg latency: {global_stats.get('global_avg_latency_ms', 'N/A')} ms"
        )
        self.log_event("SINGIFY_SUMMARY", summary_details, source=source_name)

        # One event per session latency entry
        for entry in report_json.get("avg_latency_by_session", []):
            ts_epoch = entry.get("started_at", 0)
            ts = (
                datetime.datetime.fromtimestamp(ts_epoch / 1000.0).isoformat()
                if ts_epoch
                else datetime.datetime.now().isoformat()
            )
            details = (
                f"session={entry.get('session_id','?')[:8]} | "
                f"avg_latency={entry.get('avg_latency_ms','N/A')} ms | "
                f"rounds={entry.get('rounds_played',0)}"
            )
            with self.lock:
                with sqlite3.connect(self.db_path) as conn:
                    conn.execute(
                        "INSERT INTO logs (timestamp, event_type, details, source) VALUES (?, ?, ?, ?)",
                        (ts, "SESSION_LATENCY", details, source_name),
                    )
                    conn.commit()

        # One event per accuracy session entry
        for entry in report_json.get("accuracy_by_session", []):
            ts_epoch = entry.get("started_at", 0)
            ts = (
                datetime.datetime.fromtimestamp(ts_epoch / 1000.0).isoformat()
                if ts_epoch
                else datetime.datetime.now().isoformat()
            )
            details = (
                f"session={entry.get('session_id','?')[:8]} | "
                f"accuracy={entry.get('accuracy_pct','N/A')}% | "
                f"rounds={entry.get('rounds_played',0)}"
            )
            with self.lock:
                with sqlite3.connect(self.db_path) as conn:
                    conn.execute(
                        "INSERT INTO logs (timestamp, event_type, details, source) VALUES (?, ?, ?, ?)",
                        (ts, "SESSION_ACCURACY", details, source_name),
                    )
                    conn.commit()

        # One event per hardest word
        for word in report_json.get("hardest_words", []):
            details = (
                f"line={word.get('line_id','?')} | "
                f"song={word.get('song_id','?')} | "
                f"accuracy={word.get('accuracy_pct','N/A')}% | "
                f"attempts={word.get('total_attempts',0)}"
            )
            self.log_event("HARDEST_WORD", details, source=source_name)

    def log_biomarker(
        self, text: str, source: str = "jiri", session_id: str | None = None
    ) -> dict:
        """
        Run the biomarker extractor on a transcribed utterance and persist results.
        Returns the computed BiomarkerResult as a dict.
        """
        from app.speech.biomarker import extract as _extract

        now_str = datetime.datetime.now().isoformat()
        result = _extract(text)
        d = result.to_dict()
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute(
                    """INSERT INTO biomarkers
                       (timestamp, session_id, source, ttr, brunets_index, honore_statistic,
                        mean_word_length, pause_rate, content_word_density,
                        mean_utterance_length, semantic_coherence, risk_score, word_count, raw_text)
                       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                    (
                        now_str,
                        session_id,
                        source,
                        d["ttr"],
                        d["brunets_index"],
                        d["honore_statistic"],
                        d["mean_word_length"],
                        d["pause_rate"],
                        d["content_word_density"],
                        d["mean_utterance_length"],
                        d["semantic_coherence"],
                        d["risk_score"],
                        d["word_count"],
                        text[:500],
                    ),
                )
                conn.commit()
        # Also log as a regular event for the unified timeline
        self.log_event(
            "SPEECH_BIOMARKER",
            f"risk={d['risk_score']} ttr={d['ttr']} pauses={d['pause_count']} words={d['word_count']}",
            source=source,
        )
        return d

    def get_biomarker_trend(self, n: int = 20, source: str | None = None) -> list[dict]:
        """Return recent biomarker rows for dashboard sparklines (newest first)."""
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                if source:
                    cursor.execute(
                        "SELECT * FROM biomarkers WHERE source=? ORDER BY id DESC LIMIT ?",
                        (source, n),
                    )
                else:
                    cursor.execute(
                        "SELECT * FROM biomarkers ORDER BY id DESC LIMIT ?", (n,)
                    )
                rows = cursor.fetchall()
        return [dict(r) for r in rows]

    def get_recent_log(self, n: int = 50) -> list[dict]:
        """Returns the most recent n logs as a list of dicts (newest first)."""
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT timestamp, event_type, details, source FROM logs ORDER BY id DESC LIMIT ?",
                    (n,),
                )
                rows = cursor.fetchall()

        return [
            {"timestamp": r[0], "event_type": r[1], "details": r[2], "source": r[3]}
            for r in rows
        ]

    def clear_logs(self):
        """Clears the log database (useful for testing and reset)."""
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM logs")
                conn.commit()
