"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { regions, type RegionId } from "@/lib/regions";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * Procedural anatomical brain.
 *
 * Three nested layers:
 *   1. Two ellipsoid hemispheres with sulci-like vertex displacement (low-
 *      frequency 3D noise) + a longitudinal fissure created by squeezing
 *      each hemisphere off-center on the x axis. Semi-transparent.
 *   2. A cerebellum bulb at the inferior-posterior position, two smaller
 *      lobes; gives the silhouette its anatomical signature.
 *   3. The 20 region "nodes" that ramp activation idle→cyan→amber→oxblood.
 *      Same store-driven activation logic as before.
 *
 * Z-Anatomy's hand-modeled brain is documented in STUBS.md as the proper
 * upgrade path. This procedural form is the deliberate cinematic
 * alternative — abstract enough to be honest about what TRIBE actually
 * predicts (group-average activation, not real anatomy).
 */

const COLOR_IDLE = new THREE.Color("#1a2444");
const COLOR_LOW = new THREE.Color("#5cc8d6");
const COLOR_MID = new THREE.Color("#e8a04a");
const COLOR_HIGH = new THREE.Color("#8b3a3a");
const COLOR_SHELL = new THREE.Color("#1a2444");

function activationColor(a: number, out: THREE.Color) {
  if (a <= 0.01) return out.copy(COLOR_IDLE);
  if (a < 0.5) return out.copy(COLOR_LOW).lerp(COLOR_MID, a / 0.5);
  return out.copy(COLOR_MID).lerp(COLOR_HIGH, (a - 0.5) / 0.5);
}

// Simple 3D value noise (Perlin-ish) for vertex displacement.
function hash(x: number, y: number, z: number): number {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

function smoothstep(a: number, b: number, t: number): number {
  const k = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return k * k * (3 - 2 * k);
}

function valueNoise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  let n = 0;
  for (let dz = 0; dz < 2; dz++) {
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const h = hash(xi + dx, yi + dy, zi + dz);
        const wx = dx === 0 ? 1 - smoothstep(0, 1, xf) : smoothstep(0, 1, xf);
        const wy = dy === 0 ? 1 - smoothstep(0, 1, yf) : smoothstep(0, 1, yf);
        const wz = dz === 0 ? 1 - smoothstep(0, 1, zf) : smoothstep(0, 1, zf);
        n += h * wx * wy * wz;
      }
    }
  }
  return n * 2 - 1; // [-1, 1]
}

function makeHemisphereGeometry(side: 1 | -1): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.85, 64, 64);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Squeeze each hemisphere slightly toward its side and flatten the
    // medial (inner) face so the longitudinal fissure reads.
    const medialDistance = side === 1 ? v.x : -v.x;
    if (medialDistance < 0) {
      // Inner half of each hemisphere: pull toward the midline plane.
      v.x = v.x * 0.05;
    } else {
      // Outer half: stretch slightly.
      v.x *= 1.04;
    }

    // Sulci displacement: multi-octave noise scaled gently so the brain
    // reads as folded, not bumpy.
    const n =
      0.6 * valueNoise3(v.x * 2.4, v.y * 2.4, v.z * 2.4) +
      0.3 * valueNoise3(v.x * 5.0, v.y * 5.0, v.z * 5.0) +
      0.15 * valueNoise3(v.x * 9.0, v.y * 9.0, v.z * 9.0);
    const r = v.length();
    if (r > 0) {
      v.multiplyScalar(1 + n * 0.06);
    }

    // Slight anterior protrusion (frontal lobe forward, z > 0).
    if (v.z > 0.4) {
      v.z += 0.06;
    }
    // Inferior-posterior taper (occipital + temporal).
    if (v.y < -0.4) {
      v.y *= 1.05;
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  // Shift each hemisphere off-center to widen the longitudinal fissure.
  geo.translate(side * 0.18, 0.05, 0);
  return geo;
}

function makeCerebellumGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.42, 32, 32);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // Tighter, more textured sulci on the cerebellum.
    const n =
      0.4 * valueNoise3(v.x * 7, v.y * 7, v.z * 7) +
      0.25 * valueNoise3(v.x * 14, v.y * 14, v.z * 14);
    if (v.length() > 0) v.multiplyScalar(1 + n * 0.08);
    // Slight horizontal flatten (cerebellum is wider than deep).
    v.y *= 0.7;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

