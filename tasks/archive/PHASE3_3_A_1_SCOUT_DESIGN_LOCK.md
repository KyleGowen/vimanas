# Phase 3.1 — Scout Enemy Design Lock (3.A.1)

**Status:** Done (CEO approved 2026-03-05)  
**Type:** Design (Joint: Combat Systems + Visual Design)  
**Gate:** Combat Systems + Visual Design spec approved

---

## Deliverable

**Scout enemy design lock** — HP, defense, attack, movement pattern; insectoid silhouette per [art_style_guide](docs/art_style_guide.md). Output: `docs/concepts/scout_design_lock.md`.

**How to verify:** Read scout_design_lock.md; spec approved.

---

## Dependencies

- P0 Mocks: boss_mocks, enemy_hierarchy (approved)
- [enemy_hierarchy_and_ship_notes.md](docs/concepts/p0_mocks/p0_4_boss/enemy_hierarchy_and_ship_notes.md) — Scout tier 1 spec
- [sparrow_design_lock.md](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) — template structure
- [basic_gun_design_lock.md](docs/concepts/basic_gun_design_lock.md) — damage formula (player deals damage to Scout)

---

## Required Sections (per design lock template)

1. **P0 Mocks Considered** — boss_mocks, enemy_hierarchy; what each informs
2. **Stats Block** — HP, Defense, Attack (or equivalent); rationale; how player damage applies
3. **Movement pattern** — approach behavior; V-formation or wedge intent
4. **Visual Lock** — Silhouette, palette (amber/olive-green/dark brown per art_style_guide); top-down read
5. **Platform / Engine gotchas** — Reference [engine_learnings.md](docs/dev_standards/engine_learnings.md); sprite paths in `public/images/`
6. **References** — art_style_guide, design_system, enemy_hierarchy, boss_mocks
7. **Sign-Off** — Combat Systems, Visual Design, CEO
8. **Gate** — Gates 3.A.2 (Scout sprite sheet), 3.1 (First enemy)

---

## Delegation

| Specialist | Responsibility |
|------------|----------------|
| **Combat Systems** | Stats (HP, Defense, Attack); movement pattern; damage formula application |
| **Visual Design** | Silhouette; palette; P0 Mocks Considered table; top-down readability |

Director integrates outputs into single `scout_design_lock.md`.
