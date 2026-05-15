# TODO

Items deferred from the integrity-pass PR (commits 1–3 closed the
hero / badge / percentage gaps). Numbered to match the brief; each
note explains why it's not in this PR.

---

## 1 · License the NeuroMusic audio or remove the room from nav

Two of three NeuroMusic tracks ship with real CC-licensed audio
(Stellardrone "In Time," CC-BY 3.0; King Oliver's Creole Jazz Band
"Dippermouth Blues," 1923, US public domain). The third slot is
honestly silent with a footer noting "awaiting a contributed
recording." Either source a third CC-licensed track or hide the
room until then.

Open paths: Free Music Archive Thai-folk filter; Smithsonian
Folkways CC sub-collection; reach out to a Thai luk thung archive
for explicit CC-BY licensing.

## 2 · Strip remaining `Phase N` references

**Partial — integrity-pass cleaned the heroes** (mirror.label,
music.label, crosscultural.label, crosscultural.submissionForm,
mirror.revealIntro, about.opening.label).

Remaining: body-copy mentions in essays / atlas prose / inline
comments that reference "Phase 10 wiring" or "Phase 11 form
submission," plus comments in source files. Needs a site-wide
grep + rewrite to phrase the same ideas in "remaining work"
register without the phase tag.

## 3 · Voice diversification on closing cadences

The "you-are-whatever-it-is" register and the "this is not your
brain" cadence recur across rooms. Pick three rooms (recommend
Threshold, Faust, Cellular) and write distinct closing lines
without losing the discipline. The voice itself is load-bearing;
the goal is variation in cadence, not new voice.

## 4 · Audit every "oldest / first / only" superlative

**Partial — integrity-pass corrected the Music hero** ("Hearing
is the oldest of the senses to fully form" → factually wrong,
touch develops first → reframed to a true, specific claim about
third-trimester cochlear function).

Remaining superlatives across Atlas, Bridges, Faust, Dante,
Threshold need the same audit. Suggested method: grep for
`oldest|first|only|earliest|fundamental`, fact-check each, and
either tighten the claim or drop the superlative.

## 5 · Real domain + clean GitHub org

The site lives at `brain-studio-kappa.vercel.app`; the source
repo is `dreamsmanifested6666-dotcom/brain-studio`. Both undercut
the academic register the rest of the site works to earn.

Author-side actions:
- Register a domain (suggested: `brain-studio.org` or similar)
  and point at the Vercel deploy.
- Create a new GitHub org (e.g. `brain-studio`) and transfer
  the repo. Update every hardcoded URL across the site (a few in
  `frontend/components/nav/SiteHeader.tsx` GitHub icon hrefs +
  the `lib/seo.ts` canonical URL helper).

## 6 · Accessibility pass with axe DevTools

- Promote `alt` text on every archetypes / mandalas image; some
  currently have generic alts that don't describe the
  iconography.
- Verify contrast on the Faust + Dante background plates; the
  decorative plates at ~6 % opacity should still pass WCAG AA
  for text overlaid on them.
- Keyboard navigation through the Cellular descent (the
  `<Canvas>`-based pages may lack proper focus semantics) and
  through the Encoder Lab video gallery (gallery buttons need
  `aria-pressed` reflecting active selection).
- Screen-reader labels on every brain region (the
  `RegionAnnouncer` exists; coverage is unknown).

## 7 · One end-to-end honest interaction

The Mirror room's `AttributionChip` currently displays "TRIBE v2
(Meta FAIR, d'Ascoli et al., 2026)" when the backend is reachable.
The Render-deployed backend serves **BGE-small embedding
similarity**, not a TRIBE forward pass. The badge added by the
integrity pass renders the correct provenance
(`EMBEDDING BASELINE`); the AttributionChip retains its
license-display role but the model claim it makes is wrong.

Two paths to close this:

**A.** Rewrite `AttributionChip` to honestly name the backend
(BGE-small, Render free tier) and reserve the TRIBE attribution
for the day TRIBE actually serves the response. Same component,
truer copy.

**B.** Wire one genuinely end-to-end TRIBE path: ship a small
Colab-precomputed lookup of region correlations for a curated set
of seed sentences (the existing
`backend/scripts/build_tribe_video_activations.py` is the right
shape) and route the Mirror to those when an exact-or-near match
is found. Then the badge can switch to `TRIBE INFERENCE` for
those cases honestly.

Path B is the brief's preferred direction. Path A unblocks Path B
by removing the false claim in the meantime.

---

# Cinematic backlog

Items deferred from the visual-elevation PR (commits 1–8 landed
the emissive glow + bloom, breathing idle, animated grain, room
temperature, pinned cinematic moments, synapse audio, cursor
light, and scroll-velocity font weight). The items below are real
next steps; each is non-trivial and earns its own PR.

## 8 · Subsurface scattering on cortex

The wet-tissue read goes a step further with proper SSS. Today the
brain uses `meshPhysicalMaterial` with `transmission: 0.15`,
`clearcoat: 0.4`, and per-vertex emissive injection via
`onBeforeCompile`. A custom shader with a thickness map baked from
the mesh would push the cortex from "wet" to "alive" — light
filtering through the outer cortical layers the way it does
through skin. Scope of its own (shader work + asset baking +
mobile-fallback path).

## 9 · Vascular network underlay

Faint pial vasculature visible through the cortex, tinted oxblood
at ~5 % opacity. Needs an anatomical reference image and a
low-poly mesh (or a procedurally-generated branching pattern
mapped to the mesh UVs). Reads as "this organ has a circulatory
system," which the current cortex-only render leaves implicit.

## 10 · Camera transitions between rooms

Rotate-the-brain navigation: changing rooms is a camera move, not
a page reload. Today every room change reloads the page (or
client-side route), which loses the persistent canvas effect.
Refactor of route transitions to a camera tween that interpolates
position + rotation between room-specific brain states. Needs its
own PR.

## 11 · Museum lighting on Archetypes paintings

Each painting in its own light cone. Today the gallery uses the
locale-level lighting; a single warm directional with bone-cream
diffuse. The cinematic move: per-painting light cones that pick up
the dominant colour of each work (oxblood for the Holbein squirrel
patch, gold for the Della Francesca egg, etc.) and falloff outside
that cone. Design iteration on the gallery feel.

## 12 · Mandala rotation tied to scroll

Already partially there via the `Mandala` component's
`rotationSeconds` prop — wire the rotation velocity to scroll
position instead of a constant per-second cycle. The mandala
becomes a scroll-driven gauge. After Archetypes design pass so the
two pages don't compete for the same gesture.

## 13 · Darkness mode (candlelight, ~2400 K reader state)

Whole-site temperature override. The reader can drop the room into
candlelight mode for late-night reading: page background warms,
the brain's emissive bias shifts amber, type weight settles to a
lower wght. Needs UX design — toggle placement, persistence,
locale handling — and explicit consent (not a default on
detection of system dark mode; this is its own choice).

## 14 · 30-second idle cycle

Brain cycles through all room activations with the line "this is
what your brain is doing right now, reading this." Needs
editorial review of the line (it's a load-bearing claim about the
mapping) and accessibility consideration: a moving reading surface
behind static prose is a contraindicated pattern for some readers.
A reduced-motion default for this animation is mandatory; the
default state should be "off."
