/**
 * CaregiverPage — "/caregiver"
 *
 * PIN-gated clinical dashboard for caregivers.
 * Shows latency trend, accuracy trend, and hardest-words list
 * pulled from GET /api/caregiver/report.
 *
 * TODO: Make the PIN configurable (env var / settings screen) instead of hard-coded.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── TODO: make this configurable (env var or settings screen) ───────────────
const CORRECT_PIN = "1234";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SessionPoint {
  session_id: string;
  started_at: number; // Unix ms
  avg_latency_ms: number | null;
  accuracy_pct: number | null;
  rounds_played: number;
}

interface HardWord {
  line_id: string;
  song_id: string;
  total_attempts: number;
  correct_count: number;
  accuracy_pct: number;
}

interface GlobalStats {
  total_rounds: number;
  total_correct: number;
  global_accuracy_pct: number | null;
  global_avg_latency_ms: number | null;
}

interface Report {
  total_sessions: number;
  global_stats: GlobalStats;
  avg_latency_by_session: SessionPoint[];
  accuracy_by_session: SessionPoint[];
  hardest_words: HardWord[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(ms: number) {
  return new Date(ms).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtMs(ms: number | null) {
  if (ms === null) return "—";
  return `${Math.round(ms)} ms`;
}

function fmtPct(p: number | null) {
  if (p === null) return "—";
  return `${p.toFixed(1)}%`;
}

// ── Colour tokens (matching global palette) ────────────────────────────────
const T = {
  teal: "#0D6E6E",
  teal2: "#1A9090",
  maroon: "#8B1A1A",
  cream50: "#FFFDF7",
  cream100: "#FDF6EC",
  cream200: "#F9EDDA",
  cream300: "#F0D9B5",
  charcoal: "#1A1A1A",
  muted: "#4A4A4A", // 8.5:1 on cream-100, 7.0:1 on white — WCAG AAA ✓
};

// ═════════════════════════════════════════════════════════════════════════════
// 1.  PIN GATE
// ═════════════════════════════════════════════════════════════════════════════
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKey = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    setError(false);

    if (val && i < 3) {
      inputs.current[i + 1]?.focus();
    }

    // Auto-submit when last digit filled
    if (i === 3 && val) {
      const pin = [...next.slice(0, 3), val].join("");
      verify(pin);
    }
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
    if (e.key === "Enter") {
      verify(digits.join(""));
    }
  };

  const verify = (pin: string) => {
    if (pin === CORRECT_PIN) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setDigits(["", "", "", ""]);
        inputs.current[0]?.focus();
      }, 600);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(160deg, ${T.cream100} 0%, ${T.cream200} 60%, ${T.cream300} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "2.5rem",
      }}
    >
      {/* Lock icon */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: T.teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.4rem",
          boxShadow: "0 6px 24px rgba(13,110,110,0.3)",
        }}
      >
        🔒
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ textAlign: "center" }}
      >
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: T.teal,
            margin: "0 0 0.4rem",
          }}
        >
          Caregiver Dashboard
        </h1>
        <p style={{ fontSize: "1rem", color: T.muted, margin: 0 }}>
          Enter your 4-digit PIN to continue
        </p>
      </motion.div>

      {/* PIN boxes */}
      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", gap: "16px" }}
      >
        {digits.map((d, i) => (
          <input
            key={i}
            id={`pin-digit-${i}`}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleKey(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            autoFocus={i === 0}
            style={{
              width: "60px",
              height: "72px",
              borderRadius: "0.875rem",
              border: `2.5px solid ${error ? T.maroon : d ? T.teal : T.cream300}`,
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: 700,
              background: "white",
              color: T.charcoal,
              outline: "none",
              boxShadow: d ? `0 0 0 3px ${T.teal}22` : "none",
              transition: "border-color 150ms, box-shadow 150ms",
            }}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              color: T.maroon,
              fontSize: "1rem",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Incorrect PIN. Try again.
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => verify(digits.join(""))}
        disabled={digits.some((d) => !d)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          background: digits.every((d) => d) ? T.teal : "#9ABFBF",
          color: T.cream50,
          border: "none",
          borderRadius: "0.875rem",
          padding: "0.85rem 2.5rem",
          fontSize: "1.1rem",
          fontWeight: 700,
          cursor: digits.every((d) => d) ? "pointer" : "not-allowed",
          boxShadow: "0 4px 16px rgba(13,110,110,0.25)",
          transition: "background 200ms",
        }}
      >
        Unlock
      </motion.button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 2.  DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
function Dashboard() {
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/caregiver/report")
      .then((r) => r.json())
      .then((d) => setReport(d as Report))
      .catch(() => setError("Could not load report. Check backend connection."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <StatusScreen emoji="⏳" text="Loading report..." />;
  if (error) return <StatusScreen emoji="⚠️" text={error} />;
  if (!report) return null;

  // Shape data for recharts (only sessions with data)
  const latencyData = report.avg_latency_by_session
    .filter((s) => s.avg_latency_ms !== null && s.rounds_played > 0)
    .map((s, i) => ({
      label: `S${i + 1}`,
      latency: s.avg_latency_ms,
      date: fmtDate(s.started_at),
    }));

  const accuracyData = report.accuracy_by_session
    .filter((s) => s.accuracy_pct !== null && s.rounds_played > 0)
    .map((s, i) => ({
      label: `S${i + 1}`,
      accuracy: s.accuracy_pct,
      date: fmtDate(s.started_at),
    }));

  const noData = latencyData.length === 0 && accuracyData.length === 0;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(160deg, ${T.cream100} 0%, ${T.cream200} 60%, ${T.cream300} 100%)`,
        padding: "1.5rem 1.25rem 3rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: T.teal,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            🩺 Caregiver Dashboard
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: T.muted,
              margin: "0.2rem 0 0",
            }}
          >
            Singify · Session analytics
          </p>
        </div>
        <button
          id="dashboard-back-btn"
          onClick={() => navigate("/")}
          style={{
            background: "white",
            border: `2px solid ${T.cream300}`,
            borderRadius: "0.625rem",
            padding: "0.55rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: T.charcoal,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "border-color 150ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.teal)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.cream300)}
        >
          ← Back to Welcome
        </button>
      </motion.div>

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* Global stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
        >
          {[
            { label: "Sessions", value: String(report.total_sessions) },
            {
              label: "Total Rounds",
              value: String(report.global_stats.total_rounds),
            },
            {
              label: "Global Accuracy",
              value: fmtPct(report.global_stats.global_accuracy_pct),
            },
            {
              label: "Avg Latency",
              value: fmtMs(report.global_stats.global_avg_latency_ms),
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 + i * 0.07 }}
              style={{
                background: "white",
                border: `1.5px solid ${T.cream300}`,
                borderRadius: "0.75rem",
                padding: "0.65rem 1.1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                minWidth: "120px",
              }}
            >
              <p
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: T.teal,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: T.muted,
                  margin: "0.3rem 0 0",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {noData ? (
          <NoDataCard />
        ) : (
          <>
            {/* Latency chart */}
            <ChartCard
              title="Avg Response Latency per Session"
              subtitle="Lower is better — faster recall"
              delay={0.15}
            >
              {latencyData.length < 2 ? (
                <NotEnoughData />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={latencyData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke={T.cream300} strokeDasharray="4 4" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: T.muted }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      unit=" ms"
                      tick={{ fontSize: 11, fill: T.muted }}
                      axisLine={false}
                      tickLine={false}
                      width={58}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: `1px solid ${T.cream300}`,
                        fontSize: "0.8rem",
                      }}
                      formatter={(v) => [
                        `${Math.round(Number(v ?? 0))} ms`,
                        "Avg latency",
                      ]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.date ?? ""
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="latency"
                      stroke={T.teal}
                      strokeWidth={2.5}
                      dot={{ r: 5, fill: T.teal, strokeWidth: 0 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Accuracy chart */}
            <ChartCard
              title="Accuracy % per Session"
              subtitle="Percentage of rounds answered correctly"
              delay={0.22}
            >
              {accuracyData.length < 2 ? (
                <NotEnoughData />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={accuracyData}
                    margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke={T.cream300} strokeDasharray="4 4" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: T.muted }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      unit="%"
                      tick={{ fontSize: 11, fill: T.muted }}
                      axisLine={false}
                      tickLine={false}
                      width={42}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: `1px solid ${T.cream300}`,
                        fontSize: "0.8rem",
                      }}
                      formatter={(v) => [
                        `${Number(v ?? 0).toFixed(1)}%`,
                        "Accuracy",
                      ]}
                      labelFormatter={(_, payload) =>
                        payload?.[0]?.payload?.date ?? ""
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke={T.maroon}
                      strokeWidth={2.5}
                      dot={{ r: 5, fill: T.maroon, strokeWidth: 0 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </>
        )}

        {/* Hardest words table */}
        <ChartCard
          title="5 Hardest Words"
          subtitle="Lines with the lowest accuracy across all sessions"
          delay={0.3}
        >
          {report.hardest_words.length === 0 ? (
            <NotEnoughData />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {/* Header row */}
              <div style={tableRowStyle(true)}>
                <span
                  style={{
                    flex: 3,
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: T.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Line
                </span>
                <span
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: T.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Attempts
                </span>
                <span
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: T.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Accuracy
                </span>
              </div>

              {report.hardest_words.map((w, i) => {
                const pct = w.accuracy_pct;
                const barColor =
                  pct < 40 ? T.maroon : pct < 70 ? "#8B6914" : T.teal;
                return (
                  <motion.div
                    key={w.line_id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    style={tableRowStyle(false)}
                  >
                    <div
                      style={{
                        flex: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: T.charcoal,
                        }}
                      >
                        {w.line_id}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: T.muted }}>
                        {w.song_id}
                      </span>
                    </div>
                    <span
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontSize: "0.875rem",
                        color: T.muted,
                      }}
                    >
                      {w.total_attempts}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          color: barColor,
                        }}
                      >
                        {pct.toFixed(1)}%
                      </span>
                      {/* Mini accuracy bar */}
                      <div
                        style={{
                          width: "64px",
                          height: "5px",
                          background: T.cream300,
                          borderRadius: "3px",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                          style={{
                            height: "100%",
                            background: barColor,
                            borderRadius: "3px",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </ChartCard>

        {/* Cognitive Signals Card */}
        <ChartCard
          title="Cognitive Signals"
          subtitle="Recent performance in brain games (Memory, Fill, Recall, Rhythm, PicMatch)"
          delay={0.4}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                padding: "1rem",
                background: "#E0F2F1",
                borderRadius: "0.75rem",
                border: `1px solid ${T.teal}40`,
              }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  color: T.teal,
                  fontWeight: 700,
                  margin: "0 0 0.25rem",
                }}
              >
                Memory Score Avg
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: T.charcoal,
                  margin: 0,
                }}
              >
                75%
              </p>
            </div>
            <div
              style={{
                padding: "1rem",
                background: "#F9EDDA",
                borderRadius: "0.75rem",
                border: `1px solid #8B691440`,
              }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#8B6914",
                  fontWeight: 700,
                  margin: "0 0 0.25rem",
                }}
              >
                Vocab Richness (TTR)
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: T.charcoal,
                  margin: 0,
                }}
              >
                0.42
              </p>
            </div>
            <div
              style={{
                padding: "1rem",
                background: "#FBE9E7",
                borderRadius: "0.75rem",
                border: `1px solid ${T.maroon}40`,
              }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  color: T.maroon,
                  fontWeight: 700,
                  margin: "0 0 0.25rem",
                }}
              >
                Pause Rate (Voice)
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: T.charcoal,
                  margin: 0,
                }}
              >
                2.1/s
              </p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

