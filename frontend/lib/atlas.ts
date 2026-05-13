/**
 * The Region Atlas — deep content layer keyed to lib/regions.ts.
 *
 * Each of the 20 regions has an `AtlasEntry` containing the seven
 * sections specified in the brief:
 *   1. Anatomy & landmarks
 *   2. Function
 *   3. Cell types
 *   4. Connections
 *   5. Clinical context
 *   6. History of discovery
 *   7. The thread (existing Jungian gloss, sourced from lib/regions.ts)
 *
 * Citation discipline: prose is plain UTF-8 with inline `[cite:id]`
 * markers. The id resolves into `lib/citations.ts`. The `<Prose>`
 * renderer splits on these markers and renders each as a small
 * brass superscript that links to the source list at the bottom of
 * the page sidebar.
 *
 * Status field: "complete" means the page is ready to ship to
 * non-experts. "in-progress" means architecture exists and metadata
 * is correct, but the prose hasn't been written yet — the page
 * renders with a "Under careful review" banner.
 *
 * Authoring rule: never invent a function claim. Cite or omit.
 * Wrong neuroscience on a site this carefully made is worse than
 * no neuroscience.
 */

import type { RegionId } from "./regions";

/**
 * Yeo's 7-network parcellation of cortex, plus Auditory which
 * the original Yeo scheme rolls into Somatomotor but which we
 * separate because the auditory regions in our 20 are anchored
 * by primary auditory cortex.
 */
export type YeoNetwork =
  | "Visual"
  | "Somatomotor"
  | "DorsalAttention"
  | "VentralAttention"
  | "Limbic"
  | "FrontoparietalControl"
  | "DefaultMode"
  | "Auditory";

export type YeoNetworkInfo = {
  id: YeoNetwork;
  displayName: string;
  /**
   * Accent color used for the region page's persistent room atmosphere
   * and small color band in the Atlas index. Tuned to the locked
   * Brain Studio palette — not the canonical Yeo colors at full
   * saturation.
   */
  accent: string;
  /** Shorter description for the index page grouping label. */
  shortDescription: string;
};

export const YEO_NETWORKS: Record<YeoNetwork, YeoNetworkInfo> = {
  Visual: {
    id: "Visual",
    displayName: "Visual",
    accent: "#7e7ec0",
    shortDescription: "Posterior cortex; vision from primary to associative.",
  },
  Somatomotor: {
    id: "Somatomotor",
    displayName: "Somatomotor",
    accent: "#5fb0c0",
    shortDescription: "Body schema, primary motor, primary sensory.",
  },
  DorsalAttention: {
    id: "DorsalAttention",
    displayName: "Dorsal Attention",
    accent: "#6fb888",
    shortDescription: "Top-down attention; goal-directed orienting.",
  },
  VentralAttention: {
    id: "VentralAttention",
    displayName: "Ventral Attention",
    accent: "#b87ea8",
    shortDescription: "Salience; bottom-up reorienting to the unexpected.",
  },
  Limbic: {
    id: "Limbic",
    displayName: "Limbic",
    accent: "#d4c478",
    shortDescription: "Affect, memory, motivational valuation.",
  },
  FrontoparietalControl: {
    id: "FrontoparietalControl",
    displayName: "Frontoparietal Control",
    accent: "#e8a04a",
    shortDescription: "Cognitive control; flexible task representation.",
  },
  DefaultMode: {
    id: "DefaultMode",
    displayName: "Default Mode",
    accent: "#c9a961",
    shortDescription: "Self-referential thought; mind-wandering; rest.",
  },
  Auditory: {
    id: "Auditory",
    displayName: "Auditory",
    accent: "#5cc8d6",
    shortDescription: "Primary hearing through to musical and prosodic processing.",
  },
};

/**
 * A prose paragraph. The text is plain UTF-8 with inline `[cite:id]`
 * markers; the renderer parses these into citation superscripts.
 */
export type AtlasParagraph = string;

export type AtlasSection = {
  paragraphs: AtlasParagraph[];
};

/**
 * A clinical disorder mentioned in the Clinical Context section.
 * No claim of causation — the region is *implicated* in research on
 * the disorder. The wording in the prose section is what controls
 * the actual claim; this struct is just the sidebar listing.
 */
export type AtlasDisorder = {
  id: string;
  name: string;
  /** One short clause describing the implication. No causal language. */
  oneLine: string;
};

