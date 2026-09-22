import { ChildProcess, spawn } from "child_process";
import { createInterface } from "readline";
import path from "path";

type Resolver = {
  resolve: (result: Record<string, any>) => void;
  reject: (err: Error) => void;
};

class BiomarkerSidecar {
  private proc: ChildProcess | null = null;
  private ready = false;
  private starting = false;
  private queue: Resolver[] = [];

  start() {
    if (this.proc || this.starting) return;
    this.starting = true;

    const script = path.resolve(__dirname, "../../scripts/biomarker_pipe.py");

    console.log(`[biomarker] Starting sidecar (script=${script})`);

    const localBin = `${process.env.HOME ?? ""}/.local/bin`;
    const childPath = [localBin, process.env.PATH ?? ""]
      .filter(Boolean)
      .join(":");

    this.proc = spawn("python3", [script], {
      env: { ...process.env, PATH: childPath },
    });

    const rl = createInterface({ input: this.proc.stdout! });

    rl.on("line", (line: string) => {
      let msg: Record<string, any>;
      try {
        msg = JSON.parse(line);
      } catch {
        return;
      }

      if (msg.status === "ready") {
        console.log("[biomarker] Sidecar ready ✓");
        this.ready = true;
        this.starting = false;
        return;
      }

      if (msg.status === "error" || msg.error) {
        if (!this.ready) {
          console.error(
            "[biomarker] Sidecar startup error:",
            msg.reason || msg.error,
          );
          this.ready = false;
          this.starting = false;
          this._flushQueue(
            new Error(msg.reason || msg.error || "Startup failed"),
          );
        } else {
          const resolver = this.queue.shift();
          if (resolver) resolver.reject(new Error(msg.error));
        }
        return;
      }

      if (msg.result) {
        const resolver = this.queue.shift();
        if (resolver) resolver.resolve(msg.result);
      }
    });

    this.proc.stderr?.on("data", (d: Buffer) =>
      process.stderr.write(`[biomarker] ${d.toString()}`),
    );

    this.proc.on("exit", (code) => {
      console.warn(`[biomarker] Sidecar exited (code=${code})`);
      this.proc = null;
      this.ready = false;
      this.starting = false;
      this._flushQueue(new Error(`Biomarker sidecar exited with code ${code}`));
    });

    this.proc.on("error", (err) => {
      console.error("[biomarker] Sidecar spawn error:", err.message);
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

  extract(text: string): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      if (!this.ready || !this.proc) {
        reject(
          new Error(
            this.starting
              ? "Biomarker engine is still loading"
              : "Biomarker engine is not running",
          ),
        );
        return;
      }

      this.queue.push({ resolve, reject });
      const req = JSON.stringify({ text });
      this.proc.stdin!.write(req + "\n");
    });
  }
}

export const biomarkerSidecar = new BiomarkerSidecar();
