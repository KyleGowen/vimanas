# Ship Log

Dated entries: what changed, why.

## Format

```
### YYYY-MM-DD
- Change description
- Rationale or context
```

## Entries

### 2026-03-15 (Session sign-off — CEO Sign-Off)
- **Session sign-off.** CEO signed off current state. Attack patterns by CEO name: WaveConfig.attackPattern (e.g. "Zig-Zag Pressure", "Scatter & Converge") resolved to formation + movement behavior (attack-pattern-resolver.ts, scout-movement.ts). Level 1: waves 1–3 Zig-Zag Pressure (formation `line`, behavior zig_zag: 135px amplitude, 4s period); waves 4–5 Scatter & Converge (staggered_wedge, scatter_converge 130px). Scout count +2 per wave (5,6,5,6,7). New formation type `line` (horizontal, 9 slots, 60px spacing). Elite is one randomly chosen slot in the same formation; EliteEnemy uses same behaviorId/spawnTime as wave so it moves with the pattern (zig-zag with scouts). Unified spawn schedule (spawnSchedule sorted by spawnOffset); pickRandomIndices for elite slot. Learnings: engine_learnings.md "Attack Pattern Movement & Elite in Formation"; level_encounter_memory. Subagent use: none (Director-executed sign-off checklist).

### 2026-03-14 (8.7 Level 1 migration — CEO Sign-Off)
- **8.7 complete.** Level 1 migration CEO signed off. Schema: eliteCount per wave, preMiniBossWaves/preBossWaves, enlarged_elite/root_seeker archetypes. Elite enemy + ElitePool; WaveSpawner mixed waves (scouts + elites), wave completion for both. Mini-boss: enlarged_elite 2× scale, upper-half movement, mini_boss_level_1.png (full-image draw), 1s spawn invuln + no fire during invuln, waves blocked until defeated. Root Seeker boss: triangular primary (multi-origin), lifesteal +5 on hit, leaf-wave secondary every 5s, root_seeker.png, 2× size, right-side up. Boss getWidth/getHeight for placeholder and Root Seeker; scene and homing use for collision. level_1_forest: easy, 5 waves (2–5 scouts + 1 elite), 2s between waves, preMiniBossWaves 3, preBossWaves 5. Restart rule (.cursor/rules/restart-game.mdc): "restart" → kill dev servers, start on 5173. Speed boost: Period (.) key 10×. Learnings: engine_learnings.md — Level Timing & Mini-Boss Spawn, Boss & Enemy Sprites (spawn order, invuln, full-image draw, getWidth/getHeight). Roadmap 8.7 → Done.

### 2026-03-14 (8.6 Director level generation flow — CEO Sign-Off)
- **8.6 complete.** Director level generation flow CEO signed off. GameplayScene: async level load when loadLevelSpecSync returns null (loading state, post-spec init on first update, fallback to default on failure). Game: parseLevelIdFromSearch, initialLevelId from URL; inject levelId into state when goToScene('shipSelect'). ShipSelect: read levelId from sceneState, forward to gameplay. Director note in agents/director.md: verify generated levels via ?level=<id>. Tests: async load (fetch stub, 3 microtask flushes), loading draw, parseLevelIdFromSearch (game.test.ts). public/levels exists. Gate: CEO request → playable level. Roadmap 8.6 → Done. Next: 8.7 (Level 1 migration).

### 2026-03-12 (8.1, 8.2, 8.3 — Level Config Loader, WaveSpawner Refactor, Parallax Theme Selector)
- **8.1, 8.2, 8.3 complete.** These milestones were already implemented in codebase but not marked as Done.
- **8.1 (Level config loader):** level-spec.ts (types), level-loader.ts (load/validate), level_1_forest.json (spec file), GameplayScene uses loadLevelSpecSync() and passes to WaveSpawner.
- **8.2 (WaveSpawner refactor):** WaveSpawner accepts levelSpec, reads wave config via getWaveConfig(), uses formation/count/stagger/betweenWaveDelay from spec.
- **8.3 (Parallax theme selector):** ParallaxController.setTheme(themeId), getLayerConfigsForTheme() in theme-layers.ts, GameplayScene passes levelSpec?.theme.
- **Parallax test fixes:** 6 failing tests had outdated expectations (negative Y offsets). Per engine_learnings.md "Parallax Scroll Direction", positive offsetY is correct (background scrolls south when player flies north). Tests updated to match.
- **Level-loader tests:** Added 19 unit tests for level-loader.ts covering sync/async loading, validation, getLevelIdFromState.
- **Learnings:** Test expectations can become stale after bug fixes. When fixing behavior bugs, also update tests. Document correct behavior in engine_learnings.md so tests can be verified against it.

### 2026-03-09 (8.A.7 Director Level Request Protocol — CEO Sign-Off)
- **8.A.7 complete.** Director level request protocol CEO signed off. director_level_request_protocol.md finalized: phase refs fixed (9 → 8); mini-boss mapping added (elite_scout, elite_medium, null); spawn position mapping added (edge: left/right/top, position: 0-1); ambiguity defaults updated. CEO → Director → Level/Encounter → level spec flow documented. Gates 8.6 (Director level generation flow). Roadmap 8.A.7 → Done.

### 2026-03-09 (8.A.6 Boss Archetype Library — CEO Sign-Off)
- **8.A.6 complete.** Boss/mini-boss archetype library CEO signed off. boss_archetype_library.md finalized: Boss archetypes (Placeholder, Root-Seeker, Conduit-Crawler) with visual/behavior/config; Mini-boss archetypes expanded (elite_scout: strafing + rapid fire; elite_medium: stationary + volley, "forest lieutenant"). New behavior patterns: mini_stationary, mini_strafing. CEO request mapping includes mini-boss phrases. Phase refs corrected (9 → 8). Gates 8.5 (boss config from level spec) and 8.A.7 (Director protocol maps CEO phrases to archetypeId). Roadmap 8.A.6 → Done.

### 2026-03-09 (8.A.5 Enemy Taxonomy — CEO Sign-Off)
- **8.A.5 complete.** Enemy type & style taxonomy CEO signed off. Hierarchy: Scout (light, swarm-like), Medium (fewer, stronger interesting weapons), Elite (scout/medium base + more HP, different color, one extra shot type), Mini-boss, Boss. Extensible; CEO plans to expand list over time. enemy_style_taxonomy.md updated.

### 2026-03-09 (8.A.4 Wave Composition Schema — CEO Sign-Off)
- **8.A.4 complete.** Wave composition schema CEO signed off. wave_composition_schema.md: composition model (count vs squads×enemiesPerSquad vs formation default), formation→squad mapping (V 1×5, Staggered Wedge 1×7, Pincer 2×3), WaveSpawner consumption, extensibility. Level spec schema: spawnFrom (wave spawn position), miniboss optional, boss phases (different shots and hit boxes per phase). WaveSpawner: resolveSpawnCenterX() from spawnFrom.position. Roadmap 8.A.4 → Done.

### 2026-03-09 (8.A.3 Theme Taxonomy + Volcano — CEO Sign-Off)
- **8.A.3 complete.** Theme taxonomy CEO signed off. Five theme samples: forest, industrial, sky, city_metropolis, volcano. Volcano sample: 3 iterations—(1) too many buildings → more natural, buildings far; (2) lost top-down + repeat → strict overhead + tileable; (3) CEO approved. Learnings: theme samples require strict top-down overhead and vertical tileability (parallax). Documented in visual_design_memory, level_encounter_memory. Director: CEO Sign-Off Protocol added (agents/director.md)—when CEO says "sign off," run full checklist, commit learnings to specialist memories, then commit and push. Roadmap 8.A.3 → Done.

### 2026-03-10 (8.A.2 Difficulty Curve — CEO Sign-Off)
- **8.A.2 complete.** Difficulty curve mapping CEO signed off. difficulty_curve_design.md: presets (easy/medium/medium_hard/hard), HP multiplier, between-wave delay, stagger, boss HP. docs/context/DIFFICULTY_CURVE.md for design→code mapping when implemented. Extensibility §6. Roadmap 8.A.2 → Done.

### 2026-03-10 (8.A.1 Level Spec Schema + Phase 8 Implementation — CEO Sign-Off)
- **8.A.1 complete.** Level spec schema expandable: docs/concepts/level_spec_schema.md §10 extensibility; docs/context/LEVEL_SPEC.md (schema→code mapping); level-spec.schema.json additionalProperties. designNotes (top-level) and suggestion (per-wave) for CEO suggestions; specialist designs waves, CEO can suggest. director_level_request_protocol updated.
- **Phase 8 implementation.** Level loader (level-spec.ts, level-loader.ts), WaveSpawner refactor, Parallax theme selector, level timing, boss config, Director flow (write-level-spec.mjs), Level 1 migration (5 waves). public/levels/level_1_forest.json. CEO signed off.

### 2026-03-09 (9.A.1 Hangar Layout + Phase 8/9 Swap — CEO Sign-Off)
- **9.A.1 complete.** CEO signed off Hangar layout design (formerly 8.A.1). Visual Design produced hangar_layout_design.md: ship display area, stat display, upgrade panels, flow (select ship → upgrade → ready), controller navigation. CEO approved 2026-03-09.
- **Phase 8/9 swap.** CEO requested swap: Phase 8 = Repeatable Level Design System (was 9); Phase 9 = Hangar and Upgrades (was 8). Roadmap updated: all IDs renumbered; Phase 10 dependencies (10.3 → 8.7, 10.4 → 9.2) updated; hangar_layout_design.md phase refs (8.x → 9.x); Asset & Design Pipeline UI stream (8 → 9). Learning: when reordering phases, update all dependent refs: Depends on, design docs, pipeline table.

