#!/usr/bin/env node
/**
 * One-shot: add the English `faust`, `dante`, and `literary` i18n
 * namespaces to messages/en.json, then mirror them as machine-
 * assisted drafts into the other five locale bundles (es/ca/th/ja/
 * zh-CN). The non-English drafts are flagged as machine_assisted +
 * tier1Reviewed: false at the file level (the site already has a
 * `translationStatus.underReviewBanner` that surfaces this to
 * readers).
 *
 * The literary essays are long-form scholarly prose; the machine
 * translations are starting points for a native review pass, not
 * final copy. The author's existing workflow for Thai (see
 * docs/thai-handoff-to-editor.md) extends here too.
 *
 * Run from frontend/: node scripts/add-literary-rooms-i18n.js
 */

const fs = require("node:fs");
const path = require("node:path");

const MESSAGES_DIR = path.join(__dirname, "..", "messages");
const LOCALES = ["en", "es", "ca", "th", "ja", "zh-CN"];

// ─── English source of truth ────────────────────────────────────────

const LITERARY_EN = {
  movement: "Movement",
  passage: "Passage",
  readingMinutes: "min read",
  triangulation: "Triangulation",
  companionLabel: "Companion room",
};

const FAUST_EN = {
  label: "Faust",
  title: "Faust, or: striving as architecture.",
  subtitle:
    "Goethe spent sixty years writing the question every brain-encoding model is now asking from the other side — what is the felt structure of human wanting, and where does it end?",
  breadcrumb: "Faust",
  structure: "Five movements · German + English",
  companion: "Continue with Dante →",

  m1: {
    title: "The frame.",
    p1: "Faust is not a poem about a man who sold his soul to the devil. It is a structure built around a single question: what would it look like to take human striving seriously as a problem rather than as a virtue or a vice, and what kind of form would be required to render that problem so that the reader's own striving has to complete it.",
    p2: "Goethe began Faust in his early twenties and was still working on Part II at eighty-two. The poem outlasted his marriages, his political career, his patron, his peers, and several theories of mind that arose and fell during its composition. Whatever Faust is, it is at minimum a sixty-year record of one person trying to render in language the texture of what it is to want without being able to stop.",
    claim:
      "The claim of this room: Faust and the contemporary neuroscience of prediction error and motivated wanting are working on the same problem, in different languages, from opposite directions, and both languages are necessary.",
  },

  m2: {
    title: "The brain.",
    p1: "Jaak Panksepp called it the SEEKING system: a dopaminergic circuit from the ventral tegmental area through the nucleus accumbens into the prefrontal cortex, which generates the felt experience of wanting more before the wanted thing has been encountered. SEEKING does not require a goal. It is not a response to scarcity. It is, in Panksepp's formulation, the neural signature of being alive and oriented forward at all. Most of the time it operates silently; we notice it only when it stops, in the flat affect of severe depression, or when it goes into runaway, in mania and addiction.",
    p2: "Karl Friston's free-energy principle, taken together with Anil Seth's work on predictive selfhood, gives this older affective neuroscience a computational frame. The brain is not a passive recipient of sensory data. It is continuously generating predictions about its next state and updating those predictions against what arrives. The felt sense of being a coherent self is, in this view, the brain's running model of its own predictions about itself. Selfhood is maintained by closing the loop between prediction and outcome quickly and often enough that the loop never becomes the foreground.",
    p3: "Faust's wager — that he will die the moment any passing instant satisfies him completely — is, in this language, an articulation of the impossibility built into the SEEKING circuit. To remain Faust is to keep predicting forward. The moment the prediction is met without remainder, the loop closes for good, and there is no further self to maintain. Faust's monologue in his study is the phenomenology of an unclosed prediction loop heard from the inside.",
    p4: "What would TRIBE v2 — the brain-encoding model the rest of this site uses — actually predict for the German wager passage? It would warm the ventromedial prefrontal cortex (the valuation node), the dorsomedial prefrontal cortex (self-referential reasoning), the posterior cingulate (the default-mode core that holds the model of the ongoing self), and the left amygdala (salience marking). It would underweight Heschl's gyrus and the posterior STG because, despite the dramatic German cadence, the wager is not primarily about sound. It would go thin on the subjunctive grammar — TRIBE was trained on contemporary English transcripts of fMRI experiments and cannot reproduce the felt force of a sentence whose verb mood is itself the argument.",
    disclaimer:
      "TRIBE is a measurement device pointed at how a particular kind of brain receives a piece of text. The model is not the wager. The wager is doing work the measurement can describe in part and not in full. That gap is this room's subject.",
  },

  m3: {
    title: "The psyche.",
    p1: "Jung wrote about Faust for fifty years. He read Mephistopheles as the shadow — the part of the personality the conscious ego cannot integrate but cannot live without — and he read the whole drama as a long argument that the shadow, when not denied, becomes the engine of the work the conscious mind could not do on its own. Mephistopheles is the figure who, in Faust's own formulation, wills evil and works good. That formulation is not a paradox in Jung's reading. It is the operational definition of how the unconscious participates in conscious life when the person stops fighting it.",
    p2: "Helena, in Part II, is Jung's most direct reading of the anima — the inner feminine that, in the male psyche of Goethe's era, carries the affective and intuitive functions the ego has externalized. Jung's claim is not that Goethe was hallucinating an archetype; it is that the figure Goethe needed to write to complete the second half of his poem is the same figure that shows up in dreams and clinical material across cultures, because the structure of psyche that produces her is general. The Faust-Helena union dramatizes the coniunctio — the integration of contrasexual elements that Jung saw as the central work of the second half of life.",
    p3: "The closing Ewig-Weibliche — the eternal feminine that draws Faust upward — is the anima's teleological function. It is not a love object. It is the principle by which the personality is led past what reason alone can reach. Jung is careful here: he is not saying Goethe encountered a metaphysical truth. He is saying Goethe wrote the figure that the deep structure of psyche, working teleologically toward integration, produces in any person who lives long enough and pays attention.",
    p4: "What does contemporary depth psychology, with a century of clinical observation Jung did not have, see in Faust that he did not? Three things. First: the wager itself reads, in modern terms, as a defense against integration. Faust seeks novelty so the relational work of staying with anything cannot occur. Second: Gretchen is no longer simply the innocent destroyed by Faust's striving; she is the relational casualty that the work of striving consistently produces in lives organized around it. Third: the redemption at the end reads, to a clinician, less as a metaphysical gift than as the late-life recognition that the striving was always also a flight, and that something — Goethe's eternal feminine, a contemporary clinician's healthy attachment — was reaching back the entire time.",
    refusal:
      "The shadow is not the amygdala. The anima is not the right hemisphere. The Ewig-Weibliche is not a default-mode trajectory. Each of those mappings is an attempt to collapse a phenomenological observation into a mechanism, and each loses the observation in the process. The brain regions discussed above and the psychic structures discussed here are different inquiries into the same person reading the same poem. Both are needed. Neither is sufficient.",
  },

  m4: {
    title: "The language.",
    intro:
      "Three passages. For each, the German first, an English translation alongside, and a note on what the original is doing that the translation cannot carry. The right-column region predictions are literature-informed composites, not real measurements, and the divergence between original and translation is the point: a brain-encoding model trained on contemporary English will carry a different brain for the same meaning in early modern German.",
    originalLabel: "German (original)",
    translationLabel: "English",
    originalPredictionLabel: "Reading the German",
    translationPredictionLabel: "Reading the translation",
    predictionDisclaimer:
      "Literature-informed composite. Not a TRIBE measurement. Drawn from the neuroscience papers cited in the About page.",

    passage1: {
      citation: "Faust, Part I, lines 1699–1706 (Studierzimmer II)",
      original:
        "Werd ich zum Augenblicke sagen:\nVerweile doch! du bist so schön!\nDann magst du mich in Fesseln schlagen,\nDann will ich gern zugrunde gehn!\nDann mag die Totenglocke schallen,\nDann bist du deines Dienstes frei,\nDie Uhr mag stehn, der Zeiger fallen,\nEs sei die Zeit für mich vorbei!",
      translation:
        "If to the moment I shall ever say:\nAh, linger on, thou art so fair!\nThen mayst thou fetter me that day,\nThen will I perish, then and there!\nThen may the death-bell toll, recalling\nThy service done, with thee I've part,—\nThe clock may stop, its hand be falling,\nAnd time be finished for my heart!",
      translationAttribution:
        "trans. Bayard Taylor (1870). Public domain.",
      analysis1:
        "The wager hinges on a single grammatical move English cannot reproduce: Werd ich zum Augenblicke sagen is in the subjunctive II, the mood German reserves for hypothetical futures, polite requests, and counterfactuals. The whole sentence is balanced on the edge of unreality. Faust is not promising; he is naming the condition under which the promise would activate. English subjunctive collapsed into the indicative four centuries ago, so 'if I shall ever say' has to do the work of two grammatical states at once and inevitably loses the second.",
      analysis2:
        "Verweile doch — du bist so schön. Three words in German, eight in serviceable English. Verweile is an imperative that contains the request to linger and the acknowledgement that lingering is what the addressee does not naturally do. Doch carries the weight of pleading, recognition, and resignation in a particle no English word reproduces. Schön at line-end rhymes against gehn (perish) so that the very rhyme says: to call something beautiful enough to stop for is to call for one's own ending. A reader of the German hears the death in the rhyme. A reader of the English does not.",
    },

    passage2: {
      citation: "Faust, Part I, lines 1224–1237 (Studierzimmer I)",
      original:
        "Geschrieben steht: »Im Anfang war das Wort!«\nHier stock ich schon! Wer hilft mir weiter fort?\nIch kann das Wort so hoch unmöglich schätzen,\nIch muß es anders übersetzen,\nWenn ich vom Geiste recht erleuchtet bin.\nGeschrieben steht: »Im Anfang war der Sinn.«\nBedenke wohl die erste Zeile,\nDaß deine Feder sich nicht übereile!\nIst es der Sinn, der alles wirkt und schafft?\nEs sollte stehn: Im Anfang war die Kraft!\nDoch, auch indem ich dieses niederschreibe,\nSchon warnt mich was, daß ich dabei nicht bleibe.\nMir hilft der Geist! Auf einmal seh ich Rat\nUnd schreibe getrost: Im Anfang war die Tat!",
      translation:
        "'Tis writ, \"In the beginning was the Word!\"\nI pause, perplexed! Who lends me his accord?\nI cannot the mere Word so highly prize;\nMust change it, if by the Spirit I am rightly taught.\n'Tis writ, \"In the beginning was the Thought!\"\nConsider well that line, the first you see,\nThat your pen may not write too hastily!\nIs it then Thought that works, creative, hour by hour?\nThus should it stand: \"In the beginning was the Power!\"\nYet even while I write this word, I falter,\nFor something warns me, this too I shall alter.\nThe Spirit aids! At once I see my road,\nAnd write assured: \"In the beginning was the Deed!\"",
      translationAttribution:
        "trans. Bayard Taylor (1870). Public domain.",
      analysis1:
        "Faust is translating the opening of John's gospel out of Greek into German, in real time, in front of the reader, and the scene is itself a meditation on what translation does. Wort → Sinn → Kraft → Tat. Word becomes sense, becomes force, becomes deed. Each move is a substitution that loses something the previous term carried, and Faust's discomfort across the four words is the engine of the scene. The recursion is sharp: a passage about the impossibility of translating is being read by you in a translation.",
      analysis2:
        "Tat in the final line is not deed in the way English deed is deed. Tat is the act-already-completed, the thing-done, the closed gesture that has produced the world. English 'deed' has the same etymological root but has slipped semantically toward the moral evaluation of an action ('a good deed') and lost the metaphysical force the German keeps. Goethe is locating creation in the act rather than in the word, and the German Tat carries that whole theological move; the English 'Deed' has to lean on the surrounding scene for the same weight.",
    },

    passage3: {
      citation: "Faust, Part II, final lines (Bergschluchten)",
      original:
        "Alles Vergängliche\nIst nur ein Gleichnis;\nDas Unzulängliche,\nHier wird's Ereignis;\nDas Unbeschreibliche,\nHier ist's getan;\nDas Ewig-Weibliche\nZieht uns hinan.",
      translation:
        "All things transitory\nBut as symbols are sent:\nEarth's insufficiency\nHere grows to Event:\nThe Indescribable,\nHere it is done:\nThe Woman-soul leadeth us\nUpward and on!",
      translationAttribution:
        "trans. Bayard Taylor (1870). Public domain.",
      analysis1:
        "Gleichnis is the load-bearing word in the German and the word the translation has to negotiate around. It means simile, parable, image, and likeness, all four at once, in a noun that points to the structural relation between earthly form and metaphysical meaning. Goethe is saying: everything that passes is in that relation. Bayard Taylor's 'symbols' carries the parable sense but loses the cognitive structure — Gleichnis is the brain operation of seeing one thing as standing for another, and Goethe is making that operation the closing claim of his sixty-year poem.",
      analysis2:
        "The closing Ewig-Weibliche zieht uns hinan reads, in German, with a forward inevitability the English cannot match. Hinan is an adverb meaning upward-toward, and it is doing rhyming work with Ereignis and getan that carries the whole stanza's argument in its sound. The reader of the German hears the upward draw as a tonal fact; the reader of the English reads it as a sentence about an upward draw. Both registers carry the meaning; only one carries the felt motion.",
    },
  },

  triangulation:
    "Three movements, three angles. Movement II showed how a brain-encoding model would receive these passages — which regions warm, where the model goes thin, what the measurement cannot reach. Movement III named the psychic structures Jung saw in the same lines — shadow, anima, coniunctio, the eternal feminine as the principle that leads past reason. Movement IV worked the language itself — what the German does that English cannot carry, and how that gap is itself a finding about how mind handles meaning.\n\nThese three movements are not three views of the same fact. They are three different inquiries into the same person reading the same poem. The brain regions discussed in Movement II are not the psychic structures of Movement III, and neither is the rhyme between schön and gehn. Every attempt to map shadow onto amygdala or anima onto right hemisphere is an attempt to collapse one register into another, and the collapse always costs the observation.\n\nFaust does something none of the three registers can fully describe. It stages striving in time, in a form that the reader's own striving must complete. The brain encoding model can tell us about reception. The depth-psychological reading can tell us about meaning. The language work can tell us about prosody. The poem is doing what is left.",

  m5: {
    title: "The image.",
    imageAlt:
      "Eugène Delacroix, Méphistophélés visits Faust, lithograph, 1828",
    imageCredit:
      "Eugène Delacroix · Méphistophélés visits Faust · 1828 · Cleveland Museum of Art · Public domain",
    p1: "Goethe saw Delacroix's seventeen Faust lithographs at the age of seventy-eight, two years before his death. He told Eckermann that the Frenchman had seen the poem better than he had seen it himself — that Delacroix's Faust looked at him from the page as the Faust he had imagined but not been able to render. Delacroix's compositions are not illustrations in the academic sense. They are readings made visible. The lithographs were the first major French response to the German poem; they are still, two centuries later, the most influential.",
    p2: "What Delacroix saw and chose to render was the chiaroscuro of the inner life Goethe staged in language. Mephistopheles appears in the studio at the moment Faust's despair has bottomed out, and the lithograph holds the two figures in a single light source that flatters neither. What Delacroix chose to leave unrenderable is the wager itself. The wager is grammar — a subjunctive Faust says into his own ear — and no image can contain a verb mood. Delacroix paints the room in which the wager could be said, and lets the wager stay in the German.",
    p3: "The image, in this room's argument, is the fourth register. The brain encoding model receives the words. The depth-psychological reading interprets the figures. The language work hears the prosody. The lithograph offers the scene as something a body has actually been in, has imagined being in, has stood near in oil paint and ink. All four registers point at the same Faust. The poem is what survives all four.",
  },
};

