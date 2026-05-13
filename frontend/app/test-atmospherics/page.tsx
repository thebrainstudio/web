"use client";

import { useState } from "react";
import AtmosphericGlow, {
  type GlowPreset,
  type GlowIntensity,
} from "@/components/atmospheric/AtmosphericGlow";
import {
  Display,
  Heading,
  Body,
  Caption,
} from "@/components/typography/Typography";

/**
 * Debug harness: all three glow presets at all three intensities, plus a
 * baseline view. Useful for inspecting the wash + grain alone, and for
 * verifying contrast against the brightest glow point.
 */
export default function TestAtmospherics() {
  const [intensity, setIntensity] = useState<GlowIntensity>("medium");
  const [preset, setPreset] = useState<GlowPreset | "none">("amber-lamp");
  const [animateOn, setAnimateOn] = useState(false);

  const presets: (GlowPreset | "none")[] = [
    "none",
    "amber-lamp",
    "cool-cathedral",
    "oxblood-ember",
  ];
  const intensities: GlowIntensity[] = ["subtle", "medium", "pronounced"];

  return (
    <main className="relative min-h-screen px-6 pb-24 pt-32 md:px-10">
      {preset !== "none" && (
        <AtmosphericGlow
          preset={preset}
          intensity={intensity}
          animate={animateOn}
        />
      )}

      <header className="mx-auto max-w-[1000px]">
        <Caption uppercase as="p" className="text-brass">
          Debug
        </Caption>
        <Heading className="mt-4">Atmospheric harness.</Heading>
        <Body className="text-bone-cream/65 mt-3">
          The body wash + film grain are on every page. Glows are deliberate.
          Use this view to confirm contrast and tune intensity.
        </Body>
      </header>

      <section className="mx-auto mt-10 max-w-[1000px]">
        <Caption uppercase className="text-bone-cream/40">
          Preset
        </Caption>
        <div className="mt-3 flex flex-wrap gap-3">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPreset(p)}
              className={`rounded-sm px-3 py-1.5 transition-colors duration-200 ${
                preset === p
                  ? "bg-brass text-navy-deep"
                  : "text-bone-cream/70 hover:text-bone-cream"
              }`}
            >
              <Caption uppercase>{p}</Caption>
            </button>
          ))}
        </div>

        <Caption uppercase className="text-bone-cream/40 mt-8 block">
          Intensity
        </Caption>
        <div className="mt-3 flex flex-wrap gap-3">
          {intensities.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIntensity(i)}
              className={`rounded-sm px-3 py-1.5 transition-colors duration-200 ${
                intensity === i
                  ? "bg-brass text-navy-deep"
                  : "text-bone-cream/70 hover:text-bone-cream"
              }`}
            >
              <Caption uppercase>{i}</Caption>
            </button>
          ))}
        </div>

        <Caption uppercase className="text-bone-cream/40 mt-8 block">
          Animate
        </Caption>
        <button
          type="button"
          onClick={() => setAnimateOn((v) => !v)}
          className={`mt-3 rounded-sm px-3 py-1.5 transition-colors duration-200 ${
            animateOn
              ? "bg-brass text-navy-deep"
              : "text-bone-cream/70 hover:text-bone-cream"
          }`}
        >
          <Caption uppercase>{animateOn ? "on" : "off"}</Caption>
        </button>

        <div className="mt-16 space-y-8">
          <Display>The quick brown fox jumps over the lazy dog.</Display>
          <Heading italic>
            Italic heading — the editorial voice carrying intent.
          </Heading>
          <Body className="text-bone-cream/80 max-w-[40rem]">
            A paragraph of body text in the editorial typeface. Long enough to
            test leading and tracking against the glow&apos;s brightest point.
            If you can read this comfortably here, contrast is fine.
          </Body>
          <Caption uppercase className="text-bone-cream/60">
            Caption — small label, deliberate tracking
          </Caption>
        </div>
      </section>
    </main>
  );
}
