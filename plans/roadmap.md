# Vimanas Roadmap

## Current State

**Approved concept art (CEO OK):**

- **Ship mocks** — DONE. Four ships: Sparrow, Turtle, Wolf, Dragon. Each in own subdir. Pilot-style mocks canonical (realistic illustrated, matches pilots). [p0_1_ships/](../docs/concepts/p0_mocks/p0_1_ships/). **CEO approved 2025-03-02.**
- **Pilot mocks** — DONE. Four pilots: Speed, Weapon, Defensive, Neutral. Kaladesh aesthetic, varied ages/ethnicities/genders. [pilot_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md).
- **Boss fight mocks** — DONE. Root-Seeker (forest) + Sparrow, Conduit-Crawler (industrial) + Dragon. [boss_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_4_boss/boss_mocks_deliverable.md).
- **Title screen mock** — DONE. Single mock: layered sky, VIMANAS title, four ships with propulsion glow, PRESS START • 1–4 PLAYERS. [title_screen_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md). **CEO approved 2025-03-02.**
- **Sample narrative** — DONE. Beginning premise and setting. Opening to the story. [sample_narrative.md](../docs/concepts/p0_mocks/p0_6_narrative/sample_narrative.md). **CEO approved 2025-03-02.**

**Unapproved:**

- Level mocks, investor mocks — all require CEO sign-off before use.

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


**Current testable:** Boot → MainMenu → New Game → Gameplay. Ship visible, movable (WASD), fires (Space). Phase 1 complete. D1–D2 achieved. D4 deferred.

---

## Asset & Design Pipeline (Summary)

Sub-milestones for **assets** (sprite sheets, UI, VFX, audio) and **design** (stats, behaviors, gameplay) are listed under each phase. Key streams:

| Stream | Phases | Focus |
| ------ | ------ | ----- |
| **Ships** | 2, 6 | Sparrow → Turtle, Wolf, Dragon; stats, weapons, sprite sheets per [sparrow_sprite_sheet_spec](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md) |
| **Pilots** | 6, 8 | Portraits, modifiers, pairing; XP/level design; per [pilot_mocks](docs/concepts/p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md) |
| **Enemies** | 3, 10 | Scout → Medium, Elite; insectoid palette; behaviors |
| **Levels** | 4, 8 | Forest, industrial; parallax; wave sequences |
| **Bosses** | 4, 10 | Placeholder → Root-Seeker, Conduit-Crawler; 2+ phases |
| **UI** | 5, 6, 7 | HUD, results, ship select, hangar; ornate inventor-fair |
| **Gameplay** | 2–10 | Weapons, combining, upgrades, progression, VFX |

---

## Phase 0: Investor Pitch Mocks (CEO Sign-Off Required)

Each deliverable is a standalone concept/mock. **No mock is approved until the CEO explicitly OKs it.** Visual Design and Narrative agents produce; Director submits for CEO review.


| #    | Deliverable           | Status  | CEO OK | Notes                                                                                                                                                         |
| ---- | --------------------- | ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0.1 | **Ship mocks**        | DONE    | Yes    | Four ships. Code names: Sparrow, Turtle, Wolf, Dragon.                                                                                                        |
| P0.2 | **Pilot mocks**       | DONE    | Yes    | Four pilots: Speed, Weapon, Defensive, Neutral. Kaladesh aesthetic, varied ages/ethnicities/genders.                                                          |
| P0.3 | **Level mocks**       | DONE    | —      | Level 1 (forest), Level 2 (industrial), Level 3 (sky). Parallax, terrain, top-down. [level_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_3_levels/level_mocks_deliverable.md) |
| P0.4 | **Boss fight mocks**  | DONE    | Yes     | Root-Seeker + Sparrow + Forest; Conduit-Crawler + Dragon + Industrial. [boss_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_4_boss/boss_mocks_deliverable.md) |
| P0.5 | **Title screen mock** | DONE    | Yes    | PRESS START, 1–4 players. Per [title_screen_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md). CEO approved 2025-03-02.                    |
| P0.6 | **Sample narrative**   | DONE    | Yes    | Beginning premise and setting. Opening to the story. [sample_narrative.md](../docs/concepts/p0_mocks/p0_6_narrative/sample_narrative.md). CEO approved 2025-03-02.                                                                 |


**Gate for each:** CEO reviews and approves. If rejected, revise and resubmit.

---

## Phase 1: Foundation (Project Setup)

