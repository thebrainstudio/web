/**
 * Bridges page content — Spanish translation.
 * Tier-1 machine-assisted; awaiting native review.
 *
 * Citation markers [cite:...] and Markdown emphasis (*word*) preserved
 * verbatim so the renderer's parsers keep working.
 */

import type { BridgeSectionId } from "@/lib/bridges";
import type { BridgeSectionContent } from "../sections";

export const bridgeSectionContentEs: Record<BridgeSectionId, BridgeSectionContent> = {
  "what-this-page-is-for": {
    id: "what-this-page-is-for",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "El sitio tiene dos capas intelectuales principales. Una es la neurociencia — la malla cerebral en cada página, el modelo de predicción TRIBE en la sala del Espejo, las veinte regiones del Atlas, las neuronas reconstruidas de la vista celular. La otra es la psicología profunda — la individuación de Jung, el inconsciente en sus elaboraciones psicoanalíticas y junguianas, el hilo contemplativo que recorre los ensayos del Umbral y de los Arquetipos.",
          "No son la misma cosa. La neurociencia y la psicología profunda hablan lenguas distintas, hacen preguntas distintas, y producen tipos distintos de evidencia. Un estudio de fMRI revisado por pares y un diario analítico de sueños de toda una vida son ambos trabajo serio, pero serios en registros distintos. Pretender que son la misma cosa es aplanar a ambas.",
          "Y sin embargo — se tocan. La literatura de investigación contemporánea muestra conexiones reales entre mecanismo neural y observación de psicología profunda [cite:carhart-harris-friston-2010-default-mode-ego]. Las conexiones son específicas. No son metáfora a menos que la página lo diga. No son prueba a menos que la página lo diga. Esta página es un inventario cuidadoso de dónde se encuentran las dos capas.",
          "Cada puente de abajo está calificado contra una escala de cuatro pasos. **Firme** significa correspondencia empírica clara y consenso contemporáneo. **Parcial** significa que la correspondencia es real pero contestada, o limitada a un aspecto del concepto de la psicología profunda. **Distante** significa que las dos lenguas comparten territorio pero el mapeo es laxo; la conexión es sobre todo metáfora o fenomenología. **Ninguno** significa que no existe ningún puente empírico honesto — las dos lenguas se ocupan de preguntas distintas, y eso es apropiado.",
          "El lector verá estas calificaciones como pequeñas insignias al frente de cada sección. Algunas secciones describen puentes fuertes; algunas describen puentes débiles; la sección nueve describe lugares donde no existe puente alguno. Las tres sirven a la honestidad intelectual del sitio. La maniobra más consecuente en esta página es la disposición a nombrar los fallos.",
        ],
      },
    ],
  },

  "dmn-and-self-system": {
    id: "dmn-and-self-system",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "La Red por Defecto es el puente más firme del sitio. Es también, en parte por esa fuerza, el que con más frecuencia se sobreafirma en relatos populares. La versión cuidadosa es la que vale la pena contar.",
          "La imagen funcional en estado de reposo, a finales de los años 90 y comienzos de los 2000, identificó un patrón consistente: un conjunto particular de regiones cerebrales aumentaba de manera fiable su actividad cuando los sujetos descansaban entre tareas experimentales, y la disminuía igualmente de manera fiable cuando llegaba la tarea siguiente [cite:raichle-2001-default-mode]. Antes de que se la nombrara, la señal se trataba como varianza ruidosa — ruido a regresar. La reformulación de esa varianza como un estado de red con sentido abrió veinte años de investigación subsiguiente.",
          "La síntesis canónica es la revisión de 2008 de Buckner, Andrews-Hanna y Schacter, que mapeó la anatomía de la red y sus correlatos conductuales con lo que sigue siendo, casi dos décadas después, la imagen de referencia del campo [cite:buckner-2008-default-network]. Los nodos principales de la red son la corteza prefrontal medial, la corteza cingulada posterior, partes laterales del lóbulo parietal inferior (incluido el giro angular), y el lóbulo temporal medial (incluido el hipocampo). Estudios de conectividad funcional han mostrado que la actividad en estas regiones está correlacionada incluso en reposo, y la fuerza de esas correlaciones predice variables conductuales que van desde la capacidad de memoria autobiográfica hasta la vulnerabilidad al pensamiento rumiativo [cite:andrews-hanna-2010-default-network-functional].",
          "Lo que la red hace, cuando hace algo, es la parte que toca a la psicología profunda. La DMN se recluta de manera fiable durante la recuperación de memoria autobiográfica — la historia sentida de ser un yo en el tiempo. Se recluta durante la evaluación auto-referencial — juzgar si un adjetivo se aplica a uno mismo, por ejemplo [cite:northoff-2006-self-referential-meta]. Se recluta durante la simulación de otras mentes, que la literatura cognitiva llama mentalización y la psicodinámica llama mentalization o la construcción de un modelo interno de trabajo del otro. Se recluta durante el pensamiento prospectivo — imaginar las propias acciones y escenarios futuros. Y se recluta durante la divagación mental, cuando el contenido interno de la conciencia se deja flotar al modo de lo que Jung llamó reverie.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "Las descripciones que Freud hace del yo son consistentes con las funciones del modo-por-defecto y sus intercambios recíprocos con sistemas cerebrales subordinados.",
        attribution: "Carhart-Harris y Friston, 2010, Brain",
      },
      {
        kind: "text",
        paragraphs: [
          "El artículo de 2010 de Robin Carhart-Harris y Karl Friston hace explícito el puente. La DMN, sostienen, ocupa la posición supraordinada en un sistema de inferencia jerárquica cuya dinámica se parece formalmente al relato de Freud sobre el pensamiento de proceso secundario, la función del yo y la prueba de realidad [cite:carhart-harris-friston-2010-default-mode-ego]. Esto no es metáfora. El artículo está en una revista neurológica importante, aborda el marco freudiano directamente, y sus afirmaciones son contrastables.",
          "Lo que el puente no dice es también importante. La DMN es necesaria pero no suficiente para el sistema-yo. Otras redes contribuyen — particularmente la red de saliencia y la red ejecutiva central, con las que la DMN intercambia actividad en dinámicas características. La relación entre la activación de la DMN y la *experiencia* de ser un yo sigue investigándose activamente, y la relación entre el «sistema-yo» empírico y el concepto metafísicamente más amplio de Jung del Sí Mismo está en disputa. Las lecturas más razonables sostienen que la DMN involucra partes de lo que Jung llamó el Sí Mismo — el sistema-yo autobiográfico, el yo simulador — pero no el todo. Las dimensiones transpersonales del Sí Mismo de Jung requieren tratamiento aparte, y la sección nueve de esta página las trata.",
          "Lo que el puente sí dice es que el concepto, en psicología profunda, de un yo-como-construcción-interna ya no es una hipótesis sin correlatos empíricos. La construcción tiene anatomía. La anatomía es la pared cortical medial, la formación hipocampal y el lóbulo parietal inferior. La construcción es parcial. Saber esto no disuelve la experiencia sentida-desde-dentro de ser un yo; complica la pregunta de qué es el yo al mostrar dónde, en parte, está.",
        ],
      },
    ],
  },

  "implicit-cognition-unconscious": {
    id: "implicit-cognition-unconscious",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "La afirmación más amplia que la psicología profunda ha hecho — que la mayor parte de la vida mental sucede fuera de la conciencia — está hoy abrumadoramente respaldada por la neurociencia cognitiva y afectiva. La pregunta interesante es qué *tipo* de inconsciente respalda la evidencia.",
          "El caso empírico empieza con la memoria implícita: los sujetos pueden mostrar efectos conductuales duraderos de exposiciones pasadas que no pueden evocar conscientemente, y la disociación entre memoria implícita y explícita se ha demostrado en muchos paradigmas experimentales y poblaciones clínicas [cite:schacter-1987-implicit-memory]. Lo mismo vale para la cognición social implícita, incluidas actitudes evaluativas que los sujetos no sostienen conscientemente pero expresan de manera consistente en medidas de tiempo de reacción, y para la automaticidad rutinaria del comportamiento cotidiano — la mayor parte de lo que hacemos, la mayor parte del tiempo, se hace sin decisión deliberada [cite:bargh-chartrand-1999-automaticity]. Los enfoques del cerebro como sistema de procesamiento predictivo enmarcan esto como constitutivo y no incidental: el cerebro está corriendo constantemente predicciones inconscientes y actualizándolas frente a la evidencia entrante; la experiencia consciente es un resumen aguas abajo de esa actividad, no su origen.",
          "Todo esto valida la afirmación psicoanalítica amplia sobre el inconsciente. No valida por sí solo la afirmación específicamente freudiana de que hay un inconsciente *dinámicamente* reprimido — contenido mantenido fuera de la conciencia porque el acceso consciente sería amenazador. El inconsciente cognitivo contemporáneo no está, en su mayor parte, reprimido en sentido freudiano; es simplemente cómo el cerebro funciona. El subconjunto específico de la represión es una parte más pequeña y más contestada del cuadro mayor.",
          "La síntesis de 1998 de Drew Westen es la lectura contemporánea estándar: una cantidad enorme de lo que Freud afirmó sobre el inconsciente — que es dinámico, está motivacionalmente estructurado e influye en el pensamiento consciente — ha resistido el escrutinio empírico, incluso aunque la metapsicología freudiana específica no [cite:westen-1998-scientific-legacy-freud]. El cuadro es que las intuiciones psicoanalíticas amplias sobre la estructura de la vida mental eran en buena medida correctas, mientras que la maquinaria teórica freudiana específica (el modelo topográfico tripartito, la libido como energía casi-física, la pulsión de muerte) ha sido revisada o reemplazada.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "Controlar recuerdos no deseados se asoció con mayor activación prefrontal dorsolateral, reducción de la activación del hipocampo y peor retención de esos recuerdos.",
        attribution: "Anderson et al., 2004, Science",
      },
      {
        kind: "text",
        paragraphs: [
          "Sobre la cuestión del olvido motivado en concreto — la afirmación más contestada de Freud — el artículo de 2004 de Michael Anderson y colegas en *Science* demostró correlatos neurales de la supresión voluntaria de la memoria. Los sujetos que intentaban activamente no recordar palabras objetivo mostraron mayor actividad de control prefrontal, menor activación del hipocampo, y un peor recuerdo posterior de esas palabras; tanto los efectos prefrontales como los hipocampales predijeron la magnitud del olvido posterior [cite:anderson-2004-suppression-unwanted]. Esto no es la represión freudiana en sentido fuerte — es supresión voluntaria, no la dinámica inconsciente que Freud describió — pero es el primer correlato neural limpio de un proceso de olvido activo, y no halaga la visión cognitivista estricta de que tal cosa no existe.",
          "Por el lado junguiano, el consenso contemporáneo sobre el inconsciente colectivo es más cauto. La versión fuerte de Jung — que heredamos memorias o imágenes específicas de la experiencia ancestral — no sobrevive al contacto con lo que ahora se sabe sobre heredabilidad y biología del desarrollo. La versión más débil — que heredamos formas o posibilidades de percepción y respuesta, lo que Jung en CW 9i ¶ 155 formuló en realidad — tiene simpatía en el relato de la psicología evolucionista sobre primitivos cognitivos evolucionados, pero la relación es de aire de familia más que de identidad [cite:tooby-cosmides-1992-evolutionary-psychology]. La sección nueve de esta página trata los límites con más detalle.",
        ],
      },
    ],
  },

  "memory-reconstruction": {
    id: "memory-reconstruction",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "Esta es la convergencia más limpia del sitio. La neurociencia de la memoria y la psicología profunda coinciden, de un modo que no requiere traducción: el pasado no es un archivo fijo que se recupera. Se reconstruye, y el acto de recuperación reconfigura la huella.",
          "Por el lado empírico, el momento fundacional es el artículo de 2000 de Karim Nader, Glenn Schafe y Joseph LeDoux en *Nature*. Mostraron que las memorias de miedo consolidadas en ratas, cuando se reactivan mediante recuperación, volvían a un estado lábil que requería nueva síntesis proteica para reconsolidarse. La infusión de un inhibidor de la síntesis proteica en la amígdala tras la recuperación — pero no en ausencia de recuperación — producía amnesia para la memoria [cite:nader-2000-fear-memories-reconsolidation]. La implicación no era sutil: el modelo de larga data de la memoria como consolidación única seguida de almacenamiento estable era erróneo. Cada recuperación es una re-codificación. La huella no es la misma después de ser evocada que antes.",
          "*Los siete pecados de la memoria* de Daniel Schacter sintetizó la evidencia del lado humano: las memorias se distorsionan sistemáticamente por el contexto presente, por información posterior al evento, por las pistas de recuperación, por las preguntas que se le pide a uno hacerse sobre su propio pasado [cite:schacter-2001-seven-sins]. Las décadas de trabajo de Elizabeth Loftus sobre memoria de testigos y la construcción de memorias falsas bajo sugestión construyeron el caso clínico y forense del mismo cuadro. La síntesis de 2006 de Eric Kandel ató el trabajo molecular de vuelta a la escala personal-histórica: en cada nivel, de la sinapsis a la autobiografía, la memoria es reconstrucción [cite:kandel-in-search-of-memory].",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "La consolidación no es un evento único, sino que se reitera con la activación subsiguiente de las memorias.",
        attribution: "Nader, Schafe y LeDoux, 2000, Nature Reviews Neuroscience",
      },
      {
        kind: "text",
        paragraphs: [
          "La versión, en psicología profunda, de la misma observación tiene una historia más larga. La escritura de Jung sobre la psique como reorganizadora del pasado, que recompone el recuerdo al servicio del significado presente, antecede a la literatura empírica en décadas. El *Nachträglichkeit* de Freud — habitualmente traducido como acción diferida o «posteridad» — nombra el mismo fenómeno desde otro ángulo: el pasado se constituye retrospectivamente, desde puntos de vista que el pasado mismo no contenía. El trabajo psicodinámico contemporáneo informado por el apego hace de esto el blanco operativo del cambio terapéutico: «trabajar a través» significa cambiar los modelos internos de trabajo, lo que significa reescribir memorias sentidas.",
          "La implicación cruza ambos campos. La identidad misma es en parte una construcción del momento presente a partir de materiales que el presente reconfigura. Esta es la versión de la memoria que sobrevive a la vez a la literatura empírica y a la tradición de la psicología profunda. Es también la versión que tiene riesgos terapéuticos — si la memoria fuera un archivo fijo, el proyecto de la psicoterapia sería mucho más circunscrito de lo que sus proponentes siempre han sostenido.",
          "Lo que sigue incierto es la aplicación clínica. Si la reconsolidación de memoria intencional — como algunas terapias de trauma afirman lograr — es significativamente distinta de la reconstrucción natural que ocurre en cada recuperación sigue siendo debate. Protocolos específicos que afirman «reescribir» memorias traumáticas tienen evidencia mixta; la ciencia básica es sólida, la traducción clínica todavía no está zanjada. La posición cuidadosa es que la memoria es reconstrucción, que esto importa para la terapia, y que las afirmaciones específicas más fuertes sobre la edición terapéutica de memorias requieren más evidencia de la que hoy está disponible.",
        ],
      },
    ],
  },

  "salience-numinosity": {
    id: "salience-numinosity",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "La red de saliencia — anclada en la ínsula anterior y la corteza cingulada anterior dorsal, con contribuciones subcorticales que incluyen la amígdala — etiqueta los estímulos entrantes por significación emocional y motivacional. El artículo de 2007 de William Seeley y colegas nombró la red y la mostró como funcionalmente disociable del sistema ejecutivo-central: la actividad de saliencia correlacionaba con medidas de ansiedad, la ejecutiva con el desempeño en la tarea [cite:seeley-2007-salience-network]. La firma de la red, en la literatura subsiguiente, es que opera rápido y en gran medida fuera del acceso consciente — el cerebro ya ha decidido que esto importa antes de que la conciencia se entere.",
          "El *numinoso* de Jung nombra una experiencia sentida con fenomenología al menos solapante: el sentido de ser tomado por algo significativo, cargado de sentido antes de que lleguen las palabras. Jung adoptó el término de *La idea de lo santo* de Rudolf Otto (1917), donde Otto lo acuñó para describir la estructura sentida de la experiencia religiosa antes de que se le adhiriera ninguna teología [cite:otto-1917-idea-of-holy]. Tanto Otto como Jung iban tras una categoría fenomenológica, no neural: la experiencia de la significación como algo que llega, no algo que se decide.",
          "El puente es parcial. La activación de la red de saliencia podría subyacer a lo que la psicología profunda llamó el sentido sentido de la significación que llega antes que el pensamiento — la prioridad de la importancia sobre la articulación. La literatura contemporánea sobre evaluación afectiva rápida, con la amígdala como valuadora subcortical veloz, es consistente con ese lado de la descripción de Otto y Jung.",
          "Lo que el puente no captura es la maniobra mayor que Otto y Jung querían hacer. *Numinoso* lleva una dimensión religiosa o cuasi-religiosa — conexión con lo sagrado, lo santo, aquello que está de algún modo no especificable fuera de la experiencia ordinaria — que la red de saliencia no aborda. La red de saliencia maneja «esto importa»; el numinoso, tal como Otto y Jung usaron el término, era «esto importa de una manera que sugiere algo mayor que el asunto mismo». Esa extensión es fenomenología y teología y construcción humana de sentido, no una región cerebral. El puente se sostiene para la capa de *significación sentida* del numinoso. No se sostiene para la capa de *intimación de algo más allá*. Nombrar el ajuste parcial es más honesto que exagerar el ajuste pleno.",
        ],
      },
    ],
  },

  "dmn-deactivation-individuation": {
    id: "dmn-deactivation-individuation",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "Si la activación de la DMN mapea sobre partes del sistema-yo, entonces la *desactivación* de la DMN debería mapear sobre estados alterados del yo. La literatura ha tomado en serio esa hipótesis, y el cuadro empírico es sugerente sin estar cerrado.",
          "Los meditadores de largo plazo muestran reducciones medibles del compromiso de la DMN durante tareas de atención focalizada, con reducciones en la actividad del PCC asociada a la divagación mental, y cambios en la conectividad de la DMN que los distinguen de controles ingenuos a la meditación. El artículo de 2011 de Judson Brewer y colegas es la referencia estándar [cite:brewer-2011-meditators-pcc]. El hallazgo no es que la meditación «apaga» la DMN; es que la relación entre la atención y la DMN es entrenable, y que la práctica de largo plazo cambia esa relación de maneras medibles.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "El rasgo definitorio de los estados primarios es entropía elevada en ciertos aspectos de la función cerebral… la entropía está suprimida en la conciencia despierta normal, lo que significa que el cerebro opera justo por debajo de la criticalidad.",
        attribution: "Carhart-Harris et al., 2014, Frontiers in Human Neuroscience",
      },
      {
        kind: "text",
        paragraphs: [
          "Los psicodélicos clásicos — psilocibina, LSD, DMT — producen cambios en la experiencia del yo que los sujetos describen rutinariamente en un lenguaje que Otto y Jung habrían reconocido. El artículo del «cerebro entrópico» de 2014 de Robin Carhart-Harris y colegas propone que estos estados reflejan un colapso de la organización normalmente jerárquica y de baja entropía de la dinámica cerebral, incluido el papel coordinador de la DMN [cite:carhart-harris-2014-entropic-brain]. El estudio de 2015 de Alexander Lebedev y colegas con psilocibina, usando análisis de conectividad funcional, vinculó las calificaciones de disolución del ego específicamente con la conectividad disminuida entre el lóbulo temporal medial y regiones corticales de alto nivel y con una «desintegración» de la red de saliencia [cite:lebedev-2015-ego-dissolution-psilocybin].",
          "El lado, en psicología profunda, de este puente es la individuación de Jung. Para Jung, la individuación era el proceso de toda una vida de relativizar el ego frente al Sí Mismo mayor — no la destrucción del ego sino su descentramiento, su reconocimiento como una figura en un campo psíquico mayor. Las experiencias de disolución del ego (psicodélicas, contemplativas o — menos seguramente — psicóticas) son, en algunas lecturas, cortes verticales bruscos en lo que la individuación hace despacio. El puente es real. La investigación contemporánea sobre terapia asistida por psicodélicos lo aborda directamente.",
          "Donde el puente no se sostiene del todo es en la equiparación de estados alterados con individuación. La individuación es un proceso de desarrollo de toda una vida, no una experiencia cumbre. Algunas disoluciones del ego psicodélicas se asocian con integración positiva y beneficio duradero; otras con desorganización, ansiedad y secuelas difíciles. La correspondencia con el marco cuidadoso de Jung — en el cual el ego debe permanecer intacto lo suficiente para integrar lo que el encuentro revela — requiere más que datos de desactivación de la DMN. La literatura psicodélica es excitante y todavía preliminar; la posición cuidadosa sostiene la correlación neural básica como bien apoyada y la afirmación mayor sobre la integración de toda una vida como un asunto distinto que la sola imagen cerebral no zanjará.",
        ],
      },
    ],
  },

  "affective-neuroscience-drives": {
    id: "affective-neuroscience-drives",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "Jaak Panksepp pasó cuatro décadas sosteniendo que la vida emocional tiene una arquitectura discreta presente en los mamíferos, y que esta arquitectura es en buena parte subcortical, evolutivamente antigua, y opera sustancialmente fuera del acceso consciente. Su *Affective Neuroscience* (1998) identificó siete procesos primarios: BÚSQUEDA, MIEDO, RABIA, LUJURIA, CUIDADO, PÁNICO/DUELO y JUEGO [cite:panksepp-1998-affective-neuroscience]. Su libro posterior con Lucy Biven extendió el marco y argumentó su consecuencia para la psicopatología y la psicoterapia [cite:panksepp-biven-2012-archaeology-mind].",
          "La relevancia para la psicología profunda es directa, y el programa de neuropsicoanálisis de Mark Solms ha hecho explícito el puente. La teoría tardía de los impulsos de Freud — pulsiones libidinales y agresivas como fuerzas motivacionales primarias — era una intuición estructural sin un cerebro en el que la estructura pudiera vivir. Los siete sistemas de Panksepp aportan una versión empíricamente fundamentada de ese cuadro estructural. BÚSQUEDA, mediada por circuitos dopaminérgicos del VTA al núcleo accumbens, corresponde a lo que la teoría clásica de los impulsos llamó energía libidinal apetitiva y proyectada hacia delante. MIEDO y RABIA corresponden a conceptos psicoanalíticos específicos de ansiedad y agresión. CUIDADO corresponde al apego y al vínculo (enlazando la tradición de Bowlby a la maquinaria subcortical). PÁNICO/DUELO corresponde al distrés de separación, el lecho de roca del apego y la pérdida a lo largo de la vida.",
          "Lo que sobrevive el puente es la intuición básica, en psicología profunda, de que el afecto es fundamental, está estructurado y es en parte preconsciente — de que la vida mental no se construye hacia arriba desde el pensamiento racional sino desde sistemas emocionales más antiguos sobre los cuales el pensamiento es una capa delgada y reciente. Lo que no sobrevive — o sobrevive en forma revisada — es la teoría dual freudiana específica de los impulsos (libido y Tánatos), que el marco de Panksepp no confirma y que la neurociencia afectiva contemporánea trata como un no-mapeo. El concepto tardío freudiano de pulsión de muerte, en particular, no tiene lugar evidente en la arquitectura de Panksepp, y la mayoría de los teóricos psicoanalíticos contemporáneos lo tratan como una afirmación metafísica más que empírica.",
          "Las elaboraciones de psicología profunda más allá del afecto primario — la rica vida simbólico-imaginativa sobre la que construyó Jung — se sitúan una capa por encima. BÚSQUEDA contribuye a la cualidad sentida del inconsciente como una fuerza exploradora que avanza, que es lo que Jung rastreaba cuando escribía sobre la vitalidad de la imaginación activa. CUIDADO contribuye a lo que Jung describió como la presencia sentida de un otro interior. El puente aquí es real, pero es un puente de mecanismo a estructura sentida, no de mecanismo a contenido simbólico. Los símbolos que Jung rastreaba han de entenderse como producciones de un cerebro cuya arquitectura afectiva se entiende ahora mejor — no son reducibles a esa arquitectura.",
        ],
      },
    ],
  },

  "embodied-cognition": {
    id: "embodied-cognition",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "El giro de la cognición encarnada en la ciencia cognitiva ha validado una intuición de larga data de la psicología profunda: la cognición no es manipulación simbólica abstracta, sino que está conformada de principio a fin por la experiencia corporal, la actividad sensoriomotora y la retroalimentación interoceptiva de las vísceras [cite:lakoff-johnson-1999-philosophy-flesh]. *Feeling of What Happens* de Antonio Damasio es la síntesis popular canónica sobre el mismo punto desde la neurociencia [cite:damasio-feeling-of-what-happens]; la revisión de 2017 de Hugo Critchley y Sarah Garfinkel sobre interocepción y emoción es la referencia contemporánea sobre los mecanismos neurales específicos por los cuales el estado corporal moldea la experiencia afectiva y cognitiva [cite:critchley-garfinkel-2017-interoception-emotion].",
          "El lado, en psicología profunda, es más antiguo. La terapia Gestalt, partiendo de la formación de Fritz Perls con Wilhelm Reich y la formación de Reich con Freud, hizo de la conciencia corporal el terreno práctico del trabajo terapéutico. La *armadura de carácter* de Reich era una teoría del cuerpo como portador de defensas — una configuración muscular crónica como registro de la estructura psíquica. Las psicoterapias orientadas al cuerpo que surgieron de este linaje (bioenergética, Hakomi, experiencia somática) toman en serio lo que la literatura contemporánea de cognición encarnada describe ahora mecanísticamente. La visión de Jung del cuerpo como el inconsciente hablando antes de que la mente tenga palabras se sitúa en el mismo territorio.",
          "Damasio acredita específicamente a la tradición fenomenológica y psicoanalítica más amplia por tomar el cuerpo en serio cuando la ciencia cognitiva académica no lo hacía [cite:damasio-feeling-of-what-happens]. La función interoceptiva de la ínsula proporciona un sustrato neural específico para lo que la Gestalt llamó conciencia corporal del momento presente. El complejo vagal proporciona sustrato neural para el trabajo de presencia-calmante que recorre las terapias centradas en la persona, Gestalt y las informadas por trauma.",
          "El puente es parcial más que firme porque la literatura empírica describe mecanismo, mientras que la literatura terapéutica describe mecanismo más práctica más relación más experiencia sentida a lo largo del tiempo. Los hechos neurales validan que el cuerpo no es periférico; las afirmaciones clínicas sobre lo que el trabajo corporal terapéutico hace realmente para quién y bajo qué condiciones son una literatura aparte, más contestada. La posición cuidadosa es que la cognición encarnada le da la razón a la tradición, en psicología profunda, en el punto básico, y que el puente termina ahí.",
        ],
      },
    ],
  },

  "where-bridges-fail": {
    id: "where-bridges-fail",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "Esta es la sección más importante de la página. Una página de puentes que solo celebra conexiones es deshonesta. La maniobra seria es la disposición a nombrar, específicamente y sin disculpa, dónde las dos lenguas no se unen — y a sostenerlo.",
        ],
      },
      {
        kind: "heading",
        text: "Sincronicidad",
      },
      {
        kind: "text",
        paragraphs: [
          "El concepto tardío de Jung — la coincidencia significativa como principio conector acausal — no tiene correlato empírico. La fenomenología de la coincidencia significativa es real (el reconocimiento de patrones, el sesgo de confirmación y la apofenia activan territorio relacionado), pero la afirmación metafísica específica de Jung sobre la conexión acausal no es falsable en ningún marco científico actual. Veredicto: ningún puente. El tema sigue siendo filosófico, no empírico. Tratarlo como otra cosa deshonra a ambos lados.",
        ],
      },
      {
        kind: "heading",
        text: "El inconsciente colectivo como memoria heredada literal",
      },
      {
        kind: "text",
        paragraphs: [
          "La versión fuerte del inconsciente colectivo — que heredamos memorias o imágenes específicas de la experiencia ancestral — no tiene respaldo empírico. La heredabilidad de contenido cognitivo específico de ese tipo es inconsistente con lo que ahora se sabe sobre biología del desarrollo. La versión más débil, la que la formulación cuidadosa de Jung en CW 9i ¶ 155 sostiene en realidad — que heredamos *formas* o *posibilidades* de percepción y respuesta — tiene simpatía en el relato de la psicología evolucionista sobre primitivos cognitivos evolucionados [cite:tooby-cosmides-1992-evolutionary-psychology]. Pero la distinción fuerte/débil importa, y muchos escritos junguianos populares la colapsan. Veredicto: puente distante para la versión débil; ningún puente para la versión fuerte.",
        ],
      },
      {
        kind: "heading",
        text: "Contenidos arquetípicos específicos (el Viejo Sabio, el Ánima, el Trickster)",
      },
      {
        kind: "text",
        paragraphs: [
          "Son categorías clínicas y literarias útiles. No se mapean sobre regiones cerebrales ni sistemas neurales específicos, y el intento de encontrar tales mapeos sería un error de categoría. Los contenidos arquetípicos son organizaciones de imagen y función narrativa que recurren a través de culturas porque son organizaciones útiles, no porque estén almacenadas en alguna parte como tales. Veredicto: categoría de la psicología profunda, no categoría neurocientífica. Las dos lenguas hacen aquí trabajos distintos.",
        ],
      },
      {
        kind: "heading",
        text: "La imaginación activa como práctica transformadora",
      },
      {
        kind: "text",
        paragraphs: [
          "El método específico de Jung de diálogo consciente con figuras inconscientes es una práctica clínica y de desarrollo con una fenomenología rica como para llenar el *Libro Rojo*. Algunas investigaciones adyacentes sobre imaginación y pensamiento prospectivo — el trabajo de Daniel Schacter sobre la hipótesis de la simulación episódica constructiva, por ejemplo — tocan el territorio, pero no existe investigación empírica directa de la imaginación activa como práctica transformadora a escala clínica. Veredicto: puente distante. La fenomenología es rica; el mecanismo no está claro.",
        ],
      },
      {
        kind: "heading",
        text: "La síntesis mística-religiosa tardía de Jung (Aion, Mysterium Coniunctionis)",
      },
      {
        kind: "text",
        paragraphs: [
          "Estas obras abordan la teología cristiana, la alquimia, el gnosticismo y la cuestión de lo divino en la psique. La neurociencia no aborda esas preguntas, y no es un fallo de ninguno de los campos que sea así. Veredicto: ningún puente. Las dos lenguas se ocupan aquí de preguntas distintas, y la respuesta correcta es dejarlas en sus respectivos territorios.",
        ],
      },
      {
        kind: "heading",
        text: "El Sí Mismo como concepto transpersonal de Jung",
      },
      {
        kind: "text",
        paragraphs: [
          "El puente de la DMN (sección dos) captura parte de lo que Jung llamó el Sí Mismo — específicamente, el sistema-yo, el yo autobiográfico y simulador que la literatura empírica ha descrito ahora sustancialmente. No captura la afirmación metafísica más amplia de Jung de que el Sí Mismo es la totalidad de la psique, de la cual la conciencia es una parte, incluidas las dimensiones transpersonales. Veredicto: puente parcial para el Sí Mismo psicológico; ningún puente para el Sí Mismo transpersonal. Confundir lo primero con lo segundo es la forma más común de sobreafirmación en relatos populares de este material.",
        ],
      },
      { kind: "rule" },
      {
        kind: "text",
        paragraphs: [
          "El marco para toda esta sección: estos fallos no son fallos de ninguno de los campos. Son reconocimientos honestos de que la psicología profunda y la neurociencia abordan dominios solapados pero distintos. Algunas preguntas son contestables por mecanismo. Algunas son contestables por fenomenología. Algunas requieren ambos. Algunas no requieren ninguno — son filosóficas, espirituales o simplemente humanas en maneras que ningún método científico captura. Nombrar lo que no une es la disciplina que mantiene honestos los puentes que sí se sostienen.",
        ],
      },
    ],
  },

  "how-to-read-the-site": {
    id: "how-to-read-the-site",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "Una guía para el lector. El sitio no es una sola línea de argumento; es una red. La página de Puentes está en el centro, pero ninguna página del sitio es la última palabra.",
          "Donde una página del Atlas de regiones menciona un concepto de psicología profunda, el puente relevante ha sido calificado y una tarjeta en la sección del Hilo nombra esa calificación. Haz clic en la tarjeta para aterrizar en la sección correspondiente aquí. Donde una página de psicología profunda menciona neurociencia, la referencia cruzada apunta en dirección inversa.",
          "El sitio no sostiene que la neurociencia reduzca la psicología profunda a mecanismo. No sostiene que la psicología profunda flote libre del mecanismo. Sostiene ambas lenguas como parciales. El mecanismo es parcial porque el mecanismo por sí solo no dice para qué sirve el mecanismo, ni cómo se siente desde dentro. La fenomenología es parcial porque la fenomenología por sí sola puede describir una experiencia sin decir qué la sustenta ni por qué se generaliza.",
          "La maniobra más difícil es sostener ambas lenguas a la vez sin colapsar una en la otra. La página de Puentes es un inventario de dónde se ha visto que las dos se tocan — y un inventario de dónde no.",
        ],
      },
    ],
  },

  "closing-reflection": {
    id: "closing-reflection",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "El problema de las dos culturas en psicología — la profundidad psicoanalítica por un lado, la neurociencia cognitiva y afectiva por el otro — no es una disputa que se resolverá con la victoria de alguno de los lados. Mecanismo y sentido son tipos distintos de relatos, y las mentes son el tipo de cosas que pueden abordarse por ambos sin agotar a ninguno.",
          "Lo que los últimos veinticinco años de investigación empírica han hecho es volver la conversación más interesante. El psicoanálisis ha acumulado evidencia propia — investigación clínica de procesos, investigación del apego, evidencia de la psicoterapia psicodinámica como tratamiento — y una síntesis cuidadosa de las afirmaciones de Freud frente a los hallazgos contemporáneos muestra sustancialmente más vigencia de la que permitió la desestimación cognitivista de los años setenta [cite:westen-1998-scientific-legacy-freud]. La neurociencia ha descubierto que la vida emocional y el procesamiento inconsciente no son preocupaciones vestigiales sino arquitectura central, y que el resto de la cognición se construye encima de ellas y no alrededor. La investigación de la Red por Defecto ha dado al sistema-yo un relato neural parcial. La neurociencia afectiva ha proporcionado la arquitectura emocional del cerebro con detalle subcortical. La ciencia de la memoria ha mostrado que el pasado es reconstrucción en cada escala, de la sinapsis a la autobiografía.",
          "Nada de esto prueba que Freud o Jung tuvieran razón. Todo ello complica la desestimación informal que los declaró muertos hace una generación. La versión de la psicología profunda que sobrevive a la literatura empírica es una versión escarmentada — que no flota libre de la biología, que no reclama mecanismos que no puede sustentar, y que no necesita hacerlo. La versión de la neurociencia que sobrevive al contacto con la tradición de la psicología profunda es la que no se acobarda ante nombrar lo que está estudiando, incluso cuando lo que está estudiando es lo que la mente es.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "La mente que estudiamos es la mente que está estudiando. Preguntar qué son las mentes con un solo lenguaje es preguntar media pregunta. El trabajo serio está en preguntar las dos.",
        attribution: "The Brain Studio",
      },
    ],
  },
};
