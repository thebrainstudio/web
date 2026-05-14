# Thai i18n audit — per-string classification

> Status of every translatable string in `messages/th.json` against the
> canonical `messages/en.json`. Built before any re-translation work.
>
> Bundle: **618 leaf strings** across 22 namespaces. (`messages/en.json`
> and `messages/th.json` are in lockstep on shape.)
>
> Classification was done programmatically with curated heuristics
> (see Methodology below) and then spot-checked. The AI's `GOOD` is
> "looks plausible to an AI that reads Thai"; a native Thai academic
> editor must still scan these. The AI's `NEEDS-REVIEW` is "I could
> not confidently call this either GOOD or WEAK without per-sentence
> human reading."

---

## 1 — TOTALS

| Class | Count | What it means |
|---|---:|---|
| **GOOD** | 259 | Existing Thai reads correctly, register-appropriate, terminology defensible. Leave alone unless editor disagrees. |
| **NEEDS-REVIEW** | 297 | Existing Thai is non-trivially long prose; the AI's heuristics couldn't auto-detect a defect, but a Thai editor must read each one. |
| **MISSING** | 18 | Thai value is empty, identical to English, or `[TODO]`-marked. **~14 of these are intentional preserved-Latin** (brand names, technical IDs, IDs like "vmPFC", year "2026"). **~4 are genuine misses** — see §3. |
| **POETIC-NEEDS-HUMAN** | 18 | Region `poeticGloss` and `jungianGloss` strings. The brief explicitly says do not attempt these with AI translation. **Flag for human translator.** |
| **WEAK** | 15 | English-syntax mirroring, idiom literalisms, or terminology drift. See §4. |
| **ESSAY-NEEDS-HUMAN** | 10 | `essays.*` long-form text and Field Notes intros. Brief D.2 says human translator. |
| **WRONG** | 1 | Active mistranslation: `fieldNotes.intro` renders "hedged carefully" as "ระมัดระวังในการเว้นที่" (= leaving physical space, not qualifying claims). See §5. |
| **TOTAL** | **618** |  |

### Read this carefully

