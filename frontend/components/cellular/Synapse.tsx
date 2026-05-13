"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  NEUROTRANSMITTERS,
  type Neurotransmitter,
  type NTBehavior,
  devicePerfClass,
} from "@/lib/neurotransmitters";

// Re-export so existing imports keep working.
export { NEUROTRANSMITTERS };
export type { Neurotransmitter };

/**
 * Cinematic synapse. Driven by a single `phase` state machine:
 *
 *   idle                 — vesicles drift, structures breathe, camera figure-8
 *   travelling-ap        — pulse races down the axon shader
 *   ca-influx            — bouton membrane glows cyan, vesicles "prime"
 *   fusing               — staggered vesicle approach + expand-fade
 *   crossing             — instanced particles diffuse forward across cleft
 *   binding              — receptor flashes light up the PSD; spine responds
 *   afterglow            — held quiet state, cleft glow lingers per NT
 *
 * Per-neurotransmitter timing and palette come from
 * `lib/neurotransmitters.ts`. The visual differences between transmitters
 * (glutamate excitatory, GABA inhibitory, dopamine modulatory, etc.) are
 * driven by `postSynaptic` in that config.
 */

type Props = {
  nt: Neurotransmitter;
  /** Increment to fire an action potential. */
  triggerCount: number;
  /** Playback rate (0.25, 0.5, 1, 2). */
  speed?: number;
};

// ────────────────────────── geometry constants ──────────────────────────

const AXON_LEFT_X = -2.3;
const BOUTON_CENTER_X = -0.85;
const BOUTON_RADIUS = 0.55;
const ACTIVE_ZONE_X = BOUTON_CENTER_X + BOUTON_RADIUS * 0.78;
const CLEFT_LEFT_X = ACTIVE_ZONE_X + 0.02;
const CLEFT_WIDTH = 0.18;
const CLEFT_RIGHT_X = CLEFT_LEFT_X + CLEFT_WIDTH;
const PSD_X = CLEFT_RIGHT_X;
const SPINE_HEAD_X = PSD_X + 0.24;
const DENDRITE_X = SPINE_HEAD_X + 0.58;
const TISSUE_COLOR = "#5a6494";

// ────────────────────────── lathe profile builders ──────────────────────

/**
 * Hand-tuned profile points for the presynaptic bouton. The lathe revolves
 * around the X axis (we rotate the resulting geometry 90° on Z). Each
 * point is (radius, x-along-axon-direction). The shape:
 *
 *   axon-radius → swelling → flattened active-zone face
 */
function boutonProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  // axon-side opening
  pts.push(new THREE.Vector2(0.0, -0.7));
  pts.push(new THREE.Vector2(0.085, -0.7));
  // gentle taper into the swelling
  pts.push(new THREE.Vector2(0.11, -0.55));
  pts.push(new THREE.Vector2(0.18, -0.4));
  pts.push(new THREE.Vector2(0.32, -0.25));
  pts.push(new THREE.Vector2(0.46, -0.08));
  pts.push(new THREE.Vector2(0.54, 0.08));
  pts.push(new THREE.Vector2(0.55, 0.22));
  pts.push(new THREE.Vector2(0.52, 0.36));
  pts.push(new THREE.Vector2(0.45, 0.48));
  // slight flattening at the active-zone face
  pts.push(new THREE.Vector2(0.34, 0.55));
  pts.push(new THREE.Vector2(0.22, 0.575));
  pts.push(new THREE.Vector2(0.0, 0.58));
  return pts;
}

/**
 * Mushroom-shaped postsynaptic spine. Narrow base meets the dendrite at
 * the right; expands into a head facing the cleft (left, here flipped).
 */
function spineProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  // PSD face (faces the cleft)
  pts.push(new THREE.Vector2(0.0, -0.34));
  pts.push(new THREE.Vector2(0.21, -0.33));
  pts.push(new THREE.Vector2(0.3, -0.27));
  // bulbous head
  pts.push(new THREE.Vector2(0.34, -0.18));
  pts.push(new THREE.Vector2(0.34, -0.05));
  pts.push(new THREE.Vector2(0.3, 0.06));
  // pinch into the neck
  pts.push(new THREE.Vector2(0.18, 0.16));
  pts.push(new THREE.Vector2(0.075, 0.24));
  // thin neck
  pts.push(new THREE.Vector2(0.07, 0.36));
  pts.push(new THREE.Vector2(0.075, 0.48));
  // flare back out at the dendrite junction
  pts.push(new THREE.Vector2(0.11, 0.56));
  pts.push(new THREE.Vector2(0.0, 0.58));
  return pts;
}

// ────────────────────────── shaders ──────────────────────────

/**
 * Axon shader. A travelling pulse rides along the tube. The pulse is a
 * Gaussian band; behind it, a refractory period leaves a faint dimming
 * that recovers over time.
 *
 *   uPulse   ∈ [-0.05, 1.05]   normalized position of pulse center
 *                              (negative = not yet fired, >1 = passed)
 *   uPulseStrength             1.0 during travel, fades to 0 in idle
 *   uRefractoryEnd             time since the pulse passed each point —
 *                              packed into a single global elapsed
 *                              counter; shader recovers exponentially
 *   uElapsed                   global elapsed seconds
 *   uAxonRange                 (leftX, rightX) world-space ends, used to
 *                              map vWorldPos to t∈[0,1]
 */
const axonVertex = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const axonFragment = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
uniform float uPulse;
uniform float uPulseStrength;
uniform vec2  uAxonRange;
uniform vec3  uTissueColor;
uniform vec3  uPulseColor;
uniform vec3  uRimColor;
uniform vec3  uCameraPos;
uniform float uElapsed;
uniform float uPulsePassed; // elapsed time when pulse reached t=0..1

