/**
 * Bridges page content — the eleven sections in display order.
 *
 * Prose uses the standard `[cite:id]` inline-marker convention. The
 * `<Prose>` renderer resolves these into brass superscripts with hover
 * popovers. Citation ids must exist in `lib/citations.ts`.
 *
 * Authoring discipline (read before editing):
 *   - Hedge appropriately. "Engages parts of what Jung called" not
 *     "is the neural substrate of."
 *   - Cite every empirical claim. If the claim cannot be cited, drop
 *     the claim or downgrade the section's bridge rating.
 *   - Name failures of bridging as clearly as successes. Section 9
 *     is the centerpiece of the page's honesty.
 *   - Do not write in the voice of either side. The page writes from
 *     outside both, holding both languages as partial.
 *
 * Word count targets per section (from the brief). The renderer
 * surfaces the actual word count at the bottom of the page for
 * future tuning.
 */

import type { BridgeSectionId } from "@/lib/bridges";

export type BridgeParagraphBlock =
  | { kind: "text"; paragraphs: string[] }
  | { kind: "block-quote"; quote: string; attribution: string }
  | { kind: "heading"; text: string }
  | { kind: "rule" };

export type BridgeSectionContent = {
  id: BridgeSectionId;
  blocks: BridgeParagraphBlock[];
};

