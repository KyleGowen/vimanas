# Vimanas Roadmap

## Current State

**Approved concept art (CEO OK):**

- **Ship mocks** — DONE. Four ships: Sparrow, Turtle, Wolf, Dragon. Each in own subdir. Pilot-style mocks canonical (realistic illustrated, matches pilots). [p0_1_ships/](../docs/concepts/p0_mocks/p0_1_ships/). **CEO approved 2025-03-02.**
- **Pilot mocks** — DONE. Four pilots: Speed, Weapon, Defensive, Neutral. Kaladesh aesthetic, varied ages/ethnicities/genders. [pilot_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md).
- **Boss fight mocks** — DONE. Root-Seeker (forest) + Sparrow, Conduit-Crawler (industrial) + Dragon. [boss_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_4_boss/boss_mocks_deliverable.md).
- **Title screen mock** — DONE. Single mock: layered sky, VIMANAS title, four ships with propulsion glow, PRESS START • 1–4 PLAYERS. [title_screen_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md). **CEO approved 2025-03-02.**
- **Sample narrative** — DONE. Beginning premise and setting. Opening to the story. [sample_narrative.md](../docs/concepts/p0_mocks/p0_6_narrative/sample_narrative.md). **CEO approved 2025-03-02.**
- **Level mocks** — DONE. Level 1 (forest), Level 2 (industrial), Level 3 (sky). Parallax, terrain, top-down. [level_mocks_deliverable](docs/concepts/p0_mocks/p0_3_levels/level_mocks_deliverable.md). **CEO approved 2026-03-05.**

**Unapproved:**

- Investor mocks — require CEO sign-off before use.

**Tech build:**

- **Framework-free (2026-03-05):** No game framework. HTML5 Canvas 2D, TypeScript, Vite. Custom game loop, input, rendering. See `docs/tech_architecture.md` for build/test. Run `npm run dev` to preview in browser.

---

## Interactive Demo Checkpoints

**When can a user test something?** Each checkpoint is the first moment a user can perform that level of interaction. Test as soon as the milestone is done.


| Checkpoint            | After milestone      | What to test                                                                        |
| --------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| **D1 — First input**  | 1.10 Title screen    | Load game → Boot (title) → Enter/click anywhere → Gameplay. First user interaction. |
| **D2 — Move**         | 2.2 Player movement  | Load → Boot → Enter/click → Move ship (WASD / stick).                               |
| **D3 — Move + shoot** | 2.3 Basic gun        | Load → Boot → Enter/click → Move and fire. First gameplay loop.                     |
| **D4 — Combat**       | 3.4 First wave       | Load → Boot → Enter/click → Fight wave of Scouts. Destroy all enemies.              |
| **D5 — Full level**   | 4.4 Boss placeholder | Load → Boot → Enter/click → Complete level (scroll, waves, boss).                   |
| **D6 — Results flow** | 5.2 Results screen   | Level complete → Results screen → Retry or Continue.                                |
| **D7 — Ship choice**  | 6.2 Ship selection   | Ship select before level → Pick ship → Play with chosen ship.                       |
| **D8 — Co-op**        | 9.1 Local 2-player   | Two controllers → Both players move and shoot.                                      |


**Current testable:** D1, D2, D3, D4 — Boot (title) → Enter/click → Gameplay. Ship visible (Sparrow); WASD/stick move; Space fires; Escape pauses. Wave 1: 5 Scouts in V-formation; destroy all → wave complete → Wave 2 (7 Scouts Staggered Wedge). Scout fires; 4 hits to down Sparrow. Parallax (Level 1 forest) visible; Far/Mid/Near layers scroll behind ship. D5 (full level) pending.

---

## Asset & Design Pipeline (Summary)

Sub-milestones for **assets** (sprite sheets, UI, VFX, audio) and **design** (stats, behaviors, gameplay) are listed under each phase. Key streams:


| Stream       | Phases  | Focus                                                                                                                                                                 |
| ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ships**    | 2, 6    | Sparrow → Turtle, Wolf, Dragon; stats, weapons, sprite sheets per [sparrow_sprite_sheet_spec](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md) |
| **Pilots**   | 6, 8    | Portraits, modifiers, pairing; XP/level design; per [pilot_mocks](docs/concepts/p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md)                                      |
| **Enemies**  | 3, 10   | Scout → Medium, Elite; insectoid palette; behaviors                                                                                                                   |
| **Levels**   | 4, 8    | Forest, industrial; parallax; wave sequences                                                                                                                          |
| **Bosses**   | 4, 10   | Placeholder → Root-Seeker, Conduit-Crawler; 2+ phases                                                                                                                 |
| **UI**       | 5, 6, 7 | HUD, results, ship select, hangar; ornate inventor-fair                                                                                                               |
| **Gameplay** | 2–10    | Weapons, combining, upgrades, progression, VFX                                                                                                                        |


---

## Phase 0: Investor Pitch Mocks (CEO Sign-Off Required)

Each deliverable is a standalone concept/mock. **No mock is approved until the CEO explicitly OKs it.** Visual Design and Narrative agents produce; Director submits for CEO review.


