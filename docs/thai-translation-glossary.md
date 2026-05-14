# Thai translation glossary — The Brain Studio

> Reference vocabulary for the Thai version of brain-studio-kappa.vercel.app.
> Built before any re-translation of the i18n bundle, per the brief.
> Sources cited inline. A native Thai academic editor should review
> every entry; this document is the AI's best research + reasoned
> choice + honest flag of where the choice is contested.
>
> Author's note on capability: the AI that built this glossary reads
> Thai fluently and recognises register but is not a native speaker.
> All terms marked **[CONTESTED]** have a real ongoing usage debate
> in Thai academic writing and the editor should override the AI's
> pick if their judgement differs. Terms marked **[VERIFY]** mean the
> AI could not find a strong Thai-source confirmation and the choice
> rests on register-reasoning alone.

---

## 1 — NEUROSCIENCE: brain regions

### 1.1 Decision principle for region names

The current `messages/th.json` is **inconsistent** about region naming. Some entries use Thai transliterations (`ฮิปโปแคมปัส`), some Latin (`Hippocampus`), some mixed (`คอร์เทกซ์ prefrontal ventromedial`). A Thai academic reader at JIPP will notice this immediately.

**Recommended convention** (used in Thai medical neuroscience writing at Chulalongkorn / Mahidol):

- **`displayName`** — Thai transliteration where one is established, otherwise English in Latin script. Hemisphere in Thai: `(ซ้าย)` / `(ขวา)`.
- **`anatomyName`** — full Latin anatomical name (English) + hemisphere in Thai. This is the convention in Thai medical schools where Latin nomenclature is taught untranslated for precision. **Don't transliterate the Latin into Thai** — that creates new pseudo-words that no Thai medical reader uses.
- **`scienceGloss`** — Thai prose with the technical noun in English/Latin parenthetical on first use only. Subsequent mentions can use the Thai descriptor.
- **`poeticGloss`** — Thai prose. Region name in the Thai descriptive form, not Latin.

### 1.2 Per-region glossary

| Region ID | English displayName | Thai displayName **[recommended]** | Thai descriptive name |
|---|---|---|---|
| `ifg_left` | Broca's region (L) | บริเวณบรอกา (ซ้าย) | บริเวณบรอกา / Inferior frontal gyrus |
| `ifg_right` | IFG (R) | IFG (ขวา) | สมองส่วนหน้าด้านล่าง (ขวา) |
| `pstg_left` | Posterior STG (L) | บริเวณ STG ส่วนหลัง (ซ้าย) | บริเวณ Wernicke / Posterior STG |
| `pstg_right` | Posterior STG (R) | บริเวณ STG ส่วนหลัง (ขวา) | Posterior STG (ขวา) |
| `mtg_left` | Middle Temporal (L) | สมองส่วนขมับกลาง (ซ้าย) | Middle temporal gyrus |
| `mtg_right` | Middle Temporal (R) | สมองส่วนขมับกลาง (ขวา) | Middle temporal gyrus |
| `atl_left` | Anterior Temporal (L) | สมองส่วนขมับด้านหน้า (ซ้าย) | Anterior temporal lobe |
| `atl_right` | Anterior Temporal (R) | สมองส่วนขมับด้านหน้า (ขวา) | Anterior temporal lobe |
| `agl_left` | Angular Gyrus (L) | แอนกูลาร์ไจรัส (ซ้าย) | Angular gyrus / บริเวณรอยหยักโค้ง |
| `agl_right` | Angular Gyrus (R) | แอนกูลาร์ไจรัส (ขวา) | Angular gyrus |
| `hg_left` | Heschl's Gyrus (L) | บริเวณเฮชเชิล (ซ้าย) | Heschl's gyrus / คอร์เทกซ์การได้ยินขั้นต้น |
| `hg_right` | Heschl's Gyrus (R) | บริเวณเฮชเชิล (ขวา) | Heschl's gyrus |
| `vmpfc` | vmPFC | vmPFC | คอร์เทกซ์ส่วนหน้าด้านล่างใน |
| `dmpfc` | dmPFC | dmPFC | คอร์เทกซ์ส่วนหน้าด้านบนใน |
| `pcc` | PCC | PCC | คอร์เทกซ์ซิงกูเลตด้านหลัง |
| `precuneus` | Precuneus | พรีคูเนียส | Precuneus / รอยนูนพรีคูเนียส |
| `amyg_left` | Amygdala (L) | อะมิกดาลา (ซ้าย) | Amygdala |
| `amyg_right` | Amygdala (R) | อะมิกดาลา (ขวา) | Amygdala |
| `hipp_left` | Hippocampus (L) | ฮิปโปแคมปัส (ซ้าย) | Hippocampus |
| `hipp_right` | Hippocampus (R) | ฮิปโปแคมปัส (ขวา) | Hippocampus |

