/**
 * Site map manifest — three-column model that lets /map render the
 * cross-references between Rooms, Regions, and Long-form content
 * as a static node-link diagram.
 *
 * The data here is hand-authored (not derived) because the
 * room→region mappings are editorial, not algorithmic: which regions
 * a room "calls on" depends on what the room is doing, not just
 * which regions appear in its activation timeline. Same for the
 * long-form essays — their `relatedRegions` are the regions the
 * essay engages thematically, which doesn't map to any field on the
 * essay metadata.
 *
 * Schema:
 *   RoomNode      — a top-level room. `regionIds` is the curated
 *                   list of regions this room foregrounds.
 *   LongFormNode  — a long-form essay (Bridges, Depth Psychology
 *                   subpages, Field Notes essays).
 *   The 20 regions come from `lib/regions.ts` and don't need a
 *   manifest entry — they're already canonical.
 */

import type { RegionId } from "./regions";
import type { BridgeSectionId } from "./bridges";

export type SiteMapRoomId =
  | "mirror"
  | "music"
  | "crosscultural"
  | "cellular"
  | "threshold"
  | "archetypes"
  | "faust"
  | "dante";

export type SiteMapLongFormId =
  // Bridges — the synthesizing index
  | "bridges"
  // Depth Psychology subpages
  | "depthPsychology"
  | "aion"
  | "redBook"
  | "gestalt"
  // Field Notes essays
  | "fieldNotes"
  | "hippocampus"
  | "whatBrainKnows";

export type RoomNode = {
  id: SiteMapRoomId;
  href: string;
  /** Translation key under `nav` for the label. */
  labelKey: string;
  /** Regions this room curates / foregrounds. Editorial choice. */
  regionIds: RegionId[];
};

export type LongFormNode = {
  id: SiteMapLongFormId;
  href: string;
  labelKey: string;
  /** Regions this essay engages thematically. */
  regionIds: RegionId[];
};

export const siteMapRooms: RoomNode[] = [
  {
    id: "mirror",
    href: "/mirror",
    labelKey: "mirror",
    // Mirror is the language network — IFG / pSTG / MTG / ATL / AG.
    regionIds: [
      "ifg_left",
      "pstg_left",
      "mtg_left",
      "atl_left",
      "agl_left",
      "ifg_right",
      "pstg_right",
    ],
  },
  {
    id: "music",
    href: "/music",
    labelKey: "music",
    // Auditory cortex + limbic warmth.
    regionIds: [
      "hg_left",
      "hg_right",
      "pstg_left",
      "pstg_right",
      "vmpfc",
      "amyg_left",
      "amyg_right",
      "hipp_left",
      "hipp_right",
    ],
  },
  {
    id: "crosscultural",
    href: "/crosscultural",
    labelKey: "crosscultural",
    // Mirror's regions plus DMN — the divergence story lives at the
    // seam between the language network and the self-referential
    // network.
    regionIds: [
      "ifg_left",
      "ifg_right",
      "pstg_left",
      "atl_left",
      "atl_right",
      "mtg_left",
      "mtg_right",
      "pcc",
      "precuneus",
    ],
  },
  {
    id: "cellular",
    href: "/cellular",
    labelKey: "cellular",
    // Cellular descends into hippocampal microcircuits. The room
    // isn't strongly region-tagged at the macro scale; the regions
    // it touches at the macro level are hippocampus + entorhinal.
    regionIds: ["hipp_left", "hipp_right"],
  },
  {
    id: "threshold",
    href: "/threshold",
    labelKey: "threshold",
    // DMN-dominant — the essay is about the seam between mind and
    // brain, which lives in the default-mode network.
    regionIds: ["vmpfc", "dmpfc", "pcc", "precuneus", "agl_left"],
  },
  {
    id: "archetypes",
    href: "/archetypes",
    labelKey: "archetypes",
    // Same DMN core; the mandalas read as default-network signatures.
    regionIds: ["vmpfc", "dmpfc", "pcc", "precuneus"],
  },
  {
    id: "faust",
    href: "/faust",
    labelKey: "faust",
    // Faust foregrounds the prediction-error reward axis (vmpfc,
    // dmpfc) plus the language network (Faust's reflective speeches).
    regionIds: ["vmpfc", "dmpfc", "agl_left", "mtg_left", "atl_left"],
  },
  {
    id: "dante",
    href: "/dante",
    labelKey: "dante",
    // Dante is DMN-architecture + the visual / spatial cognition
    // implicit in the geography of the Commedia.
    regionIds: ["pcc", "precuneus", "vmpfc", "dmpfc", "agl_left", "agl_right"],
  },
];

