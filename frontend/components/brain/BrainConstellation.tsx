"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { regions, type RegionId } from "@/lib/regions";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * Refined brain visualization.
 *
 * Visual layers, near-to-far:
 *   1. A single soft elliptical silhouette curve in brass — hints at the
 *      brain's boundary without filling the frame.
 *   2. Faint connection segments between every pair of regions on the
 *      same hemisphere, drawn once with low opacity. The "constellation."
 *   3. The 20 region nodes — small, smooth icosahedrons that scale and
 *      glow with activation. Each gets a subtle halo billboard so an
 *      active region reads as light, not as a bigger ball.
 *   4. A single soft point at the centroid emitting an inner glow that
 *      lifts the whole composition. Cinematic, not procedural-noisy.
 *
 * No more bumpy procedural sulci. The brain doesn't pretend to be
 * anatomy; it is data, beautifully arranged.
 */

const COLOR_IDLE = new THREE.Color("#1a2444");
const COLOR_LOW = new THREE.Color("#5cc8d6");
const COLOR_MID = new THREE.Color("#e8a04a");
const COLOR_HIGH = new THREE.Color("#8b3a3a");
const COLOR_BRASS = new THREE.Color("#c9a961");

function activationColor(a: number, out: THREE.Color) {
  if (a <= 0.01) return out.copy(COLOR_IDLE);
  if (a < 0.5) return out.copy(COLOR_LOW).lerp(COLOR_MID, a / 0.5);
  return out.copy(COLOR_MID).lerp(COLOR_HIGH, (a - 0.5) / 0.5);
}

// --- Silhouette ------------------------------------------------------------

function BrainSilhouette() {
  // Two faint brass curves: an upper hemisphere arc and an inferior
  // (cerebellum) hint. Together they imply a brain without rendering one.
  const upper = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * Math.PI * 2;
      const x = Math.cos(t) * 1.05;
      const y = Math.sin(t) * 0.78 + 0.08;
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  const cerebellum = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 32; i++) {
      const t = Math.PI + (i / 32) * Math.PI;
      const x = Math.cos(t) * 0.35;
      const y = Math.sin(t) * 0.22 - 0.74;
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  return (
    <>
      <line>
        <primitive object={upper} attach="geometry" />
        <lineBasicMaterial color={COLOR_BRASS} transparent opacity={0.18} />
      </line>
      <line>
        <primitive object={cerebellum} attach="geometry" />
        <lineBasicMaterial color={COLOR_BRASS} transparent opacity={0.14} />
      </line>
    </>
  );
}

// --- Connection lines ------------------------------------------------------

