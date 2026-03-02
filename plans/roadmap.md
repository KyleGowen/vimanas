# Vimanas Roadmap

## Current State

**Approved concept art (CEO OK):**

- **Ship mocks** — DONE. Four ships: Sparrow, Turtle, Wolf, Dragon. POCs in `docs/concepts/player_ship_*_poc.md`.
- **Pilot mocks** — DONE. Four pilots: Speed, Weapon, Defensive, Neutral. Kaladesh aesthetic, varied ages/ethnicities/genders. [pilot_mocks_deliverable.md](../docs/concepts/pilot_mocks_deliverable.md).

**Unapproved:**

- Level mocks, boss fight mocks, title screen, investor mocks — all require CEO sign-off before use.

**Tech build:**

- Boot scene, MainMenu, first playable ship (movement + gun), first enemy wave — implemented. See `docs/tech_architecture.md` for build/test.

---

## Interactive Demo Checkpoints

**When can a user test something?** Each checkpoint is the first moment a user can perform that level of interaction. Test as soon as the milestone is done.


| Checkpoint            | After milestone      | What to test                                                                        |
| --------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| **D1 — First input**  | 1.3 MainMenu         | Load game → Boot → MainMenu → Press Start / click New Game. First user interaction. |
| **D2 — Move**         | 2.2 Player movement  | Load → MainMenu → New Game → Move ship (WASD / stick).                              |
| **D3 — Move + shoot** | 2.3 Basic gun        | Load → MainMenu → New Game → Move and fire. First gameplay loop.                    |
| **D4 — Combat**       | 3.4 First wave       | Load → MainMenu → New Game → Fight wave of Scouts. Destroy all enemies.             |
| **D5 — Full level**   | 4.4 Boss placeholder | Load → MainMenu → New Game → Complete level (scroll, waves, boss).                  |
| **D6 — Results flow** | 5.2 Results screen   | Level complete → Results screen → Retry or Continue.                                |
| **D7 — Ship choice**  | 6.2 Ship selection   | Ship select before level → Pick ship → Play with chosen ship.                       |
| **D8 — Co-op**        | 9.1 Local 2-player   | Two controllers → Both players move and shoot.                                      |


**Current testable:** D4 (Boot → MainMenu → New Game → move, shoot, fight wave).

---

## Phase 0: Investor Pitch Mocks (CEO Sign-Off Required)

Each deliverable is a standalone concept/mock. **No mock is approved until the CEO explicitly OKs it.** Visual Design and Narrative agents produce; Director submits for CEO review.


| #    | Deliverable           | Status  | CEO OK | Notes                                                                                                    |
| ---- | --------------------- | ------- | ------ | -------------------------------------------------------------------------------------------------------- |
| P0.1 | **Ship mocks**        | DONE    | Yes    | Four ships. Code names: Sparrow, Turtle, Wolf, Dragon.                                                   |
| P0.2 | **Pilot mocks**       | DONE    | Yes    | Four pilots: Speed, Weapon, Defensive, Neutral. Kaladesh aesthetic, varied ages/ethnicities/genders.     |
| P0.3 | **Level mocks**       | Ready   | —      | Level 1 (forest), Level 2 (industrial), Level 3 (sky). Parallax, terrain, top-down. [level_mocks_deliverable.md](../docs/concepts/level_mocks_deliverable.md) |
| P0.4 | **Boss fight mocks**  | Pending | —      | Level 1 boss; level 2 boss. Insectoid, biomechanical. Firing patterns, phases.                           |
| P0.5 | **Title screen mock** | Pending | —      | PRESS START, 1–4 players. Per `title_screen_concept.md`.                                                 |


**Gate for each:** CEO reviews and approves. If rejected, revise and resubmit.

---

## Phase 1: Foundation (Project Setup)


| #   | Milestone          | Status  | Gate                            |
| --- | ------------------ | ------- | ------------------------------- |
| 1.1 | Unity project init | Pending | Open in Unity 6; build succeeds |
| 1.2 | Boot scene         | Pending | Boot → MainMenu transition      |
| 1.3 | MainMenu           | Pending | New Game → Gameplay             |
| 1.4 | Input system       | Pending | WASD/controller + fire          |


---

## Phase 2: First Playable (Single Ship)


| #   | Milestone                    | Status  | Gate                               |
| --- | ---------------------------- | ------- | ---------------------------------- |
| 2.1 | Single ship prefab (Sparrow) | Pending | Ship in scene; collider; top-down  |
| 2.2 | Player movement              | Pending | 4-way move; clamped to play area   |
| 2.3 | Basic gun                    | Pending | Projectiles spawn, travel, despawn |
| 2.4 | Projectile pooling           | Pending | No allocations during fire         |


---

## Phase 3: Combat


