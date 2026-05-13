"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import BrainConstellation from "./BrainConstellation";
import BrainLighting from "./BrainLighting";

/**
 * The persistent R3F canvas. Mounted once at root layout and never unmounted.
 * Driven by `useBrainStageStore`.
 */
export default function BrainStageClient() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <BrainLighting />
        <BrainConstellation />
      </Suspense>
    </Canvas>
  );
}
