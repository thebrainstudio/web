import type { AtlasEntry } from "@/lib/atlas";

/**
 * Precuneus — Atlas entry.
 *
 * Voice note: the precuneus has historically been the most-overlooked
 * region of cortex relative to its functional importance. Its location
 * on the medial surface and the absence of focal-lesion case studies
 * meant it was largely invisible to nineteenth- and twentieth-century
 * clinical neurology. The functional-imaging era reversed this. The
 * page leans into that history — the precuneus is a discovery of the
 * 1990s in a way that the hippocampus and Broca's region are not.
 */
export const precuneusAtlas: AtlasEntry = {
  id: "precuneus",
  fullName: "Precuneus",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "DefaultMode",
  adjacentRegions: ["pcc", "agl_left", "agl_right", "hipp_left"],
  relatedTours: ["whats-still-you-when-you-stop-trying", "the-act-of-remembering"],
  connectivityTracts: [
    "cingulum-bundle",
    "superior-longitudinal-fasciculus",
    "fornix",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer V pyramidal cell" },
    { name: "Layer VI cortico-thalamic projection cell" },
  ],
  disorders: [
    {
      id: "alzheimers",
      name: "Alzheimer's disease",
      oneLine:
        "Posteromedial hypometabolism, including the precuneus, is among the earliest cortical signatures of the disease on FDG-PET imaging.",
    },
    {
      id: "disorders-of-consciousness",
      name: "Disorders of consciousness",
      oneLine:
        "Precuneus activity is among the most reliable correlates of preserved awareness across vegetative, minimally conscious, and locked-in states.",
    },
    {
      id: "anaesthesia",
      name: "Anaesthesia and altered states",
      oneLine:
        "Selective hypometabolism in the posteromedial cortex (including the precuneus) is observed across sleep, drug-induced anaesthesia, and several altered states of consciousness.",
    },
  ],
  primaryDiscoveryReference: "cavanna-trimble-2006-precuneus-review",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "The precuneus occupies the medial surface of the parietal lobe, between the marginal branch of the cingulate sulcus anteriorly and the parieto-occipital fissure posteriorly. It is bounded inferiorly by the subparietal sulcus, beyond which lies the posterior cingulate cortex. Unlike most cortical regions, the precuneus has no easily described lateral-surface analogue — it is genuinely a medial structure, hidden from view in the intact brain and difficult to access in conventional neuroanatomical examination [cite:cavanna-trimble-2006-precuneus-review].",
      "Internally, the region subdivides into an anterior portion (with strong connections to the sensorimotor system), a central portion (associated with visuo-spatial imagery and mental rotation), and a posterior portion (most strongly connected to the rest of the default-mode network and most reliably recruited during episodic memory retrieval). This anterior-to-posterior functional gradient is one of the cleaner mappings in the precuneus literature [cite:cavanna-trimble-2006-precuneus-review].",
    ],
  },

  functionSection: {
    paragraphs: [
      "The precuneus is consistently recruited during three classes of internally-directed cognition: episodic memory retrieval, mental imagery (especially visuo-spatial), and self-referential processing — including the simulation of one's own perspective and the construction of first-person experiential scenes [cite:cavanna-trimble-2006-precuneus-review]. The functional-imaging literature converges on a picture in which the precuneus is centrally involved in building and inhabiting internally-generated representations of scenes, persons, and possibilities.",
      "Resting-state functional connectivity places the precuneus and adjacent posterior cingulate cortex as connector hubs of the default-mode network — the system that increases activity when external task demands fall away [cite:buckner-2008-default-network]. The strength of the coupling between precuneus and the rest of the default-mode network predicts behavioural measures of autobiographical memory and prospective imagination. The region is among the most metabolically active areas of cortex at rest, which is one of the reasons it was, paradoxically, late to enter the functional literature: its high baseline activity made it harder to detect as task-modulated.",
      "Within network neuroscience, the precuneus is a connector hub — a node whose damage disproportionately impacts the system's overall efficiency. Selective hypometabolism in the precuneus and posterior cingulate is observed across a wide range of altered states of consciousness: sleep, drug-induced anaesthesia, vegetative states, and several pharmacologically-induced altered states. The convergence is one piece of evidence — controversial in its strongest forms but well-supported in modest forms — that the posteromedial cortex is centrally involved in the maintenance of normal waking awareness [cite:cavanna-trimble-2006-precuneus-review].",
      "The relationship between precuneus activity and the felt sense of being a continuous self over time is part of the broader Default Mode Network bridge to depth psychology — see the Bridges page for a careful accounting of what that bridge does and does not capture.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Like other association cortices, the precuneus is dominated by layer III and layer V pyramidal neurons whose long-range projections support its role as a connector hub. Layer VI cortico-thalamic projections to the dorsal thalamus form one of the dense feedback loops by which posteromedial cortex modulates thalamic gating of cortical activity — a circuit increasingly implicated in the maintenance of conscious states [cite:cavanna-trimble-2006-precuneus-review].",
      "Descend into the Cellular View for reconstructed pyramidal cells from association cortex; the precuneus is not yet covered by name in the open archives the cellular view draws from, but the principal cell morphology generalizes well from neighbouring posteromedial regions.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The precuneus's connectivity profile is dominated by the cingulum bundle, the principal medial cortical white-matter tract, which carries projections to and from the rest of the default-mode network — particularly the posterior cingulate cortex (just below), the medial prefrontal cortex (anteriorly through the cingulum), and the hippocampal formation (through cingulum-fornix continuations) [cite:cavanna-trimble-2006-precuneus-review].",
      "Lateral connections through the superior longitudinal fasciculus link the precuneus to lateral parietal cortex (including angular gyrus) and to dorsolateral prefrontal cortex, providing the architectural basis for the precuneus's participation in both default-mode (internally-directed) and frontoparietal (task-positive) network dynamics. The precuneus is one of a small set of regions where these two systems intersect [cite:andrews-hanna-2010-default-network-functional].",
      "The structural connectivity also explains the region's vulnerability in Alzheimer's disease. The posteromedial cortex's position as a connector hub means it sits downstream of medial-temporal pathology along the cingulum; once entorhinal-hippocampal degeneration disrupts inputs to the precuneus, the region's hypometabolism follows even before its own neuropathology becomes visible.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Precuneus hypometabolism on FDG-PET imaging is among the earliest and most consistent cortical biomarkers of Alzheimer's disease, often visible years before clinical diagnosis [cite:small-2011-hippocampal-circuit-disorders]. The pattern is shared with the posterior cingulate, and together the two regions constitute the posteromedial signature of early Alzheimer's pathology. Whether the hypometabolism is downstream of medial-temporal damage or whether the posteromedial cortex has its own vulnerability is still debated; both contributions appear real.",
      "Across disorders of consciousness — vegetative state, minimally conscious state, locked-in syndrome — precuneus and posterior cingulate activity is among the most reliable neural correlates of preserved awareness [cite:cavanna-trimble-2006-precuneus-review]. The clinical implication is concrete: bedside-adjacent imaging measures of posteromedial activity provide one of the better tools currently available for distinguishing minimally conscious patients from vegetative-state patients, with consequences for prognosis and care.",
      "The precuneus's metabolic suppression during pharmacological anaesthesia, deep sleep, and certain psychedelic-induced altered states places it among the regions whose activity tracks the level (rather than the content) of consciousness. This is consistent with the network-hub framing: damage or disengagement of a connector hub disproportionately affects the integration of activity across the brain, which is what most contemporary theories take consciousness to require.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Unlike Broca's or Wernicke's regions, the precuneus does not have a nineteenth-century founding case. The region was anatomically described by Achille-Louis Foville and others in the 1800s, but its functional importance went almost entirely unrecognized through the focal-lesion era. The reason is partly accidental: the precuneus's medial location and its rich vascular supply meant that isolated lesions producing clean cognitive deficits were extremely rare in clinical practice. There was no Patient HM or Patient Tan for the precuneus.",
      "The region entered functional neuroanatomy as a discovery of the functional-imaging era. Andrea Cavanna and Michael Trimble's 2006 review in *Brain* — \"The precuneus: a review of its functional anatomy and behavioural correlates\" — was the synthesizing paper that consolidated a decade of imaging findings and gave the field its current picture of the precuneus as a central hub of internally-directed cognition [cite:cavanna-trimble-2006-precuneus-review]. The default-mode network framework that emerged from Raichle and colleagues' work in the same period gave the precuneus its now-canonical role as a network connector [cite:raichle-2001-default-mode]. The history here is short because the region's importance is recently visible — a reminder that what we know about the brain is partly a function of what tools we have to see it with.",
    ],
  },
};