export const siteMapLongForm: LongFormNode[] = [
  {
    id: "bridges",
    href: "/bridges",
    labelKey: "bridges",
    // Bridges touches every region by definition — sample the most
    // commonly involved ones rather than listing all 20.
    regionIds: [
      "ifg_left",
      "pstg_left",
      "mtg_left",
      "agl_left",
      "vmpfc",
      "pcc",
      "precuneus",
      "amyg_left",
      "hipp_left",
    ],
  },
  {
    id: "depthPsychology",
    href: "/depth-psychology",
    labelKey: "depthPsychology",
    // Index page; the three subpages below carry the actual region
    // tags. Surface the DMN core here.
    regionIds: ["vmpfc", "dmpfc", "pcc", "precuneus"],
  },
  {
    id: "aion",
    href: "/depth-psychology/aion",
    labelKey: "aion",
    // Aion is the late-Jung book on the Self; the DMN reading is the
    // load-bearing argument.
    regionIds: ["pcc", "precuneus", "vmpfc", "dmpfc"],
  },
  {
    id: "redBook",
    href: "/depth-psychology/red-book",
    labelKey: "redBook",
    // Active imagination + confrontation with the unconscious —
    // DMN + amygdala + emotional regulation.
    regionIds: ["vmpfc", "dmpfc", "amyg_left", "amyg_right", "agl_left"],
  },
  {
    id: "gestalt",
    href: "/depth-psychology/gestalt",
    labelKey: "gestalt",
    // Gestalt closure as prediction — visual + prefrontal.
    regionIds: ["vmpfc", "dmpfc", "agl_left", "agl_right"],
  },
  {
    id: "fieldNotes",
    href: "/field-notes",
    labelKey: "fieldNotes",
    // Index; the two essays below carry the actual region tags.
    regionIds: ["hipp_left", "hipp_right", "vmpfc"],
  },
  {
    id: "hippocampus",
    href: "/field-notes/hippocampus",
    labelKey: "fieldNotes",
    // The hippocampus essay is hippocampal-network dominant.
    regionIds: ["hipp_left", "hipp_right", "atl_left", "atl_right"],
  },
  {
    id: "whatBrainKnows",
    href: "/field-notes/what-the-brain-knows",
    labelKey: "fieldNotes",
    // The "what the brain knows" essay sits in the predictive-self
    // territory — DMN + vmpfc.
    regionIds: ["vmpfc", "dmpfc", "pcc", "precuneus"],
  },
];

/** Convenience lookup. */
export const siteMapRoomById: Record<SiteMapRoomId, RoomNode> =
  Object.fromEntries(siteMapRooms.map((r) => [r.id, r])) as Record<
    SiteMapRoomId,
    RoomNode
  >;

export const siteMapLongFormById: Record<SiteMapLongFormId, LongFormNode> =
  Object.fromEntries(siteMapLongForm.map((p) => [p.id, p])) as Record<
    SiteMapLongFormId,
    LongFormNode
  >;

/**
 * Bridge section a region points into, if any. Reuses
 * `REGION_BRIDGE_LINKS` from lib/bridges.ts — surfaced here so
 * SiteMapNetwork doesn't have to re-import that module for a
 * single lookup.
 */
export type RegionBridgeMap = Partial<Record<RegionId, BridgeSectionId>>;
