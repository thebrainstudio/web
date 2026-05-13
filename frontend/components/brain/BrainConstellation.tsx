"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { regions, type RegionId } from "@/lib/regions";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * Stylized brain visualization. Two layers:
 *   1. A semi-transparent low-poly "shell" — implies volume without
 *      pretending to be anatomical. (Slowly rotates with parent group.)
 *   2. 20 region nodes positioned by `lib/regions.ts`. Each node's color,
 *      scale, and emissive intensity is driven by `targetActivations`
 *      from the brain stage store. Idle = indigo smoke, dim. Mid = cyan
 *      → amber. High = amber → oxblood, glowing.
 *
 * NB: the constellation is the brain *as data*, not as anatomy. That
 * honesty matches the site's "model of average brain" caveat.
 */

const COLOR_IDLE = new THREE.Color("#1a2444");
const COLOR_LOW = new THREE.Color("#5cc8d6");
const COLOR_MID = new THREE.Color("#e8a04a");
const COLOR_HIGH = new THREE.Color("#8b3a3a");
const COLOR_SHELL = new THREE.Color("#1a2444");

function activationColor(a: number, out: THREE.Color) {
  // 0..1 → idle→low→mid→high
  if (a <= 0.01) return out.copy(COLOR_IDLE);
  if (a < 0.5) return out.copy(COLOR_LOW).lerp(COLOR_MID, a / 0.5);
  return out.copy(COLOR_MID).lerp(COLOR_HIGH, (a - 0.5) / 0.5);
}

type NodeRef = {
  id: RegionId;
  mesh: THREE.Mesh | null;
  material: THREE.MeshStandardMaterial | null;
  basePosition: THREE.Vector3;
  current: number; // smoothed activation
};

function ShellMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  return (
    <mesh ref={meshRef} scale={1.18}>
      <icosahedronGeometry args={[1.0, 3]} />
      <meshStandardMaterial
        color={COLOR_SHELL}
        roughness={0.7}
        metalness={0.05}
        transparent
        opacity={0.18}
        wireframe={false}
      />
    </mesh>
  );
}

function ShellWireframe() {
  return (
    <mesh scale={1.19}>
      <icosahedronGeometry args={[1.0, 2]} />
      <meshBasicMaterial
        color={"#c9a961"}
        wireframe
        transparent
        opacity={0.06}
      />
    </mesh>
  );
}

export default function BrainConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<NodeRef[]>([]);

  // Stable refs for each region.
  if (nodeRefs.current.length === 0) {
    nodeRefs.current = regions.map((r) => ({
      id: r.id,
      mesh: null,
      material: null,
      basePosition: new THREE.Vector3(r.position[0], r.position[1], r.position[2]),
      current: 0,
    }));
  }

  // Read transform + activations targets from store.
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
      // Transform lerps
      tmpVec.set(targetPos[0], targetPos[1], targetPos[2]);
      g.position.lerp(tmpVec, Math.min(1, delta * 3));
      const ns = THREE.MathUtils.lerp(g.scale.x, targetScale, Math.min(1, delta * 3));
      g.scale.setScalar(ns);
      tmpEuler.set(targetRot[0], targetRot[1], targetRot[2]);
      tmpQuat.setFromEuler(tmpEuler);
      g.quaternion.slerp(tmpQuat, Math.min(1, delta * 2.5));

      // Idle breath rotation overlays
      g.rotation.y += delta * 0.06;
    }

    // Each node lerps its activation, then maps to color + scale + emissive
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
      <ShellMesh />
      <ShellWireframe />
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
