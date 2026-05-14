#!/usr/bin/env node
/**
 * PR 5 — Reading-time consolidation i18n.
 *
 * 1. Adds a shared `reading` namespace across all 6 locale bundles:
 *      reading.words         — "words"
 *      reading.minutesShort  — "min"
 *      reading.minRead       — "min read"
 *
 *    The existing `fieldNotes.words` / `fieldNotes.minRead` and
 *    `depthPsychology.words` / `depthPsychology.minRead` strings are
 *    left in place — pages that use them aren't being rewritten in
 *    this PR (only the new ReadingTime component reads from
 *    `reading.*`).
 *
 * 2. Splits Threshold's m{1,2,3}.meta from embedded word counts +
 *    "min read" into label-only strings. Numeric minutes live in
 *    the page render, not in i18n.
 *
 *      Before:   "Movement one · ~290 words · 2 min read"
 *      After:    "Movement one"
 *
 *    Minutes per movement (used in app/[locale]/threshold/page.tsx):
 *      m1 → 2 min
 *      m2 → 3 min
 *      m3 → 2 min
 *
 * Run from frontend/: node scripts/pr5-reading-time.js
 */

const fs = require("node:fs");
const path = require("node:path");
const MESSAGES_DIR = path.join(__dirname, "..", "messages");

const READING_NAMESPACE = {
  en: { words: "words", minutesShort: "min", minRead: "min read" },
  es: { words: "palabras", minutesShort: "min", minRead: "min de lectura" },
  ca: { words: "paraules", minutesShort: "min", minRead: "min de lectura" },
  th: { words: "คำ", minutesShort: "นาที", minRead: "นาทีในการอ่าน" },
  ja: { words: "語", minutesShort: "分", minRead: "分で読了" },
  "zh-CN": { words: "字", minutesShort: "分钟", minRead: "分钟阅读" },
};

// Threshold movement labels — label only, no word count, no
// "min read" suffix (those move to the ReadingTime component).
const THRESHOLD_META = {
  en: { m1: "Movement one", m2: "Movement two", m3: "Movement three" },
  es: { m1: "Movimiento uno", m2: "Movimiento dos", m3: "Movimiento tres" },
  ca: { m1: "Moviment u", m2: "Moviment dos", m3: "Moviment tres" },
  th: { m1: "บทที่ 1", m2: "บทที่ 2", m3: "บทที่ 3" },
  ja: { m1: "第一楽章", m2: "第二楽章", m3: "第三楽章" },
  "zh-CN": { m1: "第一乐章", m2: "第二乐章", m3: "第三乐章" },
};

for (const locale of ["en", "es", "ca", "th", "ja", "zh-CN"]) {
  const fp = path.join(MESSAGES_DIR, `${locale}.json`);
  const m = JSON.parse(fs.readFileSync(fp, "utf8"));

  // 1. Shared reading namespace
  m.reading = READING_NAMESPACE[locale];

  // 2. Threshold movement labels (label-only)
  if (m.threshold) {
    for (const key of ["m1", "m2", "m3"]) {
      if (m.threshold[key]) {
        m.threshold[key].meta = THRESHOLD_META[locale][key];
      }
    }
  }

  fs.writeFileSync(fp, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`[wrote] ${locale}.json`);
}
