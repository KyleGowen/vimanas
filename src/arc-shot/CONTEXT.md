# Arc Shot — Context

**Purpose:** Turtle primary weapon. Curved beam that shoots out in front of the ship. Static; does not travel. Persists after hitting so it can hit multiple enemies; each enemy hit only once per arc.

---

## Design

Per [turtle_primary_weapon_design_lock.md](../../docs/concepts/p0_mocks/p0_1_ships/turtle/turtle_primary_weapon_design_lock.md) (base spec; values tuned in implementation):

- **Shape:** Curved beam (quadratic Bezier) — arc/crescent in front of ship
- **Muzzle:** Ship center-top (north-facing)
- **Mana cost:** 0 — primary is free

---

## Implementation Constants (Current)

| Constant | Value | Notes |
|----------|-------|-------|
| `TURTLE_PRIMARY_FIRE_RATE_S` | 0.4 s | Cooldown between shots (weapons/turtle-primary-weapon.ts) |
| `ARC_SHOT_DURATION_S` | 0.3125 s | Arc dissipates over this duration |
| `ARC_LENGTH_PX` | 160 px | Forward extent (hit detection + draw) |
| `ARC_WIDTH_PX` | 298 px | Span at widest (hit detection + draw) |
| `TURTLE_PRIMARY_DAMAGE_MULTIPLIER` | 1.15 | weaponStrength(Attack) × 1.15 |

---

## Hit Behavior

- **Arc persists after hit:** Does not disappear when it hits an enemy. Continues until duration expires.
- **One hit per enemy per arc:** Each arc tracks `hitTargets: Set<object>`. Before applying damage, check `!arc.hitTargets.has(enemy)`. On hit, `arc.hitTargets.add(enemy)`.
- **Hit detection:** Conservative AABB. Arc region: `x ± ARC_WIDTH_PX/2`, `y - ARC_LENGTH_PX` to `y`. Use `arc.overlapsRect(rectX, rectY, rectW, rectH)`.
- **Reset:** `ArcShot.reset()` clears `hitTargets` when arc is returned to pool.

---

## VFX (arc-shot-effect.ts)

### Palette (firey yellow/orange)

| Stop | Color | Notes |
|------|-------|-------|
| Core | #FFFFCC | Bright center |
| Edge | #FF8800 | Warm orange |
| Fade | rgba(255, 120, 0, 0) | Transparent |

### Draw Config

| Param | Value | Notes |
|-------|-------|-------|
| length | 160 px | Forward extent |
| width | 298 px | Span |
| segments | 16 | Bezier curve smoothness |
| numLayers | 4 | Overlapping strokes (thruster-style) |
| pulseFreq | 12 | Layer animation |

### Technique

- **Multiple layers:** 4 overlapping strokes, each with time-based `layerScale` and `widthScale` (sin/cos). Creates moving-energy feel like thrusters.
- **Band width:** `(4 + (numLayers - 1 - layer) * 3) * widthScale` — outer layers thicker, inner thinner. Scale ~0.85–1.0.
- **Glow:** `ctx.shadowBlur` 24–36 px, `shadowColor` palette.edge. Reset `shadowBlur = 0` after stroke.
- **Gradient:** Linear along arc length (0 → -length). Fade at ends, edge at 0.3/0.7, core at 0.5.
- **Bezier:** P0 = (-width/2, 0), P1 = (0, -length), P2 = (width/2, 0). North = up.

---

## Files

| File | Role |
|------|------|
| `arc-shot.ts` | ArcShot class, update, overlapsRect, draw, hitTargets |
| `arc-shot-effect.ts` | drawArcShot(), palette, Bezier, multi-layer stroke |
| `../pools/arc-shot-pool.ts` | Object pool (capacity 4) |
| `../weapons/turtle-primary-weapon.ts` | fireTurtlePrimary(), spawn options |

---

## Integration

| Consumer | Usage |
|----------|-------|
| `GameplayScene` | Fire input → fireTurtlePrimary() → ArcShotPool.get(); update arcs; collision vs scouts/boss (check hitTargets); draw with worldToScreenY |
| `TurtleShip` | Default ship; muzzle at ship center-top |

---

## Still true?

- [ ] Review when tuning arc feel or adding other arc-style weapons