export const bridgeSectionContent: Record<BridgeSectionId, BridgeSectionContent> = {
  "what-this-page-is-for": {
    id: "what-this-page-is-for",
    blocks: [
      {
        kind: "text",
        paragraphs: [
          "The site has two main intellectual layers. One is neuroscience — the brain mesh on every page, the TRIBE prediction model in the Mirror room, the twenty regions of the Atlas, the cellular view's reconstructed neurons. The other is depth psychology — Jung's individuation, the unconscious in its psychoanalytic and Jungian elaborations, the contemplative thread that runs through the Threshold and Archetypes essays.",
          "These are not the same thing. Neuroscience and depth psychology speak different languages, ask different questions, and produce different kinds of evidence. A peer-reviewed fMRI study and a lifelong analytic dream journal are both serious work, but they are serious in different registers. To pretend they are the same is to flatten both.",
          "And yet — they touch. The contemporary research literature shows real connections between neural mechanism and depth-psychological observation [cite:carhart-harris-friston-2010-default-mode-ego]. The connections are specific. They are not metaphor unless the page says so. They are not proof unless the page says so. This page is a careful inventory of where the two layers meet.",
          "Every bridge below is rated against a four-step scale. **Tight** means clear empirical correspondence and contemporary consensus. **Partial** means the correspondence is real but contested, or limited to one aspect of the depth-psychological concept. **Distant** means the two languages share territory but the mapping is loose; the connection is mostly metaphor or phenomenology. **None** means no honest empirical bridge exists — the two languages are addressing different questions, and that is appropriate.",
          "The reader will see these ratings as small badges at the head of each section. Some sections describe strong bridges; some describe weak ones; section nine describes places where no bridge exists at all. All three serve the site's intellectual honesty. The most consequential move on this page is the willingness to name the failures.",
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
          "The Default Mode Network is the strongest bridge on the site. It is also, partly because of that strength, the one most often overclaimed in popular accounts. The careful version is the one worth telling.",
          "Resting-state functional imaging in the late 1990s and early 2000s identified a consistent pattern: a particular set of brain regions reliably increased its activity whenever subjects rested between experimental tasks, and just as reliably decreased it when the next task arrived [cite:raichle-2001-default-mode]. Before this was named, the signal was treated as nuisance variance — noise to be regressed out. The reframing of that variance as a meaningful network state opened twenty years of subsequent research.",
          "The canonical synthesis is Buckner, Andrews-Hanna, and Schacter's 2008 review, which mapped the network's anatomy and behavioural correlates with what remains, almost two decades on, the field's reference picture [cite:buckner-2008-default-network]. The network's principal nodes are medial prefrontal cortex, posterior cingulate cortex, lateral parts of the inferior parietal lobule (including angular gyrus), and the medial temporal lobe (including hippocampus). Functional connectivity studies have shown that activity in these regions is correlated even at rest, and the strength of those correlations predicts behavioural variables ranging from autobiographical memory ability to vulnerability to ruminative thought [cite:andrews-hanna-2010-default-network-functional].",
          "What the network does, when it does anything, is the part that touches depth psychology. The DMN is reliably recruited during autobiographical memory retrieval — the felt history of being a self over time. It is recruited during self-referential evaluation — judging whether an adjective applies to oneself, for example [cite:northoff-2006-self-referential-meta]. It is recruited during the simulation of other minds, which the cognitive-science literature calls mentalizing and which the psychodynamic literature calls mentalization or the building of an internal working model of the other. It is recruited during prospective thinking — imagining one's own future actions and scenarios. And it is recruited during mind-wandering, when the inner content of consciousness is allowed to drift in the way Jung described as reverie.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "Freud's descriptions of the ego are consistent with the functions of the default-mode and its reciprocal exchanges with subordinate brain systems.",
        attribution: "Carhart-Harris & Friston, 2010, Brain",
      },
      {
        kind: "text",
        paragraphs: [
          "Robin Carhart-Harris and Karl Friston's 2010 paper makes the bridge explicit. The DMN, they argue, occupies the supraordinate position in a hierarchical inference system whose dynamics formally resemble Freud's account of secondary-process thinking, ego function, and reality-testing [cite:carhart-harris-friston-2010-default-mode-ego]. This is not metaphor. The paper is in a major neurology journal, it engages the Freudian framework directly, and its claims are testable.",
          "What the bridge does not say is also important. The DMN is necessary but not sufficient for the self-system. Other networks contribute — particularly the salience network and the central executive network, with which the DMN trades activity in characteristic dynamics. The relationship between DMN activation and the *experience* of being a self is still actively researched, and the relationship between the empirical \"self-system\" and Jung's metaphysically broader concept of the Self is contested. Most reasonable readings hold that the DMN engages parts of what Jung called the Self — the autobiographical self-system, the simulating self — but not the whole. The transpersonal dimensions of Jung's Self require separate handling, and section nine of this page handles them.",
          "What the bridge does say is that the depth-psychological concept of a self-as-internal-construction is no longer a hypothesis without empirical correlates. The construction has anatomy. The anatomy is the medial cortical wall, hippocampal formation, and inferior parietal lobule. The construction is partial. Knowing that does not dissolve the felt-from-inside experience of being a self; it complicates the question of what the self is by showing where, in part, it is.",
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
          "The broadest claim that depth psychology has made — that most of mental life happens outside conscious awareness — is now overwhelmingly supported by cognitive and affective neuroscience. The interesting question is what *kind* of unconscious the evidence supports.",
          "The empirical case begins with implicit memory: subjects can show enduring behavioural effects of past exposures they cannot consciously recall, and the dissociation between implicit and explicit memory has been demonstrated across many experimental paradigms and clinical populations [cite:schacter-1987-implicit-memory]. The same is true for implicit social cognition, including evaluative attitudes that subjects do not consciously hold but consistently express in reaction-time measures, and for the routine automaticity of everyday behaviour — most of what we do, most of the time, is enacted without deliberate decision [cite:bargh-chartrand-1999-automaticity]. Predictive processing accounts of brain function frame this as constitutive rather than incidental: the brain is constantly running unconscious predictions and updating them against incoming evidence; conscious experience is a downstream summary of that activity rather than its origin.",
          "All of this validates the broad psychoanalytic claim about the unconscious. It does not, on its own, validate the specifically Freudian claim that there is a *dynamically* repressed unconscious — content kept out of awareness because conscious access would be threatening. The contemporary cognitive unconscious is mostly not in Freud's sense repressed; it is simply how the brain works. The repression-specific subset is a smaller and more contested part of the larger picture.",
          "Drew Westen's 1998 synthesis is the standard contemporary reading: an enormous amount of what Freud claimed about the unconscious — that it is dynamic, motivationally structured, and influences conscious thought — has held up under empirical scrutiny, even as specific Freudian metapsychology has not [cite:westen-1998-scientific-legacy-freud]. The picture is that broad psychoanalytic intuitions about the structure of mental life were largely correct, while specific Freudian theoretical machinery (the tripartite topographic model, libido as a quasi-physical energy, the death drive) has been revised or replaced.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "Controlling unwanted memories was associated with increased dorsolateral prefrontal activation, reduced hippocampal activation, and impaired retention of those memories.",
        attribution: "Anderson et al., 2004, Science",
      },
      {
        kind: "text",
        paragraphs: [
          "On the question of motivated forgetting specifically — Freud's most contested claim — Michael Anderson and colleagues' 2004 paper in *Science* demonstrated neural correlates of voluntary memory suppression. Subjects who actively tried not to remember target words showed increased prefrontal control activity, reduced hippocampal activation, and subsequent impairment in remembering those words; both prefrontal and hippocampal effects predicted the magnitude of later forgetting [cite:anderson-2004-suppression-unwanted]. This is not Freud's repression in the strong sense — it is voluntary suppression, not the unconscious dynamic Freud described — but it is the first clean neural correlate of an active forgetting process, and it does not flatter the strict cognitivist view that there is no such thing.",
          "On the Jungian side, the contemporary consensus on the collective unconscious is more cautious. Jung's strong version — that we inherit specific memories or images from ancestral experience — does not survive contact with what is now known about heritability and developmental biology. The weaker version — that we inherit forms or possibilities of perception and response, what Jung in CW 9i ¶ 155 actually formulated — has sympathy in evolutionary psychology's account of evolved cognitive primitives, but the relationship is family-resemblance rather than identity [cite:tooby-cosmides-1992-evolutionary-psychology]. Section nine of this page handles the limits more thoroughly.",
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
          "This is the cleanest convergence on the site. Memory neuroscience and depth psychology agree, in a way that does not require translation: the past is not a fixed archive being retrieved. It is reconstructed, and the act of retrieval reshapes the trace.",
          "On the empirical side, the foundational moment is Karim Nader, Glenn Schafe, and Joseph LeDoux's 2000 paper in *Nature*. They showed that consolidated fear memories in rats, when reactivated through retrieval, returned to a labile state requiring fresh protein synthesis to be reconsolidated. Infusion of a protein synthesis inhibitor into the amygdala after retrieval — but not in the absence of retrieval — produced amnesia for the memory [cite:nader-2000-fear-memories-reconsolidation]. The implication was not subtle: the long-standing model of memory as a one-time consolidation followed by stable storage was wrong. Every retrieval is a re-encoding. The trace is not the same after it is recalled as it was before.",
          "Daniel Schacter's *Seven Sins of Memory* synthesized the human-side evidence: memories are systematically distorted by present context, by post-event information, by retrieval cues, by the questions one is asked to ask of one's own past [cite:schacter-2001-seven-sins]. Elizabeth Loftus's decades of work on eyewitness memory and the construction of false memories under suggestion built the clinical and forensic case for the same picture. Eric Kandel's 2006 synthesis tied the molecular work back to the personal-historical scale: at every level from synapse to autobiography, memory is reconstruction [cite:kandel-in-search-of-memory].",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "Consolidation is not a one-time event, but instead is reiterated with subsequent activation of the memories.",
        attribution: "Nader, Schafe & LeDoux, 2000, Nature Reviews Neuroscience",
      },
      {
        kind: "text",
        paragraphs: [
          "The depth-psychological version of the same observation has a longer history. Jung's writing on the psyche as a reorganizer of the past, reshaping recollection in service of present meaning, predates the empirical literature by decades. Freud's *Nachträglichkeit* — usually translated as deferred action or afterwardsness — names the same phenomenon from another angle: the past is constituted retrospectively, from vantage points the past did not itself contain. Contemporary attachment-informed psychodynamic work makes this the operative target of therapeutic change: working through means changing the internal working models, which means rewriting felt memories.",
          "The implication crosses both fields. Identity itself is partly a present-moment construction from materials that the present reshapes. This is the version of memory that survives the empirical literature and the depth-psychological tradition at once. It is also the version that has therapeutic stakes — if memory were a fixed archive, the project of psychotherapy would be much more circumscribed than its proponents have always claimed.",
          "What remains uncertain is the clinical application. Whether intentional memory reconsolidation — as some trauma therapies claim to achieve — is meaningfully different from the natural reconstruction that occurs at every retrieval is still debated. Specific protocols claiming to \"rewrite\" trauma memories have mixed evidence; the basic science is solid, the clinical translation is not yet settled. The careful position is that memory is reconstruction, that this matters for therapy, and that the strongest specific claims about therapeutic memory editing require more evidence than is currently in.",
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
          "The salience network — anchored by the anterior insula and dorsal anterior cingulate cortex, with subcortical contributions including the amygdala — tags incoming stimuli for emotional and motivational significance. William Seeley and colleagues' 2007 paper named the network and showed it as functionally dissociable from the central-executive system: salience activity correlated with anxiety measures, executive activity with task performance [cite:seeley-2007-salience-network]. The network's signature, in subsequent literature, is that it operates fast and largely outside conscious access — the brain has already decided that this matters before consciousness catches up.",
          "Jung's *numinous* names a felt experience that has at least overlapping phenomenology: the sense of being grabbed by something meaningful, weighted with significance before words arrive. Jung adopted the term from Rudolf Otto's *Idea of the Holy* (1917), where Otto coined it to describe the felt structure of religious experience before any theology was attached [cite:otto-1917-idea-of-holy]. Both Otto and Jung were after a phenomenological category, not a neural one: the experience of meaningfulness as something that arrives, not something that is decided.",
          "The bridge is partial. Salience-network activation may underlie what depth psychology has called the felt sense of significance arriving before thought — the priority of importance over articulation. The contemporary literature on rapid affective evaluation, with the amygdala as a fast subcortical valuator, is consistent with that side of Otto and Jung's description.",
          "What the bridge does not capture is the larger move Otto and Jung wanted to make. *Numinous* carries a religious or quasi-religious dimension — connection to the sacred, the holy, what stands in some unspecifiable way outside ordinary experience — that the salience network does not address. The salience network handles \"this matters\"; the numinous, as Otto and Jung used the term, was \"this matters in a way that suggests something larger than the matter itself.\" That extension is phenomenology and theology and human meaning-making, not a brain region. The bridge holds for the *felt significance* layer of the numinous. It does not hold for the *intimation of something beyond* layer. Naming the partial fit is more honest than overstating the full one.",
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
          "If DMN activation maps onto parts of the self-system, then DMN *deactivation* should map onto altered states of self. The literature has taken that hypothesis seriously, and the empirical picture is suggestive without being closed.",
          "Long-term meditators show measurable reductions in DMN engagement during focused-attention tasks, with reductions in mind-wandering-related PCC activity, and changes in DMN connectivity that distinguish them from meditation-naive controls. Judson Brewer and colleagues' 2011 paper is the standard reference [cite:brewer-2011-meditators-pcc]. The finding is not that meditation \"shuts off\" the DMN; it is that the relationship between attention and the DMN is trainable, and that long-term practice changes that relationship in measurable ways.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "The defining feature of primary states is elevated entropy in certain aspects of brain function… entropy is suppressed in normal waking consciousness, meaning that the brain operates just below criticality.",
        attribution: "Carhart-Harris et al., 2014, Frontiers in Human Neuroscience",
      },
      {
        kind: "text",
        paragraphs: [
          "Classical psychedelics — psilocybin, LSD, DMT — produce changes in self-experience that subjects routinely describe in language Otto and Jung would have recognised. Robin Carhart-Harris and colleagues' 2014 entropic-brain paper proposes that these states reflect a collapse of the normally hierarchical, low-entropy organization of brain dynamics, including the DMN's coordinating role [cite:carhart-harris-2014-entropic-brain]. Alexander Lebedev and colleagues' 2015 study with psilocybin, using functional connectivity analysis, linked ego-dissolution ratings specifically to decreased connectivity between medial temporal lobe and high-level cortical regions and to a \"disintegration\" of the salience network [cite:lebedev-2015-ego-dissolution-psilocybin].",
          "The depth-psychology side of this bridge is Jung's individuation. For Jung, individuation was the lifelong process of relativizing the ego against the larger Self — not the destruction of ego but its decentering, its recognition as one figure in a larger psychic field. Ego-dissolution experiences (whether psychedelic, contemplative, or — less safely — psychotic) are, in some readings, sudden vertical slices through what individuation does slowly. The bridge is real. Contemporary psychedelic-assisted-therapy research engages it directly.",
          "Where the bridge does not fully hold is in the equation of altered states with individuation. Individuation is a lifelong developmental process, not a peak experience. Some psychedelic ego-dissolution is associated with positive integration and lasting benefit; some with disorganization, anxiety, and difficult aftermath. The correspondence with Jung's careful framework — in which the ego must remain intact enough to integrate what the encounter reveals — requires more than DMN-deactivation data. The psychedelic literature is exciting and still preliminary; the careful position holds the basic neural correlation as well-supported, and the larger claim about lifelong integration as a separate matter that brain imaging alone will not settle.",
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
          "Jaak Panksepp spent four decades arguing that emotional life has a discrete architecture present across mammals, and that this architecture is largely subcortical, evolutionarily ancient, and operates substantially outside conscious access. His *Affective Neuroscience* (1998) identified seven primary processes: SEEKING, FEAR, RAGE, LUST, CARE, PANIC/GRIEF, and PLAY [cite:panksepp-1998-affective-neuroscience]. His later book with Lucy Biven extended the framework and argued for its consequence for psychopathology and psychotherapy [cite:panksepp-biven-2012-archaeology-mind].",
          "The relevance to depth psychology is direct, and Mark Solms's neuropsychoanalysis program has made the bridge explicitly. Freud's late drive theory — libidinal and aggressive drives as primary motivational forces — was a structural intuition without a brain in which the structure could live. Panksepp's seven systems provide an empirically grounded version of that structural picture. SEEKING, mediated by dopaminergic VTA-nucleus accumbens circuits, corresponds to what classical drive theory called appetitive, forward-moving libidinal energy. FEAR and RAGE correspond to specific psychoanalytic concepts of anxiety and aggression. CARE corresponds to attachment and bonding (linking Bowlby's tradition to subcortical machinery). PANIC/GRIEF corresponds to separation distress, the bedrock of attachment and loss across the lifespan.",
          "What survives the bridge is the basic depth-psychological insight that affect is foundational, structured, and partly pre-conscious — that mental life is not built upward from rational thought but built upward from older emotional systems on which thought is a thin and recent layer. What does not survive — or survives in revised form — is the specific Freudian dual drive theory (libido and Thanatos), which Panksepp's framework does not confirm and which contemporary affective neuroscience treats as a non-mapping. Freud's late death-drive concept, in particular, has no evident place in Panksepp's architecture, and most contemporary psychoanalytic theorists treat it as a metaphysical rather than empirical claim.",
          "The depth-psychological elaborations beyond primary affect — the rich symbolic-imaginative life on which Jung built — sit one layer up. SEEKING contributes to the felt quality of the unconscious as a forward-moving, exploratory force, which is what Jung was tracking when he wrote about the active imagination's vitality. CARE contributes to what Jung described as the felt presence of an inner other. The bridge here is real, but it is a bridge of mechanism to felt structure, not mechanism to symbolic content. The symbols Jung tracked have to be understood as productions of a brain whose affective architecture is now better understood — they are not reducible to that architecture.",
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
          "The embodied-cognition turn in cognitive science has validated a long-standing depth-psychological intuition: cognition is not abstract symbolic manipulation but is shaped through and through by bodily experience, sensorimotor activity, and interoceptive feedback from the viscera [cite:lakoff-johnson-1999-philosophy-flesh]. Antonio Damasio's *Feeling of What Happens* is the canonical popular synthesis on the same point from neuroscience [cite:damasio-feeling-of-what-happens]; Hugo Critchley and Sarah Garfinkel's 2017 review of interoception and emotion is the contemporary reference on the specific neural mechanisms by which bodily state shapes affective and cognitive experience [cite:critchley-garfinkel-2017-interoception-emotion].",
          "The depth-psychology side is older. Gestalt therapy, working from Fritz Perls's training with Wilhelm Reich and Reich's training with Freud, made bodily awareness the practical ground of therapeutic work. Reich's *character armor* was a theory of the body as the bearer of defenses — a chronic muscular configuration as a record of psychic structure. Body-oriented psychotherapies that emerged from this lineage (bioenergetics, Hakomi, somatic experiencing) take seriously what the contemporary embodied-cognition literature now describes mechanistically. Jung's view of the body as the unconscious speaking before the mind has words sits in the same territory.",
          "Damasio specifically credits the broader phenomenological and psychoanalytic tradition for taking the body seriously when academic cognitive science did not [cite:damasio-feeling-of-what-happens]. The insula's interoceptive function provides specific neural substrate for what Gestalt called present-moment bodily awareness. The vagal complex provides neural substrate for the calming-presence work that runs through person-centered, Gestalt, and trauma-informed therapies.",
          "The bridge is partial rather than tight because the empirical literature describes mechanism, while the therapeutic literature describes mechanism plus practice plus relationship plus felt experience over time. The neural facts validate that the body is not peripheral; the clinical claims about what therapeutic body-work actually does for whom under what conditions are a separate, more contested literature. The careful position is that embodied cognition has the depth-psychological tradition's back on the basic point, and that the bridge ends there.",
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
          "This is the most important section on this page. A bridges page that only celebrates connections is dishonest. The serious move is the willingness to name, specifically and without apology, where the two languages do not bridge — and to mean it.",
        ],
      },
      {
        kind: "heading",
        text: "Synchronicity",
      },
      {
        kind: "text",
        paragraphs: [
          "Jung's late-career concept — meaningful coincidence as an acausal connecting principle — has no empirical correlate. The phenomenology of meaningful coincidence is real (pattern recognition, confirmation bias, apophenia all engage related territory), but Jung's specific metaphysical claim about acausal connection is not falsifiable in any current scientific framework. Verdict: no bridge. The topic remains philosophical, not empirical. Treating it as anything else dishonours both sides.",
        ],
      },
      {
        kind: "heading",
        text: "The collective unconscious as literal inherited memory",
      },
      {
        kind: "text",
        paragraphs: [
          "The strong version of the collective unconscious — that we inherit specific memories or images from ancestral experience — does not have empirical support. Heritability of specific cognitive content of that kind is inconsistent with what is now known about developmental biology. The weaker version, which Jung's careful formulation in CW 9i ¶ 155 actually states — that we inherit *forms* or *possibilities* of perception and response — has sympathy in evolutionary psychology's account of evolved cognitive primitives [cite:tooby-cosmides-1992-evolutionary-psychology]. But the strong/weak distinction matters, and many popular Jungian writings collapse it. Verdict: distant bridge for the weak version; no bridge for the strong version.",
        ],
      },
      {
        kind: "heading",
        text: "Specific archetypal contents (the Wise Old Man, the Anima, the Trickster)",
      },
      {
        kind: "text",
        paragraphs: [
          "These are useful clinical and literary categories. They do not map onto brain regions or specific neural systems, and the attempt to find such mappings would be a category error. Archetypal contents are organizations of imagery and narrative function that recur across cultures because they are useful organizations, not because they are stored anywhere as such. Verdict: depth-psychological category, not a neuroscience category. The two languages are doing different work here.",
        ],
      },
      {
        kind: "heading",
        text: "Active imagination as transformative practice",
      },
      {
        kind: "text",
        paragraphs: [
          "Jung's specific method of conscious dialogue with unconscious figures is a clinical and developmental practice with a phenomenology rich enough to fill the *Red Book*. Some adjacent research on imagination and prospective thinking — Daniel Schacter's work on the constructive episodic simulation hypothesis, for example — touches the territory, but no direct empirical investigation of active imagination as a transformative practice exists at clinical scale. Verdict: distant bridge. Phenomenology is rich; mechanism is unclear.",
        ],
      },
      {
        kind: "heading",
        text: "Jung's late mystical-religious synthesis (Aion, Mysterium Coniunctionis)",
      },
      {
        kind: "text",
        paragraphs: [
          "These works engage Christian theology, alchemy, Gnosticism, and the question of the divine in the psyche. Neuroscience does not address those questions, and it is not a failure of either field that this is so. Verdict: no bridge. The two languages are addressing different questions here, and the right response is to leave them in their respective territories.",
        ],
      },
      {
        kind: "heading",
        text: "The Self as Jung's transpersonal concept",
      },
      {
        kind: "text",
        paragraphs: [
          "The DMN bridge (section two) captures part of what Jung called the Self — specifically, the self-system, the autobiographical and simulating self that the empirical literature has now substantially described. It does not capture Jung's broader metaphysical claim that the Self is the totality of psyche of which consciousness is one part, including transpersonal dimensions. Verdict: partial bridge for the psychological Self; no bridge for the transpersonal Self. Mistaking the first for the second is the most common form of overclaim in popular accounts of this material.",
        ],
      },
      { kind: "rule" },
      {
        kind: "text",
        paragraphs: [
          "The framing for this whole section: these failures are not failures of either field. They are honest acknowledgments that depth psychology and neuroscience address overlapping but distinct domains. Some questions are answerable by mechanism. Some are answerable by phenomenology. Some require both. Some require neither — they are philosophical, spiritual, or simply human in ways no scientific method captures. Naming what does not bridge is the discipline that keeps the bridges that do hold honest.",
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
          "A guide for the reader. The site is not a single line of argument; it is a network. The Bridges page sits at the centre, but no page on the site is the final word.",
          "Where a Region Atlas page mentions a depth-psychology concept, the relevant bridge has been rated and a card on the Thread section names that rating. Click the card to land at the matching section here. Where a depth-psychology page mentions neuroscience, the cross-reference points in the reverse direction.",
          "The site does not claim that neuroscience reduces depth psychology to mechanism. It does not claim that depth psychology floats free of mechanism. It holds both languages as partial. Mechanism is partial because mechanism on its own does not say what the mechanism is for, or what it feels like from inside. Phenomenology is partial because phenomenology on its own can describe an experience without saying what underwrites it or why it generalizes.",
          "The harder move is to hold both languages at once without collapsing one into the other. The Bridges page is an inventory of where the two have been seen to touch — and an inventory of where they have not.",
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
          "The two-cultures problem in psychology — psychoanalytic depth on one side, cognitive and affective neuroscience on the other — is not a quarrel that will be resolved by either side winning. Mechanism and meaning are different kinds of accounts, and minds are the kinds of things that can be addressed by both without exhausting either.",
          "What the last twenty-five years of empirical research has done is make the conversation more interesting. Psychoanalysis has accumulated evidence of its own — clinical-process research, attachment research, evidence for psychodynamic psychotherapy as a treatment — and a careful synthesis of Freud's claims against contemporary findings shows substantially more standing than the cognitivist dismissal of the 1970s allowed [cite:westen-1998-scientific-legacy-freud]. Neuroscience has discovered that emotional life and unconscious processing are not vestigial concerns but central architecture, and that the rest of cognition is built on top of them rather than around them. Default Mode Network research has given the self-system a partial neural account. Affective neuroscience has provided the brain's emotional architecture in subcortical detail. Memory science has shown that the past is reconstruction at every scale from synapse to autobiography.",
          "None of this proves Freud or Jung were right. All of it complicates the casual dismissal that declared them dead a generation ago. The version of depth psychology that survives the empirical literature is a chastened version — one that does not float free of biology, that does not claim mechanisms it cannot substantiate, and that does not need to. The version of neuroscience that survives contact with the depth-psychological tradition is one that does not flinch from naming what it is studying, even when what it is studying is what mind is.",
        ],
      },
      {
        kind: "block-quote",
        quote:
          "The mind we are studying is the mind that is studying. To ask what minds are with one language alone is to ask half a question. The serious work is in asking both.",
        attribution: "The Brain Studio",
      },
    ],
  },
};