function makeConnectionGeometry(): THREE.BufferGeometry {
  // Connect every pair of regions on the same hemisphere within radius 0.95.
  // One line for the whole thing; minimal geometry, low GPU cost.
  const verts: number[] = [];
  for (let i = 0; i < regions.length; i++) {
    for (let j = i + 1; j < regions.length; j++) {
      const a = regions[i];
      const b = regions[j];
      // Skip cross-hemisphere by side of midline (x).
      const sameHemi = Math.sign(a.position[0]) === Math.sign(b.position[0]);
      const midline = Math.abs(a.position[0]) < 0.15 || Math.abs(b.position[0]) < 0.15;
      if (!sameHemi && !midline) continue;

      const dx = a.position[0] - b.position[0];
      const dy = a.position[1] - b.position[1];
      const dz = a.position[2] - b.position[2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d > 0.95) continue;
      verts.push(
        a.position[0], a.position[1], a.position[2],
        b.position[0], b.position[1], b.position[2],
      );
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(verts, 3),
  );
  return geo;
}

const CONNECTION_GEO = makeConnectionGeometry();

function Connections() {
  return (
    <lineSegments>
      <primitive object={CONNECTION_GEO} attach="geometry" />
      <lineBasicMaterial
        color={COLOR_BRASS}
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// --- Halo billboard --------------------------------------------------------

/**
 * Per-node radial sprite. The texture is a CPU-baked radial gradient so we
 * don't need to ship a texture file. The sprite's color and scale ride
 * the same activation as the underlying node.
 */
function makeRadialTexture(): THREE.Texture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,255,255,0.6)");
  grad.addColorStop(0.55, "rgba(255,255,255,0.15)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// --- Inner glow ------------------------------------------------------------

function InnerGlow() {
  // A single billboard at the centroid. Scales with the brightest region
  // (we just sample the store's targetActivations on each frame).
  const ref = useRef<THREE.Sprite>(null);
  const max = useRef(0);
  const targetActivations = useBrainStageStore((s) => s.targetActivations);
  const tex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return makeRadialTexture();
  }, []);

  useFrame((_, delta) => {
    let m = 0;
    for (const v of Object.values(targetActivations)) {
      if ((v ?? 0) > m) m = v ?? 0;
    }
    max.current = THREE.MathUtils.lerp(max.current, m, Math.min(1, delta * 3));
    const s = ref.current;
    if (s) {
      const scale = 1.4 + max.current * 1.6;
      s.scale.setScalar(scale);
      const mat = s.material as THREE.SpriteMaterial;
      mat.opacity = 0.08 + max.current * 0.35;
    }
  });

  if (!tex) return null;
  return (
    <sprite ref={ref} position={[0, 0, -0.5]}>
      <spriteMaterial
        map={tex}
        color={"#5cc8d6"}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

// --- Region nodes ----------------------------------------------------------

type NodeState = {
  id: RegionId;
  mesh: THREE.Mesh | null;
  material: THREE.MeshStandardMaterial | null;
  haloSprite: THREE.Sprite | null;
  haloMat: THREE.SpriteMaterial | null;
  current: number;
};

export default function BrainConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useRef<NodeState[]>([]);

  if (nodes.current.length === 0) {
    nodes.current = regions.map((r) => ({
      id: r.id,
      mesh: null,
      material: null,
      haloSprite: null,
      haloMat: null,
      current: 0,
    }));
  }

  const haloTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return makeRadialTexture();
  }, []);

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
      const ns = THREE.MathUtils.lerp(
        g.scale.x,
        targetScale,
        Math.min(1, delta * 3),
      );
      g.scale.setScalar(ns);
      tmpEuler.set(targetRot[0], targetRot[1], targetRot[2]);
      tmpQuat.setFromEuler(tmpEuler);
      g.quaternion.slerp(tmpQuat, Math.min(1, delta * 2.5));
      g.rotation.y += delta * 0.05;
    }

    for (const n of nodes.current) {
      const target = targetActivations[n.id] ?? 0;
      n.current = THREE.MathUtils.lerp(n.current, target, Math.min(1, delta * 3.5));

      const mat = n.material;
      if (mat) {
        activationColor(n.current, tmpColor);
        mat.color.lerp(tmpColor, 0.4);
        mat.emissive.lerp(tmpColor, 0.4);
        mat.emissiveIntensity = 0.2 + n.current * 1.6;
      }

      const m = n.mesh;
      if (m) {
        const targetSize = 0.028 + n.current * 0.038;
        const cs = THREE.MathUtils.lerp(m.scale.x, targetSize, 0.2);
        m.scale.setScalar(cs);
      }

      const halo = n.haloSprite;
      const hmat = n.haloMat;
      if (halo && hmat) {
        const haloScale = 0.05 + n.current * 0.32;
        halo.scale.setScalar(haloScale);
        // Halo color rides activation too.
        activationColor(n.current, tmpColor);
        hmat.color.copy(tmpColor);
        hmat.opacity = 0.0 + n.current * 0.75;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <BrainSilhouette />
      <Connections />
      <InnerGlow />
      {regions.map((r, i) => (
        <group key={r.id} position={r.position}>
          {/* Halo billboard — invisible when idle, blooms with activation. */}
          {haloTex && (
            <sprite
              ref={(s) => {
                const n = nodes.current[i];
                if (!n) return;
                n.haloSprite = s;
                if (s) n.haloMat = s.material as THREE.SpriteMaterial;
              }}
              scale={[0.05, 0.05, 0.05]}
            >
              <spriteMaterial
                map={haloTex}
                color={COLOR_LOW}
                transparent
                opacity={0}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
          )}
          {/* The dot itself. */}
          <mesh
            ref={(m) => {
              const n = nodes.current[i];
              if (!n) return;
              n.mesh = m;
              if (m && !n.material) {
                n.material = m.material as THREE.MeshStandardMaterial;
              }
            }}
          >
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial
              color={COLOR_IDLE}
              emissive={COLOR_IDLE}
              emissiveIntensity={0.1}
              roughness={0.32}
              metalness={0.25}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
