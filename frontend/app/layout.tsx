import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import BrainStage from "@/components/brain/BrainStage";
import RegionAnnouncer from "@/components/brain/RegionAnnouncer";
import FilmGrain from "@/components/atmospheric/FilmGrain";
import DeferredClient from "@/components/client/DeferredClient";
import TransitionOrchestrator from "@/components/motion/TransitionOrchestrator";
import PersistentAtmosphere from "@/components/atmospheric/PersistentAtmosphere";

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
  metadataBase: new URL("https://brain-studio-kappa.vercel.app"),
  title: {
    default: "The Brain Studio",
    template: "%s · The Brain Studio",
  },
  description:
    "A cinematic experiment in seeing the mind through a brain-encoding model. Six rooms — from language and music to the cellular machinery below.",
  openGraph: {
    title: "The Brain Studio",
    description:
      "A cinematic experiment in seeing the mind through a brain-encoding model.",
    url: "https://brain-studio-kappa.vercel.app",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full`} suppressHydrationWarning>
      <body className="text-bone-cream min-h-full antialiased">
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
      </body>
    </html>
  );
}
