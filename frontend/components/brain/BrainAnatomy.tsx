"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";
import {
  useBrainStageStore,
  type MeshResolution,
} from "@/store/useBrainStageStore";
import type { RegionId } from "@/lib/regions";
import Tracts from "./Tracts";

/**
 * Anatomical fsaverage mesh as the primary brain visualization.
 *
 *   fsaverage5 (~20k verts)  →  interactive rooms: Mirror, Music, Cross-Cultural.
 *                              Vertex-aligned with TRIBE's 20484-vertex prediction
 *                              (per backend/tribe/region_mapping.py).
 *
 *   fsaverage6 (~82k verts)  →  hero cinematic moments: Home, About.
 *                              The higher polygon density picks up shadow
 *                              detail in gyri/sulci that fsaverage5 misses.
 *                              Predictions stay at fsaverage5 resolution and
 *                              are upsampled by interpolation, not
 *                              re-prediction (honest about its own limits).
 *
 * Both meshes share the same lighting model and a vertex-color buffer driven
 * by region activations from the store. The shader does not change between
 * resolutions; only the geometry swaps.
 */

/*
 * fMRI / EEG-style activation ramp. Vivid by design — the user reading the
 * site at a glance should immediately see *where* the brain is reacting.
 *
 *   idle  → a warm cool-gray so the brain surface is always legible
 *           (no more black-blob at rest).
 *   low   → deep blue   (BOLD signal just above baseline)
 *   mid-1 → cyan/aqua   (rising activation)
 *   mid-2 → yellow      (fMRI peak band)
 *   high  → orange-red  (hot)
 *
 * Brain stays visible at rest because IDLE is a real color, not navy black.
 * Active regions read instantly because the ramp crosses three hue stops.
 */
const IDLE = new THREE.Color("#3d4a66");
const COLD = new THREE.Color("#1e6cff");
const COOL = new THREE.Color("#22d3ee");
const WARM = new THREE.Color("#fde047");
const HOT = new THREE.Color("#ff4f1f");

function activationColor(a: number, out: THREE.Color) {
  if (a <= 0.02) return out.copy(IDLE);
  if (a < 0.33) {
    const k = a / 0.33;
    return out.copy(IDLE).lerp(COLD, k);
  }
  if (a < 0.62) {
    const k = (a - 0.33) / 0.29;
    return out.copy(COLD).lerp(COOL, k).lerp(WARM, Math.max(0, k - 0.5) * 2);
  }
  if (a < 0.84) {
    const k = (a - 0.62) / 0.22;
    return out.copy(WARM).lerp(HOT, k * 0.6);
  }
  const k = (a - 0.84) / 0.16;
  return out.copy(WARM).lerp(HOT, 0.6 + k * 0.4);
}

const MESH_URL: Record<MeshResolution, string> = {
  fsaverage5: "/meshes/fsaverage5_pial.glb",
  fsaverage6: "/meshes/fsaverage6_pial_web.glb",
};

/**
 * vertex_to_region.json is fsaverage5-keyed. For fsaverage6 we fall back to
 * the closest fsaverage5 vertex via `vertex_correspondence_fsavg5_to_fsavg6.json`
 * (5.5 MB; gzips to ~500 KB on Vercel's edge). Both files are fetched once
 * and cached on the module.
 */
let _vertexToRegion: Record<string, RegionId> | null = null;
let _vertexToRegionPromise: Promise<Record<string, RegionId>> | null = null;

function loadVertexToRegion(): Promise<Record<string, RegionId>> {
  if (_vertexToRegion) return Promise.resolve(_vertexToRegion);
  if (_vertexToRegionPromise) return _vertexToRegionPromise;
  _vertexToRegionPromise = fetch("/vertex_to_region.json")
    .then((r) => r.json() as Promise<Record<string, RegionId>>)
    .then((j) => {
      _vertexToRegion = j;
      return j;
    });
  return _vertexToRegionPromise;
}

type Correspondence = {
  direct: Record<string, number>;
  interpolated: Record<
    string,
    { neighbors: [number, number, number]; weights: [number, number, number] }
  >;
};

