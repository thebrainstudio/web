/**
 * Central configuration for the synapse cinematic. Each neurotransmitter
 * defines:
 *   - color family (within or just adjacent to the locked palette)
 *   - the kinetics of vesicle fusion (how many fuse, how staggered)
 *   - the kinetics of release (particle count, speed, spread, lifetime)
 *   - the postsynaptic response (depolarize / hyperpolarize / modulate)
 *   - how long the cleft glow lingers after the burst ends
 *
 * Editing this file changes every visual + temporal characteristic of
 * the synapse animation for the selected transmitter.
 */

export type Neurotransmitter =
  | "glutamate"
  | "gaba"
  | "dopamine"
  | "serotonin"
  | "norepinephrine"
  | "acetylcholine";

export type PostSynapticKind =
  | "depolarize" // glutamate — classic EPSP, bone-cream wave down the spine
  | "hyperpolarize" // GABA — membrane darkens, ripple of "less likely to fire"
  | "modulate" // dopamine — lingering warmth, no clear EPSP
  | "sustain" // serotonin — gentle persistent warming, no full depolarization
  | "sharpen" // norepinephrine — Fresnel rim brightens and persists
  | "biphasic"; // acetylcholine — EPSP then 2-3 secondary pulses

export type NTBehavior = {
  label: string;
  effect: string;

  /** Particle + vesicle accent. */
  color: string;
  /** Fresnel rim color for vesicles. Same as color unless we want extra punch. */
  rimColor: string;

  /** How many vesicles fuse during a single AP. 1x speed seconds. */
  vesicleCount: number;
  /** Stagger between vesicle fusions in seconds (at 1x speed). */
  vesicleStaggerSec: number;
  /** How long each vesicle's fusion expansion lasts. */
  vesicleFuseSec: number;

  /** Particles released per fusing vesicle. */
  particlesPerVesicle: number;
  /** Time to cross the cleft, seconds (1x speed). */
  particleTravelSec: number;
  /** Lateral spread of particles (0-1, fraction of cleft width). */
  particleSpread: number;

  /** What the postsynaptic spine does in response. */
  postSynaptic: PostSynapticKind;
  /** Seconds the cleft glow lingers after the last particle dissipates. */
  cleftLingerSec: number;
  /** Strength of postsynaptic effect (0-1). Used for color shift amplitude. */
  postSynapticStrength: number;
};

export const NEUROTRANSMITTERS: Record<Neurotransmitter, NTBehavior> = {
  glutamate: {
    label: "Glutamate",
    effect: "Excitatory. Binds AMPA / NMDA. Fast, depolarizing.",
    color: "#e8a04a",
    rimColor: "#f3c47a",
    vesicleCount: 7,
    vesicleStaggerSec: 0.05,
    vesicleFuseSec: 0.18,
    particlesPerVesicle: 26,
    particleTravelSec: 0.45,
    particleSpread: 0.32,
    postSynaptic: "depolarize",
    cleftLingerSec: 0.4,
    postSynapticStrength: 1.0,
  },
  gaba: {
    label: "GABA",
    effect: "Inhibitory. Binds GABA-A. Fast, hyperpolarizing.",
    color: "#5cc8d6",
    rimColor: "#8fdce7",
    vesicleCount: 7,
    vesicleStaggerSec: 0.05,
    vesicleFuseSec: 0.18,
    particlesPerVesicle: 24,
    particleTravelSec: 0.48,
    particleSpread: 0.30,
    postSynaptic: "hyperpolarize",
    cleftLingerSec: 0.4,
    postSynapticStrength: 0.9,
  },
  dopamine: {
    label: "Dopamine",
    effect: "Neuromodulator. Volume transmission; slower, broader spread.",
    color: "#c9a961",
    rimColor: "#dbbe78",
    vesicleCount: 5,
    vesicleStaggerSec: 0.18,
    vesicleFuseSec: 0.25,
    particlesPerVesicle: 30,
    particleTravelSec: 1.1,
    particleSpread: 0.65,
    postSynaptic: "modulate",
    cleftLingerSec: 2.2,
    postSynapticStrength: 0.45,
  },
  serotonin: {
    label: "Serotonin",
    // Palette note: this is the one approved extension beyond the locked
    // palette — a muted rose so serotonin reads as warm-but-quiet rather
    // than competing with glutamate's amber. Documented in CLAUDE.md.
    effect: "Neuromodulator. Steady release; receptor diversity matters.",
    color: "#b88aa0",
    rimColor: "#cea8be",
    vesicleCount: 6,
    vesicleStaggerSec: 0.35,
    vesicleFuseSec: 0.3,
    particlesPerVesicle: 22,
    particleTravelSec: 1.4,
    particleSpread: 0.55,
    postSynaptic: "sustain",
    cleftLingerSec: 1.6,
    postSynapticStrength: 0.55,
  },
  norepinephrine: {
    label: "Norepinephrine",
    effect: "Arousal / vigilance. Sparse but salient.",
    color: "#dce6ec",
    rimColor: "#ffffff",
    vesicleCount: 3,
    vesicleStaggerSec: 0.12,
    vesicleFuseSec: 0.2,
    particlesPerVesicle: 28,
    particleTravelSec: 0.7,
    particleSpread: 0.35,
    postSynaptic: "sharpen",
    cleftLingerSec: 0.9,
    postSynapticStrength: 0.7,
  },
  acetylcholine: {
    label: "Acetylcholine",
    effect: "Attention, plasticity. Balanced release.",
    color: "#d4c478",
    rimColor: "#e8d99a",
    vesicleCount: 6,
    vesicleStaggerSec: 0.07,
    vesicleFuseSec: 0.2,
    particlesPerVesicle: 24,
    particleTravelSec: 0.55,
    particleSpread: 0.4,
    postSynaptic: "biphasic",
    cleftLingerSec: 1.4,
    postSynapticStrength: 0.85,
  },
};

export const NT_ORDER: Neurotransmitter[] = [
  "glutamate",
  "gaba",
  "dopamine",
  "serotonin",
  "norepinephrine",
  "acetylcholine",
];

/**
 * Device-capability heuristic. Older laptops + most phones report a low
 * `hardwareConcurrency`. We use this to scale particle counts so the
 * synapse stays at ~60fps even on weaker hardware.
 */
export function devicePerfClass(): "low" | "high" {
  if (typeof navigator === "undefined") return "high";
  const cores = navigator.hardwareConcurrency ?? 4;
  // Touch-only viewport is almost certainly mobile.
  const touchOnly =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches;
  if (touchOnly || cores < 6) return "low";
  return "high";
}
