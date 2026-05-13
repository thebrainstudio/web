/**
 * Atlas content registry.
 *
 * Each of the 20 regions has an `AtlasEntry`. All 20 are now complete
 * with full seven-section prose and PubMed-verified citations. The
 * `stub()` helper is preserved for the convenience of future
 * additions or temporary reverts.
 *
 * Authoring discipline (read before editing any page):
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

// Left-hemisphere pages.
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

// Right-hemisphere pages.
import { ifgRightAtlas } from "./ifg_right";
import { pstgRightAtlas } from "./pstg_right";
import { mtgRightAtlas } from "./mtg_right";
import { atlRightAtlas } from "./atl_right";
import { aglRightAtlas } from "./agl_right";
import { hgRightAtlas } from "./hg_right";
import { amygRightAtlas } from "./amyg_right";
import { hippRightAtlas } from "./hipp_right";

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
