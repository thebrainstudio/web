/**
 * Shared types for the depth-psychology long-form pages.
 *
 * Each entry is a single page like Aion or Gestalt. Prose is an
 * array of paragraphs; Markdown-style "## " prefixes mark section
 * breaks for the renderer. Cross-references to Bridges sections and
 * Atlas regions are typed; the renderer surfaces them as cards in
 * a sidebar.
 *
 * The site's existing TS-module content pattern (field notes,
 * archetype prose) is preserved here. No MDX, no markdown parser —
 * the renderer splits on "## " for headings and treats everything
 * else as a paragraph.
 */

import type { BridgeSectionId } from "@/lib/bridges";
import type { RegionId } from "@/lib/regions";

export type DepthPsychologyEntry = {
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  wordCount: number;
  readMinutes: number;
  /** Bridges sections most directly engaged by this page. */
  bridgeSections: BridgeSectionId[];
  /** Atlas regions most directly engaged by this page. */
  atlasRegions: RegionId[];
  /**
   * Prose. Paragraphs prefixed with "## " are rendered as headings
   * (h3). Plain paragraphs are rendered as body text.
   */
  paragraphs: string[];
};