### 2026-03-07 (6.S.1, 6.S.2 Ship Selection — CEO Sign-Off)
- **6.S.1, 6.S.2 complete.** CEO signed off ship selection screen. Visual Design produced ship_selection_ui_design.md (layout, flow, propulsion glow accents, controller-first). Full Stack Engineer: ship-registry.ts, ShipSelectScene with 4 ship slots, sprites, focus navigation (Arrow/d-pad/stick), click-to-select; Boot→ShipSelect→Gameplay; Results Continue→ShipSelect; Retry preserves shipId. InputService getMenuNavigateX. D7 (Ship choice) testable. Roadmap 6.S.1, 6.S.2 → Done.

### 2026-03-07 (6.H.3 AI Hygiene — CEO Sign-Off)
- **6.H.3 complete.** CEO signed off. Memory pruned; Unity/Construct refs removed; agent prompts trimmed (Platform/Engine gotchas, engine_learnings); VIMANAS_PROJECT_INIT updated to custom engine. memory/README.md added. EMERGENCY_GITHUB_ACTIONS_CI archived. Roadmap 6.H.3 → Done. Next: 6.S.1 Ship selection UI design.

### 2026-03-07 (6.H.2 Test Hardening — CEO Sign-Off)
- **6.H.2 complete.** CEO signed off. Coverage: 59.65% → 79.44% statements; 442 unit tests, 11 integration tests. Added @vitest/coverage-v8; unit tests for 27 previously untested files; integration tests for Boot→Gameplay, Results→Boot/Gameplay, Gameplay→Results (game over), Turtle spread flow. See docs/coverage_comparison_6h2.md. Roadmap 6.H.2 → Done. Next: 6.H.3 AI hygiene.

### 2026-03-07 (6.H.1 Code Cleanup — CEO Sign-Off)
- **6.H.1 complete.** CEO signed off codebase cleanup milestone. Director executed per Vimanas Codebase Cleanup Plan: Phase 1 (lint fixes, dependency updates, CI audit job, task archive); Phase 2 (removed drawThruster legacy wrapper only; all ship code preserved); Phase 3 (ship-types.ts, weapon-options.ts, shield-utils.ts; shared PlayAreaBounds, ShipStatsBase, PrimaryWeaponOptions, getWingTipMuzzlePositions, getShieldPulseScale); Phase 4 (BossController extracted, thruster-config split, combat-hud generic fallbacks); Phase 5 (naming_conventions.md). Lint clean; 328 tests pass; build succeeds. Roadmap 6.H.1 → Done. Next: 6.H.2 Test hardening.

### 2026-03-07 (6.D Dragon Ship — CEO Sign-Off)
- **6.D.1–6.D.6f complete.** CEO signed off Dragon designs. Design locks (Combat Systems + Visual Design): dragon_design_lock, dragon_primary_weapon_design_lock, dragon_secondary_weapon_design_lock, dragon_shield_design_lock. Sprite: dragon_facing_n.png in public/images/ships/dragon/. Full Stack Engineer: DragonShip, homing crescent primary (HomingCrescentProjectile), charged ball secondary (DragonChargedBallEffect), meditating shield (dragon-shield-effect), DRAGON_THRUSTER_CONFIG (main + wing thrusters). GameplayScene default ship = Dragon. 6.D.5b–6.D.5h sprites Skipped per CEO. Roadmap 6.D.1–6.D.6f → Done.

### 2026-03-07 (6.W Wolf Ship — Implementation Complete)
- **6.W.1–6.W.6f complete.** Director delegated per Wolf Ship Milestones plan. Combat Systems: wolf_design_lock, wolf_primary_weapon_design_lock, wolf_secondary_weapon_design_lock, wolf_shield_design_lock. Visual Design: shield visual spec, thruster spec. Shell: copied CEO-provided wolf_facing_n.png to public/images/ships/wolf/. Full Stack Engineer: WolfShip class, wolf-primary-weapon (dual wing-tip), wolf-secondary (center-nose beam), wolf-shield-effect (front-half arc), GameplayScene integration. TurtleShip swapped for WolfShip for testing. Subagents: 5e753ee7 (design lock), 5c1a85a9 (primary), 6db4b34b (secondary), 61ce1ab2 (shield), 91fd1efe (thruster), cdd3f2f7 (shield visual), 53dea150 (sprite copy), 1ef510b9 (tech impl). Roadmap 6.W.1–6.W.6f → Done. 6.W.5b–6.W.5h sprites Skipped per CEO.

### 2026-03-06 (5.2 Results Screen — CEO Sign-Off)
- **5.2 complete.** CEO signed off Results screen. Full Stack Engineer (feccab49) implemented ResultsScene: victory/defeat states, score, lives, Retry/Continue/Menu; procedural Canvas 2D per results_screen_design; InputService isPrimaryActionPressed, isRetryPressed, isMenuPressed. D6 (Results flow) testable. Roadmap 5.2 → Done.

### 2026-03-06 (5.1 Combat HUD — Implementation)
- **5.1 complete.** Director delegated to Full Stack Engineer (c1a1f16b). CombatHUD in src/ui/combat-hud.ts: loads hp_bar_frame, mana_bar_frame, life_icon, boss_bar_frame SVGs; HP bar bound to ship.stats.hp; mana bar placeholder full; score (+100 scout, +1000 boss); lives 1. GameplayScene: score tracking, CombatHUD integration. Unit tests (8) in combat-hud.test.ts. Gate: HUD visible; HP updates on damage; score on kills. Roadmap 5.1 → Done.

### 2026-03-06 (5.A.2 HUD Assets — CEO Sign-Off)
- **5.A.2 complete.** CEO approved HUD assets. Visual Design (94e31ce1) created SVG assets in public/images/ui/hud/: hp_bar_frame.svg, mana_bar_frame.svg, life_icon.svg, boss_bar_frame.svg. Copper/brass palette, filigree framing per hud_design. Roadmap 5.A.2 → Done. Next: 5.1 Combat HUD.

### 2026-03-06 (5.A.1, 5.A.3 HUD and Results Design — CEO Sign-Off)
- **5.A.1, 5.A.3 complete.** CEO approved HUD design and Results screen design. Director delegated to Visual Design (generalPurpose, 9f1e9fe2) for both specs. Output: docs/concepts/hud_design.md (HP/mana bars, score, lives, boss bar; copper/brass palette), docs/concepts/results_screen_design.md (victory/defeat flow, Retry/Continue, layout). Design docs allow procedural Canvas 2D placeholders until assets exist. Gates 5.A.2, 5.A.4 (assets) and 5.1, 5.2 (tech). Roadmap 5.A.1, 5.A.3 → Done.

### 2026-03-07 (4.3 Wave Sequence — CEO Sign-Off)
- **4.3 complete.** CEO signed off. Director delegated to Full Stack Engineer (d24c3bf2). WaveSpawner: per-transition delays (4.5, 3.75, 3.25, 3.0 s), 5-wave cap, onLevelWavesComplete, gameTime-based timing for pause. GameplayScene: gameTime accumulator. Gate: 3–5 waves; spacing. Subagent contribution summary in tasks/active/PHASE4_4_3_WAVE_SEQUENCE.md.

### 2026-03-07 (4.1 Vertical Scroll + Bug Fixes — CEO Sign-Off)
- **4.1 complete.** Full Stack Engineer (66b7d6b9) implemented world coordinates for vertical scroll. CEO reported three bugs: (1) ship could not move N/S—minY=maxY locked vertical movement; (2) ship idled forward—player world Y caused drift as scroll advanced; (3) design ambiguity on "player stays in frame." Fixes: player ship uses screen Y; play area bounds use screen-space Y range; convert to world only for fire/collision. Learnings documented in engine_learnings.md, full_stack_engineer_memory, level_encounter_memory. Director rule added: CEO follow-up requests (changes, bugs) MUST be delegated to specialists. Roadmap 4.1 → Done.

### 2026-03-07 (4.2 Parallax — CEO Sign-Off)
- **4.2 complete.** Parallax (Level 1 forest) CEO signed off. Director delegated to Full Stack Engineer (generalPurpose) for 4.2.1 ParallaxLayer and 4.2.2 ParallaxController. ParallaxLayer: loads sprite, draws at offset from scrollRatio × scrollOffset; configurable depth. ParallaxController: Far (0.3x), Mid (0.6x), Near (1.0x); LevelScrollController integrated into GameplayScene; parallax draws before ship/enemies. Sub-deliverables 4.2.1–4.2.7 Done. Gate: 4 layers visible; depth order; no z-fight. Subagent IDs: 20473f16 (4.2.1), 85982c7a (4.2.2).

### 2026-03-05 (3.A.1 Scout Design Lock — CEO Sign-Off)
- **3.A.1 complete.** Scout enemy design lock CEO approved. Director delegated to Combat Systems + Visual Design (initial doc); Level/Encounter (formation spec: V, Staggered Wedge, Pincer); Visual Design (top-down silhouette: mantis prow, twin-mandible, wing sweep). Output: docs/concepts/scout_design_lock.md. Gates 3.A.2 (Scout sprite sheet), 3.1 (First enemy). Roadmap 3.A.1 → Done.

