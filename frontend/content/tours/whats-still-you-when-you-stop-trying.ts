import type { Tour } from "@/lib/tours";

/**
 * Tour 3 — "What's still you when you stop trying."
 *
 * Thirteen scenes, ~150 seconds. The DMN tour. Traces the transition
 * from task-focused cognition (frontoparietal control network) to
 * the rest-state default-mode dynamics — autobiographical retrieval,
 * future imagination, self-evaluation, and the felt-from-inside
 * continuity of being a self over time.
 *
 * The tour is the cinematic complement to Bridges § 2 (the DMN/
 * self-system bridge, the strongest in the site) and to the
 * Threshold essay's contemplative register. Closes on the line
 * that the work the self does when it isn't being asked to do
 * anything is some of the most important work a self does.
 *
 * Brain regions named in narration appear in the same scene's
 * activeRegions. Each scene's duration is sized so a calm reader
 * finishes the text just before the next scene arrives.
 */
export const whatsStillYouTour: Tour = {
  id: "whats-still-you-when-you-stop-trying",
  title: "What's still you when you stop trying",
  subtitle: "A 2-and-a-half minute tour of the default-mode network.",
  blurb:
    "When task demands fall away, a particular set of brain regions becomes more active rather than less. Mind-wandering, autobiographical retrieval, future imagination, self-evaluation. This tour traces the network that holds the felt-from-inside continuity of being a self — and the careful empirical work that named it.",
  estimatedDuration: 150,
  continueHref: "/bridges#dmn-and-self-system",
  continueLabel: "Continue in the Bridges page",
  scenes: [
    {
      id: "0-task-state",
      duration: 10,
      narration:
        "When you concentrate on something, a particular set of brain regions takes the lead. Frontoparietal control — the apparatus of attention, working memory, and deliberate task focus.",
      activeRegions: { ifg_left: 0.75, ifg_right: 0.75, dmpfc: 0.6 },
      brainTransform: { position: [0, 0.1, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "1-task-off",
      duration: 11,
      narration:
        "But task is the exception, not the rule. Most of waking life is not spent on a deliberate task. And when the task falls away, another network takes the lead.",
      activeRegions: {},
      brainTransform: { position: [0, 0.05, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "2-pcc-rises",
      duration: 12,
      narration:
        "The posterior cingulate cortex warms. Before the default-mode framework, this signal was treated as nuisance variance to be regressed out. Then a question — what is the brain doing at rest? — turned that variance into a network.",
      activeRegions: { pcc: 0.9 },
      brainTransform: { position: [0.05, 0.1, 0], scale: 1.05, rotation: [0, -0.4, 0] },
      lighting: "cinematic",
    },
    {
      id: "3-precuneus-pcc",
      duration: 12,
      narration:
        "Posterior cingulate and precuneus together. The medial wall lights up: autobiographical scenes begin to surface, the inner stage where the past replays itself and the imagined future rehearses.",
      activeRegions: { pcc: 0.85, precuneus: 0.9 },
      brainTransform: { position: [0, 0.15, 0], scale: 1.05, rotation: [0, -0.3, 0] },
      lighting: "warm",
    },
    {
      id: "4-angular",
      duration: 12,
      narration:
        "Angular gyri on both sides. Heteromodal hubs where words, places, faces, and number-facts converge into the conceptual room a thought sits in. The network knits the scene together.",
      activeRegions: { pcc: 0.7, precuneus: 0.75, agl_left: 0.85, agl_right: 0.85 },
      brainTransform: { position: [0, 0.1, 0], scale: 1.05, rotation: [0, -0.15, 0] },
      lighting: "warm",
    },
    {
      id: "5-mpfc",
      duration: 12,
      narration:
        "Medial prefrontal cortex comes online. Ventromedial below, dorsomedial above — the cortical wall where value is integrated with self-reference and where one mind models another and itself.",
      activeRegions: {
        pcc: 0.65,
        precuneus: 0.6,
        vmpfc: 0.9,
        dmpfc: 0.75,
        agl_left: 0.55,
      },
      brainTransform: { position: [-0.05, 0.1, 0], scale: 1.05, rotation: [0, 0.15, 0] },
      lighting: "cinematic",
    },
    {
      id: "6-hippocampus-feeds",
      duration: 12,
      narration:
        "The hippocampi feed scenes into the network. Memory, but also imagination — the same circuit serves both directions of time. What you have done, what you might do, what you might have done.",
      activeRegions: {
        pcc: 0.65,
        precuneus: 0.65,
        vmpfc: 0.65,
        dmpfc: 0.55,
        hipp_left: 0.85,
        hipp_right: 0.85,
      },
      brainTransform: { position: [-0.1, 0.05, 0], scale: 1.05, rotation: [0, 0.25, 0] },
      lighting: "cinematic",
    },
    {
      id: "7-network-coherent",
      duration: 12,
      narration:
        "The default-mode network is fully active now. A coherent constellation of nodes whose activity correlates at rest. The Buckner synthesis of 2008 gave the field its reference picture, the one we are looking at.",
      activeRegions: {
        pcc: 0.85,
        precuneus: 0.85,
        vmpfc: 0.85,
        dmpfc: 0.75,
        agl_left: 0.7,
        agl_right: 0.7,
        hipp_left: 0.55,
        hipp_right: 0.55,
      },
      brainTransform: { position: [0, 0.1, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "8-content",
      duration: 12,
      narration:
        "What the network produces is content. Autobiographical scenes, simulated futures, models of other minds, the running narrative of who you are over time. The Carhart-Harris and Friston paper maps this onto what Freud called ego function.",
      activeRegions: {
        pcc: 0.7,
        precuneus: 0.7,
        vmpfc: 0.85,
        dmpfc: 0.65,
        agl_left: 0.6,
        agl_right: 0.6,
      },
      brainTransform: { position: [-0.05, 0.1, 0], scale: 1.05, rotation: [0, 0.15, 0] },
      lighting: "warm",
    },
    {
      id: "9-jung-individuation",
      duration: 12,
      narration:
        "Jung gave it a different name. The work of individuation, the long unwanted work of integrating what the conscious self has not yet acknowledged. Most of that work, on Jung's reading, happens here — not on the to-do list.",
      activeRegions: {
        pcc: 0.85,
        precuneus: 0.85,
        vmpfc: 0.7,
        dmpfc: 0.7,
      },
      brainTransform: { position: [0, 0.15, 0], scale: 1.05, rotation: [0, 0, 0] },
      lighting: "warm",
    },
    {
      id: "10-meditation-deactivation",
      duration: 11,
      narration:
        "Long-term meditators show measurable changes in default-mode-network engagement. The relationship between attention and the network is trainable — Brewer and colleagues' 2011 study established that.",
      activeRegions: {
        pcc: 0.5,
        precuneus: 0.5,
        vmpfc: 0.4,
        dmpfc: 0.4,
      },
      brainTransform: { position: [0, 0.1, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
    {
      id: "11-task-returns",
      duration: 11,
      narration:
        "A task arrives. The frontoparietal control network reasserts itself; the default-mode dynamics quiet. The two networks trade activity in characteristic anti-correlated patterns. This trading is what brains do.",
      activeRegions: { ifg_left: 0.8, ifg_right: 0.7, dmpfc: 0.6, pcc: 0.35 },
      brainTransform: { position: [0, 0.05, 0], scale: 1.0, rotation: [0, 0.05, 0] },
      lighting: "cinematic",
    },
    {
      id: "12-close",
      duration: 13,
      narration:
        "The work the self does when it isn't being asked to do anything is some of the most important work a self does. The default-mode network is where you can see the lights stay on after the workday ends.",
      activeRegions: {
        pcc: 0.7,
        precuneus: 0.7,
        vmpfc: 0.6,
        agl_left: 0.5,
        agl_right: 0.5,
      },
      brainTransform: { position: [0, 0.1, 0], scale: 1.0, rotation: [0, 0, 0] },
      lighting: "cinematic",
    },
  ],
};