void main() {
  float t = clamp((vWorldPos.x - uAxonRange.x) / (uAxonRange.y - uAxonRange.x), 0.0, 1.0);

  // Gaussian falloff around pulse center.
  float d = (t - uPulse);
  float band = exp(-d * d * 320.0) * uPulseStrength;

  // Colour through the pulse: leading edge near-white, centre amber, trailing dim.
  vec3 leading = vec3(1.0, 0.92, 0.75);
  vec3 trailing = uPulseColor * 0.6;
  vec3 pulseTint = mix(trailing, leading, smoothstep(-0.02, 0.02, d));

  // Refractory dimming: if pulse has already passed this point, we're
  // recovering. Use uPulsePassed (elapsed-when-pulse-reached-here) as a
  // simple "how long ago" proxy.
  float passedAgo = uElapsed - mix(uPulsePassed - 0.6, uPulsePassed, t);
  float refractory = exp(-max(passedAgo, 0.0) * 5.0) * step(0.0, uPulse - t) * uPulseStrength * 0.35;

  // Fresnel rim
  vec3 V = normalize(uCameraPos - vWorldPos);
  float fres = pow(1.0 - max(dot(normalize(vNormal), V), 0.0), 2.2);
  vec3 rim = uRimColor * fres * 0.6;

  vec3 base = uTissueColor;
  vec3 col = base - vec3(0.05) * refractory + rim;
  col += pulseTint * band * 1.4;

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Membrane shader (bouton + spine). Standard-ish:
 *   - subtle base tissue color
 *   - Fresnel rim
 *   - a Ca²⁺ glow uniform that briefly stains the bouton cyan when AP arrives
 *   - a depolarization-wave uniform that pushes brightness from spine head
 *     down through the spine neck and out into the dendrite
 *   - postSynapticTint uniform: rises during binding, modulated per NT
 */
const tissueVertex = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const tissueFragment = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
uniform vec3  uBaseColor;
uniform vec3  uRimColor;
uniform vec3  uCameraPos;
uniform vec3  uCalciumColor;
uniform float uCalcium;          // 0..1
uniform vec3  uDepolColor;
uniform float uDepol;            // 0..1
uniform float uWaveX;            // world-x of the depol wave front
uniform float uWaveAmplitude;    // 0..1, how much the wave bumps brightness
uniform float uRimBoost;         // multiplier on rim (Norepinephrine sharpens)
uniform float uBreathing;        // 0..1 small slow oscillation
uniform float uActiveZoneX;      // for bouton, where the active zone sits
uniform float uActiveZoneBoost;  // brightens the active zone during fusion
uniform float uHyperpolarize;    // 0..1 — for GABA, darkens the membrane

void main() {
  vec3 V = normalize(uCameraPos - vWorldPos);
  vec3 N = normalize(vNormal);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 1.6);
  vec3 rim = uRimColor * fres * (0.9 + 0.55 * uRimBoost);

  // Two fake directional lights so the shader has Lambertian shading
  // independent of scene lights (it's a fully custom shader).
  vec3 keyDir = normalize(vec3(-0.6, 0.7, 0.7));
  vec3 rimDir = normalize(vec3(0.5, -0.4, -0.3));
  float diffKey = max(dot(N, keyDir), 0.0);
  float diffRim = max(dot(N, rimDir), 0.0);
  vec3 lit = uBaseColor * (0.55 + 1.1 * diffKey)
           + uRimColor * 0.18 * diffRim;
  // Sub-surface approximation: a faint inner glow on the dark side
  float sss = clamp(dot(N, -keyDir), 0.0, 1.0) * 0.2;

  vec3 base = lit * (1.0 + 0.03 * uBreathing) + uBaseColor * sss;

  // Calcium influx on bouton: cyan tint, brightest near the active zone face.
  float az = exp(-pow((vWorldPos.x - uActiveZoneX), 2.0) * 12.0);
  vec3 caTint = uCalciumColor * (uCalcium * 0.55 + uCalcium * az * 0.6);

  // Active zone brightening during fusion (separate from calcium).
  vec3 azTint = uRimColor * uActiveZoneBoost * az * 0.5;

  // Depolarization wave on spine: bright band sweeping along X.
  float waveD = abs(vWorldPos.x - uWaveX);
  float waveBand = exp(-waveD * waveD * 26.0) * uWaveAmplitude;
  vec3 depolTint = uDepolColor * (uDepol * 0.35 + waveBand * 0.9);

  // Hyperpolarization (GABA): darken membrane and add subtle cyan ripple from
  // the receptor face.
  float hyperRipple = sin((vWorldPos.x - uActiveZoneX) * 14.0 - 6.0 * uHyperpolarize) * 0.5 + 0.5;
  vec3 hyperTint = uRimColor * uHyperpolarize * 0.18 * (0.6 + 0.4 * hyperRipple);
  base *= 1.0 - 0.35 * uHyperpolarize;

  vec3 col = base + rim + caTint + azTint + depolTint + hyperTint;
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Vesicle shader. Soft glowing sphere — translucent membrane with a strong
 * Fresnel rim glow in the transmitter's color. The "primed" pulse comes
 * from a uniform driven by calcium influx.
 */
const vesicleVertex = tissueVertex;
const vesicleFragment = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
uniform vec3  uInteriorColor;
uniform vec3  uRimColor;
uniform vec3  uCameraPos;
uniform float uGlow;       // 0..1 calcium-driven priming
uniform float uIdlePulse;  // 0..1 slow breathing
uniform float uAlpha;

void main() {
  vec3 V = normalize(uCameraPos - vWorldPos);
  vec3 N = normalize(vNormal);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 1.2);
  float load = 0.85 + 0.4 * uIdlePulse + 0.7 * uGlow;
  vec3 rim = uRimColor * fres * load;
  // direct face-on contribution so vesicles don't go invisible head-on
  float face = max(0.0, dot(N, V));
  vec3 interiorLit = uInteriorColor * (1.0 + 0.4 * uIdlePulse) + uRimColor * 0.35 * face * load;

  vec3 col = interiorLit + rim;
  gl_FragColor = vec4(col, uAlpha);
}
`;

/**
 * Cleft volumetric shader. A faint translucent slab that brightens during
 * a release event. The brightening is driven by `uActivity` (count of
 * active particles in the cleft, normalised) plus `uForward` for the
 * left-to-right brightness sweep.
 */
const cleftFragment = /* glsl */ `
varying vec3 vWorldPos;
uniform vec3  uColor;
uniform float uActivity;
uniform float uForward;       // 0..1, sweeps the brightness across cleft
uniform vec2  uCleftRange;    // (leftX, rightX)
uniform float uBaseOpacity;

