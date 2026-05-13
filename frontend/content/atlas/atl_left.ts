import type { AtlasEntry } from "@/lib/atlas";

/**
 * Anterior temporal lobe (left) — Atlas entry.
 *
 * Voice note: ATL is the canonical example of a region whose
 * importance was invisible to the focal-lesion era and became
 * legible only through the convergence of semantic dementia research,
 * fMRI, and computational hub-and-spoke modelling. The page leans on
 * the Patterson/Lambon Ralph tradition, which is the strongest
 * theoretical framework for what semantic memory actually is.
 *
 * The hemispheric asymmetry within ATL is real but partial. Left ATL
 * carries the heaviest verbal-semantic burden; right ATL is more
 * implicated in person-specific knowledge and the affective texture
 * of meaning. The hub itself is bilateral.
 */
export const atlLeftAtlas: AtlasEntry = {
  id: "atl_left",
  fullName: "Anterior temporal lobe (left)",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "DefaultMode",
  adjacentRegions: ["atl_right", "mtg_left", "ifg_left", "hipp_left"],
  relatedTours: ["how-you-read-this-sentence"],
  connectivityTracts: [
    "uncinate-fasciculus",
    "inferior-longitudinal-fasciculus",
    "arcuate-fasciculus",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "semantic-dementia",
      name: "Semantic dementia (semantic-variant primary progressive aphasia)",
      oneLine:
        "Progressive bilateral atrophy of anterior temporal lobes produces a selective and gradual erosion of conceptual knowledge — the canonical clinical syndrome that established ATL's semantic-hub status.",
    },
    {
      id: "anomia",
      name: "Anomia (naming impairment)",
      oneLine:
        "Difficulty retrieving names for objects, especially across categories, is one of the more reliable early signs of left ATL damage.",
    },
    {
      id: "herpes-encephalitis",
      name: "Herpes simplex encephalitis",
      oneLine:
        "The virus has a tropism for medial temporal and anterior temporal tissue; recovered patients often show selective semantic memory impairments.",
    },
  ],
  primaryDiscoveryReference: "patterson-2007-where-semantic-knowledge",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "The anterior temporal lobe occupies the rostral pole and adjacent inferior and lateral surfaces of the temporal lobe, anterior to the middle and superior temporal gyri. The region includes the temporal pole proper (Brodmann area 38), portions of the perirhinal and entorhinal cortices on its medial face, and parts of the anterior fusiform and inferior temporal gyri on its inferior surface [cite:patterson-2007-where-semantic-knowledge].",
      "ATL is one of the most variably described regions in modern cognitive neuroscience because its boundaries are graded and because the standard fMRI BOLD signal degrades over the anterior temporal pole due to magnetic susceptibility artefacts near the sinuses. The clinical literature (semantic dementia) and the computational-modelling literature (the hub-and-spoke framework) have done much of the heavy lifting in characterizing what the region does, supplemented by the more recent fMRI work that has overcome the imaging difficulties [cite:lambon-ralph-2017-controlled-semantic].",
    ],
  },

  functionSection: {
    paragraphs: [
      "The anterior temporal lobe is the bilateral hub of the semantic-memory system — the cortical region in which modality-specific knowledge (visual features, sounds, actions, words, emotional associations) converges into the modality-invariant conceptual representations on which semantic cognition depends [cite:patterson-2007-where-semantic-knowledge]. The framework that organizes this account, the hub-and-spoke model, holds that distributed sensory-motor regions ('spokes') feed into a bilateral ATL 'hub' where their inputs are bound into the abstract concepts that name a dog as a dog whether one sees it, hears it, or reads about it.",
      "The clinical foundation of this account is semantic dementia. Patients with progressive bilateral atrophy of ATL show a remarkably selective deterioration of conceptual knowledge: word-finding fails, object recognition becomes increasingly approximate, and the felt sense of what familiar things *are* slowly erodes — while episodic memory, attention, and most cognitive functions remain intact in early stages. Mr M, Karalyn Patterson's celebrated patient, could still drive a familiar route to a friend's house but pointed at sheep in the field and asked his wife what they were [cite:patterson-2007-where-semantic-knowledge]. The dissociation is the cleanest demonstration in cognitive neuroscience that semantic memory has dedicated neural substrate distinct from episodic memory.",
      "The 2017 Lambon Ralph et al. synthesis extends the framework to controlled semantic cognition — the picture in which the bilateral ATL hub provides modality-invariant representations and the ventrolateral prefrontal cortex (Broca's region and adjacent inferior frontal cortex) provides the executive control that selects and shapes those representations for the task at hand [cite:lambon-ralph-2017-controlled-semantic]. Semantic cognition is not a single function but a partnership: hub stores meaning, control shapes its use.",
      "The hemispheric asymmetry within ATL is real but partial. Left ATL carries the heaviest verbal-semantic burden — naming, sentence-level comprehension, word-property judgments — while right ATL is more strongly recruited for person-specific knowledge, social knowledge, and the affective texture of conceptual content. Both contribute to most everyday semantic tasks; the asymmetry shows up most clearly when the lesion is unilateral and selective.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "The ATL is dominated by glutamatergic pyramidal neurons across layers III and V, with the extensive long-range projections that situate the region as a connector hub. The cytoarchitecture is typical of association cortex — six-layered, no granular layer IV specialization — reflecting the region's role in integrating distributed inputs rather than receiving fresh sensory information [cite:patterson-2007-where-semantic-knowledge].",
      "Descend into the Cellular View for reconstructed pyramidal neurons from association cortex. The dendritic geometry of layer III and V cells in the temporal pole supports the convergence of inputs from visual, auditory, somatosensory, and limbic regions that the hub-and-spoke framework requires.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The ATL's principal long-range connections sit on three white-matter pathways. The uncinate fasciculus carries reciprocal connections with orbitofrontal and ventromedial prefrontal cortex — the route by which conceptual knowledge and affective valuation are bound [cite:phelps-ledoux-2005-amygdala-contributions]. The inferior longitudinal fasciculus carries connections with posterior temporal and occipital cortex, supporting the integration of visual-object knowledge with conceptual representations. The arcuate fasciculus's ventral indirect segment passes through middle temporal cortex into ATL, contributing to the language network [cite:catani-2005-arcuate-fasciculus].",
      "Within the default-mode network, ATL is a temporal anchor, with reciprocal connectivity to medial prefrontal cortex, posterior cingulate, and angular gyrus through the cingulum bundle and superior longitudinal fasciculus. Its participation in both the semantic-cognition system and the default-mode network is part of why the region is recruited during both deliberate conceptual tasks and spontaneous internally-directed thought [cite:lambon-ralph-2017-controlled-semantic].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Semantic dementia (or, in current nomenclature, semantic-variant primary progressive aphasia) is the canonical clinical syndrome of ATL damage. Onset is typically in the late fifties or early sixties; the presentation is gradual erosion of conceptual knowledge with relative preservation of other cognitive functions; the histopathology is most often TDP-43 inclusions with associated tauopathy in the related variants. The clinical trajectory is one of the more difficult to bear in neurology — patients retain awareness of their growing inability to name and recognize familiar things, and the family watches the conceptual world drain away while the person remains [cite:patterson-2007-where-semantic-knowledge].",
      "Herpes simplex encephalitis has a tropism for medial temporal and anterior temporal tissue. Patients who recover from the acute infection often show selective semantic memory impairments alongside the more famous amnesic syndrome of medial-temporal damage — a natural experiment that confirms the ATL's role in semantic memory independent of its hippocampal neighbours.",
      "Anomia — difficulty retrieving names for objects — is a reliable early sign of left ATL damage from any cause, and the specific pattern of anomia is diagnostic. ATL damage produces a category-general naming impairment in which the patient may be able to provide superordinate ('an animal') but not subordinate ('a giraffe') labels, contrasted with the more category-specific naming deficits that follow damage elsewhere.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The ATL's importance was almost entirely missed by the focal-lesion era because the region's bilateral redundancy meant that unilateral strokes (the typical lesion clinical neurology had to work with) rarely produced clean semantic deficits. The picture changed in the 1990s with John Hodges, Karalyn Patterson, and colleagues' careful description of semantic dementia as a distinct neurodegenerative syndrome with bilateral ATL atrophy and a selective semantic-memory profile [cite:patterson-2007-where-semantic-knowledge].",
      "The 2007 Patterson, Nestor, and Rogers review in *Nature Reviews Neuroscience* — \"Where do you know what you know?\" — was the synthesizing paper that gave the field its current account of ATL as the bilateral hub of semantic memory. The 2017 Lambon Ralph et al. extension, \"The neural and computational bases of semantic cognition,\" added the executive control side of the picture and named the broader controlled-semantic-cognition framework [cite:lambon-ralph-2017-controlled-semantic]. The history here is largely a thirty-year arc from clinical observation through computational modelling to integrated theory.",
    ],
  },
};