let _correspondence: Correspondence | null = null;
let _correspondencePromise: Promise<Correspondence> | null = null;

function loadCorrespondence(): Promise<Correspondence> {
  if (_correspondence) return Promise.resolve(_correspondence);
  if (_correspondencePromise) return _correspondencePromise;
  _correspondencePromise = fetch("/vertex_correspondence_fsavg5_to_fsavg6.json")
    .then((r) => r.json() as Promise<Correspondence>)
    .then((j) => {
      _correspondence = j;
      return j;
    });
  return _correspondencePromise;
}

type VertexRegionAssignment = (RegionId | null)[];

async function buildVertexAssignments(
  resolution: MeshResolution,
  nVerts: number,
): Promise<VertexRegionAssignment> {
  const vtr = await loadVertexToRegion();
  if (resolution === "fsaverage5") {
    const out: VertexRegionAssignment = new Array(nVerts).fill(null);
    for (const [k, v] of Object.entries(vtr)) {
      const i = parseInt(k, 10);
      if (i < nVerts) out[i] = v;
    }
    return out;
  }
  // fsaverage6: for each vertex, find its (direct or interpolated) fsaverage5
  // nearest neighbor's region. We don't blend region IDs — the dominant
  // neighbor wins, which is fine because regions are discrete.
  const corr = await loadCorrespondence();
  const out: VertexRegionAssignment = new Array(nVerts).fill(null);
  for (const [k, v] of Object.entries(corr.direct)) {
    const i = parseInt(k, 10);
    if (i >= nVerts) continue;
    out[i] = vtr[String(v)] ?? null;
  }
  for (const [k, entry] of Object.entries(corr.interpolated)) {
    const i = parseInt(k, 10);
    if (i >= nVerts) continue;
    // Take the first neighbor as the region assignment.
    out[i] = vtr[String(entry.neighbors[0])] ?? null;
  }
  return out;
}

function findFirstMesh(scene: THREE.Object3D): THREE.Mesh | null {
  let found: THREE.Mesh | null = null;
  scene.traverse((child) => {
    if (!found && (child as THREE.Mesh).isMesh) {
      found = child as THREE.Mesh;
    }
  });
  return found;
}

