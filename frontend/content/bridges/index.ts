/**
 * Bridges content registry — locale-aware.
 *
 * The canonical English content lives in ./sections.ts and is the
 * source of truth for section ids and block structure (kinds, order,
 * citation markers). Each locale exports the same
 * `Record<BridgeSectionId, BridgeSectionContent>` shape from
 * ./{locale}/sections.ts with strings translated; citation markers
 * of the form [cite:...] and Markdown emphasis (*word*) are preserved
 * verbatim so the renderer's parsers keep working.
 *
 * Lookup: `bridgeSectionContentForLocale(locale)` returns a record
 * keyed by section id; missing sections fall back to the English
 * canonical entry per-section, so partial coverage is safe.
 *
 * Adding a new locale: create ./{locale}/sections.ts, import the
 * exported record below, and add it to `contentByLocale`.
 */

import type { BridgeSectionId } from "@/lib/bridges";
import { bridgeSectionContent, type BridgeSectionContent } from "./sections";
import { bridgeSectionContentEs } from "./es/sections";
import { bridgeSectionContentCa } from "./ca/sections";
import { bridgeSectionContentTh } from "./th/sections";
import { bridgeSectionContentJa } from "./ja/sections";
import { bridgeSectionContentZhCn } from "./zh-CN/sections";

export type LocaleBridgeContent = Partial<
  Record<BridgeSectionId, BridgeSectionContent>
>;

const contentByLocale: Record<string, LocaleBridgeContent> = {
  en: bridgeSectionContent,
  es: bridgeSectionContentEs,
  ca: bridgeSectionContentCa,
  th: bridgeSectionContentTh,
  ja: bridgeSectionContentJa,
  "zh-CN": bridgeSectionContentZhCn,
};

/**
 * Locale-aware bridges content lookup. Returns a complete record of
 * sections, falling back to English per section when the requested
 * locale lacks a translation.
 */
export function bridgeSectionContentForLocale(
  locale: string,
): Record<BridgeSectionId, BridgeSectionContent> {
  const localeMap = contentByLocale[locale] ?? {};
  const out: Record<BridgeSectionId, BridgeSectionContent> = {} as Record<
    BridgeSectionId,
    BridgeSectionContent
  >;
  for (const id of Object.keys(bridgeSectionContent) as BridgeSectionId[]) {
    out[id] = localeMap[id] ?? bridgeSectionContent[id];
  }
  return out;
}

// Re-export the canonical English shape for callers that don't need
// the locale-aware lookup.
export { bridgeSectionContent } from "./sections";
export type {
  BridgeSectionContent,
  BridgeParagraphBlock,
} from "./sections";
