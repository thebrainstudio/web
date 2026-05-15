"use client";

import { useEffect, useRef } from "react";

/**
 * Root-level keyboard dispatcher.
 *
 * One `window.addEventListener("keydown", ...)` + one `keyup`, period.
 * Every shortcut on the site funnels through this hook so the
 * input-focus guard lives in exactly one place — typing in the Mirror
 * textarea must never trigger `D`, `F`, `Space`, MANDALA, or anything
 * else the rest of the codebase wires up.
 *
 * Usage
 *
 *   useKeyboardCommands([
 *     {
 *       id: "deep-night",
 *       key: "d",
 *       onPress: () => store.toggleDeepNight(),
 *     },
 *     {
 *       id: "slow-world",
 *       key: "Shift",
 *       onPress: () => store.setMotionScale(0.4),
 *       onRelease: () => store.setMotionScale(1),
 *       allowInInput: true, // shift can be held while typing
 *     },
 *   ]);
 *
 * Or use the imperative `addCommand` form for component-scoped commands
 * (museum mode on /archetypes only, MANDALA sequence on /en only).
 *
 * Design notes
 *
 *  • Single canonical dispatcher. The previous Cmd-K listener inside
 *    `SearchPalette` is the only existing one; this hook absorbs it
 *    via the imperative API and the palette consumes commands.
 *  • Input-focus guard: by default a command does NOT fire while
 *    `document.activeElement` is INPUT / TEXTAREA / SELECT or any
 *    `[contenteditable]`. Override per-command with `allowInInput`.
 *  • `when` gate runs every keystroke; cheap predicates only.
 *  • `key` is matched case-insensitively against `e.key`. Use the
 *    special tokens "ArrowLeft", "ArrowRight", "Escape", " " (space),
 *    "Shift", "Alt" (also matches Option on Mac), "Meta" / "Control"
 *    for chords (use the `mod` field instead for that).
 *  • Held-key commands: declare `onPress` AND `onRelease`. The hook
 *    tracks per-id state internally and won't re-fire `onPress` on
 *    keyboard auto-repeat.
 */

export type KeyboardCommand = {
  /** Stable identifier — used for dedupe and held-key tracking. */
  id: string;
  /** Case-insensitive match against `KeyboardEvent.key`. */
  key: string;
  /** Optional modifier requirement. Cmd on Mac == ctrl on Windows. */
  mod?: "cmd" | "shift" | "alt" | "none";
  /** Predicate gating whether the command fires this keypress. */
  when?: () => boolean;
  /** Fires on keydown (or once per held-key sequence). */
  onPress?: (e: KeyboardEvent) => void;
  /** Fires on keyup. Pair with onPress for held-key commands. */
  onRelease?: (e: KeyboardEvent) => void;
  /** Set true if the command should fire even when an input is focused. */
  allowInInput?: boolean;
  /** Set false to skip the default `e.preventDefault()` on match. */
  preventDefault?: boolean;
};

type Registry = Map<string, KeyboardCommand>;
type HeldSet = Set<string>;

// Module-level singleton — every `useKeyboardCommands` call subscribes
// into the same registry. The single window listener installs itself
// lazily on the first registration and tears down on the last.
const registry: Registry = new Map();
const held: HeldSet = new Set();
let listenersInstalled = false;
let installCleanup: (() => void) | null = null;

function activeElementIsEditable(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  const ce = (el as HTMLElement).getAttribute?.("contenteditable");
  if (ce && ce !== "false") return true;
  return false;
}

function modSatisfied(cmd: KeyboardCommand, e: KeyboardEvent): boolean {
  if (!cmd.mod || cmd.mod === "none") return true;
  if (cmd.mod === "cmd") return e.metaKey || e.ctrlKey;
  if (cmd.mod === "shift") return e.shiftKey;
  if (cmd.mod === "alt") return e.altKey;
  return false;
}