const HEMI_LEFT_GEO = makeHemisphereGeometry(-1);
const HEMI_RIGHT_GEO = makeHemisphereGeometry(1);
const CEREBELLUM_GEO = makeCerebellumGeometry();

function AnatomicalShell() {
  return (
    <>
      <mesh geometry={HEMI_LEFT_GEO}>
        <meshStandardMaterial
          color={COLOR_SHELL}
          roughness={0.72}
          metalness={0.04}
          transparent
          opacity={0.22}
        />
      </mesh>
      <mesh geometry={HEMI_RIGHT_GEO}>
        <meshStandardMaterial
          color={COLOR_SHELL}
          roughness={0.72}
          metalness={0.04}
          transparent
          opacity={0.22}
        />
      </mesh>
      <mesh geometry={CEREBELLUM_GEO} position={[0, -0.78, -0.18]}>
        <meshStandardMaterial
          color={COLOR_SHELL}
          roughness={0.78}
          metalness={0.04}
          transparent
          opacity={0.26}
        />
      </mesh>

      {/* Brass wireframe layer hints at the surface folds without dominating */}
      <mesh geometry={HEMI_LEFT_GEO} scale={1.001}>
        <meshBasicMaterial
          color={"#c9a961"}
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>
      <mesh geometry={HEMI_RIGHT_GEO} scale={1.001}>
        <meshBasicMaterial
          color={"#c9a961"}
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>
      <mesh
        geometry={CEREBELLUM_GEO}
        position={[0, -0.78, -0.18]}
        scale={1.001}
      >
        <meshBasicMaterial
          color={"#c9a961"}
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </>
  );
}

type NodeRef = {
  id: RegionId;
  mesh: THREE.Mesh | null;
  material: THREE.MeshStandardMaterial | null;
  basePosition: THREE.Vector3;
  current: number;
};

export default function BrainConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<NodeRef[]>([]);

  if (nodeRefs.current.length === 0) {
    nodeRefs.current = regions.map((r) => ({
      id: r.id,
      mesh: null,
      material: null,
      basePosition: new THREE.Vector3(r.position[0], r.position[1], r.position[2]),
      current: 0,
    }));
  }

  const targetPos = useBrainStageStore((s) => s.targetPosition);
  const targetScale = useBrainStageStore((s) => s.targetScale);
  const targetRot = useBrainStageStore((s) => s.targetRotation);
  const targetActivations = useBrainStageStore((s) => s.targetActivations);

  const tmpColor = useMemo(() => new THREE.Color(), []);
  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const tmpEuler = useMemo(() => new THREE.Euler(), []);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (g) {
      tmpVec.set(targetPos[0], targetPos[1], targetPos[2]);
      g.position.lerp(tmpVec, Math.min(1, delta * 3));
      const ns = THREE.MathUtils.lerp(g.scale.x, targetScale, Math.min(1, delta * 3));
      g.scale.setScalar(ns);
      tmpEuler.set(targetRot[0], targetRot[1], targetRot[2]);
      tmpQuat.setFromEuler(tmpEuler);
      g.quaternion.slerp(tmpQuat, Math.min(1, delta * 2.5));
      g.rotation.y += delta * 0.06;
    }

    for (const n of nodeRefs.current) {
      const target = targetActivations[n.id] ?? 0;
      n.current = THREE.MathUtils.lerp(n.current, target, Math.min(1, delta * 3.5));
      const mat = n.material;
      if (mat) {
        activationColor(n.current, tmpColor);
        mat.color.lerp(tmpColor, 0.4);
        mat.emissive.lerp(tmpColor, 0.4);
        mat.emissiveIntensity = 0.15 + n.current * 1.2;
      }
      const m = n.mesh;
      if (m) {
        const targetScale = 0.04 + n.current * 0.06;
        const cs = THREE.MathUtils.lerp(m.scale.x, targetScale, 0.2);
        m.scale.setScalar(cs);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <AnatomicalShell />
      {regions.map((r, i) => (
        <mesh
          key={r.id}
          position={r.position}
          ref={(m) => {
            const nr = nodeRefs.current[i];
            if (!nr) return;
            nr.mesh = m;
            if (m && !nr.material) {
              nr.material = m.material as THREE.MeshStandardMaterial;
            }
          }}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={COLOR_IDLE}
            emissive={COLOR_IDLE}
            emissiveIntensity={0.1}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