| #   | Milestone           | Status  | Gate                                   |
| --- | ------------------- | ------- | -------------------------------------- |
| 3.1 | First enemy (Scout) | Pending | Takes damage; destroyed                |
| 3.2 | Enemy projectiles   | Pending | Player takes damage; formula verified  |
| 3.3 | Enemy pooling       | Pending | 50+ enemies; no GC spikes              |
| 3.4 | First wave          | Pending | 5–7 Scouts; V-formation; wave complete |


---

## Phase 4: First Level


| #   | Milestone                      | Status  | Gate                            |
| --- | ------------------------------ | ------- | ------------------------------- |
| 4.1 | Vertical scroll                | Pending | Smooth scroll; player in frame  |
| 4.2 | Parallax (Level 1 — forest) | Pending | 4 layers; depth; no z-fight     |
| 4.3 | Wave sequence                  | Pending | 3–5 waves; spacing              |
| 4.4 | Boss placeholder               | Pending | HP bar; defeat → level complete |


---

## Phase 5: HUD and Basic UI


| #   | Milestone      | Status  | Gate                           |
| --- | -------------- | ------- | ------------------------------ |
| 5.1 | Combat HUD     | Pending | HP, mana, score, lives         |
| 5.2 | Results screen | Pending | Level complete; Retry/Continue |


---

## Phase 6: All Four Ships


| #   | Milestone                  | Status  | Gate                             |
| --- | -------------------------- | ------- | -------------------------------- |
| 6.1 | Ship ScriptableObjects     | Pending | 4 ships; stats per design system |
| 6.2 | Ship selection (pre-level) | Pending | Pick ship; correct ship in level |
| 6.3 | Ship-specific weapons      | Pending | Each ship feels distinct         |


---

## Phase 7: Hangar and Upgrades


| #   | Milestone              | Status  | Gate                             |
| --- | ---------------------- | ------- | -------------------------------- |
| 7.1 | Hangar scene           | Pending | Ship display; stat display; flow |
| 7.2 | Upgrade system (stats) | Pending | Spend currency; persist          |
| 7.3 | Weapon/bomb upgrades   | Pending | Strong gun; bomb; upgrades apply |


---

## Phase 8: Progression and Meta


| #   | Milestone             | Status  | Gate                             |
| --- | --------------------- | ------- | -------------------------------- |
| 8.1 | XP and pilot leveling | Pending | Kill → XP → level-up → modifiers |
| 8.2 | Currency and loot     | Pending | Enemies drop; pickups            |
| 8.3 | Multiple levels       | Pending | Level 2; unlock; ramp difficulty |
| 8.4 | Save system           | Pending | Progress persists on quit        |


---

## Phase 9: Multiplayer (2–4 Players)


| #   | Milestone          | Status  | Gate                           |
| --- | ------------------ | ------- | ------------------------------ |
| 9.1 | Local 2-player     | Pending | 2 ships; no input conflict     |
| 9.2 | Ship combining (2) | Pending | Pilot + gunner; merge/split    |
| 9.3 | 3-player combine   | Pending | Pilot + gunner + shielder      |
| 9.4 | 4-player combine   | Pending | 2 gunners, 1 shielder, 1 pilot |
| 9.5 | Role swap          | Pending | Swap roles during combined     |


---

## Phase 10: Content and Polish


| #    | Milestone                   | Status  | Gate                            |
| ---- | --------------------------- | ------- | ------------------------------- |
| 10.1 | Enemy tiers (Medium, Elite) | Pending | Distinct HP, behaviors          |
| 10.2 | Boss variety                | Pending | 2+ phases per boss              |
| 10.3 | VFX pass                    | Pending | Projectiles, explosions; 60 FPS |
| 10.4 | Audio                       | Pending | SFX, music; no pops             |
| 10.5 | Narrative integration       | Pending | Briefings, pilot bios           |


---

## Phase 11: Platform and Release


| #    | Milestone         | Status  | Gate                        |
| ---- | ----------------- | ------- | --------------------------- |
| 11.1 | Steam build       | Pending | Runs on Steam               |
| 11.2 | Mac build         | Pending | Full playthrough on Mac     |
| 11.3 | Switch build      | Pending | Handheld 720p; docked 1080p |
| 11.4 | CI/CD             | Pending | Push → build artifact       |
| 11.5 | Release checklist | Pending | QA; store assets; submit    |


---

## Rules

- **Investor mocks (Phase 0):** Each mock is a standalone deliverable. CEO must explicitly approve before use in pitch or production.
- **Tech milestones:** Gates must pass before proceeding to dependent work.
- **Subagent contribution summary:** Per milestone plan; document which agent did what when a milestone completes. Director must use `mcp_task` to delegate—see [agents/director.md](../agents/director.md).

---

## Still true?

- Update as milestones complete or CEO approves mocks
- Prune stale entries periodically

