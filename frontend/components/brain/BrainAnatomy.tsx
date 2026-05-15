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
import BrassHalos from "./BrassHalos";

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

// PR-A: HCP-MMP-360 parcel-id-per-vertex lookups. Two arrays of 10242
// integers (left + right hemisphere); 0 = medial wall, 1..180 = left
// parcels, 181..360 = right parcels. Built offline by
// `backend/scripts/build_parcellation.py` and committed to
// `frontend/public/parcellation/`.
let _parcelsLeft: number[] | null = null;
let _parcelsRight: number[] | null = null;
let _parcelsPromise: Promise<{ left: number[]; right: number[] }> | null = null;

function loadParcels(): Promise<{ left: number[]; right: number[] }> {
  if (_parcelsLeft && _parcelsRight) {
    return Promise.resolve({ left: _parcelsLeft, right: _parcelsRight });
  }
  if (_parcelsPromise) return _parcelsPromise;
  _parcelsPromise = Promise.all([
    fetch("/parcellation/hcp_mmp_left.json").then(
      (r) => r.json() as Promise<number[]>,
    ),
    fetch("/parcellation/hcp_mmp_right.json").then(
      (r) => r.json() as Promise<number[]>,
    ),
  ]).then(([left, right]) => {
    _parcelsLeft = left;
    _parcelsRight = right;
    return { left, right };
  });
  return _parcelsPromise;
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

// PR-A: HCP-MMP-360 parcel-id-per-vertex array. 0 = medial wall (no
// parcel). For fsaverage5 this maps directly to the
// `hcp_mmp_{left,right}.json` arrays the build script wrote. For
// fsaverage6 we follow the same dominant-neighbor strategy the
// region path uses, because parcel IDs are discrete and shouldn't be
// blended.
async function buildVertexParcels(
  resolution: MeshResolution,
  nVerts: number,
): Promise<Int16Array> {
  const { left, right } = await loadParcels();
  if (resolution === "fsaverage5") {
    const out = new Int16Array(nVerts);
    // The fsaverage5 GLB lists left-hem vertices first (10242), then
    // right-hem (10242). Match that ordering.
    const split = Math.min(left.length, nVerts);
    for (let i = 0; i < split; i++) out[i] = left[i];
    for (let i = split; i < nVerts; i++) out[i] = right[i - split] ?? 0;
    return out;
  }
  const corr = await loadCorrespondence();
  const out = new Int16Array(nVerts);
  // Build a fsaverage5-vertex → parcel-id lookup once.
  const fs5Parcels = new Int16Array(left.length + right.length);
  for (let i = 0; i < left.length; i++) fs5Parcels[i] = left[i];
  for (let i = 0; i < right.length; i++)
    fs5Parcels[left.length + i] = right[i];
  for (const [k, v] of Object.entries(corr.direct)) {
    const i = parseInt(k, 10);
    if (i >= nVerts) continue;
    out[i] = fs5Parcels[v] ?? 0;
  }
  for (const [k, entry] of Object.entries(corr.interpolated)) {
    const i = parseInt(k, 10);
    if (i >= nVerts) continue;
    out[i] = fs5Parcels[entry.neighbors[0]] ?? 0;
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

// Visual-elevation Fix 1: detect a small viewport so the GPU-heavier
// material props (transmission) collapse to 0 on phones without
// changing the visual contract for desktop. Computed once at module
// level via `window.matchMedia`; tablet+ devices keep the wet-tissue
// look.
function isPhoneViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

function MeshForResolution({ resolution }: { resolution: MeshResolution }) {
  const url = MESH_URL[resolution];
  const gltf = useLoader(GLTFLoader, url) as unknown as { scene: THREE.Object3D };
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  // Visual-elevation hotfix: the original 0.001 → 1.0 fade-in
  // depended on useFrame catching the matRef before opacity.current
  // had already climbed past 1.0 (which is also where the ramp guard
  // exits). When timing slipped — common with the new
  // meshPhysicalMaterial mount ordering — the ramp was skipped and
  // the material stayed pinned at 0.001 (= invisible). Start fully
  // opaque; the per-region colour lerp already does its own fade,
  // so the entrance still feels gentle.
  const opacity = useRef(1.0);
  // Visual-elevation Fix 1: brief 800 ms cubic-out ramp triggered on
  // every activation change. The existing ~1200 ms colour lerp on
  // smoothed activations stays (per-region settling); this multiplier
  // lives in front of `emissiveIntensity` so a freshly-arriving map
  // brightens then settles, instead of just sliding in.
  const emissiveWake = useRef(0);
  const lastActivationSig = useRef<string>("");
  const isPhone = useRef(false);
  useEffect(() => {
    isPhone.current = isPhoneViewport();
  }, []);
  const [assignments, setAssignments] = useState<VertexRegionAssignment | null>(
    null,
  );
  // PR-A: per-vertex HCP-MMP-360 parcel IDs. Loaded lazily after the
  // mesh mounts so the cheaper region path lights up first.
  const [parcelIds, setParcelIds] = useState<Int16Array | null>(null);

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

  // PR-A: lazy-load the vertex→parcel-id assignment. Cheaper than
  // the region assignment (just an int per vertex, no Record lookup)
  // but loaded second so the 20-region path renders first.
  useEffect(() => {
    if (!geometry) return;
    let cancelled = false;
    const n = geometry.attributes.position.count;
    buildVertexParcels(resolution, n).then((p) => {
      if (!cancelled) setParcelIds(p);
    });
    return () => {
      cancelled = true;
    };
  }, [resolution, geometry]);

  // Smoothed per-region activation values.
  const smoothed = useRef<Map<RegionId, number>>(new Map());
  // PR-A: smoothed per-parcel activation values (HCP-MMP-360).
  const smoothedParcels = useRef<Map<number, number>>(new Map());
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const targetActivations = useBrainStageStore((s) => s.targetActivations);
  const parcelActivations = useBrainStageStore((s) => s.parcelActivations);
  // Visual-elevation Fix 2: read the interaction stamp so the
  // emissive-breath multiplier can pause in concert with the
  // mesh-scale breath in BrainAnatomy.
  const lastInteractionAt = useBrainStageStore((s) => s.lastInteractionAt);

  const elapsed = useRef(0);
  const breathElapsedMesh = useRef(0);

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
    const parcelReads: Record<string, number> =
      parcelActivations as Record<string, number>;
    const hasParcels =
      parcelIds !== null && Object.keys(parcelReads).length > 0;
    const hasExplicit = Object.values(reads).some((v) => (v ?? 0) > 0.02);

    // Visual-elevation Fix 1: when a new activation map arrives,
    // trigger the 800 ms emissive wake ramp. Signature is a coarse
    // hash of (count, sum-of-top-3-values, top key) — enough to
    // catch any meaningful map change without paying O(n) per frame.
    const sig =
      hasParcels
        ? `p:${Object.keys(parcelReads).length}`
        : hasExplicit
          ? `r:${Math.round(
              Object.values(reads).reduce((a, b) => a + (b ?? 0), 0) * 100,
            )}`
          : "idle";
    if (sig !== lastActivationSig.current) {
      emissiveWake.current = 1;
      lastActivationSig.current = sig;
    }
    if (emissiveWake.current > 0) {
      // Cubic-out decay over ~800 ms (1/0.8 ≈ 1.25 per second).
      emissiveWake.current = Math.max(
        0,
        emissiveWake.current - delta * 1.25,
      );
    }

    // phase 2: time-based smoothing with a deliberate ~1200 ms window.
    // The design-critic brief specified `1200ms cubic-bezier(0.16, 1, 0.3, 1)`
    // for activation lerps. Our underlying smoother is a first-order
    // exponential — over a 1200 ms window an exponential reaches ~95%
    // of the target with tau ≈ 400 ms (delta/tau exp curve). This gives
    // the same "settles in just over a second" feel without the
    // expense of bookkeeping a per-region start-time bezier evaluator.
    const dt = Math.min(0.1, delta);
    const lerp = 1 - Math.exp(-dt / 0.4);
    // Always touch every known region so ambient floors update.
    for (let i = 0; i < allRegionList.length; i++) {
      const r = allRegionList[i];
      // Ambient "breathing" idle: a slow per-region phase wave at
      // 0.18 Hz (~5.5 s per breath). Slower than the previous EEG-style
      // drift; reads as the brain actually breathing rather than
      // twitching. Switches off the moment an explicit activation
      // arrives so it doesn't dilute the signal.
      const phase = elapsed.current * 0.18 * Math.PI * 2 + i * 0.38;
      const breathDepth = 0.05 + Math.max(0, Math.sin(phase)) * 0.11;
      // PR-A: when real parcel data is driving the brain, the
      // 20-region ambient breathing is overridden by the parcel path
      // so the two ambient layers don't compete.
      const ambient = hasExplicit || hasParcels ? 0 : breathDepth;
      const explicit = reads[r] ?? 0;
      const tgt = Math.max(explicit, ambient);
      const cur = smoothed.current.get(r) ?? 0;
      smoothed.current.set(r, cur + (tgt - cur) * lerp);
    }

    // PR-A: smooth parcel activations the same way. Only the parcels
    // present in the incoming map are lerped; missing parcels fade
    // back toward zero so transitions read cleanly when the page
    // changes its precomputed JSON.
    if (hasParcels) {
      const seen = new Set<number>();
      for (const [k, v] of Object.entries(parcelReads)) {
        const pid = parseInt(k, 10);
        if (!Number.isFinite(pid) || pid <= 0) continue;
        seen.add(pid);
        const cur = smoothedParcels.current.get(pid) ?? 0;
        smoothedParcels.current.set(pid, cur + (v - cur) * lerp);
      }
      // Decay any previously-active parcels that are no longer in the
      // map.
      for (const pid of Array.from(smoothedParcels.current.keys())) {
        if (seen.has(pid)) continue;
        const cur = smoothedParcels.current.get(pid) ?? 0;
        const next = cur * (1 - lerp);
        if (next < 0.005) smoothedParcels.current.delete(pid);
        else smoothedParcels.current.set(pid, next);
      }
    }

    if (hasParcels && parcelIds) {
      // PR-A: parcel path. Color each vertex from its parcel's
      // smoothed activation. This is the new authoritative render
      // path; the region path stays alive for pages that haven't
      // been wired to load precomputed Neurosynth JSON yet.
      const colors = geometry.attributes.color as THREE.BufferAttribute;
      const arr = colors.array as Float32Array;
      let dirty = false;
      for (let i = 0; i < parcelIds.length; i++) {
        const pid = parcelIds[i];
        if (pid === 0) continue; // medial wall
        const a = smoothedParcels.current.get(pid) ?? 0;
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
    } else if (assignments) {
      // 20-region fallback path (unchanged from pre-PR-A behavior).
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

    // Visual-elevation Fix 1 (hotfix): apply the wake ramp to
    // emissive intensity. With the shader injection removed (it
    // silently failed to compile against three.js r184's standard
    // shader chunks and rendered the mesh fully transparent),
    // emissive contribution now comes from the material's flat
    // `emissive` * intensity. Base 0.22 keeps the surface legible
    // off-screen; wake adds up to +0.15 with a cubic-out feel.
    //
    // Visual-elevation Fix 2: emissive-breath multiplier
    // [0.95, 1.05] modulates the base intensity on the same 5 s
    // cycle as the mesh-scale breath. Pauses on interaction.
    const m = matRef.current;
    if (m) {
      const wake = emissiveWake.current;
      const wakeShaped = wake * wake; // ease-out cubic-ish

      const now = performance.now();
      const since = now - lastInteractionAt;
      const breathing = since > 2000;
      if (breathing) breathElapsedMesh.current += delta;
      const breathSine = Math.sin((breathElapsedMesh.current / 5) * Math.PI * 2);
      // [0.95, 1.05] when breathing, → 1.0 otherwise.
      const breathMul = 1.0 + (breathing ? breathSine * 0.05 : 0);

      // Readability hotfix: idle emissive dropped to 0.10 so the
      // brain doesn't compete with the hero text on /en. Active
      // regions still bloom via the wake ramp (+0.20 over 800 ms),
      // so the cinematic read on activation is preserved.
      m.emissiveIntensity = (0.1 + wakeShaped * 0.2) * breathMul;
    }
  });

  // Visual-elevation Fix 1: shader-chunk injection so per-vertex
  // colours contribute as EMISSIVE radiance rather than diffuse paint.
  // Replaces three.js's standard `totalEmissiveRadiance` line with one
  // that adds `vColor.rgb * emissiveIntensity * 1.6`. The vertex
  // colour update path is unchanged; only the visible read shifts from
  // "painted" to "glowing from within."
  const onBeforeCompile = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "vec3 totalEmissiveRadiance = emissive;",
      "vec3 totalEmissiveRadiance = emissive + vColor.rgb * emissiveIntensity * 1.6;",
    );
  };

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
        emissiveIntensity={0.32}
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
  // Visual-elevation Fix 2: subscribe to lastInteractionAt so the
  // breathing pause check has a fresh read every frame without
  // calling useStore inside useFrame.
  const lastInteractionAt = useBrainStageStore((s) => s.lastInteractionAt);

  const groupRef = useRef<THREE.Group>(null);
  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const tmpEuler = useMemo(() => new THREE.Euler(), []);
  // Visual-elevation Fix 2: elapsed time the breathing curve runs
  // against. Distinct from the per-region wave inside
  // MeshForResolution so the two breathing layers can pause
  // independently.
  const breathElapsed = useRef(0);

  // PR 8: honor prefers-reduced-motion for the continuous Y rotation.
  // Position/scale/rotation lerping toward an explicit target stays
  // intact (those are anchor transitions, not gratuitous motion); only
  // the always-on idle rotation is gated.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    tmpVec.set(targetPos[0], targetPos[1], targetPos[2]);
    g.position.lerp(tmpVec, Math.min(1, delta * 3));

    // Visual-elevation Fix 2: mesh-scale breathing on a 5 s cycle,
    // 0.99 → 1.01 → 0.99. Multiplicative against the
    // anchor-driven targetScale so room transitions still feel
    // like room transitions, and the breath rides on top.
    //
    // Pauses when an interaction landed in the last 2 s — typing
    // in /mirror, scrubbing in /music, tour scrub, pair toggle,
    // video timeupdate. Then resumes; phase doesn't reset, so the
    // resumed breath picks up where the brain "would have been"
    // (avoids a hard inhale-discontinuity on resume).
    const now = performance.now();
    const since = now - lastInteractionAt;
    const breathing = !reduced && since > 2000;
    if (breathing) breathElapsed.current += delta;
    const breathSine = Math.sin((breathElapsed.current / 5) * Math.PI * 2);
    // breathScale ∈ [0.99, 1.01] when breathing, → 1.0 otherwise.
    const breathAmplitude = breathing ? 0.01 : 0;
    const breathScale = 1.0 + breathSine * breathAmplitude;

    const ns = THREE.MathUtils.lerp(g.scale.x, targetScale * breathScale, Math.min(1, delta * 3));
    g.scale.setScalar(ns);
    tmpEuler.set(targetRot[0], targetRot[1], targetRot[2]);
    tmpQuat.setFromEuler(tmpEuler);
    g.quaternion.slerp(tmpQuat, Math.min(1, delta * 2.5));
    if (!reduced) g.rotation.y += delta * 0.05;
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
      {/* Brass halos for the top-3 most-active regions. Sibling of the
          mesh so they orbit and translate with the brain. Fade in/out
          on their own timing (600 ms in, 400 ms out). Threshold gated
          at 0.45 — a region has to genuinely be active to earn one. */}
      <BrassHalos />
    </group>
  );
}
