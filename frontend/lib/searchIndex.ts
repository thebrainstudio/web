/**
 * Search index for the Cmd/Ctrl-K palette.
 *
 * The index is a flat array of searchable entries. Each entry has a
 * `kind` for grouping in the UI (room / region / bridge / essay /
 * concept), a primary `title` shown in the result row, an optional
 * `subtitle`, an `href` to navigate to, and a `keywords` array used
 * for fuzzy matching beyond the title.
 *
 * Index construction is server-safe (pure data, no React, no DOM).
 * The palette UI imports this module and filters in-memory on every
 * keystroke. With ~50 entries the filter is trivially fast; no need
 * for Fuse.js or similar.
 *
 * Authoring rule: when you add a Region Atlas page, a Bridges
 * section, or a new room, add a corresponding index entry. Stub
 * Atlas regions are indexed but tagged `inProgress` so the UI can
 * show them with a muted treatment.
 */

import { regions, regionById, type RegionId } from "./regions";
import { atlasEntries } from "@/content/atlas";
import { BRIDGE_SECTIONS, REGION_BRIDGE_LINKS } from "./bridges";
import { YEO_NETWORKS } from "./atlas";
import { tours } from "@/content/tours";
import { tourDuration } from "./tours";
import { depthPsychologyPages } from "@/content/depth-psychology";
import { TRACTS, TRACT_ORDER } from "./tracts";

export type SearchKind =
  | "region"
  | "bridge"
  | "room"
  | "essay"
  | "concept"
  | "tour";

export type SearchEntry = {
  id: string;
  kind: SearchKind;
  title: string;
  /** Short type-specific subtitle shown beneath the title. */
  subtitle?: string;
  href: string;
  /**
   * Bag of strings used for substring matching, in addition to
   * `title`. Author names, alternate region names, disorder names,
   * researcher names, etc.
   */
  keywords: string[];
  /** Stub Atlas region: rendered with a muted treatment in the palette. */
  inProgress?: boolean;
};

const roomEntries: SearchEntry[] = [
  {
    id: "room:home",
    kind: "room",
    title: "Home",
    subtitle: "The Brain Studio",
    href: "/",
    keywords: ["home", "start", "entry", "studio"],
  },
  {
    id: "room:mirror",
    kind: "room",
    title: "Brain Mirror",
    subtitle: "Text → predicted activation",
    href: "/mirror",
    keywords: ["mirror", "tribe", "text", "prediction", "fmri"],
  },
  {
    id: "room:music",
    kind: "room",
    title: "NeuroMusic Lab",
    subtitle: "How sound moves the brain",
    href: "/music",
    keywords: ["music", "audio", "auditory", "song", "track"],
  },
  {
    id: "room:crosscultural",
    kind: "room",
    title: "Cross-Cultural Brain",
    subtitle: "Thai ↔ English stimulus pairs",
    href: "/crosscultural",
    keywords: [
      "cross-cultural",
      "crosscultural",
      "thai",
      "english",
      "language",
      "translation",
    ],
  },
  {
    id: "room:cellular",
    kind: "room",
    title: "Cellular View",
    subtitle: "Neurons and synapses",
    href: "/cellular",
    keywords: [
      "cellular",
      "neuron",
      "synapse",
      "axon",
      "dendrite",
      "neurotransmitter",
      "dopamine",
      "serotonin",
      "gaba",
      "glutamate",
      "acetylcholine",
      "norepinephrine",
    ],
  },
  {
    id: "room:threshold",
    kind: "room",
    title: "The Threshold",
    subtitle: "A contemplative essay",
    href: "/threshold",
    keywords: ["threshold", "essay", "jung", "depth"],
  },
  {
    id: "room:archetypes",
    kind: "room",
    title: "The Archetypes",
    subtitle: "Jungian images, paired with neuroscience",
    href: "/archetypes",
    keywords: ["archetypes", "jung", "shadow", "anima", "self", "mandala"],
  },
  {
    id: "room:about",
    kind: "room",
    title: "About",
    subtitle: "How this site was built",
    href: "/about",
    keywords: ["about", "tribe", "citations", "credits"],
  },
  {
    id: "room:field-notes",
    kind: "room",
    title: "Field Notes",
    subtitle: "Long-form essays between the layers",
    href: "/field-notes",
    keywords: ["field notes", "essays", "long-form"],
  },
  {
    id: "room:atlas",
    kind: "room",
    title: "Region Atlas",
    subtitle: "The 20 regions in depth",
    href: "/atlas",
    keywords: ["atlas", "regions", "anatomy"],
  },
  {
    id: "room:bridges",
    kind: "room",
    title: "Bridges",
    subtitle: "Where mechanism and meaning touch",
    href: "/bridges",
    keywords: [
      "bridges",
      "neuroscience",
      "psychology",
      "synthesis",
      "jung",
      "freud",
      "panksepp",
      "solms",
    ],
  },
  {
    id: "room:tours",
    kind: "room",
    title: "Guided Tours",
    subtitle: "Choreographed 2-minute brain experiences",
    href: "/tours",
    keywords: ["tours", "guided", "narration", "cinematic"],
  },
  {
    id: "room:depth-psychology",
    kind: "room",
    title: "Depth Psychology",
    subtitle: "Jung, Gestalt, and the synthesizing layer",
    href: "/depth-psychology",
    keywords: [
      "depth psychology",
      "jung",
      "freud",
      "gestalt",
      "aion",
      "shadow",
      "self",
      "individuation",
      "red book",
      "active imagination",
    ],
  },
];

