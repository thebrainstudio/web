"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import {
  Body,
  Caption,
  Mono,
} from "@/components/typography/Typography";
import AttributedImage from "@/components/content/AttributedImage";
import ProvenanceBadge from "@/components/brain/ProvenanceBadge";
import { mandalas, type Mandala } from "@/content/archetypes/mandalas";
import { regionById } from "@/lib/regions";
import { loadMandalaActivation } from "@/lib/loadActivations";

/**
 * "Looking at a mandala" interactive.
 *
 * The user picks one of the seven mandalas. The persistent macro brain
 * (mounted at root layout) receives the literature-informed activation
 * pattern for that mandala — and the side panel surfaces the four
 * regions that show the most lift, with what the contemplative /
 * visual-neuroscience literature suggests they're doing during this
 * kind of viewing.
 *
 * Honest framing throughout: this is a predicted, illustrative pattern.
 * Not a real fMRI scan. Not a TRIBE prediction (TRIBE wasn't trained on
 * "viewing a mandala"). Composed from the published literature on
 * contemplative attention and visual symmetry.
 */
export default function MandalaBrainViewer() {
  const t = useTranslations("mandalas");
  const tRegions = useTranslations("regions");
  const [selectedId, setSelectedId] = useState<string>(mandalas[0].id);
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const setParcelActivations = useBrainStageStore(
    (s) => s.setParcelActivations,
  );
  const resetIdle = useBrainStageStore((s) => s.resetIdle);
  const setTransform = useBrainStageStore((s) => s.setTransform);
  // PR-D: per-mandala cache of precomputed Neurosynth parcel maps.
  const [parcelCache, setParcelCache] = useState<
    Record<string, Record<string, number>>
  >({});

  const selected = mandalas.find((m) => m.id === selectedId)!;
  const tradition = (() => {
    try {
      return t(`items.${selected.id}.tradition`);
    } catch {
      return selected.tradition;
    }
  })();
  const description = (() => {
    try {
      return t(`items.${selected.id}.description`);
    } catch {
      return selected.description;
    }
  })();
  const jungian = (() => {
    try {
      return t(`items.${selected.id}.jungian`);
    } catch {
      return selected.jungian_reading;
    }
  })();

  // Re-center the brain when this component is in view so the persistent
  // canvas is positioned for the side-by-side reading.
  useEffect(() => {
    setTransform({
      position: [0.85, 0.05, 0],
      scale: 0.55,
      rotation: [0, -0.25, 0],
    });
    setActivations(selected.activation as Record<string, number>);
    return () => {
      resetIdle();
    };
  }, [selected, setActivations, resetIdle, setTransform]);

  // PR-D: load the real Neurosynth-derived parcel map for the
  // selected mandala (contemplative-attention composite) and push
  // to the persistent brain. The 20-region `selected.activation`
  // above stays as the editorial layer that drives the side-panel
  // "top regions" listing.
  useEffect(() => {
    if (parcelCache[selected.id]) {
      setParcelActivations(parcelCache[selected.id]);
      return;
    }
    let cancelled = false;
    loadMandalaActivation(selected.id).then((file) => {
      if (cancelled || !file) return;
      setParcelCache((prev) => ({ ...prev, [selected.id]: file.parcel_activations }));
      setParcelActivations(file.parcel_activations);
    });
    return () => {
      cancelled = true;
    };
  }, [selected, parcelCache, setParcelActivations]);

  const topRegions = Object.entries(selected.activation)
    .map(([id, v]) => ({ id, v: v ?? 0 }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 4);

  return (
    <div>
      <Caption uppercase className="text-brass">
        {t("viewerLabel")}
      </Caption>
      <Body italic className="text-bone-cream/60 mt-3 max-w-[36rem]">
        {t("viewerIntro")}
      </Body>
      {/* Integrity-pass: badge identifies the data source driving
          the per-mandala brain shift. Each selection loads a
          contemplative-attention composite from Neurosynth. */}
      <div className="mt-5">
        <ProvenanceBadge state="neurosynth" />
      </div>

      {/* Mandala chooser */}
      <div className="mt-10 flex flex-wrap gap-2">
        {mandalas.map((m) => {
          const active = m.id === selectedId;
          let label = m.tradition;
          try { label = t(`items.${m.id}.tradition`); } catch {}
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedId(m.id)}
              data-hover
              className={`rounded-sm border px-3 py-1.5 transition-colors duration-200 ${
                active
                  ? "border-brass bg-brass text-navy-deep"
                  : "border-bone-cream/15 text-bone-cream/70 hover:border-bone-cream/40 hover:text-bone-cream"
              }`}
            >
              <Caption uppercase>{label}</Caption>
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-6">
          <AttributedImage
            prov={{
              src: selected.src,
              title: selected.title,
              artist: selected.provenance.artist,
              date: selected.provenance.date,
              institution: selected.provenance.institution,
              license: selected.provenance.license,
              source_url: selected.provenance.source_url,
              note: selected.provenance.note,
            }}
            width={1400}
            height={1400}
            priority
          />
        </div>
        <div className="md:col-span-6">
          <Caption uppercase className="text-bone-cream/70">
            {tradition} · {selected.date}
          </Caption>
          <Body className="text-bone-cream/85 mt-6">{description}</Body>
          <Caption uppercase className="text-brass mt-10 block">
            {t("jungianReadingLabel")}
          </Caption>
          <Body italic className="text-bone-cream/75 mt-3">
            {jungian}
          </Body>
        </div>
      </div>

      {/* Predicted regions panel */}
      <div className="border-bone-cream/10 mt-14 border-t pt-10">
        <Caption uppercase className="text-brass">
          {t("regionsLabel")}
        </Caption>
        <Body italic className="text-bone-cream/70 mt-2 max-w-[40rem]">
          {t("regionsIntro")}
        </Body>
        <ul className="mt-8 space-y-4">
          {topRegions.map(({ id, v }) => {
            const r = regionById[id as keyof typeof regionById];
            const tr = (key: string, fb: string) => { try { return tRegions(key); } catch { return fb; } };
            return (
              <li
                key={id}
                className="border-b border-bone-cream/5 grid grid-cols-1 gap-2 pb-4 md:grid-cols-12 md:items-baseline"
              >
                <div className="md:col-span-4">
                  <Caption className="text-bone-cream/85">
                    {r ? tr(`${id}.displayName`, r.displayName) : id}
                  </Caption>
                  <Caption className="text-bone-cream/45 mt-1 block">
                    {r ? tr(`${id}.anatomyName`, r.anatomyName) : ""}
                  </Caption>
                </div>
                <div className="md:col-span-6">
                  <Body italic className="text-bone-cream/70">
                    {r ? tr(`${id}.scienceGloss`, r.scienceGloss) : ""}
                  </Body>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <Mono variant="label" className="text-brass">
                    {Math.round(v * 100)}%
                  </Mono>
                </div>
              </li>
            );
          })}
        </ul>
        <Body italic className="text-bone-cream/45 mt-8">
          {t("whyComposition")}
        </Body>
      </div>
    </div>
  );
}
