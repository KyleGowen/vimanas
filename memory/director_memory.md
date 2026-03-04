# Director Memory

Process, delegation, CEO sign-offs, milestone completion. Director reads this before orchestrating.

## Entries

- **2025-03-04 (CEO):** When engineering team pushes code for build checks: they must use the GitHub MCP to monitor the build and ensure it passes before saying a change is ready. Inject this into Unity Gameplay Engineer and Platform/Release prompts when delegating build-related work.
- **2025-03-04 (CI learnings):** CI builds for Linux (StandaloneLinux64), not macOS. Unity Personal: use serial extraction from .ulf; license.unity3d.com and Request Unity License workflow obsolete. See platform_learnings.md.
- **2026-03-04 (CI.1 loss):** Unity Personal license activation in GitHub Actions failed. Serial+creds → 401; ULF only → activation retries failed. Do not report CI.1 complete. Next attempt: Pro trial, Cloud Runner, self-hosted runner, or GameCI Discord. Full learnings in docs/dev_standards/platform_learnings.md "CI.1 Session Loss".
- **2026-03-04 (CEO):** At 3 back-and-forth interactions on a milestone without completion: break into smaller deliverables and try the first one instead. Make the breakdown very apparent to the CEO—list sub-deliverables, state which one first, confirm before proceeding.
- **2026-03-04 (CEO):** Design locks and plans must include "Platform / Unity gotchas" section referencing unity_learnings.md. For sprites in builds: note Resources path, textureType/spriteMode, mirroring if applicable.
- **2026-03-04 (CEO):** Verification cadence: For milestones touching gameplay or visuals, do not mark complete until Mac build has been run and gate criteria verified. Many issues (SpriteRenderer, Resources stripping, prefab drift) only appear in builds, not Editor. Delegate build verification to Unity Gameplay Engineer before updating roadmap.
- **2026-03-04 (CEO):** Director must track interaction count per milestone; use memory/acceptance_confidence.md to infer confidence in acceptance criteria; ask clarifying questions when criteria is vague or similar task types had high interaction count (avg ≥ 5).
- **2025-03-02 (CEO):** Director MUST always assign tasks to specialists; never do all the work itself. Route to specialist agents per routing table.
- **2025-03-02:** Director delegation rule: Use `mcp_task` (explore, generalPurpose, shell) to execute specialist work. Pass specialist persona in prompt. Document subagent use in ship_log. See agents/director.md "Delegation via Subagents."
- **2025-03-03:** Roadmap rule: When CEO signs off a milestone, Director MUST update plans/roadmap.md immediately. Do not wait for reminder.
- **2025-03-03:** Learning rule: When a bug is fixed or workaround found, document in domain learnings doc (unity_learnings, platform_learnings, etc.). Inject "Learnings to check" into specialist prompts. Director session checklist includes learning capture.
- **2025-03-03:** Milestone completion triggers Session End: When a milestone is marked complete, Director MUST run the full Session End Checklist (memory save, learning capture, ship_log). Do not update roadmap without it.
- **2025-03-03 (CEO):** Milestone 1.2 signed off. Boot → MainMenu transition verified. New Game → Gameplay deferred (rendering issue on macOS).
- **2025-03-03 (CEO):** Milestone 1.3 signed off. New Game → Gameplay; ship (UI representation) visible and controllable via WASD. GameplayUIController workaround for macOS SpriteRenderer rendering issue.
- **2025-03-03 (CEO):** Milestone 1.4 signed off. Fire (Space) works. Phase 1 complete.
- **2025-03-03 (CEO):** 2.A.1 Sparrow design lock approved. Gates 2.A.2 sprite sheet and 2.1 prefab.
- **2025-03-03 (CEO):** 2.A.2 Sparrow sprite sheet approved. Gates 2.1 prefab.
- **2026-03-04 (CEO):** 2.3 laser visibility not achieved. Multiple attempts (projectile mirror, fallback sprite, filtering) — CEO still sees only yellow muzzle flash. Session ended in disappointment. Document full failure in unity_learnings.md "Projectile mirror failure"; next attempt must verify in Editor first, add build-inclusive debug, and consider alternative approaches.
- **2025-03-03 (CEO):** 2.A.3 Basic gun design approved. Gates 2.3 Basic gun and 2.4 Projectile pooling.

## Still true?

- [ ] Review and prune stale items periodically
