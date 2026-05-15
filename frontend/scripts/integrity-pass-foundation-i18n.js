#!/usr/bin/env node
/**
 * Integrity-pass Commit 1 — adds the `provenance` and `activation`
 * namespaces across all 6 locale bundles. No copy elsewhere is
 * touched in this commit; the hero/Phase-N reframings are a
 * separate batcher.
 *
 * Run from frontend/: node scripts/integrity-pass-foundation-i18n.js
 */

const fs = require("node:fs");
const path = require("node:path");
const MESSAGES_DIR = path.join(__dirname, "..", "messages");

const PROVENANCE = {
  en: {
    labels: {
      neurosynth: {
        text: "Neurosynth meta-analysis",
        aria: "Neurosynth meta-analysis: brain visualization derived from peer-reviewed fMRI literature aggregation projected onto the HCP-MMP-360 parcellation.",
      },
      "embedding-baseline": {
        text: "Embedding baseline · BGE-small",
        aria: "Embedding-baseline predictor: a sentence-embedding model running on a free-tier backend, projected to 20 regions. Not a TRIBE inference.",
      },
      "lexical-heuristic": {
        text: "Lexical heuristic",
        aria: "Lexical-heuristic fallback: when the embedding backend is asleep, a small set of word-feature scores fills in. Not a model prediction.",
      },
      "literature-informed": {
        text: "Literature-informed synthesis",
        aria: "Literature-informed synthesis: this visualization is a hand-authored animation drawn from published research, not the output of a model.",
      },
      "tribe-inference": {
        text: "TRIBE inference",
        aria: "TRIBE inference: prediction served by a real TRIBE checkpoint. Reserved badge state.",
      },
    },
  },
  es: {
    labels: {
      neurosynth: {
        text: "Metaanálisis Neurosynth",
        aria: "Metaanálisis Neurosynth: visualización derivada de la agregación de literatura fMRI revisada por pares, proyectada sobre la parcelación HCP-MMP-360.",
      },
      "embedding-baseline": {
        text: "Línea base de embeddings · BGE-small",
        aria: "Predictor de línea base por embeddings: un modelo de incrustación de oraciones sobre un backend gratuito, proyectado a 20 regiones. No es inferencia TRIBE.",
      },
      "lexical-heuristic": {
        text: "Heurística léxica",
        aria: "Respaldo heurístico léxico: cuando el backend está dormido, un conjunto pequeño de puntuaciones de rasgos léxicos rellena. No es una predicción de modelo.",
      },
      "literature-informed": {
        text: "Síntesis basada en literatura",
        aria: "Síntesis basada en literatura: esta visualización es una animación hecha a mano a partir de investigaciones publicadas, no la salida de un modelo.",
      },
      "tribe-inference": {
        text: "Inferencia TRIBE",
        aria: "Inferencia TRIBE: predicción servida por un checkpoint TRIBE real. Estado de insignia reservado.",
      },
    },
  },
  ca: {
    labels: {
      neurosynth: {
        text: "Metaanàlisi Neurosynth",
        aria: "Metaanàlisi Neurosynth: visualització derivada de l'agregació de literatura fMRI revisada per parells, projectada sobre la parcel·lació HCP-MMP-360.",
      },
      "embedding-baseline": {
        text: "Línia base d'embeddings · BGE-small",
        aria: "Predictor de línia base per embeddings: un model d'incrustació de frases sobre un backend gratuït, projectat a 20 regions. No és inferència TRIBE.",
      },
      "lexical-heuristic": {
        text: "Heurística lèxica",
        aria: "Suport heurístic lèxic: quan el backend dorm, un conjunt petit de puntuacions de trets lèxics omple. No és una predicció de model.",
      },
      "literature-informed": {
        text: "Síntesi basada en literatura",
        aria: "Síntesi basada en literatura: aquesta visualització és una animació feta a mà a partir de recerca publicada, no la sortida d'un model.",
      },
      "tribe-inference": {
        text: "Inferència TRIBE",
        aria: "Inferència TRIBE: predicció servida per un checkpoint TRIBE real. Estat d'insígnia reservat.",
      },
    },
  },
  th: {
    labels: {
      neurosynth: {
        text: "การวิเคราะห์อภิมาน Neurosynth",
        aria: "การวิเคราะห์อภิมาน Neurosynth: ภาพการแสดงผลที่ได้จากการรวบรวมงานวิจัย fMRI ที่ผ่านการทบทวนโดยผู้ทรงคุณวุฒิ ฉายลงบนการแบ่งส่วน HCP-MMP-360",
      },
      "embedding-baseline": {
        text: "เส้นฐานเอ็มเบดดิ้ง · BGE-small",
        aria: "ตัวทำนายเส้นฐานเอ็มเบดดิ้ง: โมเดลเอ็มเบดดิ้งประโยคบนแบ็กเอนด์ฟรีเทียร์ ฉายไปยัง 20 บริเวณ ไม่ใช่การอนุมาน TRIBE",
      },
      "lexical-heuristic": {
        text: "ฮิวริสติกระดับคำ",
        aria: "ฟอลแบ็กฮิวริสติกระดับคำ: เมื่อแบ็กเอนด์หลับ ชุดคะแนนคุณลักษณะระดับคำเล็ก ๆ ทำหน้าที่แทน ไม่ใช่คำทำนายของแบบจำลอง",
      },
      "literature-informed": {
        text: "การสังเคราะห์จากวรรณกรรม",
        aria: "การสังเคราะห์จากวรรณกรรม: ภาพนี้เป็นอนิเมชันที่สร้างด้วยมือจากงานวิจัยที่ตีพิมพ์ ไม่ใช่ผลของแบบจำลอง",
      },
      "tribe-inference": {
        text: "การอนุมาน TRIBE",
        aria: "การอนุมาน TRIBE: คำทำนายที่ให้บริการโดย checkpoint TRIBE จริง สถานะตราที่สงวนไว้",
      },
    },
  },
  ja: {
    labels: {
      neurosynth: {
        text: "Neurosynth メタアナリシス",
        aria: "Neurosynth メタアナリシス: 査読済み fMRI 文献の集約から導出され、HCP-MMP-360 パーセレーションに投影された可視化。",
      },
      "embedding-baseline": {
        text: "埋め込みベースライン · BGE-small",
        aria: "埋め込みベースラインの予測器: 無料層バックエンド上の文埋め込みモデルを 20 領域に投影。TRIBE 推論ではない。",
      },
      "lexical-heuristic": {
        text: "語彙的ヒューリスティック",
        aria: "語彙的ヒューリスティックのフォールバック: バックエンドが休眠中、小さな語彙特徴スコアが代替する。モデル予測ではない。",
      },
      "literature-informed": {
        text: "文献に基づく合成",
        aria: "文献に基づく合成: この可視化は公表された研究から手作業で制作されたアニメーションで、モデルの出力ではない。",
      },
      "tribe-inference": {
        text: "TRIBE 推論",
        aria: "TRIBE 推論: 実 TRIBE チェックポイントが提供する予測。予約済みバッジ状態。",
      },
    },
  },
  "zh-CN": {
    labels: {
      neurosynth: {
        text: "Neurosynth 元分析",
        aria: "Neurosynth 元分析：可视化由经过同行评审的 fMRI 文献聚合得出，投射到 HCP-MMP-360 分区上。",
      },
      "embedding-baseline": {
        text: "嵌入基线 · BGE-small",
        aria: "嵌入基线预测器：在免费层后端上运行的句嵌入模型，投射到 20 个脑区。不是 TRIBE 推理。",
      },
      "lexical-heuristic": {
        text: "词法启发式",
        aria: "词法启发式回退：当后端休眠时，由一小组词法特征评分代替。不是模型预测。",
      },
      "literature-informed": {
        text: "基于文献的合成",
        aria: "基于文献的合成：本可视化是从已发表研究手工制作的动画，不是模型输出。",
      },
      "tribe-inference": {
        text: "TRIBE 推理",
        aria: "TRIBE 推理：由真实 TRIBE 检查点提供的预测。保留的徽章状态。",
      },
    },
  },
};

