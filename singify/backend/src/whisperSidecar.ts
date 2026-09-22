/**
 * whisperSidecar.ts
 *
 * Manages a persistent Python child process that runs whisper_server.py.
 * The model is loaded once on startup; all transcription requests reuse it.
 *
 * Protocol: newline-delimited JSON over stdin/stdout.
 *   Node → Python:  { path: string, language?: string }
 *   Python → Node:  { text: string, language?: string } | { status: 'ready' } | { error: string }
 */

import { ChildProcess, spawn } from "child_process";
import { createInterface } from "readline";
import path from "path";

type Resolver = {
  resolve: (text: string) => void;
  reject: (err: Error) => void;
};

class WhisperSidecar {
  private proc: ChildProcess | null = null;
  private ready = false;
  private starting = false;
  /** Serial queue — Whisper is synchronous; requests are processed one at a time. */
  private queue: Resolver[] = [];

  /** Lazily start the sidecar (idempotent). */
  start() {
    if (this.proc || this.starting) return;
    this.starting = true;

    const backend = process.env.WHISPER_BACKEND || "openai";
    const scriptName =
      backend === "qnn" ? "whisper_server_qnn.py" : "whisper_server.py";
    const script = path.resolve(__dirname, `../scripts/${scriptName}`);
    const model = process.env.WHISPER_MODEL ?? "base";

    console.log(
      `[whisper] Starting sidecar (backend=${backend}, model=${model}, script=${script})`,
    );

    // Ensure pip-installed packages (~/.local/bin) are on PATH for the child
    const localBin = `${process.env.HOME ?? ""}/.local/bin`;
    const childPath = [localBin, process.env.PATH ?? ""]
      .filter(Boolean)
      .join(":");

    this.proc = spawn("python3", [script], {
      env: { ...process.env, WHISPER_MODEL: model, PATH: childPath },
    });

    // ── Stdout: newline-delimited JSON responses ──────────────────────────────
    const rl = createInterface({ input: this.proc.stdout! });

    rl.on("line", (line: string) => {
      let msg: Record<string, string>;
      try {
        msg = JSON.parse(line) as Record<string, string>;
      } catch {
        return; // non-JSON — skip
      }

      // Startup status
      if (msg.status === "ready") {
        console.log("[whisper] Sidecar ready ✓");
        this.ready = true;
        this.starting = false;
        return;
      }

      if (msg.status === "error") {
        console.error("[whisper] Sidecar startup error:", msg.error);
        this.ready = false;
        this.starting = false;
        this._flushQueue(new Error(msg.error ?? "Sidecar failed to start"));
        return;
      }

      // Transcription response
      const resolver = this.queue.shift();
      if (!resolver) return;

      if (msg.error) {
        resolver.reject(new Error(msg.error));
      } else {
        resolver.resolve(msg.text ?? "");
      }
    });

    // ── Stderr: forward Python logs to Node console ───────────────────────────
    this.proc.stderr?.on("data", (d: Buffer) =>
      process.stderr.write(`[whisper] ${d.toString()}`),
    );

    // ── Process exit ──────────────────────────────────────────────────────────
    this.proc.on("exit", (code: number | null) => {
      console.warn(`[whisper] Sidecar exited (code=${code})`);
      this.proc = null;
      this.ready = false;
      this.starting = false;
      this._flushQueue(new Error(`Whisper sidecar exited with code ${code}`));
    });

    this.proc.on("error", (err: Error) => {
      console.error("[whisper] Sidecar spawn error:", err.message);
      this.proc = null;
      this.ready = false;
      this.starting = false;
      this._flushQueue(err);
    });
  }

  private _flushQueue(err: Error) {
    for (const r of this.queue) r.reject(err);
    this.queue = [];
  }

  /**
   * Transcribe an audio file.
   * Resolves to the raw transcribed text (may be empty string on silence).
   * Rejects if the sidecar isn't ready or an error occurs.
   */
  transcribe(audioPath: string, language?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.ready || !this.proc) {
        reject(
          new Error(
            this.starting
              ? "Whisper model is still loading — please wait a moment"
              : "Whisper sidecar is not running",
          ),
        );
        return;
      }

      this.queue.push({ resolve, reject });

      const req = JSON.stringify({
        path: audioPath,
        language: language ?? null,
      });
      this.proc.stdin!.write(req + "\n");
    });
  }

  get isReady(): boolean {
    return this.ready;
  }
  get isStarting(): boolean {
    return this.starting;
  }

  stop() {
    if (this.proc) {
      this.proc.kill("SIGTERM");
      this.proc = null;
    }
    this.ready = false;
    this.starting = false;
    this._flushQueue(new Error("Sidecar stopped"));
  }
}

/** Singleton exported to the rest of the backend. */
export const whisperSidecar = new WhisperSidecar();
