# Phase 2.1: Sparrow Entity

**Status:** Done  
**Specialist:** Full Stack Engineer  
**Depends on:** 2.A.1 (Sparrow design lock), 2.A.2 (Sparrow sprite sheet) — both Done

---

## Objective

Extract the player ship into a SparrowShip class; position, sprite, draw in Gameplay scene; top-down (facing north); per [sparrow_design_lock](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md).

**Gate:** Ship visible; top-down; uses approved sprite; fires on Space.

---

## Current State

- GameplayScene has inline ship logic (position, sprite, movement, projectiles)
- Uses `public/images/ships/sparrow/sparrow_facing_n.png` (approved)
- Placeholder projectile (cyan rect) on Space
- No SparrowShip entity class

---

## Sub-Deliverables

| ID     | Deliverable | Description | Gate |
|--------|-------------|-------------|------|
| **2.1.1** | **SparrowShip class** | Create `SparrowShip` in `src/entities/` or `src/ships/`. Stats (HP 14, Defense 12, Attack 20, Mana 19, Speed 35) per design lock. Position (x, y). Sprite path for `sparrow_facing_n.png`. | Class exists; stats match design lock |
| **2.1.2** | **Sprite load and draw** | SparrowShip loads approved sprite via asset-loader. `draw(ctx, x, y)` renders top-down at position. Top-down = facing north (default sprite). | Ship draws at position; sprite visible |
| **2.1.3** | **GameplayScene integration** | Replace inline ship state with SparrowShip instance. Scene creates ship on enter, updates position (or delegates to ship), calls ship.draw(). Ship visible in gameplay. | Ship visible in Gameplay; no regression |
| **2.1.4** | **Fire on Space (placeholder)** | Space triggers placeholder projectile. Spawn at muzzle (ship position + offset). Cyan rect OK for 2.1; 2.3 delivers full basic gun. | Press Space → projectile visible |
| **2.1.5** | **Unit tests** | SparrowShip unit tests (construction, stats, draw). GameplayScene integration test (ship present, fire works). | Tests pass; coverage for new code |

---

## Delivery Order

1. 2.1.1 → 2.1.2 (class before draw)
2. 2.1.2 → 2.1.3 (draw before scene integration)
3. 2.1.3 → 2.1.4 (scene owns ship before fire wiring)
4. 2.1.4 → 2.1.5 (tests after implementation)

---

## References

- [sparrow_design_lock](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) — Stats, palette, propulsion
- [sparrow_sprite_sheet_spec](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md) — Pose list, asset paths
- [engine_learnings](docs/dev_standards/engine_learnings.md) — Asset paths `/images/ships/`, Canvas 2D
- [tech_architecture](docs/tech_architecture.md) — Folder layout, patterns

---

## Learnings to Check

- [docs/dev_standards/engine_learnings.md](docs/dev_standards/engine_learnings.md) — Asset loading, Canvas 2D, input
