/**
 * The 20 regions TRIBE v2 predicts (or, more honestly, the 20 we surface
 * in this site — drawn from well-studied language, auditory, default-mode,
 * salience, and memory regions).
 *
 * For each region we record:
 *  - `anatomyName`: precise neuroanatomy. "Inferior frontal gyrus, BA 44/45
 *    (Broca's area)" — never "the language area."
 *  - `scienceGloss`: an "involved in" statement, ≤140 chars. Never "responsible
 *    for." Distributed functions are described as such.
 *  - `poeticGloss`: a Jungian-sensibility line, ≤180 chars. Sits *alongside*
 *    the science, never replaces it. Closer to Paris Review / Marginalian.
 *  - `citationIds`: ids into `lib/citations.ts` for the strongest claim.
 *  - `position`: stylized 3D coordinate in [-1, 1]^3. x=left/right (neg=left),
 *    y=inferior/superior, z=posterior/anterior. NOT anatomically exact;
 *    chosen to look like a brain in 3D arrangement.
 *
 * Ordering is intentional: language regions first (Mirror room), auditory
 * (Music room), then default-mode and memory (Mirror + Music + Cross-Cultural
 * all rely on these).
 */

export type RegionId =
  | "ifg_left"
  | "ifg_right"
  | "pstg_left"
  | "pstg_right"
  | "mtg_left"
  | "mtg_right"
  | "atl_left"
  | "atl_right"
  | "agl_left"
  | "agl_right"
  | "hg_left"
  | "hg_right"
  | "vmpfc"
  | "dmpfc"
  | "pcc"
  | "precuneus"
  | "amyg_left"
  | "amyg_right"
  | "hipp_left"
  | "hipp_right";

export type BridgeStrength = "tight" | "partial" | "distant" | "none";

export type Region = {
  id: RegionId;
  displayName: string;
  anatomyName: string;
  scienceGloss: string;
  poeticGloss: string;
  /**
   * 1-2 sentences naming the felt territory depth psychology speaks about
   * around this region. Hedged. Never claims equivalence. May be `null`
   * when no honest gloss is possible.
   */
  jungianGloss?: string | null;
  /**
   * 3-4 sentence bridge paragraph. Defensible to both a neuroscientist and
   * a Jungian analyst. Hedging is a feature: "rough parallel," "shares
   * territory with," "what Jung would have called."
   */
  theThread?: string;
  /**
   * How solid the bridge is. UI hides the Thread tab when "none". Discipline
   * mechanism — not every region wants this register.
   */
  bridgeStrength?: BridgeStrength;
  citationIds: string[];
  position: readonly [number, number, number];
};