### 2026-03-05 (2.4 Projectile Pooling)
- **2.4 complete.** Director added "How to verify 2.4" to roadmap before implementation. Full Stack Engineer (generalPurpose): ProjectilePool (Get/Return), PlayerProjectile.reset(), GameplayScene uses pool; swap-with-last removal (no splice). Gate: no allocations during fire; 60 FPS. Subagent ID: af7dd28f.

### 2026-03-05 (2.3 Basic Gun)
- **2.3 complete.** Director delegated to Full Stack Engineer (generalPurpose). PlayerProjectile, weaponStrength(attack), BasicGun; fire rate 0.15s, speed 120 px/s (12 u/s), lifetime 3s, damage = Attack × 0.25 (Sparrow = 5). Unit tests verify damage formula. Gate: fire rate, speed, damage, cyan projectile. Roadmap 2.3 → Done. Subagent ID: 8c16ccfc.

### 2026-03-05 (2.2 Player Movement)
- **2.2 complete.** Director delegated to Full Stack Engineer (generalPurpose). Movement logic moved into SparrowShip: `update(moveAxis, deltaTime, bounds)`; InputService → SparrowShip; Speed 35 feel; clamped to play area. Unit tests for update (move, clamp). Gate: 4-way move; clamped; Speed 35 feel. Roadmap 2.2 → Done. Subagent ID: ca46e2b3.

### 2026-03-05 (2.1 Sparrow Entity)
- **2.1 complete.** Director delegated to Full Stack Engineer (generalPurpose). Implemented: SparrowShip class (`src/ships/sparrow-ship.ts`) with stats per design lock (HP 14, Defense 12, Attack 20, Mana 19, Speed 35); sprite load/draw; GameplayScene refactored to use SparrowShip; fire placeholder preserved; unit tests (sparrow-ship.test.ts, gameplay-scene.test.ts). Gate: ship visible, top-down, approved sprite, fires on Space. Roadmap 2.1, 2.1.1–2.1.5 → Done. Subagent ID: 1b73a358.

### 2026-03-05 (CI.1 GitHub Pipeline)
- **CI.1 complete.** Director delegated to Platform/Release and Full Stack Engineer. Platform: `.github/workflows/build.yml` — Build job first (checkout → npm ci → npm run build); Lint, Unit tests, Integration tests run in parallel after build. Engineer: ESLint (eslint.config.js, typescript-eslint), `npm run lint`, `npm run test:unit`, `npm run test:integration`; vitest.config.unit.ts and vitest.config.integration.ts; `src/game.integration.test.ts`. All steps pass locally. Roadmap CI.1 → Done. Subagent IDs: 15c8745b (Platform), c31ba639 (Engineer).

### 2026-03-05 (Title Screen Replaces MainMenu)
- **Title screen replaces MainMenu.** CEO requested title screen replace MainMenu (not boot before it); Enter or click anywhere to start. Implemented: Boot transitions directly to Gameplay on Enter/Space/Start or click anywhere; MainMenu scene removed; SceneId simplified to boot | gameplay; docs updated (HOW_TO_START, tech_architecture, roadmap, FEATURE_title_screen_boot). Flow: Boot (title mock) → Enter/click → Gameplay.

### 2026-03-05 (Title Screen Boot)
- **Title screen mock as boot screen.** CEO requested use of approved mock (title_screen_mock_sparrow.png) as new boot screen. Director delegated to Full Stack Engineer (generalPurpose). Implemented: title image copied to `public/images/title_screen.png`; Boot scene loads and draws image scaled to cover canvas; transition to MainMenu on Enter/Space/Start or auto after 2.5s; tests updated. Gate verified: `npm run dev` → Boot shows title mock; press Start or wait → MainMenu. Subagent ID: 4ab409bf-4559-4ffe-ba38-1e61a67ab6f7.

### 2026-03-05 (Framework-Free Pivot)
- **Framework-free pivot complete.** Eliminated Unity and Construct. Built custom engine: HTML5 Canvas 2D, TypeScript, Vite. Phase 1 (1.1–1.10) implemented: project init, HTML shell, canvas display, game loop, keyboard/gamepad input, image loading, sprite rendering, Boot flow, MainMenu screen. Construct project archived to `archive/construct/`. Construct MCP removed. Renamed Construct Gameplay Engineer → Full Stack Engineer. Updated: CLAUDE.md, tech_architecture.md, HOW_TO_START.md, roadmap, agents, memory, design locks, dev standards. CI: Vite build on push. Current testable: D1, D2 — Boot → MainMenu → New Game → Gameplay; ship visible; WASD/stick move. D3 (fire), D4 (combat) pending.

### 2026-03-04 (Unity → Construct 3 Migration)
- **Full migration complete.** Archived Unity code to `archive/unity/` (Assets, Packages, ProjectSettings, src). Installed Construct 3 MCP (`tools/construct3-mcp`). Created Construct 3 project: `vimanas.c3proj`, layouts (Boot, MainMenu, Gameplay), event sheets, scripts/main.ts. Object types: SparrowShip, Projectile, ScoutEnemy, EnemyProjectile. Migrated sprites to `images/`. Updated canon: tech_architecture.md, construct_learnings.md, CLAUDE.md. Renamed Unity Gameplay Engineer → Construct Gameplay Engineer. Updated director, delegation template, shared_memory, VIMANAS_PROJECT_INIT. Removed unity_learnings.md. Next: open project in Construct 3 editor, add Boot→MainMenu→Gameplay flow, movement (WASD), fire (Space), combat.

### 2026-03-04 (2.3 Laser beam fix — implementation)
- **Milestone 2.3 implementation complete.** Director fallback (Unity specialist delegation aborted). Applied: PlayerWeapon DefaultExecutionOrder(-100), GameplayUIController DefaultExecutionOrder(0); Canvas.sortingOrder = 100; SetAsLastSibling every Update when projectiles exist; LateUpdate retry for _laserSprite; _debugProjectileMirror + projectile_mirror_log.txt. unity_learnings.md updated with 2.3 fix section. Gate: cyan projectile visible when firing. CEO to verify: build for Mac, run, hold Space. If not visible: enable _debugProjectileMirror on GameplayUIController, check persistentDataPath/projectile_mirror_log.txt.

### 2026-03-04 (Core C# First implementation)
- **CEO approved Core C# First plan.** Implemented Phase A (Extract Core) and Phase B (Headless Simulator). Created `src/Vimanas.Core/` with ShipStats, CombatMath, GameState, GameLoop, MovementSystem, WaveComposition; `src/Vimanas.Core.Tests/` with xUnit tests (damage formula, fire rate, bounds, wave positions, integration); `src/Vimanas.Core.Simulator/` console app. Build: `dotnet build src/Vimanas.Core/`, `dotnet test src/Vimanas.Core.Tests/`, `dotnet run --project src/Vimanas.Core.Simulator`. Updated tech_architecture.md, unity_learnings.md, director_memory, unity_gameplay_engineer_memory, combat_systems_memory, platform_release_memory per plan Agent Memory directive.

### 2025-03-04
- **CI license activation fix:** Build failing with "error while trying to activate the Unity license." Platform/Release specialist added "License activation failure" troubleshooting to platform_learnings.md (Personal/Professional paths, base64 workaround); created `.github/workflows/request-license.yml` for Personal license (.alf → license.unity3d.com → .ulf → UNITY_LICENSE). Build will pass once CEO completes license setup per docs. Subagent ID: d72672e9-f48d-409d-9cd7-b53d70575963.
- **CI.1 GitHub Actions workflow:** Platform/Release specialist (generalPurpose) created `.github/workflows/build.yml`. GameCI `unity-builder@v4`, StandaloneOSX (macOS), Git LFS, Library cache. Triggers on push/pull_request. Required secrets: UNITY_LICENSE (or UNITY_SERIAL), UNITY_EMAIL, UNITY_PASSWORD. docs/dev_standards/platform_learnings.md created with setup instructions. Roadmap CI.1 → Done. Subagent ID: c98b3b1a-058d-4a34-8aa9-0278990a67d0.

### 2026-03-04
- **2.3 laser visibility — session loss:** CEO requested lasers firing before end of day. Team implemented: projectile mirror (FindObjectsByType, UI Image per projectile), white-sprite fallback for Image null, active-only filter, larger sizeDelta. CEO still saw only yellow muzzle flash; no laser beams visible. Compile errors occurred (FindObjectsInactive.Include, System.Array.FindAll); reverted. Root cause unknown: projectiles may not be found, or world→canvas conversion may be wrong, or Editor vs build differs. Debug logs are Editor-only. Full learnings in unity_learnings.md "Projectile mirror failure." Director memory updated. Next attempt: verify in Editor first; add build-inclusive debug; consider alternative (e.g. projectile as ShipUI child for smoke test).

### 2026-03-03
- **Laser beam projectile VFX:** sparrow_laser_beam.png created (24×128 px, cyan aether style). Projectile prefab uses laser sprite (0.08×0.3 units); Projectile.SetDirection rotates beam to face travel direction. Regenerated at higher res (24×128) for readability.
- **Phase 2.1, 2.3 advanced:** (1) PHASE2_2_1 task updated: SparrowShip uses sparrow_facing_n (north-facing); roadmap 2.1 → Done. (2) Basic gun (2.3) aligned with design lock: ShipStats component (Attack 20, HP 14, etc.); PlayerWeapon reads Attack, computes weaponStrength = Attack × 0.25, passes to Projectile.SetDamage(); Projectile supports runtime damage override with _damage fallback. Sparrow → 5 damage per shot. Roadmap 2.3 → Done. Subagent: Unity Gameplay Engineer (60214d64).
- **CEO requests (earlier):** North-facing boost sprite created (GenerateImage); default ship sprite swapped to sparrow_facing_n; FindObjectOfType → FindFirstObjectByType (build fix).