const ACTIVATION = {
  en: {
    bands: {
      strongest: "strongest response",
      moderate: "moderate response",
      minimal: "minimal response",
      "near-silence": "near silence",
    },
    divergence: {
      strongest: "strongest divergence",
      moderate: "moderate divergence",
      minimal: "minimal divergence",
      "near-silence": "near silence",
    },
  },
  es: {
    bands: {
      strongest: "respuesta más fuerte",
      moderate: "respuesta moderada",
      minimal: "respuesta mínima",
      "near-silence": "casi silencio",
    },
    divergence: {
      strongest: "divergencia más fuerte",
      moderate: "divergencia moderada",
      minimal: "divergencia mínima",
      "near-silence": "casi silencio",
    },
  },
  ca: {
    bands: {
      strongest: "resposta més forta",
      moderate: "resposta moderada",
      minimal: "resposta mínima",
      "near-silence": "gairebé silenci",
    },
    divergence: {
      strongest: "divergència més forta",
      moderate: "divergència moderada",
      minimal: "divergència mínima",
      "near-silence": "gairebé silenci",
    },
  },
  th: {
    bands: {
      strongest: "การตอบสนองมากที่สุด",
      moderate: "การตอบสนองปานกลาง",
      minimal: "การตอบสนองเล็กน้อย",
      "near-silence": "เกือบเงียบ",
    },
    divergence: {
      strongest: "ความแตกต่างมากที่สุด",
      moderate: "ความแตกต่างปานกลาง",
      minimal: "ความแตกต่างเล็กน้อย",
      "near-silence": "เกือบเงียบ",
    },
  },
  ja: {
    bands: {
      strongest: "最も強い反応",
      moderate: "中程度の反応",
      minimal: "わずかな反応",
      "near-silence": "ほぼ静寂",
    },
    divergence: {
      strongest: "最も強い乖離",
      moderate: "中程度の乖離",
      minimal: "わずかな乖離",
      "near-silence": "ほぼ静寂",
    },
  },
  "zh-CN": {
    bands: {
      strongest: "最强响应",
      moderate: "中等响应",
      minimal: "微弱响应",
      "near-silence": "近乎沉默",
    },
    divergence: {
      strongest: "最强差异",
      moderate: "中等差异",
      minimal: "微弱差异",
      "near-silence": "近乎沉默",
    },
  },
};

for (const locale of ["en", "es", "ca", "th", "ja", "zh-CN"]) {
  const fp = path.join(MESSAGES_DIR, `${locale}.json`);
  const m = JSON.parse(fs.readFileSync(fp, "utf8"));
  m.provenance = PROVENANCE[locale];
  m.activation = ACTIVATION[locale];
  fs.writeFileSync(fp, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`[wrote] ${locale}.json`);
}
