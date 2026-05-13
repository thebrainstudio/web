import type { Tour } from "@/lib/tours";

/**
 * Tour 4 — "When something matters."
 *
 * Thirteen scenes, ~150 seconds. The salience tour. Traces what
 * happens between an arriving stimulus and the brain's decision
 * that the stimulus matters — fast subcortical evaluation, amygdala
 * tagging, anterior cingulate conflict monitoring, the cortical
 * resources reallocated to whatever just got flagged.
 *
 * The tour closes on the depth-psychological observation that the
 * felt sense of significance arrives before words for why. The
 * brief's working title for this tour was "When something matters,"
 * and the closing line earns that framing.
 *
 * Narration discipline: ~22-25 words per 10s scene at 130-150 wpm.
 * Brain regions named in narration appear in the scene's
 * activeRegions. Subcortical regions outside the canonical 20
 * (anterior insula, dACC) are mentioned by name without
 * activation targets — the persistent brain has no anterior-
 * insula highlight to drive, so the narration handles them
 * verbally while the cortical nodes drive the visual.
 */
export const whenSomethingMattersTour: Tour = {
  id: "when-something-matters",
  title: "When something matters",
  subtitle:
    "A 2-and-a-half minute tour of the salience network.",
  blurb:
    "Long before the word 'important' arrives in your mind, a separate set of brain regions has already decided. The amygdala flags weight. The anterior insula notices the body's response to it. The anterior cingulate keeps watch. This tour traces what salience-detection looks like from the inside — and the felt sense of mattering that arrives before any reason.",
  estimatedDuration: 152,
  continueHref: "/bridges#salience-numinosity",
  continueLabel: "Continue in the Bridges page",
  scenes: [
    {
      id: "0-arrival",
      duration: 10,
      narration:
        "Something arrives. A face in a crowd. A line in a book. A change in a familiar voice. The brain has already decided this matters before you have the word for why.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "1-sensory",
      duration: 10,
      narration:
        "Sensory cortex receives the signal. For a face, occipital and temporal vision. For a voice, the auditory pathway through Heschl's gyrus. Mechanism, not yet meaning.",
      activeRegions: { hg_left: 0.5, hg_right: 0.5, pstg_right: 0.6 },
      brainTransform: { position: [0.05, -0.1, 0], scale: 1.0, rotation: [0, 0.3, 0] },
      lighting: "cinematic",
    },
    {
      id: "2-subcortical",
      duration: 12,
      narration:
        "A subcortical route forks below conscious awareness. The thalamus shunts a fast copy of the signal directly to the amygdala — bypassing slower cortical analysis, ready to flag what matters before recognition.",
      activeRegions: { pstg_right: 0.5, amyg_left: 0.85, amyg_right: 0.85 },
      brainTransform: { position: [-0.1, -0.2, 0], scale: 1.05, rotation: [0, 0.2, 0] },
      lighting: "warm",
    },
    {
      id: "3-amygdala-tag",
      duration: 12,
      narration:
        "The amygdala tags the signal as significant. Not for fear specifically — for biological and social weight in either direction. This is not a fear center. It is a salience detector tuned by evolution and learning.",
      activeRegions: { amyg_left: 0.95, amyg_right: 0.95 },
      brainTransform: { position: [-0.05, -0.25, 0], scale: 1.05, rotation: [0, 0.05, 0] },
      lighting: "warm",
    },
    {
      id: "4-body-response",
      duration: 12,
      narration:
        "The body responds before you notice. Heart rate shifts. Muscles tighten or release. Pupils widen. The anterior insula will read these visceral changes back to the cortex as a felt experience.",
      activeRegions: { amyg_left: 0.75, amyg_right: 0.75 },
      brainTransform: { position: [0, -0.15, 0], scale: 1.05, rotation: [0, -0.05, 0] },
      lighting: "warm",
    },
    {
      id: "5-acc",
      duration: 12,
      narration:
        "Anterior cingulate cortex monitors the new state. If this signal conflicts with the current task, conflict gets flagged. If attention needs to be reallocated, that happens here. The salience network is online.",
      activeRegions: { amyg_left: 0.55, amyg_right: 0.55, dmpfc: 0.8 },
      brainTransform: { position: [0, 0.05, 0], scale: 1.05, rotation: [0, -0.1, 0] },
      lighting: "cinematic",
    },
    {
      id: "6-attention-shifts",
      duration: 12,
      narration:
        "Attention reallocates. Whatever task you were on a moment ago has receded; the cortical resources have moved. The frontoparietal control network reconfigures for the new priority.",
      activeRegions: { dmpfc: 0.85, ifg_left: 0.6, ifg_right: 0.65 },
      brainTransform: { position: [0, 0.1, 0], scale: 1.05, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "7-felt-sense",
      duration: 12,
      narration:
        "And only now does the felt sense reach awareness. Significance has arrived in consciousness — but the verdict was issued earlier, by parts of the brain whose work you do not see from inside.",
      activeRegions: {
        dmpfc: 0.6,
        ifg_right: 0.55,
        amyg_left: 0.5,
        amyg_right: 0.5,
        vmpfc: 0.65,
      },
      brainTransform: { position: [-0.05, 0.05, 0], scale: 1.05, rotation: [0, 0.1, 0] },
      lighting: "cinematic",
    },
    {
      id: "8-hippocampus-binds",
      duration: 12,
      narration:
        "If the moment is to be remembered, the hippocampus binds it. Emotional weight enhances consolidation — which is part of why the moments that mattered are the moments most easily recalled later.",
      activeRegions: {
        amyg_left: 0.55,
        amyg_right: 0.55,
        hipp_left: 0.85,
        hipp_right: 0.85,
      },
      brainTransform: { position: [-0.15, -0.1, 0], scale: 1.05, rotation: [0, 0.25, 0] },
      lighting: "warm",
    },
    {
      id: "9-narrative",
      duration: 12,
      narration:
        "Default-mode regions begin to integrate the moment into the larger story of who you are. Posterior cingulate, precuneus, medial prefrontal cortex — the network of autobiographical continuity.",
      activeRegions: {
        hipp_left: 0.5,
        hipp_right: 0.5,
        pcc: 0.85,
        precuneus: 0.75,
        vmpfc: 0.75,
      },
      brainTransform: { position: [0, 0.1, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "10-articulation",
      duration: 12,
      narration:
        "The language regions arrive last. Words come up to describe a meaning that was felt before language. The articulation is real work but it is also recovery — recovering what already happened.",
      activeRegions: {
        ifg_left: 0.75,
        pstg_left: 0.6,
        mtg_left: 0.6,
        atl_left: 0.5,
        vmpfc: 0.5,
      },
      brainTransform: { position: [-0.1, 0.1, 0], scale: 1.05, rotation: [0, 0.2, 0] },
      lighting: "cinematic",
    },
    {
      id: "11-jung-thread",
      duration: 12,
      narration:
        "Jung wrote about the numinous — the felt sense of being grabbed by something meaningful before you can say why. Otto coined the word in 1917. The phenomenology and the mechanism touch in just this register.",
      activeRegions: {
        amyg_left: 0.4,
        amyg_right: 0.4,
        vmpfc: 0.55,
        pcc: 0.55,
      },
      brainTransform: { position: [-0.05, 0.05, 0], scale: 1.0, rotation: [0, 0.05, 0] },
      lighting: "warm",
    },
    {
      id: "12-close",
      duration: 14,
      narration:
        "Most of what matters in a life arrives this way. Not as conclusion but as weight, felt first, articulated later — and the part of you that notices what matters before you have words for why has a mechanism, and you are looking at it.",
      activeRegions: {},
      brainTransform: { position: [0, 0, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
  ],
};
