import type { AtlasEntry } from "@/lib/atlas";

/**
 * Right inferior frontal gyrus (IFG-R) — Atlas entry.
 *
 * Voice note: the right IFG was overlooked through most of the
 * twentieth century because the contralateral Broca region carried
 * the dominant language story. Modern work reveals it as the home
 * of prosody, figurative interpretation, and (most strongly) the
 * cognitive control of behaviour and speech. The page is shorter
 * than its left-hemisphere counterpart because much of the
 * architectural background is shared.
 */
export const ifgRightAtlas: AtlasEntry = {
  id: "ifg_right",
  fullName: "Right inferior frontal gyrus",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "FrontoparietalControl",
  adjacentRegions: ["ifg_left", "mtg_right", "pstg_right"],
  relatedTours: [],
  connectivityTracts: [
    "arcuate-fasciculus",
    "uncinate-fasciculus",
    "superior-longitudinal-fasciculus",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "aprosodia",
      name: "Motor aprosodia",
      oneLine:
        "Damage to right IFG produces a flattening of speech prosody — words are still produced but the affective and grammatical melody of the voice is markedly reduced.",
    },
    {
      id: "adhd-inhibition",
      name: "ADHD and disorders of inhibitory control",
      oneLine:
        "Reduced engagement of right IFG during stop-signal tasks tracks the response-inhibition deficits characteristic of attention-deficit/hyperactivity disorder.",
    },
  ],
  primaryDiscoveryReference: "hagoort-2014-language-architecture",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "The right inferior frontal gyrus mirrors its left-hemisphere counterpart anatomically: posterior pars opercularis (BA 44), middle pars triangularis (BA 45), and anterior pars orbitalis (BA 47) along the inferior frontal lobe. The cytoarchitecture is essentially symmetric across hemispheres; the functional asymmetry is a question of which networks each side is more strongly coupled with [cite:amunts-1999-brodmann-44-45].",
      "Within network neuroscience, right IFG is a node of the ventral attention network and the broader frontoparietal control system. Its position at the junction of attention, language, and motor control gives the region its multiply-functional character.",
    ],
  },

  functionSection: {
    paragraphs: [
      "Right IFG is best known for two contributions. The first is prosody — the melodic, rhythmic, and affective layer of speech. Damage here produces motor aprosodia: words come out flat, the natural rise-and-fall of intonation collapses, and the speaker's voice loses the affective cues by which most everyday meaning is carried [cite:hagoort-2014-language-architecture]. The complementary clinical syndrome of receptive aprosodia, from damage to right pSTG, produces an impairment in *recognizing* prosody — the patient can hear the words but cannot tell whether the speaker is asking, ordering, or grieving.",
      "The second contribution is cognitive control, particularly response inhibition. Right IFG is consistently the cortical site most strongly recruited during stop-signal and go/no-go tasks — paradigms in which the participant must withhold or cancel a planned response. The role here is not language-specific; it generalizes to the inhibition of any motor action, and may extend to the inhibition of unwanted thoughts and memories. Anderson's 2004 *Science* paper on neural correlates of motivated forgetting identified increased prefrontal activation (including right IFG territory) during suppression of unwanted memories [cite:anderson-2004-suppression-unwanted].",
      "Beyond prosody and inhibition, right IFG is recruited during figurative-language comprehension — irony, metaphor, sarcasm — that requires inferring what the speaker means beyond what they literally say. The region's joint participation in language, attention, and inhibitory control places it at the intersection of cognitive systems whose interaction is part of what fluent social communication requires.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Right IFG's cytoarchitecture is essentially symmetric with the left IFG — six-layered association cortex dominated by layer III and V glutamatergic pyramidal neurons, with the inhibitory infrastructure characteristic of frontal cortex. The hemispheric differences in function reflect differences in connectivity rather than differences in local cellular composition [cite:amunts-1999-brodmann-44-45].",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The right arcuate fasciculus is generally smaller and less consistently lateralized than its left counterpart, with notable inter-individual variation — some right-hemispheres show a robust arcuate fasciculus, others show only a vestigial or split tract [cite:catani-2005-arcuate-fasciculus]. This asymmetry matters: it is part of why language is left-lateralized in most right-handers but not entirely so, and part of why post-stroke recovery of language depends on the integrity of right-hemisphere pathways that can partially compensate.",
      "Right IFG's principal connections within its more reliable territory are with right anterior temporal cortex (uncinate fasciculus), right inferior parietal cortex (superior longitudinal fasciculus), and (across the corpus callosum) its left-hemisphere counterpart. These pathways carry the prosodic and figurative-comprehension information the region elaborates.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Motor aprosodia following right-hemisphere stroke is the clinical syndrome that established right IFG's role in prosody. Patients produce grammatically correct sentences but in a monotone, with the natural prosodic structure of the voice flattened or absent. The condition is one of the cleaner demonstrations that prosody is not merely a stylistic feature of speech but a separable function with its own neural substrate.",
      "In ADHD and broader disorders of inhibitory control, reduced engagement of right IFG during stop-signal tasks is among the more replicated functional-imaging findings. The translation to clinical practice has been one of the more productive areas of cognitive-neuroscience-informed psychiatry, with cognitive-training interventions targeting the inhibitory-control network showing modest but real effects.",
      "In post-stroke aphasia recovery, the right IFG's ability to support partial language function depends on the integrity of right-hemisphere pathways and on whether the patient's pre-stroke language organization was strongly left-lateralized. The clinical implication is that the same lesion produces different recovery trajectories depending on baseline hemispheric organization.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Right IFG was overlooked for most of the twentieth century because the contralateral Broca region carried the dominant language story. The shift began with Elliott Ross's 1981 paper describing aprosodia syndromes following right-hemisphere lesions — a clinical observation that gave right IFG its first explicit functional account.",
      "The contemporary picture has emerged from functional imaging on cognitive-control tasks (notably Adrian Owen's and Adam Aron's work in the early 2000s on right IFG and response inhibition), Iain McGilchrist's *Master and His Emissary* synthesis of right-hemisphere contributions to thought, and the integrated language-network models in which Hagoort and others have given the region a coherent place [cite:hagoort-2014-language-architecture] [cite:mcgilchrist-master-emissary].",
    ],
  },
};
