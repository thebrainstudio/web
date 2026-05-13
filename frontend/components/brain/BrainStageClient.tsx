"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useBrainStageStore } from "@/store/useBrainStageStore";

/**
 * Phase 1 placeholder. A subtle icosahedron that breathes and slowly turns,
 * tinted in cyan-glow with brass rim light. Proves the persistent-canvas
 * wiring + Zustand-driven transform interpolation before Phase 2 swaps in
 * the real brain geometry.
 */
function PlaceholderMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetPos = useBrainStageStore((s) => s.targetPosition);
  const targetScale = useBrainStageStore((s) => s.targetScale);
  const targetRot = useBrainStageStore((s) => s.targetRotation);

  const tmpPos = useRef(new THREE.Vector3());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpEuler = useRef(new THREE.Euler());

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;

    // Lerp position and scale toward target.
    tmpPos.current.set(targetPos[0], targetPos[1], targetPos[2]);
    m.position.lerp(tmpPos.current, Math.min(1, delta * 4));

    const s = THREE.MathUtils.lerp(m.scale.x, targetScale, Math.min(1, delta * 4));
    m.scale.setScalar(s);

    // Slerp rotation toward target via quaternion.
    tmpEuler.current.set(targetRot[0], targetRot[1], targetRot[2]);
    tmpQuat.current.setFromEuler(tmpEuler.current);
    m.quaternion.slerp(tmpQuat.current, Math.min(1, delta * 3));

    // Idle breath rotation overlays the target.
    m.rotation.y += delta * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color={"#5cc8d6"}
        emissive={"#c9a961"}
        emissiveIntensity={0.18}
        roughness={0.4}
        metalness={0.1}
        wireframe={false}
      />
    </mesh>
  );
}

function CinematicLights() {
  return (
    <>
      <ambientLight intensity={0.35} color={"#1a2444"} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.1}
        color={"#5cc8d6"}
      />
      <directionalLight
        position={[-4, -2, -3]}
        intensity={0.6}
        color={"#c9a961"}
      />
    </>
  );
}

export default function BrainStageClient() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <CinematicLights />
        <PlaceholderMesh />
      </Suspense>
    </Canvas>
  );
}
