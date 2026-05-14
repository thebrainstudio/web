#!/usr/bin/env node
/**
 * PR 9 — shared SiteFooter i18n.
 *
 * Adds a top-level `footer` namespace with the strings the new
 * <SiteFooter /> component reads:
 *
 *   footer.built     — "Built at Chulalongkorn JIPP" (or local equiv)
 *   footer.encoder   — "TRIBE v2 encoder"
 *   footer.version   — "v1.0 · last reviewed 2026-05-14"
 *   footer.github    — "Source on GitHub"
 *
 * The previous `home.footer` keys are kept intact (used by the
 * home page's old footer markup until we migrate) but the new
 * SiteFooter pulls from the top-level namespace so every page can
 * mount the same component without home-coupling.
 *
 * Run from frontend/: node scripts/pr9-footer-i18n.js
 */

const fs = require("node:fs");
const path = require("node:path");
const MESSAGES_DIR = path.join(__dirname, "..", "messages");

const FOOTER = {
  en: {
    built: "Built at Chulalongkorn JIPP",
    encoder: "TRIBE v2 encoder",
    version: "v1.0 · last reviewed 2026-05-14",
    github: "Source on GitHub",
  },
  es: {
    built: "Construido en Chulalongkorn JIPP",
    encoder: "Encoder TRIBE v2",
    version: "v1.0 · última revisión 2026-05-14",
    github: "Código fuente en GitHub",
  },
  ca: {
    built: "Construït a Chulalongkorn JIPP",
    encoder: "Encoder TRIBE v2",
    version: "v1.0 · última revisió 2026-05-14",
    github: "Codi font a GitHub",
  },
  th: {
    built: "พัฒนาที่จุฬาฯ JIPP",
    encoder: "TRIBE v2 encoder",
    version: "v1.0 · ตรวจทานล่าสุด 2026-05-14",
    github: "ซอร์สโค้ดบน GitHub",
  },
  ja: {
    built: "Chulalongkorn JIPP にて構築",
    encoder: "TRIBE v2 エンコーダ",
    version: "v1.0 · 最終レビュー 2026-05-14",
    github: "GitHub のソース",
  },
  "zh-CN": {
    built: "于朱拉隆功大学 JIPP 构建",
    encoder: "TRIBE v2 编码器",
    version: "v1.0 · 最近审阅 2026-05-14",
    github: "GitHub 源码",
  },
};

for (const locale of ["en", "es", "ca", "th", "ja", "zh-CN"]) {
  const fp = path.join(MESSAGES_DIR, `${locale}.json`);
  const m = JSON.parse(fs.readFileSync(fp, "utf8"));

  m.footer = FOOTER[locale];

  fs.writeFileSync(fp, JSON.stringify(m, null, 2) + "\n", "utf8");
  console.log(`[wrote] ${locale}.json`);
}
