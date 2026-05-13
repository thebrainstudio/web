import type { AtlasEntry } from "@/lib/atlas";

/**
 * Amygdala (left) — Atlas entry.
 *
 * Voice discipline: this region carries the heaviest weight of
 * misleading popular framing on the site. "The fear center" is the
 * most-circulated description in popular neuroscience, and it is
 * wrong. The amygdala is a salience detector that participates in
 * processing many emotional valences — positive and negative — and
 * in social and reward learning, not just threat. The page below
 * states this clearly without sliding into either the popular over-
 * simplification or a dismissive over-correction.
 *
 * LeDoux himself, whose work made the amygdala-fear circuit famous,
 * spent his late career arguing that "fear" as a conscious experience
 * is dissociable from the threat-detection circuitry the region
 * implements [cite:ledoux-2014-coming-to-terms-with-fear].
 */
export const amygLeftAtlas: AtlasEntry = {
  id: "amyg_left",
  fullName: "Amygdala (left)",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "Limbic",
  adjacentRegions: ["amyg_right", "hipp_left", "vmpfc", "atl_left"],
  relatedTours: ["when-something-matters"],
  connectivityTracts: [
    "uncinate-fasciculus",
    "stria-terminalis",
    "ventral-amygdalofugal-pathway",
  ],
  cellTypes: [
    { name: "Lateral nucleus pyramidal-like principal cell" },
    { name: "Basal nucleus principal cell" },
    { name: "Central nucleus GABAergic medium spiny cell" },
  ],
  disorders: [
    {
      id: "ptsd",
      name: "Post-traumatic stress disorder",
      oneLine:
        "Heightened amygdala reactivity and altered amygdala-prefrontal connectivity are among the most replicated functional findings.",
    },
    {
      id: "anxiety-disorders",
      name: "Anxiety disorders",
      oneLine:
        "Across generalized anxiety, panic, and social anxiety, hyper-responsivity to threat-related cues is observed in left and right amygdala alike.",
    },
    {
      id: "depression",
      name: "Major depressive disorder",
      oneLine:
        "Altered amygdala response to negative stimuli is one component of the wider affective-circuit changes in depression.",
    },
    {
      id: "autism-spectrum",
      name: "Autism spectrum (social processing)",
      oneLine:
        "Amygdala atypicalities are reliably reported, particularly for processing the social signals of faces; the picture is one of network dysregulation, not regional damage.",
    },
  ],
  primaryDiscoveryReference: "ledoux-2014-coming-to-terms-with-fear",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "The amygdala is a small almond-shaped cluster of nuclei in the medial temporal lobe, anterior to the hippocampus and superior to the parahippocampal gyrus. The structure is not a single homogeneous nucleus but a heterogeneous collection of at least thirteen distinct cell groups, conventionally divided into a basolateral complex (lateral, basal, and accessory basal nuclei), a centromedial complex (central and medial nuclei), and the cortical nucleus [cite:phelps-ledoux-2005-amygdala-contributions].",
      "Inputs arrive principally through the lateral nucleus from sensory cortices and the thalamus; outputs leave principally through the central nucleus to hypothalamic and brainstem targets, and through the basal nucleus to widespread cortical and striatal targets. The functional heterogeneity of the structure mirrors this anatomical heterogeneity: different nuclei make different contributions to different aspects of emotional processing.",
    ],
  },

  functionSection: {
    paragraphs: [
      "The popular description of the amygdala as \"the fear center\" should be retired. The actual literature, including the work that gave the region its association with fear in the first place, describes a region that participates in detecting biologically and socially significant stimuli of many valences — threatening, rewarding, novel, socially salient — and that contributes to the learning, modulation, and consolidation of memories for emotionally weighted events [cite:phelps-ledoux-2005-amygdala-contributions].",
      "Joseph LeDoux's animal-model work in the 1980s and 1990s established the lateral-to-central amygdala circuit as essential for the acquisition and expression of conditioned threat responses. In his later writing, however, LeDoux carefully distinguished the threat-detection circuit (which is what his rats demonstrated) from the conscious feeling of fear (which is a separate, distinctively human cognitive elaboration). The amygdala mediates the former; the latter requires additional cortical contribution and reflective access [cite:ledoux-2014-coming-to-terms-with-fear].",
      "Beyond threat, the amygdala is consistently recruited during reward learning, social-stimulus processing, and the affective tagging of memory. Ralph Adolphs's review of the social-cognition literature places the region at a hub processing dimensions of saliency and relevance — including the social information encoded in faces, the unpredictability of stimuli, and the current value of rewards [cite:adolphs-2010-amygdala-social]. The behavioural consequences of bilateral amygdala damage in humans (rare, but documented in studies of urbach-wiethe disease) include not only blunted fear recognition but altered social judgment more broadly.",
      "A reasonable working description: the amygdala is a salience detector tuned by evolution and learning to flag stimuli that matter, especially when the mattering needs to happen faster than deliberate analysis can support. Threat is the example that taught us the system existed; the system itself is more general.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "The amygdala's principal excitatory neurons in the basolateral complex resemble cortical pyramidal cells in their morphology and glutamatergic phenotype, with extensive dendritic trees that integrate inputs from sensory cortex, hippocampus, and thalamus. The centromedial nucleus is dominated instead by GABAergic medium spiny neurons whose striatum-like architecture supports the inhibitory gating of downstream autonomic and behavioural outputs [cite:phelps-ledoux-2005-amygdala-contributions].",
      "The diversity of cell classes within the amygdala underlies its functional heterogeneity: different nuclei, with different cell types and different projection targets, contribute differently to the various processes the structure has been implicated in.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The amygdala communicates with the rest of the brain through several major fibre systems. The uncinate fasciculus carries reciprocal connections between the basolateral amygdala and orbitofrontal cortex — the principal route for prefrontal modulation of amygdala activity, central to emotion regulation [cite:phelps-ledoux-2005-amygdala-contributions]. The stria terminalis and the ventral amygdalofugal pathway carry projections to and from hypothalamic, brainstem, and basal forebrain targets that mediate autonomic and behavioural responses.",
      "Within the basolateral complex, dense connections to the hippocampus support the consolidation of emotionally weighted memories. The classical finding here is that emotional arousal at encoding enhances later recall, an effect that requires intact amygdala function and that disappears with amygdala damage or with pharmacological blockade of noradrenergic signalling. The mechanism is one of the cleanest examples of how emotion and memory are biologically intertwined rather than separate systems.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "In post-traumatic stress disorder, heightened amygdala reactivity to trauma-reminiscent cues and altered prefrontal-amygdala connectivity are among the most replicated functional-imaging findings [cite:phelps-ledoux-2005-amygdala-contributions]. The pattern is consistent with a model in which the threat-detection circuit is appropriately activated by the original trauma but fails to disengage at the rate normal regulation would predict. Treatment approaches — exposure-based therapies, cognitive-behavioural therapy, and emerging pharmacological work on reconsolidation — target this regulatory mismatch.",
      "Across anxiety disorders, amygdala hyper-responsivity to threat-related cues is observed; the specific cues vary by disorder (social signals in social anxiety, physical-sensation cues in panic, abstract negative content in generalized anxiety), but the regional pattern is consistent. This convergence is one of the more useful contributions of the amygdala literature to clinical practice: it locates a common neural component of disorders that vary considerably in their surface phenomenology.",
      "In autism spectrum conditions, the amygdala literature has been complicated. Early findings of structural and functional atypicalities have replicated in some samples and not others; the contemporary view is that amygdala-cortical connectivity is dysregulated in ways that contribute to atypical processing of social signals, particularly those carried by faces [cite:adolphs-2010-amygdala-social]. The clinical implication is not that the amygdala is \"damaged\" but that its participation in distributed social-processing networks is altered.",
      "A cautionary note running through all of this: the amygdala is implicated in many disorders because it participates in many functions. \"Amygdala-implicated\" does not mean \"caused by the amygdala.\" The careful clinical statement is always about distributed circuits in which the amygdala is one functionally important node.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The amygdala's association with emotional processing has a long history, but its dominant modern framing comes from Joseph LeDoux's animal-model work beginning in the 1980s, which traced the auditory-threat-conditioning pathway from thalamus through lateral amygdala to central amygdala and demonstrated that lesions interrupting this circuit prevented conditioned threat responses. The work established that emotional learning has discrete neural substrates and that those substrates operate substantially below the threshold of deliberate cognition.",
      "LeDoux's later writing is the more careful version of the same picture. In a 2014 paper explicitly titled \"Coming to terms with fear,\" he argued that the field had conflated two different things under the word — the unconscious threat-detection-and-response circuit (which is what his rats showed) and the subjective feeling of fear (which his rats could not report on) [cite:ledoux-2014-coming-to-terms-with-fear]. The amygdala is essential to the former. The latter, in humans, requires the cortical machinery for self-reflection, language, and access consciousness. Mistaking the first for the second is the source of most of the popular over-claiming.",
    ],
  },
};
