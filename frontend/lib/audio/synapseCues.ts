/**
 * Visual-elevation Fix 6 — synapse audio cues.
 *
 * Two short Web Audio API cues synthesised at runtime (no .opus
 * or .mp3 file dependency). Both are gated on prefers-reduced-
 * motion: callers can fire freely, the cue silently no-ops when
 * the user prefers reduced motion.
 *
 *   apTick()    — short oscillator click on action-potential
 *                 arrival. 1100 Hz square wave, ~60 ms envelope,
 *                 gain 0.30. Reads as a soft tick, not a beep.
 *
 *   epspWash()  — filtered noise burst on EPSP (post-synaptic
 *                 wash). Band-pass at 320 Hz Q=4.5, ~600 ms slow
 *                 exponential decay, gain 0.28. Reads as a
 *                 single low whoosh.
 *
 * AudioContext is lazy-instantiated on first cue and persists
 * for subsequent firings. Most browsers gate audio context
 * creation behind a user-gesture; the synapse trigger button is
 * exactly that gesture, so the first call from a click resumes
 * a suspended context cleanly.
 */

let ctx: AudioContext | null = null;

function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  type WindowWithWebkit = Window & {
    webkitAudioContext?: typeof AudioContext;
  };
  const Ctor =
    window.AudioContext ?? (window as WindowWithWebkit).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    return null;
  }
  return ctx;
}

/**
 * Single tick at action-potential arrival. Cheap; safe to call
 * once per phase transition.
 */
export function apTick(): void {
  if (reducedMotion()) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume().catch(() => undefined);
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(1100, t);
  // 10 ms attack, 50 ms exponential release.
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.08);
}

/**
 * Low whoosh on EPSP (excitatory post-synaptic potential).
 * Band-passed white noise with a 600 ms slow decay.
 */
export function epspWash(): void {
  if (reducedMotion()) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume().catch(() => undefined);
  const t = c.currentTime;
  const duration = 0.6;
  const bufferSize = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(320, t);
  filter.Q.setValueAtTime(4.5, t);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.28, t + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(t);
  src.stop(t + duration + 0.05);
}
