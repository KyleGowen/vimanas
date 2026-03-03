# Sparrow Sprite Sheet Spec

**Visual Design Agent · P0 Mocks · 2025-03-02**

Sprite sheet specification for the Sparrow vimana in a top-down 2D shooter. Generated asset: [sparrow_sprite_sheet.png](sparrow_sprite_sheet.png). Base reference: [sparrow_ship_pilot_style.png](sparrow_ship_pilot_style.png). Every frame must read instantly—Gradius/R-Type clarity: shape and pose communicate behavior at a glance.

---

## 1. Pose List

Game actions the Sparrow needs:

| Pose | Description | Read |
|------|-------------|------|
| **Flying forward** | Base pose. Ship level, nose forward, aether exhaust steady. | Default movement state |
| **Banking left** | Ship tilts/rolls left. Wing dips, visible bank angle. | Turning left |
| **Banking right** | Ship tilts/rolls right. Wing dips, visible bank angle. | Turning right |
| **Boosting** | Engine glow intensified (brighter cyan/white). Slight forward lean or nose dip. Exhaust plume longer, more energetic. | Speed boost / dash |
| **Idle** | Subtle engine pulse—slightly dimmer exhaust, minimal motion. | Parked / waiting |
| **Firing** | Muzzle flash at weapon port. Engine glow brightens. | Weapon fire |
| **Damage / hit** | Brief impact state. Hull flash (white/red tint), small sparks, smoke wisps. | Taking damage |
| **Hit flash** | Single-frame white/red flash overlay. | Impact feedback |

### Optional: 8-Direction Facing

If the game does **not** rotate sprites in-engine, include 8 facings for the base pose:

