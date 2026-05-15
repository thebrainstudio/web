"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import {
  Body,
  Caption,
  Heading,
  Mono,
} from "@/components/typography/Typography";
import { regionById } from "@/lib/regions";
import { easeCinematic, staggerLoose } from "@/lib/animations";
import { stimulusPairs } from "@/lib/stimulusPairs";
import { loadCrossCulturalActivation } from "@/lib/loadActivations";
import { divergenceBandKey } from "@/lib/activationBands";
import BrainMap2D from "./BrainMap2D";

// PR-D: pair-id (kebab-case) -> activation-json prefix used in
// frontend/public/activations/crosscultural/ filenames.
const PAIR_ID_TO_ACTIVATION_PREFIX: Record<string, string> = {
  "loneliness-ngao": "loneliness",
  "mother-mae": "mother",
  "beautiful-suay": "beautiful",
};

/**
 * Stimulus comparison surface. Three pairs cycle through. For each pair:
 *   - English on the left (vivid pattern)
 *   - Thai on the right (visibly weakened, scattered pattern)
 *   - Divergence score in Mono
 *   - Top diverging regions listed underneath
 *   - Click a side to send that side's activations to the persistent brain
 */
export default function StimulusComparison() {
  const tRegions = useTranslations("regions");
  const trReg = (key: string, fb: string) => { try { return tRegions(key); } catch { return fb; } };
  // Integrity-pass: divergence magnitude rendered as a qualitative
  // band instead of a percentage with false-precision implications.
  const tActivation = useTranslations("activation");
  const [pairIndex, setPairIndex] = useState(0);
  const [focused, setFocused] = useState<"english" | "thai">("english");

  const pair = stimulusPairs[pairIndex];
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const setParcelActivations = useBrainStageStore(
    (s) => s.setParcelActivations,
  );

  // PR-D: client-side cache of precomputed Neurosynth parcel maps
  // per (pair-id, language). Fetched lazily on first selection
  // and reused on subsequent selections.
  const [parcelCache, setParcelCache] = useState<
    Record<string, Record<string, number>>
  >({});

  // Push 20-region targets so the editorial divergence-score and
  // BrainMap2D component (which still consume 20-region) keep
  // working unchanged.
  useEffect(() => {
    const target =
      focused === "english" ? pair.englishActivations : pair.thaiActivations;
    setActivations(target as Record<string, number>);
  }, [pair, focused, setActivations]);

  // Push the real Neurosynth parcel map for the persistent brain
  // (cortex-level visualization).
  useEffect(() => {
    const prefix = PAIR_ID_TO_ACTIVATION_PREFIX[pair.id];
    if (!prefix) return;
    const key = `${prefix}_${focused}`;
    if (parcelCache[key]) {
      setParcelActivations(parcelCache[key]);
      return;
    }
    let cancelled = false;
    loadCrossCulturalActivation(prefix, focused).then((file) => {
      if (cancelled || !file) return;
      setParcelCache((prev) => ({ ...prev, [key]: file.parcel_activations }));
      setParcelActivations(file.parcel_activations);
    });
    return () => {
      cancelled = true;
    };
  }, [pair, focused, parcelCache, setParcelActivations]);

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
      {/* Pair selector */}
      <div className="md:col-span-12">
        <Caption uppercase className="text-bone-cream/70">
          Stimulus pair
        </Caption>
        <div className="mt-3 flex flex-wrap gap-2">
          {stimulusPairs.map((p, i) => {
            const sel = i === pairIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPairIndex(i)}
                data-hover
                className={`rounded-sm px-3 py-1.5 transition-colors duration-200 ${
                  sel
                    ? "bg-brass text-navy-deep"
                    : "text-bone-cream/65 hover:text-bone-cream"
                }`}
              >
                <Caption uppercase>{p.id.replace(/-/g, " · ")}</Caption>
              </button>
            );
          })}
        </div>
      </div>

      {/* English side */}
      <motion.section
        layout
        onPointerEnter={() => setFocused("english")}
        onFocus={() => setFocused("english")}
        tabIndex={0}
        data-hover
        className={`md:col-span-6 ${
          focused === "english" ? "" : "opacity-70"
        }`}
      >
        <Caption
          uppercase
          className={focused === "english" ? "text-brass" : "text-bone-cream/70"}
        >
          English · TRIBE training distribution
        </Caption>
        <BrainMap2D
          activations={pair.englishActivations}
          label="English prediction"
          className="mt-4 aspect-square w-full max-w-[360px]"
          vivid
        />
        <Body className="text-bone-cream/80 mt-6 max-w-[34rem]">
          {pair.english}
        </Body>
      </motion.section>

      {/* Thai side */}
      <motion.section
        layout
        onPointerEnter={() => setFocused("thai")}
        onFocus={() => setFocused("thai")}
        tabIndex={0}
        data-hover
        className={`md:col-span-6 ${focused === "thai" ? "" : "opacity-70"}`}
      >
        <Caption
          uppercase
          className={focused === "thai" ? "text-brass" : "text-bone-cream/70"}
        >
          Thai · outside training distribution
        </Caption>
        <BrainMap2D
          activations={pair.thaiActivations}
          label="Thai prediction"
          className="mt-4 aspect-square w-full max-w-[360px]"
          vivid={false}
        />
        <Body className="font-thai text-bone-cream/80 mt-6 max-w-[34rem]">
          {pair.thai}
        </Body>
      </motion.section>

      {/* Divergence */}
      <div className="md:col-span-12">
        <div className="border-bone-cream/10 mt-6 grid grid-cols-1 gap-6 border-t pt-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Caption uppercase className="text-brass">
              Divergence
            </Caption>
            <div className="mt-4 flex items-baseline gap-3">
              <Mono variant="value" className="text-brass leading-none">
                {Math.round(pair.divergence * 100)}
              </Mono>
              <Caption uppercase className="text-bone-cream/45">
                / 100
              </Caption>
            </div>
            <Body italic className="text-bone-cream/70 mt-4 max-w-[28rem]">
              {pair.thaiGloss}
            </Body>
          </div>
          <div className="md:col-span-8">
            <Caption uppercase className="text-bone-cream/70">
              Top diverging regions
            </Caption>
            <ul className="mt-4 space-y-2">
              {pair.divergingRegions.map((d, i) => {
                const r = regionById[d.id];
                return (
                  <motion.li
                    key={d.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: easeCinematic,
                      delay: i * staggerLoose * 0.5,
                    }}
                    className="flex items-baseline justify-between gap-4 border-b border-bone-cream/5 pb-2"
                  >
                    <span>
                      <Caption className="text-bone-cream/80">
                        {trReg(`${d.id}.displayName`, r.displayName)}
                      </Caption>{" "}
                      <Caption className="text-bone-cream/65">
                        · {trReg(`${d.id}.anatomyName`, r.anatomyName)}
                      </Caption>
                    </span>
                    <Mono variant="label" className="text-brass">
                      Δ {tActivation(divergenceBandKey(d.delta))}
                    </Mono>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
