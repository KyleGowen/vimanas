# Shield Effect — Context

**Purpose:** Visual feedback when Sparrow holds shield (I / gamepad Y). Energy glow that outlines the ship silhouette instead of a generic circle.

---

## Design

- **Where:** Drawn by `SparrowShip.draw()` when `shieldActive` and `gameTime` provided.
- **Effect:** Sprite-outline glow via `ctx.shadowBlur` + `ctx.shadowColor`. When sprite is provided, the shadow follows the ship's alpha shape. When sprite is null (fallback rect), uses radial gradient circle.
- **Draw order:** Shield glow is drawn **before** the ship so the glow sits behind the sprite. Order: shield → ship → thruster.

---

## Implementation

| Technique | When | Notes |
|-----------|------|-------|
| `shadowBlur` + `drawImage` | Sprite provided | Shadow follows sprite alpha; no edge detection needed |
| Radial gradient circle | Sprite null | Fallback for rect placeholder before sprite loads |

---

## Config (Sparrow)

| Param | Value | Notes |
|-------|-------|-------|
| Palette | #00FFFF core, #0088CC mid | Cyan aether per art_style_guide |
| Opacity | 1 | Full opacity |
| outlineBlur | 18 px | Blur radius for sprite path |
| pulseFreq | 6 | Blur pulses with time |
| radiusScale | 1.2 | Circle fallback only |

---

## Integration Points

| Consumer | Usage |
|----------|-------|
| `SparrowShip` | Calls `drawShieldGlow(ctx, x, y, w, h, gameTime, config, this.sprite)` when shield active |
| `GameplayScene` | Sets `shieldActive` via `setShieldInput(isShieldPressed())`, consumes mana |

---

## Files

| File | Role |
|------|------|
| `src/effects/shield-effect.ts` | `drawShieldGlow()`, `ShieldEffectConfig`, `SPARROW_SHIELD_CONFIG` |
| `src/ships/sparrow-ship.ts` | Draw order, passes sprite to shield |

---

## Still true?

- [ ] Review opacity when tuning shield visibility (currently 1 for max visibility)