| #    | Deliverable           | Status | CEO OK | Deliverable detail                                                                                                                                                                                                                                        | Gate         | How to verify                                      |
| ---- | --------------------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------- |
| P0.1 | **Ship mocks**        | Done   | Yes    | Four ships (Sparrow, Turtle, Wolf, Dragon). Pilot-style mocks canonical. Each in `docs/concepts/p0_mocks/p0_1_ships/{ship}/`. [ship_mocks_pilot_style_deliverable](docs/concepts/p0_mocks/p0_1_ships/ship_mocks_pilot_style_deliverable.md).              | CEO approved | Review images in each ship subdir; CEO approves    |
| P0.2 | **Pilot mocks**       | Done   | Yes    | Four pilots: Speed, Weapon, Defensive, Neutral. Kaladesh aesthetic; varied ages/ethnicities/genders. [pilot_mocks_deliverable](docs/concepts/p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md).                                                            | CEO approved | Review pilot images; CEO approves                   |
| P0.3 | **Level mocks**       | Done   | Yes    | Level 1 (forest), Level 2 (industrial), Level 3 (sky). Parallax, terrain, top-down. [level_mocks_deliverable](docs/concepts/p0_mocks/p0_3_levels/level_mocks_deliverable.md). level_mock_2_forest.png, level_mock_3_industrial.png, level_mock_4_sky.png. | CEO approved | Review level mock images; CEO approves             |
| P0.4 | **Boss fight mocks**  | Done   | Yes    | Root-Seeker + Sparrow + Forest; Conduit-Crawler + Dragon + Industrial. [boss_mocks_deliverable](docs/concepts/p0_mocks/p0_4_boss/boss_mocks_deliverable.md). boss_mock_1_forest.png, boss_mock_2_industrial.png.                                          | CEO approved | Review boss mock images; CEO approves              |
| P0.5 | **Title screen mock** | Done   | Yes    | Layered sky, VIMANAS title, four ships with propulsion glow, PRESS START • 1–4 PLAYERS. [title_screen_mocks_deliverable](docs/concepts/p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md). CEO approved 2025-03-02.                            | CEO approved | Review title screen mock; CEO approves             |
| P0.6 | **Sample narrative**  | Done   | Yes    | Beginning premise and setting. [sample_narrative](docs/concepts/p0_mocks/p0_6_narrative/sample_narrative.md). CEO approved 2025-03-02.                                                                                                                    | CEO approved | Read sample_narrative.md; CEO approves             |


**Gate for each:** CEO reviews and approves. If rejected, revise and resubmit.

---

## Phase 1: Foundation (Framework-Free)

**No game framework.** Build from scratch: HTML5 Canvas 2D, TypeScript, Vite.


| #     | Milestone                 | Status | Deliverable                                                                                | Gate                        | How to verify                                      |
| ----- | ------------------------- | ------ | ------------------------------------------------------------------------------------------ | --------------------------- | -------------------------------------------------- |
| 1.1   | Project init              | Done   | `package.json`, `tsconfig.json`, Vite config; `npm run dev` serves HTML                    | Dev server runs             | browser opens                      |
| 1.2   | HTML shell                | Done   | `index.html` with canvas; fixed resolution (1280×720)                                      | Canvas visible in browser   | canvas visible                     |
| 1.3   | Canvas display            | Done   | Canvas 2D context; clear + fill; aspect-ratio handling                                     | Black/gray rect visible     | rect visible                       |
| 1.4   | Game loop                 | Done   | `requestAnimationFrame` loop; delta time; 60 FPS target                                    | Loop runs; no jank          | smooth loop                        |
| 1.5   | **Keyboard input**        | Done   | Parent: WASD, Space, Escape; key down/up; input service abstraction. Sub-milestones below. | Keys drive state            | keys drive state                   |
| 1.5.1 | Input service abstraction | Done   | key down/up events; abstract API for consumers                                             | Abstraction in place        | Unit test; keys in API                             |
| 1.5.2 | WASD controls             | Done   | W/A/S/D map to movement state                                                              | Director signed off         | WASD moves ship                    |
| 1.5.3 | Space                     | Done   | Space key; fire/action binding; placeholder projectile (cyan rect) for verification        | Director signed off         | Space fires                        |
| 1.5.4 | Escape                    | Done   | Escape key; pause overlay (toggle); gamepad button 8                                       | Director signed off         | Escape pauses                      |
| 1.6   | Gamepad input             | Done   | Gamepad API; button/axis mapping; same abstraction as keyboard                             | Controller input works      | controller moves/fires            |
| 1.7   | Image loading             | Done   | Load PNG via `Image`; asset path convention; loading state                                 | Image loads; no CORS issues | Unit test; image loads in browser                  |
| 1.8   | Sprite rendering          | Done   | Draw image to canvas; position, scale; basic draw order                                    | Sprite visible on screen    | sprite visible                     |
| 1.9   | Boot flow                 | Done   | Boot screen (title mock); Enter or click anywhere → Gameplay                               | Boot → Gameplay on input    | Enter → Gameplay                   |
| 1.10  | Title screen              | Done   | Title mock as main menu; Enter/click anywhere → Gameplay                                   | Boot → Gameplay on input    | Enter/click → Gameplay             |


---

## CI (Vite)

**Ad-hoc milestone.** Automate build verification.


| ID   | Type | Deliverable                                                     | Status  | Gate                                    | How to verify                                      |
| ---- | ---- | --------------------------------------------------------------- | ------- | --------------------------------------- | -------------------------------------------------- |
| CI.1 | Tech | **GitHub Actions workflow** — build, lint, unit tests, integration tests | Done   | Push → CI runs; all steps pass          | Push to main; check Actions tab; all jobs green    |


**Flow:** Push → Build (first) → Lint + Unit tests + Integration tests (parallel). No license activation.

---

## Phase 2: First Playable (Single Ship)

**Rule: Approved resources only.** Do not add sprites to the game until they are derived from CEO-approved mocks and pass gate. Use approved placeholders until asset sub-milestones complete.

**Delivery order:** Tech and asset milestones interweaved by dependency. Design and approved assets gate implementation; entity uses approved sprite from 2.A.2. **2.1 breakdown:** [PHASE2_2_1_SPARROW_ENTITY](tasks/active/PHASE2_2_1_SPARROW_ENTITY.md).


