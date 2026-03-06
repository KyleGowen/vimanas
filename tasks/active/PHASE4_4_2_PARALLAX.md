# Phase 4.2: Parallax (Level 1 — Forest)

**Status:** Pending  
**Specialist:** Full Stack Engineer  
**Depends on:** 4.1 (Vertical scroll), 4.A.2 (Parallax assets) — both Done ✓

---

## Objective

Implement 4 parallax layers for Level 1 (forest); depth order; sprites from 4.A.2; no z-fight. ParallaxController or layer components per [level_1_forest_design](docs/concepts/level_1_forest_design.md).

**Gate:** 4 layers visible; correct depth order; no z-fight.

---

## Current State

- **4.A.2 (Parallax assets):** Done ✓ — `parallax_far.png`, `parallax_mid.png`, `parallax_near.png` in `public/images/level1/`
- **4.1 (Vertical scroll):** LevelScrollController exists; provides `getScrollOffset()`, `worldToScreenY()`
- **GameplayScene:** Does not yet use LevelScrollController; fixed screen coordinates
- **Play plane:** Ships, projectiles, enemies — no parallax (depth 4, front)

---

## Parallax Layer Spec (from level_1_forest_design.md)

| Layer      | Content                    | Scroll Speed Ratio | Depth Order |
|------------|----------------------------|--------------------|-------------|
| Far        | Distant canopy, sky gaps   | 0.3x               | 1 (back)   |
| Mid        | Dense tree tops            | 0.6x               | 2           |
| Near       | Leaves, branches, paths    | 1.0x               | 3           |
| Play plane | Ships, projectiles, enemies| N/A                | 4 (front)   |

---

## Sub-Deliverables

| ID     | Deliverable | Description | Gate |
|--------|-------------|-------------|------|
| **4.2.1** | **ParallaxLayer component** | Single layer: loads sprite, draws at offset from `scrollRatio × scrollOffset`; configurable depth. Per level_1_forest_design. | Layer draws at correct offset for given scroll |
| **4.2.2** | **ParallaxController** | Orchestrates layers; receives scrollOffset from LevelScrollController; draws in depth order (Far → Mid → Near). | Layers draw in correct order |
| **4.2.3** | **Far layer integration** | Load `parallax_far.png`; add Far layer (0.3x); depth 1. Asset path `/images/level1/parallax_far.png`. | Far layer visible; scrolls at 0.3x |
| **4.2.4** | **Mid layer integration** | Load `parallax_mid.png`; add Mid layer (0.6x); depth 2. Asset path `/images/level1/parallax_mid.png`. | Mid layer visible; scrolls at 0.6x |
| **4.2.5** | **Near layer integration** | Load `parallax_near.png`; add Near layer (1.0x); depth 3. Asset path `/images/level1/parallax_near.png`. | Near layer visible; scrolls at 1.0x |
| **4.2.6** | **Z-fight prevention & seamless wrap** | No visible seams; no z-fight; 60 FPS. Tile or repeat as needed per asset dimensions. | No seams; no z-fight; smooth |
| **4.2.7** | **Unit tests** | ParallaxLayer; ParallaxController; scroll integration. | Tests pass |

---

## Delivery Order

1. 4.2.1 → ParallaxLayer component (foundation)
2. 4.2.2 → ParallaxController (orchestration)
3. 4.2.3, 4.2.4, 4.2.5 → Far, Mid, Near layers (can be done in parallel after 4.2.2)
4. 4.2.6 → Z-fight & wrap (polish)
5. 4.2.7 → Unit tests (verification)

---

## References

- [level_1_forest_design](docs/concepts/level_1_forest_design.md) — Parallax layers, scroll ratios, palette
- [level_mocks_deliverable](docs/concepts/p0_mocks/p0_3_levels/level_mocks_deliverable.md) — Visual reference
- [engine_learnings](docs/dev_standards/engine_learnings.md) — Asset paths, Canvas 2D
- [tech_architecture](docs/tech_architecture.md) — Folder layout, patterns

---

## Learnings to Check

- [docs/dev_standards/engine_learnings.md](docs/dev_standards/engine_learnings.md) — Asset loading, Canvas 2D, image paths (`/images/...` from public root)
