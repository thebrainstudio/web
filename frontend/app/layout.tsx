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
import SiteHeader from "@/components/nav/SiteHeader";
import CursorFollower from "@/components/motion/CursorFollower";
import AmbientDrone from "@/components/audio/AmbientDrone";
import FilmGrain from "@/components/atmospheric/FilmGrain";

export const metadata: Metadata = {
  title: "The Brain Studio",
  description:
    "A cinematic experiment in seeing the mind through a brain-encoding model.",
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
        <SmoothScroll>
          <BrainStage />
          <SiteHeader />
          <main className="relative z-10">{children}</main>
          <CursorFollower />
          <AmbientDrone />
          <FilmGrain />
        </SmoothScroll>
      </body>
    </html>
  );
}
