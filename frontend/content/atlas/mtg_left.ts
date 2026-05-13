import type { AtlasEntry } from "@/lib/atlas";

/**
 * Middle temporal gyrus (left) — Atlas entry.
 *
 * Voice note: MTG-L is the region the semantic-system literature
 * activates more consistently than almost any other in left-hemisphere
 * language tasks, and yet its specific role has been harder to pin
 * down than the anatomically clearer Broca and Wernicke regions. The
 * page leans on Binder & Desai's framework of MTG-L as a node in the
 * distributed semantic system, with the hub-and-spoke account placing
 * it as a heteromodal lexical-semantic region adjacent to (but
 * distinct from) the bilateral ATL hub.
 */
export const mtgLeftAtlas: AtlasEntry = {
  id: "mtg_left",
  fullName: "Middle temporal gyrus (left)",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "DefaultMode",
  adjacentRegions: ["mtg_right", "pstg_left", "atl_left", "agl_left"],
  relatedTours: ["how-you-read-this-sentence"],
  connectivityTracts: [
    "arcuate-fasciculus",
    "inferior-longitudinal-fasciculus",
    "uncinate-fasciculus",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "transcortical-sensory-aphasia",
      name: "Transcortical sensory aphasia",
      oneLine:
        "Damage to posterior MTG and adjacent regions produces a fluent comprehension impairment with preserved repetition — the patient can echo speech they cannot understand.",
    },
    {
      id: "primary-progressive-aphasia-semantic",
      name: "Primary progressive aphasia (semantic variant)",
      oneLine:
        "Although ATL is the predominant atrophy site, MTG involvement is observed and tracks the lexical-semantic deficits characteristic of the disorder.",
    },
    {
      id: "alzheimers-lateral-temporal",
      name: "Alzheimer's disease (lateral temporal atrophy)",
      oneLine:
        "Lateral temporal hypometabolism, including MTG, is among the cortical signatures of disease progression alongside the more famous medial-temporal and posteromedial patterns.",
    },
  ],
  primaryDiscoveryReference: "binder-desai-2011-semantic-system",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "The middle temporal gyrus occupies the lateral surface of the temporal lobe between the superior temporal sulcus above and the inferior temporal sulcus below. It runs the length of the temporal lobe from the temporal pole anteriorly to the angular gyrus posteriorly, where the gyrus's posterior end blends into the inferior parietal lobule. The region corresponds to Brodmann area 21 in the classical cytoarchitectonic map [cite:binder-desai-2011-semantic-system].",
      "Functionally, MTG-L is heterogeneous along its anterior-posterior axis. Its anterior portion blends into the anterior temporal lobe and participates in the semantic hub; its middle portion is the canonical lexical-semantic region recruited by word meaning and sentence-level meaning; its posterior portion blends into the language-network territory that includes pSTG, MTG-posterior, and angular gyrus [cite:lambon-ralph-2017-controlled-semantic].",
    ],
  },

  functionSection: {
    paragraphs: [
      "MTG-L is the region most reliably recruited in left-hemisphere imaging studies of lexical-semantic processing — the meanings of single words, sentence-level meaning, and the integration of word meanings into discourse [cite:binder-desai-2011-semantic-system]. Activity here scales with the conceptual richness of the input rather than its acoustic or orthographic form: hearing a familiar word activates MTG-L more strongly than hearing an unfamiliar but phonologically similar pseudoword; reading a meaningful sentence activates the region more strongly than reading the same words scrambled.",
      "Within the broader semantic-cognition framework, MTG-L participates as a heteromodal lexical-semantic node — a region that binds the verbal form of words to their conceptual content. The bilateral ATL hub provides the modality-invariant concept itself; MTG-L provides the lexical interface that links concepts to language. The two regions are anatomically adjacent and functionally cooperative, which is why their respective contributions have been hard to dissociate cleanly in the imaging literature [cite:lambon-ralph-2017-controlled-semantic].",
      "Beyond word meaning, MTG-L is recruited during sentence comprehension and discourse-level integration. Within the dual-stream model of language, MTG sits on the ventral stream — the route that maps sound onto meaning — and damage to ventral-stream regions including MTG produces comprehension deficits distinct from the production deficits of dorsal-stream damage [cite:hickok-poeppel-2007-dual-stream]. The clinical phenotype is transcortical sensory aphasia: fluent, well-articulated but semantically empty speech with markedly impaired comprehension, distinguished from Wernicke's aphasia by the preserved ability to repeat speech the patient does not understand.",
      "On the right side, MTG-R is more reliably recruited for figurative language, narrative comprehension, and the inference of mental states from biological motion — the broader social and narrative semantics that the left hemisphere does not specialize for. Both hemispheres contribute to most everyday language; the asymmetry is partial.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "MTG-L is dominated by glutamatergic pyramidal neurons across layers III and V, with the inhibitory architecture characteristic of association cortex. The region's role as a heteromodal lexical-semantic node depends on the dense corticocortical connectivity that this pyramidal architecture supports.",
      "Descend into the Cellular View for reconstructed pyramidal neurons from temporal association cortex; the cells illustrate the dendritic geometry that underlies long-range integration in the temporal lobe.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "MTG-L's principal long-range connections place it within both the language network and the semantic-cognition system. The arcuate fasciculus's ventral indirect segment passes through the inferior parietal lobule and posterior MTG, linking the region to inferior frontal cortex (Broca's region) [cite:catani-2005-arcuate-fasciculus]. The inferior longitudinal fasciculus carries connections forward to ATL, supporting the lexical-semantic-to-conceptual mapping that the hub-and-spoke framework requires.",
      "Within the default-mode network, MTG-L is a temporal node coupled with angular gyrus, posterior cingulate, and medial prefrontal cortex. The region's joint participation in language and default-mode systems — like the angular gyrus next door — reflects the deeper continuity between externally-directed linguistic comprehension and internally-directed conceptual thought [cite:andrews-hanna-2010-default-network-functional].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Transcortical sensory aphasia is the canonical clinical syndrome of damage involving posterior MTG-L and adjacent semantic-language regions. The pattern — fluent but empty speech, impaired comprehension, preserved repetition — is the diagnostic complement of conduction aphasia (where repetition is the deficit) and Wernicke's aphasia (where repetition is also impaired). The dissociation establishes that the language network's components contribute distinguishable computations [cite:hickok-poeppel-2007-dual-stream].",
      "In semantic-variant primary progressive aphasia, the predominant atrophy is in ATL bilaterally, but MTG involvement is consistently observed and tracks the lexical-semantic side of the deficit. The progression from ATL into adjacent MTG-L is part of what gives the disorder its characteristic trajectory [cite:patterson-2007-where-semantic-knowledge].",
      "In Alzheimer's disease, lateral temporal hypometabolism — including MTG — is among the cortical signatures of disease progression. The lateral pattern accompanies the more famous medial-temporal atrophy (hippocampal) and posteromedial hypometabolism (precuneus and posterior cingulate), reflecting the disease's broad cortical reach [cite:small-2011-hippocampal-circuit-disorders].",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Unlike Broca and Wernicke, no single nineteenth-century case established MTG's role in language. The region's importance was a discovery of the functional-imaging era, emerging from the convergence of fMRI studies of word meaning, lesion-symptom mapping of post-stroke aphasia, and the computational hub-and-spoke modelling that began with the 1990s neural-network simulations of Tim Rogers, Jay McClelland, and colleagues.",
      "Jeffrey Binder and Rutvik Desai's 2011 review in *Trends in Cognitive Sciences* — \"The neurobiology of semantic memory\" — gave the field its first synthesizing account of the distributed semantic system, placing MTG-L alongside ATL and the angular gyrus as a heteromodal semantic node [cite:binder-desai-2011-semantic-system]. The Lambon Ralph et al. 2017 extension placed MTG-L specifically as the lexical-semantic interface within the controlled-semantic-cognition framework [cite:lambon-ralph-2017-controlled-semantic].",
    ],
  },
};
