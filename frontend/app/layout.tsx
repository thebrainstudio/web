import type { Metadata } from "next";
import { fraunces, inter } from "./fonts";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import BrainStage from "@/components/brain/BrainStage";
import SiteHeader from "@/components/nav/SiteHeader";
import CursorFollower from "@/components/motion/CursorFollower";
import AmbientDrone from "@/components/audio/AmbientDrone";

export const metadata: Metadata = {
  title: "The Brain Studio",
  description:
    "A cinematic experiment in seeing the mind through a brain-encoding model.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="bg-navy-deep text-bone-cream min-h-full antialiased">
        <SmoothScroll>
          <BrainStage />
          <SiteHeader />
          <main className="relative z-10">{children}</main>
          <CursorFollower />
          <AmbientDrone />
        </SmoothScroll>
      </body>
    </html>
  );
}
