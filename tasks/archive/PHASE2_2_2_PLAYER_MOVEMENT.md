# Phase 2.2: Player Movement (Construct 3)

**Status:** Complete (verify in browser preview)  
**Specialist:** Construct Gameplay Engineer  
**Depends on:** 2.1 (SparrowShip in Gameplay) — partial in Construct; 1.3 (MainMenu → Gameplay) — not done in Construct

---

## Objective

Implement player movement (milestone 2.2) for Construct 3. Gate: 4-way WASD move; clamped to play area; Speed 35 feel.

---

## Dependent Milestones (Construct Gaps)

| Milestone | Status | Action |
|-----------|--------|--------|
| **1.3 MainMenu** | Not done | Add MainMenu → Gameplay flow (Text/Button "New Game" + On click → Go to layout Gameplay) |
| **2.1 Single ship** | Partial | Add SparrowShip instance to Gameplay layout |

---

## Deliverables

1. **MainMenu → Gameplay flow** — If MainMenu has no way to reach Gameplay, add it (e.g. Text or Button "New Game" with On click → Go to layout Gameplay in MainMenu event sheet).

2. **SparrowShip instance** in Gameplay layout — Center or spawn point (e.g. 640, 360 for 1280×720).

3. **Keyboard object** — Add to project (global) if not present. Register in project.c3proj usedAddons.

4. **Movement logic** in Gameplay event sheet:
   - Every tick: Key W down → add to SparrowShip Y (negative = up/north); Key S → add positive Y; Key A → add negative X; Key D → add positive X
   - Speed 35 → ~350 px/s (or equivalent; verify feel in preview)
   - Clamp X to [margin, width - margin], Y to [margin, height - margin] (e.g. margin 16)

5. **Preview verification** — Load → MainMenu → New Game → Gameplay; move ship with WASD; ship stays on screen.

---

## Gate Criteria

- [x] 4-way move (WASD)
- [x] Clamped to play area (no exit screen)
- [x] Speed 35 feel (responsive, matches design lock)

---

## Canon

- [sparrow_design_lock.md](../docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) — Speed 35, top-down, north = up
- [design_system.md](../docs/design_system.md) — Viewport, ship controls
- [basic_gun_design_lock.md](../docs/concepts/basic_gun_design_lock.md) — For reference (fire in 2.3)

---

## Learnings to Check

- [construct_learnings.md](../docs/dev_standards/construct_learnings.md) — Input handling, event sheets, object types

---

## Project Path

Work in the main vimanas folder (project root). The project may have been modified by Construct; merge our content (Boot, MainMenu, Gameplay layouts; SparrowShip, etc.) as needed. If the project uses "Layout 1" instead of Boot/MainMenu/Gameplay, add our layout structure or adapt Layout 1 as Gameplay.
