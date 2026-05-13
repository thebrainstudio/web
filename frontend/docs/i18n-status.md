# Internationalisation — current state

The site speaks six languages via [`next-intl`](https://next-intl.dev/).
English is canonical; the other five locales are machine-assisted and
ship with a visible "under review" banner until a native speaker
clears them.

## What's live

| Locale | URL prefix | Tier-1 strings (nav, common, status, 404/500) | Banner |
|--------|-----------|-----------------------------------------------|--------|
| English          | `/en/*`     | Canonical                | Hidden |
| Thai             | `/th/*`     | Machine-assisted         | Shown  |
| Spanish          | `/es/*`     | Machine-assisted         | Shown  |
| Catalan          | `/ca/*`     | Machine-assisted         | Shown  |
| Japanese         | `/ja/*`     | Machine-assisted         | Shown  |
| Chinese (Simp.)  | `/zh-CN/*`  | Machine-assisted         | Shown  |

### Infrastructure
- `proxy.ts` at repo root (Next 16 convention, replaces `middleware.ts`).
- `i18n/{locales,navigation,request}.ts` hold the locale list,
  locale-aware Link/usePathname wrappers, and the per-request bundle
  loader.
- `app/[locale]/` houses every routable page.
- `app/layout.tsx` keeps the persistent shell (html/body, BrainStage,
  smooth scroll, atmospherics) so the WebGL canvas survives a
  language switch. `app/[locale]/layout.tsx` mounts the
  `NextIntlClientProvider`, the SiteHeader, the under-review banner,
  and the `<main>` tag.
- `LanguageSelector` lives in the persistent nav. Native script +
  English subtitle per locale; a brass/bone dot signals reviewed
  vs. machine-assisted. Preference cached in `localStorage` as
  `preferredLocale`.

### Typography per script
- Latin (en/es/ca): Fraunces + JetBrains Mono + Caveat (unchanged).
- Thai (th): adds Noto Serif Thai + Sriracha. line-height 1.5.
- Japanese (ja): leads with Noto Serif JP + Yusei Magic. line-height
  1.75. `line-break: strict; word-break: keep-all` on paragraphs.
  `.max-w-[36rem]` paragraphs widen to 42rem.
- Chinese Simplified (zh-CN): leads with Noto Serif SC + Long Cang.
  Same rhythm rules as Japanese.

The font cascade is wired so a mixed-script paragraph (Thai mixed with
English, Japanese mixed with Latin author names) renders each glyph
in the right font without component-level work.

## Why `localePrefix: "always"`

We tried `localePrefix: "as-needed"` first so English URLs would stay
clean (`/mirror` instead of `/en/mirror`). With Next 16's `proxy.ts`
the internal rewrite hint at `/` came back as a redirect with the same
URL, producing an infinite redirect loop. Switching to `always` makes
every locale explicit and resolves the issue. This may revert when
next-intl ships full Next 16 proxy compatibility.

## What's been deferred

The following are real work, not lipstick — they're separate commits
on a backlog.

1. **Body-content string extraction.** Every page still has English
   prose hardcoded in JSX (Hero copy, room descriptions, region
   glosses, the Threshold and Field Notes essays, Archetype prose,
   About long-form). Each needs to be moved into the message bundle
   (or into per-locale MDX files for the long-form pieces).
2. **Tier-3 long-form translations.** Threshold (3 movements), the
   two Field Notes essays, the six Archetype essays, the About page.
   Each will be machine-translated and shipped with a
   per-essay-banner clarifying it is awaiting native review.
3. **Locale-aware `<Mono>` / `<Hand>` per component.** The font
   cascade in globals.css handles most cases. CJK monospace looks
   heavy at small sizes; eventually `<Mono>` will swap to
   Noto Sans JP / SC when locale ∈ {ja, zh-CN}.
4. **Cross-Cultural pair expansion.** Currently EN↔TH only. We need
   EN↔JA, EN↔ZH-CN, EN↔ES, EN↔CA pairs (or honest "coming soon"
   stubs).
5. **SEO metadata per locale.** Per-locale page titles, descriptions,
   and OG strings. Sitemap with `hreflang` alternates.
6. **`Intl.NumberFormat` / `Intl.DateTimeFormat` helpers.** Locale-aware
   percentage signs (`67 %` vs `67%` vs `67％`) and date formats.
7. **Native review.** Thai will be reviewed by the site author.
   Spanish, Catalan, Japanese, Chinese still need volunteer reviewers
   to mark `localeMeta[<code>].tier1Reviewed = true`.

## How to mark a translation as reviewed

1. Edit `frontend/i18n/locales.ts` and set
   `localeMeta.<code>.tier1Reviewed = true`.
2. Edit `frontend/messages/<code>.json` and set
   `_meta.tier1Reviewed = true`.
3. The dot in the language selector turns brass; the under-review
   banner disappears for that locale.

## Glossary (in progress)

| English | Thai | Spanish | Catalan | Japanese | Chinese (Simp.) |
|---------|------|---------|---------|----------|-----------------|
| Brain Mirror     | กระจกสมอง        | Espejo Cerebral        | Mirall Cerebral        | ブレイン・ミラー       | 大脑镜像 |
| Cross-Cultural   | ข้ามวัฒนธรรม | Transcultural          | Transcultural          | 異文化               | 跨文化 |
| Threshold        | ธรณีประตู   | El Umbral              | El Llindar             | 閾値                 | 阈值 |
| Archetypes       | แม่แบบจิต      | Arquetipos             | Arquetips              | 元型                 | 原型 |
| Shadow (Jung)    | เงา               | la sombra              | l'ombra                | 影                   | 阴影 |
| Anima/Animus     | อนิมะ/อนิมัส | ánima/ánimus           | ànima/ànimus           | アニマ/アニムス        | 阿尼玛/阿尼姆斯 |
| Collective unc.  | ส่วนรวมจิตไร้สำนึก | inconsciente colectivo | inconscient col·lectiu | 集合的無意識          | 集体无意识 |
| Neuron           | เซลล์ประสาท     | neurona                | neurona                | ニューロン            | 神经元 |
| Synapse          | ไซแนปส์          | sinapsis               | sinapsi                | シナプス              | 突触 |
| Cortex           | คอร์เทกซ์         | corteza                | còrtex                 | 皮質                 | 皮层 |
| Hippocampus      | ฮิปโปแคมปัส       | hipocampo              | hipocamp               | 海馬                 | 海马 |

This glossary lives here for transparency; it will move into the
review workflow doc once the team grows.