**Gate check:** 2025-03-03. See `tasks/active/PHASE1_GATE_CHECK.md`.

| #   | Milestone          | Status | Gate                            |
| --- | ------------------ | ------ | ------------------------------- |
| 1.1 | Unity project init | Done   | Open in Unity 6; build succeeds |
| 1.2 | Boot scene         | Done   | Boot → MainMenu transition      |
| 1.3 | MainMenu           | Done   | New Game → Gameplay                           |
| 1.4 | Input system       | Done   | WASD/controller + fire          |


---

## Phase 2: First Playable (Single Ship)

**Rule: Approved resources only.** Do not add sprites to the game until they are derived from CEO-approved mocks and pass gate. Use approved placeholders until asset sub-milestones complete.

**Delivery order:** Tech and asset milestones interweaved by dependency. Design and approved assets gate implementation; prefab uses approved sprite from 2.A.2.

| Order | ID   | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 2.A.1 | Design | **Sparrow design lock** — Stats (HP, Defense, Attack, Mana, Speed) per design system; silhouette, palette, propulsion glow (#00FFFF) per [art_style_guide](docs/art_style_guide.md) | — | **Done** | CEO approved 2025-03-03 |
| 2     | 2.A.3 | Design | **Basic gun design** — Damage formula, fire rate, projectile speed; readable projectile VFX (bright core, trail) per art_style_guide | — | **Done** | CEO approved 2025-03-03 |
| 3     | 2.A.2 | Asset | **Sparrow sprite sheet** — Per [sparrow_sprite_sheet_spec](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md): flying, bank L/R, boost, idle, firing, damage, hit flash; 256×256 cells | 2.A.1 | **Done** | CEO approved 2025-03-03; individual sprites in Assets/Content/Sprites/Sparrow/ |
| 4     | 2.1  | Tech   | **Single ship prefab (Sparrow)** — SparrowShip prefab in Gameplay scene; SpriteRenderer with approved sprite (e.g. sparrow_idle.png from 2.A.2); top-down orientation (facing north); Collider2D + Rigidbody2D; PlayerShipController, PlayerWeapon wired. Per [sparrow_design_lock](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md). | 2.A.1, 2.A.2 | Pending | Ship visible in scene; collider; top-down; uses approved sprite; fires on Space |
| 5     | 2.2  | Tech   | **Player movement** — 4-way WASD/stick via InputService; move speed maps to Sparrow Speed 35 (design lock); clamped to play area bounds; no exit screen. PlayerShipController drives Rigidbody2D. | 2.1 | Pending | 4-way move; clamped; Speed 35 feel |
| 6     | 2.3  | Tech   | **Basic gun** — PlayerWeapon fires per [basic_gun_design_lock](docs/concepts/basic_gun_design_lock.md): fire rate 0.15s; projectile speed 12 u/s; damage = Attack × 0.25 (Sparrow = 5); lifetime 3s; spawn at muzzle, travel toward facing, despawn off-screen or timeout. Projectile prefab with cyan (#00FFFF) sprite per VFX spec. | 2.1, 2.A.3 | Pending | Fire rate 0.15s; speed 12; damage formula; cyan projectile |
| 7     | 2.4  | Tech   | **Projectile pooling** — ProjectilePool prewarms projectiles; Get/Return on spawn/despawn; zero Instantiate during fire loop. Pool size sufficient for ~6–7 on screen (Sparrow 6.67/s). 60 FPS during sustained fire. | 2.3 | Pending | No allocations during fire; 60 FPS |


---

## Phase 3: Combat

| #   | Milestone           | Status  | Gate                                   |
| --- | ------------------- | ------- | -------------------------------------- |
| 3.1 | First enemy (Scout) | Pending | Takes damage; destroyed                |
| 3.2 | Enemy projectiles   | Pending | Player takes damage; formula verified  |
| 3.3 | Enemy pooling       | Pending | 50+ enemies; no GC spikes              |
| 3.4 | First wave          | Pending | 5–7 Scouts; V-formation; wave complete |

**Asset & design sub-milestones (Phase 3):**

| Sub | Deliverable | Gate |
| --- | ----------- | ----- |
| 3.A.1 | **Scout enemy design** — HP, defense, attack, movement pattern; insectoid silhouette per art_style_guide | Combat Systems + Visual Design spec |
| 3.A.2 | **Scout sprite sheet** — Top-down insectoid; amber/olive-green palette; flying, firing, damage, death poses | Distinct from player palette; readable at scale |
| 3.A.3 | **Enemy projectile design** — Damage formula (weapon/defense); visual distinct from player shots | Combat Systems formula verified |
| 3.A.4 | **Wave design spec** — V-formation layout; 5–7 Scouts; spawn timing, spacing | Level/Encounter spec |


---

## Phase 4: First Level

| #   | Milestone                   | Status  | Gate                            |
| --- | --------------------------- | ------- | ------------------------------- |
| 4.1 | Vertical scroll             | Pending | Smooth scroll; player in frame  |
| 4.2 | Parallax (Level 1 — forest) | Pending | 4 layers; depth; no z-fight     |
| 4.3 | Wave sequence               | Pending | 3–5 waves; spacing              |
| 4.4 | Boss placeholder            | Pending | HP bar; defeat → level complete |

**Asset & design sub-milestones (Phase 4):**

| Sub | Deliverable | Gate |
| --- | ----------- | ----- |
| 4.A.1 | **Level 1 (forest) design** — Parallax layer count, depth order; terrain layout; Kaladesh/forest aesthetic per art_style_guide | Level/Encounter + Visual Design spec |
| 4.A.2 | **Parallax assets** — Far (sky/horizon), mid (terrain/foliage), near (detail); top-down bird's-eye view; layered depth | No z-fight; 60 FPS |
| 4.A.3 | **Wave sequence design** — 3–5 waves; difficulty ramp; spacing between waves | Level/Encounter spec |
| 4.A.4 | **Boss placeholder design** — HP bar, defeat trigger; visual placeholder (block or simple sprite) | Functional gate; full boss art in Phase 10 |


---

## Phase 5: HUD and Basic UI

| #   | Milestone      | Status  | Gate                           |
| --- | -------------- | ------- | ------------------------------ |
| 5.1 | Combat HUD     | Pending | HP, mana, score, lives         |
| 5.2 | Results screen | Pending | Level complete; Retry/Continue |

**Asset & design sub-milestones (Phase 5):**

| Sub | Deliverable | Gate |
| --- | ----------- | ----- |
| 5.A.1 | **HUD design** — Layout (HP, mana, score, lives); aether accents, filigree framing per art_style_guide; legible at 1080p | Visual Design spec; design_system compliance |
| 5.A.2 | **HUD assets** — Health bar, mana bar, score display, lives icons; illustrated, ornate inventor-fair aesthetic | Matches UI style guide |
| 5.A.3 | **Results screen design** — Layout; Retry/Continue flow; victory/defeat states | Design system compliance |
| 5.A.4 | **Results screen assets** — Background, buttons, typography placeholders | Thematic integration |


---

## Phase 6: All Four Ships

| #   | Milestone                  | Status  | Gate                             |
| --- | -------------------------- | ------- | -------------------------------- |
| 6.1 | Ship ScriptableObjects     | Pending | 4 ships; stats per design system |
| 6.2 | Ship selection (pre-level) | Pending | Pick ship; correct ship in level |
| 6.3 | Ship-specific weapons      | Pending | Each ship feels distinct         |

**Asset & design sub-milestones (Phase 6):**

| Sub | Deliverable | Gate |
| --- | ----------- | ----- |
| **Ships** | | |
| 6.A.1 | **Turtle design** — Stats (high HP/Defense, low Speed); tank silhouette; amber/gold propulsion (#FFBF00); no animal literal | Per [p0_1_ships](docs/concepts/p0_mocks/p0_1_ships/); design_system |
| 6.A.2 | **Wolf design** — Stats (balanced); fighter jet silhouette; white/silver propulsion; clean, minimal | Per p0_1_ships; design_system |
| 6.A.3 | **Dragon design** — Stats (high Attack/Mana, low Defense); multi-gun silhouette; orange/red propulsion (#FF4500); compact, NOT airliner | Per p0_1_ships; design_system |
| 6.A.4 | **Turtle, Wolf, Dragon sprite sheets** — Same pose set as Sparrow (flying, bank L/R, boost, idle, firing, damage, hit flash); 256×256 cells | Matches pilot-style canonical art |
| 6.A.5 | **Ship-specific weapon design** — Each ship: distinct gun type, fire pattern, mana cost; feel differentiation spec | Combat Systems spec; each ship feels distinct |
| **Pilots** | | |
| 6.B.1 | **Pilot–ship pairing design** — Which pilot modifies which ship stat; Speed/Weapon/Defensive/Neutral modifiers per [pilot_mocks](docs/concepts/p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md) | Narrative + Combat Systems spec |
| 6.B.2 | **Pilot portrait integration** — 256×256 portraits (Speed, Weapon, Defensive, Rookie) in ship select, brief, HUD | Per pilot_mocks_deliverable; Kaladesh aesthetic |
| 6.B.3 | **Ship selection UI design** — Layout: 4 ships + 4 pilots; selection flow; visual feedback | Design system; controller-first |


---

## Phase 7: Hangar and Upgrades

| #   | Milestone              | Status  | Gate                             |
| --- | ---------------------- | ------- | -------------------------------- |
| 7.1 | Hangar scene           | Pending | Ship display; stat display; flow |
| 7.2 | Upgrade system (stats) | Pending | Spend currency; persist          |
| 7.3 | Weapon/bomb upgrades   | Pending | Strong gun; bomb; upgrades apply |

**Asset & design sub-milestones (Phase 7):**

| Sub | Deliverable | Gate |
| --- | ----------- | ----- |
| 7.A.1 | **Hangar layout design** — Ship display area; stat display; upgrade panels; flow (select ship → upgrade → ready) | Design system; controller navigation |
| 7.A.2 | **Upgrade economy design** — Stat cost curves; currency sources; persist rules | Combat Systems + design_system |
| 7.A.3 | **Weapon/bomb upgrade design** — Strong gun (mana cost, damage); bomb (invincibility, AOE, cooldown); upgrade tiers | Combat Systems spec |
| 7.A.4 | **Hangar UI assets** — Ship display frame; stat bars; upgrade buttons; ornate inventor-fair aesthetic | Per art_style_guide |


---

## Phase 8: Progression and Meta

| #   | Milestone             | Status  | Gate                             |
| --- | --------------------- | ------- | -------------------------------- |
| 8.1 | XP and pilot leveling | Pending | Kill → XP → level-up → modifiers |
| 8.2 | Currency and loot     | Pending | Enemies drop; pickups            |
| 8.3 | Multiple levels       | Pending | Level 2; unlock; ramp difficulty |
| 8.4 | Save system           | Pending | Progress persists on quit        |

**Asset & design sub-milestones (Phase 8):**

| Sub | Deliverable | Gate |
| --- | ----------- | ----- |
| 8.A.1 | **Pilot XP/level design** — XP curve; level-up modifiers (Speed/Weapon/Defensive/Neutral); per-pilot progression | Combat Systems + Narrative spec |
| 8.A.2 | **Loot design** — Drop tables; currency, HP restore, mana; pickup visuals; enemy-type → resource mapping | Combat Systems spec |
| 8.A.3 | **Level 2 design** — Industrial theme; parallax layers; wave composition; difficulty ramp vs Level 1 | Level/Encounter + Visual Design spec |
| 8.A.4 | **Level 2 assets** — Parallax (industrial pipes, conduits); terrain; Kaladesh industrial aesthetic | Per art_style_guide; level_mocks |
| 8.A.5 | **Pickup/loot assets** — Currency, HP, mana pickups; readable at combat scale | Distinct from projectiles |


---

## Phase 9: Multiplayer (2–4 Players)

| #   | Milestone          | Status  | Gate                           |
| --- | ------------------ | ------- | ------------------------------ |
| 9.1 | Local 2-player     | Pending | 2 ships; no input conflict     |
| 9.2 | Ship combining (2) | Pending | Pilot + gunner; merge/split    |
| 9.3 | 3-player combine   | Pending | Pilot + gunner + shielder      |
| 9.4 | 4-player combine   | Pending | 2 gunners, 1 shielder, 1 pilot |
| 9.5 | Role swap          | Pending | Swap roles during combined     |

**Asset & design sub-milestones (Phase 9):**

| Sub | Deliverable | Gate |
| --- | ----------- | ----- |
| 9.A.1 | **Combined ship design (2)** — Pilot + gunner; merged silhouette; stat combination formula; merge/split animation intent | Combat Systems + Visual Design spec |
| 9.A.2 | **Combined ship design (3)** — Pilot + gunner + shielder; shield mechanic; role assignment flow | Per design_system roles |
| 9.A.3 | **Combined ship design (4)** — 2 gunners, 1 shielder, 1 pilot (or 2×2); role swap UX | Per design_system |
| 9.A.4 | **Combined ship assets** — 2/3/4-ship merge visuals; stylistically combination of constituent ships; propulsion blend | Per art_style_guide; distinct from solo ships |
| 9.A.5 | **Shield VFX design** — Shielder role; movable shield; visual language (aether, filigree) | Visual Design spec |


---

## Phase 10: Content and Polish

| #    | Milestone                   | Status  | Gate                            |
| ---- | --------------------------- | ------- | ------------------------------- |
| 10.1 | Enemy tiers (Medium, Elite) | Pending | Distinct HP, behaviors          |
| 10.2 | Boss variety                | Pending | 2+ phases per boss              |
| 10.3 | VFX pass                    | Pending | Projectiles, explosions; 60 FPS |
| 10.4 | Audio                       | Pending | SFX, music; no pops             |
| 10.5 | Narrative integration       | Pending | Briefings, pilot bios           |

**Asset & design sub-milestones (Phase 10):**

| Sub | Deliverable | Gate |
| --- | ----------- | ----- |
| **Enemies** | | |
| 10.A.1 | **Medium enemy design** — HP, defense, attack; distinct behavior vs Scout; insectoid silhouette; size hierarchy | Combat Systems + Visual Design spec |
| 10.A.2 | **Elite enemy design** — Higher stats; unique ability; mini-boss feel; rewarding resources | Per [boss_mocks](docs/concepts/p0_mocks/p0_4_boss/) |
| 10.A.3 | **Medium/Elite sprite sheets** — Top-down insectoid; amber/olive-green/purple-grey palette; distinct from Scout | Per art_style_guide |
| **Bosses** | | |
| 10.B.1 | **Root-Seeker (forest) design** — 2+ phases; firing patterns; unique abilities; per [boss_mocks_deliverable](docs/concepts/p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Level/Encounter + Visual Design spec |
| 10.B.2 | **Conduit-Crawler (industrial) design** — 2+ phases; distinct from Root-Seeker | Per boss_mocks_deliverable |
| 10.B.3 | **Boss sprite sheets** — Root-Seeker, Conduit-Crawler; multi-segment; biomechanical; phase transitions | Per art_style_guide; imposing scale |
| **VFX & Audio** | | |
| 10.C.1 | **VFX design spec** — Projectiles (bright cores, trails); explosions (starburst, flares); hit feedback; 60 FPS target | Visual Design spec; per art_style_guide VFX language |
| 10.C.2 | **VFX assets** — Player/enemy projectiles; explosions; muzzle flashes; damage sparks | Lightweight, performant |
| 10.C.3 | **Audio design** — SFX list (fire, hit, explosion, pickup, UI); music (menu, combat, boss); no pops | Platform/Release spec |
| **Narrative** | | |
| 10.D.1 | **Mission briefings design** — Per-level briefing flow; pilot VO hooks; per [sample_narrative](docs/concepts/p0_mocks/p0_6_narrative/sample_narrative.md) | Narrative spec |
| 10.D.2 | **Pilot bios** — Short bios for Speed, Weapon, Defensive, Rookie; personality, backstory | Narrative spec; per pilot_mocks |


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
- **Design locks:** Must include a "P0 Mocks Considered" section listing all relevant approved p0 mocks and what each informs (silhouette, palette, scale, context). See [sparrow_design_lock.md](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) for template.
- **Tech milestones:** Gates must pass before proceeding to dependent work.
- **Asset & design sub-milestones:** Design specs and asset lists gate or run parallel to tech work. Visual Design, Combat Systems, Level/Encounter, Narrative produce per routing table.
- **Subagent contribution summary:** Per milestone plan; document which agent did what when a milestone completes. Director must use `mcp_task` to delegate—see [agents/director.md](../agents/director.md).
- **Roadmap updates:** When CEO signs off a milestone, Director MUST update this roadmap immediately (Status, Current testable). Do not wait for a reminder.
- **Milestone completion triggers Session End:** Marking a milestone complete MUST trigger the full Session End Checklist (memory save, learning capture, ship_log, subagent summary). Do not update the roadmap without running the checklist.
- **Learning capture:** When a bug is fixed or a workaround is discovered, Director MUST document it in the appropriate learnings doc (e.g. docs/dev_standards/unity_learnings.md) and inject "Learnings to check" into future specialist prompts. Do not repeat mistakes.

---

## Still true?

- Update as milestones complete or CEO approves mocks
- Asset & design sub-milestones (2.A.x, 3.A.x, etc.) gate before or parallel to tech milestones
- Prune stale entries periodically

