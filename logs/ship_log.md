# Ship Log

Dated entries: what changed, why.

## Format

```
### YYYY-MM-DD
- Change description
- Rationale or context
```

## Entries

### 2025-03-04
- **CI.1 GitHub Actions workflow:** Platform/Release specialist (generalPurpose) created `.github/workflows/build.yml`. GameCI `unity-builder@v4`, StandaloneOSX (macOS), Git LFS, Library cache. Triggers on push/pull_request. Required secrets: UNITY_LICENSE (or UNITY_SERIAL), UNITY_EMAIL, UNITY_PASSWORD. docs/dev_standards/platform_learnings.md created with setup instructions. Roadmap CI.1 → Done. Subagent ID: c98b3b1a-058d-4a34-8aa9-0278990a67d0.

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
