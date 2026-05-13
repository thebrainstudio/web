/**
 * Atlas content registry — locale-aware.
 *
 * Each of the 20 regions has a canonical English `AtlasEntry` here.
 * Per-locale translations live under ./{locale}/{regionId}.ts and
 * export an `AtlasTranslation` — only the localizable strings
 * (fullName, disorder names + one-liners, prose section paragraphs).
 *
 * The merger overlays the locale strings onto the canonical English
 * entry at lookup time. Missing keys fall back to English per-field,
 * per-section, per-disorder, so partial coverage is always safe.
 *
 * Citation markers `[cite:id]` and Markdown emphasis (*word*) are
 * preserved verbatim in translated paragraphs so the Prose renderer's
 * parsers and `citationsForSection` extraction keep working.
 *
 * Authoring discipline (read before editing any English page):
 *   - Cite every functional claim. Use `[cite:id]` markers; the
 *     citation id must exist in lib/citations.ts.
 *   - Hedge appropriately. "Implicated in" not "responsible for".
 *   - Hemispheric asymmetries are real but should not be overstated.
 *   - History of Discovery names a person, a year, and a paper. If
 *     the canonical paper isn't available, mark the section as
 *     "in-progress" rather than invent one.
 */

import type { AtlasEntry, YeoNetwork } from "@/lib/atlas";
import type { RegionId } from "@/lib/regions";
import type { AtlasTranslation } from "./types";

// Canonical English entries — left-hemisphere pages.
import { hippLeftAtlas } from "./hipp_left";
import { ifgLeftAtlas } from "./ifg_left";
import { pccAtlas } from "./pcc";
import { pstgLeftAtlas } from "./pstg_left";
import { amygLeftAtlas } from "./amyg_left";
import { precuneusAtlas } from "./precuneus";
import { vmpfcAtlas } from "./vmpfc";
import { dmpfcAtlas } from "./dmpfc";
import { aglLeftAtlas } from "./agl_left";
import { atlLeftAtlas } from "./atl_left";
import { mtgLeftAtlas } from "./mtg_left";
import { hgLeftAtlas } from "./hg_left";

// Canonical English entries — right-hemisphere pages.
import { ifgRightAtlas } from "./ifg_right";
import { pstgRightAtlas } from "./pstg_right";
import { mtgRightAtlas } from "./mtg_right";
import { atlRightAtlas } from "./atl_right";
import { aglRightAtlas } from "./agl_right";
import { hgRightAtlas } from "./hg_right";
import { amygRightAtlas } from "./amyg_right";
import { hippRightAtlas } from "./hipp_right";

// Spanish translations.
import { ifgLeftAtlasEs } from "./es/ifg_left";
import { ifgRightAtlasEs } from "./es/ifg_right";
import { pstgLeftAtlasEs } from "./es/pstg_left";
import { pstgRightAtlasEs } from "./es/pstg_right";
import { mtgLeftAtlasEs } from "./es/mtg_left";
import { mtgRightAtlasEs } from "./es/mtg_right";
import { atlLeftAtlasEs } from "./es/atl_left";
import { atlRightAtlasEs } from "./es/atl_right";
import { aglLeftAtlasEs } from "./es/agl_left";
import { aglRightAtlasEs } from "./es/agl_right";
import { hgLeftAtlasEs } from "./es/hg_left";
import { hgRightAtlasEs } from "./es/hg_right";
import { vmpfcAtlasEs } from "./es/vmpfc";
import { dmpfcAtlasEs } from "./es/dmpfc";
import { pccAtlasEs } from "./es/pcc";
import { precuneusAtlasEs } from "./es/precuneus";
import { amygLeftAtlasEs } from "./es/amyg_left";
import { amygRightAtlasEs } from "./es/amyg_right";
import { hippLeftAtlasEs } from "./es/hipp_left";
import { hippRightAtlasEs } from "./es/hipp_right";

/**
 * Helper for creating a stub entry. Retained for the convenience of
 * any future additions or temporary reverts; not used in this file
 * any longer because every region is complete.
 */
function stub(
  id: RegionId,
  fullName: string,
  yeoNetwork: YeoNetwork,
  adjacentRegions: RegionId[],
  discoveryRef: string,
): AtlasEntry {
  return {
    id,
    fullName,
    glasserIndices: [],
    schaeferIndices: [],
    yeoNetwork,
    adjacentRegions,
    relatedTours: [],
    connectivityTracts: [],
    cellTypes: [],
    disorders: [],
    primaryDiscoveryReference: discoveryRef,
    lastUpdated: "2026-05-13",
    status: "in-progress",
    anatomyAndLandmarks: { paragraphs: [] },
    functionSection: { paragraphs: [] },
    cellTypesSection: { paragraphs: [] },
    connectionsSection: { paragraphs: [] },
    clinicalContext: { paragraphs: [] },
    historyOfDiscovery: { paragraphs: [] },
  };
}
void stub;

