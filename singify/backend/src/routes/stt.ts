/**
 * POST /api/stt
 *
 * Real Whisper speech-to-text endpoint.
 * Accepts a multipart `audio` field (webm/wav from the browser MediaRecorder),
 * transcribes it with the persistent Python sidecar, and returns the
 * first meaningful word.
 *
 * Failure path (Whisper down, empty audio, etc.) → returns { transcribed_word: '' }
 * The patient-facing game handles empty submissions warmly — never shows an error.
 */

import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import os from "os";
import path from "path";
import { whisperSidecar } from "../whisperSidecar";

const router = Router();

// Save to disk so the Python process can read the file path directly.
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, os.tmpdir()),
    filename: (_req, _file, cb) =>
      cb(null, `stt_${Date.now()}_${Math.random().toString(36).slice(2)}.webm`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB ceiling
});

/**
 * Assamese ISO 639-1 code.
 * Whisper may not list 'as' in its supported languages and will auto-detect
 * instead — the Python server handles this gracefully.
 *
 * Override via env:  WHISPER_LANG=en  (e.g. for dev/test with English)
 */
const WHISPER_LANG = process.env.WHISPER_LANG ?? "as";

router.post(
  "/",
  upload.single("audio"),
  async (req: Request, res: Response) => {
    const file = req.file;

    // No file uploaded at all
    if (!file) {
      res.status(400).json({ transcribed_word: "", error: "No audio file" });
      return;
    }

    let transcribed_word = "";
    let full_text = "";
    let sidecar_ready = whisperSidecar.isReady;

    try {
      if (!sidecar_ready) {
        const msg = whisperSidecar.isStarting
          ? "Whisper is still loading the model — please try again in a moment"
          : "Whisper is not available";
        throw new Error(msg);
      }

      // Run transcription via the persistent Python process
      const raw = await whisperSidecar.transcribe(file.path, WHISPER_LANG);
      full_text = raw;
      transcribed_word = extractFirstWord(raw);

      console.log(`[STT] "${full_text}" → word: "${transcribed_word}"`);
    } catch (err) {
      // Log for ops visibility; patient-facing UI will never see this
      console.error("[STT] Transcription error:", (err as Error).message);
      // transcribed_word stays '' → fuzzyMatchVoice('', x) → false → is_correct=false → warm feedback
    } finally {
      // Always clean up the temp file
      if (file?.path) fs.unlink(file.path, () => {});
    }

    res.json({ transcribed_word, full_text, mock: false });
  },
);

/**
 * Extract the first meaningful word from Whisper's output.
 *
 * Whisper returns full phrases; we want the single blank word.
 * Strips punctuation, lowercases, returns token[0].
 * Unicode-aware: keeps Assamese script letters (and latin fallback).
 */
function extractFirstWord(text: string): string {
  if (!text) return "";
  const cleaned = text
    .trim()
    .toLowerCase()
    .normalize("NFC")
    // Keep Unicode letters and digits (covers Assamese script)
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();
  return cleaned.split(/\s+/)[0] ?? "";
}

export default router;
