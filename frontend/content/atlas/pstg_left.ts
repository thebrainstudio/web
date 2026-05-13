import type { AtlasEntry } from "@/lib/atlas";

/**
 * Posterior superior temporal gyrus (left) — "Wernicke's region".
 *
 * Voice notes:
 *   - The eponym "Wernicke's area" is contested in contemporary
 *     neurolinguistics. The region's exact boundaries vary across
 *     authors, and the function originally attributed to it (auditory
 *     word comprehension) is distributed across a broader cortical
 *     network. The page uses the eponym but flags this carefully.
 *   - The page sits in the "Auditory" Yeo grouping rather than
 *     "Default Mode" because the canonical role is in spoken-language
 *     comprehension, which is anchored by auditory cortex.
 */
export const pstgLeftAtlas: AtlasEntry = {
  id: "pstg_left",
  fullName: "Posterior superior temporal gyrus (left) — Wernicke's region",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "Auditory",
  adjacentRegions: ["pstg_right", "mtg_left", "ifg_left", "hg_left"],
  relatedTours: ["how-you-read-this-sentence"],
  connectivityTracts: [
    "arcuate-fasciculus",
    "inferior-longitudinal-fasciculus",
    "superior-longitudinal-fasciculus",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer IV granule cell" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "wernicke-aphasia",
      name: "Wernicke's aphasia (fluent aphasia)",
      oneLine:
        "Fluent, well-articulated but semantically empty speech with markedly impaired comprehension; the classical syndrome whose lesion was named for the region.",
    },
    {
      id: "pure-word-deafness",
      name: "Pure word deafness",
      oneLine:
        "Selective inability to comprehend spoken language despite preserved hearing and reading, associated with bilateral lesions involving posterior superior temporal cortex.",
    },
    {
      id: "schizophrenia",
      name: "Schizophrenia (auditory verbal hallucinations)",
      oneLine:
        "Hallucinated voices recruit posterior superior temporal regions in patterns that overlap with normal speech perception.",
    },
  ],
  primaryDiscoveryReference: "wernicke-1874-aphasic-symptom-complex",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "The posterior portion of the left superior temporal gyrus occupies the upper bank of the lateral sulcus, posterior to Heschl's gyrus (primary auditory cortex) and superior to the middle temporal gyrus. The region wraps around the posterior end of the Sylvian fissure and is bordered superiorly by the supramarginal gyrus of the inferior parietal lobule.",
      "The boundaries of \"Wernicke's area\" have never been crisply defined. Different authors include or exclude the planum temporale, the supramarginal gyrus, and parts of BA 22 (the superior temporal cortex proper) and BA 39 (the angular gyrus). The page below uses pSTG-L for the cortical surface and reserves the eponym for the historical referent [cite:hickok-poeppel-2007-dual-stream].",
    ],
  },

  functionSection: {
    paragraphs: [
      "The left posterior superior temporal gyrus is centrally involved in the perception of spoken language — the transformation of acoustic input into lexical and phonological representations [cite:hickok-poeppel-2007-dual-stream]. In Hickok and Poeppel's influential dual-stream model, the dorsal stream couples this region to inferior frontal cortex through the arcuate fasciculus and supports the mapping of speech sound onto articulatory representations; the ventral stream runs through middle and inferior temporal cortex and supports the mapping of speech sound onto meaning [cite:hickok-poeppel-2007-dual-stream].",
      "Damage to this region classically produces a fluent aphasia: speech that is well-articulated, prosodic, and superficially normal in rate but semantically empty, often filled with paraphasias (word substitutions) and neologisms. Crucially, comprehension is markedly impaired — the patient cannot reliably follow spoken instructions or repeat unfamiliar phrases [cite:wernicke-1874-aphasic-symptom-complex]. The classical contrast with Broca's aphasia — non-fluent but comprehending — established the historical two-region model that all subsequent network accounts have refined.",
      "The contemporary refinement is that language comprehension is not localized to this region alone. Functional imaging shows that natural speech engages a perisylvian network extending across superior and middle temporal cortex, angular gyrus, and inferior frontal cortex, with each component contributing partial computations [cite:huth-2016-semantic-maps]. The posterior STG is necessary; it is not sufficient. Wernicke's careful 1874 monograph already anticipated this, describing the region as one node in a connected language system.",
      "On the right side, the homologous region (pSTG-R) is more strongly recruited for prosody, melodic contour, and the affective layer of speech and music. The asymmetry is reliable but partial; both hemispheres contribute to most everyday language use.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Like the rest of association cortex, pSTG-L is dominated by glutamatergic pyramidal neurons across layers III and V, with a robust granular layer IV reflecting the region's role as an early target of auditory thalamic input arriving from primary auditory cortex. Local inhibitory interneurons sculpt the temporal precision required to track the fast acoustic dynamics of speech.",
      "The Cellular View carries reconstructed cortical pyramidal cells from association cortex; descend into the cellular layer to see the dendritic geometry that supports the temporal-precision computation this region performs.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The dorsal stream of the dual-stream model connects pSTG-L to inferior frontal cortex (Broca's region) via the arcuate fasciculus and parts of the superior longitudinal fasciculus, supporting the sound-to-articulation mapping that underlies speech repetition [cite:catani-2005-arcuate-fasciculus]. Damage to this dorsal route specifically — sparing the cortical endpoints — produces conduction aphasia: comprehension and fluent production are preserved, but repetition of unfamiliar phrases is selectively impaired [cite:geschwind-1965-disconnexion-syndromes].",
      "The ventral stream runs through the inferior longitudinal fasciculus and parts of the inferior fronto-occipital fasciculus, supporting the sound-to-meaning mapping that underlies comprehension. Both streams are bidirectional; both contribute to most everyday language tasks [cite:hickok-poeppel-2007-dual-stream]. The classical Wernicke-to-Broca \"information flow\" diagram, while pedagogically useful, oversimplifies a richly recurrent network.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Pure Wernicke's aphasia from a focal lesion confined to pSTG-L is, like pure Broca's aphasia, rarer than the eponym suggests. The clinical syndrome more often results from middle-cerebral-artery infarcts involving pSTG together with the supramarginal gyrus and underlying white matter. Recovery in chronic Wernicke's aphasia depends both on the integrity of right-hemisphere homologues that can partially compensate and on the integrity of the dorsal-stream connections to inferior frontal cortex.",
      "Pure word deafness — the selective inability to comprehend spoken language despite preserved hearing, reading, and speaking — typically requires bilateral lesions involving posterior superior temporal cortex, often sparing primary auditory cortex itself. The condition demonstrates that decoding speech into language is functionally separable from hearing per se.",
      "In schizophrenia, auditory verbal hallucinations recruit posterior superior temporal cortex in patterns that overlap substantially with normal speech perception. The contemporary reading is not that hallucinations occur because pSTG \"misfires\" in isolation but that the network coordinating internal speech generation with monitoring is dysregulated, with pSTG one of several involved nodes.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Carl Wernicke published Der aphasische Symptomencomplex in 1874, when he was twenty-six [cite:wernicke-1874-aphasic-symptom-complex]. The monograph described a series of patients with fluent but unintelligible speech and impaired comprehension following lesions in the posterior portion of the left superior temporal gyrus. Wernicke's contribution was twofold: he distinguished his patients' fluent comprehension deficit from Broca's non-fluent production deficit, and he proposed an explicit connectionist model in which damage to the fibre tract linking the two regions would produce a third syndrome (conduction aphasia) that no one had yet described.",
      "Norman Geschwind's 1965 disconnexion-syndromes paper revived and extended Wernicke's framework for an English-speaking audience that had largely forgotten it under the influence of mid-twentieth-century holism [cite:geschwind-1965-disconnexion-syndromes]. The dual-stream model of Hickok and Poeppel 2007 is the contemporary descendant — Wernicke's connectionist intuition with the white-matter pathways finally mapped [cite:hickok-poeppel-2007-dual-stream].",
    ],
  },
};
