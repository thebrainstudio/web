import type { AtlasEntry } from "@/lib/atlas";

/**
 * Posterior superior temporal gyrus (right) — Atlas entry.
 *
 * Voice note: right pSTG is the cortical anchor for melody,
 * prosody, and the affective layer of voice. Zatorre and Belin's
 * 2001 study established the spectral-vs-temporal asymmetry that
 * gives this region its specialization. The page connects to the
 * NeuroMusic Lab and to the Bridges section on salience and
 * numinosity (where the affective shape of voice and music
 * participates in what Otto called the numinous).
 */
export const pstgRightAtlas: AtlasEntry = {
  id: "pstg_right",
  fullName: "Right posterior superior temporal gyrus",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "Auditory",
  adjacentRegions: ["pstg_left", "mtg_right", "hg_right"],
  relatedTours: ["hearing-music"],
  connectivityTracts: [
    "arcuate-fasciculus",
    "inferior-longitudinal-fasciculus",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer IV granule cell" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "amusia",
      name: "Congenital and acquired amusia",
      oneLine:
        "Selective impairment of pitch and melody processing, with right pSTG and adjacent right superior temporal regions consistently implicated in both developmental and acquired forms.",
    },
    {
      id: "receptive-aprosodia",
      name: "Receptive aprosodia",
      oneLine:
        "Damage to right posterior superior temporal cortex impairs the recognition of speech prosody — the patient hears the words but cannot read the affective tone in which they are delivered.",
    },
  ],
  primaryDiscoveryReference: "zatorre-belin-2001-spectral-temporal",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Right posterior superior temporal gyrus mirrors its left-hemisphere counterpart in gross anatomy — the posterior superior temporal cortex bordering the lateral sulcus, posterior to Heschl's gyrus, superior to the middle temporal gyrus. The cytoarchitecture is approximately symmetric across hemispheres; the functional asymmetry reflects differences in how each side decomposes auditory input rather than differences in the local circuit [cite:zatorre-belin-2001-spectral-temporal].",
    ],
  },

  functionSection: {
    paragraphs: [
      "Right pSTG is most reliably recruited during the processing of pitch, melody, and the affective shape of voice. Zatorre and Belin's 2001 PET study established the field's canonical account of the hemispheric asymmetry: left auditory cortex is biased toward fine temporal resolution (which supports the rapid sequential discriminations of phonemic processing), while right auditory cortex is biased toward fine spectral resolution (which supports pitch, timbre, and the contour of melody) [cite:zatorre-belin-2001-spectral-temporal]. The asymmetry is partial — both hemispheres do both — but it is reliable enough to explain a substantial portion of why the right hemisphere matters more for music and the affective layer of speech.",
      "Beyond music, right pSTG is the cortical anchor for prosody — the rise-and-fall of vocal pitch that carries affective and grammatical information distinct from the words themselves. Damage to right pSTG produces receptive aprosodia: the patient hears the words correctly but cannot read the affective tone in which they are delivered, and so cannot tell from voice alone whether the speaker is asking, ordering, or grieving. The complementary syndrome of motor aprosodia from right IFG damage produces the parallel impairment in *producing* prosody.",
      "The right posterior superior temporal region also participates in voice identity recognition — telling one familiar speaker's voice from another independent of what they are saying. Phonagnosia, the selective inability to recognize voices, is associated with right temporal damage. The region's specialization for the spectral envelope of vocal sound is what gives it this role.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Right pSTG shares its cellular architecture with its left counterpart — six-layered association cortex with a granular layer IV reflecting the region's role as an early auditory association area. The hemispheric differences in function reflect differences in connectivity and (subtly) in cortical microstructure — Zatorre and Belin proposed that the asymmetric specialization may be related to anatomical differences in myelination and cortical column spacing [cite:zatorre-belin-2001-spectral-temporal].",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "Right pSTG receives its principal input from right HG and from secondary auditory regions on the planum temporale. Its long-range connections place it within the right-hemisphere language and music networks via the arcuate fasciculus (to right IFG) and the inferior longitudinal fasciculus (to right anterior temporal cortex).",
      "Within the broader auditory hierarchy, right pSTG sits one stage downstream of primary auditory cortex and participates in the integration of spectral information with the broader cortical representations of music, voice, and emotional prosody [cite:kell-2018-auditory-task-network].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Congenital amusia (tone-deafness) and acquired amusia from right-hemisphere stroke both implicate right pSTG and adjacent right superior temporal regions. The condition is one of the cleaner demonstrations that musical pitch processing has dedicated neural substrate distinct from language; many amusics have normal language and normal hearing but cannot distinguish musical intervals or detect melodic-contour violations that most listeners hear effortlessly.",
      "Receptive aprosodia from right-hemisphere stroke is the clinical syndrome most strongly tied to right pSTG damage. The condition has been under-diagnosed historically because patients can still speak and respond to the verbal content of speech — the loss of prosodic comprehension is subtle on the surface and reveals itself mainly in the social-communication difficulties the patient encounters afterward.",
      "Voice-identity agnosia (phonagnosia), selective for vocal identity rather than acoustic content, is associated with right temporal damage and provides a parallel demonstration to face-identity agnosia (prosopagnosia) — both implicate right-hemisphere specialization for person-specific perceptual processing.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The hemispheric asymmetry in auditory cortex has been described since the early-twentieth-century clinical observations that left-hemisphere lesions disproportionately impaired language while right-hemisphere lesions disproportionately impaired music. The contemporary functional account is anchored on Zatorre and Belin's 2001 PET study demonstrating that core auditory cortices in both hemispheres respond to temporal variation but with a leftward bias, while right-hemisphere belt cortices specialize for spectral processing [cite:zatorre-belin-2001-spectral-temporal].",
      "The subsequent literature has refined this picture across paradigms — Patrik Belin's work on voice-selective cortex (the temporal voice area), Robert Zatorre's continuing studies of musical pitch processing, and Andrew Kell and colleagues' demonstration that task-optimized neural networks recapitulate human auditory hierarchy in a way consistent with the spectral-temporal asymmetry [cite:kell-2018-auditory-task-network].",
    ],
  },
};
