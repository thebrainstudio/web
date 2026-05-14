#!/usr/bin/env node
/**
 * PR-G — About page methodology rewrite for the v1.0 real-fMRI
 * pipeline. Adds `about.pipeline` (what actually runs) and
 * `about.disclaimers` namespaces across all 6 locales.
 *
 * The existing `about.what` section (TRIBE-the-model-class
 * explanation) stays unchanged — it accurately describes what
 * brain-encoding models do as a class. The new `pipeline`
 * section names the actual implementation: Neurosynth meta-
 * analyses + HCP-MMP-360 parcellation for the room visualizations,
 * BGE-small embedding backend for the Mirror room runtime
 * predictor.
 *
 * Run from frontend/: node scripts/pr-g-about-pipeline.js
 */

const fs = require("node:fs");
const path = require("node:path");
const MESSAGES_DIR = path.join(__dirname, "..", "messages");

const PIPELINE = {
  en: {
    label: "What actually runs",
    heading: "Neurosynth + HCP-MMP-360 underneath, a small backend for Mirror.",
    body: "Behind every brain visualization on this site sits a precomputed activation map from Neurosynth — a meta-analysis of more than 14,000 published fMRI studies — projected onto the HCP-MMP-360 parcellation (Glasser 2016). Each room loads its own composition: the Atlas page for IFG reads the 'language' term map; the Faust passage on the wager reads a weighted blend of 'reward anticipation', 'value', 'reward', and 'self referential'. The composition is named under every brain visualization on the site, so what drove the pattern you're looking at is never hidden.",
    mirrorBody: "The Brain Mirror room is the exception. Its predictor runs on a free-tier serverless backend (fastembed BGE-small) that takes the visitor's text and returns a 20-region activation profile via embedding similarity against a region-anchor cache. When the backend is asleep, the Mirror falls back to a cached prediction. Both paths feed the same HCP-MMP-360 visualization underneath.",
    disclaimer: "These are not measurements of any individual brain. They are what published research and meta-analysis indicate about the average brain under the relevant stimulus. The model is not the mind."
  },
  es: {
    label: "Lo que realmente se ejecuta",
    heading: "Neurosynth + HCP-MMP-360 debajo, un pequeño backend para el Espejo.",
    body: "Detrás de cada visualización cerebral en este sitio hay un mapa de activación precalculado de Neurosynth — un metaanálisis de más de 14 000 estudios de fMRI publicados — proyectado sobre la parcelación HCP-MMP-360 (Glasser 2016). Cada sala carga su propia composición: la página del Atlas para el IFG lee el mapa del término 'language'; el pasaje de Fausto sobre el pacto lee una mezcla ponderada de 'reward anticipation', 'value', 'reward' y 'self referential'. La composición se nombra bajo cada visualización del sitio, de modo que lo que produjo el patrón nunca queda oculto.",
    mirrorBody: "La sala del Espejo Cerebral es la excepción. Su predictor se ejecuta en un backend serverless de capa gratuita (fastembed BGE-small) que toma el texto del visitante y devuelve un perfil de activación de 20 regiones por similitud de incrustación contra una caché de anclas regionales. Cuando el backend duerme, el Espejo vuelve a una predicción en caché. Ambas rutas alimentan la misma visualización HCP-MMP-360 por debajo.",
    disclaimer: "Estas no son mediciones de ningún cerebro individual. Son lo que la investigación publicada y los metaanálisis indican sobre el cerebro promedio bajo el estímulo correspondiente. El modelo no es la mente."
  },
  ca: {
    label: "Què s'executa realment",
    heading: "Neurosynth + HCP-MMP-360 a sota, un petit backend per al Mirall.",
    body: "Darrere de cada visualització cerebral d'aquest lloc hi ha un mapa d'activació precalculat de Neurosynth — una metaanàlisi de més de 14 000 estudis d'fMRI publicats — projectat sobre la parcel·lació HCP-MMP-360 (Glasser 2016). Cada sala carrega la seva pròpia composició: la pàgina de l'Atles per a l'IFG llegeix el mapa del terme 'language'; el passatge de Faust sobre el pacte llegeix una barreja ponderada de 'reward anticipation', 'value', 'reward' i 'self referential'. La composició s'anomena sota cada visualització del lloc, perquè allò que va produir el patró mai resti ocult.",
    mirrorBody: "La sala del Mirall Cerebral és l'excepció. El seu predictor s'executa en un backend serverless de capa gratuïta (fastembed BGE-small) que pren el text del visitant i retorna un perfil d'activació de 20 regions per similitud d'incrustació contra una memòria cau d'àncores regionals. Quan el backend dorm, el Mirall recau en una predicció en memòria cau. Les dues vies alimenten la mateixa visualització HCP-MMP-360 a sota.",
    disclaimer: "Aquestes no són mesures de cap cervell individual. Són el que la recerca publicada i les metaanàlisis indiquen sobre el cervell mitjà sota l'estímul corresponent. El model no és la ment."
  },
  th: {
    label: "สิ่งที่ทำงานจริง",
    heading: "Neurosynth + HCP-MMP-360 อยู่ข้างใต้ และแบ็กเอนด์เล็ก ๆ สำหรับห้องกระจก",
    body: "เบื้องหลังการแสดงผลสมองทุกชิ้นในเว็บไซต์นี้คือแผนที่การกระตุ้นที่คำนวณไว้ล่วงหน้าจาก Neurosynth — การวิเคราะห์อภิมานของงานวิจัย fMRI ที่ตีพิมพ์แล้วกว่า 14,000 ชิ้น — ฉายลงบนการแบ่งส่วน HCP-MMP-360 (Glasser 2016) แต่ละห้องโหลดส่วนผสมของตัวเอง หน้า Atlas สำหรับ IFG อ่านแผนที่ของเทอม 'language' บทเฟาสต์ว่าด้วยพันธสัญญาอ่านส่วนผสมที่ถ่วงน้ำหนักของ 'reward anticipation', 'value', 'reward' และ 'self referential' องค์ประกอบเหล่านี้ถูกระบุไว้ใต้ภาพสมองทุกชิ้นในเว็บไซต์ เพื่อว่าสิ่งที่ขับเคลื่อนรูปแบบนั้นจะไม่ถูกซ่อน",
    mirrorBody: "ห้องกระจกสมองเป็นข้อยกเว้น ตัวทำนายของมันทำงานบนแบ็กเอนด์แบบเซิร์ฟเวอร์ลิสฟรีเทียร์ (fastembed BGE-small) ที่รับข้อความของผู้ชมและคืนค่าโปรไฟล์การกระตุ้น 20 บริเวณผ่านความคล้ายของ embedding เทียบกับแคชจุดยึดของบริเวณ เมื่อแบ็กเอนด์หลับ ห้องกระจกจะถอยกลับไปใช้คำทำนายในแคช เส้นทางทั้งสองส่งผลไปยังการแสดงผล HCP-MMP-360 เดียวกันข้างใต้",
    disclaimer: "สิ่งเหล่านี้ไม่ใช่การวัดสมองของบุคคลใดบุคคลหนึ่ง เป็นสิ่งที่งานวิจัยที่ตีพิมพ์และการวิเคราะห์อภิมานบ่งชี้ว่าสมองโดยเฉลี่ยทำอะไรภายใต้สิ่งกระตุ้นที่เกี่ยวข้อง แบบจำลองไม่ใช่จิต"
  },
  ja: {
    label: "実際に動いているもの",
    heading: "Neurosynth + HCP-MMP-360 が下に、ミラー用の小さなバックエンドが上に。",
    body: "本サイトのすべての脳可視化の背後にあるのは、Neurosynth — 14,000 を超える査読済み fMRI 研究のメタアナリシス — から事前計算された活性化マップであり、それが HCP-MMP-360 パーセレーション（Glasser 2016）に投影されている。各部屋は独自の合成を読み込む。アトラスの IFG ページは「language」項のマップを、Faust の賭けの一節は「reward anticipation」「value」「reward」「self referential」の重み付き合成を読み込む。合成内容は各脳可視化の下に明記されており、いま見ているパターンを生み出したものは決して隠されない。",
    mirrorBody: "脳ミラーの部屋は例外である。その予測器は無料層のサーバレスバックエンド（fastembed BGE-small）上で動作し、訪問者のテキストを受け取って、領域アンカーキャッシュとの埋め込み類似度から 20 領域の活性化プロファイルを返す。バックエンドがスリープしている間、ミラーはキャッシュされた予測へとフォールバックする。両方の経路は、同じ HCP-MMP-360 可視化を下層で駆動する。",
    disclaimer: "これらは個人の脳の測定ではない。査読済み研究とメタアナリシスが、関連する刺激のもとで平均的な脳について示唆していることである。モデルは心ではない。"
  },
  "zh-CN": {
    label: "实际在运行的内容",
    heading: "下面是 Neurosynth + HCP-MMP-360，上面有一个为镜室服务的小后端。",
    body: "本站每个脑可视化背后都是来自 Neurosynth 的预先计算的激活图 —— 一项对 14,000 多项已发表 fMRI 研究的元分析 —— 投射到 HCP-MMP-360 分区（Glasser 2016）。每个房间加载各自的组合：图谱页的 IFG 读取 'language' 项的图；浮士德赌约的段落读取 'reward anticipation'、'value'、'reward' 与 'self referential' 的加权组合。每幅脑图下方都会写明组合内容，正在看的图样的成因从不被隐藏。",
    mirrorBody: "脑镜房间是例外。它的预测器运行在一个免费层无服务后端（fastembed BGE-small）上：它接收访客文本，并通过与区域锚点缓存的嵌入相似度返回一个 20 区激活轮廓。后端休眠时，镜室会回退到缓存的预测。两条路径在下层都驱动同一个 HCP-MMP-360 可视化。",
    disclaimer: "这些并不是任何个体脑部的测量。它们是已发表研究与元分析所揭示的、平均脑在相关刺激下的反应。模型不是心智。"
  }
};

for (const locale of ["en", "es", "ca", "th", "ja", "zh-CN"]) {
  const fp = path.join(MESSAGES_DIR, `${locale}.json`);
  const m = JSON.parse(fs.readFileSync(fp, "utf8"));
  if (!m.about) {
    console.warn(`[skip] ${locale}.json missing about`);
    continue;
  }
  m.about.pipeline = PIPELINE[locale];
  fs.writeFileSync(fp, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`[wrote] ${locale}.json`);
}
