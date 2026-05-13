import type { AtlasEntry } from "@/lib/atlas";

/**
 * Right amygdala (AMYG-R) — Atlas entry.
 *
 * Voice note: right amygdala is implicated in rapid, often
 * unconscious affective processing — the body's verdict on a
 * stimulus before deliberate thought has caught up. The page
 * preserves the discipline against the "fear center" framing from
 * the left-amygdala page and emphasizes the speed-vs-elaboration
 * asymmetry that the literature has documented.
 */
export const amygRightAtlas: AtlasEntry = {
  id: "amyg_right",
  fullName: "Right amygdala",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "Limbic",
  adjacentRegions: ["amyg_left", "hipp_right", "vmpfc", "atl_right"],
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
      id: "ptsd-right",
      name: "Post-traumatic stress disorder (right amygdala reactivity)",
      oneLine:
        "Right amygdala hyperactivity to trauma cues is among the more consistent functional-imaging findings; the asymmetry with left amygdala has clinical and theoretical significance.",
    },
    {
      id: "anxiety-disorders-right",
      name: "Anxiety disorders",
      oneLine:
        "Across anxiety conditions, right amygdala shows particularly robust hyper-responsivity to threat-related cues, with the response often appearing faster and more automatic than left amygdala activation.",
    },
    {
      id: "depression-right-amygdala",
      name: "Major depressive disorder",
      oneLine:
        "Altered right amygdala response to negative stimuli is part of the wider affective-circuit changes in depression, with patterns sometimes distinguishable from those in left amygdala.",
    },
  ],
  primaryDiscoveryReference: "phelps-ledoux-2005-amygdala-contributions",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Right amygdala mirrors its left counterpart anatomically — the heterogeneous collection of nuclei in the medial temporal lobe, with the basolateral complex (lateral, basal, accessory basal) handling cortical inputs, the centromedial complex (central, medial) handling autonomic and behavioural outputs, and the cortical nucleus contributing to social-stimulus processing [cite:phelps-ledoux-2005-amygdala-contributions]. Hemispheric asymmetries within this structure are subtle in gross terms but consistent in functional terms: right amygdala tends to be faster, more automatic, and more responsive to dynamic emotional stimuli, while left amygdala tends to be more linguistically-elaborated and more responsive to verbal emotional content.",
    ],
  },

  functionSection: {
    paragraphs: [
      "Right amygdala is consistently recruited during rapid, often unconscious affective processing — the body's verdict on a stimulus before deliberate thought has caught up. The asymmetry with left amygdala is partial but reliable: right amygdala activation is faster and more transient; left amygdala activation is slower and more sustained, particularly when the stimulus involves verbal or linguistically-elaborated content [cite:phelps-ledoux-2005-amygdala-contributions].",
      "The asymmetric specialization shows up cleanly in tasks with masked emotional stimuli — faces presented for too brief a window for conscious recognition. Right amygdala responds; left amygdala often does not. The same asymmetry appears in studies of automatic emotional evaluation, where right amygdala tracks the affective valence of stimuli participants are not consciously attending to. The contemporary reading is that right amygdala participates in a fast subcortical-cortical route for affective valuation while left amygdala participates in a slower, more conceptually-integrated route [cite:adolphs-2010-amygdala-social].",
      "Beyond rapid evaluation, right amygdala participates in the salience-detection role described for the structure as a whole — flagging biologically and socially significant stimuli of many valences, contributing to the consolidation of emotionally weighted memories through interactions with the adjacent hippocampus, and supporting the social-stimulus processing that Adolphs's work has placed at the centre of the contemporary functional account [cite:adolphs-2010-amygdala-social].",
      "The depth-psychological resonance here lies in the asymmetry rather than the structure itself. Right amygdala's faster, often unconscious evaluation of affective significance is consistent with the long-standing depth-psychological observation that the body knows before the mind has caught up — that affect arrives ahead of articulation. The careful neuroscience does not endorse Jung's metaphysics, but the asymmetry is real and the priority of affect over reflection has a partial mechanism here.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Right amygdala's cellular composition mirrors its left counterpart — pyramidal-like principal cells in the lateral and basal nuclei (with cortical-like glutamatergic phenotype) and GABAergic medium spiny neurons dominating the central nucleus. The functional asymmetry between hemispheres reflects connectivity patterns and lateralized cortical inputs rather than cellular composition [cite:phelps-ledoux-2005-amygdala-contributions].",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "Right amygdala's connectivity is largely symmetric with left amygdala — the uncinate fasciculus carrying reciprocal connections with right orbitofrontal and ventromedial prefrontal cortex, the stria terminalis and ventral amygdalofugal pathway carrying projections to hypothalamic and brainstem targets, and dense local connections with the adjacent right hippocampus. The right-lateralized cortical inputs from right superior temporal sulcus, right fusiform face area (outside our 20 regions), and right anterior temporal cortex give the right amygdala its bias toward dynamic, face-related, and socially-elaborated affective content [cite:adolphs-2010-amygdala-social].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "In PTSD, right amygdala hyper-reactivity to trauma-reminiscent cues is among the more consistent functional-imaging findings. The asymmetry with left amygdala has clinical significance: the right-amygdala response often tracks the involuntary, intrusive aspects of post-traumatic symptomatology (flashbacks, hyperarousal), while left-amygdala involvement tracks the more linguistically-mediated aspects (intrusive thoughts, narrative re-experiencing). The dissociation is consistent with the broader fast-automatic-versus-slow-elaborated distinction between the two amygdalae.",
      "Across anxiety disorders, right amygdala shows particularly robust hyper-responsivity to threat-related cues, with the response often appearing faster and more automatic than left amygdala activation. Treatment approaches that target the rapid-automatic component (exposure therapy, certain pharmacological interventions) and those that target the slower-elaborated component (cognitive restructuring, narrative therapy) may engage the two amygdalae differently.",
      "In major depressive disorder, altered right amygdala response to negative stimuli is part of the wider affective-circuit changes in depression. The hemispheric asymmetry here is less reliable than in anxiety conditions, with both right and left amygdalae showing altered responses across the depression literature.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The hemispheric asymmetry in amygdala function emerged from a combination of clinical observation (early case reports of asymmetric emotional changes following unilateral amygdala damage), animal-model work on lateralized fear circuits, and the imaging-era demonstrations of dissociable response patterns across right and left amygdala — particularly the masked-stimulus studies of Arne Öhman, Paul Whalen, and colleagues in the 1990s and early 2000s [cite:phelps-ledoux-2005-amygdala-contributions].",
      "The contemporary integration into a single account of amygdala function, with right amygdala carrying the faster more automatic affective-evaluation role and left amygdala carrying the slower more linguistically-elaborated role, has been developed across Phelps and LeDoux's 2005 Neuron review and Adolphs's 2010 social-cognition synthesis [cite:phelps-ledoux-2005-amygdala-contributions] [cite:adolphs-2010-amygdala-social]. The picture remains active research territory.",
    ],
  },
};
