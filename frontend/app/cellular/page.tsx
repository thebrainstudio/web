"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import * as THREE from "three";
import AtmosphericGlow from "@/components/atmospheric/AtmosphericGlow";
import NeuronGeometry from "@/components/cellular/NeuronGeometry";
import Synapse, {
  NEUROTRANSMITTERS,
  type Neurotransmitter,
} from "@/components/cellular/Synapse";
import {
  Body,
  Caption,
  Display,
  Hand,
  Heading,
  Mono,
} from "@/components/typography/Typography";

type ManifestEntry = {
  nmo_id: number;
  name: string;
  region_key: string;
  role: string;
  surprising: string;
  neuromorpho_region?: string[] | string;
  cell_type?: string[] | string;
  species?: string;
  archive?: string;
  reference_pmid?: string[];
  source_url?: string;
  neuromorpho_page?: string;
  filename?: string;
  bytes?: number;
};

const NT_ORDER: Neurotransmitter[] = [
  "glutamate",
  "gaba",
  "dopamine",
  "serotonin",
  "norepinephrine",
  "acetylcholine",
];

const NT_STEPS: Record<Neurotransmitter, string[]> = {
  glutamate: [
    "Action potential arriving at the presynaptic bouton…",
    "Calcium influx triggering vesicle fusion…",
    "Glutamate crossing the synaptic cleft…",
    "Binding to AMPA and NMDA receptors…",
    "Excitatory postsynaptic potential generated.",
  ],
  gaba: [
    "Action potential arriving at the inhibitory terminal…",
    "Calcium-triggered fusion of GABA vesicles…",
    "GABA crossing the cleft…",
    "Binding to GABA-A receptors, opening chloride channels…",
    "Inhibitory postsynaptic potential — the cell is now harder to fire.",
  ],
  dopamine: [
    "Burst from a midbrain dopamine neuron…",
    "Volume release into the extracellular space…",
    "Dopamine diffusing slowly, reaching many synapses at once…",
    "Modulating D1 / D2 receptors over hundreds of milliseconds…",
    "A signal less like a switch, more like a tide.",
  ],
  serotonin: [
    "Slow release from a raphe terminal…",
    "Steady efflux rather than a burst…",
    "Diverse receptor families respond — 5-HT1A, 5-HT2A, more…",
    "Modulating mood, sleep, sensory gating…",
    "The same molecule says different things in different rooms.",
  ],
  norepinephrine: [
    "Arousal signal from locus coeruleus…",
    "Sparse but salient release across cortex…",
    "Binding to α / β adrenergic receptors…",
    "Sharpening signal-to-noise on the receiving cell…",
    "Attention as a chemical, briefly.",
  ],
  acetylcholine: [
    "Cholinergic terminal activates…",
    "Acetylcholine release…",
    "Binding nicotinic and muscarinic receptors…",
    "Gating attention and plasticity…",
    "The transmitter that helps the brain decide what to keep.",
  ],
};

