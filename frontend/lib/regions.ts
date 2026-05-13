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

export type Region = {
  id: RegionId;
  displayName: string;
  anatomyName: string;
  scienceGloss: string;
  poeticGloss: string;
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
    citationIds: ["hagoort-2014-language-architecture"],
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
    citationIds: ["hagoort-2014-language-architecture"],
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
    citationIds: ["kell-2018-auditory-task-network"],
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
    citationIds: ["binder-desai-2011-semantic-system"],
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
    citationIds: ["binder-desai-2011-semantic-system"],
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
    citationIds: ["binder-desai-2011-semantic-system"],
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
    citationIds: ["buckner-2008-default-network"],
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
    citationIds: ["buckner-2008-default-network"],
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
    citationIds: ["buckner-2008-default-network"],
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
    citationIds: ["buckner-2008-default-network"],
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
    citationIds: ["buckner-2008-default-network"],
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
    citationIds: ["ledoux-2014-coming-to-terms-with-fear"],
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
    citationIds: ["ledoux-2014-coming-to-terms-with-fear"],
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
    citationIds: ["buckner-2008-default-network"],
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
    citationIds: ["buckner-2008-default-network"],
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
  "mirror" | "music" | "crosscultural",
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
};
