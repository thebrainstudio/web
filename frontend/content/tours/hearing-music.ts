import type { Tour } from "@/lib/tours";

/**
 * Tour 6 — "Hearing music."
 *
 * Twelve scenes, ~150 seconds. The auditory-and-reward tour.
 * Traces a single chord progression from cochlea through auditory
 * cortex, the right-hemisphere bias for spectral processing, the
 * affective tagging that turns sound into music, the reward circuit
 * that makes a piece feel good, and the memory binding that makes a
 * song into a song-you-loved.
 *
 * Specifically connects to the NeuroMusic Lab — the closing scene
 * links back to it. Reward and dopaminergic structures (VTA,
 * nucleus accumbens) are mentioned by name without activation
 * targets because they are subcortical and outside the canonical
 * 20 regions; the narration handles them verbally while cortical
 * nodes (vmPFC, amygdala) drive the visual.
 */
export const hearingMusicTour: Tour = {
  id: "hearing-music",
  title: "Hearing music",
  subtitle:
    "A 2-and-a-half minute tour of the auditory and reward pathways.",
  blurb:
    "Why does a chord change move you? The hearing of music recruits a particular sequence of cortical and subcortical regions — primary auditory cortex first, the spectral-processing right hemisphere, the limbic and reward circuits that turn organized sound into something felt. This tour traces one moment of hearing.",
  estimatedDuration: 152,
  continueHref: "/music",
  continueLabel: "Continue in the NeuroMusic Lab",
  scenes: [
    {
      id: "0-air",
      duration: 10,
      narration:
        "A chord plays. Air pressure waves travel from the speaker to your ear, the cochlea decomposes them into the spectrum that makes up the sound, and the signal begins its ascent toward cortex.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "1-brainstem",
      duration: 11,
      narration:
        "Brainstem auditory nuclei — cochlear nucleus, superior olive, inferior colliculus — perform fast spectrotemporal analysis. Onset, pitch, location. None of this is conscious yet.",
      activeRegions: {},
      brainTransform: { position: [0, -0.15, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "2-hg",
      duration: 12,
      narration:
        "The medial geniculate of the thalamus relays the signal to primary auditory cortex. Heschl's gyrus on both sides. Tonotopically organized — different frequencies activate different positions along the gyrus.",
      activeRegions: { hg_left: 0.9, hg_right: 0.9 },
      brainTransform: { position: [0, 0.05, 0], scale: 1.05, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "3-right-bias",
      duration: 12,
      narration:
        "Right Heschl's leans into the work. Where left auditory cortex specializes for the temporal precision of speech, right specializes for the spectral resolution that pitch and timbre demand.",
      activeRegions: { hg_left: 0.55, hg_right: 0.95 },
      brainTransform: { position: [0.15, 0.05, 0], scale: 1.05, rotation: [0, -0.3, 0] },
      lighting: "cinematic",
    },
    {
      id: "4-secondary-auditory",
      duration: 12,
      narration:
        "Secondary auditory cortex — posterior superior temporal cortex on the right — extracts melody, harmonic structure, the contour of the line. Music as music begins to assemble here.",
      activeRegions: { hg_right: 0.7, pstg_right: 0.95, pstg_left: 0.5 },
      brainTransform: { position: [0.15, 0, 0], scale: 1.05, rotation: [0, -0.25, 0] },
      lighting: "cinematic",
    },
    {
      id: "5-emotion-fork",
      duration: 12,
      narration:
        "A subcortical route delivers the signal to the amygdala in parallel. Affective tagging — this music sounds the way it feels — runs concurrently with the cortical extraction of structure.",
      activeRegions: {
        hg_right: 0.55,
        pstg_right: 0.7,
        amyg_left: 0.8,
        amyg_right: 0.85,
      },
      brainTransform: { position: [0.05, -0.1, 0], scale: 1.05, rotation: [0, -0.05, 0] },
      lighting: "warm",
    },
    {
      id: "6-vmpfc-reward",
      duration: 12,
      narration:
        "Ventral tegmental area, nucleus accumbens, ventromedial prefrontal cortex — the reward circuit. Dopaminergic activity tracks the felt pleasure of music. Anticipated resolution, the chord that lands.",
      activeRegions: {
        amyg_left: 0.55,
        amyg_right: 0.6,
        vmpfc: 0.95,
      },
      brainTransform: { position: [0, -0.1, 0], scale: 1.05, rotation: [0, 0.1, 0] },
      lighting: "warm",
    },
    {
      id: "7-hippocampus-binds",
      duration: 12,
      narration:
        "The hippocampus binds the music to scenes. A kitchen, a person, a year. Music's famous power to retrieve autobiography lives here — at the interface between the auditory route and episodic memory.",
      activeRegions: {
        pstg_right: 0.6,
        vmpfc: 0.7,
        hipp_left: 0.85,
        hipp_right: 0.85,
      },
      brainTransform: { position: [-0.1, -0.05, 0], scale: 1.05, rotation: [0, 0.3, 0] },
      lighting: "warm",
    },
    {
      id: "8-default-mode-integration",
      duration: 12,
      narration:
        "Default-mode regions integrate the moment. Posterior cingulate, precuneus, medial prefrontal cortex. The piece is integrated into the larger sense of who you are listening, and what this music is to you.",
      activeRegions: {
        hipp_left: 0.55,
        hipp_right: 0.55,
        pcc: 0.85,
        precuneus: 0.75,
        vmpfc: 0.7,
      },
      brainTransform: { position: [0, 0.1, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "9-prediction",
      duration: 12,
      narration:
        "The brain is running ahead of the music, predicting where the line will go. Confirmation and surprise both engage reward circuitry — much of what makes music pleasurable is the dance with what you expected.",
      activeRegions: {
        pstg_right: 0.6,
        vmpfc: 0.85,
        dmpfc: 0.6,
      },
      brainTransform: { position: [0.05, 0.05, 0], scale: 1.0, rotation: [0, -0.1, 0] },
      lighting: "cinematic",
    },
    {
      id: "10-numinous",
      duration: 12,
      narration:
        "When a piece arrives with the weight Otto called numinous — something more than pleasing, something that grabs — the salience network has spoken. The felt sense of mattering travels with the music.",
      activeRegions: {
        pstg_right: 0.7,
        amyg_left: 0.6,
        amyg_right: 0.7,
        vmpfc: 0.7,
        pcc: 0.55,
      },
      brainTransform: { position: [0.05, 0.05, 0], scale: 1.0, rotation: [0, -0.1, 0] },
      lighting: "warm",
    },
    {
      id: "11-close",
      duration: 15,
      narration:
        "Music moves the same regions that move you. The auditory pathway and the limbic pathway share architecture; what you are hearing and what you are feeling are not separable here, and the dance between them is the music.",
      activeRegions: { pstg_right: 0.5, vmpfc: 0.55, amyg_right: 0.45 },
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
  ],
};
