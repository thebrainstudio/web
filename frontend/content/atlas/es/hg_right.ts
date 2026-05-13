/**
 * Right Heschl's gyrus — Spanish translation.
 * Tier-1 machine-assisted; awaiting native review.
 */

import type { AtlasTranslation } from "../types";

export const hgRightAtlasEs: AtlasTranslation = {
  fullName: "Giro de Heschl derecho / corteza auditiva primaria",
  disorders: {
    "amusia-acquired": {
      name: "Amusia adquirida",
      oneLine:
        "El daño a la corteza auditiva primaria y secundaria derecha produce alteraciones selectivas de la percepción del tono y la melodía con una comprensión del habla relativamente preservada.",
    },
    "absolute-pitch-anatomy": {
      name: "Oído absoluto (correlato anatómico)",
      oneLine:
        "Los músicos con oído absoluto muestran un mayor volumen del giro de Heschl derecho respecto a músicos sin él, consistente con el sesgo del hemisferio derecho hacia el procesamiento espectral.",
    },
  },
  anatomyAndLandmarks: {
    paragraphs: [
      "El giro de Heschl derecho refleja a su homólogo izquierdo en la anatomía gruesa — el giro temporal transverso que recorre la orilla superior del surco lateral, con la corteza auditiva primaria (BA 41) ocupando su porción medial y las regiones auditivas secundarias del planum polare y planum temporale extendiéndose alrededor [cite:da-costa-2011-tonotopy-heschl]. La variación morfológica es la misma que en el lado izquierdo: algunos individuos tienen un único giro de Heschl en cada lado; otros tienen duplicaciones parciales o completas, con dos giros paralelos.",
      "El estudio de fMRI a 7T de alto campo de 2011 de Da Costa y colegas estableció que la corteza auditiva primaria abarca ambas divisiones del HG en casos duplicados en ambos lados, mostrando los mapas tonotópicos la organización simétrica en espejo (hA1 y hR encontrándose en una frontera central de frecuencia) a lo largo de toda la gama de variación morfológica [cite:da-costa-2011-tonotopy-heschl]. La asimetría anatómica entre hemisferios es sutil en términos gruesos pero visible en el espaciado de columnas corticales y en la microestructura de la sustancia blanca.",
    ],
  },
  functionSection: {
    paragraphs: [
      "El HG derecho realiza los mismos cómputos tonotópicos y espectrotemporales que su homólogo izquierdo, pero con un sesgo hacia la resolución espectral fina a expensas de la resolución temporal fina. El estudio PET de Zatorre y Belin de 2001 estableció el relato canónico de esta asimetría: la corteza auditiva izquierda se especializa para el procesamiento temporal rápido (que sostiene las discriminaciones secuenciales del procesamiento fonémico), mientras que la corteza auditiva derecha se especializa para el procesamiento espectral fino (que sostiene el tono, el timbre y el contorno de la melodía) [cite:zatorre-belin-2001-spectral-temporal].",
      "La consecuencia funcional es que el HG derecho se recluta con más fuerza que el HG izquierdo durante el procesamiento musical del tono, la discriminación tímbrica y la percepción de la identidad de la voz. La asimetría es parcial — ambos hemisferios hacen ambas cosas, y las demostraciones más limpias provienen de casos de lesión con daño unilateral selectivo — pero es lo bastante fiable como para sustentar una porción sustancial de la especialización del hemisferio derecho para la música y la capa afectiva de la voz.",
      "Como su homólogo izquierdo, el HG derecho es una de las regiones del sitio para las que no se ofrece una glosa desde la psicología profunda. El análisis espectral que realiza es maquinaria, fiel y necesaria; el significado que llega aguas abajo — el sentido sentido de una pieza musical, el reconocimiento de una voz familiar, la cualidad numinosa de una canción que te atrapa — vive en las regiones corticales y subcorticales a las que el HG envía su salida, no en el HG mismo. El Atlas honra la distinción.",
    ],
  },
  cellTypesSection: {
    paragraphs: [
      "El HG derecho es corteza granular, como su homólogo izquierdo — una capa IV claramente desarrollada recibe la proyección talámica del geniculado medial. La composición de clases celulares es aproximadamente simétrica entre hemisferios; la asimetría funcional refleja diferencias sutiles en la microestructura cortical (espaciado de columnas, patrones de mielinización) y en la conectividad de largo alcance [cite:zatorre-belin-2001-spectral-temporal] [cite:da-costa-2011-tonotopy-heschl].",
    ],
  },
  connectionsSection: {
    paragraphs: [
      "El HG derecho recibe la principal entrada cortical auditiva a través de la radiación auditiva derecha del núcleo geniculado medial del tálamo. Las conexiones cortico-corticales de corto alcance se abren al planum temporale y al planum polare circundantes; las conexiones de largo alcance con otras regiones del lóbulo temporal y frontal son en buena parte indirectas, enrutadas a través de estas regiones auditivas secundarias [cite:kell-2018-auditory-task-network].",
      "Las conexiones callosas con el HG izquierdo sostienen la integración binaural que subyace a la localización de la fuente sonora y la coordinación entre hemisferios requerida para el análisis espectrotemporal fino.",
    ],
  },
  clinicalContext: {
    paragraphs: [
      "La amusia adquirida tras un ictus del hemisferio derecho que afecta a la corteza auditiva primaria y secundaria es la demostración clínica más limpia de la especialización del hemisferio derecho para la música. Los pacientes con tales lesiones muestran alteraciones selectivas de la percepción del tono y la melodía mientras que su comprensión del habla permanece relativamente intacta — pueden oír y entender el lenguaje pero ya no pueden distinguir melodías familiares ni detectar violaciones de contorno melódico [cite:zatorre-belin-2001-spectral-temporal].",
      "El oído absoluto — la capacidad de identificar un tono musical de forma aislada sin una referencia — se asocia con diferencias anatómicas en el HG derecho. Los músicos con oído absoluto muestran mayores volúmenes del giro de Heschl derecho que los músicos sin él, consistentes con el sesgo del hemisferio derecho hacia el procesamiento espectral. La direccionalidad (¿agranda el entrenamiento la estructura, o la estructura permite la habilidad?) se debate; ambas contribuciones son probables.",
      "El daño bilateral a la corteza auditiva primaria produce sordera cortical, como se describe en la página de HG-L. El daño unilateral del HG derecho produce déficits auditivos más sutiles inclinados hacia alteraciones del procesamiento espectral y de la percepción musical.",
    ],
  },
  historyOfDiscovery: {
    paragraphs: [
      "La asimetría hemisférica en la corteza auditiva primaria y secundaria se describió clínicamente a finales del siglo XIX y principios del XX, principalmente a través de observaciones de que las lesiones del hemisferio derecho alteraban desproporcionadamente la percepción musical, mientras que las del izquierdo alteraban desproporcionadamente el lenguaje. El relato contemporáneo de imagen funcional se ancla en el estudio PET de Zatorre y Belin de 2001 que demuestra las especializaciones espectral y temporal complementarias entre hemisferios [cite:zatorre-belin-2001-spectral-temporal].",
      "El estudio de fMRI a 7T de 2011 de Da Costa y colegas estableció la imagen moderna anatómico-funcional de la corteza auditiva primaria en ambos hemisferios, confirmando que la misma organización tonotópica simétrica en espejo se mantiene en la derecha como en la izquierda a lo largo de toda la gama de variación morfológica del giro de Heschl [cite:da-costa-2011-tonotopy-heschl].",
    ],
  },
};
