/**
 * Depth-psychology page registry.
 *
 * Each entry is a long-form page. The detail route is
 * /[locale]/depth-psychology/[slug]. The landing route is
 * /[locale]/depth-psychology and aggregates these alongside the
 * existing Threshold, Archetypes, Field Notes, and Bridges pages.
 *
 * Adding a new page: write the content module in this directory,
 * import it here, register it in `depthPsychologyPages`, and the
 * landing page picks it up automatically.
 */

import type { DepthPsychologyEntry } from "./types";
import { aionEntry } from "./aion";
import { redBookEntry } from "./red-book";
import { gestaltEntry } from "./gestalt";

export const depthPsychologyPages: DepthPsychologyEntry[] = [
  aionEntry,
  redBookEntry,
  gestaltEntry,
];

export const depthPsychologyBySlug: Record<string, DepthPsychologyEntry> =
  Object.fromEntries(depthPsychologyPages.map((p) => [p.slug, p]));

export function depthPsychologyPageBySlug(
  slug: string,
): DepthPsychologyEntry | undefined {
  return depthPsychologyBySlug[slug];
}
