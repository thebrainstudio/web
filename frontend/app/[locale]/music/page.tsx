"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ScrollScene from "@/components/motion/ScrollScene";
import PinnedSequence, {
  PinnedStep,
} from "@/components/motion/PinnedSequence";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import TrackPlayer from "@/components/music/TrackPlayer";
import TrackChooser from "@/components/music/TrackChooser";
import CompareMode from "@/components/music/CompareMode";
import UploadMode from "@/components/music/UploadMode";
import InsightEssay from "@/components/music/InsightEssay";
import ProvenanceBadge from "@/components/brain/ProvenanceBadge";
import {
  Body,
  Caption,
  Display,
} from "@/components/typography/Typography";
import { musicTracks } from "@/lib/musicTracks";

type Mode = "library" | "compare" | "upload";

/**
 * Phase 6 — NeuroMusic Lab.
 *
 * Layout:
 *   Shot 1   entry: brain glides right; left panel: "Hearing is the
 *            oldest of the senses to fully form. It begins in the womb."
 *   Shot 2   the player surface with mode tabs (Library / Compare / Upload)
 *   Shot 3   closing PinnedSequence: three insight essays. Each essay
 *            drives the brain toward its referenced track's mid-point.
 *
 * The player is silent for Phase 6; tracks ship as timelines that the
 * scrubber interpolates. Audio asset licensing is Phase 11 work.
 */
export default function MusicPage() {
  const t = useTranslations("music");
  const [mode, setMode] = useState<Mode>("library");
  const [activeId, setActiveId] = useState(musicTracks[0].id);
  const active =
    musicTracks.find((track) => track.id === activeId) ?? musicTracks[0];

  const modes: { id: Mode; label: string }[] = [
    { id: "library", label: t("modes.library") },
    { id: "compare", label: t("modes.compare") },
    { id: "upload", label: t("modes.upload") },
  ];

  return (
    <>
      {/* Shot 1 — entry */}
      <ScrollScene
        id="music-entry"
        brain={{
          position: [0.8, 0.05, 0],
          scale: 0.82,
          rotation: [0, -0.28, 0],
          activations: {},
        }}
        lighting="warm"
        className="relative grid min-h-screen grid-cols-1 px-6 pt-36 md:grid-cols-12 md:px-10 md:pt-44"
      >
        <AtmosphericGlow preset="cool-cathedral" intensity="subtle" />
        <div className="md:col-span-7">
          <Caption uppercase className="text-brass">
            {t("label")}
          </Caption>
          <Display italic className="mt-8">
            {t("title")}
          </Display>
          <Body className="text-bone-cream/80 mt-8 max-w-[34rem]">
            {t("intro")}
          </Body>
          {/* Integrity-pass: badge naming the data source for
              the per-track timelines (Neurosynth meta-analytic
              composites; see ProvenanceFooter on each player
              card for the full citation). */}
          <div className="mt-8">
            <ProvenanceBadge state="neurosynth" />
          </div>
        </div>
        <div aria-hidden className="md:col-span-5" />
      </ScrollScene>

      {/* Shot 2 — player surface */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              {modes.map((m) => {
                const sel = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    data-hover
                    className={`rounded-sm px-3 py-1.5 transition-colors duration-200 ${
                      sel
                        ? "bg-brass text-navy-deep"
                        : "text-bone-cream/85 hover:text-bone-cream"
                    }`}
                  >
                    <Caption uppercase>{m.label}</Caption>
                  </button>
                );
              })}
            </div>
            {mode === "library" && (
              <TrackChooser
                tracks={musicTracks}
                activeId={activeId}
                onSelect={setActiveId}
              />
            )}
          </div>

          <div className="mt-14">
            {mode === "library" && (
              <TrackPlayer track={active} primary driveBrain />
            )}
            {mode === "compare" && <CompareMode />}
            {mode === "upload" && <UploadMode />}
          </div>
        </div>
      </section>

      {/* Shot 3 — pinned insight essays */}
      <ScrollScene
        id="music-essays"
        brain={{
          position: [0, 0, 0],
          scale: 0.95,
          rotation: [0, 0, 0],
          activations: {},
        }}
        lighting="cinematic"
        className="relative"
      >
        <PinnedSequence steps={3}>
          <PinnedStep>
            <InsightEssay
              index={0}
              trackId="ambient-drone"
              headline={t("essay1.headline")}
              body={t("essay1.body")}
            />
          </PinnedStep>
          <PinnedStep>
            <InsightEssay
              index={1}
              trackId="modal-ballad"
              headline={t("essay2.headline")}
              body={t("essay2.body")}
            />
          </PinnedStep>
          <PinnedStep>
            <InsightEssay
              index={2}
              trackId="thai-lullaby"
              headline={t("essay3.headline")}
              body={t("essay3.body")}
            />
          </PinnedStep>
        </PinnedSequence>
      </ScrollScene>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/80">
          {t("footerNote")}
        </Caption>
      </footer>
    </>
  );
}
