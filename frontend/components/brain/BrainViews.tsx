"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";
import type { RegionId } from "@/lib/regions";
import { useBrainStageStore } from "@/store/useBrainStageStore";
import { Caption } from "@/components/typography/Typography";

/**
 * Four-angle brain views — anterior / right lateral / posterior / left
 * lateral mini panels rendered below the main mirror canvas.
 *
 * Anatomical convention: anterior = face-on (front), posterior = back of
 * head, left lateral = looking at the left hemisphere from outside the
 * head, right lateral = the mirror of that. Same colour ramp as the
 * main brain so activation reads consistently across all five views
 * (main + 4 mini).
 *
 * Implementation notes:
 *   - Four separate R3F canvases. Each holds its own WebGL context and
 *     its own geometry clone (you can't share GPU buffers across
 *     contexts), but the GLB + vertex-to-region JSON load once at
 *     module level and reuse across all four.
 *   - No bloom postprocessing, no group transformations — these are
 *     stable thumbnails, not the editorial hero brain.
 *   - Activations are passed in as props so the panels render the
 *     same prediction the main brain is showing. Live-updating as
 *     the user types.
 *   - Each canvas's mesh fades in over ~600 ms after the geometry
 *     resolves, so the panels don't pop.
 */

const MESH_URL = "/meshes/fsaverage5_pial.glb";
const VERTEX_TO_REGION_URL = "/vertex_to_region.json";

// ── Activation colour ramp — IDENTICAL to BrainAnatomy ──────────────
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

// ── Vertex-to-region cache (module-level, shared across all canvases) ─

let _vertexToRegion: Record<string, RegionId> | null = null;
let _vertexToRegionPromise: Promise<Record<string, RegionId>> | null = null;

function loadVertexToRegion(): Promise<Record<string, RegionId>> {
  if (_vertexToRegion) return Promise.resolve(_vertexToRegion);
  if (_vertexToRegionPromise) return _vertexToRegionPromise;
  _vertexToRegionPromise = fetch(VERTEX_TO_REGION_URL)
    .then((r) => r.json() as Promise<Record<string, RegionId>>)
    .then((j) => {
      _vertexToRegion = j;
      return j;
    });
  return _vertexToRegionPromise;
}

function findFirstMesh(scene: THREE.Object3D): THREE.Mesh | null {
  let found: THREE.Mesh | null = null;
  scene.traverse((child) => {
    if (!found && (child as THREE.Mesh).isMesh) found = child as THREE.Mesh;
  });
  return found;
}

// ── Mini brain mesh — vertex-colored fsaverage5 inside a fixed canvas ─

function MiniBrainMesh({
  activations,
}: {
  activations: Partial<Record<RegionId, number>>;
}) {
  const gltf = useLoader(GLTFLoader, MESH_URL) as unknown as {
    scene: THREE.Object3D;
  };
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const opacity = useRef(0.001);
  const [assignments, setAssignments] = useState<(RegionId | null)[] | null>(
    null,
  );

  const source = useMemo(() => findFirstMesh(gltf.scene), [gltf]);

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

  // Lazy-load vertex assignments and bind them to this mesh.
  useEffect(() => {
    if (!geometry) return;
    let cancelled = false;
    const n = geometry.attributes.position.count;
    loadVertexToRegion().then((vtr) => {
      if (cancelled) return;
      const out: (RegionId | null)[] = new Array(n).fill(null);
      for (const [k, v] of Object.entries(vtr)) {
        const i = parseInt(k, 10);
        if (i < n) out[i] = v;
      }
      setAssignments(out);
    });
    return () => {
      cancelled = true;
    };
  }, [geometry]);

  // Smoothed per-region activation values, frame-rate independent.
  const smoothed = useRef<Map<RegionId, number>>(new Map());
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    if (!geometry || !meshRef.current) return;
    const dt = Math.min(0.1, delta);
    const lerp = 1 - Math.exp(-dt / 0.4);

    const reads = activations as Record<string, number>;
    // Touch every known region so unset regions decay toward 0.
    for (const r of [
      "ifg_left", "ifg_right", "pstg_left", "pstg_right", "mtg_left",
      "mtg_right", "atl_left", "atl_right", "agl_left", "agl_right",
      "hg_left", "hg_right", "vmpfc", "dmpfc", "pcc", "precuneus",
      "amyg_left", "amyg_right", "hipp_left", "hipp_right",
    ] as RegionId[]) {
      const tgt = reads[r] ?? 0;
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
        if (Math.abs(arr[o] - tmpColor.r) > 0.003) {
          arr[o] = tmpColor.r;
          arr[o + 1] = tmpColor.g;
          arr[o + 2] = tmpColor.b;
          dirty = true;
        }
      }
      if (dirty) colors.needsUpdate = true;
    }

    // Fade in.
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
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={matRef}
        vertexColors
        roughness={0.45}
        metalness={0.05}
        envMapIntensity={0.4}
        emissive={"#ffffff"}
        emissiveIntensity={0.16}
        transparent
        opacity={0.001}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Camera definitions for the 4 anatomical views ────────────────────

type ViewDef = {
  cameraPos: [number, number, number];
  cameraUp: [number, number, number];
  /** i18n key under `mirror.viewLabel`. */
  labelKey: "anterior" | "rightLateral" | "posterior" | "leftLateral";
};

