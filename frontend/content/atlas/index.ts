/**
 * Atlas content registry.
 *
 * Each of the 20 regions has an `AtlasEntry`. Three are complete and
 * carry the full seven-section prose with citations. The other 17 are
 * stubs — architecturally correct metadata + empty section arrays —
 * which render with a "Under careful review" banner until the prose
 * is written. Adding prose to a stub: edit its file, fill the seven
 * sections, switch `status` from "in-progress" to "complete".
 *
 * Authoring discipline (read before adding to a stub):
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
import { hippLeftAtlas } from "./hipp_left";
import { ifgLeftAtlas } from "./ifg_left";
import { pccAtlas } from "./pcc";

/**
 * Helper for creating a stub entry. Yeo network and one-line
 * disorder list are accurate even on stubs — the page UI surfaces
 * them in the sidebar and grouping immediately.
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

export const atlasEntries: Record<RegionId, AtlasEntry> = {
  // Language network — left hemisphere dominant
  ifg_left: ifgLeftAtlas,
  ifg_right: stub(
    "ifg_right",
    "Right inferior frontal gyrus",
    "FrontoparietalControl",
    ["ifg_left", "mtg_right", "pstg_right"],
    "hagoort-2014-language-architecture",
  ),
  pstg_left: stub(
    "pstg_left",
    "Posterior superior temporal gyrus (left) — Wernicke's region",
    "Auditory",
    ["pstg_right", "mtg_left", "ifg_left", "hg_left"],
    "hickok-poeppel-2007-dual-stream",
  ),
  pstg_right: stub(
    "pstg_right",
    "Posterior superior temporal gyrus (right)",
    "Auditory",
    ["pstg_left", "mtg_right", "hg_right"],
    "hickok-poeppel-2007-dual-stream",
  ),
  mtg_left: stub(
    "mtg_left",
    "Middle temporal gyrus (left)",
    "DefaultMode",
    ["mtg_right", "pstg_left", "atl_left", "agl_left"],
    "binder-desai-2011-semantic-system",
  ),
  mtg_right: stub(
    "mtg_right",
    "Middle temporal gyrus (right)",
    "DefaultMode",
    ["mtg_left", "pstg_right", "atl_right"],
    "binder-desai-2011-semantic-system",
  ),
  atl_left: stub(
    "atl_left",
    "Anterior temporal lobe (left)",
    "DefaultMode",
    ["atl_right", "mtg_left", "ifg_left"],
    "binder-desai-2011-semantic-system",
  ),
  atl_right: stub(
    "atl_right",
    "Anterior temporal lobe (right)",
    "DefaultMode",
    ["atl_left", "mtg_right", "ifg_right"],
    "binder-desai-2011-semantic-system",
  ),
  agl_left: stub(
    "agl_left",
    "Angular gyrus (left)",
    "DefaultMode",
    ["agl_right", "mtg_left", "pstg_left", "pcc"],
    "buckner-2008-default-network",
  ),
  agl_right: stub(
    "agl_right",
    "Angular gyrus (right)",
    "DefaultMode",
    ["agl_left", "mtg_right", "pcc"],
    "buckner-2008-default-network",
  ),

  // Auditory
  hg_left: stub(
    "hg_left",
    "Heschl's gyrus / primary auditory cortex (left)",
    "Auditory",
    ["pstg_left", "hg_right"],
    "kell-2018-auditory-task-network",
  ),
  hg_right: stub(
    "hg_right",
    "Heschl's gyrus / primary auditory cortex (right)",
    "Auditory",
    ["pstg_right", "hg_left"],
    "kell-2018-auditory-task-network",
  ),

  // Default mode + control
  vmpfc: stub(
    "vmpfc",
    "Ventromedial prefrontal cortex",
    "DefaultMode",
    ["dmpfc", "pcc", "amyg_left", "amyg_right"],
    "buckner-2008-default-network",
  ),
  dmpfc: stub(
    "dmpfc",
    "Dorsomedial prefrontal cortex",
    "FrontoparietalControl",
    ["vmpfc", "pcc"],
    "buckner-2008-default-network",
  ),

  pcc: pccAtlas,
  precuneus: stub(
    "precuneus",
    "Precuneus",
    "DefaultMode",
    ["pcc", "agl_left", "agl_right"],
    "fransson-2008-pcc-hub",
  ),

  // Limbic
  amyg_left: stub(
    "amyg_left",
    "Amygdala (left)",
    "Limbic",
    ["amyg_right", "hipp_left", "vmpfc"],
    "ledoux-2014-coming-to-terms-with-fear",
  ),
  amyg_right: stub(
    "amyg_right",
    "Amygdala (right)",
    "Limbic",
    ["amyg_left", "hipp_right", "vmpfc"],
    "ledoux-2014-coming-to-terms-with-fear",
  ),
  hipp_left: hippLeftAtlas,
  hipp_right: stub(
    "hipp_right",
    "Hippocampus (right)",
    "Limbic",
    ["hipp_left", "amyg_right", "atl_right", "precuneus"],
    "scoville-milner-1957-hm",
  ),
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
