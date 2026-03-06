# Scout Sprite Sheet Spec

**Visual Design Agent · P0 Mocks · Milestone 3.A.2 · 2026-03-05**

Sprite sheet specification for the Scout enemy—Tier 1 insectoid, swarm-like, slightly smaller than Sparrow. Per [scout_design_lock.md](../../scout_design_lock.md). Every frame must read instantly—Gradius/R-Type clarity: shape and pose communicate behavior at a glance. **Framework-free:** sprites go in `public/images/enemies/`.

---

## 1. Pose List

Game actions the Scout needs (per roadmap):

| Pose | Description | Read |
|------|-------------|------|
| **Flying** | Base pose. Elongated arrowhead silhouette, mantis prow forward, twin-mandible cluster at nose, swept wings splayed. Carapace segments visible. Level, steady approach. | Default movement state; approaching from above |
| **Firing** | Weapon discharge at mandible cluster or ventral port. Amber/olive-green muzzle glow. Hull tension—slight forward lean or mandible flare. Engine/exhaust brightens. | Weapon fire |
| **Damage** | Impact state. Hull flash (white/amber tint), small sparks, carapace crack or vent burst. Brief recoil—body jerks. | Taking damage |
| **Death** | Breakup/explosion. Carapace fragments, bright core, soft halo. Amber/green tint per VFX spec. Small explosion—readable, performant. | Destroyed |

