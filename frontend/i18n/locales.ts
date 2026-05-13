/**
 * Single source of truth for supported locales.
 *
 * - `en` is the canonical, no-prefix locale (URLs stay clean: /mirror).
 * - All other locales are prefixed (/th/mirror, /ja/mirror, etc.).
 * - English text is canonical; non-English versions ship machine-assisted
 *   and are marked under review until a native speaker signs off.
 *
 * Adding a locale requires:
 *   1. add the code here,
 *   2. add `messages/<code>.json` translated from `messages/en.json`,
 *   3. add a font block in `app/fonts.ts` if a new script is involved,
 *   4. add the html[lang="..."] block to `app/globals.css` if typography
 *      rhythm (line-height, line-break) needs adjustment.
 */

export const locales = ["en", "th", "es", "ca", "ja", "zh-CN"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/**
 * Display labels for the language selector. Each language is shown in
 * its own script; English subtitle is shown beneath for users who can
 * read the script but don't recognise it without a hint.
 */
export const localeMeta: Record<
  Locale,
  { native: string; english: string; code: string; tier1Reviewed: boolean }
> = {
  en: { native: "English", english: "English", code: "EN", tier1Reviewed: true },
  th: { native: "ไทย", english: "Thai", code: "ไทย", tier1Reviewed: false },
  es: { native: "Español", english: "Spanish", code: "ES", tier1Reviewed: false },
  ca: { native: "Català", english: "Catalan", code: "CA", tier1Reviewed: false },
  ja: { native: "日本語", english: "Japanese", code: "日本語", tier1Reviewed: false },
  "zh-CN": {
    native: "中文",
    english: "Chinese (Simplified)",
    code: "中文",
    tier1Reviewed: false,
  },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
