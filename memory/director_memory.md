# Director Memory

Process, delegation, CEO sign-offs, milestone completion. Director reads this before orchestrating.

## Entries

- **2026-03-05 (CEO):** Director LOVES test coverage. Unit and integration tests for everything possible. Add this to team personas. Engineering must cover all non-Unity, non-Construct code with tests.
- **2026-03-05 (Framework-free pivot):** CEO approved eliminating Unity and Construct. Build from scratch: HTML5 Canvas 2D, TypeScript, Vite. No game framework. Roadmap updated with new Phase 1 (1.1–1.10); Phase 2 tech reverted to Undone. Construct Gameplay Engineer → Full Stack Engineer.
- **2026-03-05 (CEO):** Design locks and plans must include "Platform / Engine gotchas" section referencing engine_learnings.md. For sprites: note image paths, asset loading.
- **2026-03-05 (2.1):** Sparrow entity complete. Full Stack Engineer (1b73a358) delivered SparrowShip class, GameplayScene refactor, unit tests. Gate verified.
- **2026-03-05 (2.2):** Player movement complete. Full Stack Engineer (ca46e2b3) moved movement into SparrowShip.update(); InputService → SparrowShip. Gate verified. CEO signed off.
- **2026-03-05 (2.3):** Basic gun complete. Full Stack Engineer (8c16ccfc) delivered PlayerProjectile, weaponStrength, BasicGun. CEO signed off. Projectile tuning: 240 px/s, 1.5s lifetime.
- **2026-03-05 (2.4):** Projectile pooling complete. Full Stack Engineer (af7dd28f) delivered ProjectilePool, PlayerProjectile.reset(). Added "How to verify 2.4" to roadmap before implementation per CEO request. CEO signed off.
- **2026-03-07 (4.2):** Parallax (Level 1 forest) CEO signed off. Full Stack Engineer (20473f16, 85982c7a) delivered ParallaxLayer, ParallaxController, GameplayScene integration. 4.2.1–4.2.7 Done. Current testable: parallax visible; Far/Mid/Near scroll behind ship.
- **2026-03-06 (5.1.A):** Forest parallax polish CEO signed off. Slice-from-mock tileable layers; crossfade edge blending; `npm run parallax:generate`. Roadmap 5.1.A Done.
- **2026-03-06 (CEO):** Ship/enemy on-screen size +20%. Sparrow 100×100, Scout 75×75, Boss 360×240. Parallax boss slowdown: 5s gradual deceleration when boss enters (ominous feel).
- **2026-03-07 (4.3):** Wave sequence complete. Full Stack Engineer (d24c3bf2) delivered per-transition delays, 5-wave cap, gameTime for pause, onLevelWavesComplete. Subagent contribution summary in tasks/active/PHASE4_4_3_WAVE_SEQUENCE.md.
- **2026-03-07 (4.1 bugs → learnings):** Three bugs fixed: (1) minY=maxY locked vertical movement; (2) player world Y caused "idle forward" drift; (3) "player stays in frame" ambiguous. Documented in engine_learnings.md, full_stack_engineer_memory, level_encounter_memory. Inject "Learnings to check: engine_learnings.md Vertical Scroll" when delegating scroll/movement work.
- **2026-03-05 (3.A.1):** Scout enemy design lock CEO approved. Combat Systems + Visual Design (initial); Level/Encounter (formation spec); Visual Design (top-down silhouette). Gates 3.A.2 (Scout sprite sheet), 3.1 (First enemy).
- **2026-03-05 (CEO):** Cannot verify Attack × 0.25 (Sparrow = 5) in 2.3 Basic gun—rely on unit tests for damage formula verification.
- **2026-03-05 (CEO):** When signing off: update roadmap (Status → Done) BEFORE committing and pushing. Never push without updating the roadmap.
- **2026-03-05 (CEO):** Verification cadence: For milestones touching gameplay or visuals, do not mark complete until browser preview has been run and gate criteria verified. Delegate verification to Full Stack Engineer (or shell) before updating roadmap.
- **2026-03-05 (CEO):** When Director thinks a milestone is complete → restart the game (`npm run dev`) so CEO can verify. When CEO signs off on a milestone → commit and push the code.
- **2026-03-04 (CEO):** At 3 back-and-forth interactions on a milestone without completion: break into smaller deliverables and try the first one instead. Make the breakdown very apparent to the CEO—list sub-deliverables, state which one first, confirm before proceeding.
- **2026-03-04 (CEO):** Director must track interaction count per milestone; use memory/acceptance_confidence.md to infer confidence in acceptance criteria; ask clarifying questions when criteria is vague or similar task types had high interaction count (avg ≥ 5).
- **2026-03-07 (CEO):** When CEO returns with change requests or bug reports, those MUST be delegated to specialists—do NOT implement directly. Route per routing table (e.g., code bugs → Full Stack Engineer).
- **2025-03-02 (CEO):** Director MUST always assign tasks to specialists; never do all the work itself. Route to specialist agents per routing table.
- **2025-03-02:** Director delegation rule: Use `mcp_task` (explore, generalPurpose, shell) to execute specialist work. Pass specialist persona in prompt. Document subagent use in ship_log. See agents/director.md "Delegation via Subagents."
- **2026-03-07 (Wolf plan):** Director NEVER executes specialist work. Every phase requiring design, code, or assets MUST be delegated via mcp_task. Even small tasks (copy image, add constant) go to specialists. Exception: trivial typo fixes only. Add to rules.
- **2026-03-07 (6.W Wolf):** Wolf ship complete. Design locks (Combat Systems + Visual Design), sprite (CEO image), tech (Full Stack Engineer). WolfShip: dual wing-tip primary, center-nose beam secondary, front-half shield, single center-back thruster. GameplayScene uses WolfShip for testing.
- **2025-03-03:** Roadmap rule: When CEO signs off a milestone, Director MUST update plans/roadmap.md immediately. Do not wait for reminder.
- **2025-03-03:** Learning rule: When a bug is fixed or workaround found, document in domain learnings doc (engine_learnings, platform_learnings, etc.). Inject "Learnings to check" into specialist prompts. Director session checklist includes learning capture.
- **2025-03-03:** Milestone completion triggers Session End: When a milestone is marked complete, Director MUST run the full Session End Checklist (memory save, learning capture, ship_log). Do not update roadmap without it.
- **2025-03-03 (CEO):** 2.A.1 Sparrow design lock approved. Gates 2.A.2 sprite sheet and 2.1 entity.
- **2025-03-03 (CEO):** 2.A.2 Sparrow sprite sheet approved. Gates 2.1 Sparrow entity.
- **2025-03-03 (CEO):** 2.A.3 Basic gun design approved. Gates 2.3 Basic gun and 2.4 Projectile pooling.

## Still true?

- [ ] Review and prune stale items periodically
