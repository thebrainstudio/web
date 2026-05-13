"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import BrainAnatomy from "./BrainAnatomy";
import BrainLighting from "./BrainLighting";

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
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.42}
            luminanceSmoothing={0.2}
            mipmapBlur
            radius={0.78}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
