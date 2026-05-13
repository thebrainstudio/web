"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Anatomically-faithful synapse model. Visible structures:
 *
 *   - Axon stub (far left) along which the action potential travels.
 *   - Presynaptic bouton — irregular, slightly translucent tissue.
 *   - Mitochondrion inside the bouton (elongated ovoid).
 *   - Active zone — darker patch on the bouton's cleft face where
 *     vesicles dock.
 *   - Vesicle cluster — docked vesicles (closer to the active zone)
 *     plus a reserve pool floating behind them. Vesicles emit when
 *     the AP arrives.
 *   - Synaptic cleft — faint translucent slab of extracellular space.
 *   - Postsynaptic spine — irregular mushroom (head + neck + dendrite
 *     shaft).
 *   - Postsynaptic density (PSD) — the thicker, darker patch on the
 *     spine's cleft face where receptors live.
 *
 * Particles emerge from the active zone (not the bouton center),
 * traverse the cleft, and dim as they make PSD contact. Each
 * neurotransmitter profile changes color, count, travel time, and
 * release pattern (burst vs. trickle) — the educational point is
 * that the same mechanics produce very different downstream effects.
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
  travel: number;
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
  triggerCount: number;
  speed?: number;
};

type Particle = {
  active: boolean;
  start: number;
  travel: number;
  ox: number; oy: number; oz: number;
  tx: number; ty: number; tz: number;
};

// Geometry constants (kept centralized so structure stays coherent).
const BOUTON_CENTER_X = -0.85;
const BOUTON_RADIUS = 0.55;
const ACTIVE_ZONE_X = BOUTON_CENTER_X + BOUTON_RADIUS * 0.78;
const CLEFT_LEFT_X = ACTIVE_ZONE_X + 0.02;
const CLEFT_RIGHT_X = CLEFT_LEFT_X + 0.22;
const PSD_X = CLEFT_RIGHT_X;
const SPINE_HEAD_X = PSD_X + 0.22;
const TISSUE_COLOR = "#3a4264";
const TISSUE_DARK = "#1c2440";

