import type { Tour } from "@/lib/tours";

/**
 * Tour 5 — "How a face becomes someone you know."
 *
 * Twelve scenes, ~145 seconds. The face-processing tour. Traces
 * the path from photons reflected off a face, through the ventral
 * visual stream and the (extra-Atlas) fusiform face area, to right
 * ATL's person-specific knowledge, the amygdala's affective tag,
 * the hippocampus's autobiographical scenes, and the medial
 * prefrontal cortex's familiarity verdict.
 *
 * Closes on the observation that recognizing someone is
 * reconstruction — and the recognition you are doing right now is
 * being authored by the present.
 *
 * Subcortical and extra-Atlas regions (fusiform face area, V1, V4)
 * are named in narration but not activated on the brain — the
 * persistent brain has no FFA highlight, so the activeRegions
 * stay within the canonical 20 and pull the closest cortical
 * analogue (right pSTG and right MTG for the fusiform's
 * neighbourhood) when the visual asks for support.
 */
export const howAFaceBecomesSomeoneYouKnowTour: Tour = {
  id: "how-a-face-becomes-someone-you-know",
  title: "How a face becomes someone you know",
  subtitle:
    "A two-and-a-half minute tour of face recognition.",
  blurb:
    "Seeing a familiar face is one of the brain's faster integrations — perception, identity, emotional weight, and autobiographical context all bound into a single felt sense of who-this-is in under a second. This tour follows the route, and ends on the question of how much of recognizing someone is reconstruction.",
  estimatedDuration: 145,
  continueHref: "/atlas/atl_right",
  continueLabel: "Open the right anterior temporal lobe atlas page",
  scenes: [
    {
      id: "0-arrival",
      duration: 10,
      narration:
        "A face arrives in your field of view. Photons reflected off skin reach the retina; the optic nerve carries the signal toward the brain.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "1-v1",
      duration: 10,
      narration:
        "Primary visual cortex at the back of the skull decomposes the signal into edges, contrasts, and orientations. No identity yet — just the geometry of a thing that is shaped like a face.",
      activeRegions: {},
      brainTransform: { position: [0.05, 0, 0], scale: 1.05, rotation: [0, 0.5, 0] },
      lighting: "cinematic",
    },
    {
      id: "2-ventral-stream",
      duration: 12,
      narration:
        "The ventral visual stream takes over. V2, V4, and onward — features bind into surfaces, surfaces bind into the face-shape detector that has been trained on faces every day of your life.",
      activeRegions: {},
      brainTransform: { position: [0.05, -0.05, 0], scale: 1.05, rotation: [0, 0.4, 0] },
      lighting: "cinematic",
    },
    {
      id: "3-ffa",
      duration: 12,
      narration:
        "The fusiform face area — a patch of ventral occipitotemporal cortex specialized for face perception — recognizes this as a face. Identity-neutral still. The work of recognizing it as someone has not begun.",
      activeRegions: { pstg_right: 0.55 },
      brainTransform: { position: [0.15, -0.1, 0], scale: 1.05, rotation: [0, 0.35, 0] },
      lighting: "cinematic",
    },
    {
      id: "4-amygdala-fast",
      duration: 12,
      narration:
        "While higher cortex is still working, a subcortical route delivers an early copy of the signal to the amygdala. Affective valuation runs in parallel — the body's verdict is forming on the right side first.",
      activeRegions: { pstg_right: 0.45, amyg_right: 0.85 },
      brainTransform: { position: [0.05, -0.2, 0], scale: 1.05, rotation: [0, 0.2, 0] },
      lighting: "warm",
    },
    {
      id: "5-atl-right",
      duration: 14,
      narration:
        "The right anterior temporal lobe binds the percept to person-knowledge. Not the name yet — the bound, felt-from-inside knowledge of who this person is to you. Occupation, biography, the weight of having known them.",
      activeRegions: { pstg_right: 0.4, amyg_right: 0.55, atl_right: 0.95 },
      brainTransform: { position: [-0.05, -0.15, 0], scale: 1.05, rotation: [0, 0.3, 0] },
      lighting: "warm",
    },
    {
      id: "6-hippocampus-scenes",
      duration: 12,
      narration:
        "The hippocampi feed scenes. Where you have known this person. What you have done together. The autobiographical context that turns a face from a recognized object into a recognized someone.",
      activeRegions: {
        atl_right: 0.75,
        hipp_left: 0.85,
        hipp_right: 0.85,
        amyg_right: 0.45,
      },
      brainTransform: { position: [-0.15, -0.1, 0], scale: 1.05, rotation: [0, 0.35, 0] },
      lighting: "warm",
    },
    {
      id: "7-mpfc-self-other",
      duration: 12,
      narration:
        "Medial prefrontal cortex evaluates: how does this person relate to you? The self-and-other modelling runs here. Mentalizing dorsally, valuation ventrally — the meeting where social significance is integrated.",
      activeRegions: {
        atl_right: 0.6,
        hipp_left: 0.5,
        hipp_right: 0.5,
        vmpfc: 0.85,
        dmpfc: 0.8,
      },
      brainTransform: { position: [-0.05, 0.05, 0], scale: 1.05, rotation: [0, 0.15, 0] },
      lighting: "cinematic",
    },
    {
      id: "8-language-name",
      duration: 12,
      narration:
        "The name surfaces. Left anterior temporal cortex retrieves the verbal label. Sometimes the name comes first; sometimes the feeling does and the name lags. The dissociation is meaningful, and it has a mechanism.",
      activeRegions: {
        atl_left: 0.85,
        atl_right: 0.5,
        ifg_left: 0.55,
        mtg_left: 0.55,
      },
      brainTransform: { position: [-0.1, 0.05, 0], scale: 1.05, rotation: [0, 0.15, 0] },
      lighting: "cinematic",
    },
    {
      id: "9-bound",
      duration: 12,
      narration:
        "Everything is bound. Perception, identity, affect, history, name. Under a second, in most cases, for a familiar face. The integration feels instantaneous from inside because the work is invisible.",
      activeRegions: {
        atl_left: 0.7,
        atl_right: 0.7,
        amyg_right: 0.6,
        hipp_left: 0.6,
        hipp_right: 0.6,
        vmpfc: 0.7,
      },
      brainTransform: { position: [0, 0, 0], scale: 1.05, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "10-reconstruction",
      duration: 12,
      narration:
        "What you have recognized is not a stored memory of this person. It is a reconstruction, assembled now from materials the present is shaping. The face you saw a moment ago is already the face the present has authored.",
      activeRegions: {
        atl_right: 0.6,
        hipp_left: 0.7,
        hipp_right: 0.7,
        vmpfc: 0.55,
      },
      brainTransform: { position: [-0.05, 0.05, 0], scale: 1.0, rotation: [0, 0.1, 0] },
      lighting: "warm",
    },
    {
      id: "11-close",
      duration: 15,
      narration:
        "How much of recognizing someone is reconstruction is the question this tour has been asking. The mechanism is real. The recognition you are doing right now of a face you know is being authored by the present, even as it feels like remembering.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
  ],
};