/**
 * Camera positions chosen so each view shows the brain's full extent
 * with its anatomical convention. Distance 2.8 + fov 28° puts the
 * brain at ~80 % of the canvas. The `up` vector is always (0, 1, 0)
 * since the GLB is exported with Y as superior-inferior.
 */
const VIEWS: ViewDef[] = [
  // Anterior — looking at the brain from the front (face side).
  { cameraPos: [0, 0, 2.8], cameraUp: [0, 1, 0], labelKey: "anterior" },
  // Right lateral — looking at the right hemisphere from outside the head.
  { cameraPos: [2.8, 0, 0], cameraUp: [0, 1, 0], labelKey: "rightLateral" },
  // Posterior — looking at the back of the head.
  { cameraPos: [0, 0, -2.8], cameraUp: [0, 1, 0], labelKey: "posterior" },
  // Left lateral — mirror of right.
  { cameraPos: [-2.8, 0, 0], cameraUp: [0, 1, 0], labelKey: "leftLateral" },
];

/**
 * Imperative capture API for the PNG export flow. Finds the four
 * `BrainViews` canvases by their `data-brain-view` attribute and
 * returns their pixels as data URLs in anatomical order.
 *
 * Requires the canvases to have `preserveDrawingBuffer: true` (we
 * set this above). Returns null for any view whose canvas isn't on
 * the page (e.g. on routes without BrainViews mounted).
 */
export type CapturedBrainView = {
  labelKey: ViewDef["labelKey"];
  dataUrl: string | null;
};

export function captureBrainViews(): CapturedBrainView[] {
  if (typeof document === "undefined") {
    return VIEWS.map((v) => ({ labelKey: v.labelKey, dataUrl: null }));
  }
  return VIEWS.map((v) => {
    const wrapper = document.querySelector<HTMLElement>(
      `[data-brain-view="${v.labelKey}"]`,
    );
    if (!wrapper) return { labelKey: v.labelKey, dataUrl: null };
    const canvas = wrapper.querySelector<HTMLCanvasElement>("canvas");
    if (!canvas) return { labelKey: v.labelKey, dataUrl: null };
    try {
      const dataUrl = canvas.toDataURL("image/png");
      return { labelKey: v.labelKey, dataUrl };
    } catch (err) {
      console.warn("[captureBrainViews] toDataURL failed", err);
      return { labelKey: v.labelKey, dataUrl: null };
    }
  });
}

function ViewCanvas({
  view,
  activations,
}: {
  view: ViewDef;
  activations: Partial<Record<RegionId, number>>;
}) {
  return (
    <Canvas
      camera={{
        position: view.cameraPos,
        up: view.cameraUp,
        fov: 28,
        near: 0.1,
        far: 20,
      }}
      dpr={[1, 2]}
      // `preserveDrawingBuffer: true` lets the PNG-export flow call
      // `canvas.toDataURL()` to capture the rendered pixels into the
      // shareable fingerprint. Cost is small for these mini canvases.
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      {/*
        Simple two-light setup — no atmospheric bloom or environment
        map. The thumbnails want to read clearly at small size, not
        to look hero-cinematic.
      */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 3, 4]} intensity={0.7} />
      <directionalLight position={[-2, -1, -2]} intensity={0.25} />
      <MiniBrainMesh activations={activations} />
    </Canvas>
  );
}

// ── Public component ────────────────────────────────────────────────

/**
 * The optional `activations` prop is a *fallback* used before the brain
 * stage store has anything. In the live page, BrainViews subscribes
 * directly to `useBrainStageStore.targetActivations` so it swings in
 * lockstep with the main brain — including the hover-driven spotlight
 * from `MirrorInspector`. This is what makes the "did the brain just
 * move?" question unambiguous: the four anatomical views sit right
 * next to the inspector text and respond visibly to every hover.
 */
export default function BrainViews({
  activations,
  className = "",
}: {
  activations?: Partial<Record<RegionId, number>>;
  className?: string;
}) {
  // Subscribe to the live brain stage store. This is the same source
  // the main background brain reads from, so all five views (main +
  // 4 mini) stay synchronized.
  const storeActivations = useBrainStageStore(
    (s) => s.targetActivations,
  ) as Partial<Record<RegionId, number>>;

  // Use the store value when it's non-empty; fall back to the prop
  // (the settled prediction) on first paint before the store has any
  // user data.
  const liveActivations: Partial<Record<RegionId, number>> = useMemo(() => {
    const hasStore =
      storeActivations && Object.keys(storeActivations).length > 0;
    return hasStore ? storeActivations : (activations ?? {});
  }, [storeActivations, activations]);

  const labels: Record<ViewDef["labelKey"], string> = {
    anterior: "Anterior",
    rightLateral: "Right lateral",
    posterior: "Posterior",
    leftLateral: "Left lateral",
  };

  return (
    <div className={className}>
      <Caption
        uppercase
        className="text-bone-cream/55 mb-4 block tracking-[0.18em]"
      >
        Every angle of your prediction
      </Caption>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {VIEWS.map((view) => (
          <div key={view.labelKey}>
            <div
              data-brain-view={view.labelKey}
              className="border-bone-cream/10 bg-navy-deep/40 relative aspect-square overflow-hidden rounded-sm border"
            >
              <ViewCanvas view={view} activations={liveActivations} />
            </div>
            <Caption
              uppercase
              className="text-bone-cream/55 mt-2 block text-center tracking-[0.16em]"
            >
              {labels[view.labelKey]}
            </Caption>
          </div>
        ))}
      </div>
    </div>
  );
}
