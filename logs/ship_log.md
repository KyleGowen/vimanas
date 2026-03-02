# Ship Log

Dated entries: what changed, why.

## Format

```
### YYYY-MM-DD
- Change description
- Rationale or context
```

## Entries

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

### 2025-03-02 (Director delegation documentation)
- Updated agents/director.md: Added "Delegation via Subagents (REQUIRED)"—explicit mcp_task usage, subagent types (explore, generalPurpose, shell), workflow, exception for trivial edits.
- Updated .cursor/rules/00_project.md: "Spin up sub-agents" clarified to mean use mcp_task with specialist-informed prompts.
- Updated CLAUDE.md: Director must use mcp_task to delegate.
- Updated memory/shared_memory.md: Director delegation rule.
- Updated plans/roadmap.md: Subagent summary rule links to director.md.
