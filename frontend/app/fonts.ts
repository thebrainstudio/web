import {
  Fraunces,
  JetBrains_Mono,
  Caveat,
  Noto_Serif_Thai,
  Sriracha,
  Noto_Serif_JP,
  Yusei_Magic,
  Noto_Serif_SC,
  Long_Cang,
} from "next/font/google";

/**
 * Multi-script font system.
 *
 * Universal three (always mounted on <html> — Latin + numeric + marginalia):
 *   --font-editorial   Fraunces. Single content typeface for display /
 *                      heading / body / caption.
 *   --font-mono        JetBrains Mono — numerical / technical only.
 *   --font-hand        Caveat — marginalia only (Hand component).
 *
 * Locale-specific fonts are only mounted on <html> for matching locales
 * (audit-fix: Task 6). The CSS in globals.css's `html[lang="th"]`,
 * `html[lang="ja"]`, `html[lang="zh-CN"]` blocks reads `var(--font-thai)`
 * etc. — those vars only resolve when the corresponding font's variable
 * className is on <html>, so non-matching locales never engage the
 * @font-face declaration and the .woff2 file is never requested.
 *
 *   th       → Noto Serif Thai (--font-thai)  + Sriracha (--font-thai-hand)
 *   ja       → Noto Serif JP   (--font-jp)    + Yusei Magic (--font-jp-hand)
 *   zh-CN    → Noto Serif SC   (--font-sc)    + Long Cang (--font-sc-hand)
 */

// audit-fix: Task 6. Universal three keep preload: true.
export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  // `--font-editorial-loaded` is the raw next/font face name. @theme
  // composes it into the public `--font-editorial` token, which html[lang]
  // blocks can safely override without recursing back into the same name.
  variable: "--font-editorial-loaded",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  preload: true,
  fallback: ["Iowan Old Style", "Georgia", "ui-serif", "serif"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
  preload: true,
});

export const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hand-loaded",
  weight: ["400"],
  preload: true,
});

// audit-fix: Task 6. Locale-specific fonts — preload: false, only mounted
// when the active locale matches.
export const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  display: "swap",
  variable: "--font-thai",
  weight: ["400", "500"],
  preload: false,
});

export const sriracha = Sriracha({
  subsets: ["thai"],
  display: "swap",
  variable: "--font-thai-hand",
  weight: ["400"],
  preload: false,
});

export const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jp",
  weight: ["400", "500", "600"],
  preload: false,
});

export const yuseiMagic = Yusei_Magic({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jp-hand",
  weight: ["400"],
  preload: false,
});

export const notoSerifSC = Noto_Serif_SC({
  display: "swap",
  variable: "--font-sc",
  weight: ["400", "500", "600"],
  preload: false,
});

export const longCang = Long_Cang({
  display: "swap",
  variable: "--font-sc-hand",
  weight: ["400"],
  preload: false,
});

/** Always-mounted font variable classNames. */
const universalFontVariables = [
  fraunces.variable,
  jetbrainsMono.variable,
  caveat.variable,
].join(" ");

/**
 * Returns the font variable classNames to apply to <html> for a given
 * locale: universal three + the script-specific fonts the locale needs.
 *
 * audit-fix: Task 6. The previous `fontVariables` constant always
 * applied all 9 fonts to <html>, which caused the locale-specific
 * @font-face declarations to be engaged by the CSS even on locales
 * that didn't need them. Now non-matching locales don't get the
 * className, so the `var(--font-thai)` (etc.) references in
 * globals.css evaluate to undefined and the browser never fetches
 * the corresponding .woff2.
 */
export function fontVariablesForLocale(locale: string): string {
  switch (locale) {
    case "th":
      return [
        universalFontVariables,
        notoSerifThai.variable,
        sriracha.variable,
      ].join(" ");
    case "ja":
      return [
        universalFontVariables,
        notoSerifJP.variable,
        yuseiMagic.variable,
      ].join(" ");
    case "zh-CN":
      return [
        universalFontVariables,
        notoSerifSC.variable,
        longCang.variable,
      ].join(" ");
    default:
      // en, es, ca — Latin only.
      return universalFontVariables;
  }
}

/**
 * Legacy: every variable. Kept exported for backwards compat in case
 * other code references it, but the root layout now uses
 * `fontVariablesForLocale(locale)`.
 */
export const fontVariables = [
  fraunces.variable,
  jetbrainsMono.variable,
  caveat.variable,
  notoSerifThai.variable,
  sriracha.variable,
  notoSerifJP.variable,
  yuseiMagic.variable,
  notoSerifSC.variable,
  longCang.variable,
].join(" ");
