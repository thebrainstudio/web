import {
  Fraunces,
  JetBrains_Mono,
  Caveat,
  Noto_Serif_Thai,
} from "next/font/google";

/**
 * Three-font system (plus a Thai fallback).
 *
 *   --font-editorial   The single content typeface for display, headings,
 *                      body, and captions. The design language calls for
 *                      PP Editorial New (proprietary, Pangram Pangram).
 *                      Currently shimmed with **Fraunces**, configured
 *                      below to match PP Editorial New's character as
 *                      closely as the free-font space allows:
 *                        - opsz axis on  (optical sizing)
 *                        - SOFT axis on  (gentle terminal softness)
 *                        - italic style requested so italic shapes
 *                          ship in the same `--font-editorial` family
 *                          (no separate font for italic)
 *                        - weight range 200–500 (ultralight to medium)
 *                      To swap in licensed PP Editorial New, see
 *                      app/fonts.local.example.ts.
 *
 *   --font-mono        JetBrains Mono — numerical / technical text only.
 *
 *   --font-hand        Caveat — marginalia only (`<Hand>` 10-instance cap).
 *
 *   --font-thai        Noto Serif Thai — automatic Thai glyph fallback.
 */

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-editorial",
  // Fraunces is variable — request both italic styles and the axes that
  // shape its editorial character. `weight` is intentionally omitted
  // (Tailwind v4 + next/font requires that when axes are present).
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
  preload: false,
});

export const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hand",
  weight: ["400"],
  preload: false,
});

export const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  display: "swap",
  variable: "--font-thai",
  weight: ["400", "500"],
  preload: false,
});

export const fontVariables = [
  fraunces.variable,
  jetbrainsMono.variable,
  caveat.variable,
  notoSerifThai.variable,
].join(" ");
