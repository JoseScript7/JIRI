"""
app/speech/biomarker.py
=======================
Cognitive speech biomarker extractor for JIRI / Singify.

All features are grounded in published dementia-detection research:
  - Type-Token Ratio (TTR)         : Fraser et al. 2015; Luz et al. 2020
  - Brunet's Index                 : Fritsch et al. 2019; Cohen & Pakhomov 2020
  - Honoré's Statistic             : Cohen & Pakhomov 2020
  - Pause / Disfluency Rate        : Yuan et al. 2020 (InterSpeech); Pastoriza-Domínguez et al. 2021
  - Mean Utterance Length          : Luz et al. 2020; Fraser et al. 2015
  - Content-Word Density           : Fraser et al. 2015
  - Noun-Verb Ratio                : Croisile et al. 1996; Yancheva & Rudzicz 2016
  - Semantic Coherence (optional)  : Burke et al. 2023; Colla et al. 2023
  - Composite Risk Score           : weighted combination from Fraser et al. 2015 scheme

DISCLAIMER: These features are research-inspired biomarkers for monitoring
purposes only. They are NOT validated clinical diagnostic tools and MUST NOT
be used as a substitute for professional medical evaluation.
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass, asdict, field
from typing import Optional

# ── Disfluency vocabulary (Yuan et al. 2020) ─────────────────────────────────
DISFLUENCY_TOKENS = {
    "um",
    "uh",
    "er",
    "hmm",
    "mm",
    "hm",
    "ah",
    "like",
    "you know",
    "i mean",
    "sort of",
    "kind of",
    "well",
    "right",
    "okay",
    "so",
}

# ── Basic POS category lists (approximation, no external tagger needed) ──────
# Content words: nouns, verbs, adjectives, adverbs  (Fraser et al. 2015)
# We use closed-class function word lists as exclusion sets — everything else
# is treated as a content word (conservative but reproducible).
FUNCTION_WORDS = {
    "the",
    "a",
    "an",
    "in",
    "on",
    "at",
    "of",
    "to",
    "for",
    "by",
    "with",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "am",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "shall",
    "should",
    "may",
    "might",
    "must",
    "can",
    "could",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "its",
    "our",
    "their",
    "this",
    "that",
    "these",
    "those",
    "and",
    "but",
    "or",
    "nor",
    "so",
    "yet",
    "for",
    "as",
    "if",
    "because",
    "although",
    "while",
    "when",
    "where",
    "who",
    "which",
    "what",
    "that",
    "not",
    "no",
    "nor",
    "neither",
    "just",
    "only",
    "also",
    "then",
    "than",
    "very",
    "too",
    "quite",
}

# Approximate verb stems (for noun-verb ratio estimate)
COMMON_VERB_STEMS = {
    "go",
    "get",
    "make",
    "take",
    "come",
    "give",
    "know",
    "think",
    "see",
    "look",
    "want",
    "use",
    "find",
    "tell",
    "ask",
    "seem",
    "feel",
    "try",
    "leave",
    "call",
    "keep",
    "let",
    "begin",
    "show",
    "hear",
    "play",
    "run",
    "move",
    "live",
    "happen",
    "carry",
    "talk",
    "turn",
    "start",
    "work",
}


def _tokenize(text: str) -> list[str]:
    """Lowercase, strip punctuation, split into tokens."""
    text = text.lower()
    # Replace disfluency multi-word phrases first
    text = re.sub(r"\byou\s+know\b", "youknow", text)
    text = re.sub(r"\bi\s+mean\b", "imean", text)
    text = re.sub(r"\bsort\s+of\b", "sortof", text)
    text = re.sub(r"\bkind\s+of\b", "kindof", text)
    tokens = re.findall(r"[a-z']+", text)
    return tokens


def _split_utterances(text: str) -> list[str]:
    """Split on sentence-ending punctuation or clause boundaries."""
    parts = re.split(r"[.!?,;]+", text)
    return [p.strip() for p in parts if p.strip()]


@dataclass
class BiomarkerResult:
    """All computed cognitive markers for a single text sample."""

    # Lexical richness
    ttr: float = 0.0  # Type-Token Ratio
    brunets_index: float = 0.0  # Brunet's W index
    honore_statistic: float = 0.0  # Honoré's R statistic
    mean_word_length: float = 0.0  # Average chars per token

    # Pause & Disfluency (Yuan et al. 2020)
    pause_count: int = 0  # Raw disfluency token count
    pause_rate: float = 0.0  # Disfluency tokens / 100 words

    # Syntactic complexity (Fraser et al. 2015)
    mean_utterance_length: float = 0.0  # Words per clause
    content_word_density: float = 0.0  # Content words / total
    noun_verb_ratio: float = 0.0  # Proxy: non-verb content / verb count

    # Semantic coherence (Burke et al. 2023; Colla et al. 2023)
    semantic_coherence: Optional[float] = None  # None if sentence-transformers absent

    # Composite
    risk_score: float = 0.0  # 0–100; higher = more AD-like markers
    word_count: int = 0
    unique_word_count: int = 0

    def to_dict(self) -> dict:
        return asdict(self)


class BiomarkerExtractor:
    """
    Stateless extractor — call extract(text) with any transcribed utterance.

    If sentence-transformers is installed, semantic_coherence is computed.
    Otherwise it is left as None (graceful degradation).
    """

    def __init__(self):
        self._embedder = None
        self._embedder_tried = False

    def _get_embedder(self):
        if self._embedder_tried:
            return self._embedder
        self._embedder_tried = True
        try:
            from sentence_transformers import SentenceTransformer

            # Multilingual model works for both English and Assamese
            self._embedder = SentenceTransformer(
                "paraphrase-multilingual-MiniLM-L12-v2"
            )
        except ImportError:
            self._embedder = None
        return self._embedder

    # ── Public API ────────────────────────────────────────────────────────────

    def extract(self, text: str) -> BiomarkerResult:
        """Compute all biomarkers for a transcribed text string."""
        result = BiomarkerResult()

        if not text or not text.strip():
            return result

        tokens = _tokenize(text)
        n = len(tokens)  # total tokens
        if n == 0:
            return result

        result.word_count = n

        # ── Disfluency pass ───────────────────────────────────────────────────
        # Check normalised tokens against the disfluency set
        pause_count = sum(
            1
            for t in tokens
            if t in DISFLUENCY_TOKENS or t in {"youknow", "imean", "sortof", "kindof"}
        )
        result.pause_count = pause_count
        result.pause_rate = round((pause_count / n) * 100, 2) if n > 0 else 0.0

        # Remove disfluency tokens for lexical metrics (cleaner measure)
        content_tokens = [
            t
            for t in tokens
            if t not in DISFLUENCY_TOKENS
            and t not in {"youknow", "imean", "sortof", "kindof"}
        ]
        nc = len(content_tokens) or 1  # avoid div/0

        # ── Lexical richness ──────────────────────────────────────────────────
        vocab = set(content_tokens)
        v = len(vocab)  # vocabulary size
        result.unique_word_count = v

        # Type-Token Ratio (Fraser et al. 2015)
        result.ttr = round(v / nc, 4)

        # Mean word length
        result.mean_word_length = round(sum(len(t) for t in content_tokens) / nc, 2)

        # Brunet's W = N^(V^-0.165)  (Fritsch et al. 2019)
        if v > 0 and nc > 0:
            try:
                result.brunets_index = round(nc ** (v**-0.165), 4)
            except (OverflowError, ValueError, ZeroDivisionError):
                result.brunets_index = 0.0

        # Honoré's R = 100 × log(N) / (1 − V1/V)  (Cohen & Pakhomov 2020)
        # V1 = hapax legomena (words appearing exactly once)
        freq: dict[str, int] = {}
        for t in content_tokens:
            freq[t] = freq.get(t, 0) + 1
        v1 = sum(1 for cnt in freq.values() if cnt == 1)
        if v > 0 and v1 < v and nc > 1:
            try:
                result.honore_statistic = round(100 * math.log(nc) / (1 - v1 / v), 2)
            except (ValueError, ZeroDivisionError):
                result.honore_statistic = 0.0

        # ── Syntactic complexity ──────────────────────────────────────────────
        utterances = _split_utterances(text)
        if utterances:
            utt_lengths = [len(_tokenize(u)) for u in utterances if _tokenize(u)]
            result.mean_utterance_length = (
                round(sum(utt_lengths) / len(utt_lengths), 2) if utt_lengths else 0.0
            )

        # Content-word density (Fraser et al. 2015)
        content_words = [t for t in content_tokens if t not in FUNCTION_WORDS]
        result.content_word_density = round(len(content_words) / nc, 4)

        # Noun-verb ratio proxy
        verb_like = [
            t
            for t in content_words
            if any(t.startswith(stem) for stem in COMMON_VERB_STEMS)
        ]
        non_verb_content = len(content_words) - len(verb_like)
        result.noun_verb_ratio = round(non_verb_content / max(len(verb_like), 1), 2)

        # ── Semantic coherence ────────────────────────────────────────────────
        result.semantic_coherence = self._compute_coherence(utterances)

        # ── Composite Risk Score ──────────────────────────────────────────────
        result.risk_score = self._compute_risk(result)

        return result

    def _compute_coherence(self, utterances: list[str]) -> Optional[float]:
        """Mean cosine similarity of consecutive sentence embeddings."""
        if len(utterances) < 2:
            return None
        embedder = self._get_embedder()
        if embedder is None:
            return None
        try:
            import numpy as np

            embs = embedder.encode(utterances, convert_to_numpy=True)
            sims = []
            for i in range(len(embs) - 1):
                a, b = embs[i], embs[i + 1]
                denom = np.linalg.norm(a) * np.linalg.norm(b)
                if denom > 0:
                    sims.append(float(np.dot(a, b) / denom))
            return round(float(np.mean(sims)), 4) if sims else None
        except Exception:
            return None

    def _compute_risk(self, r: BiomarkerResult) -> float:
        """
        Weighted composite score (0–100).
        Higher values indicate more AD-like linguistic patterns.

        Weights derived from feature importances in Fraser et al. 2015 Table 4
        and Luz et al. 2020 supplementary material.
        NOTE: This is a research approximation, NOT a clinical score.
        """
        score = 0.0

        # Low TTR → higher risk  (normal range: 0.4–0.7)
        ttr_risk = max(0.0, (0.55 - r.ttr) / 0.55) * 25
        score += ttr_risk

        # High pause rate → higher risk  (normal < 5 per 100 words)
        pause_risk = min(1.0, r.pause_rate / 20.0) * 20
        score += pause_risk

        # Short utterances → higher risk  (normal MLU > 8 words)
        mlu_risk = max(0.0, (8 - r.mean_utterance_length) / 8) * 20
        score += mlu_risk

        # Low content-word density → higher risk  (normal > 0.45)
        cwd_risk = max(0.0, (0.5 - r.content_word_density) / 0.5) * 20
        score += cwd_risk

        # Short mean word length → higher risk  (normal > 4.5 chars)
        mwl_risk = max(0.0, (4.5 - r.mean_word_length) / 4.5) * 15
        score += mwl_risk

        return round(min(100.0, max(0.0, score)), 1)


# ── Module-level singleton ────────────────────────────────────────────────────
_extractor: Optional[BiomarkerExtractor] = None


def get_extractor() -> BiomarkerExtractor:
    global _extractor
    if _extractor is None:
        _extractor = BiomarkerExtractor()
    return _extractor


def extract(text: str) -> BiomarkerResult:
    """Convenience one-liner: extract(text) → BiomarkerResult."""
    return get_extractor().extract(text)


# ── CLI test ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    samples = [
        # Healthy adult — high TTR, varied syntax
        "I went to the market this morning to buy fresh vegetables and some fruit for the week. "
        "The vendor was very friendly and gave me a good discount on the tomatoes.",
        # AD-like — repetitive, fragmented, high disfluency (from DementiaBank patterns)
        "Um the um the cookie. The boy is getting the cookie. Um. "
        "The woman is washing. Washing the dishes. The water is. Um. On the floor.",
    ]

    ex = BiomarkerExtractor()
    for i, s in enumerate(samples, 1):
        print(f"\n=== Sample {i} ===")
        r = ex.extract(s)
        for k, v in r.to_dict().items():
            print(f"  {k:28s}: {v}")
