"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
import BrainConstellation from "./BrainConstellation";
import BrainLighting from "./BrainLighting";

/**
 * The persistent R3F canvas. Mounted once at root layout and never
 * unmounts. Driven by `useBrainStageStore`. Camera pulled back to give
 * the brain its room — at fov 30 with z=5.2 the constellation occupies
 * roughly the central third of any viewport rather than dominating.
 *
 * EffectComposer adds a gentle Bloom that lifts active regions without
 * letting idle dim regions wash out. luminanceThreshold > emissive of
 * idle, so the brain is dark in repose and glows where it should.
 */
export default function BrainStageClient() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <Suspense fallback={null}>
        <BrainLighting />
        <BrainConstellation />
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.28}
            luminanceSmoothing={0.18}
            mipmapBlur
            radius={0.7}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
