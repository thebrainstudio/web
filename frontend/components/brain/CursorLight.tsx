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
  //
  // Reactivity-pass Fix 9: the same handler also publishes the
  // cursor's screen-space proximity to the brain's centre. Distance
  // in normalized viewport-width units; the 0.3 threshold (from the
  // brief) is where intensity ramps to 1. Side ("left" / "right") is
  // the hemisphere the cursor is closer to — MeshForResolution uses
  // this to lift the smoothed activation of regions whose stylized
  // `position.x` sign matches `side` by up to +15%.
  const setCursorProximity = useBrainStageStore((s) => s.setCursorProximity);
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    const ndc = new THREE.Vector3();
    const onMove = (e: PointerEvent) => {
      // Normalize to clip space (-1..1 on each axis, Y inverted).
      const nx = (e.clientX / size.width) * 2 - 1;
      const ny = -((e.clientY / size.height) * 2 - 1);
      ndc.set(nx, ny, 0.5);
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

      // Fix 9: proximity to brain centre in normalized viewport
      // coords. The brain is centred at screen-space (0, 0); we use
      // the NDC X/Y we already computed for the light target.
      const distNorm = Math.sqrt(nx * nx + ny * ny);
      const intensity = Math.max(0, Math.min(1, 1 - distNorm / 0.3));
      const side = intensity > 0 ? (nx < 0 ? "left" : "right") : null;
      setCursorProximity(side, intensity);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // When the pointer leaves the window entirely, relax cursor
    // proximity to 0 so the brain settles back. Without this the
    // last hover-over-region intensification would linger forever.
    const onLeave = () => setCursorProximity(null, 0);
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [mounted, camera, size, reducedMotion, setCursorProximity]);

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
