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

| #    | Deliverable           | Status  | CEO OK | Deliverable detail | Gate |
| ---- | --------------------- | ------- | ------ | ------------------ | ---- |
| P0.1 | **Ship mocks**        | DONE    | Yes    | Four ships (Sparrow, Turtle, Wolf, Dragon). Pilot-style mocks canonical. Each in `docs/concepts/p0_mocks/p0_1_ships/{ship}/`. [ship_mocks_pilot_style_deliverable](docs/concepts/p0_mocks/p0_1_ships/ship_mocks_pilot_style_deliverable.md). | CEO approved |
| P0.2 | **Pilot mocks**       | DONE    | Yes    | Four pilots: Speed, Weapon, Defensive, Neutral. Kaladesh aesthetic; varied ages/ethnicities/genders. [pilot_mocks_deliverable](docs/concepts/p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md). | CEO approved |
| P0.3 | **Level mocks**       | DONE    | —      | Level 1 (forest), Level 2 (industrial), Level 3 (sky). Parallax, terrain, top-down. [level_mocks_deliverable](docs/concepts/p0_mocks/p0_3_levels/level_mocks_deliverable.md). level_mock_2_forest.png, level_mock_3_industrial.png, level_mock_4_sky.png. | Pending CEO |
| P0.4 | **Boss fight mocks**  | DONE    | Yes    | Root-Seeker + Sparrow + Forest; Conduit-Crawler + Dragon + Industrial. [boss_mocks_deliverable](docs/concepts/p0_mocks/p0_4_boss/boss_mocks_deliverable.md). boss_mock_1_forest.png, boss_mock_2_industrial.png. | CEO approved |
| P0.5 | **Title screen mock** | DONE    | Yes    | Layered sky, VIMANAS title, four ships with propulsion glow, PRESS START • 1–4 PLAYERS. [title_screen_mocks_deliverable](docs/concepts/p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md). CEO approved 2025-03-02. | CEO approved |
| P0.6 | **Sample narrative**  | DONE    | Yes    | Beginning premise and setting. [sample_narrative](docs/concepts/p0_mocks/p0_6_narrative/sample_narrative.md). CEO approved 2025-03-02. | CEO approved |


**Gate for each:** CEO reviews and approves. If rejected, revise and resubmit.

---

## Phase 1: Foundation (Project Setup)

**Gate check:** 2025-03-03. See `tasks/active/PHASE1_GATE_CHECK.md`.

| #   | Milestone          | Status | Deliverable | Gate |
| --- | ------------------ | ------ | ----------- | ---- |
| 1.1 | Unity project init | Done   | Unity 6 project; Assets/ folder layout (Core, Gameplay, Content, UI); build succeeds | Open in Unity 6; build succeeds |
| 1.2 | Boot scene         | Done   | Boot scene first in build order; BootLoader loads MainMenu via scene index; transition <1s | Boot → MainMenu transition |
| 1.3 | MainMenu           | Done   | MainMenu scene; MainMenuController; New Game button/action loads Gameplay scene; PRESS START flow | New Game → Gameplay |
| 1.4 | Input system       | Done   | InputService; VimanasInputActions (WASD, fire, controller); wired to PlayerShipController, PlayerWeapon | WASD/controller + fire |


---

## Emergency: GitHub Actions CI

**Ad-hoc milestone.** Automate build error reporting so CEO does not need to manually copy compile errors.

