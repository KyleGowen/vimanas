# Ship Selection UI Design Lock

**Visual Design · Phase 6.S.1**

Ship selection layout and flow for pre-level ship pick. Locks 4-ship layout, selection flow, visual feedback, and controller-first input. Ships only—no pilots. Phase 7 will add pilot selection. Gates 6.S.2 (Ship selection tech).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships/ship_mocks_pilot_style_deliverable.md](p0_mocks/p0_1_ships/ship_mocks_pilot_style_deliverable.md) | Four ships (Sparrow, Turtle, Wolf, Dragon). Pilot-style mocks canonical. Top-down/3/4 view. Kaladesh aesthetic, propulsion glow colors. |
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
| **D-pad Left / Stick Left** | Move focus to previous ship (wrap: Dragon → Sparrow) |
| **D-pad Right / Stick Right** | Move focus to next ship (wrap: Sparrow → Dragon) |
| **D-pad Up / Down** | No-op (single row) or reserved for future pilot row |
| **A / Enter** | Confirm selection → proceed to level (Gameplay) |
| **B / Escape / Back** | Return to title screen |

**Controller-first:** D-pad and left stick both drive focus. A = confirm. B = back. Keyboard: Arrow keys (Left/Right), Enter, Escape.

### 2.2 Flow Diagram

```
Title Screen
     │
     │ [PRESS START / Enter / A]
     ▼
Ship Selection
     │
     ├── D-pad/Stick Left/Right → move focus (Sparrow ↔ Turtle ↔ Wolf ↔ Dragon)
     │
     ├── A / Enter → confirm → Gameplay (with chosen ship)
     │
     └── B / Escape → back → Title Screen
```

### 2.3 Default Focus

- **On enter:** Focus on Sparrow (leftmost).
- **Wrap:** Left from Sparrow → Dragon. Right from Dragon → Sparrow.

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
| D-pad Left | Focus previous ship |
| D-pad Right | Focus next ship |
| Left Stick X < 0 | Focus previous ship |
| Left Stick X > 0 | Focus next ship |
| A | Confirm selection |
| B | Back to title |

### 5.2 Keyboard

| Key | Action |
|-----|--------|
| Arrow Left | Focus previous ship |
| Arrow Right | Focus next ship |
| Enter | Confirm selection |
| Escape | Back to title |

**Note:** Mouse click on slot can select (optional). Controller-first; keyboard parity. Phase 7 may add pilot row (Up/Down for ship vs pilot focus).

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

## 8. No Pilots (Phase 6 Scope)

**Ships only.** Phase 6 ship selection does not include pilot selection. No pilot portraits, no pilot modifiers, no pilot row. Phase 7 (7.A.2, 7.1) will extend this design with pilot selection. This document locks the ship-only layout and flow.

---

## 9. References

| Document | Purpose |
|----------|---------|
| [design_system.md](../design_system.md) | UI components; ship stats; controller mapping |
| [art_style_guide.md](../art_style_guide.md) | Ship propulsion glow colors; UI style; illustrated, ornate |
| [hud_design.md](hud_design.md) | Layout structure; copper/brass palette; zone positioning |
| [results_screen_design.md](results_screen_design.md) | Flow structure; button spec; controller-first |
| [ship_mocks_pilot_style_deliverable.md](p0_mocks/p0_1_ships/ship_mocks_pilot_style_deliverable.md) | Ship visuals; canonical mocks |
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

## Gate

This document gates:
- **6.S.2** — Ship selection (pre-level): ShipSelect scene; 4 ships; pick ship → load Gameplay with chosen ship
