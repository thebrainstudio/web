"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import BrainAnatomy from "./BrainAnatomy";
import BrainLighting from "./BrainLighting";
import CursorLight from "./CursorLight";

/**
 * The persistent R3F canvas. Mounted once at root layout and never
 * unmounts. Driven by `useBrainStageStore`.
 *
 * Visualization: the anatomical fsaverage mesh (5 or 6 depending on the
 * store's meshResolution). Bloom postprocessing glows active regions.
 */
export default function BrainStageClient() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.0], fov: 32 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <Suspense fallback={null}>
        <BrainLighting />
        <BrainAnatomy />
        {/* Visual-elevation Fix 7 — a warm point light that
            follows the cursor and gives the cortex a specular
            highlight as the reader moves. Self-gates to null on
            mobile so phones pay no GPU cost. */}
        <CursorLight />
        {/* Visual-elevation Fix 1: bloom retuned per brief —
            higher threshold so the IDLE brain doesn't bloom,
            tighter radius so glow reads as a halo around the
            active regions instead of a global haze. Intensity
            dropped a touch (0.85 → 0.8) since the new emissive
            shader injection contributes more energy than the
            old per-vertex paint path. */}
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.2}
            mipmapBlur
            radius={0.4}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
