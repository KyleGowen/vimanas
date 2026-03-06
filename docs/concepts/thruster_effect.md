# Thruster Effect

**Procedural ship propulsion VFX.** Canvas 2D, time-based animation, no sprite assets.

---

## Overview

Thruster effect draws an animated flame/energy plume behind ships. Each ship has its own Thruster instance with configurable palette, size, and position. Ships use presets (SPARROW_THRUSTER_CONFIG, etc.) or custom configs.

---

## Design

- **Rendering:** Procedural shapes (trapezoids) with linear gradients, drawn via Canvas 2D
- **Animation:** Sine/cosine of time drive height and width variation for looping flicker
- **Positioning:** Thruster originates at configurable Y offset (fraction of ship height), centered horizontally
- **Performance:** Lightweight; no per-frame allocations; 60 FPS target

---

## Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `palette` | `{ core, mid, tip }` | required | Gradient colors. core = near ship, tip = far/transparent |
| `widthRatio` | number | 0.06 | Width as fraction of ship width |
| `heightRatio` | number | 0.396 | Length as fraction of ship height |
| `originYOffset` | number | 0.74 | Top of thruster as fraction of ship height (0–1) |
| `numSegments` | number | 4 | Number of overlapping flame layers |
| `heightFreq` | number | 10 | Animation speed for height |
| `widthFreq` | number | 8 | Animation speed for width |
| `drawOrder` | `'behind' \| 'inFront'` | 'inFront' | Draw before or after ship sprite |

---

## Ship Palette Mapping

Per [art_style_guide.md](../art_style_guide.md) — Ship Propulsion Glow Colors:

| Ship | Glow | Hex | Preset |
|------|------|-----|--------|
| Sparrow | Cyan/blue | #00FFFF | SPARROW_THRUSTER_CONFIG |
| Turtle | Amber/gold | #FFBF00 | TURTLE_THRUSTER_CONFIG |
| Wolf | White/silver | — | WOLF_THRUSTER_CONFIG |
| Dragon | Orange/red | #FF4500 | DRAGON_THRUSTER_CONFIG |

---

## Usage Pattern

1. Ship owns a `Thruster` instance created in constructor with a preset or custom config.
2. In `ship.draw(ctx, screenX?, screenY?, gameTime?)`, when `gameTime` is provided:
   - Draw ship sprite (or thruster first if `drawOrder === 'behind'`).
   - Call `thruster.draw(ctx, x, y, width, height, gameTime)`.
3. Pass `gameTime` from gameplay scene so thruster freezes when paused.

---

## Tuning

- **Narrower:** Decrease `widthRatio` (e.g. 0.04–0.06 for nozzle-sized).
- **Higher on nozzle:** Decrease `originYOffset` (e.g. 0.72–0.78).
- **Longer:** Increase `heightRatio` (e.g. 0.4–0.45).
- **Faster flicker:** Increase `heightFreq` and `widthFreq`.

---

## Still true?

- [ ] Review when ship roster expands (Turtle, Wolf, Dragon)
