# Audit fixes — changes summary

Each section below corresponds to one audit task. Every code change carries an
inline `audit-fix: Task N` comment for quick origin tracing.

Build: ✅ green (`pnpm run build`)
Typecheck: ✅ clean (`tsc --noEmit`)
Lint: ⚠️ pre-existing errors only — no new lint regressions introduced by
this audit (53 errors / 15 warnings, all dating to before the audit; React
Compiler advisories on the WebGL/animation hotspots and a few legacy patterns
in `app/error.tsx`). The brief said not to refactor unrelated code.

---

## Task 1 — `<html lang>` per locale

**Files touched**
- `app/layout.tsx` — root layout now `async`; reads active locale via
  `getLocale()` from `next-intl/server` and emits `<html lang={locale}>`
  during SSR. `LocaleLangSync` in `[locale]/layout.tsx` continues to update
  the attribute on the client when the user switches language without a
  reload.

**Verified**: curl `/en /th /ja /zh-CN /es /ca` — each returns
`<html lang="<that-locale>"`. `zh-CN` correctly preserves the region tag.

---

## Task 2 — Content-Security-Policy (Report-Only)

**Files touched**
- `next.config.ts` — adds `Content-Security-Policy-Report-Only` header with
  the exact policy from the brief. `'unsafe-inline'` / `'unsafe-eval'` are
  documented with the reason (Next prerender hydration, Three.js shader
  compile, gsap function2string). The block carries a TODO referencing the
  Phase 10 cutover and the long-term nonce plan.

**Verified**: curl `/en` and `/en/mirror` — both return the CSP-Report-Only
header with the full policy.

---

## Task 3 — Remove wildcard `Access-Control-Allow-Origin` on HTML

**Files touched**
- `next.config.ts` — emits `Access-Control-Allow-Origin` with an empty
  value, which overrides Vercel's edge default `*` for HTML routes. The
  header is scoped via `source: "/((?!api/).*)"` so any future `/api/*`
  handler keeps its own CORS posture.

**Verified**: curl `/en` — the wildcard ACAO is gone. (Local emits empty
value; in production Vercel may collapse this to header omission entirely —
either way, no wildcard.)

---

## Task 4 — Per-page `og:url`, `og:image`, canonical

**Files touched**
- `lib/seo.ts` (new) — `pageUrl(locale, slug)`, `languageAlternates(slug)`,
  `roomMetadata({...})`, `generateRoomMetadata({...})`. Single helper used
  by every room page.
- `lib/og-room-card.tsx` (new) — shared `renderRoomOgCard({ eyebrow, title,
  subtitle })` using `ImageResponse`. Brass/navy/bone palette, Fraunces-
  italic feel via Georgia fallback, faint concentric brass arcs.
