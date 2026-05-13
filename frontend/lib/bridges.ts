/**
 * The Bridges layer — the synthesizing index between the site's
 * neuroscience pages and its depth-psychology pages.
 *
 * Each bridge between a neural mechanism and a depth-psychology
 * concept is rated against a four-step scale of empirical support:
 *
 *   tight   — clear empirical correspondence, contemporary consensus
 *             across multiple peer-reviewed sources.
 *   partial — real correspondence but contested, debated, or limited
 *             to one aspect of the concept.
 *   distant — shares territory but the mapping is loose; primarily
 *             metaphorical or phenomenological.
 *   none    — no honest bridge exists; the two languages are
 *             addressing different questions. Naming this is the
 *             site's intellectual discipline — the absence is also
 *             information.
 *
 * The ratings drive both the badge UI on the Bridges page and the
 * bridge cards that appear under each Region Atlas Thread section.
 *
 * Authoring rule: a bridge claim must cite at least one peer-reviewed
 * primary source on the neuroscience side. Depth-psychology references
 * may be primary (Freud, Jung, Otto) or canonical secondary (Damasio,
 * Solms). Empirical claims that cannot be cited cleanly are downgraded
 * to "distant" or dropped.
 */

import type { RegionId } from "./regions";

export type BridgeStrength = "tight" | "partial" | "distant" | "none";

export type BridgeStrengthInfo = {
  id: BridgeStrength;
  label: string;
  /** One sentence the badge tooltip / popover explains. */
  description: string;
  /** Foreground + background tokens for the rating badge. */
  fg: string;
  bg: string;
};

/**
 * Display metadata for each strength. Colors map to the locked palette
 * plus the bridge accent introduced for this layer. Tight uses brass
 * on navy; partial uses brass on bone-cream; distant softens both;
 * none uses oxblood as the explicit warning.
 */
export const BRIDGE_STRENGTHS: Record<BridgeStrength, BridgeStrengthInfo> = {
  tight: {
    id: "tight",
    label: "Tight",
    description:
      "Clear empirical correspondence; contemporary consensus across multiple peer-reviewed sources.",
    fg: "#0a1428",
    bg: "#c9a961",
  },
  partial: {
    id: "partial",
    label: "Partial",
    description:
      "Real correspondence but contested or limited to one aspect of the depth-psychological concept.",
    fg: "#c9a961",
    bg: "#f0e8d8",
  },
  distant: {
    id: "distant",
    label: "Distant",
    description:
      "Shares territory but the mapping is loose; primarily metaphorical or phenomenological.",
    fg: "rgba(201, 169, 97, 0.8)",
    bg: "rgba(240, 232, 216, 0.45)",
  },
  none: {
    id: "none",
    label: "No bridge",
    description:
      "No honest empirical bridge exists; depth psychology and neuroscience are addressing different questions here.",
    fg: "#f0e8d8",
    bg: "#8b3a3a",
  },
};

/**
 * The eleven sections of the Bridges page, in order. Each id is used
 * as the anchor in URLs and as the link target from cross-reference
 * cards in the Region Atlas.
 */
export type BridgeSectionId =
  | "what-this-page-is-for"
  | "dmn-and-self-system"
  | "implicit-cognition-unconscious"
  | "memory-reconstruction"
  | "salience-numinosity"
  | "dmn-deactivation-individuation"
  | "affective-neuroscience-drives"
  | "embodied-cognition"
  | "where-bridges-fail"
  | "how-to-read-the-site"
  | "closing-reflection";

export type BridgeSectionMeta = {
  id: BridgeSectionId;
  /** UI heading. */
  heading: string;
  /** Strength rating displayed on the section header. */
  strength: BridgeStrength;
  /** Optional short subtitle shown beneath the heading. */
  subtitle?: string;
};

/**
 * Map from Region Atlas region id → which Bridges section best
 * grounds the region's depth-psychology Thread. Used by the bridge
 * card under each Atlas page's Thread.
 *
 * The strength here should match the section's strength on the
 * Bridges page (verification rule from the spec). If you change one,
 * change both.
 */
