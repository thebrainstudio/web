import type { Tour } from "@/lib/tours";

/**
 * Tour 1 — "The act of remembering."
 *
 * Twelve scenes, ~150 seconds total. Traces the act of recalling a
 * scene from one's past — from the cue arriving at sensory cortex,
 * through hippocampal reconstruction, through default-mode
 * integration, to the closing observation that every retrieval
 * rewrites the trace. The Bridges § 4 thesis (memory as
 * reconstruction) is the page's payoff.
 *
 * Narration discipline: ~130-150 wpm in this register. Scene
 * durations are sized so a calm reader finishes each scene's text
 * just before the next one arrives. Brain regions named in the
 * narration appear in the same scene's activeRegions.
 */
export const actOfRememberingTour: Tour = {
  id: "the-act-of-remembering",
  title: "The act of remembering",
  subtitle: "A 2-minute journey through how the past is reconstructed.",
  blurb:
    "Memory is not stored and retrieved like a file from a drive. It is reconstructed at each recall, and the reconstruction reshapes the trace. This tour traces one act of remembering — from the cue arriving at cortex, through hippocampal binding, through default-mode integration, to the trace re-closing in a new shape.",
  estimatedDuration: 152,
  continueHref: "/bridges#memory-reconstruction",
  continueLabel: "Continue in the Bridges page",
  scenes: [
    {
      id: "0-arrival",
      duration: 10,
      narration:
        "Begin with a cue. A scent. A song. A name. Something arrives at the periphery, and the act of remembering begins before you notice it has.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "1-sensory",
      duration: 10,
      narration:
        "Sensory cortex receives the signal first. For a smell, the olfactory bulb. For a song, primary auditory cortex. The mechanism is automatic; the recognition is not yet conscious.",
      activeRegions: { hg_left: 0.85, hg_right: 0.85 },
      brainTransform: { position: [0.1, 0.05, 0], scale: 1.0, rotation: [0, -0.1, 0] },
      lighting: "cinematic",
    },
    {
      id: "2-association",
      duration: 12,
      narration:
        "Within milliseconds, the signal reaches lateral temporal cortex. The brain begins comparing the new input against patterns it already holds — looking for what this might be.",
      activeRegions: {
        hg_left: 0.55,
        hg_right: 0.55,
        pstg_left: 0.7,
        pstg_right: 0.7,
        mtg_left: 0.6,
      },
      brainTransform: { position: [0.2, 0.0, 0], scale: 1.0, rotation: [0, -0.18, 0] },
      lighting: "cinematic",
    },
    {
      id: "3-medial-temporal",
      duration: 14,
      narration:
        "The signal reaches the medial temporal lobe. The hippocampus, the structure named for a seahorse, does not store memories the way a drive stores files. It binds context to content, then lets go.",
      activeRegions: {
        pstg_left: 0.4,
        mtg_left: 0.45,
        hipp_left: 0.95,
        hipp_right: 0.95,
        atl_left: 0.6,
      },
      brainTransform: { position: [-0.25, -0.1, 0], scale: 1.05, rotation: [0, 0.2, 0] },
      lighting: "warm",
    },
    {
      id: "4-amygdala-tag",
      duration: 12,
      narration:
        "If the memory carries emotional weight, the amygdala signals salience. Vivid recall — the kind you cannot shake — relies on this tagging at encoding.",
      activeRegions: {
        hipp_left: 0.85,
        hipp_right: 0.85,
        amyg_left: 0.8,
        amyg_right: 0.8,
      },
      brainTransform: { position: [-0.2, -0.15, 0], scale: 1.05, rotation: [0, 0.25, 0] },
      lighting: "warm",
    },
    {
      id: "5-reconstruction",
      duration: 14,
      narration:
        "Reconstruction begins. Sensory traces, contextual cues, and the emotional tag are bound together into a scene. The scene is not retrieved. It is built, here, now, for this recall.",
      activeRegions: {
        hipp_left: 0.95,
        hipp_right: 0.95,
        mtg_left: 0.7,
        atl_left: 0.7,
        precuneus: 0.75,
      },
      brainTransform: { position: [-0.1, 0.05, 0], scale: 1.05, rotation: [0, 0.05, 0] },
      lighting: "warm",
    },
    {
      id: "6-dmn-integration",
      duration: 14,
      narration:
        "The default-mode network takes over. Posterior cingulate, precuneus, and angular gyrus integrate the scene into the larger sense of a self moving through time.",
      activeRegions: {
        hipp_left: 0.55,
        hipp_right: 0.55,
        pcc: 0.9,
        precuneus: 0.95,
        agl_left: 0.85,
        agl_right: 0.85,
        vmpfc: 0.7,
      },
      brainTransform: { position: [0, 0.15, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "7-self-evaluation",
      duration: 12,
      narration:
        "Medial prefrontal cortex evaluates: is this me? Is this what I would do, what I did, what I want to have done? The remembered self is appraised by the present self.",
      activeRegions: {
        pcc: 0.7,
        precuneus: 0.8,
        vmpfc: 0.95,
        dmpfc: 0.7,
      },
      brainTransform: { position: [0, 0.2, 0], scale: 1.0, rotation: [0, 0.05, 0] },
      lighting: "cinematic",
    },
    {
      id: "8-rewriting",
      duration: 14,
      narration:
        "And here is the part the old picture missed. The trace, opened to be read, has become labile. New protein synthesis will close it again. The closure is different from the opening.",
      activeRegions: {
        hipp_left: 0.85,
        hipp_right: 0.85,
        vmpfc: 0.6,
      },
      brainTransform: { position: [-0.15, -0.05, 0], scale: 1.05, rotation: [0, 0.3, 0] },
      lighting: "warm",
    },
    {
      id: "9-present-reshape",
      duration: 12,
      narration:
        "What you understand now — about yourself, about the people in the scene, about what mattered — is part of what gets stored back. The present has authored a small revision.",
      activeRegions: {
        hipp_left: 0.7,
        hipp_right: 0.7,
        pcc: 0.55,
        vmpfc: 0.7,
        dmpfc: 0.55,
      },
      brainTransform: { position: [-0.05, 0.05, 0], scale: 1.0, rotation: [0, 0.1, 0] },
      lighting: "warm",
    },
    {
      id: "10-implication",
      duration: 14,
      narration:
        "Memory is not an archive being read. It is a sculpture being re-sculpted. Each visit changes the form. There is no original to recover; only the latest version, soon to be the previous.",
      activeRegions: { pcc: 0.65, precuneus: 0.65, hipp_left: 0.5, hipp_right: 0.5 },
      brainTransform: { position: [0, 0.1, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "11-close",
      duration: 14,
      narration:
        "This is uncomfortable in both directions. The wound is not literally permanent; the joy is not literally preserved. The past is a continuing collaboration with the present — and the present is paying attention.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
  ],
};