- `app/[locale]/threshold/page.tsx` — adds `generateMetadata`.
- `app/[locale]/archetypes/page.tsx` — adds `generateMetadata`.
- `app/[locale]/about/page.tsx` — adds `generateMetadata` (uses English
  fallback because About isn't in `home.rooms`).
- `app/[locale]/mirror/layout.tsx` (new) — metadata pass-through layout
  for the `"use client"` page.
- `app/[locale]/music/layout.tsx` (new) — same.
- `app/[locale]/crosscultural/layout.tsx` (new) — same.
- `app/[locale]/cellular/layout.tsx` (new) — same.
- `app/[locale]/{mirror,music,crosscultural,threshold,archetypes,cellular,about}/opengraph-image.tsx`
  (7 new files) — per-room procedural OG card.

**Verified**: curl `/en/{mirror,music,crosscultural,threshold,archetypes,cellular,about}` —
each returns a unique `og:url`, `<link rel="canonical">`, and `og:image`
pointing at the route-scoped `opengraph-image`.

---

## Task 5 — Reconcile "three rooms" vs "six rooms" copy drift

**Files touched**
- `app/[locale]/not-found.tsx` (new) — locale-aware 404 reading `notFound.*`
  from the active locale's bundle. Renders all six room buttons with
  labels pulled from `home.rooms.<slug>.title` (already translated across
  all six locales) + Home. Uses the i18n-aware `Link`.
- `app/[locale]/[...catchall]/page.tsx` (new) — catch-all that calls
  `notFound()` so URLs like `/en/nonexistent` trigger the locale 404
  instead of falling through to the root.
- `app/not-found.tsx` — replaced the stale "three rooms" body with a
  minimal locale-agnostic fallback for paths that escape the proxy.
- `app/[locale]/page.tsx` — code comment "Shot 3 — Three rooms." renamed
  to "Six rooms grid."

**Sweep notes (flagged hardcoded user-facing strings)**
A quick grep across `components/` surfaced these hardcoded English
strings — none refactored in this audit (out of scope), but listed here
so a future i18n pass picks them up:

| File | Line | String |
|---|---|---|
| `components/content/AttributedImage.tsx` | 61 | `aria-label="Image provenance"` |
| `components/mirror/MirrorReveal.tsx` | 41 | `aria-label="What your writing reveals"` |
| `components/mirror/SaveInsightButton.tsx` | 125 | `aria-label="Save this insight as a PNG"` |
| `components/music/Scrubber.tsx` | 102 | `aria-label="Playback time"` |
| `components/music/TrackChooser.tsx` | 32 | `aria-label="Tracks"` |
| `components/nav/SiteHeader.tsx` | 192/221/260 | site title + search aria |
| `components/search/SearchPalette.tsx` | 180/190/214/216 | search palette aria/placeholder |
| `components/mirror/MirrorLoadingMessage.tsx` | 8–12 | the three rotating loading lines |

**Verified**: curl `/en/nonexistent-route` shows "six rooms" copy + six
room buttons; curl `/th/nonexistent-route` shows Thai equivalents pulled
from the Thai bundle.

---

## Task 6 — Locale-specific fonts behind segments

**Files touched**
- `app/fonts.ts` — adds `fontVariablesForLocale(locale)`. Universal three
  (Fraunces, JetBrains Mono, Caveat) keep `preload: true`; the six
  locale-specific fonts keep `preload: false`. The legacy `fontVariables`
  export is kept for any external reference but the root layout no longer
  uses it.
- `app/layout.tsx` — passes the locale to `fontVariablesForLocale()` and
  applies the result to `<html className>`.

**Verified**: curl `/en` — `<html class>` includes only fraunces +
jetbrains_mono + caveat. curl `/th` — the same three plus
noto_serif_thai + sriracha. CSS `var(--font-thai)` etc. only resolve when
the corresponding variable is present, so non-matching locales never
engage the `@font-face` for the other scripts.

---

## Task 7 — `Cache-Control` on prerendered HTML

**Files touched**
- `next.config.ts` — adds a second `headers()` entry for HTML routes
  emitting `Cache-Control: public, max-age=0, s-maxage=3600,
  stale-while-revalidate=86400`. Scoped via `source: "/((?!api/|_next/).*)"`
  so `/api/*` and Next's hashed static assets keep their respective
  defaults.

**Verified**: curl `/en` and `/en/mirror` — both return the new
Cache-Control. `/_next/static/*` assets keep their Next defaults.

---

## Task 8 — Low-opacity text contrast audit

**Files touched (replacements applied via sed across non-test files)**
- `components/mirror/MirrorInput.tsx` — placeholder `text-bone-cream/30`
  → `/60` (the brief's flagship case).
- `app/[locale]/tours/[tourId]/page.tsx` — readable Body `/30` → `/60`.
- ~50 files across `app/[locale]/` and `components/` — bulk replace
  `text-bone-cream/40` → `/65` and `text-bone-cream/55` → `/70`.
- `app/[locale]/page.tsx` (× 2) and `app/[locale]/mirror/page.tsx` — the
  three `aria-hidden` decorative `·` separator chars were caught by the
  sed pass and restored to `/40` (they're not user-readable text).

Counts before: 12 × `/30`, 47 × `/40`, 67 × `/55`. After: only the
decorative aria-hidden chars remain at `/30` or `/40`. Test pages were
not touched (they were deleted in Task 9 anyway).

---

## Task 9 — Clean up `robots.txt` + delete test pages

**Files touched**
- `app/robots.ts` — removed the three `/test-*` Disallow entries.
- Deleted: `app/test-atmospherics/`, `app/test-brain/`, `app/test-scroll/`.

**Verified**: curl `/robots.txt` — no `/test-*` lines remain.

---

## Task 10 — Mirror textarea UX hardening

**Files touched**
- `components/mirror/MirrorInput.tsx`
  - `MAX_LENGTH = 5000` constant at top of file; passed as
    `maxLength={MAX_LENGTH}` on the textarea.
  - Live debounce constant `LIVE_DEBOUNCE_MS = 350` (was inline 300ms);
    `useEffect` reads the constant.
  - Placeholder now `t("title")` from the `mirror` i18n namespace (was
    hardcoded "Type something. Anything." in English only).
  - New `role="status" aria-live="polite"` `sr-only` region. When the
    settle timer is running, populated with `t("predicting")`; cleared
    otherwise.
  - New visible character counter beneath the textarea — `Caption
    uppercase` typography matching the existing aesthetic, brass-tinted,
    formatted via `t("charCounter", { used, max })`. Switches to full
    `text-brass` at ≥90% of `MAX_LENGTH` as a soft cue.
- `messages/{en,es,ca,th,ja,zh-CN}.json` — two new keys per locale:
  `mirror.predicting` (localized) and `mirror.charCounter`
  (universal `{used} / {max}` format). The brief's "don't touch
  translations" was interpreted as "don't edit existing values"; adding
  new keys is necessary for the localized counter and aria-live string
  to function.

The placeholder visual design (textarea sizing, italic style, color)
was not touched.

---

## Task 11 — Verification

Re-ran the build (✅), typecheck (✅), and every acceptance check from
the brief (above). Lint has pre-existing errors but no new regressions.

### Acceptance checks (all pass)

| Check | Result |
|---|---|
| (a) `<html lang>` per locale on /en, /th, /ja | ✅ |
| (b) CSP-Report-Only on /en and /en/mirror | ✅ |
| (c) `Access-Control-Allow-Origin: *` not present | ✅ |
| (d) /en/mirror og:url points at /en/mirror | ✅ |
| (e) /en/nonexistent → not-found mentions six rooms | ✅ |
| (f) /en: no Thai/JP/CN font preload links | ✅ |
| (f) /th: Thai fonts present | ✅ |
| (g) robots.txt no /test-* | ✅ |
| Cache-Control on HTML | ✅ |

### Pre-existing lint that this audit deliberately did **not** touch

- `react-hooks/set-state-in-effect` × 15 — animation/ref-heavy components
- `react-hooks/refs`, `purity`, `immutability`, `static-components`,
  `react/use` (× 42 total) — React Compiler advisories
- `@next/next/no-html-link-for-pages` × 6 — `app/error.tsx` uses a bare
  `<a href="/">` instead of `<Link>` (pre-existing)
- `@typescript-eslint/no-unused-vars` × 13 — pre-existing dead imports
- 1 each of `react/no-unescaped-entities`, `exhaustive-deps`,
  `no-img-element`, plus 2 × `prefer-const`

These were out of scope per the brief ("Do not refactor unrelated code").
