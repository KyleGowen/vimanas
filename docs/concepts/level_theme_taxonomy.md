# Level Theme Taxonomy

**Phase 8 · 8.A.3**

Theme ID → parallax layer paths, palette, and asset mapping. CEO says "city metropolis"; system picks correct assets. Extensible for new themes. Gates 8.3 (Parallax theme selector) and level spec loading.

**Visual samples:** [p8_mocks/8_a3_themes/theme_samples_deliverable.md](p8_mocks/8_a3_themes/theme_samples_deliverable.md) — one image per theme (forest, industrial, sky, city_metropolis, volcano).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Level mocks** | [level_mocks_deliverable.md](p0_mocks/p0_3_levels/level_mocks_deliverable.md) | Forest, Industrial, Sky: parallax structure; palette; design intent |
| **Level 1 forest design** | [level_1_forest_design.md](level_1_forest_design.md) | Far 0.3x, Mid 0.6x, Near 1.0x; asset paths |
| **Art style guide** | [art_style_guide.md](../art_style_guide.md) | Kaladesh aesthetic; copper/brass; aether accents |

---

## 1. Theme Registry

| Theme ID | Display Name | Status | Parallax Paths |
|----------|--------------|--------|----------------|
| `forest` | Forest | Assets exist | `/images/level1/parallax_far.png`, `parallax_mid.png`, `parallax_near.png` |
| `industrial` | Industrial | Pending (Phase 10) | `/images/level2/parallax_far.png`, etc. |
| `sky` | Sky | Pending (Phase 10) | `/images/level3/parallax_far.png`, etc. |
| `city_metropolis` | City Metropolis | Pending (8.B.1) | `/images/level4/parallax_far.png`, etc. |
| `volcano` | Volcano / Lava | Pending | `/images/level5/parallax_far.png`, etc. |

---

## 2. Parallax Layer Config Per Theme

All themes use 3 parallax layers (Far, Mid, Near) + play plane. Scroll ratios per [level_1_forest_design.md](level_1_forest_design.md).

| Layer | Scroll Ratio | Depth |
|-------|--------------|-------|
| Far | 0.3 | 1 |
| Mid | 0.6 | 2 |
| Near | 1.0 | 3 |

### 2.1 Forest

| Layer | Path | Content |
|-------|------|---------|
| Far | `/images/level1/parallax_far.png` | Distant canopy, sky gaps |
| Mid | `/images/level1/parallax_mid.png` | Dense tree tops, varied greens |
| Near | `/images/level1/parallax_near.png` | Leaves, branches, ornate paths |

**Palette:** #2d6a2d, #6b8e23, #8fbc8f, earth brown, #B5A642, #B87333

### 2.2 Industrial

| Layer | Path | Content |
|-------|------|---------|
| Far | `/images/level2/parallax_far.png` | Distant structures, sky |
| Mid | `/images/level2/parallax_mid.png` | Ornate rooftops, gilded conduits |
| Near | `/images/level2/parallax_near.png` | Conduit detail, machinery tops |

**Palette:** #4a4a4a, #B87333, #B5A642, aether blue

**Fallback:** If assets missing, use forest layers (8.3 implementation).

### 2.3 Sky

| Layer | Path | Content |
|-------|------|---------|
| Far | `/images/level3/parallax_far.png` | Deep sky, horizon haze |
| Mid | `/images/level3/parallax_mid.png` | Cloud banks, aether glow |
| Near | `/images/level3/parallax_near.png` | Cloud wisps, filigree |

**Palette:** #87CEEB, amber, gold #B5A642, copper #B87333, white/soft grey

**Fallback:** If assets missing, use forest layers.

### 2.4 City Metropolis

| Layer | Path | Content |
|-------|------|---------|
| Far | `/images/level4/parallax_far.png` | Distant skyline, haze |
| Mid | `/images/level4/parallax_mid.png` | Rooftops, streets, structures |
| Near | `/images/level4/parallax_near.png` | Building detail, ornate elements |

**Palette:** Urban Kaladesh—warm metallics, aether accents, dense architecture. Per art_style_guide; distinct from industrial (more vertical, metropolitan).

**Fallback:** If assets missing (8.B.1 pending), use forest or industrial layers.

### 2.5 Volcano / Lava

| Layer | Path | Content |
|-------|------|---------|
| Far | `/images/level5/parallax_far.png` | Distant volcanic haze, crater rims |
| Mid | `/images/level5/parallax_mid.png` | Lava flows, temple ruins, rock formations |
| Near | `/images/level5/parallax_near.png` | Rock detail, magma crystals, ornate elements |

**Palette:** #2d2d2d, #3d2914 (volcanic rock), #FF6B35, #FF4500, #FFBF00 (molten orange/amber), #B5A642 (gold), #B87333 (copper), aether blue in lava

**Kaladesh integration:** Ancient temple ruins in volcanic terrain; gilded accents; jewel-like magma crystals; ornate volcanic structures. Beauty alongside raw nature.

**Fallback:** If assets missing, use forest or industrial layers.

---

## 3. Implementation Lookup

```typescript
// Pseudocode
const THEME_LAYERS: Record<ThemeId, ParallaxLayerConfig[]> = {
  forest: [
    { spritePath: '/images/level1/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level1/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level1/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
  industrial: [
    { spritePath: '/images/level2/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level2/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level2/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
  sky: [
    { spritePath: '/images/level3/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level3/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level3/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
  city_metropolis: [
    { spritePath: '/images/level4/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level4/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level4/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
  volcano: [
    { spritePath: '/images/level5/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level5/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level5/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
};
```

---

## 4. Extensibility

To add a new theme:

1. Add theme ID to level spec schema enum.
2. Add entry to THEME_LAYERS with asset paths.
3. Create parallax assets per art_style_guide.
4. Update this doc.

---

## 5. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Asset paths:** From `public/` root. Vite serves at `/images/...`.
- **Loading:** ParallaxController loads layers on scene enter. If image fails, draw fallback (solid color or reuse forest).
- **Tile vertically:** Per engine_learnings, parallax layers tile for infinite scroll.

---

## 6. References

| Document | Purpose |
|----------|---------|
| [level_1_forest_design.md](level_1_forest_design.md) | Forest parallax; scroll ratios |
| [level_mocks_deliverable.md](p0_mocks/p0_3_levels/level_mocks_deliverable.md) | All three P0 themes; design intent |
| [theme_samples_deliverable.md](p8_mocks/8_a3_themes/theme_samples_deliverable.md) | Visual Design samples per theme |
| [level_spec_schema.md](level_spec_schema.md) | theme field |
| [engine_learnings.md](../dev_standards/engine_learnings.md) | Parallax tiling; asset paths |

---

## Gate

This document gates:
- **8.3** — Parallax theme selector
- **8.B.1** — City Metropolis assets (paths defined here)
