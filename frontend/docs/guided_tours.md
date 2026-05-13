# Guided Tours

Tours are choreographed two-to-three-minute experiences in which the persistent brain animates through a sequence of region activations while narration scrolls beside it. Six tours ship in the current state.

## Tour structure

A tour is a list of scenes. Each scene specifies which regions are active and at what intensity, where the brain's transform should be, and what narration accompanies the moment. The player linearly interpolates between successive scenes by writing the new state into `useBrainStageStore`; the brain's own lerping loop carries the visual transition.

```ts
type TourScene = {
  id: string;
  duration: number;              // seconds at 1× playback
  narration: string;             // ~22-25 words per 10s scene
  activeRegions: Partial<Record<RegionId, number>>;  // 0-1 per region
  brainTransform: {
    position: [number, number, number];
    scale: number;
    rotation: [number, number, number];
  };
  lighting?: "cinematic" | "warm" | "clinical";
};

type Tour = {
  id: string;
  title: string;
  subtitle: string;
  blurb: string;
  estimatedDuration: number;
  continueHref?: string;
  continueLabel?: string;
  scenes: TourScene[];
};
```

## File layout

```
content/tours/
  index.ts                       # registry; controls index page order
  the-act-of-remembering.ts      # 12 scenes / 152s
  how-you-read-this-sentence.ts  # 14 scenes / 155s
  whats-still-you-when-you-stop-trying.ts  # 13 scenes / 150s
  when-something-matters.ts      # 13 scenes / 152s
  how-a-face-becomes-someone-you-know.ts   # 12 scenes / 145s
  hearing-music.ts               # 12 scenes / 152s

lib/
  tours.ts                       # Tour + TourScene types + sceneAtTime() helper

app/[locale]/tours/
  page.tsx                       # index of available tours
  [tourId]/page.tsx              # the player
```

## Narration pacing

Average reading speed in this contemplative register is approximately 130–150 words per minute. Each scene's narration should fit in the scene's `duration` at that pace.

- A 10-second scene: ~22–25 words.
- A 12-second scene: ~26–30 words.
- A 14-second scene (rare): ~30–35 words.

Total tour length: 120–180 seconds. Don't write tours longer than 3 minutes; users won't watch.

## Voice

Narration is in the site's restrained, lyrical register. Description and observation, not "imagine if …" or "did you know …" Brain regions named in the narration appear in the same scene's `activeRegions` so the image matches the text.

The closing scene of each tour earns its line. Lines that have landed well:

- *"None of this feels like reading. It feels like understanding. The mechanism is invisible from inside …"* (how-you-read-this-sentence)
- *"Memory is not an archive being read. It is a sculpture being re-sculpted."* (the-act-of-remembering)
- *"The work the self does when it isn't being asked to do anything is some of the most important work a self does."* (whats-still-you-when-you-stop-trying)

## The player

`app/[locale]/tours/[tourId]/page.tsx` is the player. Key behaviours:

- **Auto-advance.** A `requestAnimationFrame` loop accumulates elapsed seconds; `sceneAtTime(tour, elapsed)` returns the current scene index.
- **No scrubbing.** The tour is meant to unfold; seeking would undermine the pacing. Pause and Restart are available.
- **Reduced motion.** Honoured by leaving the brain at scene targets without intermediate lerping. Scene-to-scene becomes snaps.
- **Persistent brain.** The player drives the same brain canvas that lives on every other page. No second canvas.
- **End state.** Surfaces a "Continue exploring →" card pointing at the tour's `continueHref` (an Atlas page or Bridges section).

## Adding a new tour

1. Write `content/tours/<slug>.ts` exporting a `Tour` object.
2. Register it in `content/tours/index.ts` by import + push into the `tours` array. The index page picks it up automatically.
3. Add a tour entry to `lib/searchIndex.ts` (the `buildTourEntries` helper handles this — it iterates the existing `tours` array, so no change is needed unless you want extra keywords).
4. Make sure the regions named in narration actually appear in the corresponding scene's `activeRegions`.
5. Optionally cross-link from an Atlas page or Bridges section via the `relatedTours` field.

## Adding audio narration (deferred)

The brief envisioned optional audio narration with text/audio sync. The current player ships without audio. To add audio later:

1. Add an optional `audioSrc` field per scene (or per tour, with timing offsets per scene).
2. Add an audio toggle to the player UI. Use the Web Audio API for pre-recorded audio, or `SpeechSynthesisUtterance` as a fallback for browsers without recorded files.
3. Sync the scene clock to audio playback rather than to `requestAnimationFrame` elapsed time, so the visual stays aligned to spoken words.
4. The audio waveform near the progress bar is a nice-to-have, not a requirement.

For now, the text-only player is the canonical experience.

## Cross-references

- Tours → Atlas (each tour's `continueHref` lands on the most-relevant region's Atlas page)
- Tours → Bridges (the "Memory reconstruction" tour, DMN tour, and salience tour all link into their Bridges sections at the end)
- Tours → NeuroMusic Lab (the music tour links back to /music)
- Search palette → Tours (each tour is a `tour` kind entry in the index)