export type RegionBridgeLink = {
  section: BridgeSectionId;
  strength: BridgeStrength;
};

export const REGION_BRIDGE_LINKS: Partial<Record<RegionId, RegionBridgeLink>> = {
  // Tight bridges
  hipp_left: { section: "memory-reconstruction", strength: "tight" },
  hipp_right: { section: "memory-reconstruction", strength: "tight" },
  pcc: { section: "dmn-and-self-system", strength: "tight" },
  precuneus: { section: "dmn-and-self-system", strength: "tight" },
  vmpfc: { section: "dmn-and-self-system", strength: "tight" },
  agl_left: { section: "dmn-and-self-system", strength: "tight" },
  agl_right: { section: "dmn-and-self-system", strength: "tight" },
  dmpfc: { section: "dmn-and-self-system", strength: "tight" },
  // Partial bridges
  amyg_left: { section: "salience-numinosity", strength: "partial" },
  amyg_right: { section: "salience-numinosity", strength: "partial" },
  ifg_left: {
    section: "implicit-cognition-unconscious",
    strength: "partial",
  },
  ifg_right: {
    section: "implicit-cognition-unconscious",
    strength: "partial",
  },
  // Distant — semantic / language regions
  pstg_left: { section: "implicit-cognition-unconscious", strength: "distant" },
  pstg_right: { section: "salience-numinosity", strength: "distant" },
  mtg_left: { section: "implicit-cognition-unconscious", strength: "distant" },
  mtg_right: { section: "implicit-cognition-unconscious", strength: "distant" },
  atl_left: { section: "implicit-cognition-unconscious", strength: "distant" },
  atl_right: { section: "implicit-cognition-unconscious", strength: "distant" },
  // No bridge — primary auditory is mechanism, not psyche
  hg_left: { section: "where-bridges-fail", strength: "none" },
  hg_right: { section: "where-bridges-fail", strength: "none" },
};

/**
 * Bridges section ordering (display order). Section 1 ("what this
 * page is for") and Sections 10–11 (reader guide + closing) do not
 * carry strength ratings — they frame the rest. The eight middle
 * sections each carry a rating.
 */
export const BRIDGE_SECTIONS: readonly BridgeSectionMeta[] = [
  {
    id: "what-this-page-is-for",
    heading: "What this page is for",
    strength: "tight",
    subtitle: "An honest framing.",
  },
  {
    id: "dmn-and-self-system",
    heading:
      "The Default Mode Network and the self-representational system",
    strength: "tight",
    subtitle: "Section 2 · the strongest bridge on the site.",
  },
  {
    id: "implicit-cognition-unconscious",
    heading: "Implicit cognition and the unconscious",
    strength: "tight",
    subtitle: "Section 3.",
  },
  {
    id: "memory-reconstruction",
    heading: "Memory reconstruction and the past as remade",
    strength: "tight",
    subtitle: "Section 4 · the cleanest convergence.",
  },
  {
    id: "salience-numinosity",
    heading: "The salience network and numinosity",
    strength: "partial",
    subtitle: "Section 5.",
  },
  {
    id: "dmn-deactivation-individuation",
    heading:
      "DMN deactivation and ego dissolution / individuation",
    strength: "partial",
    subtitle: "Section 6 · psychedelic and contemplative neuroscience.",
  },
  {
    id: "affective-neuroscience-drives",
    heading:
      "Affective neuroscience and primary emotional systems",
    strength: "partial",
    subtitle: "Section 7 · Panksepp and Solms.",
  },
  {
    id: "embodied-cognition",
    heading: "Embodied cognition and the body in depth psychology",
    strength: "partial",
    subtitle: "Section 8.",
  },
  {
    id: "where-bridges-fail",
    heading: "Where the bridges fail",
    strength: "none",
    subtitle: "Section 9 · the most important section on this page.",
  },
  {
    id: "how-to-read-the-site",
    heading: "What this means for how to read the site",
    strength: "tight",
    subtitle: "Section 10 · a practical guide.",
  },
  {
    id: "closing-reflection",
    heading: "A closing reflection",
    strength: "tight",
    subtitle: "Section 11.",
  },
];
