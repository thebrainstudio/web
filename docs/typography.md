# Typography system

A three-font system plus a Thai fallback. Six semantic components are
the only way to render content text. The discipline IS the design.

## The four typefaces

| Slot | Variable | Font | Source | Used for |
|------|----------|------|--------|----------|
| Content | `--font-editorial` | **Fraunces** (shim for PP Editorial New) | Google Fonts SIL OFL | Display, Heading, Body, Caption — everything that reads |
| Technical | `--font-mono` | **JetBrains Mono** | Google Fonts | Numerical / technical text only |
| Marginalia | `--font-hand` | **Caveat** | Google Fonts | Hand-written asides — **hard cap 10 instances/page** |
| Thai fallback | `--font-thai` | **Noto Serif Thai** | Google Fonts | Automatic glyph fallback inside `font-editorial` text |

### Why Fraunces, not PP Editorial New

PP Editorial New is a proprietary Pangram Pangram typeface — I can't legally
ship it from my own tools, and their site gates downloads behind a form.
Fraunces is the closest free editorial serif: variable, opt-in italic, optical
sizing, soft axis. The CSS variable is named `--font-editorial` (not
`--font-fraunces`), so when you license PP Editorial New, only the `@font-face`
declarations in `app/fonts.ts` need to change.

To swap in real PP Editorial New later:
1. Place licensed files under `public/fonts/pp-editorial-new/`.
2. In `app/fonts.ts`, replace the Fraunces import with a `localFont({…})` call
   pointing at the same `variable: "--font-editorial"`.
3. Adjust `tabular`/`opsz` axis usage if PP Editorial New exposes them
   differently.

## The semantic component API

All in `components/typography/Typography.tsx`. The only content text
primitives in the site.

| Component | Renders | Size | Italic? | Notes |
|-----------|---------|------|---------|-------|
| `<Display>` | `<h1>` (default) / `h2` / `div` / `span` | `text-display` (4.5rem) | `italic` prop | Hero only; ultralight weight |
| `<Heading>` | `<h2>` / `h3` / `div` / `span` | `text-heading` (2rem) | `italic` prop | Section titles, room card titles |
| `<Body>` | `<p>` / `div` / `span` | `text-body` (1rem) | `italic` prop | Paragraphs, descriptions |
| `<Caption>` | `<span>` / `p` / `div` | `text-caption` (13px) | `uppercase` prop | Eyebrows, footer, nav labels |
| `<Mono>` | `<span>` / `p` / `div` / `code` | `variant` controls size | n/a | `value` (display-sized number), `label` (caption), `code` (inline) |
| `<Hand>` | `<span>` | `text-body` | n/a — always italic feel | Marginalia. ≤10 per page. Random −1°..+1° rotation per instance. |

### Italic-as-voice

The italic prop on Display / Heading / Body is the editorial mood — the
typeface's other voice. Use italic when the line is reflective, intimate,
slightly off the rails. Reserve roman for the spine of the text.

Examples:
- `<Display italic>"There is a model that predicts what your brain will do."</Display>` — hero
- `<Heading italic>"It is a model of the average brain."</Heading>` — the honest caveat
- `<Body italic>"…the part of you that's still you when you stop trying."</Body>` — poetic gloss

### Mono variants

`<Mono variant="value">` — the large display-sized number (used for
activation values, hero data). Renders at `text-display` size.

`<Mono variant="label">` — caption-sized technical text (time codes,
citations, debug numbers).

`<Mono variant="code">` — caption-sized inline code with a faint
indigo-smoke panel background.

### The 10-instance soft cap on `<Hand>`

`<Hand>` keeps a module-level instance counter (reset on `popstate` —
that is, on browser navigation). In dev mode, mounting an 11th instance
on a single page surfaces a console warning. The rule isn't enforced at
runtime — you can technically ignore it — but the warning catches drift.

If you genuinely need more than 10 hand-drawn lines, the page is asking
to become the thing the marginalia is commenting on. Rewrite it.

## The type scale, locked

Four sizes, set as CSS variables in `globals.css`:

```css
--text-display:   4.5rem  / 72px  / line-height 1.05  / tracking -0.025em
--text-heading:   2rem    / 32px  / line-height 1.15  / tracking -0.015em
--text-body:      1rem    / 16px  / line-height 1.65  / tracking 0
--text-caption:   0.8125rem / 13px / line-height 1.4 / tracking 0.02em
```

Tailwind v4 picks these up via `@theme` and exposes them as `text-display`,
`text-heading`, `text-body`, `text-caption` utility classes. **Do not use
Tailwind's default scale (`text-xl`, `text-3xl`, etc.) — they're gone by
discipline.** Same for `font-bold`, `font-semibold`, `font-light`. The
weight scale is `font-[200]` (ultralight, display only), `font-[400]`
(regular, everywhere else), and `font-[500]` (medium, mono only).

## Thai fallback

The body font stack ends with `var(--font-thai)`. Any Thai glyphs in a
text run automatically fall through to Noto Serif Thai while Latin glyphs
in the same paragraph render in Fraunces. No code change required to
mix scripts — paste Thai into a `<Body>` and it just works.

## Adding a new section

If you're adding a new page or section and reach for a new font size:
**stop.** Use the four that exist. The variety in the system comes from
italic, color, tracking, and stagger — not from new sizes.

If you're adding a new typeface for any reason: **stop.** Three content
typefaces (plus the Thai fallback) is the system. Drift is the enemy.

## How to test the Thai fallback

Paste this into any `<Body>` element and load the page:

```
The model was trained on English. นี่คือข้อความภาษาไทย — what it cannot translate.
```

Latin renders in Fraunces; the Thai phrase automatically renders in Noto
Serif Thai. Both sit at the same `text-body` size and visual weight.

## Replacements still to do (per `STUBS.md`)

- `app/test-brain/page.tsx` and `app/test-scroll/page.tsx` still use raw
  HTML headings (debug routes, lowest priority). Migrate when polishing.
- Future room implementations (Mirror, Music, Cross-Cultural) must follow
  the recipes in the v1 prompt's Phase 5 — region cards use
  `Heading` + `Body italic` + `Mono variant="value"`; field notes use
  `Hand`; citations use `Mono variant="label"`.
