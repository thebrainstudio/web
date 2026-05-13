/**
 * The Connectome — white-matter tracts.
 *
 * Eight canonical major fibre bundles, each with endpoints, function
 * notes, and citation. The geometry is stylized — quadratic Bezier
 * curves between the canonical region positions in lib/regions.ts —
 * not real diffusion-MRI tractography. Real HCP1065 or DSI Studio
 * tractography data would require data licensing and a more involved
 * import pipeline; the page disclosure says so directly.
 *
 * Adding a new tract: append an entry below, ensure endpoint
 * region IDs exist in lib/regions.ts, and add a citation if the
 * new tract has a primary anatomical reference.
 */

import type { RegionId } from "./regions";

export type TractId =
  | "corpus-callosum"
  | "arcuate-fasciculus"
  | "cingulum-bundle"
  | "uncinate-fasciculus"
  | "superior-longitudinal-fasciculus"
  | "inferior-longitudinal-fasciculus"
  | "fornix"
  | "perforant-pathway";

export type Tract = {
  id: TractId;
  /** Display name shown in toggle buttons and the floating label. */
  displayName: string;
  /** One-sentence functional summary. */
  description: string;
  /**
   * Pair of region ids the stylized curve runs between. Real tracts
   * are 3D fibre bundles; we approximate each as a single curve
   * between canonical region positions to make the visualization
   * legible at the persistent brain's scale.
   */
  endpoints: [RegionId, RegionId];
  /** Researcher and year credit shown in the metadata panel. */
  discoveredBy?: string;
  /** Citation id (from lib/citations.ts) for further reading. */
  citationId?: string;
  /** Disorders whose pathway runs through this tract. */
  relatedDisorders?: string[];
};

export const TRACTS: Record<TractId, Tract> = {
  "arcuate-fasciculus": {
    id: "arcuate-fasciculus",
    displayName: "Arcuate fasciculus",
    description:
      "Connects Broca's region in the inferior frontal lobe with posterior superior temporal cortex (Wernicke's region) via a dorsal arching pathway. Central to the dorsal stream of language processing.",
    endpoints: ["ifg_left", "pstg_left"],
    discoveredBy: "Carl Wernicke (anatomical inference, 1874); Marco Catani (in vivo tractography, 2002)",
    citationId: "catani-2002-virtual-dissection",
    relatedDisorders: ["conduction aphasia"],
  },
  "uncinate-fasciculus": {
    id: "uncinate-fasciculus",
    displayName: "Uncinate fasciculus",
    description:
      "Reciprocal connections between anterior temporal cortex and ventromedial / orbitofrontal cortex. Carries the binding of conceptual knowledge to affective valuation.",
    endpoints: ["atl_left", "vmpfc"],
    discoveredBy: "Karl Reil (1809); diffusion tractography by Catani et al. (2002)",
    citationId: "catani-2008-tractography-atlas",
    relatedDisorders: ["frontotemporal dementia", "post-traumatic stress disorder"],
  },
  "cingulum-bundle": {
    id: "cingulum-bundle",
    displayName: "Cingulum bundle",
    description:
      "Runs the length of the cingulate gyrus, carrying the principal medial-cortical connections between posterior cingulate / precuneus and medial prefrontal cortex. Central to the default-mode network's structural backbone.",
    endpoints: ["pcc", "vmpfc"],
    discoveredBy: "Theodor Meynert (1872); contemporary tract account by Catani & Thiebaut de Schotten (2008)",
    citationId: "catani-2008-tractography-atlas",
    relatedDisorders: ["Alzheimer's disease", "major depression"],
  },
  "superior-longitudinal-fasciculus": {
    id: "superior-longitudinal-fasciculus",
    displayName: "Superior longitudinal fasciculus",
    description:
      "Long association bundle running between the frontal lobe and the parietal lobe. Supports attention, working memory, and the dorsal stream of language.",
    endpoints: ["dmpfc", "agl_left"],
    discoveredBy: "Johann Reil (early 19th c.); modern tract account by Catani et al. (2002)",
    citationId: "catani-2002-virtual-dissection",
    relatedDisorders: ["hemispatial neglect (right SLF)", "ADHD"],
  },
  "inferior-longitudinal-fasciculus": {
    id: "inferior-longitudinal-fasciculus",
    displayName: "Inferior longitudinal fasciculus",
    description:
      "Runs through the inferior temporal lobe, connecting occipital cortex with anterior temporal regions. Supports the ventral stream of visual processing and the binding of visual percepts to conceptual meaning.",
    endpoints: ["agl_left", "atl_left"],
    discoveredBy: "Catani et al. (2002) — modern tractography",
    citationId: "catani-2002-virtual-dissection",
    relatedDisorders: ["semantic dementia", "associative agnosias"],
  },
  "fornix": {
    id: "fornix",
    displayName: "Fornix",
    description:
      "The principal output pathway of the hippocampus. Arcs forward and inferiorly to the mammillary bodies and anterior thalamus, completing the medial limbic circuit.",
    endpoints: ["hipp_left", "vmpfc"],
    discoveredBy: "Galen (anatomical); modern functional account from medial-temporal lesion studies (Scoville & Milner, 1957)",
    citationId: "scoville-milner-1957-hm",
    relatedDisorders: ["amnesia", "Alzheimer's disease"],
  },
  "perforant-pathway": {
    id: "perforant-pathway",
    displayName: "Perforant pathway",
    description:
      "Carries the principal cortical input to the hippocampus from layer II of the entorhinal cortex. The substrate of the hippocampal trisynaptic circuit and the entry point for memory encoding.",
    endpoints: ["atl_left", "hipp_left"],
    discoveredBy: "Santiago Ramón y Cajal (1893)",
    citationId: "amaral-lavenex-2007-hippocampus-anatomy",
    relatedDisorders: ["Alzheimer's disease (early degeneration)", "temporal lobe epilepsy"],
  },
  "corpus-callosum": {
    id: "corpus-callosum",
    displayName: "Corpus callosum",
    description:
      "The major commissural pathway between the two cerebral hemispheres. Approximately 200 million axons that carry the bulk of the inter-hemispheric communication on which lateralized functions depend.",
    endpoints: ["agl_left", "agl_right"],
    discoveredBy: "Andreas Vesalius (1543); functional account from Sperry's split-brain work (1960s)",
    citationId: "catani-2002-virtual-dissection",
    relatedDisorders: ["alien hand syndrome", "callosal dysgenesis"],
  },
};

export const TRACT_ORDER: readonly TractId[] = [
  "arcuate-fasciculus",
  "uncinate-fasciculus",
  "cingulum-bundle",
  "superior-longitudinal-fasciculus",
  "inferior-longitudinal-fasciculus",
  "fornix",
  "perforant-pathway",
  "corpus-callosum",
];

/**
 * Return the tracts whose endpoints include the given region. Used
 * by Atlas pages to surface "tracts connecting this region" in the
 * sidebar.
 */
export function tractsForRegion(regionId: RegionId): Tract[] {
  return TRACT_ORDER.map((id) => TRACTS[id]).filter((t) =>
    t.endpoints.includes(regionId),
  );
}
