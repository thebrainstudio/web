import type { AtlasEntry } from "@/lib/atlas";

/**
 * Ventromedial prefrontal cortex (vmPFC) — Atlas entry.
 *
 * Voice note: vmPFC is the canonical "value" hub in contemporary
 * decision neuroscience. The Damasio somatic-marker tradition is
 * the historical entry point; the contemporary Rangel-Hare-Camerer
 * tradition is the empirical workhorse. The page leans on both.
 *
 * The region's relationship to depth psychology runs through the
 * default-mode network (vmPFC is a DMN node) and through the
 * psychodynamic picture of an ego whose value-judgments are not
 * always available to consciousness. The Bridges link is to the
 * DMN-and-self-system section.
 */
export const vmpfcAtlas: AtlasEntry = {
  id: "vmpfc",
  fullName: "Ventromedial prefrontal cortex",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "DefaultMode",
  adjacentRegions: ["dmpfc", "pcc", "amyg_left", "amyg_right"],
  relatedTours: ["whats-still-you-when-you-stop-trying"],
  connectivityTracts: ["uncinate-fasciculus", "cingulum-bundle"],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
    { name: "Von Economo neurons" },
  ],
  disorders: [
    {
      id: "frontotemporal-dementia-bv",
      name: "Behavioural-variant frontotemporal dementia (bvFTD)",
      oneLine:
        "Atrophy of vmPFC and adjacent orbitofrontal cortex produces disinhibition, loss of empathy, and characteristic decision-making impairments.",
    },
    {
      id: "depression",
      name: "Major depressive disorder",
      oneLine:
        "Aberrant vmPFC activity and connectivity are implicated in the negative-valence biases and rumination characteristic of the disorder.",
    },
    {
      id: "ptsd",
      name: "Post-traumatic stress disorder",
      oneLine:
        "Reduced vmPFC engagement during emotion regulation is one of the more replicated functional findings.",
    },
    {
      id: "addiction",
      name: "Substance-use disorders",
      oneLine:
        "Altered value representation in vmPFC contributes to the persistence of choosing immediate reward over longer-term goals.",
    },
  ],
  primaryDiscoveryReference: "bechara-damasio-2005-iowa-gambling",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Ventromedial prefrontal cortex occupies the inferior portion of the medial frontal wall, extending from the rostral pole of the frontal lobe back to the anterior cingulate, and continuing inferiorly into the orbital surface. The region is heterogeneous, including portions of Brodmann areas 10, 14, 25, and 32. Boundaries with adjacent orbitofrontal cortex and pregenual anterior cingulate are graded rather than crisp; different research groups draw the lines slightly differently [cite:amodio-frith-2006-meeting-minds].",
      "vmPFC sits at a structural crossroads: it receives dense projections from the amygdala via the uncinate fasciculus, from the hippocampal formation via the cingulum bundle, from the dorsomedial thalamus via thalamic radiations, and from posterior default-mode regions via long medial cortico-cortical pathways. This convergence is part of why a single region ends up implicated in so many different functional accounts.",
    ],
  },

  functionSection: {
    paragraphs: [
      "vmPFC is the canonical site of subjective value representation in contemporary decision neuroscience. When humans choose between options — foods, monetary lotteries, social outcomes — the BOLD signal in vmPFC scales with the subjective value of the chosen option in a way that holds across modalities, contexts, and individual preferences [cite:hare-camerer-rangel-2009-self-control-vmpfc]. The same vmPFC activity tracks both taste and health value in self-controllers exercising deliberate restraint; in non-self-controllers, it tracks only taste. This is one of the cleaner functional dissociations in cognitive neuroscience.",
      "The historical entry point is Antonio Damasio's somatic-marker hypothesis. Damasio and colleagues observed that patients with vmPFC damage retained normal intelligence and explicit knowledge of consequences but made systematically poor decisions in tasks like the Iowa Gambling Task, where successful choice depends on integrating affective signals about prior outcomes [cite:bechara-damasio-2005-iowa-gambling]. The somatic-marker framework proposed that vmPFC binds bodily-affective signals to deliberative choice — that good decision-making depends on access to a felt, not just a known, sense of what matters.",
      "Beyond valuation, vmPFC is a reliable node of the default-mode network and is recruited during self-referential thought, autobiographical memory retrieval, and the simulation of others — particularly the simulation of others similar to oneself [cite:northoff-2006-self-referential-meta]. The region's participation in both deliberate valuation and resting self-referential processing is not a coincidence; both involve the construction and consultation of internal models in which what one cares about is represented.",
      "Carhart-Harris and Friston's mapping of default-mode function onto Freudian ego function places vmPFC squarely within the bridge to depth psychology [cite:carhart-harris-friston-2010-default-mode-ego]. What classical psychoanalysis described as the ego's reality-testing and value-integration functions — the difficult work of holding what one wants alongside what is possible — has, in part, the empirical face of vmPFC's value computation.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Like the rest of the medial prefrontal cortex, vmPFC is dominated by glutamatergic pyramidal neurons across layers III and V, with the rich inhibitory infrastructure characteristic of association cortex. The region also contains sparse populations of Von Economo neurons — large, spindle-shaped layer V projection cells concentrated in anterior cingulate and fronto-insular cortex, and which extend into the medial wall here [cite:amodio-frith-2006-meeting-minds]. Their precise function remains debated; what is reliable is that their distribution maps onto regions with particularly rich long-range integrative connectivity.",
      "Descend into the Cellular View for reconstructed frontal pyramidal neurons; the prefrontal cells in the archives carry the long, extensively branched apical dendrites characteristic of association cortex.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The uncinate fasciculus carries reciprocal connections between vmPFC and the basolateral amygdala — the principal route by which affective signals are bound to deliberative valuation, and the principal route by which prefrontal cortex modulates amygdala reactivity in emotion regulation [cite:phelps-ledoux-2005-amygdala-contributions]. Damage to this tract disrupts both directions of the conversation, contributing to the characteristic decision-making impairments of vmPFC-lesion patients.",
      "The cingulum bundle carries vmPFC into the wider default-mode network, with strong reciprocal connections to posterior cingulate, precuneus, and (via continuations through the cingulum-fornix pathway) the hippocampal formation. These connections support the binding of value representations to autobiographical memory and to self-referential processing more broadly [cite:andrews-hanna-2010-default-network-functional].",
      "Local connections to anterior cingulate, dorsomedial prefrontal cortex, and orbitofrontal cortex situate vmPFC within a tightly coupled medial-frontal system in which different sub-regions handle different but overlapping aspects of value, control, and social cognition [cite:amodio-frith-2006-meeting-minds].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Behavioural-variant frontotemporal dementia (bvFTD) produces striking changes in personality, social judgment, and decision-making with relatively preserved memory in early stages. The atrophy involves vmPFC and adjacent orbitofrontal and anterior insular cortex; the clinical syndrome — disinhibition, apathy, loss of empathy, poor financial judgment — illustrates what happens when value-integration machinery degrades while episodic memory remains. The disease is among the cleanest natural experiments on what vmPFC contributes.",
      "In major depressive disorder, vmPFC activity and connectivity patterns are altered in ways that contribute to the disorder's characteristic biases toward negative self-evaluation and to ruminative self-referential thought. The default-mode-network framing helps here: hyperconnectivity within the DMN, including vmPFC, has been linked to the kind of inward-turning rumination that distinguishes depressive cognition.",
      "Substance-use disorders show altered representation of immediate versus delayed reward in vmPFC, with implications for the persistence of choosing immediate gratification over longer-term goals — a finding that matters clinically for therapeutic interventions aimed at strengthening the dorsolateral-prefrontal modulation of vmPFC value signals demonstrated by Hare and colleagues [cite:hare-camerer-rangel-2009-self-control-vmpfc].",
      "In PTSD, reduced vmPFC engagement during emotion regulation is one of the more replicated functional findings. The mechanistic reading is that effective regulation of amygdala reactivity requires intact vmPFC-amygdala communication along the uncinate fasciculus; when that communication is weakened, threat-related signals are less readily down-regulated by cortical context.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The modern functional story of vmPFC begins with Phineas Gage's 1848 case — the railway worker whose famous frontal injury (passing an iron rod through his orbitofrontal and ventromedial cortex) preserved his intelligence and language but, by contemporary accounts, transformed his social conduct and decision-making. The case was reanalyzed by Hanna Damasio and colleagues in the 1990s using modern imaging on Gage's preserved skull, with results consistent with the hypothesis that vmPFC damage selectively impairs the integration of affect into choice.",
      "The empirical case was made systematic by Antonio Damasio and colleagues with the Iowa Gambling Task — a card-choice paradigm in which lesion patients perform normally on standard cognitive tests but fail to learn from emotional feedback about outcomes [cite:bechara-damasio-2005-iowa-gambling]. Damasio's somatic-marker framework gave the field its first coherent functional account of what vmPFC contributes to decision-making, and the picture has been extended and refined by Antonio Rangel, Todd Hare, Colin Camerer, and others using fMRI and economic-choice paradigms [cite:hare-camerer-rangel-2009-self-control-vmpfc].",
    ],
  },
};