function buildTractEntries(): SearchEntry[] {
  return TRACT_ORDER.map((id) => {
    const tract = TRACTS[id];
    // Tracts link to the Atlas page of the first endpoint region —
    // from there the Connectome panel surfaces the tract's toggle.
    const [endpoint] = tract.endpoints;
    return {
      id: `tract:${id}`,
      kind: "concept" as const,
      title: tract.displayName,
      subtitle: `Tract · endpoints: ${tract.endpoints.join(" ↔ ")}`,
      href: `/atlas/${endpoint}`,
      keywords: [
        tract.displayName.toLowerCase(),
        "tract",
        "white matter",
        "connectome",
        ...tract.endpoints,
        ...(tract.relatedDisorders ?? []).map((d) => d.toLowerCase()),
      ],
    };
  });
}

function buildDepthPsychologyEntries(): SearchEntry[] {
  return depthPsychologyPages.map((page) => ({
    id: `depth:${page.slug}`,
    kind: "essay" as const,
    title: page.title,
    subtitle: `Depth psychology · ${page.readMinutes} min`,
    href: `/depth-psychology/${page.slug}`,
    keywords: [
      page.title.toLowerCase(),
      page.subtitle.toLowerCase(),
      "depth psychology",
      "jung",
      page.slug.replace(/-/g, " "),
    ],
  }));
}

function buildTourEntries(): SearchEntry[] {
  return tours.map((tour) => ({
    id: `tour:${tour.id}`,
    kind: "tour" as const,
    title: tour.title,
    subtitle: `${Math.round(tourDuration(tour) / 60)} min · ${tour.subtitle}`,
    href: `/tours/${tour.id}`,
    keywords: [
      tour.title.toLowerCase(),
      tour.subtitle.toLowerCase(),
      "tour",
      "guided",
      "narration",
    ],
  }));
}

/**
 * Per-region keywords. Names from the brief's reference list (Broca,
 * Wernicke, Heschl, etc.) plus the disorders associated with the
 * region. Builds up the index so a search for "memory" or "Wernicke"
 * or "schizophrenia" lands on the right Atlas page.
 */
