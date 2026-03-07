# Milestone 4.1: Vertical Scroll

**Status:** Re-implemented (ship in screen space) — awaiting CEO verification  
**Depends on:** 4.A.1 (Level 1 forest design — Done ✓)  
**Gate:** Smooth scroll; player in frame  
**Verification:** Level scrolls; player stays in frame (e.g. bottom third)

---

## Deliverable

Camera or world scrolls upward; player ship stays in frame (e.g. bottom third); smooth scroll rate. LevelScrollController or equivalent.

---

## Context

- **Current state:** Player at fixed screen coords; enemies spawn from top, move down; no scroll.
- **Target:** World scrolls upward; player stays in bottom third of viewport; smooth, frame-rate-independent scroll.
- **Design spec:** [docs/concepts/level_1_forest_design.md](../docs/concepts/level_1_forest_design.md) — parallax layers will use scroll ratios (4.2); scroll must be in place first.
- **Tech architecture:** [docs/tech_architecture.md](../docs/tech_architecture.md) — Canvas 2D, delta time, 60 FPS.

---

## Implementation Notes

- Introduce a world scroll offset that increases each frame (`scrollSpeed * deltaTime`).
- All gameplay entities (player, enemies, projectiles) use world coordinates.
- Render: `screenY = worldY - scrollOffset` (or equivalent).
- Player: fixed screen position (e.g. bottom third) → world Y = `scrollOffset + constant`.
- WaveSpawner: spawn at world Y above visible area; offscreen = past bottom of visible world.
- Delta-time multiply for frame-rate independence (engine_learnings).

---

## Delegation

**Specialist:** Full Stack Engineer  
**Subagent:** generalPurpose