### 2025-03-03
- **2.1 Ship Visual Consolidation progress:** Sparrow sprite now displays instead of cyan square. Fix: Resources sprites (sparrow_facing_n, sparrow_boost, sparrow_firing) had textureType: 0, spriteMode: 0—Resources.Load<Sprite> returned null. Updated .meta to textureType: 8, spriteMode: 1. unity_learnings.md: Resources sprite import rule, mirror architecture (SparrowShip drives; GameplayUIController mirrors). shared_memory updated.
- **2.A.3 Basic gun design CEO approved:** Director delegated to Combat Systems + Visual Design (separate subagents). Output: docs/concepts/basic_gun_design_lock.md. Combat: weaponStrength = Attack × 0.25; fire rate 0.15s; speed 12 u/s. Visual: cyan core (#00FFFF), trail, readability rules. Roadmap, task file, shared_memory updated. Gates 2.3 Basic gun and 2.4 Projectile pooling. Next: 2.1 (Sparrow prefab), 2.3 (Basic gun—both deps met).
- **2.A.2 Sparrow sprite sheet CEO approved:** Roadmap, task file, shared_memory updated. Individual sprites in Assets/Content/Sprites/Sparrow/. Next: 2.A.3 (Basic gun design) or 2.1 (Sparrow prefab—both deps met).
- **2.A.1 Sparrow design lock CEO approved:** Director updated sign-off (Combat Systems, Visual Design, CEO), roadmap 2.A.1 → Done, shared_memory, task file. Next: 2.A.3 (Basic gun design) or 2.A.2 (Sparrow sprite sheet).
- **2.A.1 Sparrow design lock delivered:** Director delegated to generalPurpose (Combat Systems + Visual Design). Output: docs/concepts/p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md. Stats: HP 14, Defense 12, Attack 20, Mana 19, Speed 35 (100 total). Visual lock: silhouette, palette (cobalt/cyan), propulsion #00FFFF. References approved sparrow_ship_pilot_style.png. Sign-off section pending CEO review. Gates 2.A.2 (sprite sheet) and 2.1 (prefab).
- **Milestone 1.4 CEO sign-off:** Fire (Space) verified. Phase 1 complete. Roadmap 1.4 → Done. PHASE1_GATE_CHECK 1.4 manual gate ✓. Removed Debug.Log from PlayerWeapon. Current testable: Boot → MainMenu → New Game → Gameplay; ship visible, WASD, fire.
- **Fire (Space) fix — Unity specialist:** Director requested team fix fire input. generalPurpose (Unity Gameplay Engineer) applied: (1) GameplayUIController: StandaloneInputModule → InputSystemUIInputModule so Space reaches InputService; (2) UI muzzle flash (yellow bar above ship) when Fire pressed for visible feedback on macOS; (3) Debug.Log in PlayerWeapon.Fire() for verification. unity_learnings.md updated. Subagent ID: 15fcb5a1-8d8b-4608-9c53-8b8755403c19. Ready for CEO verification.
- **CEO feedback — Fire (Space) not working:** Director relayed: team's work did not result in CEO being able to fire via Space bar. WASD works; fire does not. Documented in unity_learnings.md with investigation checklist (EventSystem/UI input conflict, PlayerWeapon wiring, Input action enabled, projectile visibility). shared_memory updated. Unity specialist must address before 1.4 gate passes.
- **Phase 1 learnings collected:** Director requested milestone 1.4 brief and learnings. Added Phase 1 Collected Learnings table to unity_learnings.md; Input System section (VimanasInputActions, FindObjectOfType preference); shared_memory updated. Milestone 1.4 gate: WASD + fire (Space/controller).
- **Milestone 1.3 CEO sign-off:** New Game → Gameplay verified. Ship (cyan UI square) visible and movable with WASD. GameplayUIController workaround for macOS SpriteRenderer rendering. Roadmap 1.3 → Done. PHASE1_GATE_CHECK 1.3 manual gate ✓. D1–D2 achieved.
- **Subagent use (1.3):** generalPurpose (Unity Gameplay Engineer) — MainMenuController build-index loading; GameplayUIController UI workaround for macOS. Learnings: unity_learnings.md (SpriteRenderer/macOS, GameplayUIController).
- **Phase 1 gate check:** Director ran code verification on all four Phase 1 milestones (1.1 Unity init, 1.2 Boot, 1.3 MainMenu, 1.4 Input). All pass code review. BootLoader→MainMenu, MainMenuController→Gameplay, InputService with WASD/controller+fire wired. Gate checklist: tasks/active/PHASE1_GATE_CHECK.md. Manual verification (open in Unity, build, play) required to mark Done. Roadmap Phase 1 status: Ready.
- **Milestone 1.2 CEO sign-off:** Boot → MainMenu verified. New Game → Gameplay deferred (macOS rendering: main view shows only clear color). PHASE1_GATE_CHECK.md updated.
- **Unity learnings documented:** docs/dev_standards/unity_learnings.md created. Covers: build index vs scene name for standalone, EditorBuildSettings enabled flag, m_TargetEye on macOS (set 0 not 3), serialization alignment. Unity Gameplay Engineer agent and tech_architecture updated to reference.
- **Learning-from-sessions rules added:** Director must document bugs/workarounds in domain learnings docs; inject "Learnings to check" into specialist prompts; session checklist includes learning capture. Updated: director.md, delegation_template.md, roadmap Rules, shared_memory, CLAUDE.md.
- P0.007 marketing slide deck produced. Creative Director (generalPurpose) drafted 14-slide Marp deck using p0 mocks. Covers: premise, gameplay, ships, pilots, story, enemies/bosses, levels, visual identity, platforms. Output: docs/concepts/p0_mocks/marketing_slide_deck.md. Subagent ID: c506cb53-e2d8-4df0-961d-cc71b6e1833e. Ready for CEO review.

### 2025-03-01
- Project initialization complete. Directory structure, canon docs, agent profiles, CLAUDE.md, rules, memory, plans, tasks, and Unity Assets folder structure created.
- Ready for feature development.
- Director provided 1943 and Aero Fighters reference images. Stored in docs/references/. Primary takeaway: terrain-based levels (ocean, land, forest, mountains), not abstract sky. Art style guide updated.
- Level POC work deleted per Director. To revisit later.
- Single-player gameplay mockup created. Concept doc: docs/concepts/single_player_gameplay_mockup.md. Includes: detailed level (4 parallax layers, coastline terrain), Sparrow vs insectoid wave, HUD, VFX. Mockup image: docs/concepts/single_player_gameplay_mockup.png. Task: FEATURE_003.
- CEO provided 7 sophisticated 16-bit reference images. Art style guide updated: "Sophisticated 16-bit" principle, sprite sophistication, enemy detail, VFX language, layered environments. References stored in docs/references/sophisticated_ref_1–7.png. Visual Design agent persona updated. Gameplay mockup and Sparrow POC now include sophistication notes.
- Regenerated single_player_gameplay_mockup.png with sophistication context: layered atmospheric background, glowing ship/exhaust, intricate insectoid enemies with vents, starburst explosion, vibrant contrast.
- Regenerated mockup per CEO: less cartoony, more realism. Angular/sharp insectoid enemies (not bulbous), refined mechanical look. Art style guide updated with enemy realism note.
- Regenerated mockup with strict top-down perspective: bird's eye view, ships as top-down silhouettes, terrain from above. Art style guide and gameplay concept doc updated with perspective requirement.
- CEO feedback: previous mockup too simple/childish. Regenerated with sophistication restored: rich detail, layered atmosphere, glowing effects, mature aesthetic. Art style guide: explicit anti-childish note added.

### 2025-03-01 (continued)
- MILESTONE_001 recalibrated per CEO: too much at once. Scope reduced to **ships only**—the heart of the game. Theme corrected: **not steampunk**; primary theme is early civilization + ancient aliens (Stargate-type). Steampunk as influence only. Top-down view emphasized as primary concern. Art style guide, game bible, and all four ship concept docs updated. Pilots, levels, enemies, investor mockup deferred to later milestones. Ready for ship concept iteration.

### 2025-03-01 (continued)
- Ship concept iteration: regenerated all four ships (Sparrow, Turtle, Wolf, Dragon) with Vimana aesthetic—ancient civilization, stone/bronze, alien-derived, NOT Victorian steampunk. New images: sparrow_ship_vimana_v1.png, turtle_ship_vimana_v1.png, wolf_ship_vimana_v1.png, dragon_ship_vimana_v1.png. Concept docs updated.
- Ship iteration: CEO feedback—mocks not nimble enough, looked like mother ships. CEO loves original Sparrow. Regenerated Turtle, Wolf, Dragon as fighter-like, compact, following Sparrow. New images: turtle_ship_fighter_v1.png, wolf_ship_fighter_v1.png, dragon_ship_fighter_v1.png. Sparrow blue v2 restored as canonical. Design rule added: fighter-like, nimble, NOT mother ship. Backgrounds beneath ships approved—keep for level art.
- Ship iteration: Keep Wolf, Sparrow. Dragon—remove dragon head from wing, normal wings (dragon_ship_fighter_v2.png). Turtle—too animal; make spaceship just thicker, no turtle qualities (turtle_ship_fighter_v2.png).
- Cleanup: removed unused concept art—dragon_ship_vimana_v1.png, ship_wolf_concept.png, dragon_ship_fighter_v1.png, ship_turtle_concept.png, level_arena_concept.png, level_1_poc.png. Removed broken Sparrow "earlier concepts" references (images missing).
- Visual style reference updated: Kaladesh (MTG) as primary theme. Bright, optimistic, aether-powered, ornate mechanical, Indian-inspired. Art of MTG Kaladesh collection linked. Art style guide, references README, Visual Design agent updated.
- Kaladesh elevated to design pillar (game_bible). All 4 ships regenerated with Kaladesh aesthetic: sparrow_ship_kaladesh.png, turtle_ship_kaladesh.png, wolf_ship_kaladesh.png, dragon_ship_kaladesh.png. Ship concept docs and ships_reference.md updated.
- Ship iteration: Wolf—less busy, no wolf head (wolf_ship_kaladesh_v2.png). Dragon—single-person fighter jet, compact, not airliner (dragon_ship_kaladesh_v2.png). Sparrow and Turtle left alone per CEO.
- Ship iteration: Dragon—remove dragon head, more aether and Kaladesh (dragon_ship_kaladesh_v3.png). Wolf—menacing front, cockpit in front (wolf_ship_kaladesh_v3.png).
- Ship iteration: Dragon kept. Wolf—revert to v2 style but more fighter jet (wolf_ship_kaladesh_v4.png).
- Turtle iteration: Match Wolf and Dragon style (turtle_ship_final.png). Removed all Kaladesh references from docs—was inspiration only.
- Turtle reverted: turtle_ship_final.png removed. Back to turtle_ship_kaladesh.png per CEO—previous design preferred.
- MILESTONE_001 approved. Four ship designs solidified as canonical starting point. Superseded concept art deleted. Committed.

### 2025-03-01 (plan implementation)
- Implemented Phase 1 (Foundation): Unity 6 project init, Boot scene, MainMenu, Input System. Git LFS configured.
- Implemented Phase 2 (First Playable): Sparrow ship prefab, player movement, basic gun, projectile pooling.
- Implemented Phase 3 (Combat): Scout enemy, enemy projectiles, Damageable, WaveSpawner. Player can move, shoot, take damage. Enemies spawn in V-formation.

### 2025-03-01 (CEO directive)
- CEO: Only ship concept art is approved. All other concept art unapproved. Deleted: pilot (4), enemy (4), level (3), title screen, investor mocks (2). Kept: Sparrow, Turtle, Wolf, Dragon ship images only. Updated docs with broken image references.
- Roadmap expanded per CEO: Phase 0 (Investor Pitch Mocks) added—ship, pilot, level, boss fight, title screen mocks as individual deliverables requiring CEO sign-off. Current state section added. Tech phases 1–11 with status tables.

### 2025-03-02
- Roadmap typo fix: P0.1 "Code naemSparrow" → "Code names: Sparrow, Turtle, Wolf, Dragon."
- Narrative sample produced per Director request. See docs/concepts/narrative_sample.md.

### 2025-03-02 (P0.2 Pilot mocks)
- P0.2 pilot mocks produced. Four portraits: Speed specialist, Weapon specialist, Defensive specialist, Neutral rookie. Per pilot_visual_briefs and art style guide. Deliverable: docs/concepts/pilot_mocks_deliverable.md. Status: Ready for CEO review.
- CEO feedback: Pilots looked same, all middle-aged white men, too steampunk. Iteration 2: Kaladesh imagery for dress (gilded armor, NOT steampunk). Varied ages, ethnicities, genders. Rookie: young, fresh-faced, less gear. Speed: thin, sharp features. Defensive: thicker, older, more protection. Weapons: excitable, trigger-happy, fighter-pilot gear. pilot_visual_briefs updated. Portraits regenerated.
- P0.2 pilot mocks approved by CEO. Signed off.

### 2025-03-02 (P0.3 Level mocks)
- P0.3 level mocks produced. Four levels: Coastline, Forest, Industrial, Sky. Per level_parallax_concepts, single_player_gameplay_mockup, art_style_guide. Deliverable: docs/concepts/level_mocks_deliverable.md. Concept images: level_mock_1_coastline.png, level_mock_2_forest.png, level_mock_3_industrial.png, level_mock_4_sky.png. Level 4 reconciled: roadmap specifies "sky" (open sky, clouds, high altitude); concepts doc had "Mountains" as alternate. Status: Ready for CEO review.
- **Subagent use summary:** (1) Spec gathering: read level_parallax_concepts, single_player_gameplay_mockup, level_terrain_framing; reconciled Level 4 = Sky per roadmap. (2) Draft level_mocks_deliverable.md consolidating 4 levels; filled Level 4 (Sky) gap. (3) Generated 4 concept images via GenerateImage. (4) Director: created P0_003_level_mocks task, updated memory, ship_log, roadmap.

### 2025-03-02 (P0.3 Level mocks — Iteration 2, CEO feedback)
- CEO feedback: (1) Level mocks were front-facing, not top-down overhead. (2) Too steampunk; prioritize Kaladesh. (3) Levels need more detail.
- Regenerated all 4 level mock images with strict top-down overhead prompts (camera straight down, map-like). Added Kaladesh elements (gilded, Indian-inspired, temple silhouettes, filigree) to prompts.
- Updated art_style_guide: "Kaladesh First" pillar; Environment & Level Art—Kaladesh over steampunk, strict overhead perspective. Updated level_mocks_deliverable: Iteration 2, Kaladesh language, richer terrain features. Updated level_parallax_concepts, single_player_gameplay_mockup. Status: Ready for CEO review.

### 2025-03-02 (P0.3 Level mocks — Iteration 3, CEO feedback)
- CEO feedback: (1) Forest mock = style reference for all levels. (2) Industrial: no 1900s planes—use Kaladesh flying machines/airships. (3) Sky: still forward facing, too basic. (4) Coastline: awful, basic, uninteresting. Doesn't match forest. 1943 causing basic style—use for gameplay only.
- Regenerated coastline, industrial, sky using forest mock as reference image. Coastline: from scratch, no 1943. Industrial: Kaladesh airships, no airplanes. Sky: strict overhead, forest-style detail. Updated art_style_guide, level_mocks_deliverable, references/README, level_parallax_concepts, single_player_gameplay_mockup, level_terrain_framing: 1943/Aero Fighters = gameplay only, NOT style. Forest mock = style reference.

### 2025-03-02 (P0.3 Level mocks — Iteration 4, CEO feedback)
- CEO feedback: (1) Sky—remove airplane and circles in corners. (2) Coastline—too illustrated, buildings too close, land/structures not proportional. (3) Industrial—great, remove all airships.
- Regenerated sky: NO airplane, NO corner circles/frames. Regenerated coastline: proportional scale (structures small and distant), less illustrated, more painterly. Regenerated industrial: architecture only, NO airships. Updated level_mocks_deliverable.

### 2025-03-02 (P0.3 Level mocks — Iteration 5, CEO feedback)
- CEO feedback: (1) Sky mock—lock it in (approved). (2) Industrial—great, need to appear twice as high over city. (3) Coastline—subject matter and scale perfect but doesn't meet other criteria.
- Sky: marked LOCKED IN in deliverable. Industrial: regenerated with ~2x higher altitude. Coastline: regenerated keeping scale/subject, applying full forest mock style (Kaladesh ornate, rich detail, jewel accents) to meet art criteria.

### 2025-03-02 (P0.3 Level mocks — Iteration 6, CEO feedback)
- CEO feedback: Iteration 5 "much further from intent." Industrial—roll back to last iteration. Coastline—regenerate based on CEO feedback and team influences.
- Industrial: rolled back to iteration 4 (normal altitude, architecture only, no airships). Coastline: Visual Design + Level/Encounter agents produced spec; regenerated with specialist influences—clarity (Gradius/R-Type), layered atmosphere, coastline-specific Kaladesh (ornate piers, distant temples), no forest elements. Subagent used for coastline prompt.

### 2025-03-02 (P0.3 Level mocks — Iteration 7, CEO feedback)
- CEO feedback: Industrial now looks like forest; coastline doesn't look like it's from this game. Go back to initial trials.
- Industrial: regenerated with initial trial approach—dense industrial (grey, copper, brass, pipes, conduits), NO forest reference, industrial character only.
- Coastline: regenerated with initial trial approach; sky mock as reference for game consistency (same world as locked-in sky).

### 2025-03-02 (P0.3 Level mocks — Iteration 8, CEO feedback)
- CEO feedback: Industrial looks great—lock it in. Coastline—redo styled similar to the 3 locked in (forest, sky, industrial).
- Industrial: marked LOCKED IN in deliverable. Coastline: regenerated with forest, industrial, and sky mocks as reference images for style consistency.

### 2025-03-02 (P0.3 Level mocks — Iteration 9, CEO feedback)
- CEO feedback: Coastline too illustrated; others are more 16-bit. Should have ocean, land, scattered buildings. Similar to sky view but with water and some land.
- Coastline: regenerated with 16-bit style (less illustrated, retro game aesthetic), ocean + land + scattered buildings, sky-like composition.

### 2025-03-02 (P0.3 Level mocks — Iteration 10, CEO feedback)
- CEO feedback: Great start; buildings too big for land. Make smaller—higher altitude (vimanas flying higher). Don't deviate too much.
- Coastline: regenerated with smaller buildings relative to land; minimal other changes. (Output was identical—same image returned.)

### 2025-03-02 (P0.3 Level mocks — Iteration 11, CEO feedback)
- CEO feedback: Iteration 10 image identical to previous. Try again with all feedback.
- Coastline: regenerated with forest/industrial/sky as reference (not coastline). Explicit: 16-bit style, ocean+land+scattered buildings, buildings VERY SMALL (tiny dots, higher altitude), land/ocean dominate.

### 2025-03-02 (P0.3 Level mocks — Iteration 12, CEO feedback)
- CEO feedback: Layout good. Buildings and airships don't look the same as other mocks.
- Coastline: regenerated—keep layout; buildings and vessels to match forest/industrial/sky (Kaladesh golden domes, ornate, gilded).

### 2025-03-02 (P0.3 Level mocks — Iteration 13, CEO feedback)
- CEO feedback: Remove airships; perspective a little higher up. "I think we've got it."
- Coastline: regenerated—NO airships; slightly higher altitude/perspective.

### 2025-03-02 (P0.3 Level mocks — Ocean replace Coastline)
- CEO: Scrap coastline; create ocean mock—mostly ocean, a few waves, few clouds, maybe island. Replaced with level_mock_1_ocean.png. Deleted coastline references.
- CEO: Remove building; add some Kaladesh-style ships in water, not too many. Ocean mock regenerated.
- CEO: Get rid of ocean mock. Three mocks suffice (forest, industrial, sky). Removed all references to ocean/Level 1 mock. Deleted level_mock_1_ocean.png. Renumbered: Forest=Level 1, Industrial=Level 2, Sky=Level 3.

### 2025-03-02 (P0.4 Boss fight mocks)
- P0.4 boss fight mocks produced. Two mocks: (1) Level 1 Root-Seeker boss + Sparrow + Forest; (2) Level 2 Conduit-Crawler boss + Dragon + Industrial. Per boss_encounter_briefs, art_style_guide, level_mocks_deliverable. Deliverable: docs/concepts/boss_mocks_deliverable.md. Concept images: boss_mock_1_forest.png, boss_mock_2_industrial.png. Status: Ready for CEO review.
- **Subagent use summary:** (1) Level/Encounter agent: boss_encounter_briefs.md—Root-Seeker (forest-organic, horizontal sprawl, sweeps/spread/orb rain) and Conduit-Crawler (industrial, vertical tower, turret volleys/beams). Phases, firing patterns, silhouette notes. (2) Visual Design agent: boss_mocks_deliverable.md, boss_mock_image_prompts.md. Composition, design intent, image prompts for both mocks. (3) Director: generated images via GenerateImage, copied to docs/concepts/, updated roadmap, ship_log, shared_memory.

### 2025-03-02 (P0.4 Boss fight mocks — Iteration 2, CEO feedback)
- CEO feedback: Love the bosses (especially Conduit-Crawler naming). Both images too illustrated—match locked-in level mock style. Mock 1: player ship must be in front of boss.
- Visual Design agent: Updated boss_mock_image_prompts.md—16-bit game aesthetic, NOT overly illustrated/painterly, match level_mock_2/3. Mock 1: Sparrow in foreground, boss in background. Negative prompts: no painterly, no overly illustrated.
- Regenerated both boss mock images. boss_mock_1_forest.png, boss_mock_2_industrial.png replaced in docs/concepts/. Status: Ready for CEO review.

### 2025-03-02 (P0.4 Boss fight mocks — Iteration 3, CEO feedback)
- CEO feedback: Love both mocks. Ships to look more like our mocks (sparrow_ship_kaladesh, dragon_ship_kaladesh). Use boss UI elements from Conduit-Crawler on both images.
- Visual Design agent: Updated boss_mock_image_prompts.md—Iteration 3. Ships match sparrow_ship_kaladesh.png and dragon_ship_kaladesh_v3.png (cyan/cobalt, gold filigree for Sparrow; dark red, multi-gun for Dragon). Boss UI on BOTH: top center "BOSS: [NAME]", copper-framed health bar, score/lives section (X00 000, gold-framed red X, star icons).
- Regenerated both boss mock images. boss_mock_1_forest.png, boss_mock_2_industrial.png replaced. boss_mocks_deliverable.md updated. Status: Ready for CEO review.

### 2025-03-02 (P0.4 Boss fight mocks — Iteration 4, CEO feedback)
- CEO feedback: Keep Conduit-Crawler mocks (current and previous). Regenerate Root-Seeker only—same boss and player ship ratio as Conduit-Crawler.
- Updated boss_mock_image_prompts.md: Iteration 4. Root-Seeker prompt—size ratio matching Conduit-Crawler (boss 4–5× taller, 3–4× wider than player ship; boss dominates upper half, ship compact in lower-middle).
- Regenerated boss_mock_1_forest.png only. boss_mock_2_industrial.png unchanged. boss_mocks_deliverable.md updated. Status: Ready for CEO review.

### 2025-03-02 (P0.4 Boss fight mocks — Iteration 5, CEO feedback)
- CEO feedback: Root-Seeker looks good but ship too large on screen. Make Sparrow more proportioned like Conduit-Crawler mocks.
- Updated boss_mock_image_prompts.md: Iteration 5. Sparrow VERY SMALL on screen—minimal proportion, same screen presence as Dragon in Conduit-Crawler (ship small detail, boss dominates).
- Regenerated boss_mock_1_forest.png only. boss_mock_2_industrial.png unchanged. Status: Ready for CEO review.

### 2025-03-02 (P0.4 Boss fight mocks — Iteration 6, CEO feedback)
- CEO feedback: Looks great. Increase resolution.
- Updated target resolution to 2560×1440 in boss_mock_image_prompts.md. Regenerated both boss mock images at higher resolution (2752×1536 output). Asset list and deliverable updated. Status: Ready for CEO review.

### 2025-03-02 (P0.4 Boss fight mocks — Iteration 7, CEO feedback)
- CEO feedback: Lock in Conduit-Crawler mocks (liked all three). Regenerate Root-Seeker—ship must look like our mock ship (sparrow_ship_kaladesh) and be same size as Conduit-Crawler mock.
- Conduit-Crawler mock marked LOCKED IN in boss_mocks_deliverable.md. Roadmap P0.4 CEO OK: Partial.
- Updated Root-Seeker prompt: ship design from sparrow_ship_kaladesh.png, exact same screen size as Dragon in boss_mock_2_industrial.png. Regenerated boss_mock_1_forest.png only. boss_mock_2_industrial.png unchanged (locked). Status: Ready for CEO review.

### 2025-03-02 (P0.4 Boss fight mocks — LOCKED IN)
- CEO: Lock in these mocks. Provided three approved images.
- Root-Seeker and Conduit-Crawler mocks locked in. Images saved: boss_mock_1_forest.png, boss_mock_2_industrial.png, boss_mock_2_industrial_alt.png. boss_mocks_deliverable.md updated—both mocks LOCKED IN. Roadmap P0.4 CEO OK: Yes. Boss fight mocks added to approved concept art.

### 2025-03-02 (P0.5 Title screen mock)
- P0.5 title screen mock produced. Single mock: layered sky (twilight/dawn), VIMANAS brass/copper hero title, Sparrow fleet silhouette, PRESS START • 1–4 PLAYERS. Per title_screen_concept.md, art_style_guide. Deliverable: docs/concepts/title_screen_mocks_deliverable.md. Image prompts: docs/concepts/title_screen_image_prompts.md. Concept image: docs/concepts/title_screen_mock.png (2560×1440). Status: Ready for CEO review.
- **Subagent use summary:** Visual Design agent (generalPurpose): Created title_screen_mocks_deliverable.md, title_screen_image_prompts.md, generated title_screen_mock.png. Director: updated roadmap, ship_log, shared_memory.

### 2025-03-02 (P0.5 Title screen mock — Iteration 2, CEO feedback)
- CEO feedback: Love the image. (1) Make it more SNES style. (2) One of each ship silhouette (Sparrow, Turtle, Wolf, Dragon) with effects—not four Sparrows.
- Visual Design agent: Updated title_screen_image_prompts.md—SNES/16-bit style (limited palette, sprite-influenced, crisp). Hero asset = four distinct ships (Sparrow, Turtle, Wolf, Dragon), each with signature effects. Regenerated title_screen_mock.png. title_screen_mocks_deliverable.md updated. Status: Ready for CEO review.

### 2025-03-02 (P0.5 Title screen mock — Iteration 3, CEO feedback)
- CEO feedback: Style is right. Content worse; ships don't match mocks. Use mock ship images for shapes. Composition more like first iteration.
- Visual Design agent: Regenerated with sparrow_ship_kaladesh.png, turtle_ship_kaladesh.png, wolf_ship_kaladesh_v4.png, dragon_ship_kaladesh_v3.png as reference_image_paths so AI copies exact ship shapes. Restored first-iteration composition: layered sky, centered VIMANAS, fleet below/flanking title, PRESS START at bottom. Kept SNES style. title_screen_image_prompts.md, title_screen_mocks_deliverable.md updated. Status: Ready for CEO review.

### 2025-03-02 (P0.5 Title screen mock — Iteration 4, CEO feedback)
- CEO feedback: Ships right, style right. Ships further away, more dynamic. Cast in silhouette because of setting sun. Other airships around.
- Visual Design agent: Regenerated—setting sun on horizon (backlight), ships in silhouette (dark against bright sky), further away/smaller, dynamic pose, additional airships in scene (fleet/patrol). Kept four ship shapes and SNES style. title_screen_image_prompts.md, title_screen_mocks_deliverable.md updated. Status: Ready for CEO review.

### 2025-03-02 (P0.5 Title screen mock — Iteration 5, CEO feedback)
- CEO feedback: Like style, like composition. Ships not same shape as mocks. Remove "HERO"—game title is just "Vimanas".
- Visual Design agent: Regenerated with four ship images as reference_image_paths for exact shape match. Title: only "VIMANAS"—no HERO, no subtitle. Kept style and composition (setting sun, silhouette, dynamic, other airships). title_screen_image_prompts.md, title_screen_mocks_deliverable.md updated. Status: Ready for CEO review.

### 2025-03-02 (P0.5 Title screen mock — Iteration 6, CEO feedback)
- CEO feedback: So close—visual artifact needs to be removed and revised. (Full-color detailed spaceship sprite overlaying silhouettes.)
- Visual Design agent: Regenerated with explicit rule—ALL ships pure dark silhouettes only. No full-color ships, no metallic detail, no glow on ships. Reference images = shape only. Negative prompts updated. title_screen_image_prompts.md, title_screen_mocks_deliverable.md updated. Status: Ready for CEO review.

### 2025-03-02 (P0.5 Title screen mock — Iteration 7, CEO feedback)
- CEO feedback: Love it. All four ships flying same direction (all face right—currently two left, two right). Make ships smaller so more background visible.
- Visual Design agent: Regenerated—all four player ships face RIGHT; ships smaller in frame to show more sky, cityscape, horizon. title_screen_image_prompts.md, title_screen_mocks_deliverable.md updated. Status: Ready for CEO review.

### 2025-03-02 (P0.5 Title screen mock — Variant + Reference)
- CEO: Love it. Keep current version for reference. Also generate new variant: ships more dynamic, different colored energy glow effects around them (propulsion).
- Director: Copied title_screen_mock.png → title_screen_mock_reference.png (reference preserved).
- Visual Design agent: Created title_screen_mock_dynamic.png—same composition, ships more dynamic (banking, diving, climbing), each ship has distinct propulsion glow: Sparrow=cyan, Turtle=amber, Wolf=white/silver, Dragon=orange/red. Ships stay silhouettes with glow around/behind. Added variant section to deliverable and image prompts.

### 2025-03-02 (P0.5 Title screen mock — Glow applied to main)
- CEO: Take the glow effects from the dynamic variant and apply them to the ships in title_screen_mock.png.
- Visual Design agent: Regenerated title_screen_mock.png—reference composition (ships smaller, all facing right) + propulsion glow effects per ship (Sparrow=cyan, Turtle=amber, Wolf=white/silver, Dragon=orange/red). Ships remain silhouettes with colored engine trails. title_screen_image_prompts.md updated (iteration 8).

### 2025-03-02 (P0.5 Title screen mock — Iteration 9, style guide update)
- CEO: Like ship colors—add to style guides. Move player ships more into background (middle depth of buildings). Glow on various parts of ships like title_screen_mock_dynamic.png.
- Director: Added "Ship Propulsion Glow Colors (Canonical)" table to docs/art_style_guide.md—Sparrow=cyan, Turtle=amber, Wolf=white/silver, Dragon=orange/red.
- Visual Design agent: Regenerated title_screen_mock.png—ships at middle depth (building level, among cityscape); glow on wings, accents, cores, vents (not just exhaust). title_screen_image_prompts.md, title_screen_mocks_deliverable.md updated (iteration 9).

### 2025-03-02 (P0.5 Title screen mock — Iteration 10, CEO revert)
- CEO: Do not like current version. Want exactly title_screen_mock_reference.png with glow effects from title_screen_mock_dynamic.png.
- Visual Design agent: Regenerated title_screen_mock.png—reference composition (ships in sky above cityscape) + glow effects from dynamic image (wings, accents, cores, vents, trails). Reverted from iteration 9 building-depth. title_screen_image_prompts.md, title_screen_mocks_deliverable.md updated (iteration 10).

### 2025-03-02 (P0.5 Title screen mock — LOCKED IN)
- CEO: title_screen_mock.png perfect for proof of concept. Lock it in. Delete all other title screen mock images we didn't use.
- Director: Marked deliverable LOCKED IN. Deleted title_screen_mock_reference.png, title_screen_mock_dynamic.png. Updated roadmap (P0.5 CEO OK: Yes), shared_memory, ship_log, deliverable, image prompts.

### 2025-03-02 (Director delegation documentation)
- Updated agents/director.md: Added "Delegation via Subagents (REQUIRED)"—explicit mcp_task usage, subagent types (explore, generalPurpose, shell), workflow, exception for trivial edits.
- Updated .cursor/rules/00_project.md: "Spin up sub-agents" clarified to mean use mcp_task with specialist-informed prompts.
- Updated CLAUDE.md: Director must use mcp_task to delegate.
- Updated memory/shared_memory.md: Director delegation rule.
- Updated plans/roadmap.md: Subagent summary rule links to director.md.

### 2025-03-02 (Level mocks — illustrated sleek regeneration)
- CEO: Rethink level mocks in new illustrated, sleek style (post SNES/16-bit deprecation).
- Director: Delegated to Visual Design subagent (generalPurpose) per director.md.
- Visual Design agent: Created level_mock_image_prompts.md with illustrated, sleek prompts. Regenerated level_mock_2_forest.png, level_mock_3_industrial.png, level_mock_4_sky.png. Updated level_mocks_deliverable.md with regeneration note.
- **Subagent use:** generalPurpose (Visual Design persona) — level mock prompts + image generation.
- **Gate:** Level mocks regenerated; require CEO re-approval (previous lock-in superseded by style change).

### 2025-03-02 (Level mocks — Forest/Industrial locked, Sky top-down redo)
- CEO: New level mocks look great. Lock in Forest and Industrial. Sky mock is not top-down—redo it to match.
- Director: Updated level_mocks_deliverable.md—Forest and Industrial LOCKED IN. Delegated Sky redo to Visual Design subagent.
- Visual Design agent: Rewrote Sky prompt with explicit top-down language (camera directly above, bird's-eye, map-like, NO horizon, cloud tops from above). Regenerated level_mock_4_sky.png. Updated level_mock_image_prompts.md. Sky LOCKED IN.
- **Subagent use:** generalPurpose (Visual Design persona) — Sky mock regeneration.

### 2025-03-02 (Level mocks — Sky detail pass)
- CEO: Sky mock is basically what we're going for—add more detail.
- Director: Delegated to Visual Design subagent.
- Visual Design agent: Enhanced Sky prompt with rich-detail language (intricate, dense, filigree, ornate patterns, varied cloud textures, atmospheric depth). Regenerated level_mock_4_sky.png. Updated level_mock_image_prompts.md and deliverable caption.
- **Subagent use:** generalPurpose (Visual Design persona) — Sky detail iteration.

### 2025-03-02 (Level mocks — Sky revert)
- CEO: Undo the last one—was better before.
- Director: Reverted Sky prompt (removed detail enhancement), reverted deliverable caption, delegated Sky regeneration to Visual Design subagent.
- Visual Design agent: Regenerated level_mock_4_sky.png with the reverted prompt (no extra detail language).
- **Subagent use:** generalPurpose (Visual Design persona) — Sky mock regeneration.

### 2025-03-02 (Level mocks — LOCKED IN, committed)
- CEO: That looks great. Lock these in and commit.
- Director: Updated deliverable gate—all three LOCKED IN. Committed and pushed. Commit 503f0b3.

### 2025-03-02 (Boss mocks — regeneration with new ships and levels)
- CEO: Use all new ship and level mocks to redo boss fight mocks. Ships must look exactly like ship mocks (different angles). Ship looks very important.
- Director: Delegated to Visual Design subagent.
- Visual Design agent: Updated boss_mock_image_prompts.md—pilot-style ship refs (sparrow_ship_pilot_style.png, dragon_ship_pilot_style.png), CRITICAL ship-copy instructions, level_mock_2/3 for environment. Regenerated boss_mock_1_forest.png and boss_mock_2_industrial.png with reference_image_paths. Updated boss_mocks_deliverable.md. Status: Pending CEO review.
- **Subagent use:** generalPurpose (Visual Design persona) — boss mock regeneration.

### 2025-03-02 (Boss mocks — Conduit-Crawler locked, Forest style fix)
- CEO: Conduit-Crawler mock looks fantastic—lock it in. Forest redo looks great except style doesn't match Industrial's illustrated style—fix that.
- Director: Delegated to Visual Design subagent.
- Visual Design agent: Conduit-Crawler LOCKED IN. Forest prompt updated—match boss_mock_2_industrial.png style exactly. Regenerated boss_mock_1_forest.png with Industrial mock as primary style reference. Forest: Pending CEO review.
- **Subagent use:** generalPurpose (Visual Design persona) — Forest style fix.

### 2025-03-02 (Boss mocks — LOCKED IN, committed)
- CEO: Looks good. Lock these in and commit and push.
- Director: Both boss mocks LOCKED IN. Committed and pushed. Commit 872c0c2.

### 2025-03-02 (Title screen — regeneration with new style)
- CEO: Redo the title screen mock with our new style.
- Director: Delegated to Visual Design subagent.
- Visual Design agent: Updated title_screen_image_prompts.md—pilot-style ship refs, boss_mock_2_industrial.png and level_mock_4_sky.png as style references. Regenerated title_screen_mock.png. Updated title_screen_mocks_deliverable.md. Status: Pending CEO review.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen regeneration.

### 2025-03-02 (Title screen — style and ship fix)
- CEO: Title screen terrible—doesn't match our style, ships aren't the ships we designed. Composition mostly correct.
- Director: Delegated to Visual Design subagent.
- Visual Design agent: (1) Style: boss_mock_2_industrial.png now PRIMARY style reference—same artist, same rendering. (2) Ships: COPY exact silhouette from pilot-style refs—do NOT invent. Explicit ship descriptions (Sparrow smallest/sleek, Turtle thickest, Wolf balanced, Dragon multi-gun). (3) Composition: kept unchanged. Regenerated title_screen_mock.png.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen fix.

### 2025-03-02 (Title screen — formation and depth)
- CEO: Ships look like they're flying every which way. Make them fly in formation. Move them back in space somewhat.
- Director: Updated title_screen_image_prompts.md—formation (organized, cohesive, V/diamond/staggered, all right, level), further back (smaller, more distant). Delegated regeneration to Visual Design subagent.
- Visual Design agent: Regenerated title_screen_mock.png with formation and depth changes.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen regeneration.

### 2025-03-02 (Title screen — further back, mission feel, Dragon color)
- CEO: Move them back further. Make them look like they're flying away to a mission. Dragon ship's color changed.
- Director: Updated title_screen_image_prompts.md—much further back, flying away to mission (purposeful, departing), Dragon MUST be orange/red (#FF4500). Delegated regeneration.
- Visual Design agent: Regenerated title_screen_mock.png.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen regeneration.

### 2025-03-02 (Title screen — same direction)
- CEO: Near perfect. Keep all the same except make the 4 player ships look like they're all travelling the same direction.
- Director: Updated title_screen_image_prompts.md—stronger "same direction" (parallel, aligned, noses pointing same way, no diverging). Delegated regeneration.
- Visual Design agent: Regenerated title_screen_mock.png. Used current mock as composition reference to preserve everything else.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen regeneration.

### 2025-03-02 (Title screen — remove Turtle)
- CEO: Almost! You added a turtle ship! Get that out of there.
- Director: Updated title_screen_image_prompts.md—three ships only (Sparrow, Wolf, Dragon), NO Turtle, no other airships. Delegated regeneration.
- Visual Design agent: Regenerated title_screen_mock.png with three ships only.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen regeneration.

### 2025-03-02 (Title screen — restore four ships, further away, same destination)
- CEO: We lost the fourth ship. Have the four ships further away from the view screen. Match our new style. Make sure the ships are flying towards the same thing.
- Director: Updated title_screen_image_prompts.md—restore all four ships (Sparrow, Turtle, Wolf, Dragon), ships FAR from view, match boss mock style, all flying toward the same thing (same destination). Delegated regeneration.
- Visual Design agent: Regenerated title_screen_mock.png.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen regeneration.

### 2025-03-02 (Title screen — ships flying toward same thing)
- CEO: Almost perfect except the ships are not flying toward the same thing.
- Director: Updated title_screen_image_prompts.md—stronger language: every nose toward same spot, converging to one vanishing point, lines from noses would meet. Delegated regeneration.
- Visual Design agent: Regenerated title_screen_mock.png.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen regeneration.

### 2025-03-02 (Title screen — Sparrow-only variant)
- CEO: Too busy. Let's try a version with just the sparrow.
- Director: Added "Variant Prompt: Sparrow Only (Less Busy)" to title_screen_image_prompts.md. Delegated generation.
- Visual Design agent: Generated title_screen_mock_sparrow.png—single Sparrow, far from view, cyan glow, flying right. Same composition otherwise.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen variant generation.

### 2025-03-02 (Title screen — Sparrow further back)
- CEO: Like the Sparrow version—cleaner, Sparrow is iconic. But it takes up too much of the screen. Make it look further back in space.
- Director: Updated prompt—Sparrow very small, far back in space, minimal screen space, dominant sky/cityscape. Delegated regeneration.
- Visual Design agent: Regenerated title_screen_mock_sparrow.png with Sparrow pushed further back.
- **Subagent use:** generalPurpose (Visual Design persona) — title screen regeneration.

### 2025-03-03 (Sprite swap development standard)
- Director: CEO requested development standard for easy sprite swapping. Delegated to Unity Gameplay Engineer subagent.
- Unity Gameplay Engineer agent: Created docs/dev_standards/sprite_swap_standard.md. Pattern: ScriptableObject (SpriteAppearanceData) → SpriteApplier component → SpriteRenderer. Artists swap art by editing ScriptableObjects only; no code or prefab changes. Covers ships, enemies, projectiles, powerups, VFX. Includes naming conventions, folder structure, workflow, migration steps from current hardcoded prefabs.
- Director: Linked standard from docs/tech_architecture.md. Implementation delegated separately.
- **Subagent use:** generalPurpose (Unity Gameplay Engineer persona) — sprite swap standard design.

### 2026-03-10 (8.B.1 City Metropolis theme assets)
- Director: CEO requested milestone 8.B.1—City Metropolis parallax assets.
- Initial attempt: Delegated to Visual Design subagent, which overwrote level4 placeholders directly. Game visuals broke (parallax missing). CEO flagged emergency.
- Recovery: `git restore public/images/level4/` restored forest placeholders. Game restored.
- **Process fix:** Stage assets in `docs/concepts/p8_mocks/8_b1_city_metropolis/` first; CEO reviews; then copy to production.
- Generated three parallax layers (Far/Mid/Near) to staging folder. CEO approved.
- Copied approved assets to `public/images/level4/`. Updated README.
- **Learning documented:** visual_design_memory.md—always stage new assets before replacing production files.
- **Subagent use:** generalPurpose (Visual Design persona) — parallax generation (first attempt, reverted).

### 2026-03-10 (Parallax scroll direction bug fix)
- CEO tested City Metropolis parallax in-game; noticed parallax scrolling wrong direction (north instead of south).
- Bug: `offsetY = -(scrollRatio × scrollOffset)` in parallax-layer.ts moved layers upward.
- Fix: Remove negative sign. Now offsetY = scrollRatio × scrollOffset (layers scroll south/down as player flies north).
- **Learning documented:** engine_learnings.md—parallax scrolls south when player flies north.

### 2026-03-12 (8.4 Level timing system)
- Director: Delegated 8.4 Level timing system to Full Stack Engineer.
- Full Stack Engineer: Implemented time-based triggers for boss and mini-boss spawn.
- Created `src/scenes/gameplay/level-timing.ts` with pure functions: `shouldTriggerBossFromTiming()`, `shouldTriggerMiniBossFromTiming()`.
- Created `src/scenes/gameplay/level-timing.test.ts` with 14 unit tests, 100% coverage.
- Updated `src/scenes/gameplay-scene.ts` to check timing config in update loop.
- Added `miniBossPhase` flag for 8.5 integration (spawn logic deferred).
- Behavior: `preBossSeconds` set → boss spawns at that gameTime; null → wave completion triggers boss (existing).
- All 514 tests pass. Coverage 78.73% statements.
- **Subagent use:** generalPurpose (Full Stack Engineer persona) — 8.4 implementation.

### 2026-03-12 (8.4 Enhancement: Wave-based triggers)
- CEO: Requested wave-based boss triggers (e.g., "boss after wave 3"), not just time-based.
- Director: Delegated enhancement to Full Stack Engineer.
- Full Stack Engineer: Added wave-based trigger support to level timing system.
- Added new fields to `LevelTimingConfig`: `preMiniBossWaves`, `preBossWaves`.
- Added new functions to `level-timing.ts`: `shouldTriggerBossFromWaves()`, `shouldTriggerMiniBossFromWaves()`.
- Updated `gameplay-scene.ts`: tracks `completedWaves` counter, checks both time AND wave triggers.
- Updated `level_spec_schema.md` §3 with new fields and trigger priority logic.
- Trigger priority: (1) time-based wins if set, (2) wave-based if set, (3) all-waves-complete fallback.
- Added 18 new unit tests (32 total in level-timing.test.ts). All 532 tests pass.
- **Subagent use:** generalPurpose (Full Stack Engineer persona) — wave trigger enhancement.

### 2026-03-12 (8.5 Boss/mini-boss config)
- Director: Delegated 8.5 Boss/mini-boss config to Full Stack Engineer.
- Full Stack Engineer: Implemented boss and mini-boss config from level spec.
- Created `src/enemies/boss-factory.ts` — Factory creates boss by archetypeId (placeholder only for now; warns for unknown).
- Created `src/enemies/mini-boss.ts` — MiniBoss class: 150×100 size, HP defaults (elite_scout: 150, elite_medium: 250), fires scout weapon.
- Created `src/enemies/miniboss-factory.ts` — Factory creates mini-boss with HP defaults by archetype.
- Created `src/scenes/gameplay/miniboss-controller.ts` — Spawns mini-boss when miniBossPhase triggers.
- Updated `boss-controller.ts` to use `createBoss(bossConfig)` factory.
- Updated `gameplay-scene.ts` with full mini-boss integration: spawn, firing, collision (all weapon types), drawing, score (+500).
- Gate: Boss config applies from level spec; mini-boss spawns when timing triggers AND config not null.
- Added 42 new tests (574 total). All pass.
- **Subagent use:** generalPurpose (Full Stack Engineer persona) — 8.5 implementation.

### 2026-03-12 (CEO sign-off: 8.5)
- CEO signed off on milestone 8.5 Boss/mini-boss config.
- Session End Checklist: director_memory updated (8.5 completion, next 8.6); acceptance_confidence already had 8.5 row; ship_log entry added. Commit and push.
