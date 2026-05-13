"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural synapse with neurotransmitter particles. Renders:
 *   - presynaptic bouton (large flattened sphere on the left)
 *   - synaptic cleft (the gap)
 *   - postsynaptic spine (mushroom shape on the right)
 *   - synaptic vesicles inside the bouton (cluster of small spheres)
 *   - particle burst across the cleft when `triggerCount` increments
 *
 * Neurotransmitter type changes the particle color, count, speed, and the
 * burst-vs-trickle release pattern — the educational point is that the
 * same mechanics give very different downstream effects depending on the
 * transmitter and its receptors.
 */

export type Neurotransmitter =
  | "glutamate"
  | "gaba"
  | "dopamine"
  | "serotonin"
  | "norepinephrine"
  | "acetylcholine";

export type NTProfile = {
  label: string;
  effect: string;
  color: string;
  count: number;
  /** Seconds to traverse the cleft. */
  travel: number;
  /** "burst" releases all particles at once; "trickle" spreads them out. */
  pattern: "burst" | "trickle";
};

export const NEUROTRANSMITTERS: Record<Neurotransmitter, NTProfile> = {
  glutamate: {
    label: "Glutamate",
    effect: "Excitatory. Binds AMPA / NMDA. Fast, depolarizing.",
    color: "#fde047",
    count: 80,
    travel: 0.5,
    pattern: "burst",
  },
  gaba: {
    label: "GABA",
    effect: "Inhibitory. Binds GABA-A. Fast, hyperpolarizing.",
    color: "#22d3ee",
    count: 60,
    travel: 0.55,
    pattern: "burst",
  },
  dopamine: {
    label: "Dopamine",
    effect: "Neuromodulator. Volume transmission; slower, broader spread.",
    color: "#c9a961",
    count: 50,
    travel: 1.1,
    pattern: "trickle",
  },
  serotonin: {
    label: "Serotonin",
    effect: "Neuromodulator. Steady release; receptor diversity matters.",
    color: "#e8a04a",
    count: 45,
    travel: 1.3,
    pattern: "trickle",
  },
  norepinephrine: {
    label: "Norepinephrine",
    effect: "Arousal / vigilance. Sparse but salient.",
    color: "#f0e8d8",
    count: 35,
    travel: 0.85,
    pattern: "burst",
  },
  acetylcholine: {
    label: "Acetylcholine",
    effect: "Attention, plasticity. Balanced release.",
    color: "#ffd17a",
    count: 60,
    travel: 0.7,
    pattern: "burst",
  },
};

type Props = {
  nt: Neurotransmitter;
  /** Increment this to trigger an action potential + release. */
  triggerCount: number;
  /** Playback rate. 1 = real-ish (slowed for legibility). */
  speed?: number;
};

type Particle = {
  active: boolean;
  start: number;        // seconds, when this particle was released
  travel: number;       // seconds the particle takes to cross
  ox: number; oy: number; oz: number; // small random origin offset
  tx: number; ty: number; tz: number; // small random target offset
};

const PRESYNAPTIC_X = -0.95;
const POSTSYNAPTIC_X = 0.55;

