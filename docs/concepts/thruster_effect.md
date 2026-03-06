# Thruster Effect

**Procedural ship propulsion VFX.** Canvas 2D, time-based animation, no sprite assets.

---

## Overview

Thruster effect draws an animated flame/energy plume behind ships. Each ship has its own Thruster instance with configurable palette, size, and position. Ships use presets (SPARROW_THRUSTER_CONFIG, etc.) or custom configs.

---

## Design

- **Rendering:** Procedural shapes (trapezoids) with linear gradients, drawn via Canvas 2D
- **Animation:** Sine/cosine of time drive height and width variation for looping flicker
- **Positioning:** Thruster originates at configurable X and Y offsets (fractions of sprite size); default center (0.5)
- **Performance:** Lightweight; no per-frame allocations; 60 FPS target

---

## Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `palette` | `{ core, mid, tip }` | required | Gradient colors. core = near ship, tip = far/transparent |
| `widthRatio` | number | 0.06 | Width as fraction of ship width |
| `heightRatio` | number | 0.396 | Length as fraction of ship height |
| `originXOffset` | number | 0.5 | Thruster center as fraction of width from left (0–1); 0.5 = center |
| `originYOffset` | number | 0.74 | Thruster origin as fraction of ship height (0–1) |
| `direction` | `'down' \| 'up'` | 'down' | Flame extends down (player) or up (enemies flying south) |
| `numSegments` | number | 4 | Number of overlapping flame layers |
| `heightFreq` | number | 10 | Animation speed for height |
| `widthFreq` | number | 8 | Animation speed for width |
| `drawOrder` | `'behind' \| 'inFront'` | 'inFront' | Draw before or after ship sprite |
| `northWidthScale` | number | 1 | When moving north (moveAxis.y < 0), scale width by this. Per-ship configurable. |
| `northHeightScale` | number | 1 | When moving north (moveAxis.y < 0), scale height by this. Per-ship configurable. |
| `southWidthScale` | number | 1 | When moving south (moveAxis.y > 0), scale width by this. Per-ship configurable. |
| `southHeightScale` | number | 1 | When moving south (moveAxis.y > 0), scale height by this. Per-ship configurable. |

---

## Ship Palette Mapping

Per [art_style_guide.md](../art_style_guide.md) — Ship Propulsion Glow Colors:

| Ship / Enemy | Glow | Hex | Preset |
|--------------|------|-----|--------|
| Sparrow | Cyan/blue | #00FFFF | SPARROW_THRUSTER_CONFIG |
| Turtle | Amber/gold | #FFBF00 | TURTLE_THRUSTER_CONFIG |
| Wolf | White/silver | — | WOLF_THRUSTER_CONFIG |
| Dragon | Orange/red | #FF4500 | DRAGON_THRUSTER_CONFIG |
| Scout (enemy) | Sickly green/yellow | #B8C900 | SCOUT_THRUSTER_CONFIG |

---

## Usage Pattern

1. Ship owns a `Thruster` instance created in constructor with a preset or custom config.
2. In `ship.draw(ctx, screenX?, screenY?, gameTime?)`, when `gameTime` is provided:
   - Draw ship sprite (or thruster first if `drawOrder === 'behind'`).
   - Call `thruster.draw(ctx, x, y, width, height, gameTime, moveAxis?)`. Pass `moveAxis` when the ship has movement input so north scaling applies when configured.
3. Pass `gameTime` from gameplay scene so thruster freezes when paused.

---

## Tuning

- **Narrower:** Decrease `widthRatio` (e.g. 0.04–0.06 for nozzle-sized).
- **Left/right placement:** Set `originXOffset` (e.g. 0.28 left, 0.72 right for dual thrusters).
- **Higher on nozzle:** Decrease `originYOffset` (e.g. 0.72–0.78).
- **Longer:** Increase `heightRatio` (e.g. 0.4–0.45).
- **Faster flicker:** Increase `heightFreq` and `widthFreq`.

---

## Still true?

- [ ] Review when ship roster expands (Turtle, Wolf, Dragon)