**[CONTESTED]** — "Angular gyrus" Thai transliteration. Some Thai sources use `ไจรัสเชิงมุม` (literal "angular gyrus"); some use `แอนกูลาร์ไจรัส` (transliteration); some keep English. The recommendation `แอนกูลาร์ไจรัส` matches the convention used for the other transliterated regions but a Thai medical school may prefer either alternative. **Editor verdict needed.**

**[VERIFY]** — The descriptive Thai names for vmPFC / dmPFC are translation reasonings, not standardised terms in Thai. Thai medical writing typically keeps these in English. The descriptive Thai is provided for use in scienceGloss / poeticGloss prose, not as displayName.

### 1.3 Other neuroscience terms

| English | Thai (recommended) | Source / rationale | Status |
|---|---|---|---|
| cortex | คอร์เทกซ์ | Thai medical writing standard transliteration | settled |
| cortical (adj.) | เชิงคอร์เทกซ์ / ของคอร์เทกซ์ | standard | settled |
| subcortical | ใต้คอร์เทกซ์ | standard | settled |
| Default-mode network (DMN) | Default Mode Network (DMN) [Latin preserved] หรือ เครือข่ายโหมดเริ่มต้น | Thai cognitive-neuroscience writers use both; **prefer preserving the English/DMN abbreviation on first use with a Thai gloss in parentheses**, then DMN thereafter | **[CONTESTED]** — Royal Institute has not standardised. Existing th.json uses "เครือข่ายโหมดเริ่มต้น" which is defensible but feels translated. Editor decides. |
| neuron | เซลล์ประสาท / นิวรอน | both standard; เซลล์ประสาท preferred in formal academic writing | settled |
| synapse | ไซแนปส์ / จุดประสานประสาท | ไซแนปส์ standard transliteration; the Thai descriptive is used in textbooks | settled |
| action potential | ศักย์ทำงาน | standard | settled |
| glia / glial cells | เซลล์เกลีย | standard | settled |
| fMRI | fMRI [Latin preserved] | universal | settled |
| neuroimaging | การถ่ายภาพประสาท / ภาพถ่ายสมอง | depending on register | settled |
| encoding model | โมเดลเข้ารหัส | direct, standard in computational neuroscience writing | settled |
| prediction (model sense) | การทำนาย | distinct from เดา (guess) — preserves the technical sense | settled |
| activation (brain region) | การกระตุ้น / การทำงาน | use การกระตุ้น for "activation" in fMRI sense | settled |
| episodic memory | ความจำเชิงเหตุการณ์ / Episodic memory | both used; the existing th.json prefers ความทรงจำเชิงเหตุการณ์ (acceptable variant) | settled |
| semantic memory | ความจำเชิงความหมาย / Semantic memory | standard | settled |
| working memory | ความจำใช้งาน / Working memory | standard | settled |
| salience network | เครือข่ายความเด่น / Salience network | both used; existing th.json uses เครือข่ายความสำคัญ which is a reasonable variant | **[VERIFY]** the Thai cognitive-neuroscience convention; "ความสำคัญ" (importance) vs "ความเด่น" (salience) are not synonymous in psychology |
| cognitive (adj.) | เชิงพุทธิปัญญา / ทางปัญญา / เชิงรู้คิด | the existing th.json sometimes uses ปัญญา which is **too general** — prefer พุทธิปัญญา in academic register, รู้คิด in popular register | **[CONTESTED]** |
| spatial cognitive map | แผนที่ปัญญาเชิงพื้นที่ → recommend **แผนที่เชิงพุทธิปัญญาทางพื้นที่** OR keep "cognitive map" in English with Thai gloss | existing th.json's "แผนที่ปัญญาเชิงพื้นที่" reads awkwardly; "ปัญญา" alone is broader than "cognitive" | needs revision |
| tonotopic | จัดเรียงตามความถี่ / tonotopic [keep English in parens] | tonotopic is highly specialised | **[VERIFY]** |

---

## 2 — DEPTH-PSYCHOLOGY TERMS

These are the highest-risk terms because every Thai academic reader will have seen one of several established Thai translations and will judge the whole site by whether the chosen one matches their school.

### 2.1 The unconscious (Jung sense)

