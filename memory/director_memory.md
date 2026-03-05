# Director Memory

Process, delegation, CEO sign-offs, milestone completion. Director reads this before orchestrating.

## Entries

- **2026-03-05 (CEO):** Director LOVES test coverage. Unit and integration tests for everything possible. Add this to team personas. Engineering must cover all non-Unity, non-Construct code with tests.
- **2026-03-05 (Framework-free pivot):** CEO approved eliminating Unity and Construct. Build from scratch: HTML5 Canvas 2D, TypeScript, Vite. No game framework. Roadmap updated with new Phase 1 (1.1–1.10); Phase 2 tech reverted to Undone. Construct Gameplay Engineer → Full Stack Engineer.
- **2026-03-05 (CEO):** Design locks and plans must include "Platform / Engine gotchas" section referencing engine_learnings.md. For sprites: note image paths, asset loading.
- **2026-03-05 (2.1):** Sparrow entity complete. Full Stack Engineer (1b73a358) delivered SparrowShip class, GameplayScene refactor, unit tests. Gate verified.
- **2026-03-05 (2.2):** Player movement complete. Full Stack Engineer (ca46e2b3) moved movement into SparrowShip.update(); InputService → SparrowShip. Gate verified.
- **2026-03-05 (CEO):** Verification cadence: For milestones touching gameplay or visuals, do not mark complete until browser preview has been run and gate criteria verified. Delegate verification to Full Stack Engineer (or shell) before updating roadmap.
- **2026-03-05 (CEO):** When Director thinks a milestone is complete → restart the game (`npm run dev`) so CEO can verify. When CEO signs off on a milestone → commit and push the code.
- **2026-03-04 (CEO):** At 3 back-and-forth interactions on a milestone without completion: break into smaller deliverables and try the first one instead. Make the breakdown very apparent to the CEO—list sub-deliverables, state which one first, confirm before proceeding.
- **2026-03-04 (CEO):** Director must track interaction count per milestone; use memory/acceptance_confidence.md to infer confidence in acceptance criteria; ask clarifying questions when criteria is vague or similar task types had high interaction count (avg ≥ 5).
- **2025-03-02 (CEO):** Director MUST always assign tasks to specialists; never do all the work itself. Route to specialist agents per routing table.
- **2025-03-02:** Director delegation rule: Use `mcp_task` (explore, generalPurpose, shell) to execute specialist work. Pass specialist persona in prompt. Document subagent use in ship_log. See agents/director.md "Delegation via Subagents."
- **2025-03-03:** Roadmap rule: When CEO signs off a milestone, Director MUST update plans/roadmap.md immediately. Do not wait for reminder.
- **2025-03-03:** Learning rule: When a bug is fixed or workaround found, document in domain learnings doc (engine_learnings, platform_learnings, etc.). Inject "Learnings to check" into specialist prompts. Director session checklist includes learning capture.
- **2025-03-03:** Milestone completion triggers Session End: When a milestone is marked complete, Director MUST run the full Session End Checklist (memory save, learning capture, ship_log). Do not update roadmap without it.
- **2025-03-03 (CEO):** 2.A.1 Sparrow design lock approved. Gates 2.A.2 sprite sheet and 2.1 entity.
- **2025-03-03 (CEO):** 2.A.2 Sparrow sprite sheet approved. Gates 2.1 Sparrow entity.
- **2025-03-03 (CEO):** 2.A.3 Basic gun design approved. Gates 2.3 Basic gun and 2.4 Projectile pooling.

## Still true?

- [ ] Review and prune stale items periodically
