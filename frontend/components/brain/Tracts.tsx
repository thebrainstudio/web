"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useConnectomeState } from "@/lib/connectomeState";
import { TRACTS, TRACT_ORDER, type TractId } from "@/lib/tracts";
import { regionById } from "@/lib/regions";

/**
 * White-matter tract overlay. Mounts inside BrainAnatomy's group so
 * it inherits the brain's position/scale/rotation/slow-rotation
 * transform. Each tract is a quadratic Bezier curve between the two
 * canonical region positions in lib/regions.ts, swept into a tube
 * by TubeGeometry. Opacity lerps toward 1 when the tract is in the
 * visible set and toward 0 otherwise — the materials are pre-created
 * and kept around so toggling on a tract twice doesn't rebuild
 * geometry.
 *
 * Honesty note: this is stylized geometry, not real diffusion-MRI
 * tractography. The Atlas page disclosure says so directly. Adding
 * real HCP1065 / DSI Studio tract meshes would replace the curve-
 * sampling here with a GLB loader; the visible-tract toggling
 * architecture would stay the same.
 */

const TUBE_SEGMENTS = 48;
const TUBE_RADIUS = 0.014;
const TUBE_RADIAL_SEGMENTS = 10;

/** Brass with a touch of warmth. Matches the locked palette. */
const TRACT_COLOR = new THREE.Color("#c9a961");
const TRACT_EMISSIVE = new THREE.Color("#e8b96b");

function buildTubeGeometry(
  start: THREE.Vector3,
  end: THREE.Vector3,
): THREE.TubeGeometry {
  // Push the midpoint outward along the average normal of the two
  // endpoints so the curve arcs outside the brain mesh rather than
  // cutting through it. The brain is roughly spherical at scale 1
  // around the origin; the radial direction approximates the
  // surface normal at the midpoint.
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const radial = mid.clone();
  // Avoid divide-by-zero at exact origin.
  if (radial.lengthSq() < 1e-6) radial.set(0, 1, 0);
  radial.normalize();
  // Bulge outward by a fraction of the chord length so longer tracts
  // get more curve than shorter ones.
  const chordLen = start.distanceTo(end);
  const bulge = 0.25 + 0.3 * chordLen;
  const control = mid.clone().addScaledVector(radial, bulge);
  const curve = new THREE.QuadraticBezierCurve3(start, control, end);
  return new THREE.TubeGeometry(
    curve,
    TUBE_SEGMENTS,
    TUBE_RADIUS,
    TUBE_RADIAL_SEGMENTS,
    false,
  );
}

type TractRenderEntry = {
  id: TractId;
  geometry: THREE.TubeGeometry;
  material: THREE.MeshStandardMaterial;
};

export default function Tracts() {
  // Memoize per-tract geometry + material. Built once on mount —
  // region positions don't change at runtime.
  const entries = useMemo<TractRenderEntry[]>(() => {
    return TRACT_ORDER.map((id) => {
      const tract = TRACTS[id];
      const [a, b] = tract.endpoints;
      const r1 = regionById[a];
      const r2 = regionById[b];
      const start = new THREE.Vector3(...r1.position);
      const end = new THREE.Vector3(...r2.position);
      const geometry = buildTubeGeometry(start, end);
      const material = new THREE.MeshStandardMaterial({
        color: TRACT_COLOR,
        emissive: TRACT_EMISSIVE,
        emissiveIntensity: 0.9,
        roughness: 0.45,
        metalness: 0.2,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      return { id, geometry, material };
    });
  }, []);

  // Mesh refs for per-tract opacity tweening.
  const meshRefs = useRef<Record<TractId, THREE.Mesh | null>>(
    {} as Record<TractId, THREE.Mesh | null>,
  );

  // Lerp opacity toward target per frame. Reading the store from
  // getState() inside useFrame avoids subscribing this component to
  // every Zustand update — the only re-render trigger is mount.
  useFrame((_, delta) => {
    const { visibleTracts } = useConnectomeState.getState();
    for (const e of entries) {
      const target = visibleTracts.has(e.id) ? 1 : 0;
      const cur = e.material.opacity;
      const next = THREE.MathUtils.lerp(cur, target, Math.min(1, delta * 4));
      e.material.opacity = next;
      e.material.emissiveIntensity = 0.4 + next * 0.9;
    }
  });

  return (
    <group>
      {entries.map((e) => (
        <mesh
          key={e.id}
          ref={(m) => {
            meshRefs.current[e.id] = m;
          }}
          geometry={e.geometry}
          material={e.material}
          renderOrder={2}
        />
      ))}
    </group>
  );
}
