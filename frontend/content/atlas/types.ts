/**
 * Locale-translation shape for atlas regions.
 *
 * The canonical English atlas entries carry the full AtlasEntry type
 * with structural metadata (region id, Yeo network, adjacencies,
 * citations, indices, disorder ids, cell type names). Translations
 * only override the localizable strings, so we avoid duplicating the
 * structural fields per locale.
 *
 * Disorder translations are keyed by disorder id (e.g. "broca-aphasia")
 * so that adding or reordering disorders in the canonical English
 * file does not silently corrupt translations.
 *
 * Partial coverage is safe: a missing locale key (e.g. fullName) or
 * a missing section falls back to the canonical English value via
 * the merger in `./index.ts`. Citation markers [cite:id] and Markdown
 * emphasis (*word*) preserved verbatim in translated paragraphs so
 * the Prose renderer's parsers keep working.
 */

import type { AtlasSection } from "@/lib/atlas";

export type AtlasDisorderTranslation = {
  name?: string;
  oneLine?: string;
};

export type AtlasTranslation = {
  fullName?: string;
  /** Keyed by disorder id from the canonical entry. */
  disorders?: Record<string, AtlasDisorderTranslation>;
  anatomyAndLandmarks?: AtlasSection;
  functionSection?: AtlasSection;
  cellTypesSection?: AtlasSection;
  connectionsSection?: AtlasSection;
  clinicalContext?: AtlasSection;
  historyOfDiscovery?: AtlasSection;
};
