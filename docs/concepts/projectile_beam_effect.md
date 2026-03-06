# Projectile Beam Effect

**Procedural projectile VFX.** Canvas 2D, time-based animation, no sprite assets. Replaces pixelated rectangles with glowing beams oriented along velocity.

---

## Overview

Projectile beam effect draws an animated glowing beam behind projectiles. Beams extend along the velocity vector, with a bright core at the leading edge and a transparent tip at the trailing edge. Player and enemy projectiles use presets (PLAYER_PROJECTILE_BEAM_CONFIG, ENEMY_PROJECTILE_BEAM_CONFIG) or custom configs.

---

## Design

- **Rendering:** Procedural quads with linear gradients along the beam axis, drawn via Canvas 2D
- **Animation:** Sine/cosine of time drive length and width variation for looping flicker
- **Orientation:** Beam direction from velocity (vx, vy); if zero, fallback to (0, -1)
- **Performance:** Lightweight; no per-frame allocations; 60 FPS target
- **Collision:** Unchanged; AABB at center uses PROJECTILE_SIZE / ENEMY_PROJECTILE_SIZE

---

## Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `palette` | `{ core, mid, tip }` | required | Gradient colors. core = leading edge, tip = trailing/transparent |
| `length` | number | 24 | Beam length in pixels (half extends each side of center) |
| `width` | number | 6 | Beam width in pixels |
| `numSegments` | number | 3 | Number of overlapping beam layers |
| `lengthFreq` | number | 10 | Animation speed for length |
| `widthFreq` | number | 8 | Animation speed for width |

---

## Preset Mapping

Per [basic_gun_design_lock.md](basic_gun_design_lock.md) and [enemy_projectile_design_lock.md](enemy_projectile_design_lock.md):

| Faction | Glow | Hex | Preset |
|---------|------|-----|--------|
| Player | Cyan/blue | #00FFFF | PLAYER_PROJECTILE_BEAM_CONFIG |
| Enemy | Orange/amber | #FF8C00 | ENEMY_PROJECTILE_BEAM_CONFIG |

---

## Usage Pattern

1. Projectile calls `drawProjectileBeam(ctx, x, y, vx, vy, gameTime, config)` in draw() when gameTime is provided.
2. Gameplay scene passes `gameTime` as 4th arg to `projectile.draw(ctx, screenX, screenY, gameTime)`.
3. When gameTime is omitted (e.g. tests), projectiles fall back to drawRect for backward compat.

---

## Tuning

- **Longer beam:** Increase `length` (e.g. 30–40).
- **Shorter beam:** Decrease `length` (e.g. 16–20).
- **Thicker:** Increase `width` (e.g. 8–10).
- **Thinner:** Decrease `width` (e.g. 4–5).
- **Faster flicker:** Increase `lengthFreq` and `widthFreq`.

---

## Still true?

- [ ] Review when weapon variety expands (different weapons, powerups)
