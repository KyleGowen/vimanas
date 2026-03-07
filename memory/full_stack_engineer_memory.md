# Full Stack Engineer Memory

TypeScript, Canvas 2D, game loop, input, scene management. Full Stack Engineer reads this before implementation work.

## Entries

- **2026-03-05 (Director):** Director LOVES test coverage. Unit and integration tests for everything possible. Cover all non-Unity, non-Construct code. Do not leave code uncovered.
- **2026-03-05 (Framework-free pivot):** Project migrated from Construct 3 to custom engine. No game framework. HTML5 Canvas 2D, TypeScript, Vite. Web-first; Steam/Switch deferred. See docs/tech_architecture.md, docs/dev_standards/engine_learnings.md.
- **2026-03-05 (Build):** `npm run dev` for development; `npm run build` for production. Assets in `public/images/`; paths like `/images/ships/sparrow/sparrow_facing_n.png`.
- **2026-03-05 (CI.1):** ESLint flat config; `npm run lint`, `npm run test:unit`, `npm run test:integration`. Unit: `*.test.ts`; integration: `*.integration.test.ts`. vitest.config.unit.ts and vitest.config.integration.ts.
- **2026-03-05 (2.1):** SparrowShip in `src/ships/sparrow-ship.ts`. Stats: HP 28 (CEO doubled), Defense 12, Attack 20, Mana 19, Speed 42. GameplayScene uses SparrowShip; movement uses ship.stats.
- **2026-03-05 (2.2):** SparrowShip.update(moveAxis, deltaTime, bounds) — ship owns movement. InputService → SparrowShip. SPARROW_SHIP_SIZE, PlayAreaBounds exported.
- **2026-03-06 (Ship movement):** Per-direction speeds: ShipMovementConfig (forwardSpeed, backwardSpeed, leftSpeed, rightSpeed) in `src/ships/ship-movement.ts`. getSpeedX/getSpeedY resolve effective speed; omitted values default to `speed`. Sparrow: forward 52.5, backward 37.8, left/right 46. See src/ships/CONTEXT.md.
- **2026-03-05 (2.3):** Basic gun: PlayerProjectile, weaponStrength(attack), BasicGun. Fire rate 0.15s, 120 px/s, lifetime 3s, damage = Attack × 0.25. src/weapons/, src/projectiles/.
- **2026-03-05 (2.4):** ProjectilePool in src/pools/; PlayerProjectile.reset(); GameplayScene uses pool, swap-with-last (no splice). 12 pre-allocated.
- **2026-03-07 (4.2):** ParallaxLayer in src/parallax/parallax-layer.ts; ParallaxController in src/parallax/parallax-controller.ts. Far 0.3x, Mid 0.6x, Near 1.0x per level_1_forest_design. LevelScrollController in GameplayScene; parallax draws before ship/enemies. Asset paths: /images/level1/parallax_far.png, parallax_mid.png, parallax_near.png.
- **2026-03-06 (5.1.A):** Forest parallax from mock: scripts/generate-parallax-from-mock.js. Crossfade edge blending for tileability. `npm run parallax:generate`. Parallax boss slowdown: GameplayScene.parallaxScrollOffset eases over 5s when bossPhase; linear decay.
- **2026-03-06 (5.1.B):** Cancelled. CEO preferred 5.1.A (slice from mock). Procedural script remains at scripts/generate-parallax-procedural.js if needed later.
- **2026-03-06 (CEO):** Ship/enemy +20% on-screen: Sparrow SPRITE_SCALE 1.3×1.2, Scout same, Boss 300×200 → 360×240.
- **2026-03-07 (4.1 bugs):** Player ship MUST use screen Y, not world Y. World Y causes "idle forward" drift (ship appears to move up as scroll advances). Play area bounds for player: screen-space Y range, not minY=maxY. See engine_learnings.md "Vertical Scroll / Coordinate System."
- **2026-03-07 (4.3):** WaveSpawner uses gameTime (not performance.now()) for pause support. Per-transition delays: getBetweenWaveDelaySeconds(1)=4.5, (2)=3.75, (3)=3.25, (4)=3.0. Wave cap at 5; onLevelWavesComplete callback. GameplayScene maintains gameTime accumulator.
- **2026-03-06 (5.1):** CombatHUD in src/ui/combat-hud.ts. Loads SVG assets from /images/ui/hud/*.svg. HP bar, mana bar (placeholder full), score, lives. Boss phase: boss name + boss bar frame. Score: +100 scout kill, +1000 boss kill. Lives: 1 placeholder.
- **2026-03-06 (5.2):** ResultsScene in src/scenes/results-scene.ts. Victory/defeat, score, lives, Retry/Continue/Menu. Procedural Canvas 2D. InputService: isPrimaryActionPressed, isRetryPressed, isMenuPressed. goToScene(id, state) for scene state.
- **2026-03-06 (Sparrow secondary):** Secondary fire: J / gamepad X. Mana system: currentMana, manaRegenRate (3/s). Energy rings: src/effects/energy-ring-effect.ts, src/projectiles/energy-ring-projectile.ts, src/weapons/sparrow-secondary.ts, src/pools/energy-ring-pool.ts. Elliptical rings use ctx.translate + ctx.scale so gradient matches shape. See src/effects/ENERGY_RING_CONTEXT.md.
- **2026-03-06 (Turtle primary):** Arc shot: src/arc-shot/, src/weapons/turtle-primary-weapon.ts, src/pools/arc-shot-pool.ts. ArcShot.hitTargets Set tracks enemies hit; arc persists until duration. Multi-layer stroke VFX (thruster-style pulse). See src/arc-shot/CONTEXT.md, engine_learnings.md "Arc Shot."
- **2026-03-07 (Wolf ship):** WolfShip in src/ships/wolf-ship.ts. Dual wing-tip primary (wolf-primary-weapon.ts), center-nose beam secondary (wolf-secondary.ts), front-half shield (wolf-shield-effect.ts), single thruster WOLF_THRUSTER_CONFIG. PlayerProjectile: optional beamConfig, lifetimeS. GameplayScene uses WolfShip for testing.
- **2026-03-07 (Dragon ship):** DragonShip in src/ships/dragon-ship.ts. Homing crescent primary (dragon-primary-weapon.ts, HomingCrescentProjectile), charged ball secondary (dragon-secondary.ts, DragonChargedBallEffect), meditating shield (dragon-shield-effect.ts), DRAGON_THRUSTER_CONFIG (main + 2 wing). Default ship: gameplay-config DEFAULT_SHIP = 'dragon'.
- **2026-03-07 (6.H.1):** Code cleanup complete. Shared types: ship-types.ts (PlayAreaBounds, ShipStatsBase), weapon-options.ts (PrimaryWeaponOptions, getWingTipMuzzlePositions), shield-utils.ts (getShieldPulseScale). BossController extracted; thruster-config split; combat-hud generic fallbacks. Naming conventions: docs/dev_standards/naming_conventions.md. CI audit job in build.yml. All ship code preserved.
- **2026-03-07 (6.H.2):** Test hardening complete. @vitest/coverage-v8; test:coverage script. Unit tests for weapon-options, shield-utils, resolution, thruster-config, effects, projectiles, pools, weapons, dragon-ship, boss-controller, boss-placeholder. Integration: boot-gameplay, results-boot, gameplay-results, turtle-spread. Coverage 79.44% statements. See docs/coverage_comparison_6h2.md.

## Still true?

- [ ] Review and prune stale items periodically