export const regions: Region[] = [
  {
    id: "ifg_left",
    displayName: "Broca's region (L)",
    anatomyName: "Inferior frontal gyrus, BA 44/45 (left)",
    scienceGloss:
      "Involved in syntactic processing and articulation. Damage here disrupts speech production while comprehension can remain partly intact.",
    poeticGloss:
      "The part of you that finds the next word — and the part that catches its own tongue when the word isn't quite right.",
    jungianGloss:
      "The part of the self that searches for the right word — and notices when the one offered doesn't quite say it.",
    theThread:
      "Speech is a thin layer over thought, but the seams show. Broca's region is where syntax and articulation meet, and its lesions famously leave comprehension intact while speech fragments. Jung observed something at a different scale — the unconscious knowing what consciousness can't yet say. Different register, related seam: the moment a word is needed and not quite there is recognizable both as a regional failure and as a psychological one.",
    bridgeStrength: "partial",
    citationIds: ["hagoort-2014-language-architecture", "jung-cw9i"],
    position: [-0.78, 0.18, 0.45],
  },
  {
    id: "ifg_right",
    displayName: "IFG (R)",
    anatomyName: "Inferior frontal gyrus (right)",
    scienceGloss:
      "Involved in prosody, semantic integration of figurative speech, and inhibitory control of language.",
    poeticGloss:
      "The hemisphere that listens for tone — for what someone means underneath what they said.",
    jungianGloss:
      "The listener under the listener, attending to what isn't said.",
    theThread:
      "Right-hemisphere language work is biased toward prosody, figure, and what isn't literal — the affective layer of speech that left-hemisphere parsing tends to flatten. Jung wrote often about the importance of attending to what speech does rather than only what it says. Different vocabulary, related territory: the meaning beneath the meaning has a mechanism, and this is part of it.",
    bridgeStrength: "partial",
    citationIds: ["hagoort-2014-language-architecture", "mcgilchrist-master-emissary"],
    position: [0.78, 0.18, 0.45],
  },
  {
    id: "pstg_left",
    displayName: "Posterior STG (L)",
    anatomyName: "Posterior superior temporal gyrus (left)",
    scienceGloss:
      "Implicated in phonological and lexical processing. Sometimes referred to (contestedly) as 'Wernicke's area.'",
    poeticGloss:
      "Where sounds become words. Where the river of breath starts to look like meaning.",
    jungianGloss:
      "Where sound first becomes meaning — the threshold of being addressed.",
    theThread:
      "The transition from acoustic input to lexical recognition happens here, fast enough to feel automatic. Jung gave weight to the experience of being addressed by something — by a dream, a phrase, a piece of music — and the threshold he described and the threshold this region crosses are not the same thing, but they touch. The phenomenology of meaning arriving has a partial mechanism.",
    bridgeStrength: "partial",
    citationIds: ["hagoort-2014-language-architecture", "huth-2016-semantic-maps"],
    position: [-0.85, 0.05, -0.18],
  },
  {
    id: "pstg_right",
    displayName: "Posterior STG (R)",
    anatomyName: "Posterior superior temporal gyrus (right)",
    scienceGloss:
      "Implicated in tonal and prosodic processing, including melody perception and the affective side of speech.",
    poeticGloss:
      "The room in which music and feeling first meet. The room a sentence cannot enter alone.",
    jungianGloss:
      "Where music and feeling first meet — the register Jung called numinous when it arrives unannounced.",
    theThread:
      "The right posterior superior temporal gyrus tracks pitch, contour, and the affective shape of sound. Jung used the word numinous for the felt sense of being grabbed by something — a phrase, a piece of music, a face — before you can say why. The full phenomenology of numinosity exceeds any one region, but the part of it that comes through hearing has a mechanism, and this is part of it.",
    bridgeStrength: "partial",
    citationIds: ["kell-2018-auditory-task-network", "jung-cw9i"],
    position: [0.85, 0.05, -0.18],
  },
  {
    id: "mtg_left",
    displayName: "Middle Temporal (L)",
    anatomyName: "Middle temporal gyrus (left)",
    scienceGloss:
      "Involved in lexical semantics and word retrieval. Activity here scales with sentence meaning, not just sound.",
    poeticGloss:
      "Where a word and its weight meet. Where 'mother' is not just a noun.",
    jungianGloss:
      "Where 'mother' is not just a noun — where words carry the freight of having been used.",
    theThread:
      "Lexical semantics here are tied to context and meaning rather than acoustic form. Jung wrote often that words carry biographical and cultural weight, that no word means the same thing twice. Different register, related observation: a word is never just its definition. Activation in MTG-L scales with sentence-level meaning, and meaning is partly the freight of having been used.",
    bridgeStrength: "partial",
    citationIds: ["binder-desai-2011-semantic-system", "huth-2016-semantic-maps"],
    position: [-0.86, -0.12, 0.0],
  },
  {
    id: "mtg_right",
    displayName: "Middle Temporal (R)",
    anatomyName: "Middle temporal gyrus (right)",
    scienceGloss:
      "Implicated in figurative meaning, narrative comprehension, and biological-motion perception.",
    poeticGloss:
      "The hemisphere that handles metaphor without flinching. Where stories live before they have endings.",
    jungianGloss:
      "The hemisphere that handles metaphor without flinching — where a story is recognized as a story.",
    theThread:
      "Right MTG is more responsive than its left counterpart to figurative language, narrative arc, and inferred mental states. Jung argued that the psyche thinks in story before it thinks in argument — that dreams and symbols are first-language and that conceptual thought is second. The neuroscience doesn't endorse the metaphysics, but the asymmetry is real: stories aren't handled the same way as syllogisms, and you can see it on the scan.",
    bridgeStrength: "partial",
    citationIds: ["binder-desai-2011-semantic-system", "mcgilchrist-master-emissary"],
    position: [0.86, -0.12, 0.0],
  },
  {
    id: "atl_left",
    displayName: "Anterior Temporal (L)",
    anatomyName: "Anterior temporal lobe (left)",
    scienceGloss:
      "A semantic hub: involved in integrating multimodal conceptual knowledge into meaning.",
    poeticGloss:
      "The part of you that knows what a thing *is*, not just what it's called.",
    jungianGloss:
      "The part of you that knows what a thing is, not just what it's called.",
    theThread:
      "The anterior temporal lobe binds multimodal sensory information into conceptual knowledge — the gestalt of a thing rather than the label for it. Jung gave a different name to the experience of recognition that precedes naming. The neuroscience and the depth-psychological description converge on the same intuition: knowing what something is is older than knowing what we call it.",
    bridgeStrength: "tight",
    citationIds: ["binder-desai-2011-semantic-system", "damasio-feeling-of-what-happens"],
    position: [-0.7, -0.05, 0.65],
  },
  {
    id: "atl_right",
    displayName: "Anterior Temporal (R)",
    anatomyName: "Anterior temporal lobe (right)",
    scienceGloss:
      "Implicated in person-knowledge, social semantics, and the meanings carried by faces.",
    poeticGloss:
      "Where a face is not yet a name — but already a feeling.",
    jungianGloss:
      "Where a face is not yet a name — but already a feeling.",
    theThread:
      "Right ATL carries person-specific semantic knowledge — the texture of who someone is to you, separate from the label of their name. Jung's work on relationships gave central weight to the felt sense of the other before any conceptual description of them. Different vocabulary, same observation: knowing a face is older than knowing a name, and the difference has a mechanism.",
    bridgeStrength: "tight",
    citationIds: ["binder-desai-2011-semantic-system", "damasio-feeling-of-what-happens"],
    position: [0.7, -0.05, 0.65],
  },
  {
    id: "agl_left",
    displayName: "Angular Gyrus (L)",
    anatomyName: "Angular gyrus (left)",
    scienceGloss:
      "A heteromodal hub: involved in semantic integration, metaphor, and the default-mode network.",
    poeticGloss:
      "The crossing where senses translate into ideas. Where 'red' can mean a color or a country.",
    jungianGloss:
      "The crossing where one sense lends a word to another — synesthesia's quieter cousin.",
    theThread:
      "The angular gyrus is one of the brain's heteromodal hubs, integrating language, spatial sense, body schema, and the default-mode network. Jung was fascinated by the way symbols accumulate meaning across registers — how the same image can hold visual, somatic, and conceptual weight at once. Whatever you call the place where 'red' can mean a color or a country, it has a mechanism, and the angular gyrus is part of it.",
    bridgeStrength: "tight",
    citationIds: ["binder-desai-2011-semantic-system", "buckner-2008-default-network"],
    position: [-0.7, 0.6, -0.4],
  },
  {
    id: "agl_right",
    displayName: "Angular Gyrus (R)",
    anatomyName: "Angular gyrus (right)",
    scienceGloss:
      "Implicated in numeracy, spatial cognition, and the default-mode network's right component.",
    poeticGloss:
      "Where number, body, and self meet — the way a room knows it is a room.",
    jungianGloss:
      "Where number, body, and self meet — the part of the self that holds its own coordinates.",
    theThread:
      "Right angular gyrus participates in the construction of bodily self-location and the felt sense of being where you are. Jung wrote less about embodiment than the post-Jungians did; contemporary depth-psychological work has converged on the importance of the body schema. The mechanism by which a self knows its own coordinates is not metaphysical, but the experience of being a located self is also not nothing.",
    bridgeStrength: "partial",
    citationIds: ["buckner-2008-default-network", "damasio-feeling-of-what-happens"],
    position: [0.7, 0.6, -0.4],
  },
  {
    id: "hg_left",
    displayName: "Heschl's Gyrus (L)",
    anatomyName: "Heschl's gyrus / primary auditory cortex (left)",
    scienceGloss:
      "Primary auditory cortex: receives the first cortical signal from the ear. Tonotopically organized.",
    poeticGloss:
      "The doorway sound walks through to become a thought. The earliest room in the house of hearing.",
    jungianGloss: null,
    theThread:
      "Some regions don't ask to be read in two languages. Primary auditory cortex maps acoustic frequency to cortical position — it's machinery, faithful and necessary. The fact that this site offers a depth-psychological language for many regions doesn't mean every region wants one. Sometimes hearing is just hearing.",
    bridgeStrength: "distant",
    citationIds: ["kell-2018-auditory-task-network"],
    position: [-0.65, 0.1, -0.05],
  },
  {
    id: "hg_right",
    displayName: "Heschl's Gyrus (R)",
    anatomyName: "Heschl's gyrus / primary auditory cortex (right)",
    scienceGloss:
      "Primary auditory cortex (right). More fine-grained spectral processing than its left counterpart.",
    poeticGloss:
      "The ear that hears the difference between a violin and someone crying.",
    jungianGloss: null,
    theThread:
      "Right primary auditory cortex handles finer spectral detail than its left counterpart, which matters for music and for voice. The discriminator itself is machinery; what gets done with the discrimination is where any psychological language might enter. We leave HG-R as machinery here and let the meaning happen one synapse downstream.",
    bridgeStrength: "distant",
    citationIds: ["kell-2018-auditory-task-network"],
    position: [0.65, 0.1, -0.05],
  },
  {
    id: "vmpfc",
    displayName: "vmPFC",
    anatomyName: "Ventromedial prefrontal cortex",
    scienceGloss:
      "Involved in valuation, self-referential thought, and the default-mode network. Not a 'self center' — a node.",
    poeticGloss:
      "The part of you that knows what is good for you — and is sometimes wrong.",
    jungianGloss:
      "The part of you that knows what is good for you — and is sometimes wrong.",
    theThread:
      "vmPFC integrates value signals with self-referential thought; lesions here disrupt decisions that depend on knowing what one cares about. Jung's term for the conscious self in dialogue with the larger psyche was the ego — and one of his consistent observations was that the ego is not always a reliable narrator of its own preferences. Different vocabulary, same fragility: what you take to be your considered judgment about what's good for you is partly a regional computation that can be wrong.",
    bridgeStrength: "tight",
    citationIds: ["buckner-2008-default-network", "damasio-feeling-of-what-happens"],
    position: [0.0, -0.3, 0.85],
  },
  {
    id: "dmpfc",
    displayName: "dmPFC",
    anatomyName: "Dorsomedial prefrontal cortex",
    scienceGloss:
      "Implicated in mentalizing — modeling the mental states of others — and in self-reflection.",
    poeticGloss:
      "The part of you that wonders what someone else is thinking. The part that, sometimes, is wrong about that too.",
    jungianGloss:
      "The part of you that wonders what someone else is thinking — and the part that, sometimes, is wrong about that too.",
    theThread:
      "Dorsomedial prefrontal cortex is central to mentalizing — building a model of another mind. Jung's term for the interior figure of the other was anima or animus depending on configuration, and his point was that we routinely model others wrongly because we are projecting unrecognized parts of ourselves. The mechanism by which one mind models another has been mapped to dmPFC and related circuitry; the cost of getting that modeling wrong is what depth psychology has been writing about for a hundred years.",
    bridgeStrength: "partial",
    citationIds: ["buckner-2008-default-network", "jung-cw9i"],
    position: [0.0, 0.55, 0.7],
  },
  {
    id: "pcc",
    displayName: "PCC",
    anatomyName: "Posterior cingulate cortex",
    scienceGloss:
      "A core node of the default-mode network. Active in memory, mind-wandering, and self-related thought.",
    poeticGloss:
      "The part of you that's still you when you stop trying. The room that's lit when the others aren't.",
    jungianGloss:
      "The part of you that's still you when you stop trying.",
    theThread:
      "The posterior cingulate is a core node of the default-mode network, the system that activates when external task demands fall away. Jung's individuation — his term for the lifelong work of integrating the disowned — happens largely in this register: not on the to-do list, not in the foreground. The work the self does when it isn't being asked to do anything is some of the most important work a self does. PCC is where you can see the lights stay on after the workday ends.",
    bridgeStrength: "tight",
    citationIds: ["buckner-2008-default-network", "jung-memories-dreams-reflections"],
    position: [0.0, 0.4, -0.55],
  },
  {
    id: "precuneus",
    displayName: "Precuneus",
    anatomyName: "Precuneus",
    scienceGloss:
      "Implicated in autobiographical memory, mental imagery, and visual-spatial integration.",
    poeticGloss:
      "Where you go when you remember the smell of your grandmother's kitchen.",
    jungianGloss:
      "Where you go when you remember the smell of your grandmother's kitchen.",
    theThread:
      "The precuneus is consistently implicated in autobiographical memory and mental imagery — the inner stage on which the past replays itself. Jung's image of the psyche as a house with many rooms, some of which you haven't visited in decades, fits this register. Different vocabulary, related architecture: there is somewhere the past is stored that is not literally a storehouse, and entering it is a real activity with a mechanism.",
    bridgeStrength: "partial",
    citationIds: ["buckner-2008-default-network", "kandel-in-search-of-memory"],
    position: [0.0, 0.6, -0.2],
  },
  {
    id: "amyg_left",
    displayName: "Amygdala (L)",
    anatomyName: "Amygdala (left)",
    scienceGloss:
      "Involved in salience and emotional learning — *including* positive emotions. Not a 'fear center.'",
    poeticGloss:
      "The part of you that notices what matters before you have words for why.",
    jungianGloss:
      "The part of you that notices what matters before you have words for why.",
    theThread:
      "The amygdala is a salience detector — flagging stimuli for emotional significance and committing them to faster, harder-to-extinguish memory. What Jung called the numinous — being grabbed by something that feels weighted with meaning before you can say why — is partly this. Partly. The full phenomenology of numinosity exceeds any one region, but the felt sense of significance arriving before thought is not made up. It has a mechanism, and this is part of it.",
    bridgeStrength: "partial",
    citationIds: ["ledoux-2014-coming-to-terms-with-fear", "jung-cw9i"],
    position: [-0.35, -0.45, 0.2],
  },
  {
    id: "amyg_right",
    displayName: "Amygdala (R)",
    anatomyName: "Amygdala (right)",
    scienceGloss:
      "Involved in salience and emotional learning. Activates during reward as well as threat.",
    poeticGloss:
      "Where the body decides this is real, before the mind has caught up.",
    jungianGloss:
      "Where the body decides this is real, before the mind has caught up.",
    theThread:
      "Right amygdala activates with rapid, often unconscious affective processing — the body's verdict on a stimulus before deliberate thought has caught up. Jung gave weight to this priority: that the unconscious is ahead of consciousness in many domains, that we feel before we know we feel. The neuroscience is more conservative about what 'ahead' means, but the asymmetry is real and the body's faster verdict is not metaphor.",
    bridgeStrength: "partial",
    citationIds: ["ledoux-2014-coming-to-terms-with-fear", "damasio-feeling-of-what-happens"],
    position: [0.35, -0.45, 0.2],
  },
  {
    id: "hipp_left",
    displayName: "Hippocampus (L)",
    anatomyName: "Hippocampus (left)",
    scienceGloss:
      "Involved in episodic memory encoding and the construction of spatial cognitive maps.",
    poeticGloss:
      "The part of you that knits experience into a story you can return to.",
    jungianGloss:
      "The seam where what happened becomes what is remembered — and every visit changes the record.",
    theThread:
      "Modern memory science says the hippocampus does not store memories so much as reconstruct them each time they're recalled, reshaping the trace with present context. Jung saw the psyche doing the same thing at a different scale — reorganizing the past in service of present meaning, the past as something the present continually rewrites. Different language, related territory. The seam is real either way.",
    bridgeStrength: "tight",
    citationIds: ["buckner-2008-default-network", "kandel-in-search-of-memory"],
    position: [-0.45, -0.4, -0.1],
  },
  {
    id: "hipp_right",
    displayName: "Hippocampus (R)",
    anatomyName: "Hippocampus (right)",
    scienceGloss:
      "Involved in spatial memory and the imagining of possible futures, as well as the recall of past scenes.",
    poeticGloss:
      "Where you walk through rooms that haven't been built yet.",
    jungianGloss:
      "Where you walk through rooms that haven't been built yet.",
    theThread:
      "The right hippocampus is recruited not only for remembering the past but for imagining future scenes and counterfactual ones — the same machinery serves both directions of time. Jung gave central weight to the active imagination as a way of working with the unconscious. Different vocabulary, related register: imagining is not idle. It uses the same circuit that remembering uses, and one of them is more visited than the other.",
    bridgeStrength: "tight",
    citationIds: ["buckner-2008-default-network", "jung-memories-dreams-reflections"],
    position: [0.45, -0.4, -0.1],
  },
];

