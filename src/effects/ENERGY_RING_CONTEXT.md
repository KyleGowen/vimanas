# Energy Ring — Context

**Purpose:** Sparrow secondary shot. Mana-based rings of energy that spawn at the muzzle, grow as they travel, mimicking a sonic screech.

---

## Design

- **Where:** Secondary fire (J / gamepad X). Consumes mana; regens when not firing.
- **Effect:** Elliptical rings with transparent centers. Cyan palette matching thruster/projectile beam. Transform-based gradient so ellipse and gradient align.
- **Behavior:** Rings travel straight north; radius grows over time; dissipate after 1 s.

---

## Files

| File | Role |
|------|------|
| `src/effects/energy-ring-effect.ts` | `drawEnergyRing()`, palette, config. Ellipse via transform + fill. |
| `src/projectiles/energy-ring-projectile.ts` | Projectile, radius growth, collision, draw. |
| `src/pools/energy-ring-pool.ts` | Object pool. |
| `src/weapons/sparrow-secondary.ts` | `fireSparrowSecondary()`, mana cost, fire rate. |

---

## Config (Sparrow)

| Param | Value | Notes |
|-------|-------|-------|
| Mana cost | 1 per ring | Configurable |
| Fire rate | 0.12 s | Cooldown |
| Lifetime | 1 s | Dissipates quickly |
| Speed | 240 px/s | Same as primary |
| Base radius | 16 px | At spawn |
| Growth rate | 100 px/s | Radius grows linearly |
| Ellipse | radiusX 1.4, radiusY 0.45 | Squatter, shorter |

---

## Elliptical Rendering

Use `ctx.translate` + `ctx.scale` so the radial gradient is transformed with the shape. Draw circle at origin, fill donut; avoid stroking an ellipse with a circular gradient (causes visual mismatch). See engine_learnings.md "Energy Ring VFX."

---

## Integration Points

| Consumer | Usage |
|----------|-------|
| `GameplayScene` | Secondary fire input, mana regen, ring spawn/update/collision/draw |
| `CombatHUD` | Mana bar from `ship.currentMana` |
| `SparrowShip` | `currentMana`, `manaRegenRate` (3/s) |

---

## Still true?

- [ ] Review when adding other ships' secondary weapons
