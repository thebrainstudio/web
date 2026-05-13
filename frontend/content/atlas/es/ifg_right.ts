/**
 * Right inferior frontal gyrus — Spanish translation.
 * Tier-1 machine-assisted; awaiting native review.
 */

import type { AtlasTranslation } from "../types";

export const ifgRightAtlasEs: AtlasTranslation = {
  fullName: "Giro frontal inferior derecho",
  disorders: {
    aprosodia: {
      name: "Aprosodia motora",
      oneLine:
        "El daño al IFG derecho produce un aplanamiento de la prosodia del habla — las palabras siguen produciéndose pero la melodía afectiva y gramatical de la voz se reduce notablemente.",
    },
    "adhd-inhibition": {
      name: "TDAH y trastornos del control inhibitorio",
      oneLine:
        "La menor participación del IFG derecho durante tareas de señal de detención sigue los déficits de inhibición de respuesta característicos del trastorno por déficit de atención con hiperactividad.",
    },
  },
  anatomyAndLandmarks: {
    paragraphs: [
      "El giro frontal inferior derecho refleja anatómicamente a su homólogo del hemisferio izquierdo: pars opercularis posterior (BA 44), pars triangularis media (BA 45) y pars orbitalis anterior (BA 47) a lo largo del lóbulo frontal inferior. La citoarquitectura es esencialmente simétrica entre hemisferios; la asimetría funcional es una cuestión de con qué redes está acoplado cada lado con más fuerza [cite:amunts-1999-brodmann-44-45].",
      "Dentro de la neurociencia de redes, el IFG derecho es un nodo de la red de atención ventral y del sistema de control frontoparietal más amplio. Su posición en la unión de atención, lenguaje y control motor le da a la región su carácter multifuncional.",
    ],
  },
  functionSection: {
    paragraphs: [
      "El IFG derecho es más conocido por dos contribuciones. La primera es la prosodia — la capa melódica, rítmica y afectiva del habla. El daño aquí produce aprosodia motora: las palabras salen planas, el ascenso y descenso natural de la entonación colapsa, y la voz del hablante pierde las claves afectivas por las que se transmite la mayor parte del significado cotidiano [cite:hagoort-2014-language-architecture]. El síndrome clínico complementario de aprosodia receptiva, por daño al pSTG derecho, produce una alteración en *reconocer* la prosodia — el paciente puede oír las palabras pero no puede saber si el hablante está preguntando, ordenando o lamentándose.",
      "La segunda contribución es el control cognitivo, particularmente la inhibición de respuesta. El IFG derecho es consistentemente el sitio cortical más fuertemente reclutado durante las tareas de señal de detención y go/no-go — paradigmas en los que el participante debe retener o cancelar una respuesta planificada. El papel aquí no es específico del lenguaje; se generaliza a la inhibición de cualquier acción motora, y puede extenderse a la inhibición de pensamientos y recuerdos no deseados. El artículo de 2004 de Anderson en *Science* sobre los correlatos neurales del olvido motivado identificó una mayor activación prefrontal (que incluye el territorio del IFG derecho) durante la supresión de recuerdos no deseados [cite:anderson-2004-suppression-unwanted].",
      "Más allá de la prosodia y la inhibición, el IFG derecho se recluta durante la comprensión del lenguaje figurado — ironía, metáfora, sarcasmo — que requiere inferir lo que el hablante quiere decir más allá de lo que dice literalmente. La participación conjunta de la región en lenguaje, atención y control inhibitorio la sitúa en la intersección de sistemas cognitivos cuya interacción es parte de lo que la comunicación social fluida requiere.",
    ],
  },
  cellTypesSection: {
    paragraphs: [
      "La citoarquitectura del IFG derecho es esencialmente simétrica con la del IFG izquierdo — corteza de asociación de seis capas dominada por neuronas piramidales glutamatérgicas de las capas III y V, con la infraestructura inhibitoria característica de la corteza frontal. Las diferencias hemisféricas en función reflejan diferencias en conectividad más que diferencias en la composición celular local [cite:amunts-1999-brodmann-44-45].",
    ],
  },
  connectionsSection: {
    paragraphs: [
      "El fascículo arqueado derecho es generalmente más pequeño y menos lateralizado de manera consistente que su contraparte izquierda, con una notable variación entre individuos — algunos hemisferios derechos muestran un fascículo arqueado robusto, otros muestran solo un haz vestigial o dividido [cite:catani-2005-arcuate-fasciculus]. Esta asimetría importa: es parte de por qué el lenguaje está lateralizado a la izquierda en la mayoría de las personas diestras pero no del todo, y parte de por qué la recuperación del lenguaje tras un ictus depende de la integridad de las vías del hemisferio derecho que pueden compensar parcialmente.",
      "Las principales conexiones del IFG derecho dentro de su territorio más fiable son con la corteza temporal anterior derecha (fascículo uncinado), la corteza parietal inferior derecha (fascículo longitudinal superior) y (a través del cuerpo calloso) su contraparte del hemisferio izquierdo. Estas vías transportan la información prosódica y de comprensión figurativa que la región elabora.",
    ],
  },
  clinicalContext: {
    paragraphs: [
      "La aprosodia motora tras un ictus del hemisferio derecho es el síndrome clínico que estableció el papel del IFG derecho en la prosodia. Los pacientes producen frases gramaticalmente correctas pero en monótono, con la estructura prosódica natural de la voz aplanada o ausente. La condición es una de las demostraciones más limpias de que la prosodia no es meramente una característica estilística del habla sino una función separable con su propio sustrato neural.",
      "En el TDAH y en los trastornos más amplios del control inhibitorio, la menor participación del IFG derecho durante las tareas de señal de detención está entre los hallazgos de imagen funcional más replicados. La traducción a la práctica clínica ha sido una de las áreas más productivas de la psiquiatría informada por la neurociencia cognitiva, con intervenciones de entrenamiento cognitivo dirigidas a la red de control inhibitorio que muestran efectos modestos pero reales.",
      "En la recuperación de la afasia post-ictus, la capacidad del IFG derecho para sostener una función lingüística parcial depende de la integridad de las vías del hemisferio derecho y de si la organización lingüística pre-ictus del paciente estaba fuertemente lateralizada a la izquierda. La implicación clínica es que la misma lesión produce trayectorias de recuperación diferentes según la organización hemisférica de base.",
    ],
  },
  historyOfDiscovery: {
    paragraphs: [
      "El IFG derecho fue pasado por alto durante la mayor parte del siglo XX porque la región de Broca contralateral cargaba con la historia dominante del lenguaje. El cambio comenzó con el artículo de 1981 de Elliott Ross que describía los síndromes de aprosodia tras lesiones del hemisferio derecho — una observación clínica que dio al IFG derecho su primer relato funcional explícito.",
      "La imagen contemporánea ha surgido a partir de la imagen funcional en tareas de control cognitivo (notablemente el trabajo de Adrian Owen y Adam Aron a principios de los 2000 sobre el IFG derecho y la inhibición de respuesta), la síntesis de *Master and His Emissary* de Iain McGilchrist sobre las contribuciones del hemisferio derecho al pensamiento, y los modelos integrados de la red del lenguaje en los que Hagoort y otros han dado a la región un lugar coherente [cite:hagoort-2014-language-architecture] [cite:mcgilchrist-master-emissary].",
    ],
  },
};