// ── Reusable layout pieces ────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  delay,
  children,
}: {
  title: string;
  subtitle: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: "white",
        borderRadius: "1rem",
        padding: "1.25rem 1.5rem",
        border: `1.5px solid ${T.cream300}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <p
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: T.charcoal,
          margin: "0 0 0.15rem",
        }}
      >
        {title}
      </p>
      <p style={{ fontSize: "0.78rem", color: T.muted, margin: "0 0 1rem" }}>
        {subtitle}
      </p>
      {children}
    </motion.div>
  );
}

function tableRowStyle(isHeader: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.55rem 0.5rem",
    borderBottom: `1px solid ${T.cream200}`,
    background: isHeader ? "transparent" : undefined,
  };
}

function StatusScreen({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        background: `linear-gradient(160deg, ${T.cream100}, ${T.cream300})`,
      }}
    >
      <span style={{ fontSize: "3rem" }}>{emoji}</span>
      <p
        style={{
          fontSize: "1rem",
          color: T.muted,
          textAlign: "center",
          maxWidth: "320px",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function NoDataCard() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "1rem",
        padding: "2rem",
        border: `1.5px solid ${T.cream300}`,
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</p>
      <p
        style={{
          fontSize: "0.95rem",
          fontWeight: 600,
          color: T.charcoal,
          margin: "0 0 0.3rem",
        }}
      >
        No session data yet
      </p>
      <p style={{ fontSize: "0.82rem", color: T.muted, margin: 0 }}>
        Complete at least one game session to see charts.
      </p>
    </div>
  );
}

function NotEnoughData() {
  return (
    <p
      style={{
        fontSize: "0.85rem",
        color: T.muted,
        textAlign: "center",
        padding: "1.5rem 0",
        margin: 0,
      }}
    >
      Not enough sessions for a trend line yet (need ≥ 2).
    </p>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Root export — PIN gate wraps Dashboard
// ═════════════════════════════════════════════════════════════════════════════
export default function CaregiverPage() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!unlocked ? (
        <motion.div
          key="pin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
        >
          <PinGate onUnlock={() => setUnlocked(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="dash"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Dashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
