import type { AtlasEntry } from "@/lib/atlas";

/**
 * Hippocampus (left) — Atlas entry.
 *
 * Scope notes (read before editing):
 *   - The "left/right" distinction in the Atlas is a UX one: we surface
 *     the two hemispheres' pages separately because TRIBE predicts them
 *     separately, but most of the canonical literature treats the
 *     hippocampi together. The functional asymmetries (verbal vs. spatial
 *     memory) are mentioned but not over-stated.
 *   - History of Discovery leads with Scoville & Milner 1957 (Patient HM
 *     / Henry Molaison). This is the right founding story for the page —
 *     it's the moment hippocampal involvement in memory became
 *     unambiguous to clinical neuroscience.
 */
export const hippLeftAtlas: AtlasEntry = {
  id: "hipp_left",
  fullName: "Hippocampus (left)",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "Limbic",
  adjacentRegions: ["hipp_right", "amyg_left", "atl_left", "precuneus"],
  relatedTours: ["the-act-of-remembering"],
  connectivityTracts: ["fornix", "perforant-pathway", "cingulum-bundle"],
  cellTypes: [
    { name: "CA1 pyramidal cell" },
    { name: "CA3 pyramidal cell" },
    { name: "Dentate gyrus granule cell" },
  ],
  disorders: [
    {
      id: "alzheimers",
      name: "Alzheimer's disease",
      oneLine:
        "Among the earliest cortical regions where neurofibrillary tangles appear; volume loss correlates with memory impairment.",
    },
    {
      id: "ptsd",
      name: "Post-traumatic stress disorder",
      oneLine:
        "Reduced hippocampal volume is consistently observed in PTSD; direction of causality remains debated.",
    },
    {
      id: "amnesia",
      name: "Anterograde amnesia (medial temporal type)",
      oneLine:
        "Bilateral hippocampal damage produces the canonical inability to form new declarative memories.",
    },
    {
      id: "temporal-lobe-epilepsy",
      name: "Temporal lobe epilepsy",
      oneLine:
        "The hippocampus is the most common seizure focus in adult focal epilepsy; hippocampal sclerosis is a frequent histopathological finding.",
    },
  ],
  primaryDiscoveryReference: "scoville-milner-1957-hm",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "The hippocampus is a curved structure tucked into the medial temporal lobe, named for its resemblance to a seahorse. In coronal section it shows the layered architecture that gives the region its precise subdivisions — the dentate gyrus, cornu ammonis (CA1, CA2, CA3, CA4), and subiculum — wrapped around a single dense layer of pyramidal neurons [cite:amaral-lavenex-2007-hippocampus-anatomy].",
      "The left hippocampus sits beneath the parahippocampal gyrus, lateral to the brainstem and medial to the temporal horn of the lateral ventricle. Its main efferent bundle, the fornix, arcs forward to the mammillary bodies and anterior thalamus. Inputs arrive through the entorhinal cortex via the perforant pathway.",
    ],
  },

  functionSection: {
    paragraphs: [
      "The hippocampus is centrally involved in encoding new episodic memories — the autobiographical record of events as they happen — and in binding those events to the places, times, and contexts in which they occur [cite:squire-1992-medial-temporal-lobe]. Damage here produces a striking dissociation: skills and habits acquired before the injury remain available, and new motor skills can still be learned, but the deliberate, scene-rich recall of recent personal events becomes impossible [cite:scoville-milner-1957-hm].",
      "Beyond memory, the same circuitry supports spatial cognition. Single-unit recordings in rodents revealed neurons that fire whenever the animal occupies a particular location in its environment — \"place cells\" — and human imaging confirms a homologous role in the construction of cognitive maps [cite:okeefe-dostrovsky-1971-place-cells]. The London taxi driver study famously found posterior hippocampal volume increased with years of navigating the city's irregular streets, suggesting use-dependent structural change in adult brains [cite:maguire-2000-taxi-drivers].",
      "Recent work has reframed the hippocampus not as a passive store but as a constructive engine: the same circuit that retrieves a past scene is recruited when one imagines a possible future scene or a counterfactual past [cite:schacter-addis-2007-constructive-episodic]. Memory and imagination share machinery, which is part of why memories are not stable recordings — each retrieval slightly rewrites the trace.",
      "The hemispheric asymmetry within the hippocampus is real but should not be overstated. The left hippocampus is more consistently recruited for verbal episodic material; the right for spatial and scene-based memory. Both contribute to most everyday remembering.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Hippocampal computation is organized around three principal excitatory cell classes. The dentate gyrus granule cells receive input from entorhinal cortex and project to CA3; the recurrent collaterals of CA3 pyramidal neurons are the textbook substrate for autoassociative recall; CA1 pyramidal neurons receive the CA3 output (Schaffer collaterals) and direct entorhinal input, and they form the principal output of the hippocampal formation [cite:amaral-lavenex-2007-hippocampus-anatomy].",
      "The Cellular View carries reconstructed morphologies of CA1 and CA3 pyramidal neurons and dentate granule cells from open archives, including the NeuroMorpho.org collection. Descend into the cellular layer to see the dendritic geometry behind the population-level signal shown here.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The hippocampus communicates with the rest of the brain through a small number of well-described white-matter bundles. The perforant pathway carries information from layer II of the entorhinal cortex into the dentate gyrus and CA fields — the principal cortical input. The fornix is the dominant output, projecting to the mammillary bodies, anterior thalamus, and septal nuclei, and through these to widespread cortical targets [cite:amaral-lavenex-2007-hippocampus-anatomy].",
      "Functionally, the hippocampus participates in the default-mode network during memory retrieval and future imagination, coupling especially with the posterior cingulate cortex and angular gyrus [cite:buckner-2008-default-network]. During encoding, salient input from the amygdala enhances consolidation, which is one mechanism by which emotionally weighted events are remembered more vividly than neutral ones.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Alzheimer's disease begins, by some accounts, here. Neurofibrillary tangles and synaptic loss appear in entorhinal cortex and hippocampus years before clinical diagnosis, and hippocampal atrophy is one of the most reliable structural biomarkers of early disease [cite:small-2011-hippocampal-circuit-disorders]. The early memory complaints — forgetting recent conversations, the names of new acquaintances — track the regional pathology more closely than later, more global symptoms.",
      "In post-traumatic stress disorder, reduced hippocampal volume has been reported across many imaging studies, but the direction of causation remains contested: smaller hippocampi may be a pre-existing risk factor, a consequence of chronic stress, or both. The literature here is genuinely unsettled, and the careful reading is that the association is robust but not yet a mechanism.",
      "Temporal lobe epilepsy frequently has the hippocampus as its seizure focus, with hippocampal sclerosis as a common histological finding. The phenomenology of temporal lobe seizures — déjà vu, intense unprompted affect, fragments of scene — reflects the structures involved.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The modern understanding of hippocampal function begins with one patient: Henry Molaison (known in the literature only as H.M. until his death in 2008), who in 1953 underwent bilateral medial temporal lobectomy in an attempt to control intractable epilepsy. The surgery left him with a profound and stable anterograde amnesia that William Beecher Scoville and Brenda Milner described in 1957 [cite:scoville-milner-1957-hm].",
      "His preserved intelligence, intact short-term memory, and ability to learn new motor skills made it impossible to dismiss the hippocampus as a generic memory store and forced the field to develop the multiple-systems view of memory we still work within [cite:squire-1992-medial-temporal-lobe]. John O'Keefe's discovery of place cells in the rodent hippocampus in 1971 added the spatial dimension that completed the modern picture [cite:okeefe-dostrovsky-1971-place-cells].",
    ],
  },
};
