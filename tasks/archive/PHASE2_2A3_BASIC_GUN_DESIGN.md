# Task: 2.A.3 Basic Gun Design

**Phase 2 · Milestone 2.A.3 · Director-assigned**

## Objective

Deliver the basic gun design lock. Gate: Combat Systems spec; 60 FPS in combat. Readable projectile VFX (bright core, trail) per art_style_guide.

## Deliverable

Single document locking:
- **Combat Systems:** Damage formula, fire rate, projectile speed; how ship Attack stat feeds in
- **Visual Design:** Readable projectile VFX (bright core, trail) per art_style_guide

## Output Path

`docs/concepts/basic_gun_design_lock.md`

## Canon

- [design_system.md](../docs/design_system.md) — Ship stats, weapons
- [art_style_guide.md](../docs/art_style_guide.md) — VFX language, projectile clarity
- [sparrow_design_lock.md](../docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) — Sparrow Attack 20; reference ship

## Current Implementation (for reference)

- `PlayerWeapon.cs`: fire rate 0.15s (6.67/s), fire offset
- `Projectile.cs`: speed 12, damage 5, lifetime 3s
- `Damageable.cs`: actualDamage = Max(0.1, damage / defense)

## Status

- [x] Combat Systems subagent launched
- [x] Visual Design subagent launched
- [x] Deliverable produced: docs/concepts/basic_gun_design_lock.md
- [x] Combat Systems sign-off
- [x] Visual Design sign-off
- [x] CEO approval 2025-03-03
- [x] Roadmap updated
