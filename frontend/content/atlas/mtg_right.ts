import type { AtlasEntry } from "@/lib/atlas";

/**
 * Right middle temporal gyrus (MTG-R) — Atlas entry.
 *
 * Voice note: right MTG is the hemisphere's contribution to
 * narrative, metaphor, and the inference of mental states from
 * biological motion. The page builds on the Schurz 2014 meta-
 * analysis of theory-of-mind and on McGilchrist's broader argument
 * for right-hemisphere specialization in figurative and contextual
 * meaning.
 */
export const mtgRightAtlas: AtlasEntry = {
  id: "mtg_right",
  fullName: "Right middle temporal gyrus",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "DefaultMode",
  adjacentRegions: ["mtg_left", "pstg_right", "atl_right"],
  relatedTours: [],
  connectivityTracts: [
    "inferior-longitudinal-fasciculus",
    "uncinate-fasciculus",
    "superior-longitudinal-fasciculus",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "autism-narrative",
      name: "Autism spectrum (narrative and figurative comprehension)",
      oneLine:
        "Reduced engagement of right MTG and adjacent posterior temporal regions during theory-of-mind and narrative-comprehension tasks is one of the consistent functional differences in the literature.",
    },
    {
      id: "schizophrenia-figurative",
      name: "Schizophrenia (figurative-language impairments)",
      oneLine:
        "Difficulties with metaphor and irony comprehension in schizophrenia are associated with altered right MTG recruitment during figurative-language tasks.",
    },
    {
      id: "right-stroke-discourse",
      name: "Right-hemisphere stroke discourse impairments",
      oneLine:
        "Acquired difficulties with narrative comprehension, inference, and figurative interpretation following right-hemisphere stroke implicate right MTG together with adjacent posterior temporal cortex.",
    },
  ],
  primaryDiscoveryReference: "binder-desai-2011-semantic-system",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Right middle temporal gyrus mirrors its left counterpart anatomically — the lateral temporal-lobe gyrus between the superior and inferior temporal sulci, running from the temporal pole to the inferior parietal lobule. The cytoarchitecture is essentially symmetric with left MTG; the functional differences reflect differences in connectivity with right-hemisphere language, mentalizing, and visual-motion networks [cite:binder-desai-2011-semantic-system].",
    ],
  },

  functionSection: {
    paragraphs: [
      "Right MTG is more reliably recruited than its left counterpart during three classes of task: figurative-language comprehension (metaphor, irony, sarcasm), narrative comprehension and discourse-level integration, and the inference of mental states from biological motion. Each of these tasks shares a common feature — they require the listener to go beyond the literal content of what is said or seen to construct an inferred meaning [cite:mcgilchrist-master-emissary].",
      "Within the mentalizing literature, Schurz and colleagues' 2014 meta-analysis identified the posterior temporal cortex (including MTG) as part of the broader theory-of-mind network alongside the canonical dmPFC and bilateral TPJ anchors [cite:schurz-2014-fractionating-tom]. The right posterior MTG is particularly recruited for tasks involving the perception of biological motion — observing the movements of other agents and inferring intentions from those movements — which sits at the boundary between visual perception, theory of mind, and language.",
      "The narrative-comprehension role complements the figurative-language role: both require integrating information across time and across pieces of a structure into a coherent whole that exceeds the local content of any moment. Patients with right-hemisphere stroke involving MTG and adjacent posterior temporal cortex show characteristic deficits in jokes, irony, and the punchlines of stories — they understand the words but cannot reliably read the larger move the speaker is making.",
      "McGilchrist's broader synthesis of right-hemisphere specialization argues for a deeper asymmetry: the right hemisphere as more attentive to context, to what is implicit, to what is new, to the gestalt that exceeds the literal parts. The empirical literature on MTG-R activity in figurative and narrative tasks is consistent with this picture, though McGilchrist's wider metaphysical extension of the asymmetry into a theory of culture is more speculative than the imaging data alone supports [cite:mcgilchrist-master-emissary].",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Right MTG's cytoarchitecture mirrors its left counterpart — six-layered association cortex with layer III and V pyramidal cells dominating, and the inhibitory architecture characteristic of temporal cortex. The hemispheric functional difference reflects connectivity and (perhaps) microscale specialization, rather than cell-class composition [cite:binder-desai-2011-semantic-system].",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "Right MTG sits within the right-hemisphere language network (anchored on right IFG and right pSTG) and within the broader mentalizing network (with right TPJ, right dmPFC, and right ATL). Its principal long-range connections are with right ATL via the inferior longitudinal fasciculus, with right IFG via the right arcuate fasciculus (smaller and more variable than its left counterpart), and with the right superior temporal sulcus and TPJ via short-range corticocortical pathways [cite:catani-2005-arcuate-fasciculus] [cite:schurz-2014-fractionating-tom].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Right-hemisphere stroke involving right MTG and adjacent posterior temporal cortex produces a constellation of discourse-level impairments distinct from classical aphasia syndromes: difficulty with the gist of stories, with irony and sarcasm comprehension, with the inferential leaps that everyday conversation requires. These patients are not aphasic in the classical sense and can hold technically correct conversations on direct topics, but the texture of their social communication is markedly altered.",
      "In autism spectrum conditions, the literature on right MTG and the broader posterior temporal mentalizing network has been one of the more replicated functional-imaging stories. The picture is consistent across studies: atypical engagement of right posterior temporal cortex during narrative comprehension, theory-of-mind tasks, and figurative-language interpretation contributes to the characteristic social-communication differences that define part of the condition [cite:schurz-2014-fractionating-tom].",
      "In schizophrenia, difficulties with metaphor and irony comprehension are associated with altered right MTG recruitment during figurative-language tasks. The clinical relevance is that these subtle pragmatic-language impairments are part of the broader social-cognition profile that contributes substantially to functional outcomes in the disorder.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Right-hemisphere contributions to language were neglected through most of the twentieth century in the wake of Broca and Wernicke's left-hemisphere findings. The clinical observation of discourse-level impairments after right-hemisphere stroke — first described systematically in the 1970s by researchers including Wapner, Hamby, and Gardner, and by Sally Kaplan and others — established right MTG and adjacent regions as essential for the figurative and inferential layer of language.",
      "The contemporary functional account has emerged from converging evidence: lesion-symptom mapping in right-hemisphere stroke, fMRI studies of metaphor and irony comprehension (including work by Mashal, Faust, and colleagues), and the broader mentalizing-network synthesis represented by Schurz and colleagues' 2014 meta-analysis [cite:schurz-2014-fractionating-tom]. McGilchrist's *Master and His Emissary* provides the wider interpretive framework [cite:mcgilchrist-master-emissary].",
    ],
  },
};
