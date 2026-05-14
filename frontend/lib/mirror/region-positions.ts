/**
 * Minimal region data for edge-runtime functions.
 *
 * The full `lib/regions.ts` carries editorial prose (scienceGloss,
 * poeticGloss, jungianGloss, theThread, citations) for each of the 20
 * regions — roughly 70 KB of TS but the dependency graph it pulls in
 * (citation imports, etc.) inflates the Edge Function bundle past
 * Vercel's 1 MB free-tier limit.
 *
 * This module ships only the IDs + the stylized [x, y, z] positions
 * used by the PNG fingerprint composition. Keep in lockstep with
 * `lib/regions.ts`.
 */

import type { RegionId } from "@/lib/regions";

export const REGION_POSITIONS: Record<RegionId, readonly [number, number, number]> = {
  ifg_left: [-0.78, 0.18, 0.45],
  ifg_right: [0.78, 0.18, 0.45],
  pstg_left: [-0.85, 0.05, -0.18],
  pstg_right: [0.85, 0.05, -0.18],
  mtg_left: [-0.86, -0.12, 0.0],
  mtg_right: [0.86, -0.12, 0.0],
  atl_left: [-0.7, -0.05, 0.65],
  atl_right: [0.7, -0.05, 0.65],
  agl_left: [-0.7, 0.6, -0.4],
  agl_right: [0.7, 0.6, -0.4],
  hg_left: [-0.65, 0.1, -0.05],
  hg_right: [0.65, 0.1, -0.05],
  vmpfc: [0.0, -0.3, 0.85],
  dmpfc: [0.0, 0.55, 0.7],
  pcc: [0.0, 0.4, -0.55],
  precuneus: [0.0, 0.6, -0.2],
  amyg_left: [-0.35, -0.45, 0.2],
  amyg_right: [0.35, -0.45, 0.2],
  hipp_left: [-0.45, -0.4, -0.1],
  hipp_right: [0.45, -0.4, -0.1],
};

/** Short editorial displayName per region (no parenthetical hemisphere). */
export const REGION_SHORT_NAMES: Record<RegionId, string> = {
  ifg_left: "Broca's region",
  ifg_right: "IFG",
  pstg_left: "Posterior STG",
  pstg_right: "Posterior STG",
  mtg_left: "Middle Temporal",
  mtg_right: "Middle Temporal",
  atl_left: "Anterior Temporal",
  atl_right: "Anterior Temporal",
  agl_left: "Angular Gyrus",
  agl_right: "Angular Gyrus",
  hg_left: "Heschl's Gyrus",
  hg_right: "Heschl's Gyrus",
  vmpfc: "vmPFC",
  dmpfc: "dmPFC",
  pcc: "PCC",
  precuneus: "Precuneus",
  amyg_left: "Amygdala",
  amyg_right: "Amygdala",
  hipp_left: "Hippocampus",
  hipp_right: "Hippocampus",
};

export function hemisphereInitial(id: RegionId): string {
  if (id.endsWith("_left")) return "L";
  if (id.endsWith("_right")) return "R";
  return "";
}

export const REGION_IDS: readonly RegionId[] = Object.keys(
  REGION_POSITIONS,
) as RegionId[];
