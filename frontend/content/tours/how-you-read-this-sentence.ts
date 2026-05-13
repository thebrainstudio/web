import type { Tour } from "@/lib/tours";

/**
 * Tour 2 — "How you read this sentence."
 *
 * Fourteen scenes, ~155 seconds. The canonical language-network
 * tour from the brain-interactivity brief. Traces the path of a
 * sentence from photons on the retina through visual cortex,
 * ventral stream, posterior STG, MTG, ATL, angular gyrus, IFG,
 * and back to comprehension. Closes on the line that the mechanism
 * is invisible from inside — none of this feels like reading.
 *
 * Narration pacing: ~22-25 words per 10s scene at 130-150 wpm.
 * Each named region appears in the same scene's activeRegions.
 */
export const howYouReadThisSentenceTour: Tour = {
  id: "how-you-read-this-sentence",
  title: "How you read this sentence",
  subtitle: "A 2-and-a-half minute journey through the language network.",
  blurb:
    "Reading is a sequence of computations — photons to phonemes to meaning. This tour traces the path through visual cortex, the temporal lobe's semantic system, and the inferior frontal regions that integrate it all into sentence-level understanding.",
  estimatedDuration: 155,
  continueHref: "/atlas/ifg_left",
  continueLabel: "Open the Broca's region atlas page",
  scenes: [
    {
      id: "0-photons",
      duration: 9,
      narration:
        "It begins with photons. Light reflected from the page reaches the retina, where rods and cones translate it into electrical signal.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "1-lgn",
      duration: 9,
      narration:
        "The signal travels through the optic nerve, crosses at the chiasm, and arrives at the thalamus — at the lateral geniculate nucleus, the gateway to vision.",
      activeRegions: {},
      brainTransform: { position: [0.1, -0.2, 0], scale: 1.0, rotation: [0, 0.15, 0] },
      lighting: "cinematic",
    },
    {
      id: "2-v1",
      duration: 10,
      narration:
        "From the thalamus into primary visual cortex at the back of your skull. V1 is machinery — edges, contrasts, orientations. No recognition here, just the geometry of what the page shows.",
      activeRegions: {},
      brainTransform: { position: [0, -0.05, 0], scale: 1.05, rotation: [0, 0.5, 0] },
      lighting: "cinematic",
    },
    {
      id: "3-ventral-stream",
      duration: 12,
      narration:
        "Down the ventral visual stream: V2, V4, the fusiform gyrus. Edges become shapes; shapes become letters; the visual word form area learns each glyph as a unit you no longer have to decode.",
      activeRegions: {},
      brainTransform: { position: [-0.1, -0.15, 0], scale: 1.05, rotation: [0, 0.35, 0] },
      lighting: "cinematic",
    },
    {
      id: "4-hg-pstg",
      duration: 12,
      narration:
        "If you were hearing instead of reading, the path would arrive here through Heschl's gyrus and posterior superior temporal cortex. The auditory and visual routes converge on the same semantic system.",
      activeRegions: {
        hg_left: 0.5,
        pstg_left: 0.85,
      },
      brainTransform: { position: [-0.2, 0.05, 0], scale: 1.05, rotation: [0, 0.2, 0] },
      lighting: "cinematic",
    },
    {
      id: "5-mtg",
      duration: 12,
      narration:
        "Middle temporal cortex maps the form of words onto their conceptual content. This is where 'mother' stops being three syllables and becomes a meaning that arrives with weight.",
      activeRegions: {
        pstg_left: 0.55,
        mtg_left: 0.95,
      },
      brainTransform: { position: [-0.25, -0.05, 0], scale: 1.05, rotation: [0, 0.25, 0] },
      lighting: "warm",
    },
    {
      id: "6-atl-hub",
      duration: 12,
      narration:
        "Anterior temporal cortex binds the modality-specific signals — visual, auditory, emotional — into the abstract concepts that name a thing as a thing regardless of how you encountered it.",
      activeRegions: {
        mtg_left: 0.65,
        atl_left: 0.95,
      },
      brainTransform: { position: [-0.25, -0.1, 0], scale: 1.05, rotation: [0, 0.35, 0] },
      lighting: "warm",
    },
    {
      id: "7-angular-gyrus",
      duration: 12,
      narration:
        "The angular gyrus integrates across senses, across categories, across times. A heteromodal hub where word meanings, spatial relations, and number facts converge into the conceptual room of a sentence.",
      activeRegions: {
        atl_left: 0.6,
        mtg_left: 0.5,
        agl_left: 0.9,
      },
      brainTransform: { position: [-0.2, 0.05, 0], scale: 1.05, rotation: [0, 0.2, 0] },
      lighting: "warm",
    },
    {
      id: "8-broca-arrival",
      duration: 12,
      narration:
        "Inferior frontal cortex — Broca's region — comes online. Syntax, the binding of words into a structure where their order matters and their grammar shapes their meaning.",
      activeRegions: {
        ifg_left: 0.95,
        agl_left: 0.55,
        mtg_left: 0.55,
      },
      brainTransform: { position: [-0.15, 0.1, 0], scale: 1.05, rotation: [0, 0.15, 0] },
      lighting: "cinematic",
    },
    {
      id: "9-recurrent",
      duration: 12,
      narration:
        "Broca's region talks back to the temporal cortex along the arcuate fasciculus. The conversation is recurrent. Each word updates the model of the sentence; the sentence reshapes the meaning of each word.",
      activeRegions: {
        ifg_left: 0.85,
        pstg_left: 0.6,
        mtg_left: 0.7,
        atl_left: 0.55,
        agl_left: 0.7,
      },
      brainTransform: { position: [-0.1, 0.05, 0], scale: 1.05, rotation: [0, 0.1, 0] },
      lighting: "cinematic",
    },
    {
      id: "10-default-mode",
      duration: 12,
      narration:
        "The default-mode network begins to engage. Posterior cingulate, precuneus, medial prefrontal cortex. The sentence is integrated into the larger context of what you already know, what you remember, who you are.",
      activeRegions: {
        ifg_left: 0.5,
        agl_left: 0.6,
        pcc: 0.85,
        precuneus: 0.8,
        vmpfc: 0.65,
      },
      brainTransform: { position: [0, 0.1, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "11-meaning",
      duration: 12,
      narration:
        "Meaning has arrived. Not in any single region — in the relationships among them, in the patterns of activity that hold for a few hundred milliseconds and then dissolve.",
      activeRegions: {
        pcc: 0.7,
        precuneus: 0.6,
        agl_left: 0.55,
        ifg_left: 0.35,
        atl_left: 0.5,
      },
      brainTransform: { position: [0, 0.05, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "12-invisible",
      duration: 14,
      narration:
        "None of this feels like reading. It feels like understanding. The mechanism is invisible from inside — and the invisibility is part of what reading is, the way a window is invisible when you are looking through it.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "13-close",
      duration: 13,
      narration:
        "You have just read a sentence about reading a sentence. The same circuits that performed the latter performed the former. The brain reading the brain — and very little is missing from this picture except, somehow, you.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
  ],
};
