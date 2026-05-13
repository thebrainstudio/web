import type { AtlasEntry } from "@/lib/atlas";

/**
 * Dorsomedial prefrontal cortex (dmPFC) — Atlas entry.
 *
 * Voice note: the contemporary literature on dmPFC is anchored in
 * mentalizing — the construction of models of other minds. This is
 * the brain's social-cognition workhorse and the cleanest bridge from
 * neuroscience to the psychodynamic concept of mentalization (Fonagy
 * et al.) and to Jung's writing on the projected interior other.
 *
 * The page distinguishes dmPFC from temporoparietal-junction (TPJ),
 * because both are mentalizing nodes and the literature often blurs
 * their roles in popular accounts.
 */
export const dmpfcAtlas: AtlasEntry = {
  id: "dmpfc",
  fullName: "Dorsomedial prefrontal cortex",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "FrontoparietalControl",
  adjacentRegions: ["vmpfc", "pcc"],
  relatedTours: ["whats-still-you-when-you-stop-trying"],
  connectivityTracts: ["cingulum-bundle", "superior-longitudinal-fasciculus"],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
    { name: "Von Economo neurons (anterior region)" },
  ],
  disorders: [
    {
      id: "autism-spectrum-mentalizing",
      name: "Autism spectrum (mentalizing differences)",
      oneLine:
        "Atypical engagement of dmPFC during theory-of-mind tasks is one of the more replicated functional findings; the picture is one of distributed network differences, not a single regional deficit.",
    },
    {
      id: "schizophrenia-mentalizing",
      name: "Schizophrenia (social cognition)",
      oneLine:
        "Altered dmPFC recruitment during mentalizing tasks contributes to the social-cognition impairments characteristic of the disorder.",
    },
    {
      id: "social-anxiety",
      name: "Social anxiety disorder",
      oneLine:
        "Heightened self-referential and other-related processing in dmPFC tracks symptom severity in some studies.",
    },
  ],
  primaryDiscoveryReference: "amodio-frith-2006-meeting-minds",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Dorsomedial prefrontal cortex occupies the upper portion of the medial frontal wall, dorsal to the anterior cingulate cortex and rostral to the supplementary motor area. The region spans portions of Brodmann areas 8, 9, and 32. Boundaries are graded rather than crisp; the canonical sweep includes both more rostral aspects (closer to BA 10) involved in self-and-other mental-state inference and more caudal aspects (closer to BA 8) involved in cognitive control and conflict monitoring [cite:amodio-frith-2006-meeting-minds].",
      "dmPFC sits directly opposite vmPFC across the cingulate sulcus on the medial wall, and a substantial portion of the contemporary functional literature treats the dorsal and ventral medial-frontal regions as a coupled but functionally dissociable pair. Where vmPFC is the canonical value-integration site, dmPFC is the canonical site for inferring mental states — one's own and others'.",
    ],
  },

  functionSection: {
    paragraphs: [
      "dmPFC is most reliably recruited during mentalizing — the construction of models of mental states, including beliefs, intentions, desires, and emotions, in both self and others [cite:amodio-frith-2006-meeting-minds]. A 2014 meta-analysis of theory-of-mind imaging studies confirmed dmPFC and bilateral posterior temporoparietal junction as the core of the mentalizing network, recruited whenever subjects reason about mental states regardless of task format [cite:schurz-2014-fractionating-tom]. Different tasks within the broader mentalizing literature recruit slightly different sub-networks, but dmPFC participation is the most robust common factor.",
      "The relationship between dmPFC and TPJ matters for clinical interpretation. Rebecca Saxe's work established TPJ as particularly sensitive to representing the contents of others' beliefs — what they think — while dmPFC is more broadly engaged in modelling mental states as such, including one's own [cite:saxe-kanwisher-2003-tpj]. The contemporary view is that mentalizing is a distributed network function with dmPFC as one of two anchor nodes.",
      "Beyond explicit theory-of-mind tasks, dmPFC participates in cognitive control, conflict monitoring, and the maintenance of task sets — particularly when the task involves social or self-referential content. The dorsal-versus-ventral medial-frontal distinction tracks this functional difference: vmPFC encodes value, dmPFC monitors and controls. Both are necessary; neither is sufficient; they speak to each other.",
      "The depth-psychological bridge here is to mentalization in the contemporary psychodynamic sense (Fonagy and colleagues) and, with appropriate hedging, to Jung's account of the inner figure of the other — anima, animus, the projected interior. The neuroscience does not endorse Jung's metaphysics, but the mechanism by which one mind models another is now empirically well-described, and the cost of getting that modelling wrong is what depth psychology has been writing about for a century.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Like other association cortices, dmPFC is dominated by glutamatergic pyramidal neurons across layers III and V, with extensive long-range projections supporting its participation in distributed networks. The rostral portion of the region, particularly where it abuts anterior cingulate cortex, contains the highest density of Von Economo neurons in the human brain — large spindle-shaped layer V projection cells whose function is debated but whose distribution maps onto regions with rich long-range integrative connectivity.",
      "Descend into the Cellular View for reconstructed frontal pyramidal neurons. The dmPFC's specific cell-type composition is similar to neighbouring medial-frontal regions in the archives.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "dmPFC's principal long-range connections run through the cingulum bundle to the rest of the medial-cortical system: anterior cingulate cortex, vmPFC, posterior cingulate, and the hippocampal formation. The mentalizing network is anchored by these connections together with cortico-cortical fibres to the temporoparietal junction along the superior longitudinal fasciculus [cite:schurz-2014-fractionating-tom].",
      "Within the default-mode network, dmPFC is one of the network's dorsal nodes, with reciprocal connectivity to posterior cingulate and angular gyrus. Within the frontoparietal control network, dmPFC participates in task-set maintenance and conflict monitoring through its connectivity with dorsolateral prefrontal cortex and the lateral parietal lobule. The region's membership in two networks at once is part of why it shows up in such a broad range of imaging studies.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Differences in mentalizing-network engagement are among the more replicated functional-imaging findings in autism spectrum conditions. The careful reading is not that the dmPFC is \"broken\" in autism but that its participation in the distributed mentalizing network is atypical, contributing to the characteristic differences in social cognition that define part of the condition. Specifically, both reduced and atypical-context engagement of dmPFC during theory-of-mind tasks has been observed across imaging studies [cite:schurz-2014-fractionating-tom].",
      "In schizophrenia, social-cognition impairments are well-documented and contribute substantially to the functional disability of the disorder. dmPFC recruitment during mentalizing tasks is altered, with patterns that include both reduced engagement in some studies and inappropriate engagement (e.g., over-attribution of mental states to non-agents) in others. The clinical relevance is that improving social-cognition outcomes in schizophrenia treatment has emerged as a major goal alongside symptomatic control.",
      "In social anxiety, heightened self-referential processing in dmPFC and adjacent medial-frontal regions tracks symptom severity in some studies. The framing here is consistent with the broader picture of social anxiety as involving over-active self-monitoring during social interaction — the felt sense of being watched by an internal observer that the patient cannot disengage.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The mentalizing literature emerged in the 1990s with positron-emission-tomography (PET) studies by Chris Frith, Uta Frith, and colleagues identifying medial-frontal activation during theory-of-mind tasks. The 2006 Amodio and Frith review in *Nature Reviews Neuroscience* — \"Meeting of minds\" — was the synthesizing paper that consolidated a decade of findings and gave the field its current account of the medial-frontal cortex as a hub for social-cognitive processing [cite:amodio-frith-2006-meeting-minds].",
      "Rebecca Saxe's work in the early 2000s extended and refined the picture by demonstrating that the temporoparietal junction was particularly sensitive to mental-state content [cite:saxe-kanwisher-2003-tpj]. The fractionating-theory-of-mind meta-analysis by Schurz and colleagues in 2014 provided the contemporary network-level synthesis, with dmPFC and bilateral TPJ as the network's anchors and additional regions (precuneus, anterior temporal lobe, inferior frontal gyri) contributing to specific sub-tasks [cite:schurz-2014-fractionating-tom].",
    ],
  },
};