export const regionById = Object.fromEntries(
  regions.map((r) => [r.id, r] as const),
) as Record<RegionId, Region>;

/**
 * Signature activation patterns used on the home page room cards.
 * Each card hover lerps the brain's activations toward one of these.
 */
export const signaturePatterns: Record<
  | "mirror"
  | "music"
  | "crosscultural"
  | "atlas"
  | "bridges"
  | "tours"
  | "depthPsychology"
  | "fieldNotes"
  | "map",
  Partial<Record<RegionId, number>>
> = {
  mirror: {
    ifg_left: 0.95,
    pstg_left: 0.88,
    mtg_left: 0.82,
    atl_left: 0.74,
    agl_left: 0.62,
    ifg_right: 0.35,
    pstg_right: 0.3,
  },
  music: {
    hg_left: 0.9,
    hg_right: 0.92,
    pstg_right: 0.85,
    pstg_left: 0.7,
    vmpfc: 0.6,
    amyg_right: 0.55,
    amyg_left: 0.48,
  },
  // Cross-cultural's "pattern" is a fragmented scatter — the visual
  // manifesto that the model breaks down when crossing languages.
  crosscultural: {
    ifg_left: 0.55,
    ifg_right: 0.4,
    pstg_left: 0.6,
    pstg_right: 0.35,
    atl_left: 0.25,
    atl_right: 0.6,
    mtg_left: 0.3,
    mtg_right: 0.55,
    pcc: 0.4,
    precuneus: 0.2,
  },
  // PR 3 — five additional patterns for the home-page Instrument
  // and Long Form sections. Each one is meant to be visually
  // distinct from the three primary rooms so the cards don't all
  // look the same.

  // Atlas: a broad, even survey — moderate activation across the
  // whole 20-region map. The "what's underneath" pattern.
  atlas: {
    ifg_left: 0.5,
    ifg_right: 0.45,
    pstg_left: 0.55,
    pstg_right: 0.5,
    mtg_left: 0.45,
    mtg_right: 0.4,
    atl_left: 0.5,
    atl_right: 0.4,
    agl_left: 0.5,
    agl_right: 0.45,
    hg_left: 0.4,
    hg_right: 0.4,
    vmpfc: 0.55,
    dmpfc: 0.45,
    pcc: 0.5,
    precuneus: 0.45,
    amyg_left: 0.35,
    amyg_right: 0.35,
    hipp_left: 0.4,
    hipp_right: 0.4,
  },
  // Bridges: hub regions that participate in many networks —
  // angular gyrus, MTG, ATL, vmpfc — the connector signal.
  bridges: {
    agl_left: 0.85,
    agl_right: 0.75,
    mtg_left: 0.78,
    mtg_right: 0.7,
    atl_left: 0.7,
    atl_right: 0.6,
    vmpfc: 0.75,
    pcc: 0.65,
    precuneus: 0.6,
  },
  // Tours: language-network-dominant, with PCC/precuneus rising
  // toward the end (the "still you" closing scene).
  tours: {
    ifg_left: 0.88,
    mtg_left: 0.78,
    atl_left: 0.72,
    agl_left: 0.68,
    pstg_left: 0.7,
    vmpfc: 0.55,
    pcc: 0.5,
    precuneus: 0.45,
  },
  // Depth psychology: DMN-saturated. The default network at rest,
  // self-referential processing, where Jungian material lives.
  depthPsychology: {
    pcc: 0.95,
    precuneus: 0.92,
    vmpfc: 0.88,
    dmpfc: 0.75,
    agl_left: 0.78,
    agl_right: 0.72,
    mtg_left: 0.5,
    atl_left: 0.55,
    amyg_left: 0.45,
    amyg_right: 0.4,
  },
  // Field notes: hippocampal — the essays are about memory, time,
  // and what the brain knows. Medial temporal lobe dominant.
  fieldNotes: {
    hipp_left: 0.95,
    hipp_right: 0.9,
    atl_left: 0.6,
    atl_right: 0.55,
    pcc: 0.6,
    precuneus: 0.55,
    vmpfc: 0.55,
    mtg_left: 0.5,
    amyg_left: 0.35,
  },
  // Map: the index page. Even, low-to-mid activation across every
  // region in pairs, mirroring the catalogue character of the page.
  map: {
    ifg_left: 0.4,
    ifg_right: 0.4,
    pstg_left: 0.4,
    pstg_right: 0.4,
    mtg_left: 0.4,
    mtg_right: 0.4,
    atl_left: 0.4,
    atl_right: 0.4,
    agl_left: 0.4,
    agl_right: 0.4,
    hg_left: 0.35,
    hg_right: 0.35,
    vmpfc: 0.45,
    dmpfc: 0.4,
    pcc: 0.45,
    precuneus: 0.4,
    amyg_left: 0.3,
    amyg_right: 0.3,
    hipp_left: 0.4,
    hipp_right: 0.4,
  },
};