export default function Synapse({ nt, triggerCount, speed = 1 }: Props) {
  const profile = NEUROTRANSMITTERS[nt];
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);
  const elapsed = useRef(0);
  const lastTrigger = useRef(triggerCount);
  const apProgress = useRef(-1); // -1 = idle; 0..1 = action-potential progress

  // Vesicle cluster (visual; static positions inside the bouton).
  const vesicles = useMemo(() => {
    const arr: [number, number, number, number][] = [];
    for (let i = 0; i < 28; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI - Math.PI / 2;
      const r = 0.18 + Math.random() * 0.1;
      // cluster on the right side of bouton (facing cleft)
      const cx = PRESYNAPTIC_X + 0.12 + Math.cos(u) * r * 0.35;
      const cy = Math.sin(v) * r * 0.5;
      const cz = Math.sin(u) * r * 0.4;
      arr.push([cx, cy, cz, 0.025 + Math.random() * 0.015]);
    }
    return arr;
  }, []);

  // Particle pool: allocate once, recycle.
  const pool = useMemo(() => {
    const POOL = 160;
    const positions = new Float32Array(POOL * 3);
    const colors = new Float32Array(POOL * 3);
    const sizes = new Float32Array(POOL);
    for (let i = 0; i < POOL; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -10; // park off-screen
      positions[i * 3 + 2] = 0;
      sizes[i] = 0;
    }
    particles.current = new Array(POOL).fill(null).map(() => ({
      active: false,
      start: 0,
      travel: 0.6,
      ox: 0, oy: 0, oz: 0, tx: 0, ty: 0, tz: 0,
    }));
    return { positions, colors, sizes, POOL };
  }, []);

  // Update colors when nt changes.
  useEffect(() => {
    const c = new THREE.Color(profile.color);
    for (let i = 0; i < pool.POOL; i++) {
      pool.colors[i * 3] = c.r;
      pool.colors[i * 3 + 1] = c.g;
      pool.colors[i * 3 + 2] = c.b;
    }
    if (pointsRef.current) {
      const colorAttr = pointsRef.current.geometry.attributes.color;
      if (colorAttr) colorAttr.needsUpdate = true;
    }
  }, [nt, profile.color, pool]);

  // Trigger handling.
  useEffect(() => {
    if (triggerCount === lastTrigger.current) return;
    lastTrigger.current = triggerCount;
    apProgress.current = 0;
  }, [triggerCount]);

  useFrame((_, delta) => {
    elapsed.current += delta * speed;

    // Action potential travel: ~200ms from far-left to bouton.
    if (apProgress.current >= 0 && apProgress.current < 1) {
      apProgress.current = Math.min(1, apProgress.current + delta * speed / 0.25);
      if (apProgress.current >= 1) {
        // AP arrived — release particles.
        const count = profile.count;
        const isBurst = profile.pattern === "burst";
        let released = 0;
        for (let i = 0; i < particles.current.length && released < count; i++) {
          const p = particles.current[i];
          if (p.active) continue;
          p.active = true;
          p.start = elapsed.current + (isBurst
            ? Math.random() * 0.05
            : Math.random() * 0.6);
          p.travel = profile.travel * (0.85 + Math.random() * 0.3);
          p.ox = (Math.random() - 0.5) * 0.18;
          p.oy = (Math.random() - 0.5) * 0.22;
          p.oz = (Math.random() - 0.5) * 0.18;
          p.tx = (Math.random() - 0.5) * 0.2;
          p.ty = (Math.random() - 0.5) * 0.18;
          p.tz = (Math.random() - 0.5) * 0.16;
          released++;
        }
      }
    }

    // Update particle positions.
    const pos = pool.positions;
    const siz = pool.sizes;
    let dirtyPos = false;
    let dirtySiz = false;
    for (let i = 0; i < particles.current.length; i++) {
      const p = particles.current[i];
      if (!p.active) {
        if (siz[i] !== 0) {
          siz[i] = 0;
          dirtySiz = true;
        }
        continue;
      }
      const t = (elapsed.current - p.start) / p.travel;
      if (t < 0) {
        // not yet released this frame
        siz[i] = 0;
        continue;
      }
      if (t >= 1) {
        p.active = false;
        pos[i * 3 + 1] = -10;
        siz[i] = 0;
        dirtyPos = dirtySiz = true;
        continue;
      }
      // Eased lerp from bouton-edge to spine-edge with small arc.
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const x = (PRESYNAPTIC_X + 0.22 + p.ox) +
        ((POSTSYNAPTIC_X - 0.15 + p.tx) - (PRESYNAPTIC_X + 0.22 + p.ox)) * e;
      const y = p.oy + (p.ty - p.oy) * e + Math.sin(t * Math.PI) * 0.05;
      const z = p.oz + (p.tz - p.oz) * e;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      siz[i] = 0.06 + (1 - Math.abs(t - 0.5) * 2) * 0.04;
      dirtyPos = true;
      dirtySiz = true;
    }
    if (pointsRef.current) {
      const g = pointsRef.current.geometry;
      if (dirtyPos) (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      if (dirtySiz) (g.attributes.size as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  // Particle geometry.
  const particlesGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pool.positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(pool.colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(pool.sizes, 1));
    return g;
  }, [pool]);

  return (
    <group>
      {/* Presynaptic bouton */}
      <mesh position={[PRESYNAPTIC_X, 0, 0]} scale={[0.55, 0.5, 0.55]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color={"#2a3454"}
          emissive={"#1e6cff"}
          emissiveIntensity={0.18}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Vesicles inside bouton */}
      {vesicles.map(([vx, vy, vz, vr], i) => (
        <mesh key={i} position={[vx, vy, vz]}>
          <sphereGeometry args={[vr, 12, 12]} />
          <meshStandardMaterial
            color={profile.color}
            emissive={profile.color}
            emissiveIntensity={0.4}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Postsynaptic spine (mushroom shape) */}
      <mesh position={[POSTSYNAPTIC_X + 0.08, 0, 0]} scale={[0.25, 0.25, 0.25]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={"#2a3454"}
          emissive={"#3d4a66"}
          emissiveIntensity={0.18}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      {/* Spine stem */}
      <mesh
        position={[POSTSYNAPTIC_X + 0.32, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[0.08, 0.4, 0.08]}
      >
        <cylinderGeometry args={[1, 1, 1, 16]} />
        <meshStandardMaterial color={"#2a3454"} roughness={0.6} />
      </mesh>

      {/* Action-potential wave: a small bright sphere traveling toward the bouton */}
      <ActionPotentialWave progress={apProgress} />

      {/* Particles */}
      <points ref={pointsRef} geometry={particlesGeom}>
        <pointsMaterial
          vertexColors
          size={0.05}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function ActionPotentialWave({ progress }: { progress: { current: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    if (progress.current < 0 || progress.current > 1) {
      m.visible = false;
      return;
    }
    m.visible = true;
    // From far left (-2.5) to bouton (-0.95) along x.
    const x = -2.5 + (-0.95 + 0.1 - -2.5) * progress.current;
    m.position.x = x;
    const intensity = (1 - Math.abs(progress.current - 0.5) * 2) * 0.6 + 0.4;
    (m.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity * 2.2;
    m.scale.setScalar(0.08 + intensity * 0.08);
  });
  return (
    <mesh ref={ref} position={[-2.5, 0, 0]} visible={false}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={"#fde047"}
        emissive={"#fde047"}
        emissiveIntensity={2.0}
        roughness={0.3}
      />
    </mesh>
  );
}
