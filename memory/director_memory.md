# Director Memory

Process, delegation, CEO sign-offs, milestone completion. Director reads this before orchestrating.

## Entries

### Core Rules

- **2025-03-02 (CEO):** Director MUST assign tasks to specialists; never do all the work itself. Route per routing table. Use `mcp_task` (explore, generalPurpose, shell); pass specialist persona; document subagent use in ship_log.
- **2026-03-07 (CEO):** Director NEVER executes specialist work. Every phase requiring design, code, or assets MUST be delegated via mcp_task. Exception: trivial typo fixes only.
- **2026-03-07 (CEO):** When CEO returns with change requests or bug reports, delegate to specialists—do NOT implement directly.
- **2025-03-03 (CEO):** When CEO signs off a milestone: update plans/roadmap.md BEFORE committing and pushing. Never push without updating the roadmap. Run full Session End Checklist (memory save, learning capture, ship_log).
- **2026-03-05 (CEO):** For milestones touching gameplay or visuals: run `npm run dev` so CEO can verify before marking complete. Delegate verification to Full Stack Engineer or shell.
- **2026-03-04 (CEO):** At 3 back-and-forth interactions without completion: break into smaller deliverables; list sub-deliverables; state which one first; confirm before proceeding.
- **2026-03-04 (CEO):** Track interaction count per milestone; use memory/acceptance_confidence.md; ask clarifying questions when criteria vague or similar tasks had avg ≥ 5 interactions.
- **2026-03-05 (CEO):** Director LOVES test coverage. Engineering must cover all code with tests.
- **2026-03-05 (CEO):** Design locks and plans must include "Platform / Engine gotchas" section referencing engine_learnings.md.

### Framework and Process

- **2026-03-05 (Framework-free pivot):** CEO approved eliminating Unity and Construct. HTML5 Canvas 2D, TypeScript, Vite. No game framework. Construct Gameplay Engineer → Full Stack Engineer.
- **2025-03-03:** Learning rule: When a bug is fixed or workaround found, document in domain learnings doc. Inject "Learnings to check" into specialist prompts.

### Recent Milestones

- **2026-03-10 (8.A.2):** Difficulty curve CEO signed off. Presets, HP/stagger/delay mapping, DIFFICULTY_CURVE context. Params not yet applied in code.
- **2026-03-10 (8.A.1):** Level spec schema CEO signed off. Expandable doc + context file (LEVEL_SPEC.md). designNotes, suggestion for CEO→specialist collaboration. Phase 8 implementation: level loader, WaveSpawner, parallax theme, timing, boss config, Level 1 migration.
- **2026-03-09 (9.A.1):** Hangar layout design CEO signed off. hangar_layout_design.md: ship display, stat display, upgrade panels, controller flow. Phase 8/9 swapped: Phase 8 = Level Design System; Phase 9 = Hangar. Next: Phase 8 (Level Design) or 9.A.2 (Upgrade economy).
- **2026-03-09 (Phase swap):** CEO reordered phases. When swapping phases: renumber all IDs; update Depends on in downstream phases; update design doc phase refs; update Asset & Design Pipeline table.
- **2026-03-07 (7.P.1):** Pilot–ship stat design lock approved. Ship = class, Pilot = subclass. Materials = currency. Unique abilities per pilot. See docs/concepts/pilot_ship_stat_design_lock.md.
- **2026-03-07 (6.H.2):** Test hardening CEO signed off. Coverage 59.65% → 79.44% statements. 442 unit + 11 integration tests.
- **2026-03-07 (6.S.1, 6.S.2):** Ship selection CEO signed off. Boot→ShipSelect→Gameplay; 4 ships; pick ship → correct ship in level. D7 testable. Next: Phase 7 (pilots).
- **2026-03-07 (6.H.3):** AI hygiene CEO signed off. Memory pruned; Unity/Construct refs removed; agent prompts trimmed; VIMANAS_PROJECT_INIT updated.
- **2026-03-07 (6.H.1):** Code cleanup CEO signed off. Lint clean; 328 tests pass; build succeeds.
- **2026-03-07 (6.D Dragon):** Dragon ship complete. DragonShip: homing crescent primary, charged ball secondary, meditating shield. GameplayScene default = Dragon.
- **2026-03-07 (6.W Wolf):** Wolf ship complete. WolfShip: dual wing-tip primary, beam secondary, front-half shield.
- **2026-03-07 (4.3):** Wave sequence complete. Per-transition delays, 5-wave cap, gameTime for pause.
- **2026-03-07 (4.2):** Parallax (Level 1 forest) CEO signed off. Far/Mid/Near scroll.
- **2026-03-07 (4.1):** Vertical scroll bugs fixed. Player ship uses screen Y; play area bounds screen-space. See engine_learnings.md "Vertical Scroll."
- **2026-03-06 (5.2):** ResultsScene: victory/defeat, Retry/Continue/Menu.
- **2026-03-06 (5.1):** CombatHUD: HP, mana, score, lives.
- **2026-03-05 (3.A.1):** Scout design lock CEO approved. Gates 3.A.2 sprite sheet, 3.1 First enemy.
- **2026-03-05 (2.1–2.4):** Sparrow entity, movement, basic gun, projectile pooling complete.
- **2025-03-03 (CEO):** 2.A.1–2.A.3 Sparrow design lock, sprite sheet, basic gun approved.

## Still true?

- [ ] Review and prune stale items periodically
