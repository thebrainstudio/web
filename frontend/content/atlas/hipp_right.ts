import type { AtlasEntry } from "@/lib/atlas";

/**
 * Right hippocampus (HIPP-R) — Atlas entry.
 *
 * Voice note: right hippocampus carries the heaviest burden for
 * spatial cognition and scene construction. The famous London
 * taxi-driver study found posterior right (and left) hippocampus
 * volume increases with years of navigating the city. The
 * Hassabis & Maguire scene-construction framework reframes the
 * region's role beyond episodic memory.
 *
 * Where left hippocampus carries the verbal-episodic burden,
 * right hippocampus is the home of spatial maps, scene
 * imagination, and the simulation of possible futures.
 */
export const hippRightAtlas: AtlasEntry = {
  id: "hipp_right",
  fullName: "Right hippocampus",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "Limbic",
  adjacentRegions: ["hipp_left", "amyg_right", "atl_right", "precuneus"],
  relatedTours: ["the-act-of-remembering"],
  connectivityTracts: ["fornix", "perforant-pathway", "cingulum-bundle"],
  cellTypes: [
    { name: "CA1 pyramidal cell" },
    { name: "CA3 pyramidal cell" },
    { name: "Dentate gyrus granule cell" },
    { name: "Place cell" },
  ],
  disorders: [
    {
      id: "developmental-amnesia",
      name: "Developmental amnesia",
      oneLine:
        "Selective hypoxic-ischaemic damage to bilateral hippocampi in early childhood produces a striking inability to form new episodic memories with preserved semantic learning — a natural experiment relevant to right and left hippocampi alike.",
    },
    {
      id: "alzheimers",
      name: "Alzheimer's disease",
      oneLine:
        "Right hippocampal atrophy is among the earlier structural changes in the disease alongside its left counterpart, with the spatial-memory and navigation-deficit components often tracking the right-hemisphere pathology.",
    },
    {
      id: "topographical-amnesia",
      name: "Topographical amnesia",
      oneLine:
        "Selective inability to form spatial maps of familiar environments following right hippocampal damage; patients can describe routes verbally but get lost in places they once knew well.",
    },
  ],
  primaryDiscoveryReference: "okeefe-dostrovsky-1971-place-cells",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Right hippocampus mirrors its left counterpart in gross anatomy and cellular architecture — the curved seahorse-shaped structure in the medial temporal lobe, with the dentate gyrus, cornu ammonis subfields (CA1, CA2, CA3, CA4), and subiculum arranged in their characteristic layered organization [cite:amaral-lavenex-2007-hippocampus-anatomy]. The functional asymmetry between hemispheres emerges from connectivity differences and from the lateralization of related cortical systems rather than from differences in local structure.",
    ],
  },

  functionSection: {
    paragraphs: [
      "Right hippocampus carries the heaviest functional burden for spatial cognition, scene construction, and the imagination of possible futures. Where left hippocampus is more strongly recruited for verbal-episodic memory (the felt history of language-narrated events), right hippocampus is more strongly recruited for the construction of mental scenes — visualizing a familiar room, navigating a remembered route, picturing oneself in a future situation [cite:maguire-2000-taxi-drivers].",
      "The famous London taxi-driver study, in which Eleanor Maguire and colleagues showed that posterior hippocampal volume increased with years of navigating London's irregular streets, demonstrated use-dependent structural change in adult brains and gave the field its most-cited demonstration of right hippocampus's role in spatial-cognitive mapping [cite:maguire-2000-taxi-drivers]. The volume increase was specifically in the posterior hippocampus and bilateral, but the effect was particularly robust on the right and the spatial-cognitive component tracked the right-hemisphere pathology in subsequent studies of navigation impairment.",
      "Hassabis and Maguire's 2007 scene-construction framework reframes the hippocampus's role beyond memory: the same circuit that retrieves a remembered scene is recruited when one imagines a possible future scene, a counterfactual past, a fictional location one has never visited [cite:hassabis-maguire-2007-scene-construction]. This account places right hippocampus at the centre of mental simulation more generally — not just remembering where one has been but constructing scenes that could be, scenes that aren't, scenes that might one day occur.",
      "The depth-psychological resonance is with Jung's account of active imagination as conscious dialogue with internally-constructed scenes and figures. The neuroscience does not endorse Jung's metaphysics, but the mechanism by which interior scenes are built has substantial overlap with the mechanism by which exterior scenes are remembered — and the same circuit serves both directions of time [cite:jung-memories-dreams-reflections].",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Right hippocampus's cellular composition mirrors its left counterpart — the trisynaptic circuit through dentate gyrus granule cells, CA3 pyramidal neurons with their recurrent autoassociative collaterals, and CA1 pyramidal neurons as the principal output [cite:amaral-lavenex-2007-hippocampus-anatomy]. The discovery that made the hippocampus famous for spatial cognition, John O'Keefe and Jonathan Dostrovsky's 1971 paper identifying \"place cells\" — neurons that fire whenever the animal occupies a specific location in its environment — applies to both hippocampi but is most strongly tied to the right hippocampus in the human imaging literature [cite:okeefe-dostrovsky-1971-place-cells].",
      "Descend into the Cellular View for reconstructed CA1 and CA3 pyramidal neurons and dentate granule cells from the open archives; the morphology is shared across hemispheres.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "Right hippocampus's white-matter connectivity mirrors its left counterpart — the perforant pathway carrying input from right entorhinal cortex, the fornix carrying output forward to right mammillary bodies and anterior thalamus, and the cingulum bundle linking to posterior cingulate and precuneus on the right [cite:amaral-lavenex-2007-hippocampus-anatomy]. The right-lateralized connectivity with visuospatial cortex (right parietal regions, right parahippocampal cortex) and with the scene-construction-network anchored on right angular gyrus and right precuneus gives right hippocampus its bias toward spatial and scene-based processing [cite:hassabis-maguire-2007-scene-construction].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Topographical amnesia from right hippocampal damage is a striking clinical syndrome in which patients lose the ability to form spatial maps of familiar environments — they can describe routes verbally and recognize landmarks individually but cannot integrate the spatial relationships into a usable cognitive map. The dissociation with verbal-episodic memory (often preserved in selective right hippocampal damage) establishes the spatial-vs-verbal asymmetry as functionally real.",
      "In Alzheimer's disease, right hippocampal atrophy is among the earlier structural changes alongside its left counterpart [cite:small-2011-hippocampal-circuit-disorders]. The spatial-cognitive component of early Alzheimer's — getting lost in familiar places, difficulty navigating, impaired sense of direction — often tracks the right-hippocampus pathology while the verbal-memory component tracks the left-hippocampus pathology. Both components contribute to the clinical presentation.",
      "Developmental amnesia — the rare syndrome of selective hypoxic-ischaemic damage to bilateral hippocampi in early childhood — produces a profound inability to form new episodic memories with relatively preserved semantic learning. The condition, described in detail by Faraneh Vargha-Khadem and colleagues, has been central to refining the modern multiple-systems view of memory and to clarifying the relative contributions of right and left hippocampi.",
      "Right hippocampus damage from temporal lobe epilepsy or surgical resection (anterior temporal lobectomy for intractable epilepsy) produces selective spatial-memory and navigation impairments — the patients can still learn verbal material but lose the spatial-cognitive scaffold the right hippocampus provides.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The hippocampus's spatial-cognition role was discovered through John O'Keefe and Jonathan Dostrovsky's 1971 identification of place cells in the rodent hippocampus — neurons that fire whenever the animal occupies a particular location in its environment [cite:okeefe-dostrovsky-1971-place-cells]. The discovery established the hippocampus as a cognitive-map structure (O'Keefe and Lynn Nadel's 1978 *Hippocampus as a Cognitive Map* gave the field its founding synthesis) and was recognized with the 2014 Nobel Prize in Physiology or Medicine.",
      "The human-side functional account, including the right-hemisphere bias for spatial cognition, emerged from the late-1990s and 2000s imaging studies of navigation, with Maguire et al.'s 2000 London taxi-driver paper as the most-cited demonstration of use-dependent structural change in adult human hippocampus [cite:maguire-2000-taxi-drivers]. The 2007 Hassabis and Maguire reframing of the hippocampus's role from memory to scene construction extended the picture to imagination and prospective thinking, placing right hippocampus at the centre of the brain's machinery for constructing internally-generated scenes more generally [cite:hassabis-maguire-2007-scene-construction].",
    ],
  },
};
