# Phase 3.1 — First Enemy (Scout)

**Status:** In progress  
**Type:** Tech  
**Gate:** Scout appears; shoot to destroy

---

## Deliverable

**First enemy (Scout)** — ScoutEnemy in scene; Damageable (HP 15, Defense 1 per scout_design_lock); moves toward player (south); takes damage from player Projectile; OnDeath destroys.

**How to verify:** Scout appears; shoot to destroy.

---

## Dependencies

- 3.A.1 Scout design lock ✓
- 3.A.2 Scout sprite sheet ✓ (placeholder: public/images/enemies/scout_flying.png)

---

## Specs

- [scout_design_lock.md](docs/concepts/scout_design_lock.md) — HP 15, Defense 1, movement (from above, south), damage formula
- [basic_gun_design_lock.md](docs/concepts/basic_gun_design_lock.md) — actualDamage = Max(0.1, weaponStrength / targetDefense)

---

## Implementation Notes

1. **ScoutEnemy class** — Stats (hp, defense), position (x, y), sprite path `/images/enemies/scout_flying.png`, load/draw. Size ~48×48 or 64×64 (smaller than Sparrow 64×64).
2. **Movement** — Move south (negative y or toward bottom). Speed: moderate (~80–120 px/s). Use delta time.
3. **Damage** — On hit by PlayerProjectile: actualDamage = Max(0.1, projectile.damage / scout.defense). Subtract from hp. At 0 hp, destroy (remove from scene).
4. **Collision** — AABB: projectile vs Scout bounds. Projectile already has x, y, size. Scout has x, y, width, height.
5. **GameplayScene** — Spawn 1 Scout at top (e.g. center, y=50). Add to scene. Update: move south; check projectile hits; remove when dead.
6. **Unit tests** — ScoutEnemy damage application, bounds check.

---

## Learnings

- [engine_learnings.md](docs/dev_standards/engine_learnings.md)
