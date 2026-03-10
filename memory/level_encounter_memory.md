# Level / Encounter Memory

Wave composition, pacing, spawn layouts, difficulty, level mocks. Level/Encounter reads this before level work.

## Entries

- **2025-03-01:** 1943 and Aero Fighters established as primary level references. Terrain-based backdrops (ocean, land, coastline, forest, mountains)—not abstract sky. Reference images in docs/references/.
- **2025-03-01:** Single-player gameplay mockup defines enemy wave (insectoid scouts, V-formation, amber/olive palette) and level detail beyond arena POC (4 parallax layers, terrain features, HUD).
- **2025-03-01:** Strict top-down (bird's eye) perspective for gameplay. Ships as top-down silhouettes; terrain viewed from above. 1943/Aero Fighters style.
- **2025-03-02:** P0.3 level mocks produced (Coastline, Forest, Industrial, Sky). Four concept images + level_mocks_deliverable.md. Level 4 = Sky per roadmap (open sky, clouds, high altitude). Ready for CEO review.
- **2025-03-02 (CEO):** P0.3 iteration 2: (1) Level mocks must be true top-down overhead views—not front-facing. (2) Kaladesh over steampunk—prioritize Kaladesh (gilded, Indian fantasy) in style docs. (3) More detail in levels.
- **2025-03-02 (CEO):** P0.3 iteration 3: Forest mock = style reference for all levels. Coastline: redo from scratch, no 1943 style. Industrial: Kaladesh flying machines/airships—NO airplanes. Sky: true overhead, more detail. 1943/Aero Fighters = gameplay reference only, NOT style.
- **2025-03-02 (CEO):** P0.3 iteration 4: Sky—remove airplane and corner circles. Coastline—too illustrated, buildings too close; need proportional scale, structures distant. Industrial—great but remove all airships.
- **2025-03-02 (CEO):** P0.3 iteration 5: Sky mock LOCKED IN (approved). Industrial—higher altitude, twice as high. Coastline—subject/scale perfect but didn't meet other criteria; regenerated with forest mock style.
- **2025-03-02 (CEO):** P0.3 iteration 5 reverted—industrial/coastline "much further from intent." Industrial rolled back to iteration 4 (normal altitude).
- **2025-03-02 (CEO):** Iteration 6 reverted—industrial looks like forest; coastline doesn't look like the game. Back to initial trials: industrial—dense grey/copper/brass, no forest reference. Coastline—sky mock as reference for game consistency.
- **2025-03-02 (CEO):** Industrial LOCKED IN. Coastline—redo styled like the 3 locked-in (forest, industrial, sky). Coastline regenerated with all three as reference.
- **2025-03-02 (CEO):** Remove ocean mock. Three level mocks suffice: forest, industrial, sky. All references to ocean/coastline level mock removed.
- **2025-03-02:** P0.4 boss fight mocks DONE. Two mocks: Root-Seeker (forest) + Sparrow, Conduit-Crawler (industrial) + Dragon. docs/concepts/boss_mocks_deliverable.md. boss_encounter_briefs.md, boss_mock_image_prompts.md.
- **2025-03-02 (CEO):** Conduit-Crawler boss mock LOCKED IN. Root-Seeker—ship must match sparrow_ship_kaladesh and same size as Conduit-Crawler mock.
- **2025-03-02 (CEO):** P0.4 boss fight mocks fully approved. Both Root-Seeker and Conduit-Crawler mocks locked in.
- **2025-03-02 (CEO):** Level mocks redone in illustrated, sleek style. Forest and Industrial LOCKED IN. Sky was not top-down—regenerated with explicit top-down prompt. All three level mocks now LOCKED IN.
- **2025-03-02 (CEO):** Boss mocks redone with new ship and level mocks. Ships must look exactly like ship mocks (pilot-style). Conduit-Crawler LOCKED IN. Forest regenerated to match Industrial illustrated style.
- **2026-03-05 (3.A.1):** Scout formation spec contributed to scout_design_lock.md. Three formations: V (5 Scouts, 0.4s), Staggered Wedge (7 Scouts, 0.3s), Pincer (2×3 Scouts, converging). When-to-use: V first wave; Staggered Wedge waves 2–3; Pincer wave 4+. Spacing per Craig Reynolds separation.
- **2026-03-07 (4.1 design clarity):** When specifying "player stays in frame" for vertical scrollers, be explicit: (a) fixed at one screen position (no N/S movement) vs (b) can move N/S within play area. CEO expected (b). Avoid minY=maxY in play bounds—that locks vertical movement. Player ship uses screen coordinates; enemies/projectiles use world. See engine_learnings.md.
- **2026-03-08 (formation flying):** Formation flying reference (Wikipedia): V/echelon/diamond/trail formations; leader + wingman; wingtip-vortex drag reduction; formation transitions add dynamism. Insects: leaderless swarms, self-organizing boundaries. Use for wave composition, spacing, and formation variety beyond existing V/Staggered Wedge/Pincer.
- **2026-03-08 (4-ship transitions):** formation_transitions_reference.md — Fingertip, Echelon, Diamond, Trail + 8 transition sequences (who moves, order). Use for: enemy mid-wave formation shifts (Trail→Fingertip on approach), future 4-ship squadrons, cooperative ship-combining. Complexity: Diamond↔Fingertip (1 ship) < Echelon↔Fingertip < Trail↔Fingertip.
- **2026-03-09 (8.A.3):** Theme taxonomy complete. Five themes: forest, industrial, sky, city_metropolis, volcano. Visual samples in docs/concepts/p8_mocks/8_a3_themes/. Volcano: volcanic terrain top-down, tileable, Kaladesh accents distant. CEO signed off.

## Still true?

- [ ] Review and prune stale items periodically
