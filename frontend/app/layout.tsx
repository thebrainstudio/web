import type { Metadata } from "next";
import {
  fraunces,
  jetbrainsMono,
  caveat,
  notoSerifThai,
} from "./fonts";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import BrainStage from "@/components/brain/BrainStage";
import RegionAnnouncer from "@/components/brain/RegionAnnouncer";
import SiteHeader from "@/components/nav/SiteHeader";
import FilmGrain from "@/components/atmospheric/FilmGrain";
import DeferredClient from "@/components/client/DeferredClient";
import { Caption } from "@/components/typography/Typography";

export const metadata: Metadata = {
  metadataBase: new URL("https://brain-studio-kappa.vercel.app"),
  title: {
    default: "The Brain Studio",
    template: "%s · The Brain Studio",
  },
  description:
    "A cinematic experiment in seeing the mind through a brain-encoding model. Three rooms — language, music, and the limits of translation.",
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

const fontClass = [
  fraunces.variable,
  jetbrainsMono.variable,
  caveat.variable,
  notoSerifThai.variable,
].join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontClass} h-full`}>
      <body className="text-bone-cream min-h-full antialiased">
        {/* Skip link — keyboard users jump straight to <main>. */}
        <a
          href="#main"
          className="focus:bg-brass focus:text-navy-deep sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1100] focus:rounded-sm focus:px-4 focus:py-2"
        >
          <Caption uppercase>Skip to content</Caption>
        </a>
        <SmoothScroll>
          <BrainStage />
          <SiteHeader />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <RegionAnnouncer />
          <DeferredClient />
          <FilmGrain />
        </SmoothScroll>
      </body>
    </html>
  );
}
