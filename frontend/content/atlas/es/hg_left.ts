/**
 * Heschl's gyrus (left) — Spanish translation.
 * Tier-1 machine-assisted; awaiting native review.
 */

import type { AtlasTranslation } from "../types";

export const hgLeftAtlasEs: AtlasTranslation = {
  fullName: "Giro de Heschl / corteza auditiva primaria (izquierda)",
  disorders: {
    "cortical-deafness": {
      name: "Sordera cortical",
      oneLine:
        "Las lesiones bilaterales de la corteza auditiva primaria producen un déficit llamativo en el que el paciente no oye conscientemente los sonidos a pesar de la audición periférica intacta.",
    },
    "auditory-agnosia": {
      name: "Agnosia auditiva",
      oneLine:
        "Incapacidad selectiva para reconocer sonidos con la audición preservada, típicamente por lesiones que afectan a las regiones auditivas secundarias adyacentes al HG.",
    },
    tinnitus: {
      name: "Acúfenos (tinnitus)",
      oneLine:
        "La reorganización maladaptativa de las representaciones tonotópicas en el HG es uno de los mecanismos neurales propuestos para la percepción persistente de sonido en ausencia de entrada acústica.",
    },
  },
  anatomyAndLandmarks: {
    paragraphs: [
      "El giro de Heschl es el giro temporal transverso que recorre la orilla superior del surco lateral, casi perpendicular al giro temporal superior y parcialmente oculto dentro de la cisura de Silvio. Su posición en la superficie superior del lóbulo temporal hace que no sea visible en la superficie lateral del cerebro intacto — hay que abrir la cisura de Silvio para verlo [cite:da-costa-2011-tonotopy-heschl].",
      "La morfología del giro de Heschl es uno de los rasgos más variables de la anatomía cortical humana. Aproximadamente la mitad de los individuos tienen un único giro de Heschl en cada lado; el resto tienen duplicaciones parciales o completas, con dos giros paralelos o un único giro con un surco longitudinal que lo divide. El estudio de fMRI a alto campo de 2011 de Da Costa et al. estableció que la corteza auditiva primaria abarca ambas divisiones del HG en los casos duplicados — el campo había asumido previamente que la PAC ocupaba solo el giro anterior, y la corrección importa para la interpretación clínica de las lesiones que implican al HG [cite:da-costa-2011-tonotopy-heschl].",
      "La corteza auditiva primaria corresponde al área de Brodmann 41. Recibe la principal entrada cortical del núcleo geniculado medial del tálamo a través de la radiación auditiva, y proyecta a los planum polare y planum temporale circundantes (BA 42 y regiones adyacentes), que constituyen la corteza auditiva secundaria.",
    ],
  },
  functionSection: {
    paragraphs: [
      "El giro de Heschl es la corteza auditiva primaria — la primera región cortical en recibir la entrada auditiva desde el oído a través de la cóclea, los núcleos auditivos del tronco encefálico, el colículo inferior y el geniculado medial. La región está organizada tonotópicamente: distintas frecuencias acústicas activan distintas posiciones a lo largo del giro, con las frecuencias bajas representadas anterolateralmente y las altas posteromedialmente [cite:da-costa-2011-tonotopy-heschl]. El mapa es simétrico en espejo — hay dos mapas tonotópicos primarios dentro del HG, hA1 y hR, que se encuentran en una frontera central de frecuencia — y la misma organización se observa a lo largo de la amplia variación morfológica del propio giro.",
      "Más allá de la tonotopía simple, la corteza auditiva primaria realiza un análisis espectrotemporal temprano: modulaciones temporales rápidas, envolventes espectrales, diferencias finas de tono y las claves binaurales que contribuyen a la audición espacial. Los cómputos de la región son rápidos y en gran medida fieles a la entrada — el tipo de trabajo que sostiene los análisis más elaborados aguas abajo del habla, la música y los sonidos ambientales que realizan las regiones auditivas secundarias y los sistemas de lenguaje y música del lóbulo temporal.",
      "La asimetría izquierda-derecha dentro de la corteza auditiva primaria es modesta pero real. El HG izquierdo está sesgado hacia la resolución temporal fina, que sostiene las rápidas discriminaciones secuenciales necesarias para el procesamiento fonémico; el HG derecho está sesgado hacia una resolución espectral más fina, que sostiene el procesamiento de tono y timbre. Ambos hemisferios reciben entrada auditiva bilateral de cada oído, por lo que el daño unilateral al HG rara vez produce sordera completa — se necesitan lesiones bilaterales para eso.",
      "Esta es una de las regiones del sitio para las que no se ofrece una glosa desde la psicología profunda. La corteza auditiva primaria es maquinaria, fiel y necesaria. La fenomenología del oír — ser interpelado por un sonido, ser conmovido por la música, reconocer una voz — vive una o varias sinapsis aguas abajo. El Atlas honra la distinción: donde el puente con la psicología profunda es honesto, la página lo hace; donde no lo es, la página no se inventa uno.",
    ],
  },
  cellTypesSection: {
    paragraphs: [
      "A diferencia de la mayor parte de la corteza de asociación, la corteza auditiva primaria es corteza granular — tiene una capa IV claramente desarrollada que recibe la proyección talámica del geniculado medial. Este marcador citoarquitectónico es una de las maneras estándar en que se identifican los límites de la corteza sensorial primaria en la neuroanatomía clásica, y distingue al HG de las cortezas disgranulares adyacentes que constituyen las regiones auditivas secundarias [cite:da-costa-2011-tonotopy-heschl].",
      "Las células piramidales de las capas III y V llevan las principales salidas cortico-corticales de la región — a la corteza auditiva secundaria circundante, al hemisferio contralateral a través del cuerpo calloso y (escasamente) al planum temporale y de vuelta al geniculado medial como retroalimentación cortical.",
    ],
  },
  connectionsSection: {
    paragraphs: [
      "La radiación auditiva es la principal vía de entrada al HG, llevando axones desde el núcleo geniculado medial del tálamo hasta la orilla superior del lóbulo temporal. Desde el HG, las conexiones cortico-corticales de corto alcance se abren al planum temporale posteriormente y al planum polare anteriormente — las regiones auditivas secundarias que realizan los cómputos más elaborados sobre la información espectrotemporal que el HG proporciona.",
      "Las conexiones de largo alcance del HG con otras regiones del lóbulo temporal y frontal son en su mayoría indirectas, enrutadas a través de estas regiones auditivas secundarias. En el marco de doble corriente, el HG proporciona la entrada que las corrientes dorsal y ventral elaboran — la corriente dorsal hacia la ruta sonido-articulación a través del STG posterior y el fascículo arqueado hasta Broca, la corriente ventral hacia la ruta sonido-significado a través de la corteza temporal media y el fascículo longitudinal inferior [cite:hickok-poeppel-2007-dual-stream].",
    ],
  },
  clinicalContext: {
    paragraphs: [
      "Las lesiones bilaterales del HG producen sordera cortical — un déficit llamativo en el que el paciente no oye conscientemente los sonidos a pesar de que la cóclea, los núcleos auditivos del tronco encefálico y el tálamo permanecen intactos. La condición es rara porque requiere daño bilateral; las lesiones unilaterales del HG causan alteraciones auditivas más sutiles. La sordera cortical ilustra que la experiencia consciente del oír depende del procesamiento cortical, no de la integridad del aparato auditivo periférico por sí solo.",
      "La agnosia auditiva — incapacidad selectiva para reconocer sonidos (sonidos del habla, sonidos ambientales o ambos) con audición preservada — resulta típicamente de lesiones que afectan a la corteza auditiva secundaria adyacente al HG. La disociación entre sordera cortical (no puede oír) y agnosia auditiva (puede oír pero no puede reconocer) es una de las demostraciones clínicas más limpias de que el oír y el reconocer auditivo son funcionalmente separables.",
      "Los acúfenos — la percepción persistente de sonido en ausencia de fuente externa — se asocian con una gama de anomalías auditivas centrales, incluida la reorganización maladaptativa de las representaciones tonotópicas en el HG. Los acúfenos asociados a pérdida auditiva siguen a menudo a la pérdida de entrada desde regiones cocleares de frecuencia, con la representación cortical de esas frecuencias reasignándose de maneras que pueden subyacer al percepto fantasma.",
    ],
  },
  historyOfDiscovery: {
    paragraphs: [
      "Richard Heschl, anatomista austríaco, describió los giros temporales transversos que ahora llevan su nombre en 1855. El estatus de la región como corteza auditiva primaria se estableció a través de la convergencia de la observación clínica del siglo XIX, el mapeo citoarquitectónico de principios del XX (Brodmann identificó BA 41 como corteza auditiva primaria) y los registros electrofisiológicos de mediados del XX en animales que confirmaron la organización tonotópica.",
      "La imagen contemporánea de la corteza auditiva primaria humana — incluida la corrección de que la PAC abarca ambas divisiones de las morfologías de HG duplicadas — fue establecida por el estudio de fMRI a 7T de alto campo de 2011 de Sandra Da Costa, Melissa Saenz y colegas, que mapeó la tonotopía en sujetos individuales a lo largo de la gama de morfologías comunes del giro de Heschl [cite:da-costa-2011-tonotopy-heschl]. El estudio revisó un supuesto de larga data y aclaró dónde buscar la corteza auditiva primaria en cualquier cerebro individual.",
    ],
  },
};