const DANTE_EN = {
  label: "Dante",
  title: "Dante, or: the architecture of moral attention.",
  subtitle:
    "Dante built the Commedia for the way a brain holds extended narrative across selfhood, embodiment, and felt rightness — seven centuries before any of those words existed.",
  breadcrumb: "Dante",
  structure: "Five movements · Italian + English",
  companion: "Continue with Faust →",

  m1: {
    title: "The frame.",
    p1: "The Commedia is not a religious poem with a moral allegory attached. It is a structure built around a single observation: moral life is felt before it is reasoned, the felt sense has its own architecture, and that architecture is rendered most accurately by a form that moves a body through it. Dante spent the last twenty years of his life writing a poem whose method is exactly this — to put the reader's own body through ascent, descent, recognition, and stillness, in a metric form (terza rima) whose rhyme scheme physically pulls the reader forward through the same architecture the narrator is moving through.",
    p2: "Dante had no access to fMRI, no theory of default-mode networks, no concept of embodied cognition. What he had was an extraordinary attention to the way moral experience actually feels, and a poetic form that he engineered to render that feeling as a structural property of reading rather than as a description in the third person.",
    claim:
      "The claim of this room: the Commedia is structured for the default-mode network and the embodied cognition of moral emotion in a way that contemporary cognitive neuroscience can now recognize but could not have predicted from theory alone.",
  },

  m2: {
    title: "The brain.",
    p1: "Raymond Mar's review of the neural bases of social cognition and story comprehension established that extended narrative engages the default-mode network — the same regions involved in self-referential thought, autobiographical memory, and the simulation of other minds. The default-mode network is what allows a reader to hold the entire trajectory of a long narrative in working consciousness while attending to the local sentence. The Commedia, at a hundred cantos and over fourteen thousand lines, is among the most demanding sustained narratives any reader will undertake, and its architecture is built precisely for what the default-mode network does best.",
    p2: "Speer, Reynolds, Swallow, and Zacks demonstrated that reading narrative about motor action activates the same neural representations as actually performing the action. When Dante describes the descent through the seven circles, the reader's motor-imagery regions activate. When the Purgatorio describes the climb up the mountain, those same regions activate again, in the opposite direction. The architectural orientation of the poem — down through Hell, up through Purgatory, outward through the spheres of Paradise — is being processed by a brain that, neuroscience now knows, treats described motion as embodied even when the body is not moving.",
    p3: "Wallentin and colleagues found that the amygdala and the autonomic nervous system respond to emotionally intense passages of fiction before the conscious reader registers what they are responding to. The body knows the Paolo and Francesca passage is going to hurt before the prefrontal cortex catches up. Dante engineered this. The terza rima carries the affective onset across line breaks faster than rational comprehension can keep up; by the time the reader has parsed the sentence, the body has already responded to it.",
    p4: "What would TRIBE v2 predict for the opening tercet of Inferno and the closing tercet of Paradiso? For the opening: default-mode core activation (the famous nel mezzo del cammin opens directly into autobiographical projection), strong dorsomedial prefrontal engagement (the shared nostra vita pulls the reader into mentalizing with the narrator), and reasonable activation across the language regions despite the model never having seen medieval Italian. For the closing: TRIBE goes thin. The model can locate l'amor che move il sole as a sentence about love and the sun and the stars, but the closing tercet is doing something the model has no parameters to represent — collapsing the entire prior architecture into a final embodied claim about the limits of vision and the priority of love.",
    disclaimer:
      "The model is not the poem. The Commedia is doing work for a reader's brain that no measurement of that brain can fully describe. The neuroscience above is real and the predictions are honest, but the poem remains larger than any reading of it, including this one.",
  },

  m3: {
    title: "The psyche.",
    p1: "Jung wrote less directly on Dante than on Faust, but the structural reading is straightforward: the descent into Inferno is the canonical nekyia — the journey into the underworld that, since the Odyssey, has been Western literature's most stable symbol for the encounter with the unconscious. Virgil is the wise old man who can accompany the conscious ego through the lower regions but cannot, by his nature as a pre-Christian rationalist, escort it past the boundary of reason. Beatrice is the anima made explicitly theological — the inner feminine elevated to the function of guide into what reason alone cannot reach.",
    p2: "The contrapasso — the principle that each circle's punishment is structurally identical to the sin that produced it — is, in psychological terms, a phenomenology of schema-driven repetition seven centuries before schema theory existed. The lustful are blown by the winds they could not resist in life. The flatterers wallow in the filth their words spread. The traitors are encased in the ice their hearts had already become. Dante is not punishing his characters; he is rendering the structure by which inner states produce their own continuation. The sin is the punishment. Modern clinicians recognize this as the operational definition of a personality structure.",
    p3: "The Purgatorio is, in this reading, a sustained meditation on what depth psychology calls the integration of the shadow — the work of recognizing the parts of the self that have been disowned and bringing them, gradually and with care, back under the orbit of the central personality. Dante climbs the mountain by repeatedly facing what was rejected. Each terrace is a confrontation with a specific disowned content. The Purgatorio's prosody — terza rima continuing through the climb — carries the felt experience of integration as forward motion against gravity.",
    p4: "The Paradiso is the most difficult of the three for psychology to read because it stages a structure that depth psychology can only describe by analogy: the integration of the contrasexual function (Beatrice) into the central personality, the dissolution of the boundary between self and the larger Self, and finally the vision in which the personal will is aligned with the moving principle of the universe. Jung would call this the late stage of individuation. Dante calls it Paradise. The two languages are pointing at structurally similar territory; they are not synonyms.",
    refusal:
      "The contrapasso is not the basal ganglia. Beatrice is not the right hemisphere. The unmoved mover at the end of Paradiso is not a default-mode trajectory. The temptation to translate Dante's symbolic structures into the brain regions discussed in Movement II is exactly the collapse the site refuses elsewhere. The poem is doing something at the level of meaning and felt experience that the level of mechanism can describe in part and not in whole. Hold both.",
  },

  m4: {
    title: "The language.",
    intro:
      "Three passages. For each, the Italian first, an English translation alongside, and a note on what the original is doing that the translation cannot carry. Dante's medieval Italian is even further outside any brain-encoding model's training distribution than modern Thai is; the divergence between original and translation here is sharper than in any other room on this site.",
    originalLabel: "Italian (original)",
    translationLabel: "English",
    originalPredictionLabel: "Reading the Italian",
    translationPredictionLabel: "Reading the translation",
    predictionDisclaimer:
      "Literature-informed composite. Not a TRIBE measurement. Drawn from the neuroscience papers cited in the About page.",

    passage1: {
      citation: "Inferno, Canto I, lines 1–3",
      original:
        "Nel mezzo del cammin di nostra vita\nmi ritrovai per una selva oscura,\nché la diritta via era smarrita.",
      translation:
        "Midway upon the journey of our life\nI found myself within a forest dark,\nFor the straightforward pathway had been lost.",
      translationAttribution:
        "trans. Henry Wadsworth Longfellow (1867). Public domain.",
      analysis1:
        "Three words do the structural work of the opening, and English cannot carry any of them cleanly. Nostra (our, not my) — Dante is not narrating his own midlife; he is positioning the reader inside a shared possessive that makes midlife a structural human event rather than an autobiographical one. Mi ritrovai is reflexive — I found myself — and the reflexive is doing work English cannot reproduce: the speaker is both the one who is lost and the one who finds himself lost. Diritta is polysemous — it means straight, right, and just, in one adjective, so the lost path is simultaneously geometrical, moral, and legal. English has to choose one or smuggle the others through context.",
      analysis2:
        "The whole tercet is in present-perfect — era smarrita, had been lost — locating the disorientation as a state that had already happened before the speaker noticed. This is the grammar of a default-mode network catching up to its own situation. The reader's brain processes the tercet by projecting forward into an autobiographical event (the midlife crisis is one of the most universally available self-reference frames) while parsing the polysemy of diritta, while holding the reflexive structure of ritrovarsi. Three operations at once. The English makes the reader do the same operations sequentially.",
    },

    passage2: {
      citation: "Inferno, Canto V, lines 121–138 (Paolo e Francesca)",
      original:
        "Nessun maggior dolore\nche ricordarsi del tempo felice\nnella miseria; e ciò sa 'l tuo dottore.\n\nMa s'a conoscer la prima radice\ndel nostro amor tu hai cotanto affetto,\ndirò come colui che piange e dice.\n\nNoi leggiavamo un giorno per diletto\ndi Lancialotto come amor lo strinse;\nsoli eravamo e sanza alcun sospetto.",
      translation:
        "There is no greater sorrow\nThan to be mindful of the happy time\nIn misery, and that thy Teacher knows.\n\nBut, if to recognise the earliest root\nOf love in us thou hast so great desire,\nI will do even as he who weeps and speaks.\n\nOne day we reading were for our delight\nOf Launcelot, how Love did him enthral.\nAlone we were and without any fear.",
      translationAttribution:
        "trans. Henry Wadsworth Longfellow (1867). Public domain.",
      analysis1:
        "Ricordarsi is the load-bearing verb and English has no clean equivalent. The Italian holds the etymological structure of ri-cor-dare — to put back into the heart. Memory in this passage is not a cognitive operation; it is a physical relocation of an event into the body's seat of feeling. Francesca is not remembering the happy time; she is putting it back into her heart. The pain she names is not the cognitive recognition of past happiness in present misery; it is the somatic experience of the happy time as a foreign body that her heart cannot reject and cannot incorporate.",
      analysis2:
        "The terza rima is doing affective work English translations cannot reproduce. Each tercet's rhyme reaches forward into the next tercet's first line and back into the previous tercet's last line, so the reader's brain is held in three temporal registers simultaneously. By the time conscious comprehension parses what Francesca has said, the body has already absorbed the felt force of saying it. Wallentin's amygdala research is being demonstrated in the prosody itself: the affective onset precedes the cognitive integration. Dante engineered the schedule.",
    },

    passage3: {
      citation: "Paradiso, Canto XXXIII, lines 142–145",
      original:
        "A l'alta fantasia qui mancò possa;\nma già volgeva il mio disio e 'l velle,\nsì come rota ch'igualmente è mossa,\nl'amor che move il sole e l'altre stelle.",
      translation:
        "Here vigour failed the lofty fantasy:\nBut now was turning my desire and will,\nEven as a wheel that equally is moved,\nThe Love which moves the sun and the other stars.",
      translationAttribution:
        "trans. Henry Wadsworth Longfellow (1867). Public domain.",
      analysis1:
        "The whole Commedia ends on l'amor che move il sole e l'altre stelle, and there is, in European poetry, no denser semantic load placed on a single closing line. L'amor — not romantic love, not affection, but the metaphysical principle of motion that medieval theology saw as the prime mover. Move is the verb at the structural center: love is what moves, in the sense of physical motion, the sun and the other stars. The pronoun e l'altre stelle includes the sun in the category of stars and reminds the reader, in passing, that the cosmology has just been revised from earth-centered to something else.",
      analysis2:
        "What the brain-encoding model has no parameters to represent: the tercet's claim that vision failed (qui mancò possa) and love completed what vision began. The Paradiso is structured around the limits of seeing — Dante's vision burns out repeatedly across the final cantos — and the closing tercet stages the moment when the conscious cognitive apparatus simply cannot continue, and something else takes over and finishes the journey. The model can locate the words; it cannot represent the structural event of the words being the last words. The silence after them is part of the finding. So is the silence inside any brain-encoding model when asked what to do with this passage.",
    },
  },

  triangulation:
    "Three movements, three angles. Movement II showed how a brain-encoding model would receive the Commedia — the default-mode signature of extended narrative, the motor-imagery of described descent and ascent, the autonomic response to the emotionally heavy passages. Movement III named the psychic structures — nekyia, wise old man, anima as theological guide, contrapasso as the phenomenology of schema-driven repetition, the final integration that depth psychology can only describe by analogy. Movement IV worked the Italian — the shared possessive of nostra vita, the somatic etymology of ri-cor-dare, the closing line where the model goes thin and the poem completes.\n\nThese three are not three views of the same fact. They are three different inquiries into the same person reading the same poem. The brain regions of Movement II are not the psychic structures of Movement III, and neither is the terza rima itself. The temptation to map nekyia onto a default-mode trajectory, or contrapasso onto basal-ganglia repetition, or the closing love onto a ventromedial valuation signal — each of those collapses costs the observation. Hold all three. Refuse the collapse.\n\nThe Commedia does something none of the three registers can fully describe. It stages a soul learning, in time, what attention is for. The brain encoding model can tell us about reception. The depth-psychological reading can tell us about meaning. The language work can tell us about prosody. The poem is doing what is left.",

  m5: {
    title: "The image.",
    imageAlt:
      "William Blake, The Whirlwind of Lovers (Francesca da Rimini and Paolo Malatesta), 1824–1827",
    imageCredit:
      "William Blake · The Lovers' Whirlwind (Paolo and Francesca) · 1824–1827 · Birmingham Museums Trust · Public domain",
    p1: "William Blake spent the last three years of his life on a set of one hundred and two illustrations for the Commedia. He was sixty-seven when he began, dying of an unidentified wasting illness, with no patron and no clear plan for the works' publication. He completed seven of the watercolours fully; the rest are at various stages of underdrawing. The unfinishedness is not an accident of his death — it is, in retrospect, the right state for the project. Blake was reading Dante as someone reading their own forthcoming death, and the illustrations have the quality of having been made on a deadline that nobody set explicitly.",
    p2: "What Blake saw and chose to render was the prosody. The Whirlwind of Lovers does not show Paolo and Francesca as figures; it shows the wind that carries them, in a single sweeping line that doubles back on itself with the same forward-and-back motion the terza rima has on the page. What Blake chose to leave unrenderable is the conversation. Francesca's speech in Canto V is the most famous monologue in the Inferno, and Blake gives her no mouth. The image is what happens after the words have been said and the wind has them again.",
    p3: "The image, in this room's argument, is the fourth register. The brain encoding model receives the words. The depth-psychological reading interprets the figures. The language work hears the terza rima. Blake's watercolour offers the wind as something a body has actually felt. Four registers, one poem, more remaining.",
  },
};

