"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { regions, type RegionId } from "@/lib/regions";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import {
  getCachedRegionCentroids,
  getRegionCentroids,
} from "@/lib/brain/regionCentroids";

/**
 * Brass halos for the top-N most-active regions.
 *
 * Each halo is a billboarded sprite — a soft brass-toned disc that
 * faces the camera regardless of the brain group's rotation. The
 * sprites are children of the same group transform as the anatomical
 * mesh, so they orbit, scale, and translate with the brain.
 *
 * The component:
 *   - Smooths each region's activation with a per-region time-based
 *     curve (independent of frame rate).
 *   - Picks the top N regions every frame.
 *   - Fades opacity in over ~600 ms when a region enters the top set,
 *     out over ~400 ms when it leaves.
 *
 * Why brass: it's the site's accent colour — the same warm metallic
 * the brand surface uses for captions and focus rings. The halos
 * become a deliberate "the model picked this" signal without
 * shouting; they read at a glance but don't compete with the
 * activation-coloured mesh underneath.
 */

const HALO_COUNT = 3;
// `--color-cyan-glow` from globals.css — the site's brand-adjacent
// cool counterpoint to brass. Brass clashed against the brain's
// warm activation ramp (yellow → orange → red); a luminous cyan
// reads cleanly on hot regions without competing with the colour
// information underneath.
const HALO_COLOR = new THREE.Color("#5cc8d6");
// Sprite size in mesh-local units. Centroids live in the actual
// fsaverage5 mesh's local space (roughly ±1 from origin after GLB
// normalization). 0.22 reads as a soft halo on the cortical surface
// without occluding the underlying activation colour.
const HALO_SIZE = 0.22;
// Activation threshold below which a region never gets a halo, even
// if it's nominally in the top N. Keeps the halos honest about what
// "active" means.
const HALO_THRESHOLD = 0.45;

type HaloState = {
  regionId: RegionId | null;
  // 0..1 opacity (own animation, separate from activation strength).
  opacity: number;
  // last known activation value, smoothed for halo intensity.
  activation: number;
};

