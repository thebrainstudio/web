import { Fraunces, JetBrains_Mono, Caveat, Noto_Serif_Thai } from "next/font/google";

/**
 * Three-font system (plus a Thai fallback).
 *
 *   --font-editorial   — the one content typeface for all running text:
 *                        display headings, headings, body, captions.
 *                        Slot: this project's design language calls for
 *                        PP Editorial New (proprietary, Pangram Pangram).
 *                        We currently shim with **Fraunces** (Google Fonts,
 *                        SIL OFL) — a variable serif with opt-in italic,
 *                        optical size, and soft axis. Closest free match.
 *                        To swap in real PP Editorial New: add @font-face
 *                        declarations in globals.css pointing at your
 *                        licensed files and assign them to --font-editorial.
 *
 *   --font-mono        — JetBrains Mono. Numerical and technical text only.
 *
 *   --font-hand        — Caveat. Marginalia and ONLY marginalia.
 *                        Hard-limited to 10 instances per page (see
 *                        components/typography/Typography.tsx).
 *
 *   --font-thai        — Noto Serif Thai. Automatic fallback for Thai
 *                        glyphs in any text that mixes Latin and Thai.
 */

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-editorial",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hand",
  weight: ["400"],
});

export const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  display: "swap",
  variable: "--font-thai",
  weight: ["400", "500"],
});

export const fontVariables = [
  fraunces.variable,
  jetbrainsMono.variable,
  caveat.variable,
  notoSerifThai.variable,
].join(" ");