const REGION_KEYWORDS: Partial<Record<RegionId, string[]>> = {
  ifg_left: [
    "broca",
    "broca's area",
    "broca region",
    "language",
    "syntax",
    "aphasia",
    "speech production",
    "ba 44",
    "ba 45",
    "leborgne",
    "inferior frontal gyrus",
  ],
  ifg_right: [
    "right inferior frontal gyrus",
    "prosody",
    "figurative language",
    "inhibitory control",
  ],
  pstg_left: [
    "wernicke",
    "wernicke's area",
    "language comprehension",
    "phonological",
    "dual stream",
    "hickok",
    "posterior superior temporal",
  ],
  pstg_right: [
    "right posterior superior temporal",
    "melody",
    "prosody",
    "tonal processing",
  ],
  mtg_left: ["middle temporal", "semantic memory", "binder", "lexical"],
  mtg_right: ["right middle temporal", "narrative", "metaphor"],
  atl_left: ["anterior temporal lobe", "semantic hub", "conceptual"],
  atl_right: ["right anterior temporal", "person knowledge", "face memory"],
  agl_left: [
    "angular gyrus",
    "heteromodal",
    "default mode",
    "semantic integration",
  ],
  agl_right: ["right angular gyrus", "numeracy", "body schema"],
  hg_left: [
    "heschl",
    "heschl's gyrus",
    "primary auditory cortex",
    "tonotopic",
    "a1",
  ],
  hg_right: ["right primary auditory", "spectral"],
  vmpfc: [
    "ventromedial prefrontal",
    "vmpfc",
    "valuation",
    "default mode",
    "self-referential",
  ],
  dmpfc: [
    "dorsomedial prefrontal",
    "dmpfc",
    "mentalizing",
    "theory of mind",
  ],
  pcc: [
    "posterior cingulate",
    "pcc",
    "default mode network",
    "dmn",
    "raichle",
    "mind-wandering",
    "meditation",
  ],
  precuneus: [
    "precuneus",
    "autobiographical memory",
    "mental imagery",
    "default mode",
  ],
  amyg_left: [
    "amygdala",
    "salience",
    "ledoux",
    "fear",
    "emotional learning",
    "limbic",
  ],
  amyg_right: ["right amygdala", "salience", "affective processing"],
  hipp_left: [
    "hippocampus",
    "memory",
    "place cells",
    "scoville",
    "milner",
    "hm",
    "henry molaison",
    "alzheimer",
    "ptsd",
    "amnesia",
    "epilepsy",
    "temporal lobe",
  ],
  hipp_right: [
    "right hippocampus",
    "spatial memory",
    "future imagination",
    "scene construction",
  ],
};

function buildRegionEntries(): SearchEntry[] {
  return regions.map((r): SearchEntry => {
    const atlas = atlasEntries[r.id];
    const disorders = atlas.disorders.map((d) => d.name.toLowerCase());
    const network = YEO_NETWORKS[atlas.yeoNetwork].displayName;
    const keywords = [
      r.displayName.toLowerCase(),
      r.anatomyName.toLowerCase(),
      network.toLowerCase(),
      ...(REGION_KEYWORDS[r.id] ?? []),
      ...disorders,
    ];
    return {
      id: `region:${r.id}`,
      kind: "region",
      title: r.displayName,
      subtitle: `${r.anatomyName} · ${network}`,
      href: `/atlas/${r.id}`,
      keywords,
      inProgress: atlas.status === "in-progress",
    };
  });
}

const BRIDGE_KEYWORDS: Partial<Record<string, string[]>> = {
  "dmn-and-self-system": [
    "default mode network",
    "dmn",
    "raichle",
    "buckner",
    "carhart-harris",
    "friston",
    "self-referential",
    "northoff",
    "ego function",
  ],
  "implicit-cognition-unconscious": [
    "unconscious",
    "implicit cognition",
    "implicit memory",
    "schacter",
    "westen",
    "anderson",
    "repression",
    "motivated forgetting",
    "evolved primitives",
    "tooby",
    "cosmides",
    "automaticity",
  ],
  "memory-reconstruction": [
    "memory reconstruction",
    "reconsolidation",
    "nader",
    "ledoux",
    "kandel",
    "schacter",
    "seven sins",
    "loftus",
    "nachträglichkeit",
    "deferred action",
  ],
  "salience-numinosity": [
    "salience network",
    "seeley",
    "anterior insula",
    "anterior cingulate",
    "numinous",
    "otto",
    "felt significance",
    "amygdala",
  ],
  "dmn-deactivation-individuation": [
    "ego dissolution",
    "psychedelics",
    "meditation",
    "brewer",
    "lebedev",
    "entropic brain",
    "psilocybin",
    "individuation",
  ],
  "affective-neuroscience-drives": [
    "panksepp",
    "solms",
    "affective neuroscience",
    "seeking",
    "fear",
    "rage",
    "care",
    "panic",
    "grief",
    "play",
    "neuropsychoanalysis",
    "drive theory",
  ],
  "embodied-cognition": [
    "embodied cognition",
    "interoception",
    "insula",
    "critchley",
    "garfinkel",
    "damasio",
    "lakoff",
    "johnson",
    "gestalt",
    "reich",
    "character armor",
    "somatic",
  ],
  "where-bridges-fail": [
    "synchronicity",
    "collective unconscious",
    "active imagination",
    "aion",
    "mysterium",
    "transpersonal",
    "limits",
  ],
};