// ─── Translation helpers ───────────────────────────────────────────

/**
 * Machine-assisted translation tables. The Brain Studio's existing
 * convention is that non-English locales are flagged as
 * machine_assisted + tier1Reviewed: false at the file level; the
 * translation-status banner surfaces this to readers. The text
 * below is starting-point prose for a native review pass, not final
 * copy.
 *
 * The five locales each get their own translation. The English is
 * the canonical source; if a translator wants to depart from a
 * specific English line, they should also update the English so the
 * canonical source stays canonical.
 */

// To keep this script's size manageable, the non-English bundles are
// generated by translating the English structure key-by-key with the
// translation maps below. Long-form prose passages keep the English
// in place with a leading translator's note so the reader sees the
// status banner explicitly rather than reading machine output that
// looks polished. The author can replace any specific passage with a
// hand-translated version at any time.
function localizeWithNotice(en, locale) {
  // Per-locale "translation pending" notice prepended to long-form
  // paragraphs so readers see the status banner explicitly. This is
  // honest about what they're reading.
  const NOTICE = {
    es: "[Traducción en curso · texto original en inglés conservado para revisión nativa]",
    ca: "[Traducció en curs · text original en anglès conservat per a revisió nativa]",
    th: "[การแปลอยู่ระหว่างดำเนินการ · ข้อความต้นฉบับภาษาอังกฤษถูกเก็บไว้สำหรับการตรวจทานโดยเจ้าของภาษา]",
    ja: "[翻訳作業中 · 母語話者による校閲のため英語原文を保持]",
    "zh-CN": "[翻译进行中 · 英文原文保留以供母语者审阅]",
  };
  const notice = NOTICE[locale];
  if (!notice) return en;

  // Recursive: walk the object, prefix string leaves >= 200 chars.
  // Short labels (title, breadcrumb, etc.) get translated below.
  const out = Array.isArray(en) ? [] : {};
  for (const [k, v] of Object.entries(en)) {
    if (typeof v === "string") {
      if (v.length >= 160) {
        out[k] = notice + " " + v;
      } else {
        out[k] = v; // short strings stay English until a translator handles them
      }
    } else if (typeof v === "object" && v !== null) {
      out[k] = localizeWithNotice(v, locale);
    } else {
      out[k] = v;
    }
  }
  return out;
}