export default function CellularPage() {
  const [manifest, setManifest] = useState<ManifestEntry[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [nt, setNt] = useState<Neurotransmitter>("glutamate");
  const [triggerCount, setTriggerCount] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    fetch("/cellular/manifest.json")
      .then((r) => r.json())
      .then((j) => setManifest(j.neurons ?? []))
      .catch(() => setManifest([]));
  }, []);

  const selected = manifest[selectedIdx];

  // Play-by-play stepper while the synapse animation runs.
  useEffect(() => {
    if (triggerCount === 0) {
      setStepIdx(0);
      return;
    }
    setStepIdx(0);
    const steps = NT_STEPS[nt];
    const intervals: number[] = [];
    for (let i = 1; i < steps.length; i++) {
      intervals.push(
        window.setTimeout(() => setStepIdx(i), (i * 700) / speed),
      );
    }
    return () => intervals.forEach((id) => window.clearTimeout(id));
  }, [triggerCount, nt, speed]);

  return (
    <>
      {/* Section 1 — entry. Atmospheric glow #7: oxblood-ember. */}
      <section className="relative flex min-h-[80vh] items-center px-6 pt-36 md:px-10 md:pt-44">
        <AtmosphericGlow
          preset="oxblood-ember"
          position="center"
          intensity="medium"
        />
        <div className="mx-auto max-w-[44rem]">
          <Caption uppercase className="text-brass">
            Cellular View
          </Caption>
          <Display italic className="mt-8">
            Where activation becomes biology.
          </Display>
          <Body className="text-bone-cream/70 mt-10 max-w-[36rem]">
            We are about to descend. The brain you see on every other page
            is the cortical surface — TRIBE&apos;s prediction is on that
            scale. The neurons below are something else: real
            reconstructions from <a href="https://neuromorpho.org" target="_blank" rel="noopener noreferrer" className="underline decoration-brass/40 underline-offset-4 hover:text-bone-cream">NeuroMorpho.org</a>, contributed
            by labs around the world. Same brain. Different scales. Different
            ways of seeing.
          </Body>
          <Body italic className="text-bone-cream/55 mt-8 max-w-[34rem]">
            A real continuous zoom from cortex to synapse would cross ten
            million-fold magnification. We don&apos;t pretend to show that.
            We show different scales as different ways of looking.
          </Body>
        </div>
      </section>

      {/* Section 2 — single neuron focus. */}
      <section className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <div className="aspect-square w-full overflow-hidden rounded-sm bg-navy-deep/40">
              <Canvas
                camera={{ position: [0, 0, 3.2], fov: 35 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.45} color={"#1a2444"} />
                  <directionalLight position={[3, 4, 5]} intensity={1.0} color={"#5cc8d6"} />
                  <directionalLight position={[-3, -2, -2]} intensity={0.5} color={"#c9a961"} />
                  {selected && (
                    <NeuronGeometry
                      key={selected.filename}
                      src={`/cellular/swc/${selected.filename}`}
                      fitTo={2.2}
                    />
                  )}
                  <EffectComposer enableNormalPass={false}>
                    <Bloom
                      intensity={0.7}
                      luminanceThreshold={0.3}
                      luminanceSmoothing={0.18}
                      mipmapBlur
                    />
                  </EffectComposer>
                </Suspense>
              </Canvas>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {manifest.map((m, i) => (
                <button
                  key={m.nmo_id}
                  type="button"
                  onClick={() => setSelectedIdx(i)}
                  data-hover
                  className={`rounded-sm border px-3 py-1.5 transition-colors duration-200 ${
                    i === selectedIdx
                      ? "border-brass bg-brass text-navy-deep"
                      : "border-bone-cream/15 text-bone-cream/70 hover:border-bone-cream/40 hover:text-bone-cream"
                  }`}
                >
                  <Mono variant="label">NMO_{String(m.nmo_id).padStart(5, "0")}</Mono>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-5">
            <Caption uppercase className="text-brass">
              One of these
            </Caption>
            <Heading className="mt-6 font-[200]">
              {selected?.cell_type
                ? Array.isArray(selected.cell_type)
                  ? selected.cell_type.join(" · ")
                  : selected.cell_type
                : "Neuron"}
            </Heading>
            {selected && (
              <>
                <Caption className="text-bone-cream/55 mt-2 block">
                  {selected.species} · {selected.archive} lab ·{" "}
                  {Array.isArray(selected.neuromorpho_region)
                    ? selected.neuromorpho_region.join(", ")
                    : selected.neuromorpho_region}
                </Caption>
                <Body className="text-bone-cream/80 mt-6">{selected.role}</Body>
                <Body italic className="text-bone-cream/60 mt-4">
                  {selected.surprising}
                </Body>
                <div className="mt-8 flex flex-wrap gap-4 text-bone-cream/60">
                  {selected.reference_pmid?.length ? (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${selected.reference_pmid[0]}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brass"
                    >
                      <Mono variant="label">PMID {selected.reference_pmid[0]}</Mono>
                    </a>
                  ) : null}
                  {selected.neuromorpho_page && (
                    <a
                      href={selected.neuromorpho_page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brass"
                    >
                      <Mono variant="label">NeuroMorpho ↗</Mono>
                    </a>
                  )}
                </div>
              </>
            )}
            <Body italic className="text-bone-cream/45 mt-10">
              Color key: <span className="text-brass">brass</span> apical
              dendrite (the iconic trunk), <span className="text-bone-cream">
                bone
              </span>{" "}
              basal dendrites, <span className="text-cyan-glow">cyan</span>{" "}
              axon, <span style={{ color: "#fde047" }}>yellow</span> soma.
            </Body>
          </div>
        </div>
      </section>

      {/* Transition line */}
      <section className="relative px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[36rem] text-center">
          <Display italic>And one of its ten thousand connections.</Display>
        </div>
      </section>

      {/* Section 3 — synapse focus. */}
      <section className="relative px-6 py-12 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <div className="aspect-square w-full overflow-hidden rounded-sm bg-navy-deep/40">
              <Canvas
                camera={{ position: [0, 0, 3.2], fov: 38 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.45} color={"#1a2444"} />
                  <directionalLight position={[3, 4, 5]} intensity={1.2} color={"#5cc8d6"} />
                  <directionalLight position={[-4, -2, -2]} intensity={0.5} color={"#c9a961"} />
                  <Synapse nt={nt} triggerCount={triggerCount} speed={speed} />
                  <EffectComposer enableNormalPass={false}>
                    <Bloom
                      intensity={0.9}
                      luminanceThreshold={0.32}
                      luminanceSmoothing={0.2}
                      mipmapBlur
                    />
                  </EffectComposer>
                </Suspense>
              </Canvas>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {NT_ORDER.map((id) => {
                const p = NEUROTRANSMITTERS[id];
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setNt(id)}
                    data-hover
                    className={`group inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 transition-colors duration-200 ${
                      nt === id
                        ? "border-brass text-brass"
                        : "border-bone-cream/15 text-bone-cream/70 hover:text-bone-cream"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <Caption uppercase>{p.label}</Caption>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => setTriggerCount((n) => n + 1)}
                data-hover
                className="border-brass text-brass hover:bg-brass hover:text-navy-deep inline-flex items-center justify-center rounded-sm border px-5 py-2.5 transition-colors duration-300"
              >
                <Caption uppercase>Trigger action potential</Caption>
              </button>
              <div className="flex items-center gap-3 text-bone-cream/60">
                <Caption uppercase className="text-bone-cream/40">
                  Speed
                </Caption>
                {[0.25, 0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`rounded-sm px-2 py-1 transition-colors duration-200 ${
                      speed === s
                        ? "bg-brass text-navy-deep"
                        : "text-bone-cream/55 hover:text-bone-cream"
                    }`}
                  >
                    <Mono variant="label">{s}×</Mono>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <Caption uppercase className="text-brass">
              {NEUROTRANSMITTERS[nt].label}
            </Caption>
            <Heading className="mt-6 font-[200]">
              {NEUROTRANSMITTERS[nt].effect}
            </Heading>
            <div className="mt-10 space-y-3">
              {NT_STEPS[nt].map((line, i) => (
                <Body
                  key={i}
                  italic
                  className={`max-w-[34rem] transition-colors duration-300 ${
                    triggerCount === 0
                      ? "text-bone-cream/35"
                      : i <= stepIdx
                        ? "text-bone-cream/85"
                        : "text-bone-cream/35"
                  }`}
                >
                  {line}
                </Body>
              ))}
            </div>
            <p className="mt-10">
              <Hand className="text-cyan-glow">
                same mechanics, different transmitters, very different
                downstream effects
              </Hand>
            </p>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-bone-cream/10 px-6 py-12 text-center md:px-10">
        <Caption uppercase className="text-bone-cream/40">
          Cellular View · neurons from NeuroMorpho.org · synapse animation illustrative
        </Caption>
      </footer>
    </>
  );
}
