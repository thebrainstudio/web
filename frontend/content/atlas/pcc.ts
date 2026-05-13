import type { AtlasEntry } from "@/lib/atlas";

/**
 * Posterior cingulate cortex (PCC) — Atlas entry.
 *
 * This is the contemplative page. PCC is a core hub of the default-mode
 * network and the canonical example of a region where the "what is the
 * brain doing when it is doing nothing" question opened a productive
 * decade of research. The voice here can lean a little more
 * reflective than the language pages — the science licenses it, and
 * the thread reads more honestly because of it.
 */
export const pccAtlas: AtlasEntry = {
  id: "pcc",
  fullName: "Posterior cingulate cortex",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "DefaultMode",
  adjacentRegions: ["precuneus", "agl_left", "agl_right", "hipp_left", "hipp_right"],
  relatedTours: ["whats-still-you-when-you-stop-trying", "the-act-of-remembering"],
  connectivityTracts: ["cingulum-bundle", "fornix", "superior-longitudinal-fasciculus"],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
    { name: "Von Economo neurons (sparse)" },
  ],
  disorders: [
    {
      id: "alzheimers",
      name: "Alzheimer's disease",
      oneLine:
        "PCC hypometabolism on FDG-PET is among the most consistent early biomarkers, often present before clinical diagnosis.",
    },
    {
      id: "depression",
      name: "Major depressive disorder",
      oneLine:
        "Aberrant PCC connectivity is implicated in ruminative thought patterns characteristic of depression.",
    },
    {
      id: "disorders-of-consciousness",
      name: "Disorders of consciousness",
      oneLine:
        "PCC activity tracks levels of awareness across vegetative, minimally conscious, and locked-in states.",
    },
  ],
  primaryDiscoveryReference: "raichle-2001-default-mode",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "The posterior cingulate cortex occupies the posterior portion of the cingulate gyrus, wrapping around the splenium of the corpus callosum on the medial surface of each hemisphere. It is anatomically heterogeneous, subdividing into a dorsal portion (Brodmann area 31 and parts of BA 23) and a ventral portion that blends into the retrosplenial cortex (BA 29/30) [cite:vogt-2005-pcc-anatomy].",
      "Its position at the meeting of parietal, temporal, and limbic systems makes it one of the most densely connected hubs in the cortex. The cingulum bundle runs along its length, carrying the principal limbic-system white-matter connections.",
    ],
  },

  functionSection: {
    paragraphs: [
      "The PCC is one of the most reliably identified hubs of the default-mode network — the set of regions that increases its activity when external task demands fall away and decreases when tasks reassert themselves [cite:raichle-2001-default-mode]. Before the default-mode framework, the consistent rise in PCC blood flow at rest was treated as nuisance variance to be regressed out of task analyses; the reinterpretation of that signal as a meaningful network state is one of the field's recent reframings [cite:buckner-2008-default-network].",
      "Within the default-mode network, the PCC functions as a connector — coupled to medial prefrontal cortex, inferior parietal cortex, and the medial temporal lobe (including hippocampus) — supporting self-referential thought, autobiographical memory, prospective imagination, and mind-wandering [cite:andrews-hanna-2010-default-network-functional]. Its activity tracks not only what one is doing but the kind of attention one is bringing to it: tasks that engage social or autobiographical content recruit it more than tasks that do not [cite:leech-sharp-2014-pcc-role].",
      "A functional dissociation within the PCC has emerged in recent work: dorsal PCC shows task-related modulation that is sensitive to the cognitive content of the task, while ventral PCC is more consistently coupled to other default-mode regions during internal processing [cite:leech-sharp-2014-pcc-role]. The region's role in cognition is therefore not \"task-negative\" so much as task-flexible.",
      "Network-analytic studies place the PCC and adjacent precuneus among the brain's principal connector hubs — nodes whose damage disproportionately impacts the system's overall efficiency [cite:fransson-2008-pcc-hub].",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "The cortical architecture of the PCC is typical association cortex: a six-layered structure dominated by glutamatergic pyramidal neurons in layers III and V, with a varied inhibitory network. The region also contains sparse populations of Von Economo neurons — large, spindle-shaped projection neurons concentrated in anterior and posterior cingulate cortex — though their density here is lower than in the anterior cingulate or frontoinsular cortex [cite:vogt-2005-pcc-anatomy].",
      "The Cellular View carries reconstructed cortical pyramidal cells from association cortex; descend into the cellular layer to see the dendritic geometry that supports long-range hub connectivity.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The PCC's connectivity profile is dominated by the cingulum bundle, which runs along the cingulate gyrus and carries projections to and from anterior cingulate cortex, medial prefrontal cortex, and the medial temporal lobe [cite:vogt-2005-pcc-anatomy]. Through these connections, the PCC is part of the limbic-cortical circuit that supports memory, evaluation of personal relevance, and the integration of past experience into ongoing thought.",
      "Functional connectivity studies have repeatedly placed the PCC at the centre of the default-mode network, with the strongest couplings to medial prefrontal cortex, inferior parietal cortex (including angular gyrus), and the hippocampus [cite:greicius-2003-default-functional-connectivity]. The strength of these couplings during rest predicts behavioural variables ranging from autobiographical memory ability to vulnerability to ruminative thought.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "PCC hypometabolism is among the earliest and most consistent biomarkers of Alzheimer's disease on FDG-PET imaging — often visible years before clinical diagnosis, and often before the more dramatic temporal-lobe atrophy that defines the later disease [cite:small-2011-hippocampal-circuit-disorders]. The mechanism is debated: PCC is a downstream target of medial temporal pathology, but it is also a hub whose vulnerability may have its own substrate.",
      "In major depressive disorder, default-mode network connectivity is altered, with hyperconnectivity between PCC and other default-mode regions associated with the kind of self-referential rumination characteristic of the disorder. The connectivity changes are sensitive enough to track treatment response, including the effects of behavioural and pharmacological interventions.",
      "Across disorders of consciousness — vegetative state, minimally conscious state, locked-in syndrome — PCC activity is among the most reliable correlates of preserved awareness, with patterns of PCC connectivity providing one of the more sensitive bedside-adjacent measures for distinguishing among these states [cite:leech-sharp-2014-pcc-role].",
      "Long-term meditators show measurable differences in PCC engagement during focused-attention tasks, with reductions in mind-wandering-related PCC activity. The finding is not a claim that meditation \"shuts off\" the default-mode network; it is a claim that the relationship between attention and the default-mode network is trainable [cite:brewer-2011-meditators-pcc].",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The PCC's role in the default-mode network was named, rather than discovered, in 2001. Marcus Raichle and colleagues observed that across many PET studies the same set of regions showed deactivation relative to a passive baseline whenever subjects performed a task — and that the same regions showed elevated activity during the baseline itself [cite:raichle-2001-default-mode]. They proposed that the baseline reflected an organized resting state rather than mere idling.",
      "The 2003 demonstration of correlated low-frequency BOLD fluctuations among these regions, using resting-state functional connectivity, established the default-mode network as a network rather than a list [cite:greicius-2003-default-functional-connectivity]. Buckner, Andrews-Hanna, and Schacter's 2008 synthesis consolidated the functional account [cite:buckner-2008-default-network].",
    ],
  },
};