function makeHaloTexture(): THREE.Texture {
  // Soft radial gradient: pale-cyan core fading to transparent.
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  // Thin bright cool-white core, a wider cyan-glow body, and a soft
  // fall-off to transparent. Hand-tuned to pop against warm activation
  // colours without overpowering them.
  grad.addColorStop(0.0, "rgba(220, 250, 255, 0.95)");
  grad.addColorStop(0.18, "rgba(92, 200, 214, 0.7)");
  grad.addColorStop(0.45, "rgba(92, 200, 214, 0.2)");
  grad.addColorStop(1.0, "rgba(92, 200, 214, 0.0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export default function BrassHalos({
  threshold = HALO_THRESHOLD,
  count = HALO_COUNT,
}: { threshold?: number; count?: number } = {}) {
  const targetActivations = useBrainStageStore((s) => s.targetActivations);

  // Region centroids in mesh-local space (computed from the actual
  // fsaverage5 GLB). Loaded once and cached at module level; null
  // until the mesh arrives. Without these the halos would float at
  // stylized atlas-nav coordinates that don't match the rendered mesh.
  const [centroids, setCentroids] = useState<Map<RegionId, THREE.Vector3> | null>(
    () => getCachedRegionCentroids(),
  );
  useEffect(() => {
    if (centroids) return;
    let cancelled = false;
    getRegionCentroids()
      .then((map) => {
        if (!cancelled) setCentroids(map);
      })
      .catch((err) => {
        console.warn("[BrassHalos] failed to compute centroids", err);
      });
    return () => {
      cancelled = true;
    };
  }, [centroids]);

  const texture = useMemo(makeHaloTexture, []);
  const material = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: texture,
        color: HALO_COLOR,
        transparent: true,
        opacity: 0,
        // Additive blending so halos brighten the area underneath them
        // instead of occluding the brain colour.
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      }),
    [texture],
  );

  // Per-region smoothed activation. Independent of the brain mesh's
  // own smoothing so the halos animate at their own deliberate pace.
  const smoothed = useRef<Map<RegionId, number>>(new Map());
  // Per-slot halo state. We have `count` slots, each of which may bind
  // to a different region over time.
  const slots = useRef<HaloState[]>(
    Array.from({ length: count }, () => ({
      regionId: null,
      opacity: 0,
      activation: 0,
    })),
  );

  // Ref array for the actual sprite objects (so we can update their
  // material per-instance — each gets its own MaterialClone).
  const spriteRefs = useRef<(THREE.Sprite | null)[]>(
    new Array(count).fill(null),
  );
  // Per-slot material instances so opacities can drift independently.
  const materials = useMemo(
    () => Array.from({ length: count }, () => material.clone()),
    [material, count],
  );

  useFrame((_, delta) => {
    const dt = Math.min(0.1, delta); // clamp huge frame deltas

    // 1) Smooth each region's activation with a time-based lerp.
    //    Smoothing window ~250 ms — fast enough to track input changes,
    //    slow enough to suppress jitter.
    const reads = targetActivations as Record<string, number>;
    const lerpK = 1 - Math.exp(-dt / 0.25);
    for (const r of regions) {
      const tgt = reads[r.id] ?? 0;
      const cur = smoothed.current.get(r.id) ?? 0;
      smoothed.current.set(r.id, cur + (tgt - cur) * lerpK);
    }

    // 2) Pick top-N by smoothed activation, gated by threshold.
    const ranked = regions
      .map((r) => ({ id: r.id, v: smoothed.current.get(r.id) ?? 0 }))
      .filter((e) => e.v >= threshold)
      .sort((a, b) => b.v - a.v)
      .slice(0, count);

    // 3) Re-assign slots, fading old regions out and new ones in.
    //    Sticky assignment: if a region currently in a slot is still
    //    in `ranked`, keep its slot to avoid swapping unnecessarily.
    const stillRanked = new Set(ranked.map((e) => e.id));
    const alreadyAssigned = new Set<RegionId>();
    for (const slot of slots.current) {
      if (slot.regionId && stillRanked.has(slot.regionId)) {
        alreadyAssigned.add(slot.regionId);
      } else {
        slot.regionId = null; // free the slot for reassignment
      }
    }
    // Assign newcomers to free slots.
    for (const cand of ranked) {
      if (alreadyAssigned.has(cand.id)) continue;
      const free = slots.current.find((s) => s.regionId === null);
      if (!free) break;
      free.regionId = cand.id;
    }

    // 4) Update opacity per slot — fade in (600 ms) / fade out (400 ms).
    const fadeInK = 1 - Math.exp(-dt / 0.6);
    const fadeOutK = 1 - Math.exp(-dt / 0.4);
    for (let i = 0; i < slots.current.length; i++) {
      const slot = slots.current[i];
      const m = materials[i];
      if (!slot.regionId) {
        slot.opacity += (0 - slot.opacity) * fadeOutK;
        m.opacity = slot.opacity;
        if (slot.opacity < 0.01) {
          // Park the sprite far away so it doesn't intercept clicks /
          // contribute to bounds. (We're not raycasting, but it
          // future-proofs us.)
          const sp = spriteRefs.current[i];
          if (sp) sp.visible = false;
        }
        continue;
      }
      const tgtA = smoothed.current.get(slot.regionId) ?? 0;
      slot.activation += (tgtA - slot.activation) * fadeInK;
      // Halo brightness fades with activation strength so a barely-above-
      // threshold region's halo is dim and the top region's is bright.
      slot.opacity += (slot.activation - slot.opacity) * fadeInK;
      m.opacity = slot.opacity;
      const sp = spriteRefs.current[i];
      if (sp) {
        // Centroids come from the actual fsaverage5 mesh — anchored
        // where each region's vertices live, NOT the stylized atlas-nav
        // coordinates from `lib/regions.ts`. Until centroids load we
        // keep the halo hidden rather than placing it at (0,0,0) and
        // looking broken.
        const centroid = centroids?.get(slot.regionId) ?? null;
        if (centroid) {
          sp.visible = true;
          sp.position.copy(centroid);
          // Lift the sprite a hair along its centroid's outward normal
          // (away from brain origin) so it sits on the cortical surface
          // rather than inside the mesh. Magnitude is in mesh-local
          // units; tuned to be visible without floating off.
          const radius = centroid.length() || 1;
          const lift = 0.02 * radius; // ~2% outward
          sp.position.addScaledVector(centroid, lift / radius);

          // Subtle pulse — halo breathes 4 % in scale at 0.7 Hz.
          // Anchored to slot index so the three halos pulse out of
          // phase with one another.
          const t = performance.now() / 1000;
          const pulse = 1 + 0.04 * Math.sin(t * 0.7 * 2 * Math.PI + i * 1.5);
          sp.scale.set(HALO_SIZE * pulse, HALO_SIZE * pulse, 1);
        } else {
          sp.visible = false;
        }
      }
    }
  });

  return (
    <group renderOrder={20}>
      {materials.map((m, i) => (
        <sprite
          key={i}
          ref={(s) => {
            spriteRefs.current[i] = s;
          }}
          material={m}
          // Initial position off-screen; the useFrame above moves it
          // to the actual region anchor as soon as a slot is assigned.
          position={[0, 0, 0]}
          scale={[HALO_SIZE, HALO_SIZE, 1]}
          visible={false}
        />
      ))}
    </group>
  );
}
