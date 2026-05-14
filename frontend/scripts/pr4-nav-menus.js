#!/usr/bin/env node
/**
 * PR 4 — Nav mega-menu i18n. Adds four grouped panels (rooms,
 * literature, depth, instrument) with per-item micro-blurbs.
 *
 * New keys added under `nav`:
 *   nav.aion / nav.redBook / nav.gestalt   — flat labels
 *   nav.menus.<group>.label                — panel title
 *   nav.menus.<group>.tagline              — one-line panel sub-title
 *   nav.menus.<group>.blurbs.<itemKey>     — per-row micro-blurb
 *
 * Run from frontend/: node scripts/pr4-nav-menus.js
 */

const fs = require("node:fs");
const path = require("node:path");
const MESSAGES_DIR = path.join(__dirname, "..", "messages");

// Flat labels for the three new depth-psychology subpages.
const FLAT_LABELS = {
  en: { aion: "Aion", redBook: "The Red Book", gestalt: "Gestalt" },
  es: { aion: "Aion", redBook: "El Libro Rojo", gestalt: "Gestalt" },
  ca: { aion: "Aion", redBook: "El Llibre Vermell", gestalt: "Gestalt" },
  th: { aion: "ไอออน", redBook: "หนังสือสีแดง", gestalt: "เกสตัลท์" },
  ja: { aion: "アイオーン", redBook: "赤の書", gestalt: "ゲシュタルト" },
  "zh-CN": { aion: "埃永", redBook: "红书", gestalt: "格式塔" },
};

