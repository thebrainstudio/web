"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A quiet, deep ambient drone generated with the Web Audio API — no asset
 * required for now. Three sine oscillators (root, fifth, slightly detuned
 * octave) modulated by a slow LFO on the master gain. Default MUTED.
 *
 * The mute toggle appears in `<SiteHeader />` via a custom event;
 * `data-ambient-drone-toggle` elements globally trigger play/pause.
 *
 * Replace with an authored audio asset later. `TODO_CONTENT`.
 */

type AudioGraph = {
  ctx: AudioContext;
  master: GainNode;
  oscs: OscillatorNode[];
  lfo: OscillatorNode;
  lfoGain: GainNode;
};

const FREQS = [55, 82.5, 110]; // A1, E2, A2 — sparse, low

function buildGraph(): AudioGraph {
  const ctx = new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext)();
  const master = ctx.createGain();
  master.gain.value = 0; // start silent
  master.connect(ctx.destination);

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.07; // slow swell
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.04;
  lfo.connect(lfoGain).connect(master.gain);
  lfo.start();

  const oscs = FREQS.map((f, i) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.detune.value = i === 1 ? -3 : 0;
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = i === 2 ? 0.08 : 0.14;
    o.connect(g).connect(master);
    o.start();
    return o;
  });

  return { ctx, master, oscs, lfo, lfoGain };
}

export default function AmbientDrone() {
  const graphRef = useRef<AudioGraph | null>(null);
  const [muted, setMuted] = useState(true);

  const togglePlay = useCallback(async () => {
    if (!graphRef.current) {
      graphRef.current = buildGraph();
    }
    const g = graphRef.current;
    if (g.ctx.state === "suspended") {
      await g.ctx.resume();
    }
    const now = g.ctx.currentTime;
    const target = muted ? 0.12 : 0;
    g.master.gain.cancelScheduledValues(now);
    g.master.gain.setValueAtTime(g.master.gain.value, now);
    g.master.gain.linearRampToValueAtTime(target, now + 0.8);
    setMuted((m) => !m);
  }, [muted]);

  useEffect(() => {
    const handler = () => {
      void togglePlay();
    };
    window.addEventListener("brain-studio:toggle-ambient", handler);
    return () =>
      window.removeEventListener("brain-studio:toggle-ambient", handler);
  }, [togglePlay]);

  useEffect(() => {
    // Broadcast state so the SiteHeader's mute icon stays in sync.
    window.dispatchEvent(
      new CustomEvent("brain-studio:ambient-state", { detail: { muted } }),
    );
  }, [muted]);

  // No visible UI — control is in the nav.
  return null;
}
