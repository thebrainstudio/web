#!/usr/bin/env node
/**
 * Integrity-pass Commit 2 — hero reframings + Phase-N strip +
 * Music room factual fix. Touches only the strings listed in the
 * approved plan; no new prose elsewhere.
 *
 * Run from frontend/: node scripts/integrity-pass-heroes-i18n.js
 */

const fs = require("node:fs");
const path = require("node:path");
const MESSAGES_DIR = path.join(__dirname, "..", "messages");

// ────────────────────────────────────────────────────────────────
// Home hero — drop "your brain", name "an average brain"
// ────────────────────────────────────────────────────────────────
const HOME_HERO = {
  en: {
    line1: "There is a model",
    line2: "that predicts",
    line3: "what published research says an average brain does.",
  },
  es: {
    line1: "Existe un modelo",
    line2: "que predice",
    line3: "lo que la investigación publicada dice que hace un cerebro promedio.",
  },
  ca: {
    line1: "Hi ha un model",
    line2: "que prediu",
    line3: "el que la recerca publicada diu que fa un cervell mitjà.",
  },
  th: {
    line1: "มีโมเดลหนึ่ง",
    line2: "ที่ทำนาย",
    line3: "สิ่งที่งานวิจัยที่ตีพิมพ์ระบุว่าเป็นการทำงานของสมองโดยเฉลี่ย",
  },
  ja: {
    line1: "あるモデルがあります。",
    line2: "公表された研究が示す",
    line3: "平均的な脳の働きを予測するモデルが。",
  },
  "zh-CN": {
    line1: "有一个模型",
    line2: "可以预测",
    line3: "已发表研究所描述的平均脑会做什么。",
  },
};

// ────────────────────────────────────────────────────────────────
// Mirror room
// ────────────────────────────────────────────────────────────────
const MIRROR = {
  en: {
    label: "Brain Mirror",
    intro:
      "The brain above shows what published research associates with text semantically near yours — predicted activation across twenty regions, not a scan of you.",
    revealIntro:
      "Predictions come from an embedding model running on a free-tier backend; when the backend is asleep, a lexical heuristic fills in. Either way: not a TRIBE inference.",
    footerNote: "Embedding-baseline predictor · BGE-small",
  },
  es: {
    label: "Espejo Cerebral",
    intro:
      "El cerebro de arriba muestra lo que la investigación publicada asocia con textos semánticamente cercanos al tuyo — activación predicha en veinte regiones, no una resonancia tuya.",
    revealIntro:
      "Las predicciones provienen de un modelo de embeddings ejecutándose en un backend de capa gratuita; cuando el backend duerme, una heurística léxica lo cubre. De cualquier modo: no es una inferencia TRIBE.",
    footerNote: "Predictor de línea base por embeddings · BGE-small",
  },
  ca: {
    label: "Mirall Cerebral",
    intro:
      "El cervell de dalt mostra el que la recerca publicada associa amb textos semànticament propers al teu — activació predita en vint regions, no una ressonància teva.",
    revealIntro:
      "Les prediccions provenen d'un model d'embeddings que s'executa en un backend de capa gratuïta; quan el backend dorm, una heurística lèxica omple el buit. En qualsevol cas: no és una inferència TRIBE.",
    footerNote: "Predictor de línia base d'embeddings · BGE-small",
  },
  th: {
    label: "กระจกสมอง",
    intro:
      "สมองด้านบนแสดงสิ่งที่งานวิจัยที่ตีพิมพ์เชื่อมโยงกับข้อความที่มีความหมายใกล้เคียงกับของคุณ — การกระตุ้นที่ทำนายในยี่สิบบริเวณ ไม่ใช่การสแกนของคุณ",
    revealIntro:
      "คำทำนายมาจากโมเดลเอ็มเบดดิ้งที่ทำงานบนแบ็กเอนด์ฟรีเทียร์ เมื่อแบ็กเอนด์หลับ ฮิวริสติกระดับคำจะทำหน้าที่แทน ทั้งสองทาง: ไม่ใช่การอนุมาน TRIBE",
    footerNote: "ตัวทำนายเส้นฐานเอ็มเบดดิ้ง · BGE-small",
  },
  ja: {
    label: "ブレイン・ミラー",
    intro:
      "上に見える脳は、あなたの文に意味的に近いテキストについて、公表された研究が結びつける活性化を示します — 20領野にわたる予測であり、あなたの脳のスキャンではありません。",
    revealIntro:
      "予測は無料層バックエンドの埋め込みモデルから来ています。バックエンドが休眠中は語彙的ヒューリスティックが代替します。いずれも TRIBE 推論ではありません。",
    footerNote: "埋め込みベースライン予測器 · BGE-small",
  },
  "zh-CN": {
    label: "大脑镜像",
    intro:
      "上方的大脑显示的是已发表研究为与你文本语义相近的文本所关联的预测激活——分布在二十个脑区上，并不是对你的扫描。",
    revealIntro:
      "预测来自运行在免费层后端的嵌入模型；当后端休眠时，由词法启发式代替。两者都不是 TRIBE 推理。",
    footerNote: "嵌入基线预测器 · BGE-small",
  },
};