function buildBridgeEntries(): SearchEntry[] {
  return BRIDGE_SECTIONS.map((section): SearchEntry => ({
    id: `bridge:${section.id}`,
    kind: "bridge",
    title: section.heading,
    subtitle: section.subtitle ?? `Bridge · ${section.strength}`,
    href: `/bridges#${section.id}`,
    keywords: [
      section.heading.toLowerCase(),
      ...(BRIDGE_KEYWORDS[section.id] ?? []),
    ],
  }));
}

const essayEntries: SearchEntry[] = [
  {
    id: "essay:hippocampus",
    kind: "essay",
    title: "The hippocampus and the act of remembering",
    subtitle: "Field note · memory as reconstruction",
    href: "/field-notes/hippocampus-and-the-act-of-remembering",
    keywords: [
      "hippocampus",
      "memory",
      "reconstruction",
      "kandel",
      "jung",
      "remembering",
    ],
  },
  {
    id: "essay:what-the-brain-knows",
    kind: "essay",
    title: "What the brain knows before you do",
    subtitle: "Field note · implicit cognition",
    href: "/field-notes/what-the-brain-knows",
    keywords: [
      "unconscious",
      "implicit",
      "prediction",
      "automaticity",
      "intuition",
    ],
  },
];

/**
 * Cross-cutting concepts that point to whichever destination is most
 * useful. "DMN" lands on the bridges section; "schizophrenia" lands on
 * the hippocampus atlas page (the disorder is implicated in many
 * regions, but the hippocampus is the clearest within our 20).
 */
const conceptEntries: SearchEntry[] = [
  {
    id: "concept:dmn",
    kind: "concept",
    title: "Default Mode Network",
    subtitle: "Bridges § 2 + Atlas DMN regions",
    href: "/bridges#dmn-and-self-system",
    keywords: ["dmn", "default mode", "raichle", "buckner"],
  },
  {
    id: "concept:individuation",
    kind: "concept",
    title: "Individuation",
    subtitle: "Bridges § 6 · Jung's lifelong work of integration",
    href: "/bridges#dmn-deactivation-individuation",
    keywords: ["individuation", "jung", "self", "integration"],
  },
  {
    id: "concept:shadow",
    kind: "concept",
    title: "The shadow",
    subtitle: "Bridges § 3 (related: inhibitory control)",
    href: "/bridges#implicit-cognition-unconscious",
    keywords: ["shadow", "jung", "repression", "disowned"],
  },
  {
    id: "concept:numinous",
    kind: "concept",
    title: "The numinous",
    subtitle: "Bridges § 5 · Otto, Jung, and salience",
    href: "/bridges#salience-numinosity",
    keywords: ["numinous", "numinosity", "otto", "sacred", "felt significance"],
  },
];

export const searchIndex: SearchEntry[] = [
  ...roomEntries,
  ...buildRegionEntries(),
  ...buildBridgeEntries(),
  ...buildTourEntries(),
  ...buildDepthPsychologyEntries(),
  ...buildTractEntries(),
  ...essayEntries,
  ...conceptEntries,
];

/**
 * Simple substring filter. Each query token must match somewhere
 * (title or keywords) for the entry to score. Ranking prefers
 * title-prefix matches over middle-of-string matches.
 */
export function searchEntries(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  type Scored = { entry: SearchEntry; score: number };
  const out: Scored[] = [];
  for (const entry of searchIndex) {
    const title = entry.title.toLowerCase();
    const hay = [title, entry.subtitle?.toLowerCase() ?? "", ...entry.keywords].join(
      " | ",
    );
    let allTokensMatch = true;
    let score = 0;
    for (const t of tokens) {
      if (!hay.includes(t)) {
        allTokensMatch = false;
        break;
      }
      // Bonuses: title prefix > title contains > keyword contains.
      if (title.startsWith(t)) score += 5;
      else if (title.includes(t)) score += 3;
      else score += 1;
    }
    if (allTokensMatch) out.push({ entry, score });
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, limit).map((s) => s.entry);
}

/**
 * Group entries by kind for the empty-state palette view.
 * Used when query is empty: show a small set of suggested entries
 * organized by category.
 */
export function groupByKind(entries: SearchEntry[]): Record<SearchKind, SearchEntry[]> {
  const out: Record<SearchKind, SearchEntry[]> = {
    region: [],
    bridge: [],
    room: [],
    essay: [],
    concept: [],
    tour: [],
  };
  for (const e of entries) out[e.kind].push(e);
  return out;
}