- **N, NE, E, SE, S, SW, W, NW** — Ship rotated 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°.
- **Viewport:** N = top of screen; S = bottom; banking left/right = toward screen edges. See [game_bible.md](../../../../game_bible.md#viewport).

Use the same Sparrow design; only rotation changes. Recommended for games that prefer pre-rendered rotation over runtime rotation.

---

## 2. Sprite Sheet Layout

| Property | Value |
|----------|-------|
| **Grid** | 4×4 (16 cells) |
| **Frame size** | 256×256 px per cell |
| **Total dimensions** | 1024×1024 px |
| **Background** | Transparent or solid neutral (e.g. #1a1a2e) between cells |
| **Bleed** | None—each frame self-contained within its cell |
| **Labels** | Each cell has text label (pose name) for reference |

### Frame Arrangement

```
Row 0:  [Forward]     [Bank Left]    [Bank Right]   [Boost]
Row 1:  [Idle]        [Firing]      [Damage]       [Hit Flash]
Row 2:  [8-dir N]     [8-dir NE]    [8-dir E]      [8-dir SE]
Row 3:  [8-dir S]     [8-dir SW]    [8-dir W]      [8-dir NW]
```

- **Rows 0–1:** Action poses (8 frames)
- **Rows 2–3:** 8-direction facing (8 frames)—omit if engine rotates sprites

---

## 3. Image Prompt for Sprite Sheet

Use this prompt to generate a Sparrow sprite sheet. Match [sparrow_ship_pilot_style.png](sparrow_ship_pilot_style.png) exactly: blue/gold, bird-inspired, filigree, aether exhaust, Kaladesh aesthetic. Same art style—realistic illustrated, sophisticated, high-fidelity 2D.

---

### Full Prompt (200–300 words)

```
Generate a sprite sheet image: a 4×4 grid of 16 cells, each 256×256 pixels, total 1024×1024. Clean grid layout. Transparent or solid dark blue (#1a1a2e) background between cells. No background scenery—only the ship in each cell.

Subject: The Sparrow vimana—a small, sleek, bird-inspired fighter spacecraft. Kaladesh-inspired aesthetic: ornate mechanical, Indian fantasy, gilded. Sapphire blue hull, gold/copper filigree, aether blue (#00FFFF) engine exhaust. Tapered nose, swept wings, feather-like segments, golden beak/head with glowing blue eyes. Single circular engine nozzle at rear. Sophisticated, high-fidelity 2D illustrated style—NOT pixel art, NOT 16-bit. Match the reference image sparrow_ship_pilot_style.png exactly.

View: Oblique top-down (bird's eye, slight angle) for ALL frames. Ship seen from above. Consistent lighting and style across all cells.

Frame layout (left to right, top to bottom):

Row 0: (1) Flying forward—base pose, level, steady exhaust. (2) Banking left—ship tilts left, wing dips. (3) Banking right—ship tilts right, wing dips. (4) Boosting—engine glow intensified, longer exhaust plume, slight forward lean.

Row 1: (5) Idle—subtle engine pulse, slightly dimmer exhaust. (6) Firing—muzzle flash at weapon port, engine brightens. (7) Damage—hull flash, small sparks, smoke wisps. (8) Hit flash—single-frame white/red flash on hull.

Row 2: (9) Facing N (0°), (10) Facing NE (45°), (11) Facing E (90°), (12) Facing SE (135°).

Row 3: (13) Facing S (180°), (14) Facing SW (225°), (15) Facing W (270°), (16) Facing NW (315°).

Each frame: same Sparrow design, same palette, same detail level. Only pose/rotation changes. Crisp rendering. No blur. Grid lines optional; if present, thin and subtle.
```

---

### Director-Optimized Prompt (GenerateImage)

Shorter prompt for tools with token limits:

```
4×4 sprite sheet grid, 1024×1024 total. Sparrow vimana spacecraft in each cell—bird-inspired, blue/gold, Kaladesh ornate filigree, aether blue exhaust. Oblique top-down view. Row 0: flying forward, bank left, bank right, boost. Row 1: idle, firing, damage, hit flash. Rows 2-3: 8 rotation facings (N, NE, E, SE, S, SW, W, NW). Realistic illustrated style, transparent or dark blue background between cells. Match sparrow_ship_pilot_style.png.
```

---

## 4. Asset List

| Frame | Grid position | Pose | Intended use |
|-------|---------------|------|--------------|
| 0 | (0, 0) | Flying forward | Base movement, default state |
| 1 | (1, 0) | Banking left | Turn-left animation |
| 2 | (2, 0) | Banking right | Turn-right animation |
| 3 | (3, 0) | Boosting | Speed boost / dash |
| 4 | (0, 1) | Idle | Parked, menu, spawn |
| 5 | (1, 1) | Firing | Weapon fire (blend with base) |
| 6 | (2, 1) | Damage | Hit reaction (1–3 frame hold) |
| 7 | (3, 1) | Hit flash | Impact flash (1 frame) |
| 8 | (0, 2) | 8-dir N | Facing up |
| 9 | (1, 2) | 8-dir NE | Facing up-right |
| 10 | (2, 2) | 8-dir E | Facing right |
| 11 | (3, 2) | 8-dir SE | Facing down-right |
| 12 | (0, 3) | 8-dir S | Facing down |
| 13 | (1, 3) | 8-dir SW | Facing down-left |
| 14 | (2, 3) | 8-dir W | Facing left |
| 15 | (3, 3) | 8-dir NW | Facing up-left |

---

## Design Notes (Gradius/R-Type)

- **Turning** = visible bank/tilt. Player must see which way the ship is turning.
- **Boosting** = obvious engine intensity. Exhaust brighter, longer, more energetic.
- **Damage** = clear hit feedback. Flash + smoke so the player knows they were hit.
- **Firing** = muzzle flash + engine brighten. Readable even in dense combat.

---

## Individual Assets

The sprite sheet has been split into individual PNGs for Unity import:

- **Location:** `Assets/Content/Sprites/Sparrow/`
- **Naming:** `sparrow_<pose>.png` (e.g. `sparrow_flying_forward.png`, `sparrow_bank_left.png`)
- **Size:** 512×512 px per sprite (source sheet 2048×2048)
- **List:** See [Sparrow README](../../../../Assets/Content/Sprites/Sparrow/README.md)

---

## References

- [sparrow_ship_pilot_style.png](sparrow_ship_pilot_style.png) — Base reference
- [player_ship_sparrow_poc.md](player_ship_sparrow_poc.md) — Design intent, palette
- [ship_mocks_pilot_style_deliverable.md](../ship_mocks_pilot_style_deliverable.md) — Style lock
- [art_style_guide.md](../../../art_style_guide.md) — Kaladesh pillar, sophistication

