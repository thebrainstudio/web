import type { AtlasEntry } from "@/lib/atlas";

/**
 * Broca's region (left inferior frontal gyrus, BA 44/45) — Atlas entry.
 *
 * Voice note: the founding history here is famous and tempting to
 * dramatize. We resist. Broca's contribution was real and limited.
 * The full story includes Wernicke a decade later, the dual-stream
 * model a century after that, and the modern reframing of Broca's
 * area as a domain-general processor that is *recruited* by language
 * rather than dedicated to it.
 */
export const ifgLeftAtlas: AtlasEntry = {
  id: "ifg_left",
  fullName: "Broca's region (left inferior frontal gyrus)",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "FrontoparietalControl",
  adjacentRegions: ["pstg_left", "mtg_left", "agl_left", "ifg_right"],
  relatedTours: ["how-you-read-this-sentence"],
  connectivityTracts: ["arcuate-fasciculus", "uncinate-fasciculus", "superior-longitudinal-fasciculus"],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
    { name: "Basket interneuron" },
  ],
  disorders: [
    {
      id: "broca-aphasia",
      name: "Broca's aphasia (non-fluent aphasia)",
      oneLine:
        "Damage produces effortful, telegraphic speech with relatively preserved comprehension; pure cases from focal Broca damage are less common than the eponym suggests.",
    },
    {
      id: "primary-progressive-aphasia-nonfluent",
      name: "Primary progressive aphasia (non-fluent variant)",
      oneLine:
        "A neurodegenerative syndrome with selective atrophy of left inferior frontal cortex and surrounding language regions.",
    },
    {
      id: "stuttering",
      name: "Developmental stuttering",
      oneLine:
        "Imaging suggests over- and dysregulation of left frontal speech-motor regions, including Broca's area.",
    },
  ],
  primaryDiscoveryReference: "broca-1861-aphemie",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Broca's region occupies the posterior portion of the left inferior frontal gyrus, divided cytoarchitectonically into Brodmann areas 44 (pars opercularis) and 45 (pars triangularis). The boundary between BA 44 and BA 45 is subtle on the surface but distinct under the microscope, and the precise extent of \"Broca's area\" varies considerably across individuals [cite:amunts-1999-brodmann-44-45].",
      "The region sits above the lateral sulcus, anterior to the precentral gyrus, with the pars orbitalis (BA 47) wrapping around its inferior edge. Its principal long-range connection — the arcuate fasciculus — arcs back to the posterior temporal cortex.",
    ],
  },

  functionSection: {
    paragraphs: [
      "Broca's region is most strongly recruited during syntactic processing and articulatory planning. Damage produces a characteristic non-fluent aphasia: effortful, telegraphic speech in which content words are produced but function words and grammatical structure collapse, while comprehension can remain relatively intact for everyday discourse and break down only for syntactically complex sentences [cite:hagoort-2014-language-architecture].",
      "Beyond classical syntax, the region participates in unification — the moment-by-moment binding of lexical items into hierarchical structures — and in the cognitive control needed to select among competing semantic and phonological candidates [cite:friederici-2011-language-network]. The modern picture is less of a \"speech production center\" and more of a hub where domain-general control processes are recruited by language-specific computations.",
      "High-resolution mapping with individual-subject fMRI has shown that language-selective subregions of Broca's area sit directly adjacent to domain-general cognitive-control subregions [cite:fedorenko-2014-language-domain-specific]. The eponym is convenient but obscures: this is not a single functional unit but a small neighborhood of overlapping systems.",
      "The right-hemisphere homologue (IFG-R) is not silent during language tasks. It contributes to prosody, figurative language, and the inhibitory control of speech.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Like the rest of association cortex, the inferior frontal gyrus is dominated by glutamatergic pyramidal neurons across layers III and V, with a rich inhibitory infrastructure of parvalbumin-, somatostatin-, and VIP-positive interneurons. The cytoarchitectonic distinction between BA 44 and BA 45 is principally a matter of granular layer density and layer III pyramidal cell distribution [cite:amunts-1999-brodmann-44-45].",
      "Cellular-level reconstructions of frontal pyramidal neurons are available in the cellular view (use the Frontal filter). They show the long, extensively branched apical dendrites characteristic of association cortex.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The arcuate fasciculus is the textbook long-range bundle connecting Broca's region with the posterior temporal language areas. Diffusion imaging has revised the classical picture: the arcuate is best described as a family of fibres with a dorsal segment running between frontal and temporal cortex, and an indirect ventral route through the inferior parietal lobule [cite:catani-2005-arcuate-fasciculus].",
      "Within the dual-stream model of language, the dorsal stream — coupling Broca's area to posterior temporal cortex via the arcuate fasciculus and parts of the superior longitudinal fasciculus — maps acoustic-phonetic input to articulatory representations. The ventral stream, running through inferior longitudinal and uncinate fasciculi, maps speech sound onto meaning [cite:hickok-poeppel-2007-dual-stream].",
      "Local connections to motor cortex and supplementary motor area support the articulatory side of speech; connections to anterior cingulate cortex support the cognitive-control side.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Pure Broca's aphasia from a small focal lesion in BA 44/45 is rarer than the eponym suggests. The clinical syndrome more often results from larger middle-cerebral-artery strokes that involve Broca's area together with the anterior insula, premotor cortex, and underlying white matter [cite:dronkers-2007-broca-revisited]. When Paul Broca's two original patients' brains were re-examined with MRI in 2007, both showed damage extending well beyond his described region.",
      "Primary progressive aphasia (non-fluent variant) presents with gradually worsening agrammatic, effortful speech and selective atrophy of left inferior frontal cortex and surrounding language regions. Unlike post-stroke aphasia, the deficit advances over years and is part of a neurodegenerative process.",
      "The clinical implication is conservative: damage to this region disrupts language, but \"language\" is distributed across the perisylvian network, and recovery in chronic aphasia depends on the integrity of both intact regions and the white-matter bundles connecting them.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Paul Broca presented his patient Leborgne to the Société d'Anthropologie de Paris in 1861. Leborgne had been hospitalized for 21 years with a severe speech impairment, capable of producing little more than the syllable \"tan\" (by which name he is sometimes remembered). When Leborgne died days after Broca first examined him, the autopsy revealed a large lesion in the left inferior frontal lobe — the first localization of a higher cognitive function to a specific cortical region [cite:broca-1861-aphemie].",
      "Carl Wernicke's 1874 description of a posterior temporal lesion producing fluent but incomprehensible speech completed the foundational two-region model. Norman Geschwind extended the picture in 1965 with his \"disconnexion syndrome\" framework, in which damage to the arcuate fasciculus connecting Broca and Wernicke produced conduction aphasia [cite:geschwind-1965-disconnexion-syndromes]. The modern network view evolved from there.",
    ],
  },
};
