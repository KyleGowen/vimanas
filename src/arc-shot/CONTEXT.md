# Arc Shot — Context

**Purpose:** Turtle primary weapon. Curved beam that shoots out in front of the ship, wider than the ship, dissipates quickly.

---

## Design

Per [turtle_primary_weapon_design_lock.md](../../docs/concepts/p0_mocks/p0_1_ships/turtle/turtle_primary_weapon_design_lock.md):

- **Shape:** Curved beam (quadratic Bezier) — arc/crescent in front of ship
- **Width:** 120 px (wider than ship)
- **Length:** 120 px forward extent
- **Duration:** 0.2 s — dissipates fairly quickly
- **Damage:** weaponStrength(Attack) × 1.15
- **Color:** Amber/gold (#FFBF00)

---

## Files

| File | Role |
|------|------|
| `arc-shot.ts` | ArcShot class, update, overlapsRect, draw |
| `arc-shot-effect.ts` | drawArcShot(), palette, Bezier curve |
| `../pools/arc-shot-pool.ts` | Object pool |
| `../weapons/turtle-primary-weapon.ts` | fireTurtlePrimary() |

---

## Integration

Arc shot will be integrated in 6.T.6 when Turtle entity is added to gameplay. Gameplay scene will need to:
- Use ArcShotPool instead of ProjectilePool for Turtle primary
- Call fireTurtlePrimary() on fire input
- Update arc shots; check overlapsRect() vs scouts/boss
- Draw arc shots with worldToScreenY for parallax
