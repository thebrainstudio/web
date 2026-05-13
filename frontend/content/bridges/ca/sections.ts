/**
 * Bridges page content — Catalan translation.
 * Tier-1 machine-assisted; awaiting native review.
 */

import type { BridgeSectionId } from "@/lib/bridges";
import type { BridgeSectionContent } from "../sections";

export const bridgeSectionContentCa: Record<BridgeSectionId, BridgeSectionContent> = {
  "what-this-page-is-for": {
    id: "what-this-page-is-for",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "El lloc té dues capes intel·lectuals principals. Una és la neurociència — la malla cerebral a cada pàgina, el model de predicció TRIBE a la sala del Mirall, les vint regions de l'Atles, les neurones reconstruïdes de la vista cel·lular. L'altra és la psicologia profunda — la individuació de Jung, l'inconscient en les seves elaboracions psicoanalítiques i junguianes, el fil contemplatiu que recorre els assaigs del Llindar i dels Arquetips.",
          "No són la mateixa cosa. La neurociència i la psicologia profunda parlen llengües diferents, fan preguntes diferents, i produeixen tipus diferents d'evidència. Un estudi d'fMRI revisat per parells i un diari analític de somnis de tota una vida són tots dos un treball seriós, però seriosos en registres diferents. Pretendre que són la mateixa cosa és aplanar-les totes dues.",
          "I tanmateix — es toquen. La literatura de recerca contemporània mostra connexions reals entre mecanisme neural i observació de psicologia profunda [cite:carhart-harris-friston-2010-default-mode-ego]. Les connexions són específiques. No són metàfora si la pàgina no ho diu. No són prova si la pàgina no ho diu. Aquesta pàgina és un inventari curós d'on les dues capes es troben.",
          "Cada pont de baix és qualificat contra una escala de quatre passos. **Ferm** significa correspondència empírica clara i consens contemporani. **Parcial** significa que la correspondència és real però contestada, o limitada a un aspecte del concepte de psicologia profunda. **Distant** significa que les dues llengües comparteixen territori però el mapeig és lax; la connexió és sobretot metàfora o fenomenologia. **Cap** significa que no existeix cap pont empíric honest — les dues llengües s'ocupen de preguntes diferents, i això és apropiat.",
          "El lector veurà aquestes qualificacions com a petits distintius al començament de cada secció. Algunes seccions descriuen ponts forts; algunes descriuen ponts febles; la secció nou descriu llocs on no existeix cap pont. Les tres serveixen a l'honestedat intel·lectual del lloc. La maniobra més conseqüent en aquesta pàgina és la disposició a anomenar els fracassos.",
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
          "La Xarxa per Defecte és el pont més ferm del lloc. És també, en part per aquesta força, el que més sovint es sobreafirma en relats populars. La versió curosa és la que val la pena explicar.",
          "La imatge funcional en estat de repòs, a finals dels anys 90 i començaments dels 2000, va identificar un patró consistent: un conjunt particular de regions cerebrals augmentava de manera fiable la seva activitat quan els subjectes descansaven entre tasques experimentals, i la disminuïa igualment de manera fiable quan arribava la tasca següent [cite:raichle-2001-default-mode]. Abans que se l'anomenés, el senyal es tractava com a variància sorollosa — soroll a regressar fora. La reformulació d'aquesta variància com un estat de xarxa amb sentit va obrir vint anys de recerca subsegüent.",
          "La síntesi canònica és la revisió del 2008 de Buckner, Andrews-Hanna i Schacter, que va mapejar l'anatomia de la xarxa i els seus correlats conductuals amb el que continua sent, gairebé dues dècades després, la imatge de referència del camp [cite:buckner-2008-default-network]. Els nodes principals de la xarxa són l'escorça prefrontal medial, l'escorça cingulada posterior, parts laterals del lòbul parietal inferior (incloent-hi el gir angular), i el lòbul temporal medial (incloent-hi l'hipocamp). Estudis de connectivitat funcional han mostrat que l'activitat en aquestes regions està correlacionada fins i tot en repòs, i la força d'aquestes correlacions prediu variables conductuals que van des de la capacitat de memòria autobiogràfica fins a la vulnerabilitat al pensament ruminatiu [cite:andrews-hanna-2010-default-network-functional].",
          "El que la xarxa fa, quan fa alguna cosa, és la part que toca la psicologia profunda. La DMN es recluta de manera fiable durant la recuperació de memòria autobiogràfica — la història sentida de ser un jo en el temps. Es recluta durant l'avaluació autoreferencial — jutjar si un adjectiu s'aplica a un mateix, per exemple [cite:northoff-2006-self-referential-meta]. Es recluta durant la simulació d'altres ments, que la literatura cognitiva anomena mentalització i la psicodinàmica anomena mentalization o la construcció d'un model intern de treball de l'altre. Es recluta durant el pensament prospectiu — imaginar les pròpies accions i escenaris futurs. I es recluta durant la divagació mental, quan el contingut intern de la consciència es deixa flotar a la manera del que Jung va anomenar reverie.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "Les descripcions de Freud del jo són consistents amb les funcions del mode-per-defecte i els seus intercanvis recíprocs amb sistemes cerebrals subordinats.",
        attribution: "Carhart-Harris i Friston, 2010, Brain",
      },
      {
        kind: "text",
        paragraphs: [
          "L'article del 2010 de Robin Carhart-Harris i Karl Friston fa explícit el pont. La DMN, sostenen, ocupa la posició supraordinada en un sistema d'inferència jeràrquica la dinàmica del qual s'assembla formalment al relat de Freud sobre el pensament de procés secundari, la funció del jo i la prova de realitat [cite:carhart-harris-friston-2010-default-mode-ego]. Això no és metàfora. L'article és en una revista neurològica important, aborda el marc freudià directament, i les seves afirmacions són contrastables.",
          "El que el pont no diu també és important. La DMN és necessària però no suficient per al sistema-jo. Altres xarxes hi contribueixen — particularment la xarxa de saliència i la xarxa executiva central, amb les quals la DMN intercanvia activitat en dinàmiques característiques. La relació entre l'activació de la DMN i l'*experiència* de ser un jo es continua investigant activament, i la relació entre el «sistema-jo» empíric i el concepte metafísicament més ampli de Jung del Si Mateix és en disputa. Les lectures més raonables sostenen que la DMN involucra parts del que Jung va anomenar el Si Mateix — el sistema-jo autobiogràfic, el jo simulador — però no el tot. Les dimensions transpersonals del Si Mateix de Jung requereixen tractament a part, i la secció nou d'aquesta pàgina les tracta.",
          "El que el pont sí que diu és que el concepte, en psicologia profunda, d'un jo-com-a-construcció-interna ja no és una hipòtesi sense correlats empírics. La construcció té anatomia. L'anatomia és la paret cortical medial, la formació hipocampal i el lòbul parietal inferior. La construcció és parcial. Saber-ho no dissol l'experiència sentida-des-de-dins de ser un jo; complica la pregunta de què és el jo en mostrar on, en part, és.",
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
          "L'afirmació més àmplia que la psicologia profunda ha fet — que la major part de la vida mental passa fora de la consciència — està avui aclaparadorament recolzada per la neurociència cognitiva i afectiva. La pregunta interessant és quin *tipus* d'inconscient recolza l'evidència.",
          "El cas empíric comença amb la memòria implícita: els subjectes poden mostrar efectes conductuals duradors d'exposicions passades que no poden evocar conscientment, i la dissociació entre memòria implícita i explícita s'ha demostrat en molts paradigmes experimentals i poblacions clíniques [cite:schacter-1987-implicit-memory]. El mateix val per a la cognició social implícita, incloses actituds avaluatives que els subjectes no sostenen conscientment però expressen de manera consistent en mesures de temps de reacció, i per a l'automaticitat rutinària del comportament quotidià — la major part del que fem, la major part del temps, es fa sense decisió deliberada [cite:bargh-chartrand-1999-automaticity]. Els enfocaments del cervell com a sistema de processament predictiu emmarquen això com a constitutiu i no incidental: el cervell està corrent constantment prediccions inconscients i actualitzant-les davant l'evidència entrant; l'experiència conscient és un resum aigües avall d'aquesta activitat, no el seu origen.",
          "Tot això valida l'afirmació psicoanalítica àmplia sobre l'inconscient. No valida per si sola l'afirmació específicament freudiana que hi ha un inconscient *dinàmicament* reprimit — contingut mantingut fora de la consciència perquè l'accés conscient seria amenaçador. L'inconscient cognitiu contemporani no està, en la seva majoria, reprimit en sentit freudià; és simplement com funciona el cervell. El subconjunt específic de la repressió és una part més petita i més contestada del quadre més gran.",
          "La síntesi del 1998 de Drew Westen és la lectura contemporània estàndard: una quantitat enorme del que Freud va afirmar sobre l'inconscient — que és dinàmic, motivacionalment estructurat, i influeix en el pensament conscient — ha resistit l'escrutini empíric, fins i tot encara que la metapsicologia freudiana específica no [cite:westen-1998-scientific-legacy-freud]. El quadre és que les intuïcions psicoanalítiques àmplies sobre l'estructura de la vida mental eren en bona mesura correctes, mentre que la maquinària teòrica freudiana específica (el model topogràfic tripartit, la libido com a energia gairebé-física, la pulsió de mort) ha estat revisada o substituïda.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "Controlar records no desitjats es va associar amb major activació prefrontal dorsolateral, reducció de l'activació de l'hipocamp i pitjor retenció d'aquests records.",
        attribution: "Anderson et al., 2004, Science",
      },
      {
        kind: "text",
        paragraphs: [
          "Sobre la qüestió de l'oblit motivat en concret — l'afirmació més contestada de Freud — l'article del 2004 de Michael Anderson i col·legues a *Science* va demostrar correlats neurals de la supressió voluntària de la memòria. Els subjectes que intentaven activament no recordar paraules objectiu van mostrar major activitat de control prefrontal, menor activació de l'hipocamp, i un pitjor record posterior d'aquestes paraules; tant els efectes prefrontals com els hipocampals van predir la magnitud de l'oblit posterior [cite:anderson-2004-suppression-unwanted]. Això no és la repressió freudiana en sentit fort — és supressió voluntària, no la dinàmica inconscient que Freud va descriure — però és el primer correlat neural net d'un procés d'oblit actiu, i no afalaga la visió cognitivista estricta que tal cosa no existeix.",
          "Pel costat junguià, el consens contemporani sobre l'inconscient col·lectiu és més caut. La versió forta de Jung — que heretem memòries o imatges específiques de l'experiència ancestral — no sobreviu al contacte amb el que ara se sap sobre heretabilitat i biologia del desenvolupament. La versió més feble — que heretem formes o possibilitats de percepció i resposta, el que Jung a CW 9i ¶ 155 va formular realment — té simpatia en el relat de la psicologia evolucionista sobre primitius cognitius evolucionats, però la relació és d'aire de família més que d'identitat [cite:tooby-cosmides-1992-evolutionary-psychology]. La secció nou d'aquesta pàgina tracta els límits amb més detall.",
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
          "Aquesta és la convergència més neta del lloc. La neurociència de la memòria i la psicologia profunda coincideixen, d'una manera que no requereix traducció: el passat no és un arxiu fix que es recupera. Es reconstrueix, i l'acte de recuperació reconfigura la petjada.",
          "Pel costat empíric, el moment fundacional és l'article del 2000 de Karim Nader, Glenn Schafe i Joseph LeDoux a *Nature*. Van mostrar que les memòries de por consolidades en rates, quan es reactiven mitjançant recuperació, tornaven a un estat làbil que requeria nova síntesi proteica per reconsolidar-se. La infusió d'un inhibidor de la síntesi proteica a l'amígdala després de la recuperació — però no en absència de recuperació — produïa amnèsia per a la memòria [cite:nader-2000-fear-memories-reconsolidation]. La implicació no era subtil: el model de llarga data de la memòria com a consolidació única seguida d'emmagatzematge estable era erroni. Cada recuperació és una re-codificació. La petjada no és la mateixa després de ser evocada que abans.",
          "*Els set pecats de la memòria* de Daniel Schacter va sintetitzar l'evidència del costat humà: les memòries es distorsionen sistemàticament pel context present, per informació posterior a l'esdeveniment, per les pistes de recuperació, per les preguntes que se li demana a un que es faci sobre el propi passat [cite:schacter-2001-seven-sins]. Les dècades de treball d'Elizabeth Loftus sobre memòria de testimonis i la construcció de memòries falses sota suggestió van construir el cas clínic i forense del mateix quadre. La síntesi del 2006 d'Eric Kandel va lligar el treball molecular de tornada a l'escala personal-històrica: a cada nivell, de la sinapsi a l'autobiografia, la memòria és reconstrucció [cite:kandel-in-search-of-memory].",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "La consolidació no és un esdeveniment únic, sinó que es reitera amb l'activació subsegüent de les memòries.",
        attribution: "Nader, Schafe i LeDoux, 2000, Nature Reviews Neuroscience",
      },
      {
        kind: "text",
        paragraphs: [
          "La versió, en psicologia profunda, de la mateixa observació té una història més llarga. L'escriptura de Jung sobre la psique com a reorganitzadora del passat, que recompon el record al servei del significat present, antecedeix la literatura empírica en dècades. El *Nachträglichkeit* de Freud — habitualment traduït com a acció diferida o «posteritat» — anomena el mateix fenomen des d'un altre angle: el passat es constitueix retrospectivament, des de punts de vista que el passat mateix no contenia. El treball psicodinàmic contemporani informat per l'aferrament fa d'això l'objectiu operatiu del canvi terapèutic: «treballar a través» significa canviar els models interns de treball, cosa que significa reescriure memòries sentides.",
          "La implicació creua tots dos camps. La identitat mateixa és en part una construcció del moment present a partir de materials que el present reconfigura. Aquesta és la versió de la memòria que sobreviu a la vegada a la literatura empírica i a la tradició de la psicologia profunda. És també la versió que té riscos terapèutics — si la memòria fos un arxiu fix, el projecte de la psicoteràpia seria molt més circumscrit del que els seus defensors sempre han sostingut.",
          "El que continua incert és l'aplicació clínica. Si la reconsolidació de memòria intencional — com algunes teràpies de trauma afirmen aconseguir — és significativament diferent de la reconstrucció natural que passa a cada recuperació es continua debatent. Protocols específics que afirmen «reescriure» memòries traumàtiques tenen evidència mixta; la ciència bàsica és sòlida, la traducció clínica encara no està resolta. La posició curosa és que la memòria és reconstrucció, que això importa per a la teràpia, i que les afirmacions específiques més fortes sobre l'edició terapèutica de memòries requereixen més evidència de la que avui hi ha disponible.",
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
          "La xarxa de saliència — ancorada en la ínsula anterior i l'escorça cingulada anterior dorsal, amb contribucions subcorticals que inclouen l'amígdala — etiqueta els estímuls entrants per significació emocional i motivacional. L'article del 2007 de William Seeley i col·legues va anomenar la xarxa i la va mostrar com a funcionalment dissociable del sistema executiu-central: l'activitat de saliència correlacionava amb mesures d'ansietat, l'executiva amb l'acompliment en la tasca [cite:seeley-2007-salience-network]. La signatura de la xarxa, en la literatura subsegüent, és que opera ràpid i en gran mesura fora de l'accés conscient — el cervell ja ha decidit que això importa abans que la consciència se n'assabenti.",
          "El *numinós* de Jung anomena una experiència sentida amb fenomenologia almenys superposada: el sentit de ser pres per alguna cosa significativa, carregat de sentit abans que arribin les paraules. Jung va adoptar el terme de *La idea del sant* de Rudolf Otto (1917), on Otto el va encunyar per descriure l'estructura sentida de l'experiència religiosa abans que se li adherís cap teologia [cite:otto-1917-idea-of-holy]. Tant Otto com Jung anaven darrere d'una categoria fenomenològica, no neural: l'experiència de la significació com a alguna cosa que arriba, no alguna cosa que es decideix.",
          "El pont és parcial. L'activació de la xarxa de saliència podria subjacure al que la psicologia profunda ha anomenat el sentit sentit de la significació que arriba abans que el pensament — la prioritat de la importància sobre l'articulació. La literatura contemporània sobre avaluació afectiva ràpida, amb l'amígdala com a valuadora subcortical veloç, és consistent amb aquest costat de la descripció d'Otto i Jung.",
          "El que el pont no captura és la maniobra més gran que Otto i Jung volien fer. *Numinós* porta una dimensió religiosa o quasi-religiosa — connexió amb el sagrat, el sant, allò que està d'alguna manera no especificable fora de l'experiència ordinària — que la xarxa de saliència no aborda. La xarxa de saliència gestiona «això importa»; el numinós, tal com Otto i Jung van fer servir el terme, era «això importa d'una manera que suggereix alguna cosa més gran que l'assumpte mateix». Aquesta extensió és fenomenologia i teologia i construcció humana de sentit, no una regió cerebral. El pont es manté per a la capa de *significació sentida* del numinós. No es manté per a la capa d'*intimació d'alguna cosa més enllà*. Anomenar l'ajust parcial és més honest que exagerar l'ajust ple.",
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
          "Si l'activació de la DMN mapeja sobre parts del sistema-jo, llavors la *desactivació* de la DMN hauria de mapejar sobre estats alterats del jo. La literatura ha pres seriosament aquesta hipòtesi, i el quadre empíric és suggerent sense estar tancat.",
          "Els meditadors de llarg termini mostren reduccions mesurables del compromís de la DMN durant tasques d'atenció focalitzada, amb reduccions en l'activitat del PCC associada a la divagació mental, i canvis en la connectivitat de la DMN que els distingeixen de controls ingenus a la meditació. L'article del 2011 de Judson Brewer i col·legues és la referència estàndard [cite:brewer-2011-meditators-pcc]. La troballa no és que la meditació «apaga» la DMN; és que la relació entre l'atenció i la DMN és entrenable, i que la pràctica de llarg termini canvia aquesta relació de maneres mesurables.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "El tret definitori dels estats primaris és entropia elevada en certs aspectes de la funció cerebral… l'entropia està suprimida en la consciència desperta normal, cosa que significa que el cervell opera just per sota de la criticalitat.",
        attribution: "Carhart-Harris et al., 2014, Frontiers in Human Neuroscience",
      },
      {
        kind: "text",
        paragraphs: [
          "Els psicodèlics clàssics — psilocibina, LSD, DMT — produeixen canvis en l'experiència del jo que els subjectes descriuen rutinàriament en un llenguatge que Otto i Jung haurien reconegut. L'article del «cervell entròpic» del 2014 de Robin Carhart-Harris i col·legues proposa que aquests estats reflecteixen un col·lapse de l'organització normalment jeràrquica i de baixa entropia de la dinàmica cerebral, inclòs el paper coordinador de la DMN [cite:carhart-harris-2014-entropic-brain]. L'estudi del 2015 d'Alexander Lebedev i col·legues amb psilocibina, fent servir anàlisi de connectivitat funcional, va vincular les qualificacions de dissolució de l'ego específicament amb la connectivitat disminuïda entre el lòbul temporal medial i regions corticals d'alt nivell i amb una «desintegració» de la xarxa de saliència [cite:lebedev-2015-ego-dissolution-psilocybin].",
          "El costat, en psicologia profunda, d'aquest pont és la individuació de Jung. Per a Jung, la individuació era el procés de tota una vida de relativitzar l'ego davant el Si Mateix més gran — no la destrucció de l'ego sinó el seu descentrament, el seu reconeixement com una figura en un camp psíquic més gran. Les experiències de dissolució de l'ego (psicodèliques, contemplatives o — menys segurament — psicòtiques) són, en algunes lectures, talls verticals bruscos en el que la individuació fa lentament. El pont és real. La recerca contemporània sobre teràpia assistida per psicodèlics l'aborda directament.",
          "On el pont no es manté del tot és en l'equiparació d'estats alterats amb individuació. La individuació és un procés de desenvolupament de tota una vida, no una experiència cim. Algunes dissolucions de l'ego psicodèliques s'associen amb integració positiva i benefici durador; altres amb desorganització, ansietat i seqüeles difícils. La correspondència amb el marc curós de Jung — en el qual l'ego ha de romandre intacte prou per integrar el que la trobada revela — requereix més que dades de desactivació de la DMN. La literatura psicodèlica és emocionant i encara preliminar; la posició curosa sosté la correlació neural bàsica com a ben recolzada i l'afirmació més gran sobre la integració de tota una vida com un assumpte separat que la sola imatge cerebral no resoldrà.",
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
          "Jaak Panksepp va passar quatre dècades sostenint que la vida emocional té una arquitectura discreta present en els mamífers, i que aquesta arquitectura és en bona part subcortical, evolutivament antiga, i opera substancialment fora de l'accés conscient. La seva *Affective Neuroscience* (1998) va identificar set processos primaris: CERCA, POR, RÀBIA, LUXÚRIA, CURA, PÀNIC/DOL i JOC [cite:panksepp-1998-affective-neuroscience]. El seu llibre posterior amb Lucy Biven va estendre el marc i va argumentar la seva conseqüència per a la psicopatologia i la psicoteràpia [cite:panksepp-biven-2012-archaeology-mind].",
          "La rellevància per a la psicologia profunda és directa, i el programa de neuropsicoanàlisi de Mark Solms ha fet explícit el pont. La teoria tardana dels impulsos de Freud — pulsions libidinals i agressives com a forces motivacionals primàries — era una intuïció estructural sense un cervell en el qual l'estructura pogués viure. Els set sistemes de Panksepp aporten una versió empíricament fonamentada d'aquest quadre estructural. CERCA, mediada per circuits dopaminèrgics del VTA al nucli accumbens, correspon al que la teoria clàssica dels impulsos va anomenar energia libidinal apetitiva i projectada cap endavant. POR i RÀBIA corresponen a conceptes psicoanalítics específics d'ansietat i agressió. CURA correspon a l'aferrament i el vincle (enllaçant la tradició de Bowlby a la maquinària subcortical). PÀNIC/DOL correspon al distrés de separació, el llit de roca de l'aferrament i la pèrdua al llarg de la vida.",
          "El que sobreviu el pont és la intuïció bàsica, en psicologia profunda, que l'afecte és fonamental, està estructurat i és en part preconscient — que la vida mental no es construeix cap amunt des del pensament racional sinó des de sistemes emocionals més antics sobre els quals el pensament és una capa prima i recent. El que no sobreviu — o sobreviu en forma revisada — és la teoria dual freudiana específica dels impulsos (libido i Tànatos), que el marc de Panksepp no confirma i que la neurociència afectiva contemporània tracta com un no-mapeig. El concepte tardà freudià de pulsió de mort, en particular, no té lloc evident en l'arquitectura de Panksepp, i la majoria dels teòrics psicoanalítics contemporanis el tracten com una afirmació metafísica més que empírica.",
          "Les elaboracions de psicologia profunda més enllà de l'afecte primari — la rica vida simbòlica-imaginativa sobre la qual va construir Jung — se situen una capa per sobre. CERCA contribueix a la qualitat sentida de l'inconscient com una força exploradora que avança, que és el que Jung rastrejava quan escrivia sobre la vitalitat de la imaginació activa. CURA contribueix al que Jung va descriure com la presència sentida d'un altre interior. El pont aquí és real, però és un pont de mecanisme a estructura sentida, no de mecanisme a contingut simbòlic. Els símbols que Jung rastrejava s'han d'entendre com a produccions d'un cervell la l'arquitectura afectiva del qual s'entén ara millor — no són reduïbles a aquesta arquitectura.",
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
          "El gir de la cognició encarnada en la ciència cognitiva ha validat una intuïció de llarga data de la psicologia profunda: la cognició no és manipulació simbòlica abstracta, sinó que està conformada de principi a fi per l'experiència corporal, l'activitat sensoriomotora i la retroalimentació interoceptiva de les vísceres [cite:lakoff-johnson-1999-philosophy-flesh]. *Feeling of What Happens* d'Antonio Damasio és la síntesi popular canònica sobre el mateix punt des de la neurociència [cite:damasio-feeling-of-what-happens]; la revisió del 2017 d'Hugo Critchley i Sarah Garfinkel sobre interocepció i emoció és la referència contemporània sobre els mecanismes neurals específics pels quals l'estat corporal modela l'experiència afectiva i cognitiva [cite:critchley-garfinkel-2017-interoception-emotion].",
          "El costat, en psicologia profunda, és més antic. La teràpia Gestalt, partint de la formació de Fritz Perls amb Wilhelm Reich i la formació de Reich amb Freud, va fer de la consciència corporal el terreny pràctic del treball terapèutic. L'*armadura de caràcter* de Reich era una teoria del cos com a portador de defenses — una configuració muscular crònica com a registre de l'estructura psíquica. Les psicoteràpies orientades al cos que van sorgir d'aquest llinatge (bioenergètica, Hakomi, experiència somàtica) prenen seriosament el que la literatura contemporània de cognició encarnada descriu ara mecanísticament. La visió de Jung del cos com l'inconscient parlant abans que la ment tingui paraules se situa en el mateix territori.",
          "Damasio acredita específicament la tradició fenomenològica i psicoanalítica més àmplia per prendre's el cos seriosament quan la ciència cognitiva acadèmica no ho feia [cite:damasio-feeling-of-what-happens]. La funció interoceptiva de la ínsula proporciona un substrat neural específic per al que la Gestalt va anomenar consciència corporal del moment present. El complex vagal proporciona substrat neural per al treball de presència-calmant que recorre les teràpies centrades en la persona, Gestalt i les informades pel trauma.",
          "El pont és parcial més que ferm perquè la literatura empírica descriu mecanisme, mentre que la literatura terapèutica descriu mecanisme més pràctica més relació més experiència sentida al llarg del temps. Els fets neurals validen que el cos no és perifèric; les afirmacions clíniques sobre el que el treball corporal terapèutic fa realment per a qui sota quines condicions són una literatura a part, més contestada. La posició curosa és que la cognició encarnada dona la raó a la tradició, en psicologia profunda, en el punt bàsic, i que el pont acaba aquí.",
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
          "Aquesta és la secció més important de la pàgina. Una pàgina de ponts que només celebra connexions és deshonesta. La maniobra seriosa és la disposició a anomenar, específicament i sense disculpa, on les dues llengües no s'uneixen — i a sostenir-ho.",
        ],
      },
      {
        kind: "heading",
        text: "Sincronicitat",
      },
      {
        kind: "text",
        paragraphs: [
          "El concepte tardà de Jung — la coincidència significativa com a principi connector acausal — no té correlat empíric. La fenomenologia de la coincidència significativa és real (el reconeixement de patrons, el biaix de confirmació i l'apofènia activen territori relacionat), però l'afirmació metafísica específica de Jung sobre la connexió acausal no és falsable en cap marc científic actual. Veredicte: cap pont. El tema continua sent filosòfic, no empíric. Tractar-lo com una altra cosa deshonra tots dos costats.",
        ],
      },
      {
        kind: "heading",
        text: "L'inconscient col·lectiu com a memòria heretada literal",
      },
      {
        kind: "text",
        paragraphs: [
          "La versió forta de l'inconscient col·lectiu — que heretem memòries o imatges específiques de l'experiència ancestral — no té suport empíric. L'heretabilitat de contingut cognitiu específic d'aquest tipus és inconsistent amb el que ara se sap sobre biologia del desenvolupament. La versió més feble, la que la formulació curosa de Jung a CW 9i ¶ 155 sosté realment — que heretem *formes* o *possibilitats* de percepció i resposta — té simpatia en el relat de la psicologia evolucionista sobre primitius cognitius evolucionats [cite:tooby-cosmides-1992-evolutionary-psychology]. Però la distinció forta/feble importa, i molts escrits junguians populars la col·lapsen. Veredicte: pont distant per a la versió feble; cap pont per a la versió forta.",
        ],
      },
      {
        kind: "heading",
        text: "Continguts arquetípics específics (el Vell Savi, l'Ànima, el Trickster)",
      },
      {
        kind: "text",
        paragraphs: [
          "Són categories clíniques i literàries útils. No es mapegen sobre regions cerebrals ni sistemes neurals específics, i l'intent de trobar tals mapejos seria un error de categoria. Els continguts arquetípics són organitzacions d'imatge i funció narrativa que recurren a través de cultures perquè són organitzacions útils, no perquè estiguin emmagatzemades en algun lloc com a tals. Veredicte: categoria de la psicologia profunda, no categoria neurocientífica. Les dues llengües fan aquí treballs diferents.",
        ],
      },
      {
        kind: "heading",
        text: "La imaginació activa com a pràctica transformadora",
      },
      {
        kind: "text",
        paragraphs: [
          "El mètode específic de Jung de diàleg conscient amb figures inconscients és una pràctica clínica i de desenvolupament amb una fenomenologia rica com per omplir el *Llibre Roig*. Algunes recerques adjacents sobre imaginació i pensament prospectiu — el treball de Daniel Schacter sobre la hipòtesi de la simulació episòdica constructiva, per exemple — toquen el territori, però no existeix recerca empírica directa de la imaginació activa com a pràctica transformadora a escala clínica. Veredicte: pont distant. La fenomenologia és rica; el mecanisme no està clar.",
        ],
      },
      {
        kind: "heading",
        text: "La síntesi mística-religiosa tardana de Jung (Aion, Mysterium Coniunctionis)",
      },
      {
        kind: "text",
        paragraphs: [
          "Aquestes obres aborden la teologia cristiana, l'alquímia, el gnosticisme i la qüestió del diví en la psique. La neurociència no aborda aquestes preguntes, i no és un fracàs de cap dels camps que sigui així. Veredicte: cap pont. Les dues llengües s'ocupen aquí de preguntes diferents, i la resposta correcta és deixar-les en els seus respectius territoris.",
        ],
      },
      {
        kind: "heading",
        text: "El Si Mateix com a concepte transpersonal de Jung",
      },
      {
        kind: "text",
        paragraphs: [
          "El pont de la DMN (secció dos) captura part del que Jung va anomenar el Si Mateix — específicament, el sistema-jo, el jo autobiogràfic i simulador que la literatura empírica ha descrit ara substancialment. No captura l'afirmació metafísica més àmplia de Jung que el Si Mateix és la totalitat de la psique, de la qual la consciència és una part, incloses les dimensions transpersonals. Veredicte: pont parcial per al Si Mateix psicològic; cap pont per al Si Mateix transpersonal. Confondre el primer amb el segon és la forma més comuna de sobreafirmació en relats populars d'aquest material.",
        ],
      },
      { kind: "rule" },
      {
        kind: "text",
        paragraphs: [
          "El marc per a tota aquesta secció: aquests fracassos no són fracassos de cap dels camps. Són reconeixements honestos que la psicologia profunda i la neurociència aborden dominis superposats però diferents. Algunes preguntes són contestables per mecanisme. Algunes són contestables per fenomenologia. Algunes requereixen tots dos. Algunes no requereixen cap — són filosòfiques, espirituals o simplement humanes en maneres que cap mètode científic captura. Anomenar el que no uneix és la disciplina que manté honestos els ponts que sí que es mantenen.",
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
          "Una guia per al lector. El lloc no és una sola línia d'argument; és una xarxa. La pàgina de Ponts és al centre, però cap pàgina del lloc és l'última paraula.",
          "On una pàgina de l'Atles de regions esmenta un concepte de psicologia profunda, el pont rellevant ha estat qualificat i una targeta a la secció del Fil anomena aquesta qualificació. Fes clic a la targeta per aterrar a la secció corresponent aquí. On una pàgina de psicologia profunda esmenta neurociència, la referència creuada apunta en direcció inversa.",
          "El lloc no sosté que la neurociència redueixi la psicologia profunda a mecanisme. No sosté que la psicologia profunda floti lliure del mecanisme. Sosté totes dues llengües com a parcials. El mecanisme és parcial perquè el mecanisme per si sol no diu per a què serveix el mecanisme, ni com se sent des de dins. La fenomenologia és parcial perquè la fenomenologia per si sola pot descriure una experiència sense dir què la sustenta ni per què es generalitza.",
          "La maniobra més difícil és sostenir totes dues llengües alhora sense col·lapsar-ne una en l'altra. La pàgina de Ponts és un inventari d'on s'ha vist que les dues es toquen — i un inventari d'on no.",
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
          "El problema de les dues cultures en psicologia — la profunditat psicoanalítica per un costat, la neurociència cognitiva i afectiva per l'altre — no és una disputa que es resoldrà amb la victòria d'algun dels costats. Mecanisme i sentit són tipus diferents de relats, i les ments són el tipus de coses que poden abordar-se per tots dos sense esgotar cap.",
          "El que els últims vint-i-cinc anys de recerca empírica han fet és tornar la conversa més interessant. El psicoanàlisi ha acumulat evidència pròpia — recerca clínica de processos, recerca de l'aferrament, evidència de la psicoteràpia psicodinàmica com a tractament — i una síntesi curosa de les afirmacions de Freud davant les troballes contemporànies mostra substancialment més vigència de la que va permetre la desestimació cognitivista dels anys setanta [cite:westen-1998-scientific-legacy-freud]. La neurociència ha descobert que la vida emocional i el processament inconscient no són preocupacions vestigials sinó arquitectura central, i que la resta de la cognició es construeix sobre elles i no al voltant. La recerca de la Xarxa per Defecte ha donat al sistema-jo un relat neural parcial. La neurociència afectiva ha proporcionat l'arquitectura emocional del cervell amb detall subcortical. La ciència de la memòria ha mostrat que el passat és reconstrucció a cada escala, de la sinapsi a l'autobiografia.",
          "Res d'això no prova que Freud o Jung tinguessin raó. Tot complica la desestimació informal que els va declarar morts fa una generació. La versió de la psicologia profunda que sobreviu a la literatura empírica és una versió escarmentada — que no flota lliure de la biologia, que no reclama mecanismes que no pot sostenir, i que no necessita fer-ho. La versió de la neurociència que sobreviu al contacte amb la tradició de la psicologia profunda és la que no s'acovardeix davant d'anomenar el que està estudiant, fins i tot quan el que està estudiant és el que la ment és.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "La ment que estudiem és la ment que està estudiant. Preguntar què són les ments amb un sol llenguatge és preguntar mitja pregunta. El treball seriós és preguntar les dues.",
        attribution: "The Brain Studio",
      },
    ],
  },
};
