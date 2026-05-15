"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * Visual-elevation Fix 7 — cursor light.
 *
 * A small warm pointLight that lazily follows the mouse across the
 * persistent brain canvas. Reads as a faint specular highlight
 * sliding over the cortex when the cursor moves — the light source
 * that makes the wet-tissue read finally legible without raising
 * the brain's ambient temperature.
 *
 * Implementation notes
 *   • The Canvas is full-screen pointer-events:none, so mousemove
 *     is captured at the window level. We map clientX/clientY to
 *     normalized device coords, then unproject into world space at
 *     a plane in front of the brain (z = +1.2 in scene units).
 *   • The light position lerps toward the unprojected target each
 *     frame for smoothness — no jitter, no popping.
 *   • Mobile (matchMedia max-width: 768px) → component renders
 *     null. The R3F tree literally never mounts the light, so no
 *     GPU cost.
 *   • prefers-reduced-motion: still mounts (the highlight isn't a
 *     motion, it's a property of the surface) but skips the lerp
 *     ramp, snapping to the new position instead. No nauseating
 *     glide.
 */
export default function CursorLight() {
  const { camera, size } = useThree();
  const lightRef = useRef<THREE.PointLight>(null);
  const target = useRef(new THREE.Vector3(0, 0, 1.2));
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Mount gate: phones get no cursor light at all.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;
    setMounted(true);
  }, []);

  // Window-level pointermove → world-space target. The Canvas has
  // pointer-events:none so it doesn't capture the event itself.
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    const ndc = new THREE.Vector3();
    const onMove = (e: PointerEvent) => {
      // Normalize to clip space (-1..1 on each axis, Y inverted).
      ndc.x = (e.clientX / size.width) * 2 - 1;
      ndc.y = -((e.clientY / size.height) * 2 - 1);
      ndc.z = 0.5; // pick a plane in front of the brain
      ndc.unproject(camera);
      // Direction from camera through that point, walked to z=+1.2
      // in world space so the light sits in front of the cortex.
      const dir = ndc.sub(camera.position).normalize();
      const distance = (1.2 - camera.position.z) / dir.z;
      const point = camera.position.clone().add(dir.multiplyScalar(distance));
      target.current.copy(point);
      if (reducedMotion && lightRef.current) {
        // Reduced motion: snap, don't glide.
        lightRef.current.position.copy(point);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mounted, camera, size, reducedMotion]);

  useFrame((_, rawDt) => {
    const l = lightRef.current;
    if (!l) return;
    if (reducedMotion) return; // snap handled in pointermove
    // Reactivity-pass Fix 17 + 18: scale the lerp rate by motionScale
    // so the cursor highlight halts under Space-pause and slows under
    // Shift-hold along with everything else in the scene.
    const dt = rawDt * useBrainStageStore.getState().motionScale;
    const k = Math.min(1, dt * 8);
    l.position.lerp(target.current, k);
  });

  if (!mounted) return null;
  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 1.2]}
      color={"#fff4e0"}
      intensity={0.4}
      distance={5}
      decay={1.5}
    />
  );
}