function MeshForResolution({ resolution }: { resolution: MeshResolution }) {
  const url = MESH_URL[resolution];
  const gltf = useLoader(GLTFLoader, url) as unknown as { scene: THREE.Object3D };
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const opacity = useRef(0.001); // fades in on mount
  const [assignments, setAssignments] = useState<VertexRegionAssignment | null>(
    null,
  );

  const source = useMemo(() => findFirstMesh(gltf.scene), [gltf]);

  // Build a cloned geometry with a per-vertex color attribute we own.
  const geometry = useMemo(() => {
    if (!source) return null;
    const g = (source.geometry as THREE.BufferGeometry).clone();
    const n = g.attributes.position.count;
    const colors = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      colors[i * 3 + 0] = IDLE.r;
      colors[i * 3 + 1] = IDLE.g;
      colors[i * 3 + 2] = IDLE.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [source]);

  // Lazy-load the vertex→region assignment for this resolution.
  useEffect(() => {
    if (!geometry) return;
    let cancelled = false;
    const n = geometry.attributes.position.count;
    buildVertexAssignments(resolution, n).then((a) => {
      if (!cancelled) setAssignments(a);
    });
    return () => {
      cancelled = true;
    };
  }, [resolution, geometry]);

  // Smoothed per-region activation values.
  const smoothed = useRef<Map<RegionId, number>>(new Map());
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const targetActivations = useBrainStageStore((s) => s.targetActivations);

  const elapsed = useRef(0);

  // 20 regions in a stable order so the ambient phase per-region is consistent
  // across frames. (Object.keys order on Records is insertion order.)
  const allRegionList = useMemo<RegionId[]>(
    () => [
      "ifg_left","ifg_right","pstg_left","pstg_right","mtg_left","mtg_right",
      "atl_left","atl_right","agl_left","agl_right","hg_left","hg_right",
      "vmpfc","dmpfc","pcc","precuneus","amyg_left","amyg_right",
      "hipp_left","hipp_right",
    ],
    [],
  );

  useFrame((_, delta) => {
    if (!geometry || !meshRef.current) return;
    elapsed.current += delta;

    const reads: Record<string, number> = targetActivations as Record<string, number>;
    const hasExplicit = Object.values(reads).some((v) => (v ?? 0) > 0.02);

    const lerp = Math.min(1, delta * 3.5);
    // Always touch every known region so ambient floors update.
    for (let i = 0; i < allRegionList.length; i++) {
      const r = allRegionList[i];
      // Ambient "EEG drift": a slow per-region phase wave. Keeps the brain
      // feeling alive when no specific pattern is loaded. Switches off the
      // moment a real activation comes in so it doesn't dilute the signal.
      const phase = elapsed.current * 0.55 + i * 0.42;
      const ambient = hasExplicit
        ? 0
        : 0.05 + Math.max(0, Math.sin(phase)) * 0.13;
      const explicit = reads[r] ?? 0;
      const tgt = Math.max(explicit, ambient);
      const cur = smoothed.current.get(r) ?? 0;
      smoothed.current.set(r, cur + (tgt - cur) * lerp);
    }

    if (assignments) {
      const colors = geometry.attributes.color as THREE.BufferAttribute;
      const arr = colors.array as Float32Array;
      let dirty = false;
      for (let i = 0; i < assignments.length; i++) {
        const r = assignments[i];
        if (!r) continue;
        const a = smoothed.current.get(r) ?? 0;
        activationColor(a, tmpColor);
        const o = i * 3;
        if (Math.abs(arr[o] - tmpColor.r) > 0.002) {
          arr[o] = tmpColor.r;
          arr[o + 1] = tmpColor.g;
          arr[o + 2] = tmpColor.b;
          dirty = true;
        }
      }
      if (dirty) colors.needsUpdate = true;
    }

    if (opacity.current < 1.0) {
      opacity.current = Math.min(1.0, opacity.current + delta * 1.6);
      const m = matRef.current;
      if (m) {
        m.opacity = opacity.current;
        m.transparent = opacity.current < 1;
      }
    }
  });

  if (!geometry) return null;
  return (
    <mesh ref={meshRef} geometry={geometry} castShadow={false} receiveShadow={false}>
      <meshStandardMaterial
        ref={matRef}
        vertexColors
        roughness={0.42}
        metalness={0.05}
        envMapIntensity={0.5}
        emissive={"#ffffff"}
        emissiveIntensity={0.18}
        transparent
        opacity={0.001}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function BrainAnatomy() {
  const meshRes = useBrainStageStore((s) => s.meshResolution);
  const targetPos = useBrainStageStore((s) => s.targetPosition);
  const targetScale = useBrainStageStore((s) => s.targetScale);
  const targetRot = useBrainStageStore((s) => s.targetRotation);

  const groupRef = useRef<THREE.Group>(null);
  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const tmpEuler = useMemo(() => new THREE.Euler(), []);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    tmpVec.set(targetPos[0], targetPos[1], targetPos[2]);
    g.position.lerp(tmpVec, Math.min(1, delta * 3));
    const ns = THREE.MathUtils.lerp(g.scale.x, targetScale, Math.min(1, delta * 3));
    g.scale.setScalar(ns);
    tmpEuler.set(targetRot[0], targetRot[1], targetRot[2]);
    tmpQuat.setFromEuler(tmpEuler);
    g.quaternion.slerp(tmpQuat, Math.min(1, delta * 2.5));
    g.rotation.y += delta * 0.05;
  });

  return (
    <group ref={groupRef}>
      <MeshForResolution
        // key forces a fresh mount on resolution change → opacity fade replays
        key={meshRes}
        resolution={meshRes}
      />
      {/* White-matter tracts. Mounted as a sibling of the mesh so it
          inherits the brain group's position, scale, rotation, and the
          slow continuous Y rotation. The Tracts component owns its
          own opacity tweening; opacity is 0 until the connectome
          state surfaces a tract id. */}
      <Tracts />
    </group>
  );
}
