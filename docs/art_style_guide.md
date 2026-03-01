# Art Style Guide

## Core Principle: Sophisticated, High-Fidelity 2D

We aim for **sophisticated 2D art**—not plain, flat, or childish. The aesthetic draws from 16-bit shooters (1943, Aero Fighters, R-Type) but is **elevated through higher resolution and polish**. Detailed sprites, dynamic effects, layered environments, rich palette, crisp rendering. Every screen should feel crafted, atmospheric, and impactful. **Mature, adult aesthetic**—avoid simplified or cartoonish looks that read as childish.

**Higher resolution is better.** Target crisp, sharp edges; visible metallic textures and reflections; readable detail at native resolution. See [Reference Images](references/README.md)—especially `sophisticated_ref_1.png` through `sophisticated_ref_7.png`—for the target look.

---

## Resolution & Fidelity

- **Higher resolution is preferred.** Crisp, sharp rendering over chunky or blurry pixels.
- **Detail at scale:** Sprites should read clearly at native resolution—panel lines, rivets, metallic highlights visible without zoom.
- **Polished surfaces:** Metallic textures, subtle reflections, and highlights on ships and enemies. Avoid flat, single-tone fills.
- **VFX clarity:** Projectiles and explosions with bright cores, soft halos, readable trails—no muddy or indistinct effects.
- **Background depth:** Layered parallax with atmospheric gradients, not flat or repetitive tiles.

---

## Theme

**Setting:** Early civilization + ancient aliens (Stargate-type). Vimanas as ancient flying machines; technology feels alien-derived or inspired.

## Visual Pillar

- **Bright, optimistic:** Vibrant, colorful, wondrous. Not dark or gritty.
- **Aether-powered:** Blue energy cores, luminous accents, glowing conduits.
- **Beauty alongside functionality:** Ornate mechanical. Artifact beauty. Elegant design.
- **Organic + mechanical blend:** Natural forms with gears, filigree, flowing lines.
- **Palette:** Warm metallics (gold, copper, brass, amber), rich browns, aether blue, lush greens, jewel-like accents.

## Palette

- Warm metallics (gold, copper, brass, amber), rich browns. Vibrant blues (aether/energy). Lush greens, jewel-like accents. Saturated, bright—not muted.
- Expressive, limited palette—inspired by 16-bit but not constrained to low-res dithering
- Clear contrast for readability in combat
- **Sophistication:** Vibrant, saturated colors. Bright aether blues, warm oranges, gold accents. Optimistic, not dark.

## Shapes

- Ships: animal-inspired silhouettes (sparrow, turtle, wolf, dragon)
- Enemies: insectoid, hive-mind aesthetic
- Pilots: Ornate, inventor culture; personality read through expression and costume
- UI: clean, functional, period-appropriate

## Pilot Visuals

- **Portrait style:** Bust or head-and-shoulders. Mature, adult. Chosen defenders—capable, distinct. Ornate, inventor culture.
- **Palette:** Warm metallics (gold, copper, brass), leather, rich browns. Aether blue accents. Jewel-like.
- **Detail:** Illustrated, sophisticated. Visible texture. See [pilot_visual_briefs.md](concepts/pilot_visual_briefs.md) for full briefs.

## Ship Visuals

**Primary view: top-down.** Ships are seen from above during gameplay. Silhouette, facing, and readability at that angle are paramount.

**Design rule: Fighter-like, nimble. NOT mother ships.** Sparrow is the reference—sleek, compact, single-craft. All ships follow suit.

- **Fast ship (sparrow):** sleek, bird-like, nimble. Cobalt/cyan palette. Reference for all others. See [player_ship_sparrow_poc.md](concepts/player_ship_sparrow_poc.md)
- **Slow ship (turtle):** spaceship, just thicker. No turtle/animal qualities. Durable fighter.
- **Neutral ship (wolf):** unspecialized when compared to others. Fighter jet silhouette. Clean, minimal. Less busy.
- **High attack ship (dragon):** lots of guns—single-person fighter jet scale. NO dragon head. Aether-powered. Compact, NOT airliner.

### Sprite Sophistication (Ships)