// ────────────────────────────────────────────────────────────────
// NeuroMusic Lab — drop the "oldest sense" superlative
// ────────────────────────────────────────────────────────────────
const MUSIC = {
  en: {
    label: "NeuroMusic Lab",
    title:
      "Hearing forms early — by the third trimester the cochlea is functional and the auditory cortex is already shaped by sound.",
    intro:
      "It begins before words. Below: three tracks, each accompanied by a 60-second region timeline. Scrub a player and watch the brain follow the music in real time — Heschl's gyrus on the attack, posterior STG holding the melody, default-mode regions stepping in when the piece stops trying.",
    footerNote: "NeuroMusic Lab · Neurosynth meta-analytic composites",
  },
  es: {
    label: "Laboratorio de NeuroMúsica",
    title:
      "La audición se forma temprano — en el tercer trimestre la cóclea ya funciona y la corteza auditiva está siendo modelada por el sonido.",
    intro:
      "Empieza antes que las palabras. Abajo: tres pistas, cada una con una línea de tiempo regional de 60 segundos. Arrastra el reproductor y observa al cerebro seguir la música en tiempo real — el giro de Heschl en el ataque, el STG posterior sosteniendo la melodía, las regiones por defecto entrando cuando la pieza deja de intentarlo.",
    footerNote: "Laboratorio de NeuroMúsica · composiciones meta-analíticas de Neurosynth",
  },
  ca: {
    label: "Laboratori de NeuroMúsica",
    title:
      "L'oïda es forma aviat — al tercer trimestre la còclea ja funciona i l'escorça auditiva ja està sent modelada pel so.",
    intro:
      "Comença abans que les paraules. A sota: tres peces, cadascuna amb una línia de temps regional de 60 segons. Arrossega el reproductor i observa el cervell seguir la música en temps real — la circumvolució de Heschl a l'atac, l'STG posterior sostenint la melodia, les regions per defecte entrant quan la peça deixa d'intentar-ho.",
    footerNote: "Laboratori de NeuroMúsica · composicions metaanalítiques de Neurosynth",
  },
  th: {
    label: "ห้องปฏิบัติการนิวโรมิวสิก",
    title:
      "การได้ยินก่อตัวเร็ว — ในไตรมาสที่สามของการตั้งครรภ์ คอเคลียทำงานแล้ว และคอร์เทกซ์การได้ยินกำลังถูกหล่อหลอมโดยเสียง",
    intro:
      "มันเริ่มก่อนคำพูด ด้านล่าง: สามแทร็ก แต่ละแทร็กมาพร้อมเส้นเวลาบริเวณสมองยาว 60 วินาที ลากเครื่องเล่นแล้วดูสมองตามดนตรีไปแบบเรียลไทม์ — Heschl's gyrus ที่จังหวะตี posterior STG ถือทำนอง บริเวณโหมดเริ่มต้นเข้ามาเมื่อเพลงหยุดพยายาม",
    footerNote: "ห้องปฏิบัติการนิวโรมิวสิก · ส่วนผสมเชิงอภิวิเคราะห์ของ Neurosynth",
  },
  ja: {
    label: "ニューロ・ミュージック・ラボ",
    title:
      "聴覚は早くに形成される — 妊娠第三期には蝸牛が機能し、聴覚野はすでに音によって形作られている。",
    intro:
      "それは言葉より先に始まります。下に三つのトラック、それぞれに 60 秒の領野タイムラインがついています。プレーヤーをスクラブすると、脳が音楽をリアルタイムで追っていきます — アタックでのヘシュル回、メロディを保つ後部STG、楽曲が「努めること」をやめたときに入ってくるデフォルトモード領野。",
    footerNote: "ニューロ・ミュージック・ラボ · Neurosynth メタアナリシス合成",
  },
  "zh-CN": {
    label: "神经音乐实验室",
    title:
      "听觉很早就形成——在妊娠第三个月，耳蜗已能运作，听觉皮层已被声音塑形。",
    intro:
      "它在言语之前就开始了。下面是三段音乐，每一段都配有一条 60 秒的脑区时间线。拖动播放器，看大脑实时跟着音乐走——起音处的赫氏回、维持旋律的后部颞上回、当作品停止「用力」时介入的默认模式脑区。",
    footerNote: "神经音乐实验室 · Neurosynth 元分析合成",
  },
};

