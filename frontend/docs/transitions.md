# Cinematic Room Transitions

The site reads as one continuous film: a single brain that survives every
navigation, an ambient wash that morphs between rooms, and doors that
acknowledge a click before they open. This document explains how the
machinery is wired so future tuning happens without reverse-engineering.

## Players

| File | Role |
|---|---|
| [`lib/rooms.ts`](../lib/rooms.ts) | `RoomId` union, `pathToRoomId(pathname)`, depth + style helpers. |
| [`lib/brainAnchors.ts`](../lib/brainAnchors.ts) | Per-room brain anchor (position, scale, rotation, lighting, mesh res, visibility). |
| [`lib/transitionState.ts`](../lib/transitionState.ts) | Zustand store with phase machine: `idle` → `exiting` → `entering` → `idle`. |
| [`components/motion/TransitionOrchestrator.tsx`](../components/motion/TransitionOrchestrator.tsx) | Listens to pathname, advances the phase, applies the destination anchor to the brain store. |
| [`components/atmospheric/PersistentAtmosphere.tsx`](../components/atmospheric/PersistentAtmosphere.tsx) | Full-viewport gradient layer that morphs between per-room presets. |
| [`components/home/RoomCard.tsx`](../components/home/RoomCard.tsx) | Door choreography: brain pulse, card press, hold, then `router.push`. |
| [`components/motion/ScrollScene.tsx`](../components/motion/ScrollScene.tsx) | Backs off while `phase !== "idle"`; replays its `apply()` when the phase returns to idle if its trigger is still active. |

## Timeline

A standard transition (Mirror → Music, etc.) plays out like this:

```
t=0    user clicks a RoomCard
       └→ phase = "exiting", fromRoom, toRoom set
       └→ brain pulse: setActivations(target signature)
       └→ card scales 0.995, arrow drifts right 14px

t=250  router.push(href)
       └→ React commits new tree
       └→ TransitionOrchestrator effect fires on pathname change
          └→ phase = "entering"
          └→ applyAnchor: setTransform / setLighting / setMeshResolution / setVisible
          └→ PersistentAtmosphere reads new room → backgroundImage tweens (1.4s)
          └→ Brain lerps toward new anchor in BrainAnatomy's useFrame loop
       └→ ScrollScene blocks check getTransitionPhase() → back off

t=1050 release timer fires → phase = "idle"
       └→ ScrollScene's queued apply() runs if its trigger is still active
       └→ Subsequent scrolls operate normally
```

The deep-descent into Cellular extends the door hold to 750ms (so going
under reads as deliberate) and the post-route budget to 1200ms (so the
fade-out of the macro brain has time to register before the cellular
canvases steal the eye).

## Per-room anchors

Anchors **must match** each room's first ScrollScene config. When you
re-tune a room's opening shot, tune the anchor in lockstep — otherwise
the brain double-glides on entry.

```ts
mirror: {
  position: [0, 0.9, 0],
  scale: 0.78,
  rotation: [0, 0.18, 0],
  lighting: "warm",
  meshResolution: "fsaverage5",
  visible: true,
},
```

## Atmospheric morph

Each room declares a `backgroundImage` value — typically one or two
`radial-gradient`s in the palette's reds, ambers, or cyans. The
persistent layer Tween-Animates between them over 1.4s with the
cinematic easing.

The per-page `<AtmosphericGlow>` instances remain — they own the
scene-level lighting *within* a room. The persistent layer is the
*room's* light, not the *scene's*.

## Door styles

| From → To | Style | Door hold | Post-route budget |
|---|---|---|---|
| Surface ↔ Surface | `standard` | 250ms (100ms on touch) | 800ms |
| Surface → Cellular | `deep-descent` | 750ms | 1200ms |
| Cellular → Surface | `return-to-surface` | 250ms | 1200ms |
| reduced motion (any) | any | 30ms | 80ms |

The `return-to-surface` flips `visible: true` immediately so the
surface room's anchor has somewhere to glide *into*; without that
flip the macro brain would remain hidden through the entire
post-route fade.

## Edge cases handled

- **Rapid back-to-back clicks on the same RoomCard** — `inFlight` ref
  swallows the second click.
- **Rapid nav between different doors** — the orchestrator's effect
  cleanup clears both the anchor timer and the release timer before
  setting up the new transition, so only the most recent destination
  wins.
- **Browser back / forward** — `usePathname` from `next/navigation`
  fires on `popstate`; the orchestrator handles it exactly like a
  click.
- **Direct URL access** — the orchestrator's first-mount branch
  applies the destination anchor synchronously without animating, so
  the brain shows up in the right pose on cold load.
- **Locale switch mid-room** — handled by the `[locale]/layout.tsx`
  remount; orchestrator stays mounted in the root layout above the
  intl provider boundary, so its room state is preserved.
- **`prefers-reduced-motion: reduce`** — door hold collapses to 30ms,
  post-route budget to 80ms, and the persistent atmosphere's morph
  duration drops to 200ms. The room-id-coded color cue is preserved
  as information; only the temporal choreography is suppressed.
- **Touch devices** — `(hover: none)` shortens the standard door hold
  from 250ms to 100ms so a tap doesn't read as a stuck button.

## Tuning knobs

The single most useful place to tweak: `STANDARD_BUDGET_MS` and
`DEEP_BUDGET_MS` in `TransitionOrchestrator`. Pair changes here with
the per-door `STANDARD_DOOR_HOLD_MS` and `DESCENT_HOLD_MS` in
`RoomCard` so the post-route window is always **longer** than the
door hold (otherwise the orchestrator releases before the brain
finishes gliding).

For atmospheric tuning, edit the `ROOM_ATMOSPHERE` record in
`PersistentAtmosphere.tsx`. Each entry is a CSS `background-image`
string; Framer Motion tweens between them as the room id changes.
