# Level 1: Forest — Design Spec

**Milestone:** 4.A.1  
**Status:** Design spec (pending approval)  
**Canon:** [level_mocks_deliverable](p0_mocks/p0_3_levels/level_mocks_deliverable.md), [art_style_guide](../art_style_guide.md)

---

## Design Intent

Forest canopy from above—**strict overhead view**. Dense foliage, varied greens. **Kaladesh-inspired**—gilded temple or structure tops visible, ornate garden paths, jewel accents. NOT steampunk. Rich detail. Dense but readable; depth through shade variation; more detail over sparse.

---

## 1. P0 Mocks Considered

| Mock | What It Informs |
|------|-----------------|
| **level_mocks_deliverable.md** | Primary source. Level 1: Forest section defines design intent, 4 parallax layers (Far/Mid/Near/Play plane), terrain features, palette (#2d6a2d, #6b8e23, #8fbc8f, earth brown), Kaladesh elements (temple tops, ornate paths, jewel accents, filigree). Strict top-down overhead view. |
| **level_mock_2_forest.png** | Visual reference. Parallax layers: distant canopy/sky gaps (far), dense tree tops (mid), leaves/branches/ornate paths (near). Circular canopy shapes, foliage patches. Gilded structure tops, jewel accents, decorative elements. Palette and depth cues. |

---

## 2. Parallax Layers (4)

Depth order **back-to-front**. Scroll speed ratios relative to play-plane scroll (1.0x = moves with camera; slower = parallax lag).

| Layer | Content | Scroll Speed Ratio | Depth Order |
|-------|---------|-------------------|-------------|
| **Far** | Distant canopy, sky gaps | 0.3x | 1 (back) |
| **Mid** | Dense tree tops, varied greens (#2d6a2d, #6b8e23, #8fbc8f), earth brown, gilded roof tops | 0.6x | 2 |
| **Near** | Individual leaves, branches, foliage detail, ornate paths | 1.0x | 3 |
| **Play plane** | Clear area for ships | N/A | 4 (front) |

**Implementation note:** Far scrolls slowest (most parallax lag); Near scrolls at full rate (or slightly ahead for foreground detail). Play plane is the gameplay area—ships, projectiles, enemies—no parallax.

---

## 3. Terrain Layout

### Kaladesh Elements

- **Gilded temple tops / structure tops:** Visible through canopy. Gold (#B5A642), copper (#B87333) accents. Ornate silhouettes.
- **Ornate garden paths:** Winding paths with etched or inlaid filigree patterns. Light brown/grey-brown ground.
- **Jewel accents:** Embedded in filigree—purple, sapphire blue, amber/orange, emerald. Luminous, glowing.
- **Filigree:** Curvilinear gold patterns on structures and paths. Organic, vine-like.

### Palette

| Color | Hex | Use |
|-------|-----|-----|
| Dark forest green | #2d6a2d | Deep shadows, dense canopy |
| Olive green | #6b8e23 | Sunlit foliage, mid-tone leaves |
| Light sage | #8fbc8f | Illuminated leaves, sky gaps |
| Earth brown | — | Paths, ground, trunks |
| Gold | #B5A642 | Gilded accents, filigree |
| Copper | #B87333 | Structure accents |

### Atmosphere

- Dense but readable
- Depth through shade variation
- More detail preferred over sparse
- Reference: aero_fighters_ref_1.png, sophisticated_ref_3.png, sophisticated_ref_4.png

---

## 4. Platform / Engine Gotchas

Reference: [engine_learnings](../dev_standards/engine_learnings.md)

| Concern | Constraint |
|---------|------------|
| **Asset paths** | Images from `public/` are at root: `/images/...`. Parallax layers: `public/images/levels/forest/` or equivalent. |
| **Canvas resolution** | Fixed internal resolution 1280×720. Scale to window with CSS or canvas width/height. Letterbox/pillarbox when aspect differs. |
| **Delta time** | Use `performance.now()` for frame timing. Multiply scroll by delta for frame-rate independence. |
| **Game loop** | `requestAnimationFrame`; 60 FPS target. Pass delta to update logic. |
| **Parallax scroll** | Each layer scrolls at `scrollRate × layerRatio × delta`. Far 0.3x, Mid 0.6x, Near 1.0x. |
| **Clear** | `ctx.clearRect(0, 0, width, height)` at start of each frame. |
| **Asset loading** | `new Image()`; set `src`; await `onload`. Same-origin from Vite; no CORS. |

---

## Gate

Read `level_1_forest_design.md`; spec approved before parallax assets (4.A.2) and vertical scroll (4.1) implementation.
