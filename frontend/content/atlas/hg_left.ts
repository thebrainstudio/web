import type { AtlasEntry } from "@/lib/atlas";

/**
 * Heschl's gyrus (left) — primary auditory cortex.
 *
 * Voice note: this is the page where the existing site's discipline
 * around honesty about what does and doesn't bridge gets its most
 * deliberate expression. Heschl's gyrus is machinery — fast,
 * faithful, beautifully organized — and the existing "the thread"
 * for the region explicitly declines to offer a depth-psychological
 * gloss. The Atlas page honours that decision. Mechanism is mechanism
 * here. What gets done with the input downstream is where meaning
 * begins to live.
 */
export const hgLeftAtlas: AtlasEntry = {
  id: "hg_left",
  fullName: "Heschl's gyrus / primary auditory cortex (left)",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "Auditory",
  adjacentRegions: ["pstg_left", "hg_right"],
  relatedTours: ["how-you-read-this-sentence"],
  connectivityTracts: [
    "auditory-radiation",
    "superior-longitudinal-fasciculus",
  ],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer IV granule cell (high density)" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "cortical-deafness",
      name: "Cortical deafness",
      oneLine:
        "Bilateral lesions of primary auditory cortex produce a striking deficit in which the patient does not consciously hear sounds despite intact peripheral hearing.",
    },
    {
      id: "auditory-agnosia",
      name: "Auditory agnosia",
      oneLine:
        "Selective inability to recognize sounds with preserved hearing, typically from lesions involving secondary auditory regions adjacent to HG.",
    },
    {
      id: "tinnitus",
      name: "Tinnitus",
      oneLine:
        "Maladaptive reorganization of tonotopic representations in HG is one of several proposed neural mechanisms for the persistent perception of sound in the absence of acoustic input.",
    },
  ],
  primaryDiscoveryReference: "da-costa-2011-tonotopy-heschl",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Heschl's gyrus is the transverse temporal gyrus that runs along the upper bank of the lateral sulcus, almost perpendicular to the superior temporal gyrus and partly hidden within the Sylvian fissure. Its position on the upper surface of the temporal lobe means it is not visible on the lateral surface of the intact brain — you have to open the Sylvian fissure to see it [cite:da-costa-2011-tonotopy-heschl].",
      "The morphology of Heschl's gyrus is one of the more variable features of human cortical anatomy. Roughly half of individuals have a single Heschl's gyrus on each side; the rest have partial or complete duplications, with two parallel gyri or a single gyrus with a longitudinal sulcus dividing it. The Da Costa et al. 2011 high-field fMRI study established that primary auditory cortex spans both divisions of HG in duplicated cases — the field had previously assumed PAC occupied only the anterior gyrus, and the correction matters for clinical interpretation of HG-involving lesions [cite:da-costa-2011-tonotopy-heschl].",
      "Primary auditory cortex corresponds to Brodmann area 41. It receives the principal cortical input from the medial geniculate nucleus of the thalamus via the auditory radiation, and projects to the surrounding planum polare and planum temporale (BA 42 and adjacent regions), which constitute the secondary auditory cortex.",
    ],
  },

  functionSection: {
    paragraphs: [
      "Heschl's gyrus is primary auditory cortex — the first cortical region to receive auditory input from the ear via the cochlea, brainstem auditory nuclei, inferior colliculus, and medial geniculate. The region is tonotopically organized: different acoustic frequencies activate different positions along the gyrus, with low frequencies represented anterolaterally and high frequencies posteromedially [cite:da-costa-2011-tonotopy-heschl]. The map is mirror-symmetric — there are two primary tonotopic maps within HG, hA1 and hR, meeting at a central frequency boundary — and the same organization is observed across the wide morphological variation of the gyrus itself.",
      "Beyond simple tonotopy, primary auditory cortex performs early spectrotemporal analysis: rapid temporal modulations, spectral envelopes, fine pitch differences, and the binaural cues that contribute to spatial hearing. The region's computations are fast and largely faithful to the input — the kind of work that supports the more elaborate downstream analyses of speech, music, and environmental sounds that secondary auditory regions and the temporal-lobe language and music systems perform.",
      "The left-right asymmetry within primary auditory cortex is modest but real. Left HG is biased toward fine temporal resolution, which supports the rapid sequential discriminations needed for phonemic processing; right HG is biased toward finer spectral resolution, which supports pitch and timbre processing. Both hemispheres receive bilateral auditory input from each ear, so unilateral HG damage rarely produces complete deafness — bilateral lesions are needed for that.",
      "This is one of the regions on the site for which a depth-psychological gloss is not offered. Primary auditory cortex is machinery, faithful and necessary. The phenomenology of hearing — being addressed by a sound, being moved by music, recognizing a voice — lives one or several synapses downstream. The Atlas honours the distinction: where the bridge to depth psychology is honest, the page makes it; where it is not, the page does not invent one.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Unlike most association cortex, primary auditory cortex is granular cortex — it has a distinctly developed layer IV that receives the thalamic projection from the medial geniculate. This cytoarchitectural marker is one of the standard ways the boundaries of primary sensory cortex are identified in classical neuroanatomy, and it distinguishes HG from the adjacent dysgranular cortices that constitute the secondary auditory regions [cite:da-costa-2011-tonotopy-heschl].",
      "Layer III and layer V pyramidal cells carry the principal corticocortical outputs of the region — to the surrounding secondary auditory cortex, to the contralateral hemisphere via the corpus callosum, and (sparingly) to the planum temporale and back to the medial geniculate as cortical feedback.",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "The auditory radiation is the principal input pathway to HG, carrying axons from the medial geniculate nucleus of the thalamus into the upper bank of the temporal lobe. From HG, short-range corticocortical connections fan out to the planum temporale posteriorly and the planum polare anteriorly — the secondary auditory regions that perform the more elaborate computations on the spectrotemporal information HG provides.",
      "Long-range connections from HG to other temporal-lobe and frontal-lobe regions are mostly indirect, routed through these secondary auditory regions. In the dual-stream framework, HG provides the input that the dorsal and ventral streams elaborate — the dorsal stream into the sound-to-articulation route via posterior STG and the arcuate fasciculus to Broca, the ventral stream into the sound-to-meaning route via middle temporal cortex and the inferior longitudinal fasciculus [cite:hickok-poeppel-2007-dual-stream].",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Bilateral lesions of HG produce cortical deafness — a striking deficit in which the patient does not consciously hear sounds despite the cochlea, brainstem auditory nuclei, and thalamus being intact. The condition is rare because it requires bilateral damage; unilateral HG lesions cause more subtle hearing impairments. Cortical deafness illustrates that the conscious experience of hearing depends on cortical processing, not on the integrity of peripheral hearing apparatus alone.",
      "Auditory agnosia — selective inability to recognize sounds (speech sounds, environmental sounds, or both) with preserved hearing — typically results from lesions involving secondary auditory cortex adjacent to HG. The dissociation between cortical deafness (cannot hear) and auditory agnosia (can hear but cannot recognize) is one of the cleaner clinical demonstrations that hearing and auditory recognition are functionally separable.",
      "Tinnitus — the persistent perception of sound in the absence of an external source — is associated with a range of central auditory abnormalities, including maladaptive reorganization of tonotopic representations in HG. Hearing-loss-related tinnitus often follows the loss of input from cochlear frequency regions, with the cortical representation of those frequencies remapping in ways that may underlie the phantom percept.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "Richard Heschl, an Austrian anatomist, described the transverse temporal gyri that now bear his name in 1855. The region's status as primary auditory cortex was established through the convergence of nineteenth-century clinical observation, early-twentieth-century cytoarchitectonic mapping (Brodmann identified BA 41 as primary auditory cortex), and the mid-twentieth-century electrophysiological recordings in animals that confirmed the tonotopic organization.",
      "The contemporary picture of human primary auditory cortex — including the correction that PAC spans both divisions of duplicated HG morphologies — was established by Sandra Da Costa, Melissa Saenz and colleagues' 2011 high-field 7T fMRI study, which mapped tonotopy in individual subjects across the range of common Heschl's gyrus morphologies [cite:da-costa-2011-tonotopy-heschl]. The study revised a long-standing assumption and clarified where to look for primary auditory cortex in any given individual brain.",
    ],
  },
};
