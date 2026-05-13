/**
 * Depth-psychology page registry — locale-aware.
 *
 * Each entry is a long-form page. The detail route is
 * /[locale]/depth-psychology/[slug]. The landing route is
 * /[locale]/depth-psychology and aggregates these alongside the
 * existing Threshold, Archetypes, Field Notes, and Bridges pages.
 *
 * Locale strategy (parallel locale files):
 *  - Canonical English entries live at the top level
 *    (./aion.ts, ./red-book.ts, ./gestalt.ts).
 *  - Per-locale translations live under ./{locale}/{slug}.ts and
 *    export the same DepthPsychologyEntry shape.
 *  - When a locale's translation is missing, the lookup falls back
 *    to English for that specific entry — so partial coverage is
 *    safe.
 *
 * Adding a new locale: create ./{locale}/aion.ts (etc.), import the
 * exported entry below, and add it to the `entriesByLocale` map.
 *
 * Adding a new long-form page: create the canonical English file
 * here, import it, register it in `depthPsychologyPages` and in
 * the `en` row of `entriesByLocale`. Translations follow.
 */

import type { DepthPsychologyEntry } from "./types";
import { aionEntry } from "./aion";
import { redBookEntry } from "./red-book";
import { gestaltEntry } from "./gestalt";

import { aionEntryEs } from "./es/aion";
import { redBookEntryEs } from "./es/red-book";
import { gestaltEntryEs } from "./es/gestalt";

import { aionEntryCa } from "./ca/aion";
import { redBookEntryCa } from "./ca/red-book";
import { gestaltEntryCa } from "./ca/gestalt";

import { aionEntryTh } from "./th/aion";
import { redBookEntryTh } from "./th/red-book";
import { gestaltEntryTh } from "./th/gestalt";

import { aionEntryJa } from "./ja/aion";
import { redBookEntryJa } from "./ja/red-book";
import { gestaltEntryJa } from "./ja/gestalt";

import { aionEntryZhCn } from "./zh-CN/aion";
import { redBookEntryZhCn } from "./zh-CN/red-book";
import { gestaltEntryZhCn } from "./zh-CN/gestalt";

/** Canonical English entries — the source of truth for shape, slugs, and fallback. */
export const depthPsychologyPages: DepthPsychologyEntry[] = [
  aionEntry,
  redBookEntry,
  gestaltEntry,
];

export const depthPsychologyBySlug: Record<string, DepthPsychologyEntry> =
  Object.fromEntries(depthPsychologyPages.map((p) => [p.slug, p]));

/**
 * Locale → slug → entry. When a locale's translation for a slug is
 * absent, callers fall back to the English entry of the same slug.
 */
const entriesByLocale: Record<string, Record<string, DepthPsychologyEntry>> = {
  en: {
    aion: aionEntry,
    "red-book": redBookEntry,
    gestalt: gestaltEntry,
  },
  es: {
    aion: aionEntryEs,
    "red-book": redBookEntryEs,
    gestalt: gestaltEntryEs,
  },
  ca: {
    aion: aionEntryCa,
    "red-book": redBookEntryCa,
    gestalt: gestaltEntryCa,
  },
  th: {
    aion: aionEntryTh,
    "red-book": redBookEntryTh,
    gestalt: gestaltEntryTh,
  },
  ja: {
    aion: aionEntryJa,
    "red-book": redBookEntryJa,
    gestalt: gestaltEntryJa,
  },
  "zh-CN": {
    aion: aionEntryZhCn,
    "red-book": redBookEntryZhCn,
    gestalt: gestaltEntryZhCn,
  },
};

/**
 * Locale-aware lookup. Falls back to English when the requested
 * locale doesn't have a translation for the requested slug.
 */
export function depthPsychologyPageBySlugAndLocale(
  slug: string,
  locale: string,
): DepthPsychologyEntry | undefined {
  return entriesByLocale[locale]?.[slug] ?? entriesByLocale.en[slug];
}

/**
 * Locale-aware list of pages. Each entry resolves to its locale
 * translation or falls back to the English version.
 */
export function depthPsychologyPagesForLocale(
  locale: string,
): DepthPsychologyEntry[] {
  return depthPsychologyPages.map(
    (p) => entriesByLocale[locale]?.[p.slug] ?? p,
  );
}

/** Legacy English-only lookup. New code should prefer the locale-aware variant. */
export function depthPsychologyPageBySlug(
  slug: string,
): DepthPsychologyEntry | undefined {
  return depthPsychologyBySlug[slug];
}