| Thai | Used by | Register |
|---|---|---|
| **จิตไร้สำนึก** ✅ (recommended) | Thai academic psychology, including Jung translation literature ([th.wikipedia](https://th.wikipedia.org/wiki/จิตไร้สำนึก); [ViA บำบัดใจ](https://www.theviatherapy.com/unconscious-mind/)) | academic, Jungian-specific |
| จิตใต้สำนึก | popular psychology, Freud-derived popular usage | colloquial / pop |

**Decision:** use `จิตไร้สำนึก` throughout the site. The site's existing th.json already does this — keep it. **[GOOD]**.

**[FLAG-FOR-EDITOR]** — verify across the site that `จิตไร้สำนึก` is used consistently and that no string slipped into `จิตใต้สำนึก` (the popular variant).

### 2.2 Archetype

| Thai | Used by | Pros / cons |
|---|---|---|
| **อาร์คีไทป์** ✅ (recommended) | Jungian-specific academic writing, brand strategy in Thailand | preserves Jung's specific concept; clearly signals the technical sense; transliteration is recognised in Thai psychology |
| ต้นแบบ | broader "prototype" sense in everyday Thai | too general — also means "original / template" in non-Jungian senses |
| แม่แบบ | branding contexts ([iSTRONG 8 archetypes](https://www.istrong.co/single-post/8-archetypes)) | "mother template" — slight gendered overtone in Thai; popular but not academic-Jungian |
| **แม่แบบจิต** ← current site | hybrid coined by site author | not used in Thai Jungian literature; combines "mother template" + "mind"; reads as a translation rather than a settled term |

**Decision:** **change from `แม่แบบจิต` to `อาร์คีไทป์`** (transliteration with Jung-context). Rationale: a JIPP reader will recognise `อาร์คีไทป์` as the Jung-specific term immediately. `แม่แบบจิต` reads as the site's own coinage. **[CONTESTED]** — if the editor prefers `ต้นแบบจิต` (more conceptual, less anglicised), that's also defensible.

### 2.3 Other Jung terms

| English | Thai (recommended) | Status |
|---|---|---|
| the Self (Jung sense, capital S) | อัตตา (Self) OR ตัวตนแท้จริง | **[CONTESTED]** — Thai Jungian translation literature uses อัตตา for ego in Buddhist contexts and ตัวตน for self in psychological contexts; the Jungian "Self" is sometimes left as "Self" in italic. **[VERIFY]** with editor — context matters. |
| ego | อีโก้ (transliteration) / อัตตา | อัตตา carries Buddhist weight in Thai; for Jungian ego, อีโก้ (transliterated) is unambiguous. **[CONTESTED]** |
| shadow (Jung) | เงา (มืด) / shadow [keep English] | the existing th.json uses เงา which is fine in context, but a reader might confuse it with "shadow = ภาพเงาธรรมดา" — first-use parenthetical helps |
| anima / animus | อนิมะ / อนิมัส (transliteration) | currently the site uses both forms inconsistently — sometimes `anima` (English), sometimes `อนิมะ`. **Decide one and use throughout.** Recommend transliteration. |
| individuation | กระบวนการสร้างปัจเจกภาวะ / Individuation [first-use Latin] | the long Thai phrase is the standard in Thai Jungian literature; recommend Thai + English-in-parens on first mention |
| collective unconscious | จิตไร้สำนึกร่วม / จิตไร้สำนึกส่วนรวม | both used; `จิตไร้สำนึกร่วม` is shorter and matches the modifier pattern of `จิตไร้สำนึก` |
| synchronicity | ซินโครนิซิตี (transliteration) / ปรากฏการณ์ซินโครนิซิตี | the existing site sometimes leaves `Synchronicity` in English — recommend transliteration + parens for first use |
| numinous (Jung sense) | numinous [keep English with Thai paraphrase first use: "ความรู้สึกศักดิ์สิทธิ์ที่เกินคำอธิบาย"] | no settled Thai term for the specific Jung-Otto sense; the existing site keeps `numinous` in English with surrounding Thai context, which is **defensible** |
| active imagination | จินตนาการที่กระทำการ / Active imagination | technical Jung term; first-use parens recommended |

### 2.4 Mandala (D.5 territory)

**Thai vs Buddhist context.**

- มัณฑล (Sanskrit-derived) — used in Thai Theravada Buddhist texts about the Tibetan tradition
- มันดาลา (Pali/popular) — used more colloquially
- มณฑล (มน+ฑล) — sometimes seen but conflated with "circle / round"

**Decision:** use **มัณฑลา** (transliteration matching the Tibetan/Sanskrit) for Tibetan Buddhist mandalas in the archetypes page. For Jungian "mandala as psychological symbol," use **มัณฑลา** with a parenthetical Thai gloss like "(วงกลม / สัญลักษณ์แห่งความสมบูรณ์)". **[VERIFY]** — Thai Buddhist studies has its own conventions; the editor with Buddhist-academic background should override if needed.

### 2.5 Specific cultural traditions on the Archetypes page (D.5)

| English | Thai (recommended) | Notes |
|---|---|---|
| Tibetan Bhavachakra | ภวจักร (วงล้อแห่งภพ) | Thai Buddhist-studies term; never transliterate |
| Hindu Sri Yantra | ศรียันต์ / Sri Yantra | Thai religion-studies usage; Sri Yantra often kept in roman with Thai gloss |
| Mexica Sun Stone | หินสุริยะแห่งเม็กซิกา / Aztec Sun Stone | no standard Thai; descriptive translation |
| Hildegard of Bingen illuminations | ภาพวิวรณ์ของฮิลเดการ์ดแห่งบิงเงน | Hildegard's full name transliterated |
| Bosch (Hieronymus Bosch) | ฮีโรนีมัส บอช | standard transliteration in Thai art-history writing |

---

## 3 — EDITORIAL VOICE TERMS

These have NO direct Thai equivalent and the translation is a register choice, not a lexical choice.

| English | Thai (recommended) | Rationale | Status |
|---|---|---|---|
| **cinematic** | งานภาพยนตร์ / เชิงภาพยนตร์ — but consider rephrasing | a literal translation reads flat in Thai; the rhetorical work of "cinematic" is "deliberate composition, slow camera, time-based" — that may be better captured by "สง่า" or "ประณีต" depending on context | **[CONTESTED]** — the editor should choose per-sentence |
| **cultural object** | วัตถุทางวัฒนธรรม | direct translation works in academic Thai | settled |
| **editorial register** | สำเนียงสารคดี / น้ำเสียงเชิงบรรณาธิการ | the first is more accurate for the prose register; the site's voice is สารคดี-style ([Saраdееmag](https://sarakadee.com/) — Thai literary nonfiction magazine) | settled |
| **felt sense** | ความรู้สึกเชิงร่างกาย / felt sense [keep English with Thai paraphrase] | the Gendlin-derived "felt sense" has no settled Thai term; needs a paraphrase or English | **[VERIFY]** |
| **phenomenology** | ปรากฏการณ์วิทยา | the existing th.json uses this — standard, correct | settled |
| **hedging / to hedge (a claim)** | การตั้งข้อสงวน / การพูดอย่างระมัดระวัง | the existing th.json uses `ระมัดระวังในการเว้นที่` which is **wrong** — "เว้นที่" means "leaving physical space"; "hedging" in essay sense is about qualifying claims | **WRONG in existing — must fix** |
| **what warms** (Mirror prose) | บริเวณใดสว่างขึ้น / บริเวณใดตื่นตัว | "what warms" is an English metaphor that doesn't carry; existing th.json uses "อะไรอุ่นขึ้น" which reads as literal heat | needs revision |
| **lerping toward** (Mirror prose) | ค่อยๆ เคลื่อนเข้าหา / ค่อยๆ ปรับเข้าหา | "lerp" is technical CG-graphics jargon; in Thai writing the natural rendering is "ค่อยๆ เคลื่อน" | settled |
| **the seam** (between mind and brain) | รอยต่อ ✅ | the existing th.json uses `รอยต่อ` — this is good; preserves the editorial "seam" image | **[GOOD]** |
| **meaning under construction** | ความหมายในกระบวนการก่อตัว | direct, works | settled |
| **the model thinking** (about TRIBE) | โมเดลกำลังคิด ✅ | the existing th.json — fine | **[GOOD]** |

---

## 4 — PROPER NAMES

### 4.1 Convention

Thai academic writing transliterates Western names phonetically on first use, with the Latin name in parentheses, then uses the Thai form thereafter. Some names have settled Thai forms (Jung → จุง); others vary.

| English | Thai (recommended) | Notes |
|---|---|---|
| Carl Jung | คาร์ล ยุง or คาร์ล จุง — **prefer `จุง`** (existing site uses this) | both are seen; site consistency is the priority |
| Sigmund Freud | ซิกมุนด์ ฟรอยด์ | standard |
| Mark Solms | มาร์ก โซลม์ส | first-use Latin |
| Antonio Damasio | อันโตนิโอ ดามาซิโอ | first-use Latin |
| Oliver Sacks | โอลิเวอร์ แซกส์ | first-use Latin |
| Eric Kandel | เอริก คานเดล | first-use Latin |
| Iain McGilchrist | เอียน แม็กกิลคริสต์ | first-use Latin |
| Anil Seth | อนิล เซธ | first-use Latin |
| Aniela Jaffé | อนีลา ยาฟเฟ | first-use Latin |
| Anne Carson | แอน คาร์สัน | standard |
| Borges | บอร์เฆส (Spanish) / บอร์เกส (English) | Thai literary world uses `บอร์เฆส` (Spanish convention) — recommend this |

### 4.2 Place / institution

| English | Thai |
|---|---|
| Chulalongkorn JIPP | คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย (JIPP) — first use Latin |
| Algonauts | Algonauts (keep English; competition name) |
| Meta FAIR | Meta FAIR (keep English) |

---

## 5 — WHAT THE GLOSSARY DOES NOT COVER

- **Hero rhetoric** — short declarative copy needs sentence-by-sentence editing, not glossary entries. The brief's D.1 covers this.
- **Region poetic glosses** — these are micro-essays in their own register. The brief's D.6 says to flag them rather than attempt. I will flag every poetic gloss as [REQUIRES-HUMAN-TRANSLATOR] in the audit.
- **Field Notes essays** — D.2. Same flagging principle. Will flag entire essays for human translation.
- **The cross-cultural page** — D.3. Self-referential about translation limits. Needs the kind of stylistic precision that the editor must supervise.

---

## 6 — TOP-PRIORITY DECISIONS FOR THE EDITOR

If the editor only has time to resolve a small number of choices, these are the highest-impact:

1. **`อาร์คีไทป์` vs `แม่แบบจิต` vs `ต้นแบบจิต`** for archetype. Currently the site uses `แม่แบบจิต`; recommended switch is `อาร์คีไทป์`. This affects ~10+ strings.

2. **Default Mode Network** — keep `DMN` / `Default Mode Network` in Latin, or use `เครือข่ายโหมดเริ่มต้น`. Currently inconsistent.

3. **anatomy name format** — full Latin throughout (medical-school convention) OR Thai transliteration throughout. Currently mixed. Strong recommendation: **full Latin** for `anatomyName` field; Thai transliteration only in `displayName`.

4. **anima / animus** — Latin or Thai transliteration. Currently mixed. **Pick one.**

5. **"cognitive"** rendering — `ปัญญา` vs `พุทธิปัญญา` vs `รู้คิด`. Currently mixed and the existing `ปัญญา` is too broad.

6. **`hedged` in essay context** — currently rendered as `ระมัดระวังในการเว้นที่`, which is a mistranslation. **Must fix.**

---

## 7 — METHODOLOGY NOTES

For each term flagged **[VERIFY]** or **[CONTESTED]** above, the AI's research process was:

- WebSearch in Thai for the term + academic context
- Cross-reference against Thai Wikipedia entries (cross-checked, not primary source)
- Compare against the conventions visible in Medium articles by Thai cognitive scientists / psychologists
- Look at how the existing th.json renders the term to detect inherited choices

The AI did NOT consult:
- Royal Institute Dictionary (พจนานุกรมศัพท์แพทย์ ราชบัณฑิตยสถาน) directly — no live API access
- Print-only Thai academic literature
- Thai journals behind paywalls

A native Thai academic editor with library access should treat this glossary as the AI's best research-grounded recommendation, not as a settled translation.

## Sources

- [จิตไร้สำนึก · วิกิพีเดียภาษาไทย](https://th.wikipedia.org/wiki/จิตไร้สำนึก)
- [Unconscious Mind — ViA บำบัดใจ](https://www.theviatherapy.com/unconscious-mind/)
- [ลักษณะของจิตมนุษย์ · baanjomyut.com](https://www.baanjomyut.com/library_2/psychology_basic/01.html)
- [8 แม่แบบบุคลิกภาพ · iSTRONG](https://www.istrong.co/single-post/8-archetypes)
- [4Types · The Matter — คาร์ล ยุง](https://thematter.co/social/4types-carl-jung/163014)
- [Default mode network · Medium (Kittikun Viwatpinyo, Thai cognitive scientist)](https://medium.com/@kittikun.viw/default-mode-network-กิจกรรมยามว่างของสมอง-373fd6c04b79)
- [DMN ในเด็กออทิสติก · NeurolifeBS](https://www.neurolifebs.com/post/default-mode-network-dmn)