// Full nav.menus tree per locale. Group label + tagline + per-item
// blurbs (the editorial micro-tagline shown inside the panel).
const MENUS = {
  en: {
    rooms: {
      label: "Rooms",
      tagline: "Four encoder experiences with the brain reacting live.",
      blurbs: {
        mirror: "Paste any text; watch what your writing looks like underneath.",
        music: "Hear how sound moves the same regions that move you.",
        crosscultural: "Where the model breaks down across languages.",
        cellular: "Descend into real neuron reconstructions; watch a synapse fire.",
      },
    },
    literature: {
      label: "Literature",
      tagline: "Four contemplative rooms — depth psychology + canonical literature.",
      blurbs: {
        threshold: "An essay in three movements about the seam between mind and brain.",
        archetypes: "Seven mandalas, one persistent default network.",
        faust: "Goethe's sixty-year question read alongside prediction error.",
        dante: "The Commedia as architecture for the default-mode network.",
      },
    },
    depth: {
      label: "Depth",
      tagline: "Long-form essays + the bridges between regions.",
      blurbs: {
        bridges: "Eleven named patterns of cross-region cooperation.",
        fieldNotes: "Short essays from the seams between disciplines.",
        depthPsychology: "Three Jung-with-neuroscience readings — index.",
        aion: "Jung's late book on the Self, read against the DMN.",
        redBook: "Confrontation with the unconscious; active imagination as data.",
        gestalt: "How the brain completes the figure — closure as prediction.",
      },
    },
    instrument: {
      label: "Instrument",
      tagline: "Reference layer — twenty regions, six guided walks.",
      blurbs: {
        atlas: "Twenty regions catalogued one by one with anatomy + function.",
        tours: "Six guided walks, eight to fifteen minutes each.",
      },
    },
  },
  es: {
    rooms: {
      label: "Salas",
      tagline: "Cuatro experiencias codificadoras con el cerebro reaccionando en vivo.",
      blurbs: {
        mirror: "Pega cualquier texto; mira cómo se ve tu escritura por debajo.",
        music: "Escucha cómo el sonido mueve las mismas regiones que te conmueven.",
        crosscultural: "Donde el modelo se rompe al cruzar idiomas.",
        cellular: "Desciende a reconstrucciones neuronales reales; mira disparar una sinapsis.",
      },
    },
    literature: {
      label: "Literatura",
      tagline: "Cuatro salas contemplativas — psicología profunda + literatura canónica.",
      blurbs: {
        threshold: "Un ensayo en tres movimientos sobre la costura entre mente y cerebro.",
        archetypes: "Siete mandalas, una red neuronal por defecto persistente.",
        faust: "La pregunta de sesenta años de Goethe junto al error de predicción.",
        dante: "La Commedia como arquitectura para la red neuronal por defecto.",
      },
    },
    depth: {
      label: "Profundidad",
      tagline: "Ensayos largos + los puentes entre regiones.",
      blurbs: {
        bridges: "Once patrones nombrados de cooperación entre regiones.",
        fieldNotes: "Ensayos breves desde las costuras entre disciplinas.",
        depthPsychology: "Tres lecturas de Jung con la neurociencia — índice.",
        aion: "El libro tardío de Jung sobre el Sí-mismo, leído contra la DMN.",
        redBook: "Confrontación con el inconsciente; imaginación activa como dato.",
        gestalt: "Cómo el cerebro completa la figura — el cierre como predicción.",
      },
    },
    instrument: {
      label: "Instrumento",
      tagline: "Capa de referencia — veinte regiones, seis recorridos guiados.",
      blurbs: {
        atlas: "Veinte regiones catalogadas una por una con anatomía + función.",
        tours: "Seis recorridos guiados, de ocho a quince minutos cada uno.",
      },
    },
  },
  ca: {
    rooms: {
      label: "Sales",
      tagline: "Quatre experiències codificadores amb el cervell reaccionant en directe.",
      blurbs: {
        mirror: "Enganxa qualsevol text; mira com es veu la teva escriptura per sota.",
        music: "Escolta com el so mou les mateixes regions que et commouen.",
        crosscultural: "On el model es trenca en creuar llengües.",
        cellular: "Baixa a reconstruccions neuronals reals; mira disparar una sinapsi.",
      },
    },
    literature: {
      label: "Literatura",
      tagline: "Quatre sales contemplatives — psicologia profunda + literatura canònica.",
      blurbs: {
        threshold: "Un assaig en tres moviments sobre la costura entre ment i cervell.",
        archetypes: "Set mandales, una xarxa neuronal per defecte persistent.",
        faust: "La pregunta de seixanta anys de Goethe al costat de l'error de predicció.",
        dante: "La Commedia com a arquitectura per a la xarxa neuronal per defecte.",
      },
    },
    depth: {
      label: "Profunditat",
      tagline: "Assaigs llargs + els ponts entre regions.",
      blurbs: {
        bridges: "Onze patrons anomenats de cooperació entre regions.",
        fieldNotes: "Assaigs breus des de les costures entre disciplines.",
        depthPsychology: "Tres lectures de Jung amb la neurociència — índex.",
        aion: "El llibre tardà de Jung sobre el Si-mateix, llegit contra la DMN.",
        redBook: "Confrontació amb l'inconscient; imaginació activa com a dada.",
        gestalt: "Com el cervell completa la figura — el tancament com a predicció.",
      },
    },
    instrument: {
      label: "Instrument",
      tagline: "Capa de referència — vint regions, sis recorreguts guiats.",
      blurbs: {
        atlas: "Vint regions catalogades una a una amb anatomia + funció.",
        tours: "Sis recorreguts guiats, de vuit a quinze minuts cadascun.",
      },
    },
  },
  th: {
    rooms: {
      label: "ห้องต่าง ๆ",
      tagline: "สี่ประสบการณ์เข้ารหัส โดยมีสมองตอบสนองสด ๆ",
      blurbs: {
        mirror: "วางข้อความใด ๆ ดูว่างานเขียนของคุณมีหน้าตาอย่างไรอยู่ใต้นั้น",
        music: "ฟังว่าเสียงเคลื่อนไหวบริเวณสมองเดียวกับที่ขับเคลื่อนคุณอย่างไร",
        crosscultural: "จุดที่แบบจำลองพังลงเมื่อข้ามระหว่างภาษา",
        cellular: "ลงลึกสู่การฟื้นฟูเซลล์ประสาทจริง ดูซินแนปส์ปล่อยประจุ",
      },
    },
    literature: {
      label: "วรรณกรรม",
      tagline: "ห้องไตร่ตรองสี่ห้อง — จิตวิทยาเชิงลึก + วรรณกรรมแม่บท",
      blurbs: {
        threshold: "เรียงความสามท่วงทำนองว่าด้วยรอยต่อระหว่างจิตและสมอง",
        archetypes: "เจ็ดมณฑล หนึ่งเครือข่ายโหมดเริ่มต้นอันคงทน",
        faust: "คำถามหกสิบปีของเกอเทอ อ่านเคียงข้างความคลาดเคลื่อนของการทำนาย",
        dante: "เทพศาสนกรรมเป็นสถาปัตยกรรมสำหรับเครือข่ายโหมดเริ่มต้น",
      },
    },
    depth: {
      label: "ความลึก",
      tagline: "เรียงความยาว + สะพานเชื่อมระหว่างบริเวณสมอง",
      blurbs: {
        bridges: "สิบเอ็ดรูปแบบที่มีชื่อของความร่วมมือระหว่างบริเวณสมอง",
        fieldNotes: "เรียงความสั้น ๆ จากตะเข็บระหว่างศาสตร์",
        depthPsychology: "สามการอ่านของยุงคู่กับประสาทวิทยา — สารบัญ",
        aion: "หนังสือยุคหลังของยุงว่าด้วย Self อ่านเทียบกับ DMN",
        redBook: "การเผชิญหน้ากับจิตไร้สำนึก จินตนาการเชิงกระทำเป็นข้อมูล",
        gestalt: "สมองเติมเต็มภาพอย่างไร — การปิดล้อมในฐานะการทำนาย",
      },
    },
    instrument: {
      label: "เครื่องมือ",
      tagline: "ชั้นข้อมูลอ้างอิง — ยี่สิบบริเวณ หกการเดินนำชม",
      blurbs: {
        atlas: "ยี่สิบบริเวณที่จัดทำรายการทีละบริเวณพร้อมกายวิภาคและหน้าที่",
        tours: "หกการเดินนำชม ครั้งละแปดถึงสิบห้านาที",
      },
    },
  },
  ja: {
    rooms: {
      label: "部屋",
      tagline: "脳がリアルタイムで反応する四つのエンコーダ体験。",
      blurbs: {
        mirror: "任意のテキストを貼り、あなたの文章の下層を見る。",
        music: "音があなたを動かす同じ領域をどう動かすかを聴く。",
        crosscultural: "言語を越える際にモデルが崩れる場所。",
        cellular: "実際のニューロン再構成へ降下、シナプスの発火を見る。",
      },
    },
    literature: {
      label: "文学",
      tagline: "四つの観想的な部屋 — 深層心理学 + 正典文学。",
      blurbs: {
        threshold: "心と脳の継ぎ目をめぐる三つの楽章のエッセイ。",
        archetypes: "七つの曼荼羅、一つの持続するデフォルトネットワーク。",
        faust: "ゲーテの六十年の問いを予測誤差とともに読む。",
        dante: "神曲をデフォルトモードネットワークの建築として読む。",
      },
    },
    depth: {
      label: "深層",
      tagline: "長文エッセイ + 領域間の橋。",
      blurbs: {
        bridges: "領域間協働の十一の名指しパターン。",
        fieldNotes: "分野の継ぎ目から書かれた短いエッセイ。",
        depthPsychology: "ユングと神経科学の三つの読み — 目次。",
        aion: "ユング後期の自己についての書を DMN に照らして読む。",
        redBook: "無意識との対峙、能動的想像をデータとして。",
        gestalt: "脳が図形をどう完成させるか — 予測としての閉合。",
      },
    },
    instrument: {
      label: "計器",
      tagline: "参照層 — 二十の領域、六つの案内付き歩行。",
      blurbs: {
        atlas: "二十の領域それぞれに解剖と機能。",
        tours: "六つの案内付き歩行、それぞれ八〜十五分。",
      },
    },
  },
  "zh-CN": {
    rooms: {
      label: "房间",
      tagline: "四种编码体验，大脑实时回应。",
      blurbs: {
        mirror: "粘贴任何文本，看你的书写在其下方的模样。",
        music: "听声音如何调动那些会触动你的同一批脑区。",
        crosscultural: "模型在跨语言时崩塌的地方。",
        cellular: "下沉到真实的神经元重建中，看突触放电。",
      },
    },
    literature: {
      label: "文学",
      tagline: "四间冥想房间 —— 深度心理学 + 经典文学。",
      blurbs: {
        threshold: "三个乐章的随笔，关于心智与大脑之间的接缝。",
        archetypes: "七个曼荼罗，一个持续的默认网络。",
        faust: "歌德六十年的提问，与预测误差并读。",
        dante: "《神曲》作为默认模式网络的建筑。",
      },
    },
    depth: {
      label: "深度",
      tagline: "长篇随笔 + 脑区之间的桥。",
      blurbs: {
        bridges: "十一种命名的跨脑区协作模式。",
        fieldNotes: "从学科接缝处写出的短篇随笔。",
        depthPsychology: "三种荣格与神经科学对话的读法 —— 索引。",
        aion: "荣格晚期关于自性的书，与 DMN 对照阅读。",
        redBook: "与无意识的对质；主动想象作为数据。",
        gestalt: "大脑如何补完图形 —— 闭合即预测。",
      },
    },
    instrument: {
      label: "仪器",
      tagline: "参照层 —— 二十个脑区，六场导览。",
      blurbs: {
        atlas: "二十个脑区，逐一附有解剖与功能。",
        tours: "六场导览，每场八到十五分钟。",
      },
    },
  },
};

for (const locale of ["en", "es", "ca", "th", "ja", "zh-CN"]) {
  const fp = path.join(MESSAGES_DIR, `${locale}.json`);
  const m = JSON.parse(fs.readFileSync(fp, "utf8"));

  if (!m.nav) {
    console.warn(`[skip] ${locale}.json missing nav namespace`);
    continue;
  }

  // Flat labels for new depth-psychology subpages
  Object.assign(m.nav, FLAT_LABELS[locale]);

  // Add menus tree
  m.nav.menus = MENUS[locale];

  fs.writeFileSync(fp, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`[wrote] ${locale}.json`);
}
