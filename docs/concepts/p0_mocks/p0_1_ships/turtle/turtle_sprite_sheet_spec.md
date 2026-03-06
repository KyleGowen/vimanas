# Turtle Sprite Sheet Spec

**Visual Design Agent · P0 Mocks · 2026-03-06**

Sprite sheet specification for the Turtle vimana in a top-down 2D shooter. Base reference: [turtle_ship_pilot_style.png](turtle_ship_pilot_style.png). Every frame must read instantly—Gradius/R-Type clarity: shape and pose communicate behavior at a glance. Turtle is the **tank archetype**: heavier hull, slower exhaust, armored presence.

**CRITICAL — Canonical Reference:** Every Turtle sprite MUST be derived from [turtle_ship_pilot_style.png](turtle_ship_pilot_style.png). That image defines the ship: rectangular hull, broad wing structures, vertical stabilizers, two cylindrical engine nozzles, earth brown (#4A3728) / copper (#B87333) / brass (#CD7F32) palette, amber (#FFBF00) propulsion glow, Kaladesh filigree. Only the pose changes; the ship design does not. Do not invent a different ship.

---

## 1. Pose List

Game actions the Turtle needs:

| Pose | Description | Read |
|------|-------------|------|
| **Flying forward** | Base pose. Ship level, nose forward, amber exhaust steady. Heavier, slower exhaust than Sparrow. | Default movement state |
| **Banking left** | Ship tilts/rolls left. Hull dips, visible bank angle. | Turning left |
| **Banking right** | Ship tilts/rolls right. Hull dips, visible bank angle. | Turning right |
| **Boosting** | Engine glow intensified (brighter amber/gold). Slight forward lean or nose dip. Exhaust plume longer, more energetic—still slower than Sparrow. | Speed boost / dash |
| **Idle** | Subtle engine pulse—slightly dimmer exhaust, minimal motion. Tank presence, fortress-like. | Parked / waiting |
| **Firing** | Muzzle flash at weapon port. Engine glow brightens. | Weapon fire |
| **Damage / hit** | Brief impact state. Hull flash (white/red tint), small sparks, smoke wisps. Armored plates absorb. | Taking damage |
| **Hit flash** | Single-frame white/red flash overlay. | Impact feedback |

### Optional: 8-Direction Facing

If the game does **not** rotate sprites in-engine, include 8 facings for the base pose:

- **N, NE, E, SE, S, SW, W, NW** — Ship rotated 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°.
- **Viewport:** N = top of screen; S = bottom; banking left/right = toward screen edges. See [game_bible.md](../../../../game_bible.md#viewport).

Use the same Turtle design; only rotation changes. Recommended for games that prefer pre-rendered rotation over runtime rotation.

---

## 2. Sprite Sheet Layout

| Property | Value |
|----------|-------|
| **Grid** | 4×2 (8 cells) for action poses; 4×4 (16 cells) if including 8-dir |
| **Frame size** | 256×256 px per cell |
| **Total dimensions** | 1024×512 px (action only); 1024×1024 px (with 8-dir) |
| **Background** | Transparent or solid neutral (e.g. #1a1a2e) between cells |
| **Bleed** | None—each frame self-contained within its cell |
| **Labels** | Each cell has text label (pose name) for reference |

### Frame Arrangement (Action Poses)

```
Row 0:  [Forward]     [Bank Left]    [Bank Right]   [Boost]
Row 1:  [Idle]        [Firing]      [Damage]       [Hit Flash]
```

### Frame Arrangement (With 8-Dir)

```
Row 0:  [Forward]     [Bank Left]    [Bank Right]   [Boost]
Row 1:  [Idle]        [Firing]      [Damage]       [Hit Flash]
Row 2:  [8-dir N]     [8-dir NE]    [8-dir E]      [8-dir SE]
Row 3:  [8-dir S]     [8-dir SW]    [8-dir W]      [8-dir NW]
```

- **Rows 0–1:** Action poses (8 frames)
- **Rows 2–3:** 8-direction facing (8 frames)—omit if engine rotates sprites

---

## 3. Turtle-Specific Palette

| Use | Color | Hex | Notes |
|-----|-------|-----|-------|
| Hull primary | Earth brown | #4A3728 | Heavy, grounded |
| Hull secondary | Copper | #B87333 | Accents, plates |
| Trim | Brass | #CD7F32 | Metallic highlights |
| Interior | Dark brown | #3D2914 | Cockpit, depth |
| Highlight | Amber | #FFBF00 | Edge highlights, aether accents |
| Shadow | Dark brown | #2A1810 | Depth, underside |
| **Propulsion glow** | **Amber/gold** | **#FFBF00** | Engine exhaust, thruster trails, luminous accents |

Per [turtle_design_lock.md](turtle_design_lock.md): Heavier hull, slower exhaust, tank identity. Propulsion glow = #FFBF00 (amber/gold, warm, earthy).

---

## 4. Image Prompts for Sprite Sheet

Use these prompts to generate a Turtle sprite sheet. Match [turtle_ship_pilot_style.png](turtle_ship_pilot_style.png) exactly: earth brown/copper/brass, thick armored hull, amber exhaust, Kaladesh aesthetic. Same art style—realistic illustrated, sophisticated, high-fidelity 2D.

---

### Full Prompt (200–300 words)

```
Generate a sprite sheet image: a 4×2 grid of 8 cells (or 4×4 for 16 cells with 8-dir), each 256×256 pixels. Clean grid layout. Transparent or solid dark neutral (#1a1a2e) background between cells. No background scenery—only the ship in each cell.

Subject: The Turtle vimana—a heavy, armored, tank-class fighter spacecraft. Kaladesh-inspired aesthetic: ornate mechanical, Indian fantasy, gilded. Earth brown (#4A3728) hull, copper (#B87333) and brass (#CD7F32) accents, amber (#FFBF00) engine exhaust. Thick rectangular hull, armored plates, riveted seams. No shell, no animal features—spaceship, just thicker. Slightly larger than Sparrow. Two large circular engine nozzles at rear. Sophisticated, high-fidelity 2D illustrated style—NOT pixel art, NOT 16-bit. Match the reference image turtle_ship_pilot_style.png exactly.

View: Oblique top-down (bird's eye, slight angle) for ALL frames. Ship seen from above. Consistent lighting and style across all cells.

Frame layout (left to right, top to bottom):

Row 0: (1) Flying forward—base pose, level, steady amber exhaust, slower plume than Sparrow. (2) Banking left—ship tilts left, hull dips. (3) Banking right—ship tilts right, hull dips. (4) Boosting—engine glow intensified, longer exhaust plume, slight forward lean.

Row 1: (5) Idle—subtle engine pulse, slightly dimmer exhaust. (6) Firing—muzzle flash at weapon port, engine brightens. (7) Damage—hull flash, small sparks, smoke wisps. (8) Hit flash—single-frame white/red flash on hull.

If 4×4: Row 2: Facing N, NE, E, SE. Row 3: Facing S, SW, W, NW.

Each frame: same Turtle design, same palette, same detail level. Only pose/rotation changes. Crisp rendering. No blur. Heavier ornamentation than Sparrow. Tank identity—fortress-like presence.
```

---

### Director-Optimized Prompt (GenerateImage)

Shorter prompt for tools with token limits:

```
4×2 sprite sheet grid, 8 cells, 256×256 each. Turtle vimana spacecraft—heavy armored tank, earth brown/copper/brass, Kaladesh ornate filigree, amber (#FFBF00) exhaust. Oblique top-down view. Row 0: flying forward, bank left, bank right, boost. Row 1: idle, firing, damage, hit flash. Thicker hull, slower exhaust, no animal features. Realistic illustrated style, transparent or dark neutral background. Match turtle_ship_pilot_style.png.
```

---

## 5. Asset List

| Frame | Grid position | Pose | Filename | Intended use |
|-------|---------------|------|----------|--------------|
| 0 | (0, 0) | Flying forward | turtle_flying_forward.png | Base movement, default state |
| 1 | (1, 0) | Banking left | turtle_bank_left.png | Turn-left animation |
| 2 | (2, 0) | Banking right | turtle_bank_right.png | Turn-right animation |
| 3 | (3, 0) | Boosting | turtle_boost.png | Speed boost / dash |
| 4 | (0, 1) | Idle | turtle_idle.png | Parked, menu, spawn |
| 5 | (1, 1) | Firing | turtle_firing.png | Weapon fire (blend with base) |
| 6 | (2, 1) | Damage | turtle_damage.png | Hit reaction (1–3 frame hold) |
| 7 | (3, 1) | Hit flash | turtle_hit_flash.png | Impact flash (1 frame) |

**Size:** 256×256 px per sprite. **Location:** `public/images/ships/turtle/`

---

## 6. Individual Assets

Turtle sprites are individual PNG files for the web project (Vite/Canvas 2D):

- **Location:** `public/images/ships/turtle/`
- **Naming:** `turtle_<pose>.png` (e.g. `turtle_flying_forward.png`, `turtle_bank_left.png`, `turtle_facing_n.png`)
- **Size:** 256×256 px per sprite
- **Paths from public/:** `/images/ships/turtle/turtle_flying_forward.png`, etc.

**CEO-provided:** `turtle_facing_n.png` in `public/images/ships/turtle/` — CEO-supplied canonical sprite for default/facing-north pose. Use as primary reference when generating other Turtle sprites (flying_forward, bank_left, etc.): same ship design, only pose changes.

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md): Use `new Image()`; set `src`; await `onload`. Assets in `public/` are at root when served by Vite.

---

## 7. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Asset paths:** Images in `public/` are at root: `/images/ships/turtle/turtle_*.png`. Same path convention as Sparrow (`/images/ships/sparrow/`).
- **Loading:** Use `new Image()`; set `src`; await `onload`. Same-origin when served by Vite.
- **Transparent background:** Sprite MUST have transparent background (alpha channel). Opaque background breaks layering over parallax.

---

## Design Notes (Gradius/R-Type)

- **Turning** = visible bank/tilt. Player must see which way the ship is turning.
- **Boosting** = obvious engine intensity. Exhaust brighter, longer—still slower than Sparrow.
- **Damage** = clear hit feedback. Flash + smoke so the player knows they were hit. Armored plates absorb.
- **Firing** = muzzle flash + engine brighten. Readable even in dense combat.
- **Tank identity** = heavier silhouette, fortress-like presence, deliberate movement.

---

## References

- [turtle_ship_pilot_style.png](turtle_ship_pilot_style.png) — Base reference (CEO approved 2025-03-02)
- [turtle_design_lock.md](turtle_design_lock.md) — Stats, palette, silhouette, propulsion glow
- [sparrow_sprite_sheet_spec.md](../sparrow/sparrow_sprite_sheet_spec.md) — Pose list structure, layout
- [art_style_guide.md](../../../art_style_guide.md) — Kaladesh pillar, sophistication, top-down view
