# Atmospheric depth system

Three locked layers add depth without ornament:

1. **Vertical wash** on `body` — invisible-by-design gradient navy → slightly
   violet navy. Felt as depth, never consciously seen.
2. **Film grain overlay** — 4% opacity inline-SVG noise tinted bone-cream,
   `mix-blend-overlay`, fixed across the viewport. Drops to 2% under
   reduced-motion.
3. **`<AtmosphericGlow>`** — composable radial light pools, three presets,
   placed surgically in exactly six locations.

That's the system. **No other gradient backgrounds anywhere.** No
glassmorphism. No mesh gradients. No hue cycling.

## Layer 1 — body wash

In `globals.css`:

```css
:root {
  --page-bg-direction: 180deg;
  --page-bg-start: #0a1428;
  --page-bg-mid:   #0d162e;
  --page-bg-end:   #11192e;
}

body {
  background: linear-gradient(
    var(--page-bg-direction),
    var(--page-bg-start) 0%,
    var(--page-bg-mid)   50%,
    var(--page-bg-end)   100%
  );
  background-attachment: fixed;
}
```

`background-attachment: fixed` keeps the gradient as a single atmospheric
wash regardless of page length. Pages that want a horizontal flow (the
About long-form essay, for instance) can override `--page-bg-direction`
at their root element. **Don't abuse this** — the default is correct for
~95% of pages.

The shift is intentionally tiny. Test: a viewer describing the site
should say *"the background is dark navy,"* not *"the background has a
gradient."*

## Layer 2 — film grain

`components/atmospheric/FilmGrain.tsx`. Rendered once in `app/layout.tsx`
as a sibling of `{children}`. ~1KB inline SVG noise, no JS, no animation,
no layout cost.

Key details:
- `fixed inset-0` — film grain is on the *lens*, not on what's filmed
- `z-[1000]` — above the brain canvas
- `pointer-events: none` — never blocks input
- `mix-blend-overlay` — grain warms the navy instead of producing harsh white
- bone-cream tint (`0.95, 0.91, 0.85`) — reads as material, not digital
- 4% opacity (`motion-safe`); 2% opacity (`motion-reduce`)

A tiled-PNG fallback is documented in the same file in case the SVG ever
gets flagged on low-end devices.

## Layer 3 — AtmosphericGlow

`components/atmospheric/AtmosphericGlow.tsx`.

Three presets only:

| Preset | Mood | Default opacities (medium) | Position | Animate? |
|--------|------|-----------------------------|----------|----------|
| `amber-lamp` | Warm light from above. The "1920s research lab" anchor. | `0.15 / 0.05` | Configurable | Allowed |
| `cool-cathedral` | Dual-source cyan + oxblood. Ambitious, cinematic. Stained-glass feel. | `0.10 / 0.06` | **Fixed** (30% 20% + 80% 90%) — ignores `position` | Allowed |
| `oxblood-ember` | Single warm/dark accent. Used only for serious moments. | `0.12 / 0.04` | Configurable | Allowed |

**Position mapping** (`top`, `top-left`, `top-right`, `center`, `bottom`,
`bottom-left`, `bottom-right`) maps to CSS `radial-gradient` `at X% Y%`
values defined in the component.

**Intensity multipliers** apply to both opacities:
- `subtle` → ×0.6
- `medium` → ×1.0
- `pronounced` → ×1.4

**Reduced-motion behavior**: `animate` is ignored, and `intensity` drops
one step (`pronounced` → `medium`, `medium` → `subtle`, `subtle` stays
`subtle`).

**Animate soft cap**: module-level instance counter; mounting a 3rd
animated glow on the same page surfaces a dev console warning. Static
glows are unlimited.

## The six approved glow placements

| Location | Preset | Position | Intensity | Animate |
|----------|--------|----------|-----------|---------|
| Home — Shot 1 (cold open hero) | `amber-lamp` | `top` | `medium` | ✓ |
| Home — Shot 3 (three rooms) | `cool-cathedral` | (fixed) | `subtle` | — |
| Brain Mirror — reveal moment | `amber-lamp` | `top` | `subtle` (→`pronounced` post-prediction) | — |
| NeuroMusic Lab — player section | `cool-cathedral` | (fixed) | `subtle` | — |
| Cross-Cultural Brain — entry pinned section | `oxblood-ember` | `center` | `medium` | — |
| About — closing line | `amber-lamp` | `bottom` | `subtle` | ✓ |

**Total animated glows**: 2 (cap met exactly). **Total static glows**: 4.

**These are the only glows.** If a page is not in this list, it gets the
wash + grain only. Restraint is the system.

### Why each

- *Home hero amber-lamp top* — sets the lab/research mood the moment you arrive.
- *Home three-rooms cool-cathedral subtle* — dual-source feels like
  three doorways opening to three rooms.
- *Brain Mirror reveal* — amber warms when the brain "warms" with the user's
  input; the glow brightens with prediction confidence.
- *NeuroMusic Lab cool-cathedral* — cyan + oxblood at left/right of frame
  naturally suggests left/right channels without being literal.
- *Cross-Cultural oxblood-ember* — oxblood signals weight: look closer,
  the model is about to fail in a meaningful way.
- *About closing amber-lamp bottom animate* — the page closes with warmth
  and a slow breath.

## Anti-drift safeguards

- **No new gradient utilities in Tailwind.** Gradients live in two places
  only: the body wash (CSS var system) and `AtmosphericGlow` presets.
- **No inline `background: linear-gradient(...)`** in component code.
- **No inline `background: radial-gradient(...)`** anywhere except inside
  `AtmosphericGlow` itself.
- **New atmospheric needs** require adding a new preset to the component
  (and a corresponding row in this doc), not one-off CSS.

If you find yourself wanting a seventh glow placement, the right question
is: does this page need *less* content, not *more* atmosphere?

## Performance

- Body wash: pure CSS, no cost.
- Film grain: one fixed-position div with an inline-SVG `data:` URL. ~1KB
  payload. No JS, no animation, no layout cost.
- AtmosphericGlow (static): pure CSS radial-gradient. No cost.
- AtmosphericGlow (animated): GPU-accelerated `opacity` animation only.
  Never animates `background-color` or `filter`.

Lighthouse Performance should not move more than ±2 points after this
system lands.

## Testing

`/test-atmospherics` — debug-only harness to toggle preset / intensity /
animate. Use to verify contrast against the brightest glow point. Not
linked in the public nav.