export default function Synapse({ nt, triggerCount, speed = 1 }: Props) {
  const profile = NEUROTRANSMITTERS[nt];
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useRef<Particle[]>([]);
  const elapsed = useRef(0);
  const lastTrigger = useRef(triggerCount);
  const apProgress = useRef(-1);
  const vesicleGlow = useRef(0);
  const dockedMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const reserveMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  // Bouton + spine geometries with vertex noise — they should not be
  // perfect spheres, real boutons are lumpy.
  const boutonGeom = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(BOUTON_RADIUS, 4);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const n = 1 + (Math.sin(x * 6) * Math.cos(y * 5) + Math.sin(z * 7)) * 0.05;
      pos.setXYZ(i, x * n, y * n, z * n);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const spineGeom = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.28, 4);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const n = 1 + (Math.sin(x * 7) * Math.cos(y * 6) + Math.sin(z * 5)) * 0.07;
      pos.setXYZ(i, x * n, y * n, z * n);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  // Docked vesicles (close to the active zone) and reserve-pool vesicles
  // (clustered behind them, deeper in the bouton).
  const dockedVesicles = useMemo(() => {
    const arr: [number, number, number, number][] = [];
    const dockedCount = 14;
    for (let i = 0; i < dockedCount; i++) {
      const ring = i / dockedCount;
      const ang = ring * Math.PI * 2;
      const r = 0.08 + Math.random() * 0.06;
      const vx = ACTIVE_ZONE_X - 0.06 - Math.random() * 0.04;
      const vy = Math.cos(ang) * r;
      const vz = Math.sin(ang) * r;
      arr.push([vx, vy, vz, 0.022 + Math.random() * 0.008]);
    }
    return arr;
  }, []);

  const reserveVesicles = useMemo(() => {
    const arr: [number, number, number, number][] = [];
    for (let i = 0; i < 22; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      const r = 0.08 + Math.random() * 0.16;
      const vx = BOUTON_CENTER_X + Math.cos(u) * Math.sin(v) * r * 0.7 - 0.05;
      const vy = Math.cos(v) * r * 0.55;
      const vz = Math.sin(u) * Math.sin(v) * r * 0.55;
      arr.push([vx, vy, vz, 0.02 + Math.random() * 0.008]);
    }
    return arr;
  }, []);

  // Particle pool.
  const pool = useMemo(() => {
    const POOL = 160;
    const positions = new Float32Array(POOL * 3);
    const colors = new Float32Array(POOL * 3);
    const sizes = new Float32Array(POOL);
    for (let i = 0; i < POOL; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -10;
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

  useEffect(() => {
    if (triggerCount === lastTrigger.current) return;
    lastTrigger.current = triggerCount;
    apProgress.current = 0;
  }, [triggerCount]);

  useFrame((_, delta) => {
    elapsed.current += delta * speed;

    // AP travels axon, arrives at bouton.
    if (apProgress.current >= 0 && apProgress.current < 1) {
      apProgress.current = Math.min(1, apProgress.current + delta * speed / 0.25);
      // Vesicle emissive ramps up as AP arrives.
      vesicleGlow.current = Math.min(1, vesicleGlow.current + delta * speed * 4);
      if (apProgress.current >= 1) {
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
          // Origin: jitter around the active zone, not the bouton center.
          p.ox = (Math.random() - 0.5) * 0.18;
          p.oy = (Math.random() - 0.5) * 0.22;
          p.oz = (Math.random() - 0.5) * 0.18;
          p.tx = (Math.random() - 0.5) * 0.18;
          p.ty = (Math.random() - 0.5) * 0.16;
          p.tz = (Math.random() - 0.5) * 0.14;
          released++;
        }
      }
    } else {
      // Decay glow after release.
      vesicleGlow.current = Math.max(0, vesicleGlow.current - delta * speed * 1.2);
    }

    // Push vesicle glow to materials.
    const glow = 0.18 + vesicleGlow.current * 0.9;
    for (const m of dockedMatsRef.current) {
      if (m) m.emissiveIntensity = glow;
    }
    for (const m of reserveMatsRef.current) {
      if (m) m.emissiveIntensity = glow * 0.55;
    }

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
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const startX = ACTIVE_ZONE_X + p.ox * 0.1;
      const endX = PSD_X - 0.02 + p.tx * 0.1;
      const x = startX + (endX - startX) * e;
      const y = p.oy + (p.ty - p.oy) * e + Math.sin(t * Math.PI) * 0.04;
      const z = p.oz + (p.tz - p.oz) * e;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      // Size fades on PSD contact (dim as they bind).
      const dimming = t > 0.85 ? (1 - (t - 0.85) / 0.15) : 1;
      siz[i] = (0.05 + (1 - Math.abs(t - 0.5) * 2) * 0.04) * dimming;
      dirtyPos = true;
      dirtySiz = true;
    }
    if (pointsRef.current) {
      const g = pointsRef.current.geometry;
      if (dirtyPos) (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      if (dirtySiz) (g.attributes.size as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  const particlesGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pool.positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(pool.colors, 3));
    g.setAttribute("size", new THREE.BufferAttribute(pool.sizes, 1));
    return g;
  }, [pool]);

  // Reset material refs each render.
  dockedMatsRef.current = [];
  reserveMatsRef.current = [];

  return (
    <group>
      {/* Axon stub (presynaptic terminal stalk) */}
      <mesh
        position={[BOUTON_CENTER_X - 0.85, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.085, 0.085, 1.1, 18]} />
        <meshStandardMaterial
          color={TISSUE_COLOR}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Action-potential bright bead traveling down the axon */}
      <ActionPotentialBead progress={apProgress} />

      {/* Presynaptic bouton — irregular, tissue-textured */}
      <mesh geometry={boutonGeom} position={[BOUTON_CENTER_X, 0, 0]}>
        <meshPhysicalMaterial
          color={TISSUE_COLOR}
          emissive={"#1e3a6e"}
          emissiveIntensity={0.08}
          roughness={0.45}
          metalness={0.05}
          clearcoat={0.4}
          clearcoatRoughness={0.6}
          transmission={0.12}
          thickness={0.4}
        />
      </mesh>

      {/* Mitochondrion inside the bouton — elongated ovoid */}
      <mesh
        position={[BOUTON_CENTER_X - 0.16, 0.06, 0.05]}
        rotation={[0, 0, 0.35]}
        scale={[0.22, 0.085, 0.085]}
      >
        <sphereGeometry args={[1, 22, 14]} />
        <meshStandardMaterial
          color={"#5a4030"}
          emissive={"#3a2418"}
          emissiveIntensity={0.18}
          roughness={0.55}
        />
      </mesh>

      {/* Active zone — dark patch on the bouton's cleft face */}
      <mesh
        position={[ACTIVE_ZONE_X + 0.005, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <circleGeometry args={[0.16, 28]} />
        <meshStandardMaterial
          color={TISSUE_DARK}
          roughness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Docked vesicles — closer to the active zone */}
      {dockedVesicles.map(([vx, vy, vz, vr], i) => (
        <mesh key={`d-${i}`} position={[vx, vy, vz]}>
          <sphereGeometry args={[vr, 14, 14]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) dockedMatsRef.current.push(m);
            }}
            color={profile.color}
            emissive={profile.color}
            emissiveIntensity={0.25}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Reserve-pool vesicles — deeper in the bouton */}
      {reserveVesicles.map(([vx, vy, vz, vr], i) => (
        <mesh key={`r-${i}`} position={[vx, vy, vz]}>
          <sphereGeometry args={[vr, 12, 12]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) reserveMatsRef.current.push(m);
            }}
            color={profile.color}
            emissive={profile.color}
            emissiveIntensity={0.12}
            roughness={0.35}
          />
        </mesh>
      ))}

      {/* Synaptic cleft — faint translucent slab in the gap */}
      <mesh
        position={[(CLEFT_LEFT_X + CLEFT_RIGHT_X) / 2, 0, 0]}
      >
        <boxGeometry args={[CLEFT_RIGHT_X - CLEFT_LEFT_X, 0.55, 0.55]} />
        <meshStandardMaterial
          color={"#5cc8d6"}
          emissive={"#1a4a55"}
          emissiveIntensity={0.05}
          transparent
          opacity={0.05}
          depthWrite={false}
        />
      </mesh>

      {/* Postsynaptic density (PSD) — dark thick patch on the spine's cleft face */}
      <mesh
        position={[PSD_X - 0.005, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <circleGeometry args={[0.18, 28]} />
        <meshStandardMaterial
          color={"#0b1024"}
          emissive={"#142046"}
          emissiveIntensity={0.12}
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Spine head — irregular mushroom */}
      <mesh geometry={spineGeom} position={[SPINE_HEAD_X, 0, 0]}>
        <meshPhysicalMaterial
          color={TISSUE_COLOR}
          emissive={"#1e3a6e"}
          emissiveIntensity={0.08}
          roughness={0.5}
          metalness={0.05}
          clearcoat={0.35}
          clearcoatRoughness={0.6}
          transmission={0.1}
          thickness={0.3}
        />
      </mesh>

      {/* Spine neck — thin stalk from head to dendrite */}
      <mesh
        position={[SPINE_HEAD_X + 0.28, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.055, 0.07, 0.34, 18]} />
        <meshStandardMaterial
          color={TISSUE_COLOR}
          roughness={0.55}
        />
      </mesh>

      {/* Dendrite shaft — thick parent process the spine sits on */}
      <mesh
        position={[SPINE_HEAD_X + 0.62, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.18, 0.18, 0.55, 22]} />
        <meshStandardMaterial
          color={TISSUE_COLOR}
          emissive={"#1e3a6e"}
          emissiveIntensity={0.05}
          roughness={0.55}
        />
      </mesh>

      {/* Neurotransmitter particles */}
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

function ActionPotentialBead({ progress }: { progress: { current: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    if (progress.current < 0 || progress.current > 1) {
      m.visible = false;
      return;
    }
    m.visible = true;
    const startX = BOUTON_CENTER_X - 1.35;
    const endX = BOUTON_CENTER_X - BOUTON_RADIUS * 0.85;
    m.position.x = startX + (endX - startX) * progress.current;
    const intensity = (1 - Math.abs(progress.current - 0.5) * 2) * 0.7 + 0.5;
    (m.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity * 3.0;
    m.scale.setScalar(0.075 + intensity * 0.06);
  });
  return (
    <mesh ref={ref} position={[BOUTON_CENTER_X - 1.35, 0, 0]} visible={false}>
      <sphereGeometry args={[1, 18, 18]} />
      <meshStandardMaterial
        color={"#fde047"}
        emissive={"#fde047"}
        emissiveIntensity={2.5}
        roughness={0.3}
      />
    </mesh>
  );
}
