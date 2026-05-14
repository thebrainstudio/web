"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three-stdlib";
import * as THREE from "three";
import type { RegionId } from "@/lib/regions";

/**
 * Single-view static brain thumbnail.
 *
 * Used inside the pinned-prediction card. Anatomical anterior view
 * (face-on). Renders the same fsaverage5 mesh and activation colour
 * ramp as the main brain so the thumbnail reads the same activation
 * pattern at a glance. Smaller, simpler, no bloom — just a faithful
 * miniature.
 *
 * This is a parallel to BrainViews' MiniBrainMesh but kept here so
 * the card can be imported independently. Module-level mesh + vertex
 * map caches mean the second instance has no extra network cost.
 */

const MESH_URL = "/meshes/fsaverage5_pial.glb";
const VERTEX_TO_REGION_URL = "/vertex_to_region.json";

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

let _vtr: Record<string, RegionId> | null = null;
let _vtrPromise: Promise<Record<string, RegionId>> | null = null;
function loadVtr(): Promise<Record<string, RegionId>> {
  if (_vtr) return Promise.resolve(_vtr);
  if (_vtrPromise) return _vtrPromise;
  _vtrPromise = fetch(VERTEX_TO_REGION_URL)
    .then((r) => r.json() as Promise<Record<string, RegionId>>)
    .then((j) => {
      _vtr = j;
      return j;
    });
  return _vtrPromise;
}

function findFirstMesh(scene: THREE.Object3D): THREE.Mesh | null {
  let found: THREE.Mesh | null = null;
  scene.traverse((c) => {
    if (!found && (c as THREE.Mesh).isMesh) found = c as THREE.Mesh;
  });
  return found;
}

function ThumbnailMesh({
  activations,
}: {
  activations: Partial<Record<RegionId, number>>;
}) {
  const gltf = useLoader(GLTFLoader, MESH_URL) as unknown as {
    scene: THREE.Object3D;
  };
  const source = useMemo(() => findFirstMesh(gltf.scene), [gltf]);
  const [assignments, setAssignments] = useState<(RegionId | null)[] | null>(
    null,
  );
  const tmpColor = useMemo(() => new THREE.Color(), []);

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

  useEffect(() => {
    if (!geometry) return;
    let cancelled = false;
    const n = geometry.attributes.position.count;
    loadVtr().then((map) => {
      if (cancelled) return;
      const out: (RegionId | null)[] = new Array(n).fill(null);
      for (const [k, v] of Object.entries(map)) {
        const i = parseInt(k, 10);
        if (i < n) out[i] = v;
      }
      setAssignments(out);
    });
    return () => {
      cancelled = true;
    };
  }, [geometry]);

  // Static thumbnail — colors update only when activations change.
  // We still use useFrame for the initial fade-in but skip per-frame
  // color recomputation once stable.
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const opacity = useRef(0.001);
  const lastActivationsRef = useRef<string>("");

  useFrame((_, delta) => {
    if (!geometry) return;
    // Color update — only when activations actually change.
    if (assignments) {
      const sig = JSON.stringify(activations);
      if (sig !== lastActivationsRef.current) {
        lastActivationsRef.current = sig;
        const reads = activations as Record<string, number>;
        const colors = geometry.attributes.color as THREE.BufferAttribute;
        const arr = colors.array as Float32Array;
        for (let i = 0; i < assignments.length; i++) {
          const r = assignments[i];
          if (!r) continue;
          const a = reads[r] ?? 0;
          activationColor(a, tmpColor);
          const o = i * 3;
          arr[o] = tmpColor.r;
          arr[o + 1] = tmpColor.g;
          arr[o + 2] = tmpColor.b;
        }
        colors.needsUpdate = true;
      }
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
    <mesh geometry={geometry}>
      <meshStandardMaterial
        ref={matRef}
        vertexColors
        roughness={0.5}
        metalness={0.05}
        envMapIntensity={0.3}
        emissive={"#ffffff"}
        emissiveIntensity={0.18}
        transparent
        opacity={0.001}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function MiniBrainPreview({
  activations,
}: {
  activations: Partial<Record<RegionId, number>>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 28, near: 0.1, far: 20 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={0.65} />
      <ThumbnailMesh activations={activations} />
    </Canvas>
  );
}
