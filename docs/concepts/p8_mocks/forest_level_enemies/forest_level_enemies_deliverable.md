# Forest Level Enemies — Deliverable

**Phase 8 · Visual Design Agent**

One PNG sprite per forest-level enemy type for the first forest level. All assets are **strict top-down (bird's eye)** view, readable at combat scale. Palette and silhouette follow [forest_level_enemy_design.md](forest_level_enemy_design.md) and [docs/art_style_guide.md](../../../art_style_guide.md).

---

## Asset List

| Asset | Description |
|-------|--------------|
| **scout_forest.png** | Small insectoid swarm unit; elongated arrowhead, twin-mandible prow, swept carapace wings; amber, olive, dark brown. |
| **medium_forest.png** | Heavier insectoid; 1.5–2× Scout scale; olive, dark forest green, dark brown; glowing vents/cores; optional gold/copper accents. |
| **elite_forest.png** | Lieutenant-tier; 2–3× Scout; multi-segment, multi-limb; dark brown, olive, purple-grey, amber cores; optional vine/root detail. |
| **miniboss_forest.png** | Solo encounter; forest lieutenant; multi-limbed/multi-segment; dark brown, olive, amber/orange cores; vine/root or tendril motifs. |
| **boss_forest.png** | Root-Seeker; horizontal sprawl, 6–8 appendages (leg-like, mandible-like, vine/root tendrils); dark brown carapace, amber/orange cores. |

---

## Sprites (PNG)

| File | Description |
|------|-------------|
| scout_forest.png | Scout — small insectoid swarm unit |
| medium_forest.png | Medium — heavier insectoid, 1.5–2× Scout |
| elite_forest.png | Elite — lieutenant-tier, multi-segment |
| miniboss_forest.png | Mini-boss — solo encounter, forest lieutenant |
| boss_forest.png | Root-Seeker — level apex boss |

All sprites: strict top-down view; palette and silhouette per [forest_level_enemy_design.md](forest_level_enemy_design.md).

---

## Image Prompts

Image-generation prompts for these five assets are in the same folder: **[forest_level_enemy_image_prompts.md](forest_level_enemy_image_prompts.md)**. The Director (or asset pipeline) can run generation using those prompts. Each prompt is self-contained: strict top-down view, palette, silhouette, and style are specified so no external doc is required at generation time.

---

## References

- [forest_level_enemy_design.md](forest_level_enemy_design.md) — Forest-level design spec (Scout, Medium, Elite, Mini-boss, Boss); palette and silhouette per type.
- [docs/art_style_guide.md](../../../art_style_guide.md) — Enemy visuals (insectoid, carapace, palette, size hierarchy, top-down); sophisticated 2D illustrated style.
