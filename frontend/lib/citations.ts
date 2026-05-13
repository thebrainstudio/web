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
};

export function getCitation(id: string): Citation | undefined {
  return citations[id];
}
