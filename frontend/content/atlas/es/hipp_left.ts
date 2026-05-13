/**
 * Hippocampus (left) — Spanish translation.
 * Tier-1 machine-assisted; awaiting native review.
 */

import type { AtlasTranslation } from "../types";

export const hippLeftAtlasEs: AtlasTranslation = {
  fullName: "Hipocampo (izquierdo)",
  disorders: {
    alzheimers: {
      name: "Enfermedad de Alzheimer",
      oneLine:
        "Entre las primeras regiones corticales donde aparecen los ovillos neurofibrilares; la pérdida de volumen se correlaciona con la alteración de la memoria.",
    },
    ptsd: {
      name: "Trastorno por estrés postraumático",
      oneLine:
        "El volumen hipocampal reducido se observa consistentemente en el TEPT; la dirección de la causalidad sigue debatida.",
    },
    amnesia: {
      name: "Amnesia anterógrada (tipo temporal medial)",
      oneLine:
        "El daño hipocampal bilateral produce la incapacidad canónica para formar nuevas memorias declarativas.",
    },
    "temporal-lobe-epilepsy": {
      name: "Epilepsia del lóbulo temporal",
      oneLine:
        "El hipocampo es el foco de crisis más común en la epilepsia focal del adulto; la esclerosis hipocampal es un hallazgo histopatológico frecuente.",
    },
  },
  anatomyAndLandmarks: {
    paragraphs: [
      "El hipocampo es una estructura curvada anidada en el lóbulo temporal medial, nombrada por su parecido con un caballito de mar. En sección coronal muestra la arquitectura en capas que da a la región sus subdivisiones precisas — el giro dentado, el cornu ammonis (CA1, CA2, CA3, CA4) y el subículo — envueltos alrededor de una única capa densa de neuronas piramidales [cite:amaral-lavenex-2007-hippocampus-anatomy].",
      "El hipocampo izquierdo se sitúa bajo el giro parahipocampal, lateral al tronco encefálico y medial al cuerno temporal del ventrículo lateral. Su principal haz eferente, el fórnix, se arquea hacia adelante hasta los cuerpos mamilares y el tálamo anterior. Las entradas llegan a través de la corteza entorrinal por la vía perforante.",
    ],
  },
  functionSection: {
    paragraphs: [
      "El hipocampo participa centralmente en la codificación de nuevas memorias episódicas — el registro autobiográfico de los eventos a medida que ocurren — y en ligar esos eventos a los lugares, tiempos y contextos en que ocurren [cite:squire-1992-medial-temporal-lobe]. El daño aquí produce una disociación llamativa: las habilidades y los hábitos adquiridos antes de la lesión permanecen disponibles, y se pueden aprender nuevas habilidades motoras, pero la evocación deliberada y rica en escenas de eventos personales recientes se vuelve imposible [cite:scoville-milner-1957-hm].",
      "Más allá de la memoria, la misma circuitería sostiene la cognición espacial. Los registros de células únicas en roedores revelaron neuronas que se disparan cada vez que el animal ocupa una ubicación particular en su entorno — «células de lugar» — y la imagen humana confirma un papel homólogo en la construcción de mapas cognitivos [cite:okeefe-dostrovsky-1971-place-cells]. El famoso estudio de taxistas de Londres encontró que el volumen del hipocampo posterior aumentaba con los años de navegar por las calles irregulares de la ciudad, sugiriendo un cambio estructural dependiente del uso en cerebros adultos [cite:maguire-2000-taxi-drivers].",
      "El trabajo reciente ha reencuadrado al hipocampo no como un almacén pasivo sino como un motor constructivo: el mismo circuito que recupera una escena pasada es reclutado cuando se imagina una posible escena futura o un pasado contrafáctico [cite:schacter-addis-2007-constructive-episodic]. La memoria y la imaginación comparten maquinaria, lo que es parte de por qué las memorias no son grabaciones estables — cada recuperación reescribe ligeramente la huella.",
      "La asimetría hemisférica dentro del hipocampo es real pero no debería sobrestimarse. El hipocampo izquierdo se recluta más consistentemente para material episódico verbal; el derecho para memoria espacial y basada en escenas. Ambos contribuyen al recordar cotidiano.",
    ],
  },
  cellTypesSection: {
    paragraphs: [
      "El cómputo hipocampal está organizado alrededor de tres clases principales de células excitatorias. Las células granulares del giro dentado reciben entrada de la corteza entorrinal y proyectan a CA3; las colaterales recurrentes de las neuronas piramidales de CA3 son el sustrato manual de la evocación autoasociativa; las neuronas piramidales de CA1 reciben la salida de CA3 (colaterales de Schaffer) y la entrada entorrinal directa, y forman la salida principal de la formación hipocampal [cite:amaral-lavenex-2007-hippocampus-anatomy].",
      "La vista celular contiene morfologías reconstruidas de neuronas piramidales de CA1 y CA3 y de células granulares del giro dentado de los archivos abiertos, incluida la colección NeuroMorpho.org. Desciende a la capa celular para ver la geometría dendrítica detrás de la señal a nivel de población que se muestra aquí.",
    ],
  },
  connectionsSection: {
    paragraphs: [
      "El hipocampo se comunica con el resto del cerebro a través de un pequeño número de haces de sustancia blanca bien descritos. La vía perforante lleva información desde la capa II de la corteza entorrinal al giro dentado y a los campos CA — la principal entrada cortical. El fórnix es la salida dominante, proyectando a los cuerpos mamilares, el tálamo anterior y los núcleos septales, y a través de estos a objetivos corticales generalizados [cite:amaral-lavenex-2007-hippocampus-anatomy].",
      "Funcionalmente, el hipocampo participa en la red por defecto durante la recuperación de memoria y la imaginación del futuro, acoplándose especialmente con la corteza cingulada posterior y el giro angular [cite:buckner-2008-default-network]. Durante la codificación, la entrada saliente desde la amígdala realza la consolidación, que es uno de los mecanismos por los que los eventos cargados emocionalmente se recuerdan más vívidamente que los neutros.",
    ],
  },
  clinicalContext: {
    paragraphs: [
      "La enfermedad de Alzheimer comienza, según algunos relatos, aquí. Los ovillos neurofibrilares y la pérdida sináptica aparecen en la corteza entorrinal y el hipocampo años antes del diagnóstico clínico, y la atrofia hipocampal es uno de los biomarcadores estructurales más fiables de enfermedad temprana [cite:small-2011-hippocampal-circuit-disorders]. Las quejas tempranas de memoria — olvidar conversaciones recientes, los nombres de nuevos conocidos — siguen la patología regional más de cerca que los síntomas posteriores, más globales.",
      "En el trastorno por estrés postraumático, se ha reportado un volumen hipocampal reducido a lo largo de muchos estudios de imagen, pero la dirección de la causalidad sigue siendo controvertida: los hipocampos más pequeños pueden ser un factor de riesgo preexistente, una consecuencia del estrés crónico, o ambos. La literatura aquí está genuinamente sin resolver, y la lectura cuidadosa es que la asociación es robusta pero aún no un mecanismo.",
      "La epilepsia del lóbulo temporal tiene frecuentemente al hipocampo como foco de crisis, con la esclerosis hipocampal como hallazgo histológico común. La fenomenología de las crisis del lóbulo temporal — déjà vu, afecto intenso no provocado, fragmentos de escena — refleja las estructuras implicadas.",
    ],
  },
  historyOfDiscovery: {
    paragraphs: [
      "La comprensión moderna de la función hipocampal comienza con un paciente: Henry Molaison (conocido en la literatura solo como H.M. hasta su muerte en 2008), quien en 1953 se sometió a una lobectomía temporal medial bilateral en un intento de controlar una epilepsia intratable. La cirugía lo dejó con una amnesia anterógrada profunda y estable que William Beecher Scoville y Brenda Milner describieron en 1957 [cite:scoville-milner-1957-hm].",
      "Su inteligencia preservada, memoria a corto plazo intacta y capacidad para aprender nuevas habilidades motoras hicieron imposible descartar al hipocampo como un almacén genérico de memoria y forzaron al campo a desarrollar la visión de múltiples sistemas de memoria con la que aún trabajamos [cite:squire-1992-medial-temporal-lobe]. El descubrimiento de John O'Keefe de las células de lugar en el hipocampo del roedor en 1971 añadió la dimensión espacial que completó la imagen moderna [cite:okeefe-dostrovsky-1971-place-cells].",
    ],
  },
};