**View:** Top-down (bird's eye) for ALL poses. Scout seen from above. Facing direction clear—mandible V points forward. No ambiguity about approach vector.

---

## 2. Sprite Sheet Layout

| Property | Value |
|----------|-------|
| **Grid** | 2×2 (4 cells) |
| **Frame size** | 192×192 px per cell |
| **Total dimensions** | 384×384 px |
| **Background** | Transparent or solid neutral (e.g. #1a1a2e) between cells |
| **Bleed** | None—each frame self-contained within its cell |
| **Labels** | Each cell has text label (pose name) for reference |

**Rationale:** Scout is smaller than Sparrow (256×256). 192×192 keeps detail readable at combat distance while fitting swarm density. Four poses only—no banking, boost, or 8-dir facings; engine rotates sprites if needed.

### Frame Arrangement

```
Row 0:  [Flying]       [Firing]
Row 1:  [Damage]       [Death]
```

---

## 3. Image Prompts

Use these prompts to generate Scout sprites. Match [scout_design_lock.md](../../scout_design_lock.md) exactly: insectoid, elongated arrowhead, mantis prow, twin-mandible, amber/olive-green/dark brown palette. Sophisticated 2D illustrated—**NOT pixel art**.

### Per-Pose Prompts

#### Flying (base)

```
Top-down view of a Scout enemy spacecraft facing SOUTH (nose pointing down toward player at bottom of screen). Insectoid design: elongated arrowhead silhouette with a mantis-like prow. Twin-mandible cluster at the nose—two angular prongs forming a V pointing forward (down). Swept wings splayed back, delta-ish with insectoid asymmetry. Carapace segments: angular, hard-edged, exoskeletal. Palette: amber (#FFBF00) primary, olive-green (#6b8e23) segments, dark brown (#3d2914) shadow/depth. Sophisticated 2D illustrated style—NOT pixel art. Clean silhouette; readable at 192×192. CRITICAL: Fully transparent background, PNG with alpha. Level, steady approach pose.
```

#### Firing

```
Top-down view of a Scout enemy spacecraft firing. Same insectoid design: elongated arrowhead, mantis prow, twin-mandible cluster at nose, swept splayed wings. Amber or olive-green muzzle glow at mandible cluster or ventral weapon port. Hull tension—slight forward lean or mandible flare. Engine/exhaust brightens. Palette: amber (#FFBF00), olive-green (#6b8e23), dark brown (#3d2914). Sophisticated 2D illustrated style—NOT pixel art. 192×192. Transparent background.
```

#### Damage

```
Top-down view of a Scout enemy spacecraft taking damage. Same insectoid design: elongated arrowhead, mantis prow, twin-mandible, swept wings. Impact state: hull flash (white/amber tint), small sparks, carapace crack or vent burst. Brief recoil—body jerks. Palette: amber (#FFBF00), olive-green (#6b8e23), dark brown (#3d2914), plus white/amber flash. Sophisticated 2D illustrated style—NOT pixel art. 192×192. Transparent background.
```

#### Death

```
Top-down view of a Scout enemy spacecraft exploding. Same insectoid design breaking apart: carapace fragments, elongated arrowhead silhouette disintegrating. Bright core, soft halo. Amber/green tint. Small explosion—readable, not overwhelming. Palette: amber (#FFBF00), olive-green (#6b8e23), dark brown (#3d2914), bright core. Sophisticated 2D illustrated style—NOT pixel art. 192×192. Transparent background.
```

---

### Full Prompt (Single 2×2 Sprite Sheet)

```
Generate a sprite sheet image: a 2×2 grid of 4 cells, each 192×192 pixels, total 384×384. Clean grid layout. Transparent or solid dark (#1a1a2e) background between cells. No background scenery—only the enemy in each cell.

Subject: The Scout—a small, insectoid enemy spacecraft. Tier 1, swarm-like, slightly smaller than a player ship. Elongated arrowhead silhouette with mantis-like prow. Twin-mandible cluster at nose (two angular prongs forming V pointing forward). Swept wings splayed back, delta-ish with insectoid asymmetry. Carapace segments: angular, hard-edged, exoskeletal. Palette: amber (#FFBF00) primary, olive-green (#6b8e23) segments, dark brown (#3d2914) shadow/depth. Sophisticated 2D illustrated style—NOT pixel art.

View: Top-down (bird's eye) for ALL frames. Scout seen from above. Consistent lighting and style across all cells.

Frame layout (left to right, top to bottom):
- (1) Flying—base pose, level, steady approach.
- (2) Firing—amber/olive muzzle glow at mandible, hull tension.
- (3) Damage—hull flash, sparks, carapace crack, recoil.
- (4) Death—carapace fragments, bright core, soft halo, amber/green tint.

Each frame: same Scout design, same palette. Only pose changes. Crisp rendering. No blur.
```

---

### Director-Optimized Prompt (GenerateImage)

Shorter prompt for tools with token limits:

```
2×2 sprite sheet, 384×384 total. Scout insectoid enemy in each cell—elongated arrowhead, mantis prow, twin-mandible, swept wings. Amber/olive-green/dark brown palette. Top-down view. Cells: flying, firing, damage, death. Sophisticated 2D illustrated—NOT pixel art. Transparent background.
```

---

## 4. Asset Paths

**Framework-free:** Images load via `new Image()`; paths from `public/` at root.

### Option A: Individual Files (recommended for engine flexibility)

| Pose | Path |
|------|------|
| Flying | `public/images/enemies/scout_flying.png` |
| Firing | `public/images/enemies/scout_firing.png` |
| Damage | `public/images/enemies/scout_damage.png` |
| Death | `public/images/enemies/scout_death.png` |

**Runtime path:** `/images/enemies/scout_flying.png`, etc.

### Option B: Single Sprite Sheet

| Asset | Path |
|-------|------|
| Sprite sheet | `public/images/enemies/scout_sprite_sheet.png` |

**Layout:** 2×2 grid; cells (0,0)=Flying, (1,0)=Firing, (0,1)=Damage, (1,1)=Death.

---

## 5. Placeholder Note

A minimal placeholder (e.g. `scout_facing_n.png`—single flying pose) can be created via available image-generation tools using the Flying prompt above. For full production, Director or artist should generate all four poses per this spec.

---

## 6. References

| Document | Purpose |
|----------|---------|
| [scout_design_lock.md](../../scout_design_lock.md) | Silhouette, palette, poses, VFX, size vs Sparrow |
| [art_style_guide.md](../../../art_style_guide.md) | Enemy Visuals: insectoid, palette, sophistication, VFX language |
| [sparrow_sprite_sheet_spec.md](../p0_1_ships/sparrow/sparrow_sprite_sheet_spec.md) | Template: pose list, grid layout, image prompts |
| [enemy_hierarchy_and_ship_notes.md](enemy_hierarchy_and_ship_notes.md) | Scout tier spec, scale vs Sparrow |
| [references/README.md](../../../references/README.md) | sophisticated_ref_3, sophisticated_ref_4 — insectoid enemies |

---

## 7. Design Notes (Gradius/R-Type)

- **Facing read:** The twin-mandible V must point forward. Player instantly knows approach direction.
- **Size:** Scout smaller than Sparrow. Swarm-like—multiple on screen without crowding.
- **Damage:** Clear hit feedback. Flash + sparks so player knows they scored a hit.
- **Death:** Small explosion, amber/green. Lightweight for 60 FPS.
- **Distinct from Sparrow:** Sparrow = bird-inspired, organic curves. Scout = insectoid, segmented, mandible cluster, carapace. At a glance: "craft" vs "creature."
