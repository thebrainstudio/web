"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBrainStageStore, type BrainLightingPreset } from "@/store/useBrainStageStore";

type LightSpec = {
  intensity: number;
  color: string;
  position: readonly [number, number, number];
};

type Preset = {
  ambient: { intensity: number; color: string };
  key: LightSpec;
  fill: LightSpec;
  rim: LightSpec;
};

const presets: Record<BrainLightingPreset, Preset> = {
  cinematic: {
    ambient: { intensity: 0.28, color: "#1a2444" },
    key: { intensity: 1.05, color: "#5cc8d6", position: [3, 4, 5] },
    fill: { intensity: 0.55, color: "#c9a961", position: [-4, -2, -3] },
    rim: { intensity: 0.7, color: "#c9a961", position: [0, 2, -6] },
  },
  warm: {
    ambient: { intensity: 0.4, color: "#26304c" },
    key: { intensity: 0.9, color: "#e8a04a", position: [2, 3, 4] },
    fill: { intensity: 0.7, color: "#c9a961", position: [-3, -1, 2] },
    rim: { intensity: 0.45, color: "#5cc8d6", position: [0, 1.5, -5] },
  },
  clinical: {
    ambient: { intensity: 0.55, color: "#2e3a5a" },
    key: { intensity: 1.0, color: "#f0e8d8", position: [2, 4, 3] },
    fill: { intensity: 0.85, color: "#bfd7e0", position: [-2, 2, 3] },
    rim: { intensity: 0.45, color: "#bfd7e0", position: [0, -2, -3] },
  },
};

/**
 * Three-point lighting with crossfade between presets.
 * Reads `lighting` from the store and lerps over ~600ms.
 */
export default function BrainLighting() {
  const target = useBrainStageStore((s) => s.lighting);

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);

  // Always start at the cinematic preset; useFrame will lerp from there.
  useEffect(() => {
    const p = presets.cinematic;
    if (ambientRef.current) {
      ambientRef.current.color.set(p.ambient.color);
      ambientRef.current.intensity = p.ambient.intensity;
    }
    if (keyRef.current) {
      keyRef.current.color.set(p.key.color);
      keyRef.current.intensity = p.key.intensity;
      keyRef.current.position.set(...p.key.position);
    }
    if (fillRef.current) {
      fillRef.current.color.set(p.fill.color);
      fillRef.current.intensity = p.fill.intensity;
      fillRef.current.position.set(...p.fill.position);
    }
    if (rimRef.current) {
      rimRef.current.color.set(p.rim.color);
      rimRef.current.intensity = p.rim.intensity;
      rimRef.current.position.set(...p.rim.position);
    }
  }, []);

  useFrame((_, delta) => {
    const dst = presets[target];
    const t = Math.min(1, delta * 2.5); // ~600ms full crossfade

    const a = ambientRef.current;
    if (a) {
      a.intensity = THREE.MathUtils.lerp(a.intensity, dst.ambient.intensity, t);
      a.color.lerp(new THREE.Color(dst.ambient.color), t);
    }
    const k = keyRef.current;
    if (k) {
      k.intensity = THREE.MathUtils.lerp(k.intensity, dst.key.intensity, t);
      k.color.lerp(new THREE.Color(dst.key.color), t);
      k.position.lerp(
        new THREE.Vector3(dst.key.position[0], dst.key.position[1], dst.key.position[2]),
        t,
      );
    }
    const f = fillRef.current;
    if (f) {
      f.intensity = THREE.MathUtils.lerp(f.intensity, dst.fill.intensity, t);
      f.color.lerp(new THREE.Color(dst.fill.color), t);
      f.position.lerp(
        new THREE.Vector3(dst.fill.position[0], dst.fill.position[1], dst.fill.position[2]),
        t,
      );
    }
    const r = rimRef.current;
    if (r) {
      r.intensity = THREE.MathUtils.lerp(r.intensity, dst.rim.intensity, t);
      r.color.lerp(new THREE.Color(dst.rim.color), t);
      r.position.lerp(
        new THREE.Vector3(dst.rim.position[0], dst.rim.position[1], dst.rim.position[2]),
        t,
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} />
      <directionalLight ref={keyRef} />
      <directionalLight ref={fillRef} />
      <directionalLight ref={rimRef} />
    </>
  );
}