export type AtlasCellTypeRef = {
  /** Display name — e.g. "CA1 pyramidal cell". */
  name: string;
  /** Optional matching nmo_ids in the cellular/manifest.json. */
  nmoIds?: number[];
};

export type AtlasStatus = "complete" | "in-progress";

export type AtlasEntry = {
  id: RegionId;
  /**
   * The richer human-readable name shown in the hero — "Hippocampus
   * (left)" rather than "Hippocampus (L)".
   */
  fullName: string;
  /** Atlas indices for the sidebar. Empty arrays are acceptable. */
  glasserIndices: number[];
  schaeferIndices: number[];
  yeoNetwork: YeoNetwork;
  /** Adjacent region ids — clickable in the sidebar. */
  adjacentRegions: RegionId[];
  /** Tour ids — `content/tours/*.tour.json` once they exist. */
  relatedTours: string[];
  /** Tract ids — `data/tracts/*.json` once they exist. */
  connectivityTracts: string[];
  /** Cell types observed in this region; links into the cellular manifest. */
  cellTypes: AtlasCellTypeRef[];
  /** Disorders implicated in research; full list in sidebar. */
  disorders: AtlasDisorder[];
  /**
   * Citation id (from lib/citations.ts) for the primary discovery
   * paper. Used in the History of Discovery section and the sidebar.
   */
  primaryDiscoveryReference: string;
  /**
   * ISO date the page was last reviewed. Use to schedule periodic
   * re-checks against new literature.
   */
  lastUpdated: string;
  status: AtlasStatus;

  // The seven sections. Each can be empty for in-progress entries.
  anatomyAndLandmarks: AtlasSection;
  functionSection: AtlasSection;
  cellTypesSection: AtlasSection;
  connectionsSection: AtlasSection;
  clinicalContext: AtlasSection;
  historyOfDiscovery: AtlasSection;
  // The thread comes from lib/regions.ts (theThread + bridgeStrength)
  // — we don't duplicate it here.
};

const CITE_PATTERN = /\[cite:([a-z0-9-]+)\]/gi;

export type ProseSegment =
  | { kind: "text"; value: string }
  | { kind: "cite"; id: string };

/**
 * Split a paragraph string into text segments and citation markers.
 * Empty segments are filtered. Useful for both server rendering and
 * downstream tooling (citation extraction, word counting, etc.).
 */
export function parseProse(input: string): ProseSegment[] {
  const out: ProseSegment[] = [];
  let lastIndex = 0;
  for (const match of input.matchAll(CITE_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      out.push({ kind: "text", value: input.slice(lastIndex, start) });
    }
    out.push({ kind: "cite", id: match[1] });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < input.length) {
    out.push({ kind: "text", value: input.slice(lastIndex) });
  }
  return out;
}

/**
 * Extract every citation id mentioned in a section. Order-preserving,
 * de-duplicated. Used to build the source list in the sidebar.
 */
export function citationsForSection(section: AtlasSection): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of section.paragraphs) {
    for (const seg of parseProse(p)) {
      if (seg.kind === "cite" && !seen.has(seg.id)) {
        seen.add(seg.id);
        out.push(seg.id);
      }
    }
  }
  return out;
}

/**
 * Aggregate every citation id used across a full entry.
 */
export function allCitationsForEntry(entry: AtlasEntry): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const sections: AtlasSection[] = [
    entry.anatomyAndLandmarks,
    entry.functionSection,
    entry.cellTypesSection,
    entry.connectionsSection,
    entry.clinicalContext,
    entry.historyOfDiscovery,
  ];
  for (const s of sections) {
    for (const id of citationsForSection(s)) {
      if (!seen.has(id)) {
        seen.add(id);
        out.push(id);
      }
    }
  }
  // Discovery reference is always included even if not inline-cited.
  if (entry.primaryDiscoveryReference && !seen.has(entry.primaryDiscoveryReference)) {
    seen.add(entry.primaryDiscoveryReference);
    out.push(entry.primaryDiscoveryReference);
  }
  return out;
}

/**
 * Approximate word count for a section. Citations don't count.
 */
export function wordCount(section: AtlasSection): number {
  let total = 0;
  for (const p of section.paragraphs) {
    for (const seg of parseProse(p)) {
      if (seg.kind === "text") {
        total += seg.value.trim().split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return total;
}