// Per-locale short-label overrides for the most-visible chrome strings.
const SHORT_OVERRIDES = {
  es: {
    literary: {
      movement: "Movimiento",
      passage: "Pasaje",
      readingMinutes: "min lectura",
      triangulation: "Triangulación",
      companionLabel: "Sala complementaria",
    },
    faust: {
      label: "Fausto",
      breadcrumb: "Fausto",
      structure: "Cinco movimientos · alemán + español",
      companion: "Continúa con Dante →",
      m1: { title: "El marco." },
      m2: { title: "El cerebro." },
      m3: { title: "La psique." },
      m4: {
        title: "El lenguaje.",
        originalLabel: "Alemán (original)",
        translationLabel: "Español",
        originalPredictionLabel: "Lectura del alemán",
        translationPredictionLabel: "Lectura de la traducción",
      },
      m5: { title: "La imagen." },
    },
    dante: {
      label: "Dante",
      breadcrumb: "Dante",
      structure: "Cinco movimientos · italiano + español",
      companion: "Continúa con Fausto →",
      m1: { title: "El marco." },
      m2: { title: "El cerebro." },
      m3: { title: "La psique." },
      m4: {
        title: "El lenguaje.",
        originalLabel: "Italiano (original)",
        translationLabel: "Español",
        originalPredictionLabel: "Lectura del italiano",
        translationPredictionLabel: "Lectura de la traducción",
      },
      m5: { title: "La imagen." },
    },
  },
  ca: {
    literary: {
      movement: "Moviment",
      passage: "Passatge",
      readingMinutes: "min lectura",
      triangulation: "Triangulació",
      companionLabel: "Sala complementària",
    },
    faust: {
      label: "Faust",
      breadcrumb: "Faust",
      structure: "Cinc moviments · alemany + català",
      companion: "Continua amb Dante →",
      m1: { title: "El marc." },
      m2: { title: "El cervell." },
      m3: { title: "La psique." },
      m4: {
        title: "El llenguatge.",
        originalLabel: "Alemany (original)",
        translationLabel: "Català",
        originalPredictionLabel: "Lectura de l'alemany",
        translationPredictionLabel: "Lectura de la traducció",
      },
      m5: { title: "La imatge." },
    },
    dante: {
      label: "Dante",
      breadcrumb: "Dante",
      structure: "Cinc moviments · italià + català",
      companion: "Continua amb Faust →",
      m1: { title: "El marc." },
      m2: { title: "El cervell." },
      m3: { title: "La psique." },
      m4: {
        title: "El llenguatge.",
        originalLabel: "Italià (original)",
        translationLabel: "Català",
        originalPredictionLabel: "Lectura de l'italià",
        translationPredictionLabel: "Lectura de la traducció",
      },
      m5: { title: "La imatge." },
    },
  },
  th: {
    literary: {
      movement: "บท",
      passage: "ตอน",
      readingMinutes: "นาทีอ่าน",
      triangulation: "การมองสามมุม",
      companionLabel: "ห้องคู่",
    },
    faust: {
      label: "เฟาสต์",
      breadcrumb: "เฟาสต์",
      structure: "ห้าบท · เยอรมัน + ไทย",
      companion: "ไปต่อกับดันเต →",
      m1: { title: "กรอบ" },
      m2: { title: "สมอง" },
      m3: { title: "จิต" },
      m4: {
        title: "ภาษา",
        originalLabel: "เยอรมัน (ต้นฉบับ)",
        translationLabel: "ไทย",
        originalPredictionLabel: "อ่านภาษาเยอรมัน",
        translationPredictionLabel: "อ่านฉบับแปล",
      },
      m5: { title: "ภาพ" },
    },
    dante: {
      label: "ดันเต",
      breadcrumb: "ดันเต",
      structure: "ห้าบท · อิตาลี + ไทย",
      companion: "ไปต่อกับเฟาสต์ →",
      m1: { title: "กรอบ" },
      m2: { title: "สมอง" },
      m3: { title: "จิต" },
      m4: {
        title: "ภาษา",
        originalLabel: "อิตาลี (ต้นฉบับ)",
        translationLabel: "ไทย",
        originalPredictionLabel: "อ่านภาษาอิตาลี",
        translationPredictionLabel: "อ่านฉบับแปล",
      },
      m5: { title: "ภาพ" },
    },
  },
  ja: {
    literary: {
      movement: "楽章",
      passage: "一節",
      readingMinutes: "分で読了",
      triangulation: "三角測量",
      companionLabel: "対の部屋",
    },
    faust: {
      label: "ファウスト",
      breadcrumb: "ファウスト",
      structure: "五楽章 · ドイツ語 + 日本語",
      companion: "ダンテへ続く →",
      m1: { title: "枠組み。" },
      m2: { title: "脳。" },
      m3: { title: "プシュケー。" },
      m4: {
        title: "言語。",
        originalLabel: "ドイツ語 (原文)",
        translationLabel: "日本語",
        originalPredictionLabel: "ドイツ語を読む",
        translationPredictionLabel: "翻訳を読む",
      },
      m5: { title: "像。" },
    },
    dante: {
      label: "ダンテ",
      breadcrumb: "ダンテ",
      structure: "五楽章 · イタリア語 + 日本語",
      companion: "ファウストへ続く →",
      m1: { title: "枠組み。" },
      m2: { title: "脳。" },
      m3: { title: "プシュケー。" },
      m4: {
        title: "言語。",
        originalLabel: "イタリア語 (原文)",
        translationLabel: "日本語",
        originalPredictionLabel: "イタリア語を読む",
        translationPredictionLabel: "翻訳を読む",
      },
      m5: { title: "像。" },
    },
  },
  "zh-CN": {
    literary: {
      movement: "乐章",
      passage: "段落",
      readingMinutes: "分钟阅读",
      triangulation: "三角测量",
      companionLabel: "姊妹房间",
    },
    faust: {
      label: "浮士德",
      breadcrumb: "浮士德",
      structure: "五个乐章 · 德语 + 中文",
      companion: "继续阅读但丁 →",
      m1: { title: "框架。" },
      m2: { title: "大脑。" },
      m3: { title: "心灵。" },
      m4: {
        title: "语言。",
        originalLabel: "德语 (原文)",
        translationLabel: "中文",
        originalPredictionLabel: "阅读德语",
        translationPredictionLabel: "阅读译文",
      },
      m5: { title: "图像。" },
    },
    dante: {
      label: "但丁",
      breadcrumb: "但丁",
      structure: "五个乐章 · 意大利语 + 中文",
      companion: "继续阅读浮士德 →",
      m1: { title: "框架。" },
      m2: { title: "大脑。" },
      m3: { title: "心灵。" },
      m4: {
        title: "语言。",
        originalLabel: "意大利语 (原文)",
        translationLabel: "中文",
        originalPredictionLabel: "阅读意大利语",
        translationPredictionLabel: "阅读译文",
      },
      m5: { title: "图像。" },
    },
  },
};

function deepMerge(base, overrides) {
  if (!overrides) return base;
  const out = Array.isArray(base) ? base.slice() : { ...base };
  for (const [k, v] of Object.entries(overrides)) {
    if (
      typeof v === "object" &&
      v !== null &&
      !Array.isArray(v) &&
      typeof base[k] === "object"
    ) {
      out[k] = deepMerge(base[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

// ─── Apply to each locale ───────────────────────────────────────────

for (const locale of LOCALES) {
  const fp = path.join(MESSAGES_DIR, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));

  if (locale === "en") {
    data.literary = LITERARY_EN;
    data.faust = FAUST_EN;
    data.dante = DANTE_EN;
  } else {
    const overrides = SHORT_OVERRIDES[locale] ?? {};
    data.literary = deepMerge(LITERARY_EN, overrides.literary);
    data.faust = deepMerge(
      localizeWithNotice(FAUST_EN, locale),
      overrides.faust,
    );
    data.dante = deepMerge(
      localizeWithNotice(DANTE_EN, locale),
      overrides.dante,
    );
  }

  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`[wrote] ${locale}.json — added literary/faust/dante`);
}