void main() {
  float t = clamp((vWorldPos.x - uCleftRange.x) / (uCleftRange.y - uCleftRange.x), 0.0, 1.0);
  float sweep = exp(-pow(t - uForward, 2.0) * 28.0);
  float intensity = uActivity * (0.4 + 0.6 * sweep);
  vec3 col = uColor * (0.15 + 1.2 * intensity);
  float alpha = uBaseOpacity + intensity * 0.45;
  gl_FragColor = vec4(col, alpha);
}
`;
const cleftVertex = tissueVertex;

// ────────────────────────── component ──────────────────────────

type VesicleSlot = {
  // home position inside the bouton (Poisson-sampled)
  hx: number; hy: number; hz: number;
  baseScale: number;
  reserve: boolean; // true = behind-the-front-pool vesicles
  // animation state
  fuseStart: number;   // elapsed time when this vesicle starts fusing (-1 = idle)
  fuseDuration: number;
  drifted: { x: number; y: number; z: number }; // Brownian drift
};

type ParticleSlot = {
  active: boolean;
  spawnTime: number;
  travel: number;
  ox: number; oy: number; oz: number;
  tx: number; ty: number; tz: number;
  // for binding flash spawning
  bound: boolean;
};

type FlashSlot = {
  active: boolean;
  start: number;
  px: number; py: number; pz: number;
};

const POOL_DESKTOP = 220;
const POOL_MOBILE = 90;

export default function Synapse({ nt, triggerCount, speed = 1 }: Props) {
  const behavior = NEUROTRANSMITTERS[nt];
  const perfClass = useMemo(() => devicePerfClass(), []);
  const POOL = perfClass === "low" ? POOL_MOBILE : POOL_DESKTOP;
  const FLASH_POOL = perfClass === "low" ? 24 : 48;
  const VESICLE_TOTAL = perfClass === "low" ? 26 : 38;

  // ─── refs into the live scene ───
  const elapsed = useRef(0);
  const lastTrigger = useRef(triggerCount);

  // axon shader
  const axonUniforms = useRef({
    uPulse: { value: -0.1 },
    uPulseStrength: { value: 0 },
    uAxonRange: {
      value: new THREE.Vector2(AXON_LEFT_X, BOUTON_CENTER_X - BOUTON_RADIUS),
    },
    uTissueColor: { value: new THREE.Color(TISSUE_COLOR) },
    uPulseColor: { value: new THREE.Color(behavior.color) },
    uRimColor: { value: new THREE.Color("#c0e0ff") },
    uCameraPos: { value: new THREE.Vector3() },
    uElapsed: { value: 0 },
    uPulsePassed: { value: -1 },
  });

  // bouton shader
  const boutonUniforms = useRef({
    uBaseColor: { value: new THREE.Color(TISSUE_COLOR) },
    uRimColor: { value: new THREE.Color("#c0e0ff") },
    uCameraPos: { value: new THREE.Vector3() },
    uCalciumColor: { value: new THREE.Color("#5cc8d6") },
    uCalcium: { value: 0 },
    uDepolColor: { value: new THREE.Color("#f0e8d8") },
    uDepol: { value: 0 },
    uWaveX: { value: -10 },
    uWaveAmplitude: { value: 0 },
    uRimBoost: { value: 0 },
    uBreathing: { value: 0 },
    uActiveZoneX: { value: ACTIVE_ZONE_X },
    uActiveZoneBoost: { value: 0 },
    uHyperpolarize: { value: 0 },
  });

  // spine shader
  const spineUniforms = useRef({
    uBaseColor: { value: new THREE.Color(TISSUE_COLOR) },
    uRimColor: { value: new THREE.Color(behavior.rimColor) },
    uCameraPos: { value: new THREE.Vector3() },
    uCalciumColor: { value: new THREE.Color("#5cc8d6") },
    uCalcium: { value: 0 },
    uDepolColor: { value: new THREE.Color("#f0e8d8") },
    uDepol: { value: 0 },
    uWaveX: { value: -10 },
    uWaveAmplitude: { value: 0 },
    uRimBoost: { value: 0 },
    uBreathing: { value: 0 },
    uActiveZoneX: { value: PSD_X },
    uActiveZoneBoost: { value: 0 },
    uHyperpolarize: { value: 0 },
  });

  // cleft shader
  const cleftUniforms = useRef({
    uColor: { value: new THREE.Color(behavior.color) },
    uActivity: { value: 0 },
    uForward: { value: 0 },
    uCleftRange: { value: new THREE.Vector2(CLEFT_LEFT_X, CLEFT_RIGHT_X) },
    uBaseOpacity: { value: 0.04 },
  });

  // vesicle uniforms (shared across all instances of one material)
  const vesicleUniforms = useRef({
    uInteriorColor: { value: new THREE.Color("#2a3464") },
    uRimColor: { value: new THREE.Color(behavior.rimColor) },
    uCameraPos: { value: new THREE.Vector3() },
    uGlow: { value: 0 },
    uIdlePulse: { value: 0 },
    uAlpha: { value: 0.95 },
  });
  const reserveVesicleUniforms = useRef({
    uInteriorColor: { value: new THREE.Color("#202a4a") },
    uRimColor: { value: new THREE.Color(behavior.rimColor) },
    uCameraPos: { value: new THREE.Vector3() },
    uGlow: { value: 0 },
    uIdlePulse: { value: 0 },
    uAlpha: { value: 0.85 },
  });

  // refs into instanced meshes / mesh handles
  const dockedRef = useRef<THREE.InstancedMesh>(null);
  const reserveRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const flashesRef = useRef<THREE.InstancedMesh>(null);
  const cleftLightRef = useRef<THREE.PointLight>(null);

  // ─── seed positions for vesicles (Poisson-ish via rejection sampling) ───
  const vesicles = useMemo(() => {
    const dockedTarget = Math.round(VESICLE_TOTAL * 0.55);
    const reserveTarget = VESICLE_TOTAL - dockedTarget;
    const result: VesicleSlot[] = [];

    // helper to push if not too close to any prior in `result`
    const tryPush = (
      x: number, y: number, z: number,
      reserve: boolean, minDist: number, scale: number,
    ): boolean => {
      for (const v of result) {
        const dx = v.hx - x;
        const dy = v.hy - y;
        const dz = v.hz - z;
        if (dx * dx + dy * dy + dz * dz < minDist * minDist) return false;
      }
      result.push({
        hx: x, hy: y, hz: z,
        baseScale: scale,
        reserve,
        fuseStart: -1,
        fuseDuration: 0,
        drifted: { x: 0, y: 0, z: 0 },
      });
      return true;
    };

    // Docked cluster — disk-like cap pressed against the active zone face.
    let attempts = 0;
    while (
      result.filter((v) => !v.reserve).length < dockedTarget &&
      attempts < 600
    ) {
      attempts++;
      // sample on a slightly curved disk facing +x at ACTIVE_ZONE_X
      const r = Math.sqrt(Math.random()) * 0.16;
      const ang = Math.random() * Math.PI * 2;
      const y = Math.cos(ang) * r;
      const z = Math.sin(ang) * r;
      const x = ACTIVE_ZONE_X - 0.05 - Math.random() * 0.06 - r * 0.12;
      tryPush(x, y, z, false, 0.05, 0.022 + Math.random() * 0.006);
    }

    // Reserve pool — scattered deeper in the bouton, smaller, dimmer.
    attempts = 0;
    while (
      result.filter((v) => v.reserve).length < reserveTarget &&
      attempts < 800
    ) {
      attempts++;
      // sphere-shell sampling inside the bouton, biased toward the back
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = 0.1 + Math.random() * 0.22;
      const dx = Math.cos(u) * Math.sin(v) * r;
      const dy = Math.cos(v) * r * 0.7;
      const dz = Math.sin(u) * Math.sin(v) * r * 0.7;
      // shift so reserve sits behind the active zone, deeper in the bouton
      const x = BOUTON_CENTER_X - 0.08 + dx * 0.7;
      const y = dy;
      const z = dz;
      // skip if too close to the active-zone disk
      if (x > ACTIVE_ZONE_X - 0.12) continue;
      tryPush(x, y, z, true, 0.055, 0.016 + Math.random() * 0.005);
    }

    return result;
  }, [VESICLE_TOTAL]);

  // ─── particle + flash pools ───
  const particles = useRef<ParticleSlot[]>([]);
  const flashes = useRef<FlashSlot[]>([]);
  if (particles.current.length !== POOL) {
    particles.current = Array.from({ length: POOL }, () => ({
      active: false,
      spawnTime: 0,
      travel: 0.5,
      ox: 0, oy: 0, oz: 0, tx: 0, ty: 0, tz: 0,
      bound: false,
    }));
  }
  if (flashes.current.length !== FLASH_POOL) {
    flashes.current = Array.from({ length: FLASH_POOL }, () => ({
      active: false, start: 0, px: 0, py: 0, pz: 0,
    }));
  }

  // ─── colour reactivity to nt change ───
  useEffect(() => {
    axonUniforms.current.uPulseColor.value.set(behavior.color);
    cleftUniforms.current.uColor.value.set(behavior.color);
    vesicleUniforms.current.uRimColor.value.set(behavior.rimColor);
    reserveVesicleUniforms.current.uRimColor.value.set(behavior.rimColor);
    spineUniforms.current.uRimColor.value.set(behavior.rimColor);
  }, [behavior.color, behavior.rimColor]);

  // ─── trigger handling: kicks off the AP travel phase ───
  const apStartTime = useRef<number | null>(null);
  const burstStartTime = useRef<number | null>(null);
  const burstActiveUntil = useRef(0);
  const fuseScheduleRef = useRef<number[]>([]); // per-docked-vesicle fuseStart
  const reusedDockedIndices = useRef<number[]>([]); // which dockeds we're firing
  const totalBindings = useRef(0);
  const lastBindingTime = useRef(-1);
  const aftershockTimes = useRef<number[]>([]); // for acetylcholine biphasic
  const cameraDriftSeed = useRef(Math.random() * 1000);

  useEffect(() => {
    if (triggerCount === lastTrigger.current) return;
    lastTrigger.current = triggerCount;
    apStartTime.current = elapsed.current;
    burstStartTime.current = null;
    totalBindings.current = 0;
    aftershockTimes.current = [];
    // Choose which docked vesicles will fuse this round.
    const dockedIdx = vesicles
      .map((v, i) => (v.reserve ? -1 : i))
      .filter((i) => i >= 0);
    // shuffle, take first N
    for (let i = dockedIdx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dockedIdx[i], dockedIdx[j]] = [dockedIdx[j], dockedIdx[i]];
    }
    reusedDockedIndices.current = dockedIdx.slice(0, behavior.vesicleCount);
    // pre-compute stagger schedule (will be offset by burstStartTime when AP lands)
    fuseScheduleRef.current = reusedDockedIndices.current.map(
      (_, i) => i * behavior.vesicleStaggerSec,
    );
  }, [triggerCount, behavior, vesicles]);

  // ─── geometries (memoised) ───
  const boutonGeom = useMemo(() => {
    const profile = boutonProfile();
    const g = new THREE.LatheGeometry(profile, 64);
    // lathe revolves around Y; rotate so its axis aligns with X (axon dir)
    g.rotateZ(-Math.PI / 2);
    g.computeVertexNormals();
    return g;
  }, []);
  const spineGeom = useMemo(() => {
    const profile = spineProfile();
    const g = new THREE.LatheGeometry(profile, 64);
    g.rotateZ(Math.PI / 2);
    g.computeVertexNormals();
    return g;
  }, []);
  const vesicleGeom = useMemo(
    () => new THREE.SphereGeometry(1, 32, 24),
    [],
  );
  const particleGeom = useMemo(
    () => new THREE.SphereGeometry(0.012, 10, 8),
    [],
  );
  const flashGeom = useMemo(
    () => new THREE.SphereGeometry(0.025, 12, 10),
    [],
  );

  // ─── seed instance matrices once (then we'll just adjust scale/alpha per frame) ───
  useEffect(() => {
    if (!dockedRef.current || !reserveRef.current) return;
    const dummy = new THREE.Object3D();
    let d = 0, r = 0;
    for (const v of vesicles) {
      dummy.position.set(v.hx, v.hy, v.hz);
      dummy.scale.setScalar(v.baseScale);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      if (v.reserve) {
        reserveRef.current.setMatrixAt(r++, dummy.matrix);
      } else {
        dockedRef.current.setMatrixAt(d++, dummy.matrix);
      }
    }
    dockedRef.current.count = d;
    reserveRef.current.count = r;
    dockedRef.current.instanceMatrix.needsUpdate = true;
    reserveRef.current.instanceMatrix.needsUpdate = true;
  }, [vesicles]);

  // ─── animation tick ───
  useFrame((state, dtRaw) => {
    const dt = dtRaw * speed;
    elapsed.current += dt;
    const E = elapsed.current;

    // share camera position with shaders
    const cam = state.camera.position;
    axonUniforms.current.uCameraPos.value.copy(cam);
    boutonUniforms.current.uCameraPos.value.copy(cam);
    spineUniforms.current.uCameraPos.value.copy(cam);
    vesicleUniforms.current.uCameraPos.value.copy(cam);
    reserveVesicleUniforms.current.uCameraPos.value.copy(cam);
    axonUniforms.current.uElapsed.value = E;

    // ── breathing + idle vesicle drift ──
    const breath = 0.5 + 0.5 * Math.sin(E * 0.5);
    boutonUniforms.current.uBreathing.value = breath;
    spineUniforms.current.uBreathing.value = breath;
    vesicleUniforms.current.uIdlePulse.value = 0.5 + 0.5 * Math.sin(E * 1.2);
    reserveVesicleUniforms.current.uIdlePulse.value =
      0.5 + 0.5 * Math.sin(E * 1.2 + 1.4);

    // ── action-potential phase ──
    let pulseT = -0.1;
    let pulseStrength = 0;
    if (apStartTime.current !== null) {
      const apAge = (E - apStartTime.current) / 0.55; // 0..1 over 550ms at 1x
      pulseT = Math.max(-0.05, Math.min(1.1, apAge));
      pulseStrength = apAge < 0 || apAge > 1.2 ? 0 : 1;

      // When the pulse reaches the bouton (pulseT ≈ 0.95), kick the burst.
      if (pulseT >= 0.95 && burstStartTime.current === null) {
        burstStartTime.current = E;
        const longestStagger =
          fuseScheduleRef.current[fuseScheduleRef.current.length - 1] ?? 0;
        burstActiveUntil.current =
          E +
          longestStagger +
          behavior.vesicleFuseSec +
          behavior.particleTravelSec +
          behavior.cleftLingerSec +
          1.5;
        // mark each chosen docked vesicle to fuse at the right offset
        reusedDockedIndices.current.forEach((vi, k) => {
          vesicles[vi].fuseStart = E + fuseScheduleRef.current[k];
          vesicles[vi].fuseDuration = behavior.vesicleFuseSec;
        });
        // record passing time for refractory dimming shader
        axonUniforms.current.uPulsePassed.value = E;
      }
      // The pulse fades after it reaches the bouton
      if (pulseT > 1.0) {
        const overshoot = (pulseT - 1.0) / 0.2;
        pulseStrength = Math.max(0, 1 - overshoot);
        if (overshoot >= 1) apStartTime.current = null;
      }
    }
    axonUniforms.current.uPulse.value = pulseT;
    axonUniforms.current.uPulseStrength.value = pulseStrength;

    // ── calcium influx pulse on bouton (when AP arrives) ──
    let calcium = 0;
    if (burstStartTime.current !== null) {
      const tSinceBurst = E - burstStartTime.current;
      // ramp up over 80ms, decay over 600ms
      calcium = tSinceBurst < 0.08
        ? tSinceBurst / 0.08
        : Math.max(0, 1 - (tSinceBurst - 0.08) / 0.6);
    }
    boutonUniforms.current.uCalcium.value = calcium;
    // vesicle "primed" glow rises with calcium
    vesicleUniforms.current.uGlow.value = calcium;
    reserveVesicleUniforms.current.uGlow.value = calcium * 0.3;

    // ── vesicle instance updates ──
    if (dockedRef.current) {
      const dummy = new THREE.Object3D();
      let d = 0;
      let activeZoneBoost = 0;
      for (const v of vesicles) {
        if (v.reserve) continue;
        // idle Brownian drift
        v.drifted.x += (Math.random() - 0.5) * 0.0015 * dt * 60;
        v.drifted.y += (Math.random() - 0.5) * 0.0015 * dt * 60;
        v.drifted.z += (Math.random() - 0.5) * 0.0015 * dt * 60;
        v.drifted.x *= 0.94; v.drifted.y *= 0.94; v.drifted.z *= 0.94;

        let scale = v.baseScale;
        let alpha = 1;
        let x = v.hx + v.drifted.x;
        let y = v.hy + v.drifted.y;
        let z = v.hz + v.drifted.z;

        if (v.fuseStart > 0) {
          const fuseT = (E - v.fuseStart) / v.fuseDuration;
          if (fuseT > 0 && fuseT < 1) {
            // approach the membrane
            const approach = Math.min(1, fuseT * 1.3);
            const eased = approach < 0.5
              ? 2 * approach * approach
              : 1 - Math.pow(-2 * approach + 2, 2) / 2;
            x = v.hx + (ACTIVE_ZONE_X - v.hx) * eased;
            // expand and fade
            scale = v.baseScale * (1 + fuseT * 0.55);
            alpha = 1 - fuseT;
            activeZoneBoost = Math.max(activeZoneBoost, alpha);
            // spawn particles at the moment of peak expansion
            if (!v.fuseStart || E - v.fuseStart >= v.fuseDuration * 0.55) {
              const spawnKey = `spawned_${v.fuseStart}`;
              if (!(v as VesicleSlot & Record<string, boolean>)[spawnKey]) {
                (v as VesicleSlot & Record<string, boolean>)[spawnKey] = true;
                spawnParticleBurst(
                  particles.current,
                  E,
                  ACTIVE_ZONE_X,
                  v.hy,
                  v.hz,
                  behavior,
                );
              }
            }
          } else if (fuseT >= 1) {
            v.fuseStart = -1;
            (v as VesicleSlot & Record<string, boolean>)[`spawned_${v.fuseStart}`] = false;
            // hide the vesicle for a moment then it "replenishes" — small scale
            scale = v.baseScale * 0.2;
            alpha = 0.4;
          }
        }
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(scale);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        dockedRef.current.setMatrixAt(d++, dummy.matrix);
      }
      dockedRef.current.instanceMatrix.needsUpdate = true;
      boutonUniforms.current.uActiveZoneBoost.value = activeZoneBoost;
      vesicleUniforms.current.uAlpha.value = 0.85;
    }

    // reserve pool only drifts subtly
    if (reserveRef.current) {
      const dummy = new THREE.Object3D();
      let r = 0;
      for (const v of vesicles) {
        if (!v.reserve) continue;
        v.drifted.x += (Math.random() - 0.5) * 0.0008 * dt * 60;
        v.drifted.y += (Math.random() - 0.5) * 0.0008 * dt * 60;
        v.drifted.z += (Math.random() - 0.5) * 0.0008 * dt * 60;
        v.drifted.x *= 0.96; v.drifted.y *= 0.96; v.drifted.z *= 0.96;
        dummy.position.set(
          v.hx + v.drifted.x,
          v.hy + v.drifted.y,
          v.hz + v.drifted.z,
        );
        dummy.scale.setScalar(v.baseScale);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        reserveRef.current.setMatrixAt(r++, dummy.matrix);
      }
      reserveRef.current.instanceMatrix.needsUpdate = true;
    }

    // ── particle update + receptor binding ──
    let activeCount = 0;
    let centroidT = 0;
    if (particlesRef.current) {
      const dummy = new THREE.Object3D();
      let idx = 0;
      for (const p of particles.current) {
        if (!p.active) {
          // park it off-screen
          dummy.position.set(0, -10, 0);
          dummy.scale.setScalar(0.0001);
          dummy.updateMatrix();
          particlesRef.current.setMatrixAt(idx++, dummy.matrix);
          continue;
        }
        const t = (E - p.spawnTime) / p.travel;
        if (t >= 1) {
          p.active = false;
          if (!p.bound) {
            p.bound = true;
            totalBindings.current++;
            lastBindingTime.current = E;
            // spawn a receptor flash at the binding point
            spawnFlash(
              flashes.current,
              E,
              PSD_X - 0.02 + p.tx * 0.1,
              p.ty,
              p.tz,
            );
          }
          dummy.position.set(0, -10, 0);
          dummy.scale.setScalar(0.0001);
          dummy.updateMatrix();
          particlesRef.current.setMatrixAt(idx++, dummy.matrix);
          continue;
        }
        if (t < 0) {
          dummy.position.set(0, -10, 0);
          dummy.scale.setScalar(0.0001);
          dummy.updateMatrix();
          particlesRef.current.setMatrixAt(idx++, dummy.matrix);
          continue;
        }
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const startX = ACTIVE_ZONE_X + p.ox * 0.06;
        const endX = PSD_X - 0.02 + p.tx * 0.1;
        const x = startX + (endX - startX) * eased;
        const y = p.oy + (p.ty - p.oy) * eased + Math.sin(t * Math.PI) * 0.025;
        const z = p.oz + (p.tz - p.oz) * eased;
        dummy.position.set(x, y, z);
        const sFade = t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1;
        const sLife = 0.6 + Math.sin(t * Math.PI) * 0.4;
        dummy.scale.setScalar(sLife * sFade);
        dummy.updateMatrix();
        particlesRef.current.setMatrixAt(idx++, dummy.matrix);
        activeCount++;
        centroidT += t;
      }
      particlesRef.current.instanceMatrix.needsUpdate = true;
      if (activeCount > 0) centroidT /= activeCount;
    }

    // ── cleft activity uniform ──
    const activityTarget = Math.min(1, activeCount / 60);
    const linger = behavior.cleftLingerSec;
    cleftUniforms.current.uActivity.value = THREE.MathUtils.lerp(
      cleftUniforms.current.uActivity.value,
      activityTarget,
      Math.min(1, dt * (activeCount > 0 ? 8 : 1 / Math.max(linger, 0.1))),
    );
    cleftUniforms.current.uForward.value = centroidT;
    if (cleftLightRef.current) {
      cleftLightRef.current.intensity =
        0.18 + cleftUniforms.current.uActivity.value * 1.4;
    }

    // ── receptor flashes ──
    if (flashesRef.current) {
      const dummy = new THREE.Object3D();
      let i = 0;
      for (const f of flashes.current) {
        if (!f.active) {
          dummy.position.set(0, -10, 0);
          dummy.scale.setScalar(0.0001);
          dummy.updateMatrix();
          flashesRef.current.setMatrixAt(i++, dummy.matrix);
          continue;
        }
        const age = E - f.start;
        const life = 0.22;
        if (age > life) {
          f.active = false;
          dummy.position.set(0, -10, 0);
          dummy.scale.setScalar(0.0001);
          dummy.updateMatrix();
          flashesRef.current.setMatrixAt(i++, dummy.matrix);
          continue;
        }
        const k = age / life;
        const scale = (1 - k * 0.6) * (1 + k * 0.6);
        dummy.position.set(f.px, f.py, f.pz);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        flashesRef.current.setMatrixAt(i++, dummy.matrix);
      }
      flashesRef.current.instanceMatrix.needsUpdate = true;
    }

    // ── postsynaptic spine response (per NT behavior) ──
    const bindingActivity = Math.min(1, totalBindings.current / 12);
    const timeSinceLastBind = E - lastBindingTime.current;
    const recencyDecay = Math.max(0, 1 - timeSinceLastBind / 1.2);

    spineUniforms.current.uHyperpolarize.value = 0;
    spineUniforms.current.uRimBoost.value = 0;

    switch (behavior.postSynaptic) {
      case "depolarize": {
        // EPSP wave: kick when bindingActivity crosses 0.45
        if (bindingActivity > 0.45 && spineUniforms.current.uDepol.value < 0.2) {
          // kick the wave
          spineUniforms.current.uDepol.value = 1.0;
          spineUniforms.current.uWaveAmplitude.value = 1.0;
        }
        // wave travels from spine head (SPINE_HEAD_X) to dendrite (DENDRITE_X)
        if (spineUniforms.current.uWaveAmplitude.value > 0) {
          spineUniforms.current.uWaveX.value += dt * 1.6;
          spineUniforms.current.uWaveAmplitude.value -= dt * 0.55;
          if (spineUniforms.current.uWaveX.value > DENDRITE_X + 0.5) {
            spineUniforms.current.uWaveX.value = SPINE_HEAD_X - 0.1;
            spineUniforms.current.uWaveAmplitude.value = 0;
          }
        } else {
          spineUniforms.current.uWaveX.value = SPINE_HEAD_X - 0.1;
        }
        spineUniforms.current.uDepol.value = Math.max(
          spineUniforms.current.uDepol.value - dt * 0.7,
          bindingActivity * 0.5,
        );
        break;
      }
      case "hyperpolarize": {
        // membrane darkens, gentle ripple
        spineUniforms.current.uHyperpolarize.value = Math.min(
          1,
          bindingActivity * 0.9 + recencyDecay * 0.5,
        );
        spineUniforms.current.uDepol.value = 0;
        break;
      }
      case "modulate": {
        // lingering warmth, no wave
        spineUniforms.current.uDepol.value = bindingActivity * 0.35;
        spineUniforms.current.uRimBoost.value = bindingActivity * 0.5;
        break;
      }
      case "sustain": {
        // very gentle persistent warming
        spineUniforms.current.uDepol.value = bindingActivity * 0.25;
        spineUniforms.current.uRimBoost.value = bindingActivity * 0.35;
        break;
      }
      case "sharpen": {
        // boost Fresnel, persists
        spineUniforms.current.uRimBoost.value = Math.min(
          1.4,
          bindingActivity * 1.4 + recencyDecay * 0.4,
        );
        spineUniforms.current.uDepol.value = bindingActivity * 0.3;
        break;
      }
      case "biphasic": {
        // EPSP, then 2-3 secondary pulses
        if (bindingActivity > 0.45 && aftershockTimes.current.length === 0) {
          aftershockTimes.current = [E + 0.4, E + 0.8, E + 1.25];
          spineUniforms.current.uDepol.value = 1.0;
          spineUniforms.current.uWaveAmplitude.value = 0.9;
        }
        if (spineUniforms.current.uWaveAmplitude.value > 0) {
          spineUniforms.current.uWaveX.value += dt * 1.5;
          spineUniforms.current.uWaveAmplitude.value -= dt * 0.55;
        }
        // secondary pulses
        for (let i = aftershockTimes.current.length - 1; i >= 0; i--) {
          if (E >= aftershockTimes.current[i]) {
            spineUniforms.current.uDepol.value = Math.max(
              spineUniforms.current.uDepol.value,
              0.65 - i * 0.15,
            );
            spineUniforms.current.uWaveAmplitude.value = 0.6 - i * 0.1;
            spineUniforms.current.uWaveX.value = SPINE_HEAD_X - 0.1;
            aftershockTimes.current.splice(i, 1);
          }
        }
        spineUniforms.current.uDepol.value = Math.max(
          spineUniforms.current.uDepol.value - dt * 0.8,
          bindingActivity * 0.35,
        );
        if (spineUniforms.current.uWaveX.value > DENDRITE_X + 0.5) {
          spineUniforms.current.uWaveAmplitude.value = 0;
        }
        break;
      }
    }

    // ── group-level idle motion ──
    const idleStrength = burstStartTime.current === null ? 1 : 0;
    const idleGroup = state.scene.getObjectByName("synapse-idle") as
      | THREE.Group
      | null;
    if (idleGroup) {
      const s = cameraDriftSeed.current;
      // Subtle figure-8 (Lissajous) when idle
      idleGroup.rotation.y = Math.sin(E * 0.13 + s) * 0.04 * idleStrength;
      idleGroup.rotation.x = Math.sin(E * 0.21 + s * 1.3) * 0.025 * idleStrength;
      const breathS = 1 + 0.005 * Math.sin(E * 0.5);
      idleGroup.scale.setScalar(breathS);
    }
  });

  // ────── render ──────
  return (
    <group name="synapse-group" position={[0, 0, 0]}>
      <group name="synapse-idle">
      {/* off-screen axon stub (extends past frame) */}
      <mesh
        position={[(AXON_LEFT_X + BOUTON_CENTER_X - BOUTON_RADIUS) / 2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry
          args={[0.08, 0.085, BOUTON_CENTER_X - BOUTON_RADIUS - AXON_LEFT_X, 32, 1]}
        />
        <shaderMaterial
          vertexShader={axonVertex}
          fragmentShader={axonFragment}
          uniforms={axonUniforms.current}
        />
      </mesh>

      {/* presynaptic bouton (lathe geometry around X axis) */}
      <mesh geometry={boutonGeom} position={[BOUTON_CENTER_X, 0, 0]}>
        <shaderMaterial
          vertexShader={tissueVertex}
          fragmentShader={tissueFragment}
          uniforms={boutonUniforms.current}
        />
      </mesh>

      {/* mitochondrion inside the bouton */}
      <mesh
        position={[BOUTON_CENTER_X - 0.18, 0.06, 0.05]}
        rotation={[0, 0, 0.35]}
        scale={[0.22, 0.085, 0.085]}
      >
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial
          color={"#5a4030"}
          emissive={"#3a2418"}
          emissiveIntensity={0.18}
          roughness={0.55}
        />
      </mesh>

      {/* docked vesicles (instanced) */}
      <instancedMesh
        ref={dockedRef}
        args={[
          vesicleGeom,
          undefined,
          vesicles.filter((v) => !v.reserve).length,
        ]}
      >
        <shaderMaterial
          attach="material"
          vertexShader={vesicleVertex}
          fragmentShader={vesicleFragment}
          uniforms={vesicleUniforms.current}
          transparent
          depthWrite={false}
        />
      </instancedMesh>

      {/* reserve pool */}
      <instancedMesh
        ref={reserveRef}
        args={[
          vesicleGeom,
          undefined,
          vesicles.filter((v) => v.reserve).length,
        ]}
      >
        <shaderMaterial
          attach="material"
          vertexShader={vesicleVertex}
          fragmentShader={vesicleFragment}
          uniforms={reserveVesicleUniforms.current}
          transparent
          depthWrite={false}
        />
      </instancedMesh>

      {/* synaptic cleft — narrow volumetric slab */}
      <mesh
        position={[(CLEFT_LEFT_X + CLEFT_RIGHT_X) / 2, 0, 0]}
      >
        <boxGeometry args={[CLEFT_WIDTH, 0.5, 0.5]} />
        <shaderMaterial
          vertexShader={cleftVertex}
          fragmentShader={cleftFragment}
          uniforms={cleftUniforms.current}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* cleft accent point light — brightens during release */}
      <pointLight
        ref={cleftLightRef}
        position={[(CLEFT_LEFT_X + CLEFT_RIGHT_X) / 2, 0, 0]}
        color={behavior.color}
        intensity={0.18}
        distance={0.9}
        decay={2}
      />

      {/* postsynaptic spine (lathe mushroom) */}
      <mesh geometry={spineGeom} position={[SPINE_HEAD_X, 0, 0]}>
        <shaderMaterial
          vertexShader={tissueVertex}
          fragmentShader={tissueFragment}
          uniforms={spineUniforms.current}
        />
      </mesh>

      {/* dendrite shaft — fades off-screen at the right edge */}
      <mesh
        position={[DENDRITE_X, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.18, 0.18, 0.8, 32, 1]} />
        <shaderMaterial
          vertexShader={tissueVertex}
          fragmentShader={tissueFragment}
          uniforms={spineUniforms.current}
        />
      </mesh>

      {/* neurotransmitter particles (instanced) */}
      <instancedMesh ref={particlesRef} args={[particleGeom, undefined, POOL]}>
        <meshStandardMaterial
          color={behavior.color}
          emissive={behavior.color}
          emissiveIntensity={3.5}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>

      {/* receptor-binding flash dots on the spine surface */}
      <instancedMesh ref={flashesRef} args={[flashGeom, undefined, FLASH_POOL]}>
        <meshStandardMaterial
          color={behavior.rimColor}
          emissive={behavior.rimColor}
          emissiveIntensity={5.0}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
      </group>
    </group>
  );
}

// ────────────────────────── helpers ──────────────────────────

function spawnParticleBurst(
  pool: ParticleSlot[],
  now: number,
  originX: number,
  originY: number,
  originZ: number,
  behavior: NTBehavior,
) {
  let spawned = 0;
  for (let i = 0; i < pool.length && spawned < behavior.particlesPerVesicle; i++) {
    const p = pool[i];
    if (p.active) continue;
    p.active = true;
    p.bound = false;
    p.spawnTime = now + Math.random() * 0.04;
    p.travel = behavior.particleTravelSec * (0.85 + Math.random() * 0.3);
    // origin: tight cluster around the fusion point
    p.ox = originY * 0.6 + (Math.random() - 0.5) * 0.08;
    p.oy = originY + (Math.random() - 0.5) * 0.06;
    p.oz = originZ + (Math.random() - 0.5) * 0.06;
    // target: forward across cleft with some spread
    const spread = behavior.particleSpread;
    p.tx = (Math.random() - 0.5) * 0.06;
    p.ty = originY * 0.4 + (Math.random() - 0.5) * spread * 0.7;
    p.tz = originZ * 0.4 + (Math.random() - 0.5) * spread * 0.6;
    spawned++;
  }
}

function spawnFlash(
  pool: FlashSlot[],
  now: number,
  px: number, py: number, pz: number,
) {
  for (const f of pool) {
    if (f.active) continue;
    f.active = true;
    f.start = now;
    f.px = px;
    f.py = py;
    f.pz = pz;
    return;
  }
}
