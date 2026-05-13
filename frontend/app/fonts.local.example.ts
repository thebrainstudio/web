/**
 * EXAMPLE: PP Editorial New drop-in.
 *
 * When you have licensed PP Editorial New files from Pangram Pangram:
 *
 *   1. Place the files under `public/fonts/pp-editorial-new/`:
 *        - PPEditorialNew-Ultralight.woff2
 *        - PPEditorialNew-UltralightItalic.woff2
 *        - PPEditorialNew-Regular.woff2
 *        - PPEditorialNew-Italic.woff2
 *        (any subset of weights you license; match `src` paths below)
 *
 *   2. Rename this file to `fonts.ts` (replacing the current one) OR
 *      replace just the `fraunces` export in `fonts.ts` with the
 *      `ppEditorialNew` export defined here. Keep the same variable name
 *      (`--font-editorial`) so every component picks it up automatically.
 *
 *   3. Update `globals.css` if you want to tune the fallback chain —
 *      currently it's `var(--font-editorial), "Iowan Old Style", ...`.
 *
 *   4. Strip Fraunces from app/fonts.ts to drop the unused weight.
 *
 * No component code changes. Every `<Display>`, `<Heading>`, `<Body>`,
 * and `<Caption>` is wired through `--font-editorial`.
 */

import localFont from "next/font/local";

export const ppEditorialNew = localFont({
  src: [
    {
      path: "../public/fonts/pp-editorial-new/PPEditorialNew-Ultralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/pp-editorial-new/PPEditorialNew-UltralightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/pp-editorial-new/PPEditorialNew-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/pp-editorial-new/PPEditorialNew-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-editorial",
  fallback: ["Iowan Old Style", "Georgia", "ui-serif", "serif"],
  adjustFontFallback: "Times New Roman",
});
