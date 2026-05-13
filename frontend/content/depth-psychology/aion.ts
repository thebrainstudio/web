/**
 * Aion — Jung on the Self and the Shadow.
 *
 * Voice note: Aion is Jung's 1951 work. The page handles two of its
 * core concepts — the Self and the Shadow — because both have
 * partial empirical bridges to contemporary neuroscience and both
 * are well-known enough to ground the reader. The wider Aion text
 * extends into Christian theology, Gnosticism, and the symbolism
 * of the fish; those territories are acknowledged in passing but
 * not extended, in keeping with the site's discipline.
 *
 * The Bridges page rates the empirical correspondence at each
 * point — tight for the psychological Self/DMN mapping; partial
 * for the Shadow / inhibitory-control mapping; none for the
 * transpersonal Self. The prose here points the reader to the
 * Bridges page for the careful rating discussion.
 */

import type { DepthPsychologyEntry } from "./types";

export const aionEntry: DepthPsychologyEntry = {
  slug: "aion",
  title: "Aion: the Self and the Shadow",
  subtitle:
    "Jung's late synthesis. The two concepts whose neural correlates the contemporary literature has most directly engaged.",
  publishedAt: "2026-05-13",
  wordCount: 1080,
  readMinutes: 7,
  bridgeSections: ["dmn-and-self-system", "implicit-cognition-unconscious", "where-bridges-fail"],
  atlasRegions: ["pcc", "precuneus", "vmpfc", "dmpfc", "ifg_right"],
  paragraphs: [
    "The book Aion was published in 1951, in the late stage of Jung's working life, and it tried to gather into one frame the principal concepts he had spent forty years describing. Two of those concepts have travelled further than the others, into general use and into the contemporary empirical literature. The Self — a word Jung capitalized to mark the difference between the conscious self that thinks and explains and the larger totality that includes the conscious self as one figure in a wider field. And the Shadow — the disowned, unwanted, unrecognized aspects of personality that the conscious self has set aside.",
    "Both concepts are now partly visible from the neuroscience side. Neither is fully so. The honest reading on this page tracks what bridges, what does not, and where the two languages remain genuinely distinct.",

    "## The Self",

    "Jung used the word Self for something specific. Not the colloquial sense of \"who I am as a person.\" Not the philosopher's identity-self. The Jungian Self is the totality of psyche, conscious and unconscious together — and the conscious self is one part of it, often the smaller part, the figure standing in the lit room while the dark rooms hold the rest of the house. Jung's account of individuation, the long lifelong work of integrating what the conscious self has not yet acknowledged, is the work of bringing the rest of the Self into relation with the conscious self.",
    "On the neuroscience side, the Default Mode Network now has a substantial account of what part of this concept lives in the brain. The network is reliably recruited during autobiographical memory retrieval, self-referential evaluation, the simulation of other minds, and mind-wandering — the activity that emerges when external task demands fall away and the inner content of the mind drifts. Carhart-Harris and Friston's 2010 paper explicitly mapped the DMN onto what Freud called the ego, and the picture extends naturally to part of what Jung called the Self.",
    "The bridge is tight at this level. The autobiographical, simulating, self-referential layer of what Jung called the Self has an empirical face in the DMN. The careful reader can follow the bridge fully in the [Bridges page section on the DMN and the self-system](/bridges#dmn-and-self-system).",
    "What the bridge does not capture is Jung's wider metaphysical claim. The Jungian Self in its larger formulation includes transpersonal dimensions — the participation of the individual psyche in something that is not exhausted by the individual. Jung gave this dimension extensive treatment across his work, with extensive readings of religious and alchemical material, and the neuroscience does not address it. The Bridges page [section on where the bridges fail](/bridges#where-bridges-fail) names this directly: partial bridge for the psychological Self, no bridge for the transpersonal Self.",
    "Mistaking the partial bridge for the full one is the single most common over-claim in popular accounts of this material. The careful position is that the empirical literature has illuminated part of what Jung was tracking, and the rest remains philosophical and theological territory that the empirical methods are not designed to address.",

    "## The Shadow",

    "The Shadow is the simpler concept and the more clinically useful one. It names the parts of personality the conscious self has disowned — the aggression the gentle person does not admit to, the dependency the proudly-self-sufficient person cannot acknowledge, the cruelty the kind person has stopped seeing in themselves. Jung's clinical observation was that these disowned parts do not disappear. They continue to operate, often through projection onto others, and often with consequences the conscious self does not see and could not predict.",
    "The neuroscience side here is partial and at a different level of resolution. There is no single brain region that holds the Shadow. There is, however, a now-substantial empirical literature on motivated forgetting and on the inhibitory control of unwanted content — both behavioural and at the neural-substrate level. Michael Anderson's 2004 paper in Science demonstrated neural correlates of voluntary memory suppression: subjects who actively tried not to remember target words showed increased prefrontal control activity, reduced hippocampal activation, and impaired retention. The mechanism is not Freud's repression in the strong sense; it is voluntary suppression. But it is the first clean neural correlate of an active forgetting process, and it does not flatter the strict cognitivist view that there is no such thing.",
    "The fuller story crosses several systems. Right inferior frontal gyrus is consistently recruited during inhibitory control more generally. The medial prefrontal cortex participates in the self-referential evaluation that decides what is mine and what is not. The Bridges page [section on implicit cognition and the unconscious](/bridges#implicit-cognition-unconscious) discusses the empirical case for unconscious processing in general, of which Shadow-like phenomena are one part.",
    "What the bridge does not say is that any specific Shadow content is stored anywhere in particular. Jung's claim was about a kind of psychic functioning — that the conscious self systematically excludes content that does not match its picture of itself, and that the excluded content does not stop operating. The neuroscience supports that broad picture; it has not pinned down what any particular individual's Shadow contains.",

    "## What this page is for",

    "Aion is a long and difficult book, and the present page is not a summary of it. The page is a careful accounting of which of Jung's two best-known late concepts have empirical neighbours in the contemporary literature, and in what register the bridge holds. For the autobiographical-self component of the Jungian Self, the bridge is tight. For the inhibitory-functioning component of the Shadow, the bridge is partial. For the transpersonal dimensions of the Self, the bridge does not exist — and the recognition of that is itself part of the discipline this site is trying to keep.",
    "The Bridges page is the central index for these mappings. From there the reader can follow the empirical literature in detail. The depth-psychological reading offered here is a partner to that empirical reading, not a competitor with it. Both languages are partial. Holding them together without collapsing one into the other is the harder work, and the work this layer of the site is built to support.",
  ],
};