- **Detail and shading:** Visible shading, metallic textures, panel lines. Avoid flat, single-tone fills. See `sophisticated_ref_4.png`, `sophisticated_ref_7.png` for detailed ship rendering.
- **Depth:** Highlights and shadows for volumetric, three-dimensional appearance. Reflections on metallic surfaces where appropriate.
- **Glowing elements:** Engine exhaust, thrusters, weapon ports—bright cores (cyan, orange, white) with softer halos. See `sophisticated_ref_1.png`, `sophisticated_ref_2.png`.
- **Vimana language:** Ornate mechanical detail. Filigree, gears, flowing lines. Aether glow (blue energy cores). Beauty alongside functionality. Gold, copper, brass accents. Organic-mechanical blend.

## Enemy Visuals

- **Insectoid design:** Organic, carapace-like, segmented. Multiple limbs, wing-like appendages, angular forms. See `sophisticated_ref_3.png`, `aero_fighters_ref_3.png` for insectoid enemies.
- **Less cartoony, more realism:** Sharp, angular, mechanical—hard-edged exoskeleton, elongated bodies, sharp mandible-like protrusions. Grounded insect anatomy, not cute.
- **Sophistication:** Intricate detail—shading, texture, visible internal structures (glowing vents, organs, energy cores). Bosses: biomechanical fusion of organic and mechanical. See `sophisticated_ref_1.png` (multi-limbed organic boss), `sophisticated_ref_5.png` (biomechanical boss with tubes, ribs, glowing eyes), `sophisticated_ref_7.png` (multi-segment armored bosses with health bars).
- **Palette:** Amber, olive-green, purple-grey, dark brown. Avoid overlap with player ship palette (cobalt/cyan).
- **Size hierarchy:** Scouts small and swarm-like; medium and elite tiers scale up; bosses imposing. See [enemy_hierarchy_and_ship_notes.md](concepts/enemy_hierarchy_and_ship_notes.md) for full hierarchy.

## UI Style

- Illustrated, ornate, inventor-fair aesthetic. Aether accents, filigree framing.
- **Thematic integration:** Textured backgrounds, subtle ancient script overlays, lore-integrated framing. See `sophisticated_ref_6.png`, `sophisticated_ref_7.png` for side panels with script and textured HUD.
- Functional first, but not plain. Health bars, score, lives—all legible and visually integrated.

## VFX Language

- Energy blasts and projectiles: clear, readable, impactful. Bright cores and trails—no muddy or indistinct shots.
- Explosions and effects: lightweight, performant (60 FPS target)
- **Sophistication:** Glowing projectiles (blue spread, orange bullets, energy beams). Explosions: starbursts, orange/yellow flares, white centers. Hit feedback: small explosions, sparks, visible damage on enemy hulls. See `sophisticated_ref_2.png`, `sophisticated_ref_4.png` for projectile variety and hit feedback.

## Environment & Level Art

- **Perspective:** Strict **top-down (bird's eye)** view. Camera directly above play field. Ships as top-down silhouettes; terrain viewed from above. 1943 / Aero Fighters style.
- **Layered backgrounds:** Multiple parallax layers. Far: distant sky, horizon haze, nebula or stars. Mid: terrain, clouds, structures. Near: wave detail, foliage, environmental accents. See `sophisticated_ref_1.png` (nebula, stars), `sophisticated_ref_2.png` (clouds, distant planet), `sophisticated_ref_5.png` (dense industrial pipes/conduits).
- **Atmosphere:** Gradients, subtle textures, varied shades. Avoid flat or repetitive backdrops. See `sophisticated_ref_3.png`, `sophisticated_ref_4.png` for forest canopy and varied greens.
- **Terrain:** Terrain-based levels (ocean, land, coastline, forest, mountains, industrial). See 1943, Aero Fighters.
- **Environmental variety:** Structures, buildings, foliage, rocks—dense enough for depth, sparse enough for readability.

## References

- **Style:** Bright, optimistic, aether-powered, ornate mechanical. See [references/README.md](references/README.md).
- **Supporting refs:** [docs/references/README.md](references/README.md) — `sophisticated_ref_1.png` through `sophisticated_ref_7.png` for detailed sprites, VFX, layered backgrounds.
- **1943, Aero Fighters:** Top-down perspective, terrain-based levels (ocean, land, forest, mountains). See `1943_ref_1.png`, `1943_ref_2.png`, `aero_fighters_ref_1.png`–`aero_fighters_ref_3.png`.
- Super Nintendo era 2D shooters: Gradius, R-Type, Earth Defense Force
- Chiptunes: Anamanagucci

## Still true?

- [ ] Review and prune stale items periodically