"use client";

import { useState } from "react";
import { regions, type RegionId } from "@/lib/regions";
import {
  useBrainStageStore,
  type BrainLightingPreset,
} from "@/store/useBrainStageStore";

/**
 * Debug harness. Per-region sliders that write directly into the brain stage
 * store, plus a lighting preset switcher. Not linked from the public nav.
 */
export default function TestBrainPage() {
  const setActivations = useBrainStageStore((s) => s.setActivations);
  const setLighting = useBrainStageStore((s) => s.setLighting);
  const lighting = useBrainStageStore((s) => s.lighting);
  const activations = useBrainStageStore((s) => s.targetActivations);
  const [local, setLocal] = useState<Partial<Record<RegionId, number>>>({});

  const update = (id: RegionId, value: number) => {
    const next = { ...local, [id]: value };
    setLocal(next);
    setActivations(next as Record<string, number>);
  };

  const presets: BrainLightingPreset[] = ["cinematic", "warm", "clinical"];

  return (
    <main className="relative min-h-screen px-6 pb-24 pt-32 md:px-10">
      <header className="mx-auto max-w-[1000px]">
        <p className="text-brass font-display text-xs uppercase tracking-[0.32em]">
          Debug
        </p>
        <h1 className="font-display text-bone-cream mt-4 text-3xl md:text-4xl">
          Brain stage harness.
        </h1>
        <p className="text-bone-cream/65 mt-3 max-w-[42rem] text-sm leading-[1.65]">
          Live-drive the persistent brain. The canvas behind these controls is
          the same one the home page uses.
        </p>
      </header>

      <section className="mx-auto mt-10 max-w-[1000px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-bone-cream/40 text-xs uppercase tracking-[0.28em]">
            Lighting
          </span>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setLighting(p)}
              className={`rounded-sm px-3 py-1.5 text-xs uppercase tracking-[0.22em] transition-colors duration-200 ${
                lighting === p
                  ? "bg-brass text-navy-deep"
                  : "text-bone-cream/70 hover:text-bone-cream"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 gap-3 md:grid-cols-2">
        {regions.map((r) => {
          const value = local[r.id] ?? activations[r.id] ?? 0;
          return (
            <label key={r.id} className="block">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-bone-cream/85 text-sm">{r.displayName}</span>
                <span className="text-bone-cream/40 tabular text-xs">
                  {(value * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={value}
                onChange={(e) => update(r.id, parseFloat(e.target.value))}
                className="mt-1.5 w-full accent-brass"
                aria-label={`${r.anatomyName} activation`}
              />
            </label>
          );
        })}
      </section>
    </main>
  );
}