export const atlasEntries: Record<RegionId, AtlasEntry> = {
  // Language network — perisylvian regions
  ifg_left: ifgLeftAtlas,
  ifg_right: ifgRightAtlas,
  pstg_left: pstgLeftAtlas,
  pstg_right: pstgRightAtlas,
  mtg_left: mtgLeftAtlas,
  mtg_right: mtgRightAtlas,
  atl_left: atlLeftAtlas,
  atl_right: atlRightAtlas,
  agl_left: aglLeftAtlas,
  agl_right: aglRightAtlas,

  // Auditory
  hg_left: hgLeftAtlas,
  hg_right: hgRightAtlas,

  // Default mode + control
  vmpfc: vmpfcAtlas,
  dmpfc: dmpfcAtlas,
  pcc: pccAtlas,
  precuneus: precuneusAtlas,

  // Limbic
  amyg_left: amygLeftAtlas,
  amyg_right: amygRightAtlas,
  hipp_left: hippLeftAtlas,
  hipp_right: hippRightAtlas,
};

/**
 * Locale → region id → translation overlay. Missing keys fall through
 * to the canonical English value at lookup time.
 */
const translationsByLocale: Record<
  string,
  Partial<Record<RegionId, AtlasTranslation>>
> = {
  es: {
    ifg_left: ifgLeftAtlasEs,
    ifg_right: ifgRightAtlasEs,
    pstg_left: pstgLeftAtlasEs,
    pstg_right: pstgRightAtlasEs,
    mtg_left: mtgLeftAtlasEs,
    mtg_right: mtgRightAtlasEs,
    atl_left: atlLeftAtlasEs,
    atl_right: atlRightAtlasEs,
    agl_left: aglLeftAtlasEs,
    agl_right: aglRightAtlasEs,
    hg_left: hgLeftAtlasEs,
    hg_right: hgRightAtlasEs,
    vmpfc: vmpfcAtlasEs,
    dmpfc: dmpfcAtlasEs,
    pcc: pccAtlasEs,
    precuneus: precuneusAtlasEs,
    amyg_left: amygLeftAtlasEs,
    amyg_right: amygRightAtlasEs,
    hipp_left: hippLeftAtlasEs,
    hipp_right: hippRightAtlasEs,
  },
};

function mergeTranslation(
  base: AtlasEntry,
  t: AtlasTranslation | undefined,
): AtlasEntry {
  if (!t) return base;
  return {
    ...base,
    fullName: t.fullName ?? base.fullName,
    disorders: base.disorders.map((d) => {
      const dt = t.disorders?.[d.id];
      if (!dt) return d;
      return {
        ...d,
        name: dt.name ?? d.name,
        oneLine: dt.oneLine ?? d.oneLine,
      };
    }),
    anatomyAndLandmarks: t.anatomyAndLandmarks ?? base.anatomyAndLandmarks,
    functionSection: t.functionSection ?? base.functionSection,
    cellTypesSection: t.cellTypesSection ?? base.cellTypesSection,
    connectionsSection: t.connectionsSection ?? base.connectionsSection,
    clinicalContext: t.clinicalContext ?? base.clinicalContext,
    historyOfDiscovery: t.historyOfDiscovery ?? base.historyOfDiscovery,
  };
}

/**
 * Locale-aware AtlasEntry lookup. Falls back to English per field
 * when the locale lacks a translation.
 */
export function atlasEntryForLocale(id: RegionId, locale: string): AtlasEntry {
  const base = atlasEntries[id];
  return mergeTranslation(base, translationsByLocale[locale]?.[id]);
}

/** Locale-aware version of `atlasEntries`. */
export function atlasEntriesForLocale(
  locale: string,
): Record<RegionId, AtlasEntry> {
  const out: Record<RegionId, AtlasEntry> = {} as Record<RegionId, AtlasEntry>;
  for (const id of Object.keys(atlasEntries) as RegionId[]) {
    out[id] = atlasEntryForLocale(id, locale);
  }
  return out;
}

/** Legacy English-only lookup. New code should prefer the locale-aware variant. */
export function atlasEntryFor(id: RegionId): AtlasEntry {
  return atlasEntries[id];
}

/**
 * All region ids, returned in a stable order useful for the index
 * page (language network first, then auditory, then default-mode,
 * then limbic).
 */
export const atlasOrder: readonly RegionId[] = [
  "ifg_left",
  "ifg_right",
  "pstg_left",
  "pstg_right",
  "mtg_left",
  "mtg_right",
  "atl_left",
  "atl_right",
  "agl_left",
  "agl_right",
  "hg_left",
  "hg_right",
  "vmpfc",
  "dmpfc",
  "pcc",
  "precuneus",
  "amyg_left",
  "amyg_right",
  "hipp_left",
  "hipp_right",
];
