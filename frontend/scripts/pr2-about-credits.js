#!/usr/bin/env node
/**
 * PR 2 — About credits rewrite. Anonymous academic register.
 *
 * Replaces `about.credits.builtBody` across all 6 locale bundles.
 * Other credits keys (modelBody, homeBody, *Title, *Label) remain
 * factual + institutional and are left alone.
 *
 * The new copy:
 *   - names what the model actually did (engineering scaffolding,
 *     prose drafting)
 *   - states the editorial direction is anonymous (no personal byline)
 *   - reaffirms human verification of factual claims, citations,
 *     attributions, and editorial decisions (so the credit doesn't
 *     drift into a disclaimer of authorship)
 *   - keeps "Anthropic Claude" as the title — that's the model name,
 *     not a person
 *
 * Run from frontend/: node scripts/pr2-about-credits.js
 */

const fs = require("node:fs");
const path = require("node:path");
const MESSAGES_DIR = path.join(__dirname, "..", "messages");

const BUILT_BODY = {
  en: "Engineering scaffolding and prose drafting were produced with Claude (Anthropic, model versions across 2025–2026) under anonymous editorial direction and final review. All factual claims, citations, region attributions, and editorial decisions were human-verified. The site's voice and structural choices are the author's; the implementation labor was shared with the model.",
  es: "El andamiaje de ingeniería y los borradores de prosa se produjeron con Claude (Anthropic, versiones del modelo a lo largo de 2025–2026) bajo dirección editorial anónima y revisión final. Todas las afirmaciones factuales, las citas, las atribuciones de regiones y las decisiones editoriales se verificaron humanamente. La voz del sitio y sus elecciones estructurales son del autor; el trabajo de implementación se compartió con el modelo.",
  ca: "La bastida d'enginyeria i els esborranys de prosa es van produir amb Claude (Anthropic, versions del model al llarg de 2025–2026) sota direcció editorial anònima i revisió final. Totes les afirmacions factuals, les citacions, les atribucions de regions i les decisions editorials es van verificar humanament. La veu del lloc i les seves opcions estructurals són de l'autor; la feina d'implementació es va compartir amb el model.",
  th: "โครงนั่งร้านเชิงวิศวกรรมและร่างเริ่มต้นของเนื้อความถูกผลิตขึ้นด้วย Claude (Anthropic เวอร์ชันของแบบจำลองตลอดปี 2025–2026) ภายใต้การกำกับบรรณาธิการแบบนิรนามและการตรวจทานขั้นสุดท้าย ข้อความข้อเท็จจริง การอ้างอิง การระบุบริเวณสมอง และการตัดสินใจเชิงบรรณาธิการทั้งหมดได้รับการตรวจสอบโดยมนุษย์ น้ำเสียงของเว็บไซต์และการเลือกเชิงโครงสร้างเป็นของผู้เขียน ส่วนแรงงานในการพัฒนานั้นแบ่งกันทำกับแบบจำลอง",
  ja: "工学的な足場と散文の下書きは、Claude（Anthropic、2025〜2026年にわたるモデルバージョン群）によって、匿名の編集ディレクションと最終レビューのもとで作成された。事実主張、引用、脳領域の帰属、そして編集判断はすべて人による検証を経ている。サイトの声と構造的選択は著者のものであり、実装の労働はモデルと共有された。",
  "zh-CN": "工程脚手架与散文初稿由 Claude（Anthropic，2025–2026 年间的多个模型版本）在匿名编辑指导与最终审校下产出。所有事实陈述、引用、脑区归属与编辑判断均经过人工核验。本站的声音与结构选择属于作者；实现层面的工作则与模型共担。",
};

for (const locale of ["en", "es", "ca", "th", "ja", "zh-CN"]) {
  const fp = path.join(MESSAGES_DIR, `${locale}.json`);
  const m = JSON.parse(fs.readFileSync(fp, "utf8"));

  if (!m.about || !m.about.credits) {
    console.warn(`[skip] ${locale}.json missing about.credits`);
    continue;
  }
  m.about.credits.builtBody = BUILT_BODY[locale];

  fs.writeFileSync(fp, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`[wrote] ${locale}.json`);
}