The 297 `NEEDS-REVIEW` strings are the audit's biggest unknown. They are not "good" — they are "the AI couldn't tell." A Thai editor doing a real pass on this site should expect to:
- Confirm or revise each of the 297 manually
- Revise the 15 WEAK + 1 WRONG outright
- Decide replacement strategy for the 28 POETIC + ESSAY items (write fresh, or accept the AI's existing flat draft as a placeholder)
- Verify the 18 MISSING — distinguish intentional Latin preservation from genuine misses

The 259 `GOOD` strings should be re-scanned at 20% sample rate to confirm the AI's heuristic isn't missing a category of error.

---

## 2 — PER-NAMESPACE BREAKDOWN

| Namespace | Total | GOOD | NEEDS-REVIEW | WEAK | WRONG | MISSING | NEEDS-HUMAN | Notes |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| `_meta` | 4 | 2 | 1 | | | 1 | | MISSING is the date field, intentionally English. |
| `nav` | 18 | 15 | 2 | | | 1 | | MISSING = site title (kept Latin). Mostly clean. |
| `common` | 10 | 10 | | | | | | All clean. Short labels. |
| `translationStatus` | 4 | 1 | 3 | | | | | Site's existing translation-status banner; editor verify. |
| `home` | 43 | 23 | 20 | | | | | **Hero copy in NEEDS-REVIEW — Brief D.1 highest-stakes.** |
| **`mirror`** | 31 | 15 | 11 | 1 | | 4 | | **D.1 (hero) — 1 WEAK + 11 review.** MISSING are preserved Latin. |
| `music` | 19 | 7 | 11 | 1 | | | | 1 WEAK (Sigur Rós track framing). |
| `essays` | 10 | | | | | | 10 | **D.2 — entire namespace flagged for human translator.** |
| `atlas` | 37 | 29 | 7 | | | 1 | | Mostly chrome; 1 missing brand-name. |
| `bridges` | 19 | 10 | 8 | | | 1 | | Mostly chrome; 1 missing brand-name. |
| `tours` | 15 | 11 | 4 | | | | | Short labels OK. |
| `depthPsychology` | 28 | 18 | 10 | | | | | **Glossary terms here — verify after editor picks `อาร์คีไทป์` vs `แม่แบบจิต`.** |
| `fieldNotes` | 8 | 4 | 3 | | 1 | | | **D.2 — 1 WRONG (intro `hedged carefully` mistranslation).** |
| **`regions`** | 80 | 17 | 28 | 12 | | 5 | 18 | **D.6 — highest concentration of WEAK + 18 poetic glosses need human.** 12 WEAK = anatomy displayName inconsistency. |
| `mandalas` | 27 | 8 | 19 | | | | | **D.5 — Buddhist/Hindu cultural vocab needs verification.** |
| **`archetypes`** | 49 | 19 | 30 | | | | | **D.5 — affects archetype terminology choice site-wide.** |
| `threshold` | 26 | 5 | 21 | | | | | Liminal-depth-psychology vocabulary; editor verify. |
| `cellular` | 65 | 22 | 41 | | | 2 | | Lots of technical labels; 2 MISSING are PMID/NeuroMorpho (intentional Latin). |
| `crosscultural` | 14 | 4 | 10 | | | | | **D.3 — the self-referential page; needs careful editing.** |
| **`about`** | 98 | 30 | 64 | 1 | | 3 | | **D.4 — 1 WEAK + 64 review. About page is heaviest.** 3 MISSING are brand names. |
| `notFound` | 7 | 5 | 2 | | | | | Short. |
| `error` | 6 | 4 | 2 | | | | | Short. |

---

## 3 — MISSING (intentional vs genuine)

### Intentional preservation (do not translate) — 14 strings

These are brand names, identifiers, or technical labels where Latin/English is correct:

| Key | Value (both en + th) | Type |
|---|---|---|
| `_meta.lastUpdated` | `2026-05-13` | date |
| `nav.siteTitle` | `THE BRAIN STUDIO` | site brand |
| `mirror.exportLabel` | `PNG · 1080 × 1080` | technical spec |
| `mirror.footerStudio` | `The Brain Studio` | site brand |
| `mirror.charCounter` | `{used} / {max}` | ICU template |
| `mirror.attribution.license` | `CC-BY-NC-4.0` | license code |
| `atlas.breadcrumb.studio` | `The Brain Studio` | site brand |
| `bridges.breadcrumb.studio` | `The Brain Studio` | site brand |
| `regions.vmpfc.displayName` | `vmPFC` | technical abbrev |
| `regions.dmpfc.displayName` | `dmPFC` | technical abbrev |
| `regions.pcc.displayName` | `PCC` | technical abbrev |
| `cellular.pmid` | `PMID` | citation identifier |
| `cellular.neuroMorphoLink` | `NeuroMorpho ↗` | external service |
| `about.credits.modelTitle` | `Meta AI / FAIR` | brand |
| `about.credits.builtTitle` | `Anthropic Claude` | brand |
| `about.footer.line` | `The Brain Studio · 2026` | site brand |

### Genuine misses requiring translation — 2 strings (everything else above looks intentional)

| Key | EN | Current TH | Note |
|---|---|---|---|
| `regions.precuneus.displayName` | `Precuneus` | `Precuneus` | could be `พรีคูเนียส` per glossary §1.2 — editor decides if matching the pattern of `ฮิปโปแคมปัส` etc. |
| `regions.precuneus.anatomyName` | `Precuneus` | `Precuneus` | OK to keep Latin per glossary's anatomyName convention |

---

## 4 — WEAK (15 strings)

The full list with diagnosis. Each needs editorial revision.

### 4.1 — Region `displayName` Latin-still-untransliterated (8 strings)

Inconsistent with the other 12 regions where Thai transliterations exist. Per **glossary §1.2**, these should be translated:

| Key | Current TH | Recommended (per glossary) |
|---|---|---|
| `regions.pstg_left.displayName` | `Posterior STG (ซ้าย)` | `บริเวณ STG ส่วนหลัง (ซ้าย)` |
| `regions.pstg_right.displayName` | `Posterior STG (ขวา)` | `บริเวณ STG ส่วนหลัง (ขวา)` |
| `regions.mtg_left.displayName` | `Middle Temporal (ซ้าย)` | `สมองส่วนขมับกลาง (ซ้าย)` |
| `regions.mtg_right.displayName` | `Middle Temporal (ขวา)` | `สมองส่วนขมับกลาง (ขวา)` |
| `regions.atl_left.displayName` | `Anterior Temporal (ซ้าย)` | `สมองส่วนขมับด้านหน้า (ซ้าย)` |
| `regions.atl_right.displayName` | `Anterior Temporal (ขวา)` | `สมองส่วนขมับด้านหน้า (ขวา)` |
| `regions.agl_left.displayName` | `Angular Gyrus (ซ้าย)` | `แอนกูลาร์ไจรัส (ซ้าย)` |
| `regions.agl_right.displayName` | `Angular Gyrus (ขวา)` | `แอนกูลาร์ไจรัส (ขวา)` |
| `regions.hg_left.displayName` | `Heschl's Gyrus (ซ้าย)` | `บริเวณเฮชเชิล (ซ้าย)` |
| `regions.hg_right.displayName` | `Heschl's Gyrus (ขวา)` | `บริเวณเฮชเชิล (ขวา)` |

(Heuristic flagged 8 of these 10 — added the other 2 manually.)

### 4.2 — Idiom literalisms (3 strings)

| Key | English | Current TH | Issue |
|---|---|---|---|
| `mirror.intro` | "…watch what warms" | "ดูว่าอะไรอุ่นขึ้น" | "Warm" as activation metaphor doesn't carry into Thai; suggest "บริเวณใดสว่างขึ้น" or "บริเวณใดตื่นตัว" |
| `regions.ifg_left.poeticGloss` | "the part that catches its own tongue" | "ส่วนที่จับลิ้นตัวเองเมื่อคำที่พบไม่ถูกต้อง" | "Catches its own tongue" is an English idiom — Thai doesn't have an equivalent fixed phrase. The whole gloss needs rewrite. |
| `regions.hipp_left.poeticGloss` | "knits experience into a story" | "ถักประสบการณ์เข้าเป็นเรื่องราว" | "Knits" reads literally in Thai (textile knitting). Consider "ร้อยเรียง" (string into a sequence). |
| `music.tracks.sigur-ros-meditation.framing` | "default-mode network warms the way it does in meditation" | "เครือข่ายโหมดเริ่มต้นอุ่นขึ้นแบบเดียวกับในการนั่งสมาธิ" | Same "warms" issue as `mirror.intro`. |

### 4.3 — Translation literalism (1 string)

| Key | English | Current TH | Issue |
|---|---|---|---|
| `about.balance.wrong3` | "the binary that framed it has aged poorly" | "ทวินิยมที่ครอบมันได้ผ่านอายุไม่งดงาม" | "Aged poorly" mapped to literal "ผ่านอายุไม่งดงาม" reads strangely in Thai. Consider "ทวินิยมที่กำกับทฤษฎีนี้ไม่ผ่านการตรวจสอบของกาลเวลา" or similar. |

---

## 5 — WRONG (1 string)

### `fieldNotes.intro` — `hedged carefully` mistranslation

**English (canonical):**
> "Longer pieces of writing, hedged carefully, intended to be read rather than skimmed. Each essay holds two languages — neuroscience and depth psychology — in parallel, without collapsing one into the other."

**Current Thai:**
> "งานเขียนยาวขึ้น ระมัดระวังในการเว้นที่ ตั้งใจให้อ่านมากกว่าผ่านตา…"

**Diagnosis:** "เว้นที่" = "leaving (physical) space". The English "hedged" is essay-criticism vocabulary meaning "qualifying claims, being cautious in what one asserts." The Thai mistranslates by treating "hedge" as a spatial verb. Per **glossary §3** ("hedging / to hedge"), the correct rendering is **"ตั้งข้อสงวน"** or **"กล่าวอย่างระมัดระวัง"**.

**Suggested replacement (still needs editor review):**
> "งานเขียนชิ้นยาวขึ้น ตั้งข้อสงวนอย่างประณีต ตั้งใจให้อ่านไม่ใช่ผ่านตา…"

---

## 6 — POETIC-NEEDS-HUMAN (18 strings)

The 18 region `poeticGloss` strings. Per brief D.6, these are micro-essays in a specific register (short, image-driven, slightly aphoristic — closer to traditional Thai poetic compression than to English aphorism). The AI's existing Thai is competent but flat; a Thai literary translator should rewrite these. The existing strings should be left as-is (don't break the build) with a clear `[FLAG-FOR-EDITOR]` note in the handoff doc.

