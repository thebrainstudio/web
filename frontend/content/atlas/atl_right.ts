import type { AtlasEntry } from "@/lib/atlas";

/**
 * Right anterior temporal lobe (ATL-R) — Atlas entry.
 *
 * Voice note: where left ATL carries the verbal-semantic burden,
 * right ATL specializes for person-specific knowledge and the
 * affective texture of social meaning. The page leans on Olson,
 * Plotzker, and Ezzyat's 2007 review of the "enigmatic temporal
 * pole" and on Damasio's broader account of how affective content
 * is bound to perceptual experience.
 */
export const atlRightAtlas: AtlasEntry = {
  id: "atl_right",
  fullName: "Right anterior temporal lobe",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "DefaultMode",
  adjacentRegions: ["atl_left", "mtg_right", "ifg_right", "hipp_right"],
  relatedTours: [],
  connectivityTracts: [
    "uncinate-fasciculus",
    "inferior-longitudinal-fasciculus",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "semantic-dementia-right-variant",
      name: "Semantic dementia, right-predominant variant",
      oneLine:
        "Asymmetric atrophy weighted toward right ATL produces a person-specific semantic impairment — recognition of familiar people fails before recognition of general categories of object.",
    },
    {
      id: "prosopagnosia-semantic",
      name: "Semantic prosopagnosia",
      oneLine:
        "Selective inability to retrieve person-specific knowledge (occupation, biographical details, voice) from faces despite preserved perceptual face recognition.",
    },
    {
      id: "fronto-temporal-dementia-social",
      name: "Behavioural-variant FTD (social-knowledge component)",
      oneLine:
        "The right ATL's contribution to social-semantic knowledge is part of why bvFTD patients show characteristic loss of social judgment alongside the more famous vmPFC-related disinhibition.",
    },
  ],
  primaryDiscoveryReference: "olson-2007-enigmatic-temporal-pole",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Right anterior temporal lobe mirrors its left counterpart anatomically — the rostral pole of the temporal lobe and adjacent inferior and lateral surfaces, including Brodmann area 38 and portions of the perirhinal and entorhinal cortices on the medial face [cite:olson-2007-enigmatic-temporal-pole]. The hemispheric asymmetry is functional rather than structural.",
    ],
  },

  functionSection: {
    paragraphs: [
      "Right ATL specializes for person-specific knowledge — the conceptual richness of who someone is to you, separate from the linguistic label of their name. The semantic content here includes biographical details, occupations, personality traits, the affective texture of having known someone, and (in clinical cases of selective impairment) the binding of voice and face to identity [cite:olson-2007-enigmatic-temporal-pole].",
      "Within the hub-and-spoke framework, ATL is bilateral at the level of the semantic hub itself, with left ATL carrying the heaviest verbal-semantic burden (naming, sentence-level meaning) and right ATL carrying the heaviest person-specific and social-semantic burden (recognition of familiar people, social-relational knowledge, the affective coloration of meaningful experience) [cite:patterson-2007-where-semantic-knowledge]. The asymmetry shows up cleanest in cases of unilateral atrophy — right-predominant semantic dementia patients fail at person recognition before they fail at object recognition.",
      "Olson and colleagues' 2007 review of the \"enigmatic temporal pole\" proposed that the region's role is to bind highly processed perceptual inputs to visceral emotional responses, with the binding remaining channel-specific (dorsal/auditory, medial/olfactory, ventral/visual) [cite:olson-2007-enigmatic-temporal-pole]. This account fits the right-ATL specialization for person knowledge: recognizing someone familiar is not just visual or auditory recognition but the bound, felt-from-inside knowledge of who they are to you.",
      "Damasio's broader account of how somatic and affective content is integrated into conceptual representation extends naturally here: right ATL is part of how the feeling of recognizing someone — the emotional weight of an old face, the felt familiarity of a voice — is constructed [cite:damasio-feeling-of-what-happens].",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Right ATL's cellular architecture is symmetric with left ATL — six-layered association cortex with the long-range pyramidal projections of layer III and V dominating. The cytoarchitecture is uniform across hemispheres; the functional specialization reflects differences in connectivity rather than local cellular composition [cite:olson-2007-enigmatic-temporal-pole].",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "Right ATL's principal long-range connections sit on three pathways. The uncinate fasciculus carries reciprocal connections with right orbitofrontal and ventromedial prefrontal cortex — the route by which person-specific semantic knowledge is bound to affective valuation. The inferior longitudinal fasciculus carries connections with right posterior temporal cortex (including the right fusiform face area outside our 20 regions), supporting the integration of face-perception with face-identity-and-knowledge. Short corticocortical pathways link the region to right ATL's neighbours in the broader social-semantic network [cite:olson-2007-enigmatic-temporal-pole].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Right-predominant semantic dementia (right-variant svPPA) is the canonical clinical demonstration of right ATL's functional specialization. These patients show asymmetric atrophy weighted toward right ATL and present with progressive impairment of person-specific knowledge — failing to recognize familiar faces and voices, losing the felt sense of who family members and old friends are — before showing the broader semantic deficits more associated with left-predominant cases [cite:patterson-2007-where-semantic-knowledge].",
      "Semantic prosopagnosia, the inability to retrieve person-specific knowledge from faces despite preserved perceptual face recognition, is associated with right ATL damage from stroke or temporal lobectomy. The condition is dissociable from apperceptive prosopagnosia (in which face perception itself is impaired) and from anomia for proper names (in which the person is recognized but the name cannot be retrieved). The dissociation establishes person-knowledge as a distinct semantic category with dedicated neural substrate.",
      "In behavioural-variant frontotemporal dementia (bvFTD), the right ATL's contribution to social-semantic knowledge is part of why patients show characteristic loss of social judgment alongside the more famous vmPFC-related disinhibition. The clinical syndrome involves both impaired valuation (vmPFC) and impaired social-knowledge retrieval (right ATL); the combination is what gives the disorder its dramatic effect on the patient's social conduct.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Right ATL's role in person-specific knowledge emerged from the convergence of clinical observation (right-predominant semantic dementia cases described in the 1990s and 2000s by John Hodges, Karalyn Patterson, and colleagues), functional-imaging studies of face and voice identity processing, and lesion-symptom mapping in right temporal-lobectomy patients.",
      "The 2007 Olson, Plotzker, and Ezzyat review in *Brain* — \"The Enigmatic temporal pole\" — was the synthesizing paper that gave the field its current account of right ATL as the binding site for highly processed perceptual inputs and visceral emotional responses, with the binding remaining channel-specific [cite:olson-2007-enigmatic-temporal-pole]. The 2017 Lambon Ralph et al. controlled-semantic-cognition framework extended this picture into the broader hub-and-spoke model in which bilateral ATL serves as the semantic hub with left/right functional asymmetries [cite:lambon-ralph-2017-controlled-semantic].",
    ],
  },
};
