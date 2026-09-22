/**
 * Fuzzy matching utility for submitted answers.
 *
 * Two modes:
 *
 *  fuzzyMatch (tap mode)
 *  ─────────────────────
 *  Exact match or Levenshtein ≤ tolerance.
 *  Tolerance scales with word length:
 *    - len ≤ 3  → 0 (must be exact for short words)
 *    - len 4-5  → 1
 *    - len ≥ 6  → 2
 *
 *  fuzzyMatchVoice (voice mode)
 *  ────────────────────────────
 *  More lenient — Whisper transcription on Assamese is imperfect.
 *  Returns true if EITHER:
 *    (A) Levenshtein distance ≤ 2 (absolute)
 *    (B) Normalised similarity ≥ 0.7  i.e.  1 - (dist / maxLen) ≥ 0.7
 *  Empty submission is always false (unrecognised attempt).
 */

export function fuzzyMatch(submitted: string, target: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase();
  const a = norm(submitted);
  const b = norm(target);

  if (a === b) return true;

  const tolerance = b.length <= 3 ? 0 : b.length <= 5 ? 1 : 2;
  if (tolerance === 0) return false;

  return levenshtein(a, b) <= tolerance;
}

/**
 * Voice-mode fuzzy match — requires either absolute Levenshtein ≤ 2
 * OR normalised string similarity ≥ 0.7.
 */
export function fuzzyMatchVoice(submitted: string, target: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase();
  const a = norm(submitted);
  const b = norm(target);

  // Empty/unrecognised audio → always incorrect (but logged)
  if (!a) return false;
  if (a === b) return true;

  const dist = levenshtein(a, b);

  // Condition A: absolute tolerance ≤ 2
  if (dist <= 2) return true;

  // Condition B: normalised similarity  (1 - dist/maxLen) ≥ 0.7
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return false;
  const similarity = 1 - dist / maxLen;
  return similarity >= 0.7;
}

/** Classic dynamic-programming Levenshtein distance. */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // deletion
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}
