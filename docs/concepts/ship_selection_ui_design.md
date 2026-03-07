# Ship Selection UI Design Lock

**Visual Design · Phase 6.S.1 + Phase 7.A.2**

Ship selection layout and flow for pre-level ship and pilot pick. Locks 4-ship layout, 4-pilot layout, selection flow, visual feedback, and controller-first input. Phase 6: ships only. Phase 7: ships + pilots. Gates 6.S.2 (Ship selection tech) and 7.1 (Ship selection with pilots).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships/ship_mocks_pilot_style_deliverable.md](p0_mocks/p0_1_ships/ship_mocks_pilot_style_deliverable.md) | Four ships (Sparrow, Turtle, Wolf, Dragon). Pilot-style mocks canonical. Top-down/3/4 view. Kaladesh aesthetic, propulsion glow colors. |
| **Pilot mocks** | [p0_2_pilots/pilot_mocks_deliverable.md](p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md) | Four pilots (Speed, Weapon, Defensive, Rookie). 256×256 portraits. Kaladesh aesthetic; varied ages/ethnicities/genders. Canonical for ship select. |
| **Pilot–ship pairing** | [pilot_ship_pairing_design.md](pilot_ship_pairing_design.md) | Combo ID format `{ship}-{pilot}`; 16 combos; modifier application per pilot. |
| **Title screen** | [p0_5_title_screen/title_screen_mocks_deliverable.md](p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md) | Copper/brass framing, period-appropriate typography. Warm metallics (#B5A642, #B87333). UI mood: illustrated, ornate. PRESS START treatment. |
| **Art style guide** | [art_style_guide.md](../art_style_guide.md) | Ship propulsion glow colors (Sparrow cyan #00FFFF, Turtle amber #FFBF00, Wolf white/silver, Dragon orange/red #FF4500). Illustrated, ornate, inventor-fair. Aether accents, filigree framing. |

---

## 1. Layout

### 1.1 ASCII Wireframe (4 Ships)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    [Background: layered sky / copper frame]             │
│                                                                         │
│                         SELECT YOUR SHIP                                │
│                    (copper/brass title treatment)                       │
│                                                                         │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     │   SPARROW    │  │   TURTLE    │  │    WOLF     │  │   DRAGON     │
│     │   [ship]     │  │   [ship]    │  │   [ship]    │  │   [ship]    │
│     │   cyan glow  │  │  amber glow │  │ white glow  │  │ orange glow │
│     └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
│          ↑ focus          default          default          default       │
│                                                                         │
│                    [A] CONFIRM    [B] BACK                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Placement:** Four ship slots in a horizontal row. Left-to-right order: Sparrow → Turtle → Wolf → Dragon. Default focus: Sparrow (leftmost).

### 1.2 Layout Zones (1280×720)

| Zone | Position (1280×720) | Content | Notes |
|------|---------------------|---------|-------|
| **Title** | Center, y: 80–120 | "SELECT YOUR SHIP" | Copper/brass treatment; period-appropriate typography |
| **Ship row** | Center, y: 220–520 | 4 ship slots | Horizontal; equal spacing; each slot ~200–240 px wide |
| **Ship slot 1** | x: 120–360 | Sparrow | Leftmost; default focus |
| **Ship slot 2** | x: 360–600 | Turtle | |
| **Ship slot 3** | x: 600–840 | Wolf | |
| **Ship slot 4** | x: 840–1160 | Dragon | Rightmost |
| **Prompt** | Bottom, y: 640–680 | [A] CONFIRM  [B] BACK | Secondary; copper/brass |

**Safe zone:** 48 px inset from edges. Ship slots centered; readable at 1080p.

---

## 2. Selection Flow

### 2.1 Navigation

| Input | Action |
|-------|--------|
| **D-pad Left / Stick Left** | Move focus to previous slot in current row (wrap) |
| **D-pad Right / Stick Right** | Move focus to next slot in current row (wrap) |
| **D-pad Up** | (Phase 7) If pilot row focused → move to ship row; if ship row → no-op |
| **D-pad Down** | (Phase 7) If ship row focused → move to pilot row; if pilot row → no-op |
| **A / Enter** | Confirm selection → proceed to level (Gameplay) |
| **B / Escape / Back** | Return to title screen |

**Phase 6:** Single ship row; Up/Down no-op. **Phase 7:** Ship row + pilot row; Up/Down switch rows. See Section 13 for full pilot flow.

**Controller-first:** D-pad and left stick both drive focus. A = confirm. B = back. Keyboard: Arrow keys (Left/Right/Up/Down), Enter, Escape.

### 2.2 Flow Diagram

```
Title Screen
     │
     │ [PRESS START / Enter / A]
     ▼
Ship Selection
     │
     ├── D-pad/Stick Left/Right → move focus within current row
     ├── (Phase 7) D-pad Up/Down → switch between ship row and pilot row
     │
     ├── A / Enter → confirm → Gameplay (Phase 6: ship only; Phase 7: ship + pilot)
     │
     └── B / Escape → back → Title Screen
```

### 2.3 Default Focus

- **On enter:** Focus on ship row, Sparrow (index 0).
- **Wrap (ship row):** Left from Sparrow → Dragon. Right from Dragon → Sparrow.
- **(Phase 7) Wrap (pilot row):** Left from Speed → Rookie. Right from Rookie → Speed.

---

## 3. Visual Feedback

### 3.1 Focus State

| State | Visual treatment |
|-------|------------------|
| **Focused** | Copper frame (#B87333) 2–3 px; brass highlight (#B5A642); propulsion glow accent (ship-specific color) around ship sprite; optional subtle scale (1.05–1.1×) |
| **Unfocused** | Darker frame; reduced opacity (0.7–0.8) or desaturated; no glow accent |
| **Hover (mouse)** | Same as focused when mouse over slot (optional; controller-first, so secondary) |

### 3.2 Propulsion Glow Accents (Per Art Style Guide)

Each ship slot uses its ship's canonical propulsion glow for focus highlight. Per [art_style_guide.md](../art_style_guide.md):

| Ship | Glow color | Hex | Use |
|------|------------|-----|-----|
| Sparrow | Cyan/blue | #00FFFF | Focus ring, ship accent, label highlight |
| Turtle | Amber/gold | #FFBF00 | Focus ring, ship accent, label highlight |
| Wolf | White/silver | #C0C0C0 | Focus ring, ship accent, label highlight |
| Dragon | Orange/red | #FF4500 | Focus ring, ship accent, label highlight |

**Implementation:** When a slot is focused, draw a subtle glow (e.g. `ctx.shadowBlur` + `ctx.shadowColor` with ship color) around the ship sprite or slot frame. Reinforces ship identity and matches in-game thruster/propulsion language.

### 3.3 Ship Labels

| Property | Value | Rationale |
|----------|-------|-----------|
| **Text** | SPARROW, TURTLE, WOLF, DRAGON | All caps; legible |
| **Position** | Below ship sprite in slot | Clear association |
| **Focused** | Ship color accent or brass | Matches focus state |
| **Unfocused** | Warm white (#F5F0E6) or muted | Readable on dark frame |

---

## 4. Visual Spec

### 4.1 Style (Per Art Style Guide)

- **Aesthetic:** Illustrated, ornate, inventor-fair. Aether accents, filigree framing.
- **Design system compliance:** Per [design_system.md](../design_system.md). Matches HUD, results screen, title screen tone.
- **Functional first:** Selection state clear; controller navigation obvious.

### 4.2 Palette

| Use | Color | Hex | Notes |
|-----|-------|-----|-------|
| Frame / trim | Copper | #B87333 | Slot borders; consistent with HUD |
| Frame highlight | Brass / gold | #B5A642 | Focused slot; warm metallic |
| Background | Dark brown | #3d2914 | Slot fill; matches HUD bars |
| Text | Warm white | #F5F0E6 | Labels; legible |
| Sparrow accent | Cyan | #00FFFF | Focus glow |
| Turtle accent | Amber | #FFBF00 | Focus glow |
| Wolf accent | Silver | #C0C0C0 | Focus glow |
| Dragon accent | Orange-red | #FF4500 | Focus glow |

### 4.3 Ship Slots

| Property | Value | Rationale |
|----------|-------|-----------|
| **Count** | 4 | Sparrow, Turtle, Wolf, Dragon |
| **Layout** | Horizontal row | Left-to-right; natural reading order |
| **Slot width** | 200–240 px | Fits ship sprite; not cramped |
| **Slot height** | 200–280 px | Ship + label; comfortable |
| **Spacing** | 24–32 px between slots | Clear separation |
| **Frame** | 2–3 px copper border | Matches HUD; filigree corners optional |
| **Corner radius** | 4–8 px | Soft edge; not sharp |

### 4.4 Ship Sprites

| Ship | Asset path | Notes |
|------|------------|-------|
| Sparrow | `/images/ships/sparrow/sparrow_facing_n.png` | Top-down north; canonical pose for select |
| Turtle | `/images/ships/turtle/turtle_facing_n.png` | Top-down north |
| Wolf | `/images/ships/wolf/wolf_facing_n.png` | Top-down north |
| Dragon | `/images/ships/dragon/dragon_facing_n.png` | Top-down north |

**Fallback:** If sprite missing, draw placeholder rect with ship color. Per [engine_learnings.md](../dev_standards/engine_learnings.md): paths from `public/`; load via `new Image()`.

---

## 5. Input Mapping

### 5.1 Controller (Primary)

| Button | Action |
|--------|--------|
| D-pad Left | Focus previous slot in current row |
| D-pad Right | Focus next slot in current row |
| D-pad Up | (Phase 7) Move to ship row if on pilot row |
| D-pad Down | (Phase 7) Move to pilot row if on ship row |
| Left Stick X < 0 | Focus previous slot in current row |
| Left Stick X > 0 | Focus next slot in current row |
| A | Confirm selection |
| B | Back to title |

### 5.2 Keyboard

| Key | Action |
|-----|--------|
| Arrow Left | Focus previous slot in current row |
| Arrow Right | Focus next slot in current row |
| Arrow Up | (Phase 7) Move to ship row if on pilot row |
| Arrow Down | (Phase 7) Move to pilot row if on ship row |
| Enter | Confirm selection |
| Escape | Back to title |

**Note:** Mouse click on slot can select (optional). Controller-first; keyboard parity.

---

## 6. Asset Paths

Per [engine_learnings.md](../dev_standards/engine_learnings.md): Assets in `public/`; paths from root.

| Asset | Path | Notes |
|-------|------|-------|
| Sparrow (facing N) | `/images/ships/sparrow/sparrow_facing_n.png` | Ship select sprite |
| Turtle (facing N) | `/images/ships/turtle/turtle_facing_n.png` | Ship select sprite |
| Wolf (facing N) | `/images/ships/wolf/wolf_facing_n.png` | Ship select sprite |
| Dragon (facing N) | `/images/ships/dragon/dragon_facing_n.png` | Ship select sprite |
| Slot frame | `/images/ui/ship_select/slot_frame.png` | Optional; can draw procedurally |
| Filigree corner | `/images/ui/hud/filigree_corner.png` | Reusable from HUD |

**Placeholder:** Slots can be drawn via Canvas 2D (`fillRect`, `strokeRect`) until assets exist. Ship sprites already in `public/images/ships/`.

---

## 7. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Canvas 2D:** Ship selection is a distinct scene or overlay. Draw on same canvas as title or separate overlay. Use `ctx.getContext('2d')`. Draw after background; ensure no z-fighting.
- **Resolution:** Internal 1280×720; scale to viewport. Layout uses center-relative positioning. Letterbox/pillarbox when aspect differs—ship select stays within gameplay area. Pick largest 16:9 that fits.
- **Asset loading:** Images via `new Image()`; paths like `/images/ships/sparrow/sparrow_facing_n.png`. Preload ship sprites with title screen assets or on ShipSelect scene enter.
- **Input:** Ship selection captures input (D-pad, stick, A, B). Prevent input from reaching title or gameplay. Focus management: track `focusedIndex` (0–3); wrap on edges.
- **Gamepad polling:** Use `navigator.getGamepads()`; poll each frame. Map D-pad (axes 6/7 or buttons) and A/B. Per engine_learnings: gamepad requires polling.
- **Transition:** Fade or cut from Title to ShipSelect on PRESS START; from ShipSelect to Gameplay on confirm. 0.3–0.5 s transition acceptable.
- **Performance:** 60 FPS target. Ship select is lightweight—4 sprites, simple UI. Avoid per-frame allocations.

---

## 8. Pilot Selection (Phase 7 Extension)

Phase 7 extends ship selection with pilot selection. See Sections 11–15 for pilot layout, slot spec, selection flow, visual feedback, and asset paths. Phase 6 implementation uses ships only; Phase 7 (7.1) adds pilot row and passes `{ shipId, pilotId }` to Gameplay.

---

## 9. References

| Document | Purpose |
|----------|---------|
| [design_system.md](../design_system.md) | UI components; ship stats; controller mapping |
| [art_style_guide.md](../art_style_guide.md) | Ship propulsion glow colors; UI style; illustrated, ornate |
| [hud_design.md](hud_design.md) | Layout structure; copper/brass palette; zone positioning |
| [results_screen_design.md](results_screen_design.md) | Flow structure; button spec; controller-first |
| [ship_mocks_pilot_style_deliverable.md](p0_mocks/p0_1_ships/ship_mocks_pilot_style_deliverable.md) | Ship visuals; canonical mocks |
| [pilot_mocks_deliverable.md](p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md) | Pilot portraits; canonical for ship select |
| [pilot_ship_pairing_design.md](pilot_ship_pairing_design.md) | Combo ID format; modifier application |
| [title_screen_mocks_deliverable.md](p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md) | Copper/brass framing; UI mood |
| [engine_learnings.md](../dev_standards/engine_learnings.md) | Canvas 2D, resolution, asset paths, input |

---

## 10. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Visual Design** | Done | 2026-03-07 |
| **Full Stack** | Done | 2026-03-07 |
| **CEO** | Approved | 2026-03-07 |

---

## 11. Pilot Selection (Phase 7 Extension)

### 11.1 ASCII Wireframe (Ships + Pilots)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SELECT YOUR SHIP AND PILOT                           │
│                    (copper/brass title treatment)                       │
│                                                                         │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     │   SPARROW    │  │   TURTLE     │  │    WOLF      │  │   DRAGON     │
│     │   [ship]     │  │   [ship]     │  │   [ship]     │  │   [ship]     │
│     └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
│          ↑ ship row (focus: ship or pilot row)                           │
│                                                                         │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     │    SPEED     │  │   WEAPON     │  │  DEFENSIVE   │  │    ROOKIE     │
│     │  [portrait]  │  │  [portrait]  │  │  [portrait]  │  │  [portrait]   │
│     └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
│          ↑ pilot row                                                    │
│                                                                         │
│                    [A] CONFIRM    [B] BACK                              │
└─────────────────────────────────────────────────────────────────────────┘
```

**Placement:** Ship row above pilot row. Left-to-right order in each row. Focus: `focusedRow` ('ship' | 'pilot') + `focusedIndex` (0–3) within row.

### 11.2 Zone Layout (1280×720, Phase 7)

| Zone | Position (1280×720) | Content | Notes |
|------|---------------------|---------|-------|
| **Title** | Center, y: 60–100 | "SELECT YOUR SHIP AND PILOT" | Copper/brass treatment |
| **Ship row** | Center, y: 140–400 | 4 ship slots | Horizontal; same as Phase 6 |
| **Pilot row** | Center, y: 420–600 | 4 pilot slots | Horizontal; portrait + label per slot |
| **Prompt** | Bottom, y: 640–680 | [A] CONFIRM  [B] BACK | Secondary; copper/brass |

---

## 12. Pilot Slot Spec

| Pilot | Label | Portrait asset | Pilot ID (code) |
|-------|-------|----------------|-----------------|
| Speed | SPEED | pilot_speed_specialist.png | speed |
| Weapon | WEAPON | pilot_weapon_specialist.png | weapon |
| Defensive | DEFENSIVE | pilot_defensive_specialist.png | defensive |
| Rookie | ROOKIE | pilot_neutral_rookie.png | rookie |

**Asset source:** P0 mocks in [pilot_mocks_deliverable.md](p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md). For implementation: copy to `public/images/pilots/` (per [engine_learnings.md](../dev_standards/engine_learnings.md)—runtime assets in `public/`).

---

## 13. Selection Flow (with Pilots)

| Input | Action |
|-------|--------|
| D-pad Left / Stick Left | Move focus within current row (wrap) |
| D-pad Right / Stick Right | Move focus within current row (wrap) |
| D-pad Up | If pilot row → move to ship row; if ship row → no-op |
| D-pad Down | If ship row → move to pilot row; if pilot row → no-op |
| A / Enter | Confirm → `{ shipId, pilotId }` → Gameplay |
| B / Escape | Back to title |

**Default focus:** Ship row, Sparrow (index 0).

**Scene state passed to Gameplay:** `{ shipId: ShipId, pilotId: PilotId }`. `PilotId` = `'speed' | 'weapon' | 'defensive' | 'rookie'`. Combo ID for modifiers = `{shipId}-{pilotId}` per [pilot_ship_pairing_design.md](pilot_ship_pairing_design.md).

---

## 14. Pilot Visual Feedback

| State | Visual treatment |
|-------|------------------|
| **Focused** | Copper frame (#B87333) 2–3 px; brass highlight (#B5A642); optional pilot accent (Speed=cyan #00FFFF, Weapon=amber #FFBF00, Defensive=brass #B5A642, Rookie=warm white #F5F0E6) |
| **Unfocused** | Darker frame; reduced opacity (0.7–0.8) or desaturated; no glow accent |
| **Portrait size** | 128×128 or 160×160 display (scale from 256×256 source) |

---

## 15. Asset Paths (Pilots)

Per [engine_learnings.md](../dev_standards/engine_learnings.md): Pilot portraits in `public/images/pilots/`; paths from root.

| Pilot | Path | Notes |
|-------|------|-------|
| Speed | `/images/pilots/pilot_speed_specialist.png` | From P0 mock |
| Weapon | `/images/pilots/pilot_weapon_specialist.png` | From P0 mock |
| Defensive | `/images/pilots/pilot_defensive_specialist.png` | From P0 mock |
| Rookie | `/images/pilots/pilot_neutral_rookie.png` | From P0 mock |

**Source:** Copy P0 mocks from `docs/concepts/p0_mocks/p0_2_pilots/` to `public/images/pilots/`. No new asset creation—P0 mocks are canonical. Per roadmap 7.A.3.

---

## Gate

This document gates:
- **6.S.2** — Ship selection (pre-level): ShipSelect scene; 4 ships; pick ship → load Gameplay with chosen ship
- **7.1** — Ship selection with pilots: ShipSelect scene; 4 ships + 4 pilots; pick ship + pilot → load Gameplay with `{ shipId, pilotId }`; modifiers apply per pilot_ship_pairing_design