function matches(cmd: KeyboardCommand, e: KeyboardEvent): boolean {
  if (cmd.key.toLowerCase() !== e.key.toLowerCase()) return false;
  if (!modSatisfied(cmd, e)) return false;
  if (cmd.when && !cmd.when()) return false;
  if (!cmd.allowInInput && activeElementIsEditable()) return false;
  return true;
}

function ensureListeners() {
  if (listenersInstalled || typeof window === "undefined") return;
  listenersInstalled = true;

  const onDown = (e: KeyboardEvent) => {
    for (const cmd of registry.values()) {
      if (!matches(cmd, e)) continue;
      // Held-key dedupe: don't re-fire onPress while the key is held
      // and the OS is auto-repeating.
      if (held.has(cmd.id)) continue;
      held.add(cmd.id);
      if (cmd.preventDefault !== false) e.preventDefault();
      cmd.onPress?.(e);
    }
  };

  const onUp = (e: KeyboardEvent) => {
    // On keyup the modifier state usually flips before the key arrives
    // (e.g. releasing Shift fires `keyup` with `e.key === "Shift"` but
    // `e.shiftKey === false`). Match on `key` only for the release.
    for (const cmd of registry.values()) {
      if (cmd.key.toLowerCase() !== e.key.toLowerCase()) continue;
      if (!held.has(cmd.id)) continue;
      held.delete(cmd.id);
      cmd.onRelease?.(e);
    }
  };

  // If focus leaves the window mid-hold, clear held state so the next
  // press fires onPress again instead of being de-duped.
  const onBlur = () => {
    for (const id of Array.from(held)) {
      const cmd = registry.get(id);
      held.delete(id);
      cmd?.onRelease?.(new KeyboardEvent("blur") as KeyboardEvent);
    }
  };

  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);
  window.addEventListener("blur", onBlur);

  installCleanup = () => {
    window.removeEventListener("keydown", onDown);
    window.removeEventListener("keyup", onUp);
    window.removeEventListener("blur", onBlur);
    listenersInstalled = false;
    installCleanup = null;
  };
}

function maybeTeardown() {
  if (registry.size === 0 && installCleanup) {
    installCleanup();
  }
}

/**
 * Register one or more keyboard commands. Commands are keyed by `id`;
 * re-registering with the same id replaces the previous handler.
 *
 * Returns a stable `unregister` reference. The hook also unregisters
 * its commands on unmount.
 */
export function useKeyboardCommands(commands: KeyboardCommand[]): void {
  // Stable reference to the latest commands so we don't tear down the
  // window listener on every render.
  const commandsRef = useRef(commands);
  commandsRef.current = commands;

  useEffect(() => {
    const ids = commands.map((c) => c.id);
    for (const cmd of commands) {
      // Wrap to always read through the ref so consumers can rely on
      // closure freshness without re-registering every render.
      const live: KeyboardCommand = {
        ...cmd,
        onPress: (e) => {
          const current = commandsRef.current.find((c) => c.id === cmd.id);
          current?.onPress?.(e);
        },
        onRelease: (e) => {
          const current = commandsRef.current.find((c) => c.id === cmd.id);
          current?.onRelease?.(e);
        },
        when: cmd.when
          ? () => {
              const current = commandsRef.current.find((c) => c.id === cmd.id);
              return current?.when ? current.when() : true;
            }
          : undefined,
      };
      registry.set(cmd.id, live);
    }
    ensureListeners();

    return () => {
      for (const id of ids) {
        registry.delete(id);
        held.delete(id);
      }
      maybeTeardown();
    };
    // We intentionally depend only on the stable list of ids; live
    // command bodies update via the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands.map((c) => c.id).join("|")]);
}

/**
 * Imperative register-one form. Useful for SearchPalette and the
 * MANDALA handler where the command lives inside a useEffect with
 * its own dependency set, not at component top-level.
 *
 * Returns the unregister function.
 */
export function registerKeyboardCommand(cmd: KeyboardCommand): () => void {
  registry.set(cmd.id, cmd);
  ensureListeners();
  return () => {
    registry.delete(cmd.id);
    held.delete(cmd.id);
    maybeTeardown();
  };
}