// ────────────────────────────────────────────────────────────────
// Cross-Cultural Brain
// ────────────────────────────────────────────────────────────────
const CROSSCULTURAL = {
  en: {
    label: "Cross-Cultural Brain",
    submissionForm: "Pair submission form",
    footerNote: "Cross-Cultural Brain · Neurosynth meta-analytic composites · HCP-MMP-360",
  },
  es: {
    label: "Cerebro Transcultural",
    submissionForm: "Formulario de envío de pares",
    footerNote: "Cerebro Transcultural · composiciones meta-analíticas de Neurosynth · HCP-MMP-360",
  },
  ca: {
    label: "Cervell Transcultural",
    submissionForm: "Formulari d'enviament de parelles",
    footerNote: "Cervell Transcultural · composicions metaanalítiques de Neurosynth · HCP-MMP-360",
  },
  th: {
    label: "สมองข้ามวัฒนธรรม",
    submissionForm: "แบบฟอร์มส่งคู่ข้อความ",
    footerNote: "สมองข้ามวัฒนธรรม · ส่วนผสมเชิงอภิวิเคราะห์ของ Neurosynth · HCP-MMP-360",
  },
  ja: {
    label: "異文化の脳",
    submissionForm: "ペア投稿フォーム",
    footerNote: "異文化の脳 · Neurosynth メタアナリシス合成 · HCP-MMP-360",
  },
  "zh-CN": {
    label: "跨文化大脑",
    submissionForm: "对子提交表单",
    footerNote: "跨文化大脑 · Neurosynth 元分析合成 · HCP-MMP-360",
  },
};

for (const locale of ["en", "es", "ca", "th", "ja", "zh-CN"]) {
  const fp = path.join(MESSAGES_DIR, `${locale}.json`);
  const m = JSON.parse(fs.readFileSync(fp, "utf8"));

  // Home hero
  m.home.hero = HOME_HERO[locale];

  // Mirror
  m.mirror.label = MIRROR[locale].label;
  m.mirror.intro = MIRROR[locale].intro;
  if (m.mirror.revealIntro !== undefined) {
    m.mirror.revealIntro = MIRROR[locale].revealIntro;
  }
  if (m.mirror.footerNote !== undefined) {
    m.mirror.footerNote = MIRROR[locale].footerNote;
  }

  // Music
  m.music.label = MUSIC[locale].label;
  m.music.title = MUSIC[locale].title;
  m.music.intro = MUSIC[locale].intro;
  if (m.music.footerNote !== undefined) {
    m.music.footerNote = MUSIC[locale].footerNote;
  }

  // Cross-Cultural
  m.crosscultural.label = CROSSCULTURAL[locale].label;
  if (m.crosscultural.submissionForm !== undefined) {
    m.crosscultural.submissionForm = CROSSCULTURAL[locale].submissionForm;
  }
  if (m.crosscultural.footerNote !== undefined) {
    m.crosscultural.footerNote = CROSSCULTURAL[locale].footerNote;
  }

  // About: strip ` · Phase 9` suffix from any opening label that
  // carries it. The opening uses about.opening.label or similar;
  // search for "Phase 9" suffix and trim.
  if (m.about && m.about.opening && typeof m.about.opening.label === "string") {
    m.about.opening.label = m.about.opening.label
      .replace(/\s*·\s*(Phase|Fase|ระยะที่|フェーズ|阶段)\s*\d+\s*$/i, "")
      .trim();
  }

  fs.writeFileSync(fp, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`[wrote] ${locale}.json`);
}
