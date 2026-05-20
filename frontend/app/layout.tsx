import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontVariablesForLocale } from "./fonts";
import { SITE_URL } from "@/lib/urls";
import "./globals.css";
import "./background-system.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import BrainStage from "@/components/brain/BrainStage";
import RegionAnnouncer from "@/components/brain/RegionAnnouncer";
import FilmGrain from "@/components/atmospheric/FilmGrain";
import DeferredClient from "@/components/client/DeferredClient";
import TransitionOrchestrator from "@/components/motion/TransitionOrchestrator";
import PersistentAtmosphere from "@/components/atmospheric/PersistentAtmosphere";
import BackgroundSystem from "@/components/atmospheric/BackgroundSystem";

/**
 * Root layout. Hosts the persistent shell that must survive every
 * navigation, including switching locales:
 *
 *   - <html>/<body> tags
 *   - font CSS variables (declared once; only the ones referenced by the
 *     active locale's html[lang] block actually render)
 *   - BrainStage (the persistent macro brain — one WebGL canvas for the
 *     life of the session)
 *   - RegionAnnouncer, FilmGrain, DeferredClient — all persistent shell
 *
 * SiteHeader and <main> live inside `app/[locale]/layout.tsx` because they
 * read translations from NextIntlClientProvider. Test pages (app/test-*)
 * stay outside [locale] and don't get the header — that's acceptable for
 * dev-only routes.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Brain Studio",
    template: "%s · The Brain Studio",
  },
  description:
    "A cinematic experiment in seeing the mind through a brain-encoding model. Eight rooms — from language and music to the cellular machinery below.",
  openGraph: {
    title: "The Brain Studio",
    description:
      "A cinematic experiment in seeing the mind through a brain-encoding model.",
    url: SITE_URL,
    siteName: "The Brain Studio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Brain Studio",
    description:
      "A cinematic experiment in seeing the mind through a brain-encoding model.",
  },
  authors: [{ name: "Frank Caules" }],
  category: "experiment",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // audit-fix: lang attribute per locale. next-intl resolves the active
  // locale from the request URL (set up by proxy.ts middleware) so SSR
  // produces the correct <html lang> on first paint for screen readers
  // and search engines, instead of falling back to "en" everywhere.
  const locale = await getLocale();
  // audit-fix: Task 6. Only mount the font variables the active locale
  // actually needs, so non-matching scripts don't trigger their @font-face
  // engagement.
  const fonts = fontVariablesForLocale(locale);
  return (
    <html lang={locale} className={`${fonts} h-full`} suppressHydrationWarning>
      <body className="text-bone-cream min-h-full antialiased">
        {/* Background system — four-layer static stack (plate + halo +
            grain) keyed by [data-room]. Sits at z-index -2/-1, beneath
            the rest of the persistent shell. See
            `app/background-system.css` and
            `components/atmospheric/BackgroundSystem.tsx`. */}
        <BackgroundSystem />
        <SmoothScroll>
          {/* Persistent atmosphere paints first so the brain canvas
              composites on top of it. Stacking order at z-0:
              atmosphere → brain stage → content (z-10+). */}
          <PersistentAtmosphere />
          <BrainStage />
          <TransitionOrchestrator />
          {children}
          <RegionAnnouncer />
          <DeferredClient />
          <FilmGrain />
        </SmoothScroll>
        {/* Vercel Analytics + Speed Insights — minimal, privacy-aware,
            captures page views + Core Web Vitals. No cookies, no PII. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