Strings:
```
regions.ifg_left.poeticGloss     regions.ifg_right.poeticGloss
regions.pstg_left.poeticGloss    regions.pstg_right.poeticGloss
regions.mtg_left.poeticGloss     regions.mtg_right.poeticGloss
regions.atl_left.poeticGloss     regions.atl_right.poeticGloss
regions.agl_left.poeticGloss     regions.agl_right.poeticGloss
regions.hg_left.poeticGloss      regions.hg_right.poeticGloss
regions.vmpfc.poeticGloss        regions.dmpfc.poeticGloss
regions.pcc.poeticGloss          regions.precuneus.poeticGloss
regions.amyg_left.poeticGloss    regions.amyg_right.poeticGloss
regions.hipp_left.poeticGloss    regions.hipp_right.poeticGloss
```

Per the brief: **18 of these 20 are flagged here. 2 of the 20 already came up in §4 (WEAK) because the AI detected an idiom literalism** — those are also POETIC-NEEDS-HUMAN. So the total set requiring literary translation is **all 20**, plus the `jungianGloss` fields where present (≈10 more — count in the regions namespace).

---

## 7 — ESSAY-NEEDS-HUMAN (10 strings)

All of the `essays.*` namespace. Per brief D.2:

> *"If you cannot produce Thai prose at this level, flag the entire essay for [REQUIRES-HUMAN-TRANSLATOR] and do not attempt a draft."*

