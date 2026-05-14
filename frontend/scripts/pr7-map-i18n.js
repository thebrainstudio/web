#!/usr/bin/env node
/**
 * PR 7 — /map page i18n.
 *
 * Adds:
 *   - `map` namespace: label, title, intro, footerNote
 *   - `home.rooms.map`: title + description (used by RoomCard +
 *     `generateRoomMetadata`)
 *
 * Run from frontend/: node scripts/pr7-map-i18n.js
 */

const fs = require("node:fs");
const path = require("node:path");
const MESSAGES_DIR = path.join(__dirname, "..", "messages");

const MAP_NS = {
  en: {
    label: "Site map",
    title: "An index for the whole site.",
    intro: "Three columns. Rooms, regions, long-form essays. Hover a card and the cross-references in the other columns light up. The page is meant to read in order — a catalogue you can scan, not a network diagram you have to decode.",
    footerNote: "Region labels collapse to four IDs per card; click into a room or essay for the full list. Bridge-section labels under each region are the canonical pattern that region most participates in — the same labels used on the Bridges page.",
  },
  es: {
    label: "Mapa del sitio",
    title: "Un índice para todo el sitio.",
    intro: "Tres columnas. Salas, regiones, ensayos de forma larga. Pasa el cursor por una tarjeta y las referencias cruzadas en las otras columnas se iluminan. La página está pensada para leerse en orden — un catálogo que puedes hojear, no un diagrama de red que tengas que descifrar.",
    footerNote: "Las etiquetas de región se colapsan a cuatro identificadores por tarjeta; entra en una sala o ensayo para ver la lista completa. Las etiquetas de sección-puente bajo cada región son el patrón canónico en el que esa región más participa — las mismas etiquetas que usa la página de Puentes.",
  },
  ca: {
    label: "Mapa del lloc",
    title: "Un índex per a tot el lloc.",
    intro: "Tres columnes. Sales, regions, assaigs de forma llarga. Passa el cursor per una targeta i les referències creuades a les altres columnes s'il·luminen. La pàgina està pensada per llegir-se en ordre — un catàleg que pots fullejar, no un diagrama de xarxa que hagis de desxifrar.",
    footerNote: "Les etiquetes de regió es col·lapsen a quatre identificadors per targeta; entra en una sala o assaig per veure la llista completa. Les etiquetes de secció-pont sota cada regió són el patró canònic en què aquesta regió més participa — les mateixes etiquetes que utilitza la pàgina de Ponts.",
  },
  th: {
    label: "แผนผังเว็บไซต์",
    title: "ดัชนีสำหรับทั้งเว็บไซต์",
    intro: "สามคอลัมน์ ห้องต่าง ๆ บริเวณสมอง และเรียงความรูปยาว วางเคอร์เซอร์บนการ์ดหนึ่งแล้วการอ้างอิงข้ามในคอลัมน์อื่นจะสว่างขึ้น หน้านี้ตั้งใจให้อ่านตามลำดับ — เป็นแคตตาล็อกที่คุณกวาดสายตาได้ ไม่ใช่ไดอะแกรมเครือข่ายที่ต้องถอดรหัส",
    footerNote: "ป้ายบริเวณสมองในแต่ละการ์ดถูกย่อเหลือสี่รหัส คลิกเข้าห้องหรือเรียงความเพื่อดูรายการเต็ม ป้ายส่วนสะพานใต้แต่ละบริเวณคือรูปแบบหลักที่บริเวณนั้นมีส่วนร่วมมากที่สุด — ป้ายเดียวกับที่ใช้บนหน้าสะพานเชื่อม",
  },
  ja: {
    label: "サイトマップ",
    title: "サイト全体の索引。",
    intro: "三つの列。部屋、領域、長文エッセイ。一枚のカードにカーソルを乗せると、他の列の相互参照が点灯する。ページは順に読むことを意図している — 解読すべきネットワーク図ではなく、目を通せるカタログ。",
    footerNote: "領域ラベルはカードあたり四つの ID に畳まれている。完全な一覧は各部屋やエッセイの中で見られる。各領域の下にある橋セクション・ラベルは、その領域が最も関与する正典的パターン — Bridges ページで使われているのと同じラベル。",
  },
  "zh-CN": {
    label: "站点地图",
    title: "整个站点的索引。",
    intro: "三列。房间、脑区、长篇随笔。把指针停在一张卡上，其它两列里的相关项就会点亮。本页是为按顺序阅读而设计的 —— 一个可供翻看的目录，而非一张需要破译的网络图。",
    footerNote: "每张卡上的脑区标签折叠为四个标识；进入某个房间或随笔以查看完整列表。每个脑区下方的桥梁分区标签是该脑区最为参与的规范模式 —— 与桥梁页所用标签相同。",
  },
};

const HOME_ROOMS_MAP = {
  en: { title: "Site Map", description: "Three columns showing how rooms, regions, and long-form essays cross-reference." },
  es: { title: "Mapa del Sitio", description: "Tres columnas que muestran cómo se cruzan salas, regiones y ensayos largos." },
  ca: { title: "Mapa del Lloc", description: "Tres columnes que mostren com es creuen sales, regions i assaigs llargs." },
  th: { title: "แผนผังเว็บไซต์", description: "สามคอลัมน์ที่แสดงว่าห้อง บริเวณสมอง และเรียงความยาวเชื่อมโยงกันอย่างไร" },
  ja: { title: "サイトマップ", description: "部屋、領域、長文エッセイの相互参照を示す三つの列。" },
  "zh-CN": { title: "站点地图", description: "三列展示房间、脑区与长篇随笔如何相互交叉。" },
};

for (const locale of ["en", "es", "ca", "th", "ja", "zh-CN"]) {
  const fp = path.join(MESSAGES_DIR, `${locale}.json`);
  const m = JSON.parse(fs.readFileSync(fp, "utf8"));

  m.map = MAP_NS[locale];
  if (m.home && m.home.rooms) {
    m.home.rooms.map = HOME_ROOMS_MAP[locale];
  }

  fs.writeFileSync(fp, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`[wrote] ${locale}.json`);
}