| Order | ID    | Type   | Deliverable                                                                                                                                                                                                                                                                                                   | Depends on   | Status  | Gate                                                                | How to verify                                      |
| ----- | ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| 1     | 2.A.1 | Design | **Sparrow design lock** — Stats (HP, Defense, Attack, Mana, Speed) per design system; silhouette, palette, propulsion glow (#00FFFF) per [art_style_guide](docs/art_style_guide.md)                                                                                                                           | —            | Done    | CEO approved 2025-03-03                                             | Read sparrow_design_lock.md; CEO approves           |
| 2     | 2.A.3 | Design | **Basic gun design** — Damage formula, fire rate, projectile speed; readable projectile VFX (bright core, trail) per art_style_guide                                                                                                                                                                          | —            | Done    | CEO approved 2025-03-03                                             | Read basic_gun_design_lock.md; CEO approves         |
| 3     | 2.A.2 | Asset  | **Sparrow sprite sheet** — Per [sparrow_sprite_sheet_spec](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md): flying, bank L/R, boost, idle, firing, damage, hit flash; 256×256 cells                                                                                                   | 2.A.1        | Done    | CEO approved 2025-03-03; individual sprites in public/images/ships/ | Inspect public/images/ships/; CEO approves          |
| 4     | 2.1   | Tech   | **Sparrow entity** — SparrowShip class; position, sprite, draw in Gameplay scene; top-down (facing north); per [sparrow_design_lock](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md). Sub-deliverables below. | 2.A.1, 2.A.2 | Done   | Ship visible; top-down; uses approved sprite; fires on Space        | Boot → Enter → ship visible; Space fires |
| 4a    | 2.1.1 | Tech   | SparrowShip class — Stats per design lock; position; sprite path                                 | 2.A.1, 2.A.2 | Done   | Class exists; stats match                                           | `npm run test:unit`; inspect SparrowShip            |
| 4b    | 2.1.2 | Tech   | Sprite load and draw — Load sparrow_facing_n; draw at position; top-down                           | 2.1.1        | Done   | Ship draws at position                                             | ship sprite visible                 |
| 4c    | 2.1.3 | Tech   | GameplayScene integration — Replace inline ship with SparrowShip instance                         | 2.1.2        | Done   | Ship visible in Gameplay                                            | ship in Gameplay                    |
| 4d    | 2.1.4 | Tech   | Fire on Space (placeholder) — Space → placeholder projectile at muzzle                             | 2.1.3        | Done   | Press Space → projectile visible                                    | Space → projectile visible          |
| 4e    | 2.1.5 | Tech   | Unit tests — SparrowShip; GameplayScene with ship                                                 | 2.1.4        | Done   | Tests pass                                                         | `npm run test:unit`                                 |
| 5     | 2.2   | Tech   | **Player movement** — InputService → SparrowShip; move speed maps to Sparrow Speed 35 (design lock); clamped to play area bounds; no exit screen.                                                                                                                                                             | 2.1          | Done   | 4-way move; clamped; Speed 35 feel                                  | WASD moves; ship stays on screen    |
| 6     | 2.3   | Tech   | **Basic gun** — Fire on Space per [basic_gun_design_lock](docs/concepts/basic_gun_design_lock.md): fire rate 0.15s; projectile speed 12 u/s; damage = Attack × 0.25 (Sparrow = 5); lifetime 3s; spawn at muzzle, travel toward facing, despawn off-screen or timeout. Cyan (#00FFFF) projectile per VFX spec. | 2.1, 2.A.3   | Done   | Fire rate 0.15s; speed 12; damage formula; cyan projectile          | Space fires cyan projectiles; unit test verifies damage |
| 7     | 2.4   | Tech   | **Projectile pooling** — Pool class; Get/Return on spawn/despawn; zero allocations during fire loop. Pool size sufficient for ~6–7 on screen (Sparrow 6.67/s). 60 FPS during sustained fire.                                                                                                                  | 2.3          | Done   | No allocations during fire; 60 FPS                                  | hold Space 10s; smooth. Unit test verifies pool reuse |

---

## Phase 3: Combat

**Delivery order:** Design/asset sub-milestones gate tech. Scout design lock → Scout sprite sheet → Scout prefab; enemy projectile design → EnemyProjectile prefab; wave design → WaveSpawner.


| Order | ID    | Type   | Deliverable                                                                                                                                                                                                                                          | Depends on      | Status  | Gate                                    | How to verify                                      |
| ----- | ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------- | --------------------------------------- | -------------------------------------------------- |
| 1     | 3.A.1 | Design | **Scout enemy design lock** — HP, defense, attack, movement pattern; insectoid silhouette per [art_style_guide](docs/art_style_guide.md). Output: `docs/concepts/scout_design_lock.md`. P0 Mocks Considered: boss_mocks, enemy_hierarchy.            | —               | Done    | CEO approved 2026-03-05                 | Read scout_design_lock.md; spec approved            |
| 2     | 3.A.3 | Design | **Enemy projectile design** — Damage formula (weapon/defense); orange/amber (#FF8C00, #FFBF00) per art_style_guide; distinct from player cyan. Output: `docs/concepts/enemy_projectile_design_lock.md`.                                              | —               | Done    | CEO approved 2026-03-05                 | Read enemy_projectile_design_lock.md; formula OK    |
| 3     | 3.A.4 | Design | **Wave design spec** — V-formation layout; 5–7 Scouts; spawn timing, spacing. Output: `docs/concepts/wave_design_spec.md`.                                                                                                                           | —               | Done    | CEO approved 2026-03-05                 | Read wave_design_spec.md; spec approved             |
| 4     | 3.A.2 | Asset  | **Scout sprite sheet** — Top-down insectoid; amber/olive-green palette; flying, firing, damage, death poses. Spec + placeholder in `public/images/enemies/`. Per Scout design lock.                                                                    | 3.A.1           | Done    | CEO approved 2026-03-05                 | Inspect Scout sprites; CEO approves                 |
| 5     | 3.1   | Tech   | **First enemy (Scout)** — ScoutEnemy prefab in scene; Damageable (HP, defense per design lock); moves toward player; Collider2D; takes damage from player Projectile; OnDeath destroys. Per [scout_design_lock](docs/concepts/scout_design_lock.md). | 3.A.1, 3.A.2    | Done    | CEO approved 2026-03-05                 | Scout appears; shoot to destroy     |
| 6     | 3.2   | Tech   | **Enemy projectiles** — EnemyProjectile prefab; damage formula per enemy projectile design; fires at player; PlayerShipController/Damageable takes damage. Orange/amber sprite per VFX spec.                                                         | 3.1, 3.A.3      | Done    | Player takes damage; formula verified   | player takes damage; unit test     |
| 7     | 3.3   | Tech   | **Enemy pooling** — EnemyPool or equivalent; prewarm Scouts; Get/Return on spawn/death; zero Instantiate during wave. 50+ enemies on screen; no GC spikes.                                                                                           | 3.1             | Done    | 50+ enemies; no GC spikes               | 50+ enemies; smooth. Unit test      |
| 8     | 3.4   | Tech   | **First wave** — WaveSpawner spawns 5–7 Scouts in V-formation per wave design spec; spawn timing, spacing; wave complete when all destroyed or offscreen.                                                                                             | 3.1, 3.3, 3.A.4 | Done    | CEO approved 2026-03-05                 | wave spawns; destroy/offscreen → complete |


---

## Phase 4: First Level

**Delivery order:** Level design → parallax assets → scroll; wave sequence design → WaveSpawner sequence; boss placeholder design → boss prefab. **4.2 breakdown:** [PHASE4_4_2_PARALLAX](tasks/active/PHASE4_4_2_PARALLAX.md).


| Order | ID    | Type   | Deliverable                                                                                                                                                                                                                                                                                                          | Depends on | Status  | Gate                                 | How to verify                                      |
| ----- | ----- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- | ------------------------------------ | -------------------------------------------------- |
| 1     | 4.A.1 | Design | **Level 1 (forest) design** — Parallax layer count (4), depth order; terrain layout; Kaladesh/forest aesthetic per [art_style_guide](docs/art_style_guide.md). Output: `docs/concepts/level_1_forest_design.md`. P0 Mocks: [level_mocks_deliverable](docs/concepts/p0_mocks/p0_3_levels/level_mocks_deliverable.md). | —          | Done ✓  | Level/Encounter + Visual Design spec | Read level_1_forest_design.md; spec approved       |
| 2     | 4.A.3 | Design | **Wave sequence design** — 3–5 waves; difficulty ramp; spacing between waves. Output: `docs/concepts/wave_sequence_design.md`.                                                                                                                                                                                       | —          | Done ✓  | Level/Encounter spec                 | Read wave_sequence_design.md; spec approved         |
| 3     | 4.A.4 | Design | **Boss placeholder design** — HP bar UI; defeat trigger; visual placeholder (block or simple sprite). Output: `docs/concepts/boss_placeholder_design.md`. Full boss art in Phase 10.                                                                                                                                 | —          | Done ✓  | Functional gate                      | Read boss_placeholder_design.md; spec approved      |
| 4     | 4.A.2 | Asset  | **Parallax assets** — Far (sky/horizon), mid (terrain/foliage), near (detail); top-down bird's-eye; layered depth. Per level_mock_2_forest.png. Assets in `public/images/level1/`.                                                                                                                                   | 4.A.1      | Done ✓  | No z-fight; 60 FPS                   | Inspect parallax assets; no z-fight in browser      |
| 5     | 4.1   | Tech   | **Vertical scroll** — Camera or world scrolls upward; player ship stays in frame (e.g. bottom third); smooth scroll rate. LevelScrollController or equivalent.                                                                                                                                                       | 4.A.1      | Pending | Smooth scroll; player in frame       | level scrolls; player in frame      |
| 6     | 4.2   | Tech   | **Parallax (Level 1 — forest)** — 4 parallax layers; depth order; sprites from 4.A.2; no z-fight. ParallaxController or layer components. Sub-deliverables below.                                                                                                                                                 | 4.1, 4.A.2 | Done   | 4 layers; depth; no z-fight          | 4 layers visible; no z-fight        |
| 6a    | 4.2.1 | Tech   | ParallaxLayer component — Single layer: loads sprite, draws at offset from `scrollRatio × scrollOffset`; configurable depth. Per level_1_forest_design.                                                                                               | 4.1, 4.A.2 | Done   | Layer draws at correct offset        | Unit test; layer position correct   |
| 6b    | 4.2.2 | Tech   | ParallaxController — Orchestrates layers; receives scrollOffset from LevelScrollController; draws in depth order (Far → Mid → Near).                                                                                                                  | 4.2.1      | Done   | Layers draw in correct order         | Far behind Mid behind Near          |
| 6c    | 4.2.3 | Tech   | Far layer integration — Load `parallax_far.png`; add Far layer (0.3x); depth 1. Asset path `public/images/level1/parallax_far.png`.                                                                                                                   | 4.2.2      | Done   | Far layer visible; scrolls at 0.3x  | Far visible; parallax lag          |
| 6d    | 4.2.4 | Tech   | Mid layer integration — Load `parallax_mid.png`; add Mid layer (0.6x); depth 2. Asset path `public/images/level1/parallax_mid.png`.                                                                                                                    | 4.2.2      | Done   | Mid layer visible; scrolls at 0.6x   | Mid visible; parallax lag           |
| 6e    | 4.2.5 | Tech   | Near layer integration — Load `parallax_near.png`; add Near layer (1.0x); depth 3. Asset path `public/images/level1/parallax_near.png`.                                                                                                                | 4.2.2      | Done   | Near layer visible; scrolls at 1.0x  | Near visible; full scroll rate      |
| 6f    | 4.2.6 | Tech   | Z-fight prevention & seamless wrap — No visible seams; no z-fight; 60 FPS. Tile or repeat as needed per asset dimensions.                                                                                                                            | 4.2.3–4.2.5 | Done   | No seams; no z-fight; smooth         | Visual check; no artifacts          |
| 6g    | 4.2.7 | Tech   | Unit tests — ParallaxLayer; ParallaxController; scroll integration.                                                                                                                                                                                 | 4.2.6      | Done   | Tests pass                           | `npm run test:unit`                 |
| 7     | 4.3   | Tech   | **Wave sequence** — WaveSpawner runs 3–5 waves per level design; spacing between waves; difficulty ramp.                                                                                                                                                                                                             | 3.4, 4.A.3 | Pending | 3–5 waves; spacing                   | 3–5 waves; spacing correct          |
| 8     | 4.4   | Tech   | **Boss placeholder** — Boss prefab in scene; HP bar UI; takes damage; defeat triggers level complete. Visual: block or simple sprite per boss placeholder design.                                                                                                                                                    | 4.A.4, 4.3 | Pending | HP bar; defeat → level complete      | boss appears; defeat → level complete |


---

## Phase 5: HUD and Basic UI

**Delivery order:** HUD design → HUD assets → Combat HUD; Results design → Results assets → Results screen.


| Order | ID    | Type   | Deliverable                                                                                                                                                                                         | Depends on | Status  | Gate                              | How to verify                                      |
| ----- | ----- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- | --------------------------------- | -------------------------------------------------- |
| 1     | 5.A.1 | Design | **HUD design** — Layout (HP bar, mana bar, score, lives); aether accents, filigree framing per [art_style_guide](docs/art_style_guide.md); legible at 1080p. Output: `docs/concepts/hud_design.md`. | —          | Pending | Visual Design spec; design_system | Read hud_design.md; spec approved                  |
| 2     | 5.A.3 | Design | **Results screen design** — Layout; Retry/Continue flow; victory/defeat states. Output: `docs/concepts/results_screen_design.md`.                                                                   | —          | Pending | Design system compliance          | Read results_screen_design.md; spec approved       |
| 3     | 5.A.2 | Asset  | **HUD assets** — Health bar, mana bar, score display, lives icons; illustrated, ornate inventor-fair aesthetic. Assets in `Assets/Content/Sprites/UI/HUD/` or equivalent.                           | 5.A.1      | Pending | Matches UI style guide            | Inspect HUD assets; CEO approves                   |
| 4     | 5.A.4 | Asset  | **Results screen assets** — Background, Retry/Continue buttons, typography placeholders. Assets in `Assets/Content/Sprites/UI/Results/`.                                                            | 5.A.3      | Pending | Thematic integration              | Inspect Results assets; CEO approves               |
| 5     | 5.1   | Tech   | **Combat HUD** — GameplayUIController or HUD canvas; HP bar bound to player Damageable; mana bar (placeholder if no mana yet); score display; lives. Per HUD design.                                | 5.A.2      | Pending | HP, mana, score, lives visible    | HUD visible; HP bar updates        |
| 6     | 5.2   | Tech   | **Results screen** — Results scene or panel; loads on level complete; Retry (reload level) and Continue (next level or menu); victory/defeat states. Per results design.                            | 5.A.4, 4.4 | Pending | Level complete → Retry/Continue   | complete level → Retry/Continue    |


---

## Phase 6: All Four Ships

**Delivery order:** Ship design locks → sprite sheets → ScriptableObjects; pilot pairing + ship selection UI design → Ship selection scene; weapon design → ship-specific weapons.


| Order | ID    | Type   | Deliverable                                                                                                                                                                                                                                             | Depends on               | Status  | Gate                                     | How to verify                                      |
| ----- | ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------- | ---------------------------------------- | -------------------------------------------------- |
| 1     | 6.A.1 | Design | **Turtle design lock** — Stats (high HP/Defense, low Speed); tank silhouette; amber/gold propulsion (#FFBF00). Output: `docs/concepts/p0_mocks/p0_1_ships/turtle/turtle_design_lock.md`. P0 Mocks Considered.                                           | —                        | Pending | Per p0_1_ships; design_system            | Read turtle_design_lock.md; CEO approves            |
| 2     | 6.A.2 | Design | **Wolf design lock** — Stats (balanced); fighter jet silhouette; white/silver propulsion. Output: `docs/concepts/p0_mocks/p0_1_ships/wolf/wolf_design_lock.md`.                                                                                         | —                        | Pending | Per p0_1_ships; design_system            | Read wolf_design_lock.md; CEO approves              |
| 3     | 6.A.3 | Design | **Dragon design lock** — Stats (high Attack/Mana, low Defense); multi-gun silhouette; orange/red (#FF4500); compact. Output: `docs/concepts/p0_mocks/p0_1_ships/dragon/dragon_design_lock.md`.                                                          | —                        | Pending | Per p0_1_ships; design_system            | Read dragon_design_lock.md; CEO approves           |
| 4     | 6.A.5 | Design | **Ship-specific weapon design** — Each ship: distinct gun type, fire pattern, mana cost. Output: `docs/concepts/ship_weapons_design_lock.md`.                                                                                                           | —                        | Pending | Combat Systems; each ship feels distinct | Read ship_weapons_design_lock.md; spec approved    |
| 5     | 6.B.1 | Design | **Pilot–ship pairing design** — Which pilot modifies which ship stat; Speed/Weapon/Defensive/Neutral modifiers. Per [pilot_mocks](docs/concepts/p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md). Output: `docs/concepts/pilot_ship_pairing_design.md`. | —                        | Pending | Narrative + Combat Systems spec          | Read pilot_ship_pairing_design.md; spec approved   |
| 6     | 6.B.3 | Design | **Ship selection UI design** — Layout: 4 ships + 4 pilots; selection flow; visual feedback. Output: `docs/concepts/ship_selection_ui_design.md`. Controller-first.                                                                                      | —                        | Pending | Design system; controller-first          | Read ship_selection_ui_design.md; spec approved     |
| 7     | 6.A.4 | Asset  | **Turtle, Wolf, Dragon sprite sheets** — Same pose set as Sparrow (flying, bank L/R, boost, idle, firing, damage, hit flash); 256×256 cells. Individual sprites in `Assets/Content/Sprites/{Turtle,Wolf,Dragon}/`.                                      | 6.A.1, 6.A.2, 6.A.3      | Pending | Matches pilot-style canonical art        | Inspect sprite sheets; CEO approves                 |
| 8     | 6.B.2 | Asset  | **Pilot portraits** — 256×256 (Speed, Weapon, Defensive, Rookie). Assets in `Assets/Content/Sprites/Pilots/`. Per pilot_mocks_deliverable.                                                                                                              | —                        | Pending | Kaladesh aesthetic                       | Inspect pilot portraits; CEO approves              |
| 9     | 6.1   | Tech   | **Ship ScriptableObjects** — ShipData or equivalent ScriptableObject for Sparrow, Turtle, Wolf, Dragon; stats (HP, Defense, Attack, Mana, Speed) per design locks; sprite references.                                                                   | 6.A.1–6.A.4              | Pending | 4 ships; stats per design system         | Unit test; inspect ShipData config                 |
| 10    | 6.2   | Tech   | **Ship selection (pre-level)** — ShipSelect scene before Gameplay; 4 ships + 4 pilots per UI design; pick ship → load Gameplay with chosen ship prefab. Per ship_selection_ui_design.                                                                   | 6.1, 6.B.1, 6.B.2, 6.B.3 | Pending | Pick ship; correct ship in level         | ship select → pick → correct ship  |
| 11    | 6.3   | Tech   | **Ship-specific weapons** — PlayerWeapon reads ShipData; fire pattern, damage, mana cost per ship_weapons_design_lock. Turtle/Wolf/Dragon each feel distinct.                                                                                           | 6.1, 6.A.5               | Pending | Each ship feels distinct                 | each ship fires differently        |


---

## Phase 7: Hangar and Upgrades

**Delivery order:** Hangar layout + economy + weapon/bomb design → Hangar assets → Hangar scene → Upgrade system → Weapon/bomb upgrades.


| Order | ID    | Type   | Deliverable                                                                                                                                                                               | Depends on   | Status  | Gate                             | How to verify                                      |
| ----- | ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------- | -------------------------------- | -------------------------------------------------- |
| 1     | 7.A.1 | Design | **Hangar layout design** — Ship display area; stat display; upgrade panels; flow (select ship → upgrade → ready). Output: `docs/concepts/hangar_layout_design.md`. Controller navigation. | —            | Pending | Design system; controller-first  | Read hangar_layout_design.md; spec approved         |
| 2     | 7.A.2 | Design | **Upgrade economy design** — Stat cost curves; currency sources; persist rules. Output: `docs/concepts/upgrade_economy_design.md`.                                                        | —            | Pending | Combat Systems + design_system   | Read upgrade_economy_design.md; spec approved       |
| 3     | 7.A.3 | Design | **Weapon/bomb upgrade design** — Strong gun (mana cost, damage); bomb (invincibility, AOE, cooldown); upgrade tiers. Output: `docs/concepts/weapon_bomb_upgrade_design.md`.               | —            | Pending | Combat Systems spec              | Read weapon_bomb_upgrade_design.md; spec approved   |
| 4     | 7.A.4 | Asset  | **Hangar UI assets** — Ship display frame; stat bars; upgrade buttons; ornate inventor-fair aesthetic. Assets in `Assets/Content/Sprites/UI/Hangar/`.                                     | 7.A.1        | Pending | Per art_style_guide              | Inspect Hangar assets; CEO approves                |
| 5     | 7.1   | Tech   | **Hangar scene** — Hangar scene; ship display (selected ship model); stat display; upgrade panels per layout design. Flow: select ship → upgrade → ready.                                 | 7.A.1, 7.A.4 | Pending | Ship display; stat display; flow | Hangar → ship display; flow works  |
| 6     | 7.2   | Tech   | **Upgrade system (stats)** — Spend currency to upgrade ship stats; cost curves per economy design; persist to save (or PlayerPrefs placeholder).                                          | 7.1, 7.A.2   | Pending | Spend currency; persist          | upgrade; spend; persist on quit    |
| 7     | 7.3   | Tech   | **Weapon/bomb upgrades** — Strong gun (mana cost, damage per design); bomb (invincibility, AOE, cooldown); upgrade tiers apply in combat.                                                 | 7.2, 7.A.3   | Pending | Strong gun; bomb; upgrades apply | strong gun; bomb; upgrades in combat |


---

## Phase 8: Progression and Meta

**Delivery order:** XP/loot design → Level 2 design → Level 2 assets + pickup assets → tech implementation.


| Order | ID    | Type   | Deliverable                                                                                                                                                                              | Depends on        | Status  | Gate                                 | How to verify                                      |
| ----- | ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------- | ------------------------------------ | -------------------------------------------------- |
| 1     | 8.A.1 | Design | **Pilot XP/level design** — XP curve; level-up modifiers (Speed/Weapon/Defensive/Neutral); per-pilot progression. Output: `docs/concepts/pilot_xp_level_design.md`.                      | —                 | Pending | Combat Systems + Narrative spec      | Read pilot_xp_level_design.md; spec approved        |
| 2     | 8.A.2 | Design | **Loot design** — Drop tables; currency, HP restore, mana; pickup visuals; enemy-type → resource mapping. Output: `docs/concepts/loot_design.md`.                                        | —                 | Pending | Combat Systems spec                  | Read loot_design.md; spec approved                  |
| 3     | 8.A.3 | Design | **Level 2 design** — Industrial theme; parallax layers; wave composition; difficulty ramp vs Level 1. Output: `docs/concepts/level_2_industrial_design.md`. Per level_mock_3_industrial. | —                 | Pending | Level/Encounter + Visual Design spec | Read level_2_industrial_design.md; spec approved   |
| 4     | 8.A.4 | Asset  | **Level 2 assets** — Parallax (industrial pipes, conduits); terrain; Kaladesh industrial aesthetic. Assets in `Assets/Content/Sprites/Level2/`.                                          | 8.A.3             | Pending | Per art_style_guide; level_mocks     | Inspect Level 2 assets; CEO approves                |
| 5     | 8.A.5 | Asset  | **Pickup/loot assets** — Currency, HP, mana pickups; readable at combat scale. Assets in `Assets/Content/Sprites/Pickups/`. Distinct from projectiles.                                   | 8.A.2             | Pending | Distinct from projectiles            | Inspect pickup assets; CEO approves                 |
| 6     | 8.1   | Tech   | **XP and pilot leveling** — Kill → XP; XP curve per design; level-up → modifiers apply. Per-pilot progression.                                                                           | 8.A.1             | Pending | Kill → XP → level-up → modifiers     | kill enemies → XP → level-up       |
| 7     | 8.2   | Tech   | **Currency and loot** — Enemies drop currency/HP/mana per loot design; pickups spawn; player collects. PickupPool or equivalent.                                                         | 8.A.2, 8.A.5      | Pending | Enemies drop; pickups                | enemies drop; collect pickups       |
| 8     | 8.3   | Tech   | **Multiple levels** — Level 2 (industrial) playable; unlock after Level 1; difficulty ramp per design.                                                                                   | 4.4, 8.A.3, 8.A.4 | Pending | Level 2; unlock; ramp difficulty     | complete L1 → L2 unlocks; play L2  |
| 9     | 8.4   | Tech   | **Save system** — Progress persists on quit; XP, currency, upgrades, level unlock. JSON or PlayerPrefs.                                                                                  | 8.1, 8.2, 7.2     | Pending | Progress persists on quit            | progress; quit; reload; persists    |


---

## Phase 9: Multiplayer (2–4 Players)

**Delivery order:** Combined ship design (2) → 2-player + combine; then combined (3) → 3-player; combined (4) → 4-player; role swap.


| Order | ID    | Type   | Deliverable                                                                                                                                                                  | Depends on        | Status  | Gate                                | How to verify                                      |
| ----- | ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------- | ----------------------------------- | -------------------------------------------------- |
| 1     | 9.A.1 | Design | **Combined ship design (2)** — Pilot + gunner; merged silhouette; stat combination formula; merge/split animation intent. Output: `docs/concepts/combined_ship_2_design.md`. | —                 | Pending | Combat Systems + Visual Design spec | Read combined_ship_2_design.md; spec approved      |
| 2     | 9.A.4 | Asset  | **Combined ship assets (2)** — 2-ship merge visuals; combination of constituent ships; propulsion blend. Per art_style_guide.                                                | 9.A.1             | Pending | Distinct from solo ships            | Inspect combined ship assets; CEO approves         |
| 3     | 9.1   | Tech   | **Local 2-player** — Two PlayerShipController instances; separate input (Player 1/2); no input conflict; both ships in Gameplay scene.                                       | 6.2               | Pending | 2 ships; no input conflict          | 2 controllers → both move/shoot    |
| 4     | 9.2   | Tech   | **Ship combining (2)** — Merge action: 2 ships → 1 combined; pilot + gunner roles; split action; stat combination per design.                                                | 9.1, 9.A.1, 9.A.4 | Pending | Pilot + gunner; merge/split         | merge 2 ships; pilot+gunner; split  |
| 5     | 9.A.2 | Design | **Combined ship design (3)** — Pilot + gunner + shielder; shield mechanic; role assignment flow. Output: `docs/concepts/combined_ship_3_design.md`.                          | —                 | Pending | Per design_system roles             | Read combined_ship_3_design.md; spec approved      |
| 6     | 9.A.5 | Design | **Shield VFX design** — Shielder role; movable shield; visual language (aether, filigree). Output: `docs/concepts/shield_vfx_design.md`.                                     | —                 | Pending | Visual Design spec                  | Read shield_vfx_design.md; spec approved           |
| 7     | 9.3   | Tech   | **3-player combine** — 3 ships → 1 combined; pilot + gunner + shielder; shield mechanic; role assignment.                                                                    | 9.2, 9.A.2, 9.A.5 | Pending | Pilot + gunner + shielder           | 3 players merge; shielder role      |
| 8     | 9.A.3 | Design | **Combined ship design (4)** — 2 gunners, 1 shielder, 1 pilot (or 2×2); role swap UX. Output: `docs/concepts/combined_ship_4_design.md`.                                     | —                 | Pending | Per design_system                   | Read combined_ship_4_design.md; spec approved      |
| 9     | 9.4   | Tech   | **4-player combine** — 4 ships → 1 combined; 2 gunners, 1 shielder, 1 pilot; roles per design.                                                                               | 9.3, 9.A.3        | Pending | 2 gunners, 1 shielder, 1 pilot      | 4 players merge; all roles         |
| 10    | 9.5   | Tech   | **Role swap** — Swap roles during combined ship; UX per combined design (4).                                                                                                 | 9.4               | Pending | Swap roles during combined          | combined ship → swap roles         |


---

## Phase 10: Content and Polish

**Delivery order:** Enemy design → sprite sheets → prefabs; Boss design → boss sprites → boss implementation; VFX/Audio design → assets → integration; Narrative design → integration.


| Order | ID     | Type   | Deliverable                                                                                                                                                                                                                   | Depends on             | Status  | Gate                                 | How to verify                                      |
| ----- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------- | ------------------------------------ | -------------------------------------------------- |
| 1     | 10.A.1 | Design | **Medium enemy design** — HP, defense, attack; distinct behavior vs Scout; insectoid silhouette; size hierarchy. Output: `docs/concepts/medium_enemy_design_lock.md`.                                                         | —                      | Pending | Combat Systems + Visual Design spec  | Read medium_enemy_design_lock.md; spec approved     |
| 2     | 10.A.2 | Design | **Elite enemy design** — Higher stats; unique ability; mini-boss feel; rewarding resources. Output: `docs/concepts/elite_enemy_design_lock.md`. Per [boss_mocks](docs/concepts/p0_mocks/p0_4_boss/).                          | —                      | Pending | Per boss_mocks                       | Read elite_enemy_design_lock.md; spec approved      |
| 3     | 10.B.1 | Design | **Root-Seeker (forest) design** — 2+ phases; firing patterns; unique abilities. Output: `docs/concepts/root_seeker_design_lock.md`. Per [boss_mocks_deliverable](docs/concepts/p0_mocks/p0_4_boss/boss_mocks_deliverable.md). | —                      | Pending | Level/Encounter + Visual Design spec | Read root_seeker_design_lock.md; spec approved     |
| 4     | 10.B.2 | Design | **Conduit-Crawler (industrial) design** — 2+ phases; distinct from Root-Seeker. Output: `docs/concepts/conduit_crawler_design_lock.md`.                                                                                       | —                      | Pending | Per boss_mocks_deliverable           | Read conduit_crawler_design_lock.md; spec approved |
| 5     | 10.C.1 | Design | **VFX design spec** — Projectiles (bright cores, trails); explosions (starburst, flares); hit feedback; 60 FPS target. Output: `docs/concepts/vfx_design_spec.md`.                                                            | —                      | Pending | Per art_style_guide VFX language     | Read vfx_design_spec.md; spec approved              |
| 6     | 10.C.3 | Design | **Audio design** — SFX list (fire, hit, explosion, pickup, UI); music (menu, combat, boss); no pops. Output: `docs/concepts/audio_design.md`.                                                                                 | —                      | Pending | Platform/Release spec                | Read audio_design.md; spec approved                 |
| 7     | 10.D.1 | Design | **Mission briefings design** — Per-level briefing flow; pilot VO hooks. Per [sample_narrative](docs/concepts/p0_mocks/p0_6_narrative/sample_narrative.md). Output: `docs/concepts/mission_briefings_design.md`.               | —                      | Pending | Narrative spec                       | Read mission_briefings_design.md; spec approved     |
| 8     | 10.D.2 | Design | **Pilot bios** — Short bios for Speed, Weapon, Defensive, Rookie; personality, backstory. Output: `docs/concepts/pilot_bios.md`.                                                                                              | —                      | Pending | Narrative spec; per pilot_mocks      | Read pilot_bios.md; spec approved                   |
| 9     | 10.A.3 | Asset  | **Medium/Elite sprite sheets** — Top-down insectoid; amber/olive-green/purple-grey palette. Individual sprites in `Assets/Content/Sprites/Enemies/`.                                                                          | 10.A.1, 10.A.2         | Pending | Per art_style_guide                  | Inspect Medium/Elite sprites; CEO approves         |
| 10    | 10.B.3 | Asset  | **Boss sprite sheets** — Root-Seeker, Conduit-Crawler; multi-segment; biomechanical; phase transitions. Assets in `Assets/Content/Sprites/Bosses/`.                                                                           | 10.B.1, 10.B.2         | Pending | Imposing scale                       | Inspect boss sprites; CEO approves                  |
| 11    | 10.C.2 | Asset  | **VFX assets** — Player/enemy projectiles; explosions; muzzle flashes; damage sparks. Lightweight, pool-friendly.                                                                                                             | 10.C.1                 | Pending | Lightweight, performant              | Inspect VFX assets; CEO approves                    |
| 12    | 10.1   | Tech   | **Enemy tiers (Medium, Elite)** — MediumEnemy, EliteEnemy prefabs; distinct HP, behaviors per design locks; replace or extend Scout.                                                                                          | 10.A.1, 10.A.2, 10.A.3 | Pending | Distinct HP, behaviors               | Medium/Elite appear; distinct       |
| 13    | 10.2   | Tech   | **Boss variety** — Root-Seeker, Conduit-Crawler prefabs; 2+ phases each; firing patterns per design locks. Replace Phase 4 placeholder.                                                                                       | 10.B.1, 10.B.2, 10.B.3 | Pending | 2+ phases per boss                   | both bosses; 2+ phases each         |
| 14    | 10.3   | Tech   | **VFX pass** — Projectiles, explosions, hit feedback per VFX design spec; 60 FPS. Replace placeholders with approved assets.                                                                                                  | 10.C.1, 10.C.2         | Pending | Projectiles, explosions; 60 FPS      | VFX visible; 60 FPS                 |
| 15    | 10.4   | Tech   | **Audio** — SFX (fire, hit, explosion, pickup, UI); music (menu, combat, boss); no pops. Per audio design.                                                                                                                    | 10.C.3                 | Pending | SFX, music; no pops                  | SFX/music play; no pops             |
| 16    | 10.5   | Tech   | **Narrative integration** — Mission briefings before levels; pilot bios in ship select/hangar. Per mission briefings + pilot bios design.                                                                                     | 10.D.1, 10.D.2         | Pending | Briefings, pilot bios                | briefings; pilot bios visible       |


---

## Phase 11: Platform and Release

**Delivery order:** Steam first (PC); Mac for testing; Switch (handheld + docked); CI/CD; release checklist.


| Order | ID   | Type | Deliverable                                                                                                         | Depends on       | Status  | Gate                        | How to verify                                      |
| ----- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------- | ---------------- | ------- | --------------------------- | -------------------------------------------------- |
| 1     | 11.1 | Tech | **Steam build** — Steamworks SDK integration; build runs on Steam; achievements/cloud optional. Target: Windows PC. | 10.5             | Pending | Runs on Steam               | Build; run on Steam; verify launch                 |
| 2     | 11.2 | Tech | **Mac build** — Full playthrough on Mac; resolution, input, no macOS-specific crashes.                              | 11.1             | Pending | Full playthrough on Mac     | Build; full playthrough on Mac; no crashes          |
| 3     | 11.3 | Tech | **Switch build** — Handheld 720p; docked 1080p; Nintendo SDK; controller compliance; performance targets.           | 11.1             | Pending | Handheld 720p; docked 1080p | Build; test handheld + docked; verify res          |
| 4     | 11.4 | Tech | **CI/CD** — Push to main → build artifact; GitHub Actions or equivalent; build verification.                        | —                | Pending | Push → build artifact       | Push to main; check Actions; artifact produced     |
| 5     | 11.5 | Tech | **Release checklist** — QA pass; store assets (screenshots, trailer, description); submit to Steam/Switch.          | 11.1, 11.2, 11.3 | Pending | QA; store assets; submit    | QA pass; store assets ready; submit complete       |


---

## Rules

- **Investor mocks (Phase 0):** Each mock is a standalone deliverable. CEO must explicitly approve before use in pitch or production.
- **Design locks:** Must include a "P0 Mocks Considered" section listing all relevant approved p0 mocks and what each informs (silhouette, palette, scale, context). See [sparrow_design_lock.md](docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md) for template.
- **Design locks and plans (platform):** Must include a "Platform / Engine gotchas" section referencing [engine_learnings.md](docs/dev_standards/engine_learnings.md). For sprites: note image paths, asset loading.
- **Tech milestones:** Gates must pass before proceeding to dependent work.
- **Definition of done (milestones):** Each milestone must include some way for the CEO to verify the results—e.g. run a command, load a scene, press a key and see feedback, or inspect an artifact. No milestone is complete without a verifiable path for CEO sign-off.
- **Test coverage (Director preference):** Director LOVES test coverage. Unit and integration tests for everything possible. Engineering must cover all non-Unity, non-Construct code. See agents/full_stack_engineer.md.
- **Asset & design sub-milestones:** Design specs and asset lists gate or run parallel to tech work. Visual Design, Combat Systems, Level/Encounter, Narrative produce per routing table.
- **Subagent contribution summary:** Per milestone plan; document which agent did what when a milestone completes. Director must use `mcp_task` to delegate—see [agents/director.md](../agents/director.md).
- **Roadmap updates:** When CEO signs off a milestone, Director MUST update this roadmap immediately (Status, Current testable). Do not wait for a reminder.
- **Milestone completion triggers Session End:** Marking a milestone complete MUST trigger the full Session End Checklist (memory save, learning capture, ship_log, subagent summary). Do not update the roadmap without running the checklist.
- **Learning capture:** When a bug is fixed or a workaround is discovered, Director MUST document it in the appropriate learnings doc (e.g. docs/dev_standards/engine_learnings.md) and inject "Learnings to check" into future specialist prompts. Do not repeat mistakes.

---

## Still true?

- Update as milestones complete or CEO approves mocks
- Asset & design sub-milestones (2.A.x, 3.A.x, etc.) gate before or parallel to tech milestones
- Prune stale entries periodically

