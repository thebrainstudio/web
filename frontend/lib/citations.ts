/**
 * Vetted references for the strongest neuroscience claims in the site.
 *
 * Discipline: when a region's scienceGloss makes a specific functional claim,
 * link to a paper. When in doubt, *omit the claim* rather than overstate.
 * All entries are real publications with DOIs.
 *
 * Add new entries as content grows. Never delete: deprecated refs stay, with
 * a note for the curious.
 */

export type Citation = {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi?: string;
  url?: string;
};

export const citations: Record<string, Citation> = {
  "huth-2016-semantic-maps": {
    id: "huth-2016-semantic-maps",
    authors: "Huth, A. G., de Heer, W. A., Griffiths, T. L., Theunissen, F. E., & Gallant, J. L.",
    year: 2016,
    title: "Natural speech reveals the semantic maps that tile human cerebral cortex.",
    journal: "Nature",
    doi: "10.1038/nature17637",
  },
  "caucheteux-king-2022-brains-algorithms": {
    id: "caucheteux-king-2022-brains-algorithms",
    authors: "Caucheteux, C., & King, J.-R.",
    year: 2022,
    title: "Brains and algorithms partially converge in natural language processing.",
    journal: "Communications Biology",
    doi: "10.1038/s42003-022-03036-1",
  },
  "yeo-2011-7-networks": {
    id: "yeo-2011-7-networks",
    authors:
      "Yeo, B. T. T., Krienen, F. M., Sepulcre, J., Sabuncu, M. R., Lashkari, D., Hollinshead, M., et al.",
    year: 2011,
    title:
      "The organization of the human cerebral cortex estimated by intrinsic functional connectivity.",
    journal: "Journal of Neurophysiology",
    doi: "10.1152/jn.00338.2011",
  },
  "bzdok-yeo-2017-inference-big-data": {
    id: "bzdok-yeo-2017-inference-big-data",
    authors: "Bzdok, D., & Yeo, B. T. T.",
    year: 2017,
    title: "Inference in the age of big data: Future perspectives on neuroscience.",
    journal: "NeuroImage",
    doi: "10.1016/j.neuroimage.2017.04.061",
  },
  "ledoux-2014-coming-to-terms-with-fear": {
    id: "ledoux-2014-coming-to-terms-with-fear",
    authors: "LeDoux, J. E.",
    year: 2014,
    title: "Coming to terms with fear.",
    journal: "Proceedings of the National Academy of Sciences",
    doi: "10.1073/pnas.1400335111",
  },
  "kell-2018-auditory-task-network": {
    id: "kell-2018-auditory-task-network",
    authors: "Kell, A. J. E., Yamins, D. L. K., Shook, E. N., Norman-Haignere, S. V., & McDermott, J. H.",
    year: 2018,
    title:
      "A task-optimized neural network replicates human auditory behavior, predicts brain responses, and reveals a cortical processing hierarchy.",
    journal: "Neuron",
    doi: "10.1016/j.neuron.2018.03.044",
  },
  "naselaris-2011-encoding-decoding": {
    id: "naselaris-2011-encoding-decoding",
    authors: "Naselaris, T., Kay, K. N., Nishimoto, S., & Gallant, J. L.",
    year: 2011,
    title: "Encoding and decoding in fMRI.",
    journal: "NeuroImage",
    doi: "10.1016/j.neuroimage.2010.07.073",
  },
  "hagoort-2014-language-architecture": {
    id: "hagoort-2014-language-architecture",
    authors: "Hagoort, P.",
    year: 2014,
    title: "Nodes and networks in the neural architecture for language.",
    journal: "Current Opinion in Neurobiology",
    doi: "10.1016/j.conb.2014.07.013",
  },
  "buckner-2008-default-network": {
    id: "buckner-2008-default-network",
    authors: "Buckner, R. L., Andrews-Hanna, J. R., & Schacter, D. L.",
    year: 2008,
    title: "The brain's default network: anatomy, function, and relevance to disease.",
    journal: "Annals of the New York Academy of Sciences",
    doi: "10.1196/annals.1440.011",
  },
  "binder-desai-2011-semantic-system": {
    id: "binder-desai-2011-semantic-system",
    authors: "Binder, J. R., & Desai, R. H.",
    year: 2011,
    title: "The neurobiology of semantic memory.",
    journal: "Trends in Cognitive Sciences",
    doi: "10.1016/j.tics.2011.10.001",
  },
  // --- Bridge thinkers + Jung primary sources ----------------------------
  // Jung primary sources are listed without DOIs (predate the system).
  // Volume references follow the Collected Works (CW) standard.
  "jung-cw9i": {
    id: "jung-cw9i",
    authors: "Jung, C. G.",
    year: 1959,
    title: "The Archetypes and the Collective Unconscious (Collected Works, vol. 9i).",
    journal: "Princeton University Press",
  },
  "jung-cw6-types": {
    id: "jung-cw6-types",
    authors: "Jung, C. G.",
    year: 1971,
    title: "Psychological Types (Collected Works, vol. 6).",
    journal: "Princeton University Press",
  },
  "jung-memories-dreams-reflections": {
    id: "jung-memories-dreams-reflections",
    authors: "Jung, C. G., recorded and edited by A. Jaffé",
    year: 1963,
    title: "Memories, Dreams, Reflections.",
    journal: "Pantheon Books",
  },
  "solms-hidden-spring": {
    id: "solms-hidden-spring",
    authors: "Solms, M.",
    year: 2021,
    title:
      "The Hidden Spring: A Journey to the Source of Consciousness.",
    journal: "W. W. Norton",
  },
  "mcgilchrist-master-emissary": {
    id: "mcgilchrist-master-emissary",
    authors: "McGilchrist, I.",
    year: 2009,
    title:
      "The Master and His Emissary: The Divided Brain and the Making of the Western World.",
    journal: "Yale University Press",
  },
  "sacks-man-who-mistook": {
    id: "sacks-man-who-mistook",
    authors: "Sacks, O.",
    year: 1985,
    title: "The Man Who Mistook His Wife for a Hat and Other Clinical Tales.",
    journal: "Summit Books",
  },
  "damasio-feeling-of-what-happens": {
    id: "damasio-feeling-of-what-happens",
    authors: "Damasio, A.",
    year: 1999,
    title:
      "The Feeling of What Happens: Body and Emotion in the Making of Consciousness.",
    journal: "Harcourt Brace",
  },
  "kandel-in-search-of-memory": {
    id: "kandel-in-search-of-memory",
    authors: "Kandel, E. R.",
    year: 2006,
    title:
      "In Search of Memory: The Emergence of a New Science of Mind.",
    journal: "W. W. Norton",
  },

  // --- Atlas v1: Hippocampus citations ---------------------------------
  "scoville-milner-1957-hm": {
    id: "scoville-milner-1957-hm",
    authors: "Scoville, W. B., & Milner, B.",
    year: 1957,
    title: "Loss of recent memory after bilateral hippocampal lesions.",
    journal: "Journal of Neurology, Neurosurgery and Psychiatry",
    doi: "10.1136/jnnp.20.1.11",
  },
  "maguire-2000-taxi-drivers": {
    id: "maguire-2000-taxi-drivers",
    authors:
      "Maguire, E. A., Gadian, D. G., Johnsrude, I. S., Good, C. D., Ashburner, J., Frackowiak, R. S. J., & Frith, C. D.",
    year: 2000,
    title:
      "Navigation-related structural change in the hippocampi of taxi drivers.",
    journal: "Proceedings of the National Academy of Sciences",
    doi: "10.1073/pnas.070039597",
  },
  "okeefe-dostrovsky-1971-place-cells": {
    id: "okeefe-dostrovsky-1971-place-cells",
    authors: "O'Keefe, J., & Dostrovsky, J.",
    year: 1971,
    title:
      "The hippocampus as a spatial map: Preliminary evidence from unit activity in the freely-moving rat.",
    journal: "Brain Research",
    doi: "10.1016/0006-8993(71)90358-1",
  },
  "schacter-addis-2007-constructive-episodic": {
    id: "schacter-addis-2007-constructive-episodic",
    authors: "Schacter, D. L., & Addis, D. R.",
    year: 2007,
    title:
      "The cognitive neuroscience of constructive memory: remembering the past and imagining the future.",
    journal: "Philosophical Transactions of the Royal Society B",
    doi: "10.1098/rstb.2007.2087",
  },
  "squire-1992-medial-temporal-lobe": {
    id: "squire-1992-medial-temporal-lobe",
    authors: "Squire, L. R.",
    year: 1992,
    title:
      "Memory and the hippocampus: A synthesis from findings with rats, monkeys, and humans.",
    journal: "Psychological Review",
    doi: "10.1037/0033-295X.99.2.195",
  },
  "amaral-lavenex-2007-hippocampus-anatomy": {
    id: "amaral-lavenex-2007-hippocampus-anatomy",
    authors: "Amaral, D. G., & Lavenex, P.",
    year: 2007,
    title: "Hippocampal neuroanatomy.",
    journal: "In: The Hippocampus Book (Andersen et al., eds.), Oxford University Press",
  },
  "small-2011-hippocampal-circuit-disorders": {
    id: "small-2011-hippocampal-circuit-disorders",
    authors: "Small, S. A., Schobel, S. A., Buxton, R. B., Witter, M. P., & Barnes, C. A.",
    year: 2011,
    title:
      "A pathophysiological framework of hippocampal dysfunction in ageing and disease.",
    journal: "Nature Reviews Neuroscience",
    doi: "10.1038/nrn3085",
  },

  // --- Atlas v1: Broca / left IFG citations ----------------------------
  "broca-1861-aphemie": {
    id: "broca-1861-aphemie",
    authors: "Broca, P.",
    year: 1861,
    title:
      "Remarques sur le siège de la faculté du langage articulé, suivies d'une observation d'aphémie (perte de la parole).",
    journal:
      "Bulletins de la Société Anatomique de Paris",
  },
  "dronkers-2007-broca-revisited": {
    id: "dronkers-2007-broca-revisited",
    authors: "Dronkers, N. F., Plaisant, O., Iba-Zizen, M. T., & Cabanis, E. A.",
    year: 2007,
    title:
      "Paul Broca's historic cases: high resolution MR imaging of the brains of Leborgne and Lelong.",
    journal: "Brain",
    doi: "10.1093/brain/awm042",
  },
  "amunts-1999-brodmann-44-45": {
    id: "amunts-1999-brodmann-44-45",
    authors:
      "Amunts, K., Schleicher, A., Bürgel, U., Mohlberg, H., Uylings, H. B. M., & Zilles, K.",
    year: 1999,
    title:
      "Broca's region revisited: cytoarchitecture and intersubject variability.",
    journal: "Journal of Comparative Neurology",
    doi: "10.1002/(SICI)1096-9861(19990920)412:2<319::AID-CNE10>3.0.CO;2-7",
  },
  "friederici-2011-language-network": {
    id: "friederici-2011-language-network",
    authors: "Friederici, A. D.",
    year: 2011,
    title: "The brain basis of language processing: from structure to function.",
    journal: "Physiological Reviews",
    doi: "10.1152/physrev.00006.2011",
  },
  "fedorenko-2014-language-domain-specific": {
    id: "fedorenko-2014-language-domain-specific",
    authors: "Fedorenko, E., Duncan, J., & Kanwisher, N.",
    year: 2012,
    title:
      "Language-selective and domain-general regions lie side by side within Broca's area.",
    journal: "Current Biology",
    doi: "10.1016/j.cub.2012.08.011",
  },
  "catani-2005-arcuate-fasciculus": {
    id: "catani-2005-arcuate-fasciculus",
    authors: "Catani, M., Jones, D. K., & Ffytche, D. H.",
    year: 2005,
    title: "Perisylvian language networks of the human brain.",
    journal: "Annals of Neurology",
    doi: "10.1002/ana.20319",
  },
  "hickok-poeppel-2007-dual-stream": {
    id: "hickok-poeppel-2007-dual-stream",
    authors: "Hickok, G., & Poeppel, D.",
    year: 2007,
    title: "The cortical organization of speech processing.",
    journal: "Nature Reviews Neuroscience",
    doi: "10.1038/nrn2113",
  },
  "geschwind-1965-disconnexion-syndromes": {
    id: "geschwind-1965-disconnexion-syndromes",
    authors: "Geschwind, N.",
    year: 1965,
    title: "Disconnexion syndromes in animals and man, Parts I and II.",
    journal: "Brain",
    doi: "10.1093/brain/88.2.237",
  },

  // --- Atlas v1: PCC / Default Mode citations --------------------------
  "raichle-2001-default-mode": {
    id: "raichle-2001-default-mode",
    authors:
      "Raichle, M. E., MacLeod, A. M., Snyder, A. Z., Powers, W. J., Gusnard, D. A., & Shulman, G. L.",
    year: 2001,
    title: "A default mode of brain function.",
    journal: "Proceedings of the National Academy of Sciences",
    doi: "10.1073/pnas.98.2.676",
  },
  "andrews-hanna-2010-default-network-functional": {
    id: "andrews-hanna-2010-default-network-functional",
    authors:
      "Andrews-Hanna, J. R., Reidler, J. S., Sepulcre, J., Poulin, R., & Buckner, R. L.",
    year: 2010,
    title:
      "Functional-anatomic fractionation of the brain's default network.",
    journal: "Neuron",
    doi: "10.1016/j.neuron.2010.02.005",
  },
  "leech-sharp-2014-pcc-role": {
    id: "leech-sharp-2014-pcc-role",
    authors: "Leech, R., & Sharp, D. J.",
    year: 2014,
    title:
      "The role of the posterior cingulate cortex in cognition and disease.",
    journal: "Brain",
    doi: "10.1093/brain/awt162",
  },
  "fransson-2008-pcc-hub": {
    id: "fransson-2008-pcc-hub",
    authors: "Fransson, P., & Marrelec, G.",
    year: 2008,
    title:
      "The precuneus / posterior cingulate cortex plays a pivotal role in the default mode network: evidence from a partial correlation network analysis.",
    journal: "NeuroImage",
    doi: "10.1016/j.neuroimage.2008.05.059",
  },
  "vogt-2005-pcc-anatomy": {
    id: "vogt-2005-pcc-anatomy",
    authors: "Vogt, B. A., Vogt, L., & Laureys, S.",
    year: 2006,
    title:
      "Cytology and functionally correlated circuits of human posterior cingulate areas.",
    journal: "NeuroImage",
    doi: "10.1016/j.neuroimage.2005.07.048",
  },
  "greicius-2003-default-functional-connectivity": {
    id: "greicius-2003-default-functional-connectivity",
    authors: "Greicius, M. D., Krasnow, B., Reiss, A. L., & Menon, V.",
    year: 2003,
    title:
      "Functional connectivity in the resting brain: a network analysis of the default mode hypothesis.",
    journal: "Proceedings of the National Academy of Sciences",
    doi: "10.1073/pnas.0135058100",
  },
  "brewer-2011-meditators-pcc": {
    id: "brewer-2011-meditators-pcc",
    authors: "Brewer, J. A., Worhunsky, P. D., Gray, J. R., Tang, Y.-Y., Weber, J., & Kober, H.",
    year: 2011,
    title:
      "Meditation experience is associated with differences in default mode network activity and connectivity.",
    journal: "Proceedings of the National Academy of Sciences",
    doi: "10.1073/pnas.1112029108",
  },
  "kandel-principles-6e": {
    id: "kandel-principles-6e",
    authors: "Kandel, E. R., Schwartz, J. H., Jessell, T. M., Siegelbaum, S. A., & Hudspeth, A. J. (Eds.)",
    year: 2021,
    title: "Principles of Neural Science (6th edition).",
    journal: "McGraw Hill",
  },
};

export function getCitation(id: string): Citation | undefined {
  return citations[id];
}
