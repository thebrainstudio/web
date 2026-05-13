import type { AtlasEntry } from "@/lib/atlas";

/**
 * Right Heschl's gyrus / primary auditory cortex (HG-R) — Atlas entry.
 *
 * Voice note: this is the second of the auditory-mechanism pages
 * for which a depth-psychological gloss is not offered. The
 * spectral specialization that gives right HG its musical-pitch
 * sensitivity is machinery, faithful and necessary; what gets done
 * with the spectral content downstream is where meaning enters.
 */
export const hgRightAtlas: AtlasEntry = {
  id: "hg_right",
  fullName: "Right Heschl's gyrus / primary auditory cortex",
  glasserIndices: [],
  schaeferIndices: [],
  yeoNetwork: "Auditory",
  adjacentRegions: ["pstg_right", "hg_left"],
  relatedTours: ["hearing-music"],
  connectivityTracts: ["auditory-radiation"],
  cellTypes: [
    { name: "Layer III pyramidal cell" },
    { name: "Layer IV granule cell (high density)" },
    { name: "Layer V pyramidal cell" },
  ],
  disorders: [
    {
      id: "amusia-acquired",
      name: "Acquired amusia",
      oneLine:
        "Right primary and secondary auditory cortex damage produces selective impairments of pitch and melody perception with relatively spared speech comprehension.",
    },
    {
      id: "absolute-pitch-anatomy",
      name: "Absolute pitch (anatomical correlate)",
      oneLine:
        "Musicians with absolute pitch show enlarged right Heschl's gyrus volume relative to musicians without it, consistent with the right-hemisphere bias for spectral processing.",
    },
  ],
  primaryDiscoveryReference: "zatorre-belin-2001-spectral-temporal",
  lastUpdated: "2026-05-13",
  status: "complete",

  anatomyAndLandmarks: {
    paragraphs: [
      "Right Heschl's gyrus mirrors its left counterpart in gross anatomy — the transverse temporal gyrus running along the upper bank of the lateral sulcus, with primary auditory cortex (BA 41) occupying its medial portion and the secondary auditory regions of the planum polare and planum temporale extending around it [cite:da-costa-2011-tonotopy-heschl]. The morphological variation is the same as on the left: some individuals have a single Heschl's gyrus on each side; others have partial or complete duplications, with two parallel gyri.",
      "Da Costa and colleagues' 2011 high-field 7T fMRI study established that primary auditory cortex spans both divisions of HG in duplicated cases on both sides, with tonotopic maps showing the mirror-symmetric organization (hA1 and hR meeting at a central frequency boundary) across the full range of morphological variation [cite:da-costa-2011-tonotopy-heschl]. The anatomical asymmetry between hemispheres is subtle in gross terms but visible in cortical-column spacing and white-matter microstructure.",
    ],
  },

  functionSection: {
    paragraphs: [
      "Right HG performs the same tonotopic and spectrotemporal computations as its left counterpart, but with a bias toward fine spectral resolution at the expense of fine temporal resolution. Zatorre and Belin's 2001 PET study established the canonical account of this asymmetry: left auditory cortex specializes for rapid temporal processing (which supports the sequential discriminations of phonemic processing), while right auditory cortex specializes for fine spectral processing (which supports pitch, timbre, and the contour of melody) [cite:zatorre-belin-2001-spectral-temporal].",
      "The functional consequence is that right HG is more strongly recruited than left HG during musical-pitch processing, timbral discrimination, and the perception of voice identity. The asymmetry is partial — both hemispheres do both, and the cleanest demonstrations come from lesion cases with selective unilateral damage — but it is reliable enough to underwrite a substantial portion of the right-hemisphere specialization for music and the affective layer of voice.",
      "Like its left counterpart, right HG is one of the regions on the site for which a depth-psychological gloss is not offered. The spectral analysis it performs is machinery, faithful and necessary; the meaning that arrives downstream — the felt sense of a piece of music, the recognition of a familiar voice, the numinous quality of a song that grabs you — lives in the cortical and subcortical regions to which HG sends its output, not in HG itself. The Atlas honours the distinction.",
    ],
  },

  cellTypesSection: {
    paragraphs: [
      "Right HG is granular cortex, like its left counterpart — a distinctly developed layer IV receives the thalamic projection from the medial geniculate. Cell-class composition is approximately symmetric across hemispheres; the functional asymmetry reflects subtle differences in cortical microstructure (column spacing, myelination patterns) and in long-range connectivity [cite:zatorre-belin-2001-spectral-temporal] [cite:da-costa-2011-tonotopy-heschl].",
    ],
  },

  connectionsSection: {
    paragraphs: [
      "Right HG receives the principal cortical auditory input via the right auditory radiation from the medial geniculate nucleus of the thalamus. Short-range corticocortical connections fan out to the surrounding planum temporale and planum polare; long-range connections to other temporal-lobe and frontal-lobe regions are largely indirect, routed through these secondary auditory regions [cite:kell-2018-auditory-task-network].",
      "Callosal connections to left HG support the binaural integration that underlies sound-source localization and the cross-hemispheric coordination required for fine spectral-temporal analysis.",
    ],
  },

  clinicalContext: {
    paragraphs: [
      "Acquired amusia following right-hemisphere stroke involving primary and secondary auditory cortex is the cleanest clinical demonstration of the right-hemisphere specialization for music. Patients with such lesions show selective impairments of pitch and melody perception while their speech comprehension remains relatively intact — they can hear and understand language but can no longer tell familiar tunes apart or detect melodic-contour violations [cite:zatorre-belin-2001-spectral-temporal].",
      "Absolute pitch — the ability to identify a musical pitch in isolation without a reference — is associated with anatomical differences in right HG. Musicians with absolute pitch show larger right Heschl's gyrus volumes relative to musicians without it, consistent with the right-hemisphere bias for spectral processing. The directionality (does training enlarge the structure, or does the structure enable the ability?) is debated; both contributions are likely real.",
      "Bilateral damage to primary auditory cortex produces cortical deafness, as described in the HG-L page. Unilateral right HG damage produces more subtle hearing deficits weighted toward spectral-processing impairments and music perception.",
    ],
  },

  historyOfDiscovery: {
    paragraphs: [
      "The hemispheric asymmetry in primary and secondary auditory cortex was described clinically in the late nineteenth and early twentieth centuries, primarily through observations that right-hemisphere lesions disproportionately impaired music perception while left-hemisphere lesions disproportionately impaired language. The contemporary functional-imaging account is anchored on Zatorre and Belin's 2001 PET study demonstrating the complementary spectral and temporal specializations across hemispheres [cite:zatorre-belin-2001-spectral-temporal].",
      "Da Costa and colleagues' 2011 7T fMRI study established the modern anatomical-functional picture of primary auditory cortex in both hemispheres, confirming that the same mirror-symmetric tonotopic organization holds on the right as on the left across the full range of Heschl's gyrus morphological variation [cite:da-costa-2011-tonotopy-heschl].",
    ],
  },
};
