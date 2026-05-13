import type { AtlasEntry } from "@/lib/atlas";

/**
 * Angular gyrus (left) — Atlas entry.
 *
 * Voice note: the angular gyrus is one of the most-implicated and
 * least-characterized hubs in human cognitive neuroscience. Seghier's
 * 2013 review explicitly framed the region as having "multiple
 * functions and multiple subdivisions," which gives the page its
 * appropriate hedging tone. The region participates in semantic
 * processing, number cognition, memory retrieval, default-mode
 * function, and spatial attention; it is none of those things alone.
 */
export const aglLeftAtlas: AtlasEntry = {
  id: "agl_left",
  fullName: "Angular gyrus (left)",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "DefaultMode",
  adjacentRegions: ["agl_right", "mtg_left", "pstg_left", "pcc"],
  relatedTours: ["how-you-read-this-sentence"],
  connectivityTracts: [
    "superior-longitudinal-fasciculus",
    "inferior-longitudinal-fasciculus",
    "arcuate-fasciculus",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "alexia-without-agraphia",
      name: "Alexia without agraphia (Dejerine's syndrome)",
      oneLine:
        "A classical disconnection syndrome in which lesions affecting left occipital cortex and the splenium of the corpus callosum produce loss of reading with preserved writing; the angular gyrus's role in mapping visual word form to meaning is central to its interpretation.",
    },
    {
      id: "gerstmann",
      name: "Gerstmann syndrome",
      oneLine:
        "Lesions of left inferior parietal cortex around the angular gyrus produce a characteristic tetrad of finger agnosia, left-right disorientation, agraphia, and acalculia.",
    },
    {
      id: "alzheimers-temporoparietal",
      name: "Alzheimer's disease (temporoparietal hypometabolism)",
      oneLine:
        "Reduced temporoparietal metabolism, including the angular gyrus, is among the consistent cortical signatures of the disease alongside posteromedial hypometabolism.",
    },
  ],
  primaryDiscoveryReference: "seghier-2013-angular-gyrus",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "The angular gyrus wraps around the posterior end of the superior temporal sulcus, occupying the posterior portion of the inferior parietal lobule. It is bordered anteriorly by the supramarginal gyrus, superiorly by the intraparietal sulcus, and inferiorly and posteriorly by the middle and superior temporal gyri. The region corresponds to Brodmann area 39 in the classical cytoarchitectonic map [cite:seghier-2013-angular-gyrus].",
      "The angular gyrus is anatomically heterogeneous and admits multiple meaningful subdivisions, with at least three functional clusters discernible in the modern parcellation literature: an anterior portion more strongly coupled with the language network, a middle portion more strongly coupled with the default-mode network, and a dorsal portion more strongly coupled with the frontoparietal attention system. Different studies activate different subregions depending on task; the regional eponym is one of the more polysemous in the literature [cite:seghier-2013-angular-gyrus].",
    ],
  },

  functionSection: {
    paragraphs: [
      "The angular gyrus participates in an unusually wide range of cognitive operations: semantic processing, sentence comprehension, number cognition, attention reorientation, episodic memory retrieval, and the construction of internal scenes [cite:seghier-2013-angular-gyrus]. Mohamed Seghier's 2013 review describes the region as a \"cross-modal hub where converging multisensory information is combined and integrated to comprehend and give sense to events, manipulate mental representations, solve familiar problems, and reorient attention.\"",
      "Within the language network, left angular gyrus contributes to semantic integration — the combining of word meanings into sentence-level and discourse-level representations [cite:binder-desai-2011-semantic-system]. Damage here produces deficits that range from impaired comprehension of complex sentences to specific impairments in metaphor and figurative language, depending on which sub-portion is affected and how much white-matter pathway is involved.",
      "Within the default-mode network, the angular gyrus is one of the network's lateral parietal anchors, with strong reciprocal connectivity to posterior cingulate, precuneus, and medial prefrontal cortex [cite:buckner-2008-default-network]. It is recruited during autobiographical memory retrieval, the construction of imagined scenes, and theory-of-mind tasks involving complex mental-state inference [cite:schurz-2014-fractionating-tom]. The region's joint participation in language and default-mode systems is one piece of evidence for the picture in which the systems supporting external linguistic comprehension and internal scene construction share considerable architecture.",
      "Number cognition adds yet another layer. The angular gyrus is reliably recruited during arithmetic, particularly tasks requiring the retrieval of memorized number facts (multiplication tables) and the manipulation of symbolic numerical representations. Lesions here can produce acalculia — an impairment of arithmetic that is dissociable from more general cognitive decline.",
      "The honest summary is that the angular gyrus is a heteromodal hub in the strictest sense: a region whose function is to bring together information from multiple modalities into integrated representations, with the specific representations depending on which other systems are currently active.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "The angular gyrus is dominated by glutamatergic pyramidal neurons across layers III and V, with the extensive long-range projections characteristic of association cortex. The region's role as a connector hub places its cells among the most distally-projecting in cortex; layer V projection neurons here send axons to multiple cortical regions across both hemispheres [cite:seghier-2013-angular-gyrus].",
      "The Cellular View carries reconstructed association-cortex pyramidal neurons that illustrate the dendritic geometry supporting this connectivity.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The angular gyrus's white-matter connectivity is dominated by the superior longitudinal fasciculus, which carries projections to and from frontal and parietal cortex, and the inferior longitudinal fasciculus, which connects the region with anterior and posterior temporal cortex [cite:catani-2005-arcuate-fasciculus]. The arcuate fasciculus's ventral indirect segment passes through the inferior parietal lobule, linking the angular gyrus to the perisylvian language network and providing one of the routes by which the region contributes to language comprehension.",
      "Functional connectivity studies have repeatedly placed the angular gyrus among the connector hubs of the default-mode network, with the strongest couplings to posterior cingulate cortex, precuneus, and medial prefrontal cortex [cite:andrews-hanna-2010-default-network-functional]. The region's joint participation in language, semantic memory, and default-mode systems is reflected in this dense and heterogeneous connectivity profile.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Gerstmann syndrome — the characteristic combination of finger agnosia, left-right disorientation, agraphia, and acalculia following lesions of the left inferior parietal cortex — was first described by Josef Gerstmann in the 1920s and remains the canonical clinical signature of angular gyrus damage. The four symptoms do not always co-occur cleanly, and the exact lesion locus producing the full syndrome remains debated, but the association is reliable enough that the syndrome is preserved as a clinical category.",
      "Alexia without agraphia (Dejerine's syndrome) is the more famous disconnection syndrome involving the angular gyrus indirectly. In its classical form, a lesion of left occipital cortex together with damage to the splenium of the corpus callosum disconnects visual input from the left angular gyrus, producing a patient who can no longer read written language but can still write — a striking dissociation that helped establish the modern disconnection framework in clinical neurology [cite:geschwind-1965-disconnexion-syndromes].",
      "In Alzheimer's disease, temporoparietal hypometabolism — including the angular gyrus — is among the more consistent cortical signatures of the disease alongside the posteromedial pattern. The region's vulnerability is consistent with its position as a connector hub that integrates inputs from medial temporal, posteromedial, and frontal regions all undergoing pathology.",
      "The clinical implication is that the angular gyrus's varied functional contributions also mean varied clinical presentations of damage. The same lesion can produce reading impairment, calculation impairment, semantic-integration deficits, or memory-retrieval problems, depending on the exact sub-region and connectivity involved.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Joseph Jules Dejerine described the alexia-without-agraphia syndrome in 1891 — the patient who could no longer read but could still write — and identified the lesion at autopsy in the left occipital lobe and splenium of the corpus callosum. The case became the founding example of disconnection syndromes in clinical neurology and gave the angular gyrus its first explicit role in the integration of visual word form with meaning.",
      "Josef Gerstmann's 1920s case series established the inferior-parietal-lobule tetrad — finger agnosia, left-right disorientation, agraphia, acalculia — that bears his name and that remains the canonical clinical signature. Norman Geschwind's revival of the disconnection framework in the 1960s extended the angular gyrus story to its modern form [cite:geschwind-1965-disconnexion-syndromes].",
      "The contemporary functional-imaging synthesis is Seghier 2013's review, which named the region as a multiply-functional, multiply-subdivided hub and gave the field its current framework for reporting angular gyrus activations with appropriate spatial specificity [cite:seghier-2013-angular-gyrus]. The picture remains that the angular gyrus is best understood not as the seat of any single function but as a connector whose contribution depends on the system it is connecting at the moment.",
    ],
  },
};