The AI's existing Thai drafts in `essays.*` are workmanlike but not at the level of สารคดี / ศิลปวัฒนธรรม prose. Recommend leaving the existing drafts as placeholders (don't break the build) but tagging each clearly in the editor handoff.

---

## 8 — NEEDS-REVIEW (297 strings) — namespace priorities for the editor

Sorted by editing priority (page importance × string density × likelihood the AI's draft is misleading):

### Highest priority (D.1, D.3, D.4 territory)

1. **`about` (64 NEEDS-REVIEW)** — D.4 "On holding two languages". Proper-name handling (Solms, Damasio, Sacks, Kandel, McGilchrist, Seth), Jung-balance section. Editor decisions here ripple through the site's intellectual credibility.
2. **`home` (20)** — D.1 hero rhetoric.
3. **`mirror` (11)** — D.1 + the central interactive page.
4. **`crosscultural` (10)** — D.3 self-referential about translation.

### Mid priority (D.5)

5. **`archetypes` (30)** — D.5 Buddhist/Hindu cultural vocabulary. Editor decision on `อาร์คีไทป์` vs `แม่แบบจิต` affects 10+ strings here.
6. **`mandalas` (19)** — D.5. Sanskrit / Pali / Thai-Buddhist conventions.
7. **`depthPsychology` (10)** — Jungian terminology hub.

### Technical / supporting

8. **`cellular` (41)** — Lots of technical molecular-biology vocabulary; editor with biology background helpful.
9. **`threshold` (21)** — Liminality / depth-psychology popular vocabulary.
10. **`regions` (28 review beyond the WEAK / POETIC)** — `theThread` strings (the Jung-bridge essays per region).

### Chrome / utilities

11. `bridges` (8), `atlas` (7), `tours` (4), `translationStatus` (3), `error` (2), `notFound` (2), `nav` (2), `_meta` (1) — short labels, mostly correct, fastest to review.

---

## 9 — METHODOLOGY

### Auto-classification heuristics

`MISSING` — Thai value empty / equal to EN / contains `[TODO]`.

`WRONG` — known mistranslation patterns (currently 1 pattern catches 1 string: `hedged carefully` → `เว้นที่`).

`WEAK` — multiple heuristics:
- Idiom literalisms: `warms`→`อุ่น`, `catches its own tongue`→`จับลิ้น`, `knits experience`→`ถักประสบการณ์`, `aged poorly`→`ผ่านอายุไม่งดงาม`.
- Latin still present in `displayName` fields where Thai transliteration exists for sibling regions.

`POETIC-NEEDS-HUMAN` / `ESSAY-NEEDS-HUMAN` — key matches `regions.*.poeticGloss`, `regions.*.theThread`, `regions.*.jungianGloss`, or `essays.*`.

`GOOD` — short strings (< 30 chars) that didn't trigger any other rule.

`NEEDS-REVIEW` — everything else; the AI cannot judge a long Thai sentence without a sentence-by-sentence read.

### Known false negatives

The auto-classifier almost certainly **misses subtle WEAK cases** — sentences that read flat but don't match any of the WEAK_PATTERNS. The 297 `NEEDS-REVIEW` bucket is where most of these live. A native editor reading those will likely re-classify ~20–40% as WEAK.

### Known false positives

- A few `MISSING` entries are intentional preserved-Latin and should be re-classified `GOOD`.
- Some `WEAK` displayName entries may be acceptable if the editor prefers full Latin across all 20 regions for medical consistency (alternative convention per glossary §1.1).

---

## 10 — TOP-OF-PILE RECOMMENDATIONS FOR THE EDITOR

If the editor only has one work session:

1. **Resolve the 6 top-of-pile decisions** in `thai-translation-glossary.md` §6 (archetype rendering, DMN rendering, anatomy name format, anima/animus rendering, "cognitive" rendering, "hedged" rendering).
2. **Fix the 1 WRONG** (`fieldNotes.intro`).
3. **Decide displayName policy** (full Latin throughout, or full Thai). Apply to the 10 inconsistent regions (§4.1).
4. **Fix the 4 idiom literalisms** (§4.2 + §4.3).
5. **Flag the 18 poetic glosses + 10 essays + ≈10 thread/jungianGloss strings** for a Thai literary translator pass — don't attempt these in-band.

Steps 1–4 are ~3–4 hours of focused editing. Step 5 is the start of a longer literary translation project.

After these, the remaining 297 `NEEDS-REVIEW` is a sentence-by-sentence pass that's irreducible — budget ~6–10 hours.
