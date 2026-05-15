"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Body,
  Caption,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import VideoTimelineDriver, {
  type VideoActivationFile,
} from "@/components/brain/VideoTimelineDriver";
import ProvenanceBadge from "@/components/brain/ProvenanceBadge";

type Props = {
  files: Record<string, VideoActivationFile | null>;
};

/**
 * Encoder Lab UI shell. Holds the gallery selection state, renders
 * the active video via `VideoTimelineDriver` (which pushes
 * interpolated parcel activations to the persistent brain), and
 * surfaces the provenance + composition for the current clip.
 *
 * Provenance is two-tier:
 *   - Top-level: the data source for the activation timeline
 *     (Neurosynth preview vs. TRIBE v2 — read off the JSON's
 *     `source` field, so the swap is automatic).
 *   - Per-video: the clip's CC source URL + license + editorial
 *     notes (what the keyframe composition represents).
 */
export default function EncoderLab({ files }: Props) {
  const t = useTranslations("encoder");

  // Default to the first non-null video.
  const defaultId =
    Object.keys(files).find((k) => files[k] !== null) ?? null;
  const [activeId, setActiveId] = useState<string | null>(defaultId);

  const activeFile = activeId ? files[activeId] : null;

  const sourceIsTribe = (activeFile?.source ?? "").toLowerCase().includes(
    "tribe",
  );

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
      {/* Gallery — left column */}
      <aside className="md:col-span-4">
        <Caption uppercase className="text-brass mb-6 block tracking-[0.18em]">
          {t("galleryLabel")}
        </Caption>
        <ul className="space-y-3">
          {Object.entries(files).map(([id, file]) => {
            if (!file) return null;
            const active = id === activeId;
            return (
              <li key={id}>
                <button
                  type="button"
                  data-hover
                  onClick={() => setActiveId(id)}
                  className={`group flex w-full items-stretch gap-3 rounded-sm border px-3 py-3 text-left transition-colors duration-200 ${
                    active
                      ? "border-brass/60 bg-brass/5 text-bone-cream"
                      : "border-bone-cream/10 text-bone-cream/75 hover:border-brass/40 hover:text-bone-cream"
                  }`}
                >
                  <img
                    src={`/videos/${id}.jpg`}
                    alt=""
                    className="h-16 w-24 flex-shrink-0 rounded-sm object-cover opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <span className="flex flex-col">
                    <Caption uppercase className="tracking-[0.14em]">
                      {t(`videos.${id}.title`)}
                    </Caption>
                    <Mono
                      variant="label"
                      className={`mt-1 block leading-snug ${
                        active ? "text-brass/80" : "text-bone-cream/50"
                      }`}
                    >
                      {t(`videos.${id}.region`)} · {file.duration.toFixed(0)}s
                    </Mono>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Player + provenance — right column */}
      <section className="md:col-span-8">
        {activeFile && activeId ? (
          <>
            <VideoTimelineDriver
              videoId={activeId}
              videoSrc={`/videos/${activeId}.mp4`}
              posterSrc={`/videos/${activeId}.jpg`}
              file={activeFile}
            />

            <div className="mt-8">
              <Heading as="h3" className="font-[200]">
                {t(`videos.${activeId}.title`)}
              </Heading>
              <Body italic className="text-bone-cream/80 mt-3 max-w-[36rem]">
                {t(`videos.${activeId}.framing`)}
              </Body>
              {/* Integrity-pass: badge state auto-detects whether
                  the JSON came from TRIBE v2 (Colab swap-in) or
                  the Neurosynth preview path. */}
              <div className="mt-5">
                <ProvenanceBadge
                  state={sourceIsTribe ? "tribe-inference" : "neurosynth"}
                />
              </div>
            </div>

            {/* Per-video provenance + composition */}
            <details className="mt-8 group">
              <summary className="cursor-pointer list-none">
                <Mono
                  variant="label"
                  className="text-bone-cream/75 tracking-[0.18em] group-hover:text-bone-cream/85 transition-colors"
                >
                  {sourceIsTribe ? t("provenanceTribe") : t("provenanceNeurosynth")}
                  {" · "}
                  {activeFile.parcellation} · {activeFile.license}{" "}
                  <span
                    aria-hidden
                    className="text-brass/70 ml-1 inline-block transition-transform group-open:rotate-90"
                  >
                    ▸
                  </span>
                </Mono>
              </summary>
              <div className="mt-3 max-w-[42rem] space-y-3 text-bone-cream/75">
                <Caption className="block leading-relaxed">
                  <span className="text-bone-cream/75">
                    {t("clipLabel")}:{" "}
                  </span>
                  {activeFile.video.attribution}
                </Caption>
                <Caption className="block leading-relaxed">
                  <span className="text-bone-cream/75">
                    {t("methodologyLabel")}:{" "}
                  </span>
                  {activeFile.methodology}
                </Caption>
                <Caption className="block leading-relaxed text-bone-cream/70">
                  {activeFile.citation}
                </Caption>
                {activeFile.video.notes ? (
                  <Caption italic className="block leading-relaxed text-bone-cream/50">
                    {activeFile.video.notes}
                  </Caption>
                ) : null}
                {/* Keyframe composition table — what term blend
                    drove this clip's brain. */}
                <div className="border-bone-cream/10 mt-4 border-t pt-4">
                  <Caption
                    uppercase
                    className="text-brass mb-3 block tracking-[0.18em]"
                  >
                    {t("keyframeLabel")}
                  </Caption>
                  <ul className="space-y-2">
                    {activeFile.frames.map((kf, i) => (
                      <li key={i}>
                        <Mono
                          variant="label"
                          className="text-bone-cream/60 block"
                        >
                          t={kf.t.toFixed(1)}s ·{" "}
                          {(kf.composition ?? [])
                            .map(
                              ([term, w]) =>
                                `${term} ${(w * 100).toFixed(0)}%`,
                            )
                            .join(" · ")}
                        </Mono>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </>
        ) : (
          <Body italic className="text-bone-cream/75">
            {t("emptyState")}
          </Body>
        )}
      </section>
    </div>
  );
}