| ID   | Type | Deliverable | Status | Gate |
| ---- | ---- | ----------- | ------ | ---- |
| CI.1 | Tech | **GitHub Actions workflow** — `.github/workflows/` using GameCI `unity-builder` or equivalent; Unity batchmode build on push | **Done** | Push → CI runs; full log (CS####, file, line) in workflow output on failure |

**Flow:** Push → CI runs Unity batchmode build → if it fails, the full log (including CS1501, file, line) is in the workflow output.

**What the CEO does:** Push code. No manual error copying.

**What the agent does:** Open the failed workflow run in GitHub Actions and read the log.

**Requirements:**
- `.github/workflows/` workflow (e.g. GameCI unity-builder)
- Unity license for CI (personal or professional)
- Build target: macOS (to match test platform)

**Pros:** Errors captured automatically; no CEO action needed.

**Cons:** Needs CI setup and valid Unity license for the runner.

---

## Phase 2: First Playable (Single Ship)

**Rule: Approved resources only.** Do not add sprites to the game until they are derived from CEO-approved mocks and pass gate. Use approved placeholders until asset sub-milestones complete.

**Delivery order:** Tech and asset milestones interweaved by dependency. Design and approved assets gate implementation; prefab uses approved sprite from 2.A.2.

| Order | ID   | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 2.A.1 | Design | **Sparrow design lock** — Stats (HP, Defense, Attack, Mana, Speed) per design system; silhouette, palette, propulsion glow (#00FFFF) per [art_style_guide](docs/art_style_guide.md) | — | **Done** | CEO approved 2025-03-03 |
| 2     | 2.A.3 | Design | **Basic gun design** — Damage formula, fire rate, projectile speed; readable projectile VFX (bright core, trail) per art_style_guide | — | **Done** | CEO approved 2025-03-03 |
| 3     | 2.A.2 | Asset | **Sparrow sprite sheet** — Per [sparrow_sprite_sheet_spec](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md): flying, bank L/R, boost, idle, firing, damage, hit flash; 256×256 cells | 2.A.1 | **Done** | CEO approved 2025-03-03; individual sprites in Assets/Content/Sprites/Sparrow/ |
| 4     | 2.1  | Tech   | **Single ship prefab (Sparrow)** — SparrowShip prefab in Gameplay scene; SpriteRenderer with approved sprite (sparrow_facing_n north-facing from 2.A.2); top-down orientation (facing north); Collider2D + Rigidbody2D; PlayerShipController, PlayerWeapon wired. Per [sparrow_design_lock](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md). | 2.A.1, 2.A.2 | **Done** | Ship visible in scene; collider; top-down; uses approved sprite; fires on Space |
| 5     | 2.2  | Tech   | **Player movement** — 4-way WASD/stick via InputService; move speed maps to Sparrow Speed 35 (design lock); clamped to play area bounds; no exit screen. PlayerShipController drives Rigidbody2D. | 2.1 | Pending | 4-way move; clamped; Speed 35 feel |
| 6     | 2.3  | Tech   | **Basic gun** — PlayerWeapon fires per [basic_gun_design_lock](docs/concepts/basic_gun_design_lock.md): fire rate 0.15s; projectile speed 12 u/s; damage = Attack × 0.25 (Sparrow = 5); lifetime 3s; spawn at muzzle, travel toward facing, despawn off-screen or timeout. Projectile prefab with cyan (#00FFFF) sprite per VFX spec. | 2.1, 2.A.3 | **Done** | Fire rate 0.15s; speed 12; damage formula; cyan projectile |
| 7     | 2.4  | Tech   | **Projectile pooling** — ProjectilePool prewarms projectiles; Get/Return on spawn/despawn; zero Instantiate during fire loop. Pool size sufficient for ~6–7 on screen (Sparrow 6.67/s). 60 FPS during sustained fire. | 2.3 | Pending | No allocations during fire; 60 FPS |


---

## Phase 3: Combat

**Delivery order:** Design/asset sub-milestones gate tech. Scout design lock → Scout sprite sheet → Scout prefab; enemy projectile design → EnemyProjectile prefab; wave design → WaveSpawner.

| Order | ID   | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 3.A.1 | Design | **Scout enemy design lock** — HP, defense, attack, movement pattern; insectoid silhouette per [art_style_guide](docs/art_style_guide.md). Output: `docs/concepts/scout_design_lock.md`. P0 Mocks Considered: boss_mocks, enemy_hierarchy. | — | Pending | Combat Systems + Visual Design spec |
| 2     | 3.A.3 | Design | **Enemy projectile design** — Damage formula (weapon/defense); orange/amber (#FF8C00, #FFBF00) per art_style_guide; distinct from player cyan. Output: `docs/concepts/enemy_projectile_design_lock.md`. | — | Pending | Combat Systems formula verified |
| 3     | 3.A.4 | Design | **Wave design spec** — V-formation layout; 5–7 Scouts; spawn timing, spacing. Output: `docs/concepts/wave_design_spec.md`. | — | Pending | Level/Encounter spec |
| 4     | 3.A.2 | Asset  | **Scout sprite sheet** — Top-down insectoid; amber/olive-green palette; flying, firing, damage, death poses. Individual sprites in `Assets/Content/Sprites/Scout/`. Per Scout design lock. | 3.A.1 | Pending | Distinct from player; readable at scale |
| 5     | 3.1  | Tech   | **First enemy (Scout)** — ScoutEnemy prefab in scene; Damageable (HP, defense per design lock); moves toward player; Collider2D; takes damage from player Projectile; OnDeath destroys. Per [scout_design_lock](docs/concepts/scout_design_lock.md). | 3.A.1, 3.A.2 | Pending | Scout takes damage; destroyed |
| 6     | 3.2  | Tech   | **Enemy projectiles** — EnemyProjectile prefab; damage formula per enemy projectile design; fires at player; PlayerShipController/Damageable takes damage. Orange/amber sprite per VFX spec. | 3.1, 3.A.3 | Pending | Player takes damage; formula verified |
| 7     | 3.3  | Tech   | **Enemy pooling** — EnemyPool or equivalent; prewarm Scouts; Get/Return on spawn/death; zero Instantiate during wave. 50+ enemies on screen; no GC spikes. | 3.1 | Pending | 50+ enemies; no GC spikes |
| 8     | 3.4  | Tech   | **First wave** — WaveSpawner spawns 5–7 Scouts in V-formation per wave design spec; spawn timing, spacing; wave complete when all destroyed. | 3.1, 3.3, 3.A.4 | Pending | 5–7 Scouts; V-formation; wave complete |


---

## Phase 4: First Level

**Delivery order:** Level design → parallax assets → scroll; wave sequence design → WaveSpawner sequence; boss placeholder design → boss prefab.

| Order | ID   | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 4.A.1 | Design | **Level 1 (forest) design** — Parallax layer count (4), depth order; terrain layout; Kaladesh/forest aesthetic per [art_style_guide](docs/art_style_guide.md). Output: `docs/concepts/level_1_forest_design.md`. P0 Mocks: [level_mocks_deliverable](docs/concepts/p0_mocks/p0_3_levels/level_mocks_deliverable.md). | — | Pending | Level/Encounter + Visual Design spec |
| 2     | 4.A.3 | Design | **Wave sequence design** — 3–5 waves; difficulty ramp; spacing between waves. Output: `docs/concepts/wave_sequence_design.md`. | — | Pending | Level/Encounter spec |
| 3     | 4.A.4 | Design | **Boss placeholder design** — HP bar UI; defeat trigger; visual placeholder (block or simple sprite). Output: `docs/concepts/boss_placeholder_design.md`. Full boss art in Phase 10. | — | Pending | Functional gate |
| 4     | 4.A.2 | Asset  | **Parallax assets** — Far (sky/horizon), mid (terrain/foliage), near (detail); top-down bird's-eye; layered depth. Per level_mock_2_forest.png. Assets in `Assets/Content/Sprites/Level1/` or equivalent. | 4.A.1 | Pending | No z-fight; 60 FPS |
| 5     | 4.1  | Tech   | **Vertical scroll** — Camera or world scrolls upward; player ship stays in frame (e.g. bottom third); smooth scroll rate. LevelScrollController or equivalent. | 4.A.1 | Pending | Smooth scroll; player in frame |
| 6     | 4.2  | Tech   | **Parallax (Level 1 — forest)** — 4 parallax layers; depth order; sprites from 4.A.2; no z-fight. ParallaxController or layer components. | 4.1, 4.A.2 | Pending | 4 layers; depth; no z-fight |
| 7     | 4.3  | Tech   | **Wave sequence** — WaveSpawner runs 3–5 waves per level design; spacing between waves; difficulty ramp. | 3.4, 4.A.3 | Pending | 3–5 waves; spacing |
| 8     | 4.4  | Tech   | **Boss placeholder** — Boss prefab in scene; HP bar UI; takes damage; defeat triggers level complete. Visual: block or simple sprite per boss placeholder design. | 4.A.4, 4.3 | Pending | HP bar; defeat → level complete |


---

## Phase 5: HUD and Basic UI

**Delivery order:** HUD design → HUD assets → Combat HUD; Results design → Results assets → Results screen.

| Order | ID   | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 5.A.1 | Design | **HUD design** — Layout (HP bar, mana bar, score, lives); aether accents, filigree framing per [art_style_guide](docs/art_style_guide.md); legible at 1080p. Output: `docs/concepts/hud_design.md`. | — | Pending | Visual Design spec; design_system |
| 2     | 5.A.3 | Design | **Results screen design** — Layout; Retry/Continue flow; victory/defeat states. Output: `docs/concepts/results_screen_design.md`. | — | Pending | Design system compliance |
| 3     | 5.A.2 | Asset  | **HUD assets** — Health bar, mana bar, score display, lives icons; illustrated, ornate inventor-fair aesthetic. Assets in `Assets/Content/Sprites/UI/HUD/` or equivalent. | 5.A.1 | Pending | Matches UI style guide |
| 4     | 5.A.4 | Asset  | **Results screen assets** — Background, Retry/Continue buttons, typography placeholders. Assets in `Assets/Content/Sprites/UI/Results/`. | 5.A.3 | Pending | Thematic integration |
| 5     | 5.1  | Tech   | **Combat HUD** — GameplayUIController or HUD canvas; HP bar bound to player Damageable; mana bar (placeholder if no mana yet); score display; lives. Per HUD design. | 5.A.2 | Pending | HP, mana, score, lives visible |
| 6     | 5.2  | Tech   | **Results screen** — Results scene or panel; loads on level complete; Retry (reload level) and Continue (next level or menu); victory/defeat states. Per results design. | 5.A.4, 4.4 | Pending | Level complete → Retry/Continue |


---

## Phase 6: All Four Ships

**Delivery order:** Ship design locks → sprite sheets → ScriptableObjects; pilot pairing + ship selection UI design → Ship selection scene; weapon design → ship-specific weapons.

| Order | ID   | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 6.A.1 | Design | **Turtle design lock** — Stats (high HP/Defense, low Speed); tank silhouette; amber/gold propulsion (#FFBF00). Output: `docs/concepts/p0_mocks/p0_1_ships/turtle/turtle_design_lock.md`. P0 Mocks Considered. | — | Pending | Per p0_1_ships; design_system |
| 2     | 6.A.2 | Design | **Wolf design lock** — Stats (balanced); fighter jet silhouette; white/silver propulsion. Output: `docs/concepts/p0_mocks/p0_1_ships/wolf/wolf_design_lock.md`. | — | Pending | Per p0_1_ships; design_system |
| 3     | 6.A.3 | Design | **Dragon design lock** — Stats (high Attack/Mana, low Defense); multi-gun silhouette; orange/red (#FF4500); compact. Output: `docs/concepts/p0_mocks/p0_1_ships/dragon/dragon_design_lock.md`. | — | Pending | Per p0_1_ships; design_system |
| 4     | 6.A.5 | Design | **Ship-specific weapon design** — Each ship: distinct gun type, fire pattern, mana cost. Output: `docs/concepts/ship_weapons_design_lock.md`. | — | Pending | Combat Systems; each ship feels distinct |
| 5     | 6.B.1 | Design | **Pilot–ship pairing design** — Which pilot modifies which ship stat; Speed/Weapon/Defensive/Neutral modifiers. Per [pilot_mocks](docs/concepts/p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md). Output: `docs/concepts/pilot_ship_pairing_design.md`. | — | Pending | Narrative + Combat Systems spec |
| 6     | 6.B.3 | Design | **Ship selection UI design** — Layout: 4 ships + 4 pilots; selection flow; visual feedback. Output: `docs/concepts/ship_selection_ui_design.md`. Controller-first. | — | Pending | Design system; controller-first |
| 7     | 6.A.4 | Asset  | **Turtle, Wolf, Dragon sprite sheets** — Same pose set as Sparrow (flying, bank L/R, boost, idle, firing, damage, hit flash); 256×256 cells. Individual sprites in `Assets/Content/Sprites/{Turtle,Wolf,Dragon}/`. | 6.A.1, 6.A.2, 6.A.3 | Pending | Matches pilot-style canonical art |
| 8     | 6.B.2 | Asset  | **Pilot portraits** — 256×256 (Speed, Weapon, Defensive, Rookie). Assets in `Assets/Content/Sprites/Pilots/`. Per pilot_mocks_deliverable. | — | Pending | Kaladesh aesthetic |
| 9     | 6.1  | Tech   | **Ship ScriptableObjects** — ShipData or equivalent ScriptableObject for Sparrow, Turtle, Wolf, Dragon; stats (HP, Defense, Attack, Mana, Speed) per design locks; sprite references. | 6.A.1–6.A.4 | Pending | 4 ships; stats per design system |
| 10    | 6.2  | Tech   | **Ship selection (pre-level)** — ShipSelect scene before Gameplay; 4 ships + 4 pilots per UI design; pick ship → load Gameplay with chosen ship prefab. Per ship_selection_ui_design. | 6.1, 6.B.1, 6.B.2, 6.B.3 | Pending | Pick ship; correct ship in level |
| 11    | 6.3  | Tech   | **Ship-specific weapons** — PlayerWeapon reads ShipData; fire pattern, damage, mana cost per ship_weapons_design_lock. Turtle/Wolf/Dragon each feel distinct. | 6.1, 6.A.5 | Pending | Each ship feels distinct |


---

## Phase 7: Hangar and Upgrades

**Delivery order:** Hangar layout + economy + weapon/bomb design → Hangar assets → Hangar scene → Upgrade system → Weapon/bomb upgrades.

| Order | ID   | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 7.A.1 | Design | **Hangar layout design** — Ship display area; stat display; upgrade panels; flow (select ship → upgrade → ready). Output: `docs/concepts/hangar_layout_design.md`. Controller navigation. | — | Pending | Design system; controller-first |
| 2     | 7.A.2 | Design | **Upgrade economy design** — Stat cost curves; currency sources; persist rules. Output: `docs/concepts/upgrade_economy_design.md`. | — | Pending | Combat Systems + design_system |
| 3     | 7.A.3 | Design | **Weapon/bomb upgrade design** — Strong gun (mana cost, damage); bomb (invincibility, AOE, cooldown); upgrade tiers. Output: `docs/concepts/weapon_bomb_upgrade_design.md`. | — | Pending | Combat Systems spec |
| 4     | 7.A.4 | Asset  | **Hangar UI assets** — Ship display frame; stat bars; upgrade buttons; ornate inventor-fair aesthetic. Assets in `Assets/Content/Sprites/UI/Hangar/`. | 7.A.1 | Pending | Per art_style_guide |
| 5     | 7.1  | Tech   | **Hangar scene** — Hangar scene; ship display (selected ship model); stat display; upgrade panels per layout design. Flow: select ship → upgrade → ready. | 7.A.1, 7.A.4 | Pending | Ship display; stat display; flow |
| 6     | 7.2  | Tech   | **Upgrade system (stats)** — Spend currency to upgrade ship stats; cost curves per economy design; persist to save (or PlayerPrefs placeholder). | 7.1, 7.A.2 | Pending | Spend currency; persist |
| 7     | 7.3  | Tech   | **Weapon/bomb upgrades** — Strong gun (mana cost, damage per design); bomb (invincibility, AOE, cooldown); upgrade tiers apply in combat. | 7.2, 7.A.3 | Pending | Strong gun; bomb; upgrades apply |


---

## Phase 8: Progression and Meta

**Delivery order:** XP/loot design → Level 2 design → Level 2 assets + pickup assets → tech implementation.

| Order | ID   | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 8.A.1 | Design | **Pilot XP/level design** — XP curve; level-up modifiers (Speed/Weapon/Defensive/Neutral); per-pilot progression. Output: `docs/concepts/pilot_xp_level_design.md`. | — | Pending | Combat Systems + Narrative spec |
| 2     | 8.A.2 | Design | **Loot design** — Drop tables; currency, HP restore, mana; pickup visuals; enemy-type → resource mapping. Output: `docs/concepts/loot_design.md`. | — | Pending | Combat Systems spec |
| 3     | 8.A.3 | Design | **Level 2 design** — Industrial theme; parallax layers; wave composition; difficulty ramp vs Level 1. Output: `docs/concepts/level_2_industrial_design.md`. Per level_mock_3_industrial. | — | Pending | Level/Encounter + Visual Design spec |
| 4     | 8.A.4 | Asset  | **Level 2 assets** — Parallax (industrial pipes, conduits); terrain; Kaladesh industrial aesthetic. Assets in `Assets/Content/Sprites/Level2/`. | 8.A.3 | Pending | Per art_style_guide; level_mocks |
| 5     | 8.A.5 | Asset  | **Pickup/loot assets** — Currency, HP, mana pickups; readable at combat scale. Assets in `Assets/Content/Sprites/Pickups/`. Distinct from projectiles. | 8.A.2 | Pending | Distinct from projectiles |
| 6     | 8.1  | Tech   | **XP and pilot leveling** — Kill → XP; XP curve per design; level-up → modifiers apply. Per-pilot progression. | 8.A.1 | Pending | Kill → XP → level-up → modifiers |
| 7     | 8.2  | Tech   | **Currency and loot** — Enemies drop currency/HP/mana per loot design; pickups spawn; player collects. PickupPool or equivalent. | 8.A.2, 8.A.5 | Pending | Enemies drop; pickups |
| 8     | 8.3  | Tech   | **Multiple levels** — Level 2 (industrial) playable; unlock after Level 1; difficulty ramp per design. | 4.4, 8.A.3, 8.A.4 | Pending | Level 2; unlock; ramp difficulty |
| 9     | 8.4  | Tech   | **Save system** — Progress persists on quit; XP, currency, upgrades, level unlock. JSON or PlayerPrefs. | 8.1, 8.2, 7.2 | Pending | Progress persists on quit |


---

## Phase 9: Multiplayer (2–4 Players)

**Delivery order:** Combined ship design (2) → 2-player + combine; then combined (3) → 3-player; combined (4) → 4-player; role swap.

| Order | ID   | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 9.A.1 | Design | **Combined ship design (2)** — Pilot + gunner; merged silhouette; stat combination formula; merge/split animation intent. Output: `docs/concepts/combined_ship_2_design.md`. | — | Pending | Combat Systems + Visual Design spec |
| 2     | 9.A.4 | Asset  | **Combined ship assets (2)** — 2-ship merge visuals; combination of constituent ships; propulsion blend. Per art_style_guide. | 9.A.1 | Pending | Distinct from solo ships |
| 3     | 9.1  | Tech   | **Local 2-player** — Two PlayerShipController instances; separate input (Player 1/2); no input conflict; both ships in Gameplay scene. | 6.2 | Pending | 2 ships; no input conflict |
| 4     | 9.2  | Tech   | **Ship combining (2)** — Merge action: 2 ships → 1 combined; pilot + gunner roles; split action; stat combination per design. | 9.1, 9.A.1, 9.A.4 | Pending | Pilot + gunner; merge/split |
| 5     | 9.A.2 | Design | **Combined ship design (3)** — Pilot + gunner + shielder; shield mechanic; role assignment flow. Output: `docs/concepts/combined_ship_3_design.md`. | — | Pending | Per design_system roles |
| 6     | 9.A.5 | Design | **Shield VFX design** — Shielder role; movable shield; visual language (aether, filigree). Output: `docs/concepts/shield_vfx_design.md`. | — | Pending | Visual Design spec |
| 7     | 9.3  | Tech   | **3-player combine** — 3 ships → 1 combined; pilot + gunner + shielder; shield mechanic; role assignment. | 9.2, 9.A.2, 9.A.5 | Pending | Pilot + gunner + shielder |
| 8     | 9.A.3 | Design | **Combined ship design (4)** — 2 gunners, 1 shielder, 1 pilot (or 2×2); role swap UX. Output: `docs/concepts/combined_ship_4_design.md`. | — | Pending | Per design_system |
| 9     | 9.4  | Tech   | **4-player combine** — 4 ships → 1 combined; 2 gunners, 1 shielder, 1 pilot; roles per design. | 9.3, 9.A.3 | Pending | 2 gunners, 1 shielder, 1 pilot |
| 10    | 9.5  | Tech   | **Role swap** — Swap roles during combined ship; UX per combined design (4). | 9.4 | Pending | Swap roles during combined |


---

## Phase 10: Content and Polish

**Delivery order:** Enemy design → sprite sheets → prefabs; Boss design → boss sprites → boss implementation; VFX/Audio design → assets → integration; Narrative design → integration.

| Order | ID    | Type   | Deliverable | Depends on | Status | Gate |
| ----- | ----- | ------ | ----------- | ---------- | ------ | ---- |
| 1     | 10.A.1 | Design | **Medium enemy design** — HP, defense, attack; distinct behavior vs Scout; insectoid silhouette; size hierarchy. Output: `docs/concepts/medium_enemy_design_lock.md`. | — | Pending | Combat Systems + Visual Design spec |
| 2     | 10.A.2 | Design | **Elite enemy design** — Higher stats; unique ability; mini-boss feel; rewarding resources. Output: `docs/concepts/elite_enemy_design_lock.md`. Per [boss_mocks](docs/concepts/p0_mocks/p0_4_boss/). | — | Pending | Per boss_mocks |
| 3     | 10.B.1 | Design | **Root-Seeker (forest) design** — 2+ phases; firing patterns; unique abilities. Output: `docs/concepts/root_seeker_design_lock.md`. Per [boss_mocks_deliverable](docs/concepts/p0_mocks/p0_4_boss/boss_mocks_deliverable.md). | — | Pending | Level/Encounter + Visual Design spec |
| 4     | 10.B.2 | Design | **Conduit-Crawler (industrial) design** — 2+ phases; distinct from Root-Seeker. Output: `docs/concepts/conduit_crawler_design_lock.md`. | — | Pending | Per boss_mocks_deliverable |
| 5     | 10.C.1 | Design | **VFX design spec** — Projectiles (bright cores, trails); explosions (starburst, flares); hit feedback; 60 FPS target. Output: `docs/concepts/vfx_design_spec.md`. | — | Pending | Per art_style_guide VFX language |
| 6     | 10.C.3 | Design | **Audio design** — SFX list (fire, hit, explosion, pickup, UI); music (menu, combat, boss); no pops. Output: `docs/concepts/audio_design.md`. | — | Pending | Platform/Release spec |
| 7     | 10.D.1 | Design | **Mission briefings design** — Per-level briefing flow; pilot VO hooks. Per [sample_narrative](docs/concepts/p0_mocks/p0_6_narrative/sample_narrative.md). Output: `docs/concepts/mission_briefings_design.md`. | — | Pending | Narrative spec |
| 8     | 10.D.2 | Design | **Pilot bios** — Short bios for Speed, Weapon, Defensive, Rookie; personality, backstory. Output: `docs/concepts/pilot_bios.md`. | — | Pending | Narrative spec; per pilot_mocks |
| 9     | 10.A.3 | Asset  | **Medium/Elite sprite sheets** — Top-down insectoid; amber/olive-green/purple-grey palette. Individual sprites in `Assets/Content/Sprites/Enemies/`. | 10.A.1, 10.A.2 | Pending | Per art_style_guide |
| 10    | 10.B.3 | Asset  | **Boss sprite sheets** — Root-Seeker, Conduit-Crawler; multi-segment; biomechanical; phase transitions. Assets in `Assets/Content/Sprites/Bosses/`. | 10.B.1, 10.B.2 | Pending | Imposing scale |
| 11    | 10.C.2 | Asset  | **VFX assets** — Player/enemy projectiles; explosions; muzzle flashes; damage sparks. Lightweight, pool-friendly. | 10.C.1 | Pending | Lightweight, performant |
| 12    | 10.1  | Tech   | **Enemy tiers (Medium, Elite)** — MediumEnemy, EliteEnemy prefabs; distinct HP, behaviors per design locks; replace or extend Scout. | 10.A.1, 10.A.2, 10.A.3 | Pending | Distinct HP, behaviors |
| 13    | 10.2  | Tech   | **Boss variety** — Root-Seeker, Conduit-Crawler prefabs; 2+ phases each; firing patterns per design locks. Replace Phase 4 placeholder. | 10.B.1, 10.B.2, 10.B.3 | Pending | 2+ phases per boss |
| 14    | 10.3  | Tech   | **VFX pass** — Projectiles, explosions, hit feedback per VFX design spec; 60 FPS. Replace placeholders with approved assets. | 10.C.1, 10.C.2 | Pending | Projectiles, explosions; 60 FPS |
| 15    | 10.4  | Tech   | **Audio** — SFX (fire, hit, explosion, pickup, UI); music (menu, combat, boss); no pops. Per audio design. | 10.C.3 | Pending | SFX, music; no pops |
| 16    | 10.5  | Tech   | **Narrative integration** — Mission briefings before levels; pilot bios in ship select/hangar. Per mission briefings + pilot bios design. | 10.D.1, 10.D.2 | Pending | Briefings, pilot bios |


---

## Phase 11: Platform and Release

**Delivery order:** Steam first (PC); Mac for testing; Switch (handheld + docked); CI/CD; release checklist.

| Order | ID   | Type | Deliverable | Depends on | Status | Gate |
| ----- | ---- | ---- | ----------- | ---------- | ------ | ---- |
| 1     | 11.1 | Tech | **Steam build** — Steamworks SDK integration; build runs on Steam; achievements/cloud optional. Target: Windows PC. | 10.5 | Pending | Runs on Steam |
| 2     | 11.2 | Tech | **Mac build** — Full playthrough on Mac; resolution, input, no macOS-specific crashes. | 11.1 | Pending | Full playthrough on Mac |
| 3     | 11.3 | Tech | **Switch build** — Handheld 720p; docked 1080p; Nintendo SDK; controller compliance; performance targets. | 11.1 | Pending | Handheld 720p; docked 1080p |
| 4     | 11.4 | Tech | **CI/CD** — Push to main → build artifact; GitHub Actions or equivalent; build verification. | — | Pending | Push → build artifact |
| 5     | 11.5 | Tech | **Release checklist** — QA pass; store assets (screenshots, trailer, description); submit to Steam/Switch. | 11.1, 11.2, 11.3 | Pending | QA; store assets; submit |


---

## Rules

- **Investor mocks (Phase 0):** Each mock is a standalone deliverable. CEO must explicitly approve before use in pitch or production.
- **Design locks:** Must include a "P0 Mocks Considered" section listing all relevant approved p0 mocks and what each informs (silhouette, palette, scale, context). See [sparrow_design_lock.md](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) for template.
- **Design locks and plans (platform):** Must include a "Platform / Unity gotchas" section referencing [unity_learnings.md](docs/dev_standards/unity_learnings.md). For sprites that must appear in builds: note Resources path, textureType/spriteMode, and mirroring if applicable.
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

