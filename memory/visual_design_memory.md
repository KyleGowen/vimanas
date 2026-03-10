# Visual Design Memory

Ships, enemies, UI mood, VFX, art style. Visual Design reads this before visual work.

## Entries

- **2025-03-01:** Illustrated, sleek target: detailed sprites (shading, textures, glowing elements), dynamic VFX (glowing projectiles, starburst explosions), layered backgrounds, biomechanical enemy design. NOT pixel art, NOT 16-bit. CEO reference set: docs/references/sophisticated_ref_1–7.png. Sparrow sprite sheet = canonical ship style.
- **2025-03-01:** Enemy visual direction: less cartoony, more realism. Angular/sharp insectoid forms (not bulbous); grounded, mechanical aesthetic.
- **2025-03-01:** Visual style: mature, adult aesthetic. Avoid childish or simplified looks. Sophistication (detail, atmosphere, glowing effects) must not regress for perspective or other constraints.
- **2025-03-01:** Ship design rule: fighter-like, nimble. NOT mother ships. Sparrow is the reference. Backgrounds beneath ship concepts approved for level art.
- **2025-03-01:** Visual pillar: bright, optimistic, aether-powered, ornate mechanical.
- **2025-03-01:** MILESTONE_001 complete. Four ships (Sparrow, Turtle, Wolf, Dragon) solidified as canonical starting point. sparrow_ship_kaladesh.png, turtle_ship_kaladesh.png, wolf_ship_kaladesh_v4.png, dragon_ship_kaladesh_v3.png.
- **2025-03-02:** P0.5 title screen mock DONE. Single mock: layered sky, VIMANAS hero title (brass/copper), Sparrow fleet silhouette, PRESS START • 1–4 PLAYERS. docs/concepts/title_screen_mocks_deliverable.md, title_screen_image_prompts.md, title_screen_mock.png.
- **2025-03-02 (CEO):** P0.5 title screen mock approved. Locked in. Reference and dynamic variants deleted. Ship propulsion glow colors canonical in art_style_guide.
- **2025-03-02 (CEO):** Style direction: illustrated, sleek—NOT SNES/16-bit. Sparrow sprite sheet = canonical ship art. All style docs updated to reflect this.
- **2025-03-02 (CEO):** Pilot-style ship mocks approved. Four ships (Sparrow, Turtle, Wolf, Dragon) in realistic illustrated style matching pilots. Canonical for ship select, mission brief, production. Ships organized into subdirs: p0_1_ships/sparrow/, turtle/, wolf/, dragon/. Each subdir: POC, Kaladesh ref, pilot_style (canonical).
- **2025-03-02 (CEO):** Title screen mock redone with new style. Visual Design regenerated using pilot-style ship refs, boss_mock_2_industrial.png and level_mock_4_sky.png as style references.
- **2025-03-03 (CEO):** 2.A.2 Sparrow sprite sheet approved. 16 individual sprites in Assets/Content/Sprites/Sparrow/. Gates 2.1 prefab.
- **2026-03-05 (CEO):** 3.A.1 Scout design lock approved. Top-down silhouette: elongated arrowhead, mantis prow, twin-mandible cluster, swept splayed wings; palette amber/olive-green/dark brown. Gates 3.A.2 Scout sprite sheet.
- **2026-03-06 (CEO):** 5.A.1 HUD design and 5.A.3 Results screen design approved. docs/concepts/hud_design.md, docs/concepts/results_screen_design.md. Copper/brass framing, HP/mana bars, score, lives; victory/defeat flow, Retry/Continue. Gates 5.A.2, 5.A.4 (assets) and 5.1, 5.2 (tech).
- **2026-03-06 (CEO):** 5.A.2 HUD assets approved. SVG assets in public/images/ui/hud/: hp_bar_frame.svg, mana_bar_frame.svg, life_icon.svg, boss_bar_frame.svg. Copper/brass palette per hud_design. Gates 5.1 Combat HUD.
- **2026-03-06 (Energy ring VFX):** Sparrow secondary = elliptical energy rings. Cyan palette (#00FFFF) matching thruster/projectile beam. Transform-based gradient (ctx.translate + ctx.scale) so gradient follows ellipse. radiusX 1.4, radiusY 0.45. See src/effects/ENERGY_RING_CONTEXT.md, engine_learnings.md.
- **2026-03-06 (CEO):** Turtle facing north sprite provided: `public/images/ships/turtle/turtle_facing_n.png`. Canonical for Turtle default pose. When generating other Turtle sprites (flying_forward, bank_left, bank_right, boost, idle, firing, damage, hit_flash), use turtle_facing_n.png as the ship design reference—same rectangular hull, broad wings, vertical stabilizers, two cylindrical engine nozzles, earth brown/copper/brass palette, amber exhaust, Kaladesh filigree. Only the pose changes.
- **2026-03-06 (Turtle arc VFX):** Turtle primary = curved beam (quadratic Bezier). Firey yellow/orange palette (#FFFFCC core, #FF8800 edge). Multi-layer stroke (4 layers) with time-based pulse for moving-energy feel. shadowBlur 24–36 px for glow. Thin band (4–13 px per layer). See src/arc-shot/CONTEXT.md.
- **2026-03-06 (Turtle spread VFX):** Turtle secondary = dual-ring spheres. Inner: shield-style segmented (thruster palette, opposite rotation). Outer: arc-shot style (fiery palette, 4 stroked layers, shadowBlur). Origin 30% down ship. Fade 0.85–1.0. See drawTurtleShieldSphere in src/effects/turtle-shield-effect.ts.
- **2026-03-06 (Turtle shield VFX):** Turtle shield = force-field bubble with segmented outer ring. 72 arc segments, thruster palette (amber), hard edge. Radius pulse 0.98±0.02, freq 1.5. Ship visible inside. See src/effects/turtle-shield-effect.ts.
- **2026-03-07 (CEO):** 6.S.1 Ship selection UI design approved. docs/concepts/ship_selection_ui_design.md. Four ships horizontal row; copper/brass framing; propulsion glow accents (Sparrow #00FFFF, Turtle #FFBF00, Wolf #C0C0C0, Dragon #FF4500); controller-first (d-pad/stick, A confirm, B back). Gates 6.S.2 tech.
- **2026-03-09 (8.A.3 Volcano theme):** Theme samples require (1) strict top-down overhead—bird's eye, no angled perspective; (2) repeatable/tileable vertically—parallax layers tile for infinite scroll; top edge must blend into bottom edge. Volcano trials: v1 too many buildings → v2 more natural, buildings far; v2 lost top-down + repeat → v3 strict overhead + abstract tileable patterns. CEO signed off v3. Per engine_learnings: parallax tiles vertically.

## Still true?

- [ ] Review and prune stale items periodically
