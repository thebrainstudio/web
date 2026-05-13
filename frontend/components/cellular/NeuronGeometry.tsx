"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { parseSwc, SWC_COLORS, type SwcParsed } from "@/lib/swcParser";

type Props = {
  /** Public URL to an SWC file (under /public/cellular/swc/). */
  src: string;
  /** Normalize the neuron's longest axis to this many Three.js units. */
  fitTo?: number;
  /** Slow auto-rotate. */
  autoRotate?: boolean;
  /** Group transform overrides if you want to position multiple neurons. */
  position?: [number, number, number];
};

/**
 * Render a real NeuroMorpho reconstruction as a single LineSegments mesh
 * with per-vertex colors. This is the cheapest faithful representation —
 * 1000-5000 segments at native resolution per neuron, sub-ms upload, and
 * the bloom pass on the canvas gives the lines a soft gloss.
 *
 * Tube geometry per-segment is left as a future polish: 5000 TubeGeometries
 * is a GPU disaster, and a merged-tube approach would need a custom
 * builder. LineSegments + bloom + emissive-tinted material gets us the
 * cinematic look without that effort.
 *
 * Soma nodes (SWC type = 1) are also rendered as bright spheres at their
 * positions — they're the visual anchor of any neuron portrait.
 */
export default function NeuronGeometry({
  src,
  fitTo = 2.0,
  autoRotate = true,
  position = [0, 0, 0],
}: Props) {
  const [parsed, setParsed] = useState<SwcParsed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let cancelled = false;
    setParsed(null);
    setError(null);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const p = parseSwc(text);
        setParsed(p);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Build the line geometry, somas array, and normalization transform.
  const built = useMemo(() => {
    if (!parsed) return null;
    const [cx, cy, cz] = parsed.centroid;
    const scale = parsed.span > 0 ? fitTo / parsed.span : 1;

    // LineSegments: 2 vertices per segment, with colors per vertex.
    const n = parsed.segments.length * 2;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    for (let i = 0; i < parsed.segments.length; i++) {
      const seg = parsed.segments[i];
      const ax = (seg.a.x - cx) * scale;
      const ay = (seg.a.y - cy) * scale;
      const az = (seg.a.z - cz) * scale;
      const bx = (seg.b.x - cx) * scale;
      const by = (seg.b.y - cy) * scale;
      const bz = (seg.b.z - cz) * scale;
      positions[i * 6 + 0] = ax;
      positions[i * 6 + 1] = ay;
      positions[i * 6 + 2] = az;
      positions[i * 6 + 3] = bx;
      positions[i * 6 + 4] = by;
      positions[i * 6 + 5] = bz;
      const [r, g, b] = SWC_COLORS[seg.type];
      colors[i * 6 + 0] = r;
      colors[i * 6 + 1] = g;
      colors[i * 6 + 2] = b;
      colors[i * 6 + 3] = r;
      colors[i * 6 + 4] = g;
      colors[i * 6 + 5] = b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Somas: every type=1 node becomes a sphere.
    const somas = parsed.nodes
      .filter((nd) => nd.type === "soma")
      .map((nd) => ({
        x: (nd.x - cx) * scale,
        y: (nd.y - cy) * scale,
        z: (nd.z - cz) * scale,
        radius: Math.max(0.035, nd.radius * scale * 1.6),
      }));

    return { geo, somas };
  }, [parsed, fitTo]);

  useFrame((_, delta) => {
    if (!autoRotate || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.18;
  });

  if (error) {
    return null; // silent fail; parent shows a fallback
  }
  if (!built) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Arbor: the line-segments network. */}
      <lineSegments geometry={built.geo}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.92}
          depthWrite={false}
          linewidth={1}
        />
      </lineSegments>

      {/* Somas as bright spheres. */}
      {built.somas.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <sphereGeometry args={[s.radius, 24, 24]} />
          <meshStandardMaterial
            color={"#fde047"}
            emissive={"#fde047"}
            emissiveIntensity={0.6}
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  );
}
