import type { AtlasEntry } from "@/lib/atlas";

/**
 * Right angular gyrus (AGL-R) — Atlas entry.
 *
 * Voice note: where left AGL is the heteromodal hub of language
 * and semantic integration, right AGL is the cortical anchor for
 * bodily self-location, spatial cognition, and the felt sense of
 * being where you are. The page leans on Blanke's 2012 review of
 * bodily self-consciousness and Cavanna's broader account of the
 * posteromedial cortex's role in consciousness.
 */
export const aglRightAtlas: AtlasEntry = {
  id: "agl_right",
  fullName: "Right angular gyrus",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "DefaultMode",
  adjacentRegions: ["agl_left", "mtg_right", "pcc"],
  relatedTours: ["whats-still-you-when-you-stop-trying"],
  connectivityTracts: [
    "superior-longitudinal-fasciculus",
    "inferior-longitudinal-fasciculus",
    "cingulum-bundle",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "out-of-body-experiences",
      name: "Out-of-body experiences",
      oneLine:
        "Electrical stimulation and lesion studies implicate right temporoparietal cortex — including angular gyrus and adjacent TPJ — in the dissociation between bodily self-location and visual perspective that produces out-of-body experiences.",
    },
    {
      id: "hemispatial-neglect",
      name: "Hemispatial neglect",
      oneLine:
        "Right inferior parietal damage (often involving angular gyrus) produces the inability to attend to the contralesional half of space — one of the more striking syndromes in clinical neurology.",
    },
    {
      id: "acalculia",
      name: "Acalculia and number-processing impairments",
      oneLine:
        "Right angular gyrus damage contributes to specific deficits in number magnitude representation and arithmetic, complementary to the symbolic-arithmetic role of left angular gyrus.",
    },
  ],
  primaryDiscoveryReference: "blanke-2012-bodily-self",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Right angular gyrus mirrors its left counterpart in gross anatomy — the posterior portion of the inferior parietal lobule, wrapping around the posterior end of the superior temporal sulcus, with the supramarginal gyrus anteriorly and the parietal cortex superiorly [cite:seghier-2013-angular-gyrus]. The hemispheric asymmetry is functional and connectivity-based rather than structural.",
      "Right AGL sits at the centre of the right temporoparietal junction (TPJ) territory, with which it overlaps functionally for several of the roles described below. The careful contemporary literature distinguishes right AGL (more parietal, more involved in spatial-attention and body-schema work) from right TPJ proper (more involved in theory-of-mind tasks) [cite:blanke-2012-bodily-self].",
    ],
  },

  functionSection: {
    paragraphs: [
      "Right AGL specializes in three overlapping functions: spatial attention, the construction of bodily self-location, and the affective and visuospatial layers of number cognition. The first two are tightly bound — what cognitive neuroscience now describes as bodily self-consciousness sits at the intersection of multisensory integration of body-related signals (proprioception, vision, vestibular) and the spatial sense of being located in the world [cite:blanke-2012-bodily-self].",
      "Olaf Blanke's 2012 *Nature Reviews Neuroscience* synthesis identifies right temporoparietal cortex, including right AGL, as central to the multisensory mechanisms of bodily self-consciousness — specifically the construction of self-identification (the experience of identifying with one's body), self-location (the felt position of 'I' in space), and first-person perspective (the experience of perceiving the world from a particular embodied vantage point) [cite:blanke-2012-bodily-self]. Electrical stimulation of this region has been shown to produce out-of-body experiences in which the patient feels themselves to be outside their physical body looking back at it.",
      "Within the spatial-attention literature, right AGL and adjacent parietal cortex are central to the orienting and reorienting of attention to salient stimuli — particularly the unexpected, the bottom-up, the stimulus that arrives outside the current task focus. Damage produces hemispatial neglect: the patient does not attend to the contralesional (typically left) half of space, eating only food on the right side of the plate, dressing only the right side of the body, drawing only the right side of a clock face. The condition is among the more striking syndromes in clinical neurology because patients are often unaware of the deficit itself — the missing half of the world is not experienced as missing [cite:seghier-2013-angular-gyrus].",
      "In number cognition, right AGL contributes to magnitude representation and the visuospatial aspects of arithmetic, complementing left AGL's role in symbolic-arithmetic retrieval. The bilateral involvement is part of why complex calculation engages a network of parietal regions rather than any single arithmetic centre.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Right AGL's cytoarchitecture mirrors its left counterpart — six-layered association cortex with extensive layer III and V long-range pyramidal projections. The hemispheric functional asymmetry reflects connectivity differences (with right-hemisphere attention, body-schema, and spatial systems) rather than differences in local cellular composition [cite:seghier-2013-angular-gyrus].",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "Right AGL sits within the right-lateralized ventral attention network, with strong reciprocal connections to right ventrolateral prefrontal cortex via the right superior longitudinal fasciculus. Within the default-mode network, right AGL is a lateral parietal hub coupled with posterior cingulate, precuneus, and medial prefrontal cortex through the cingulum bundle [cite:andrews-hanna-2010-default-network-functional].",
      "The region's connectivity with right superior temporal sulcus, right premotor cortex, and (through deeper subcortical pathways) the vestibular system provides the architectural basis for its role in multisensory integration of body-related signals [cite:blanke-2012-bodily-self].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Hemispatial neglect from right inferior parietal damage is the most-cited clinical syndrome involving right AGL territory. The condition is among the cleaner demonstrations that conscious attention to space depends on cortical processing rather than being a property of sensory input alone — patients with intact eyes and intact visual cortex fail to attend to the contralesional half of the world they continue to receive normal sensory input from.",
      "Out-of-body experiences and related phenomena of bodily-self dissociation have been produced experimentally by direct cortical stimulation of right temporoparietal regions including AGL. The findings underwrite the framework in which the felt sense of being a located embodied self has cortical correlates that can be selectively perturbed [cite:blanke-2012-bodily-self]. These results are sometimes over-interpreted in popular accounts as showing that the soul lives in the angular gyrus; the careful reading is that the construction of a unified bodily self has neural substrate, of which right AGL is one important node.",
      "Right-hemisphere stroke involving AGL territory produces a constellation of impairments that includes neglect, spatial-attention difficulties, body-schema disturbances, and (sometimes) the more dramatic syndromes of asomatognosia (failure to recognize one's own limb as one's own) or anosognosia (lack of awareness of the deficit itself). The breadth of impairments reflects the region's role as a connector hub.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Right AGL's role in spatial attention emerged from the clinical literature on right-hemisphere neglect, systematized in the second half of the twentieth century by Marcel Mesulam, Edoardo Bisiach, and others. The body-schema and bodily-self-consciousness roles were established more recently, largely through Olaf Blanke's program of work in the 2000s on the neural correlates of out-of-body experiences and related dissociations, synthesized in his 2012 *Nature Reviews Neuroscience* review [cite:blanke-2012-bodily-self].",
      "The integration of right AGL into the broader network-neuroscience framework — as a default-mode-network connector hub and a ventral-attention-network anchor — is part of the contemporary picture given by Andrews-Hanna and colleagues' fractionation of the default-mode network and by Seghier's 2013 review of the multiple-functions-and-subdivisions structure of the angular gyrus more generally [cite:andrews-hanna-2010-default-network-functional] [cite:seghier-2013-angular-gyrus].",
    ],
  },
};
