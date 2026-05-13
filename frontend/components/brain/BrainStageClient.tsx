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
      // preserveDrawingBuffer enables canvas.toDataURL for the Brain Mirror
      // "save insight" PNG export. Costs ~5% perf; worth it for the feature.
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <Suspense fallback={null}>
        <BrainLighting />
        <BrainConstellation />
      </Suspense>
    </Canvas>
  );
}
