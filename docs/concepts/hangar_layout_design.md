# TheHangar Layout Design Lock

**Visual Design · Phase 8.A.1**

Hangar layout and flow for pre-level ship customization. Locks ship display area, stat display, upgrade panels, selection/upgrade flow, and controller-first input. Gates 8.1 (Hangar scene tech). Upgrade economy (8.A.2) and weapon/bomb design (8.A.3) define exact upgrade types; this spec defines layout and placement.

---

## P0 Mocks Considered


| P0 Mock                    | Path                                                                                                                | What it informs                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ship mocks**             | [p0_1_ships/ship_mocks_pilot_style_deliverable.md](p0_mocks/p0_1_ships/ship_mocks_pilot_style_deliverable.md)       | Four ships (Sparrow, Turtle, Wolf, Dragon). Top-down/3/4 view. Kaladesh aesthetic, propulsion glow colors. Ship display uses facing_n sprites.                                        |
| **Pilot mocks**            | [p0_2_pilots/pilot_mocks_deliverable.md](p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md)                           | Four pilots; 256×256 portraits. Pilot portrait in hangar for selected combo.                                                                                                          |
| **Ship selection**         | [ship_selection_ui_design.md](ship_selection_ui_design.md)                                                          | 4-ship row layout; copper/brass framing; propulsion glow accents. If ship selection in hangar, reuse same row.                                                                        |
| **Title screen**           | [p0_5_title_screen/title_screen_mocks_deliverable.md](p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md) | Copper/brass framing, period-appropriate typography. Warm metallics (#B5A642, #B87333). UI mood: illustrated, ornate.                                                                 |
| **HUD design**             | [hud_design.md](hud_design.md)                                                                                      | Layout structure; copper/brass palette; zone positioning; HP/mana bar visual language.                                                                                                |
| **Pilot–ship stat design** | [pilot_ship_stat_design_lock.md](pilot_ship_stat_design_lock.md)                                                    | Ship-owned stats (HP, Defense, Attack, Speed, Fire Power, Weapon Types, Shield types, Fire Speed, forward thrust); pilot-owned stats (Mana, Maneuvering, etc.); Materials = currency. |
| **Art style guide**        | [art_style_guide.md](../art_style_guide.md)                                                                         | Kaladesh aesthetic; copper/brass (#B87333, #B5A642); illustrated, ornate, inventor-fair; aether accents, filigree framing.                                                            |


---

## 1. Layout

### 1.1 Flow Assumption

The hangar receives the player **after ship+pilot selection** (from ShipSelect) or can be entered from title. Ship and pilot are pre-selected. Hangar focuses on: (1) ship display, (2) stat display, (3) upgrade panels, (4) ready. A **Change ship** action returns to ShipSelect if needed.

### 1.2 ASCII Wireframe (1280×720)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Background: layered hangar / copper frame; inventor-fair aesthetic]   │
│                                                                         │
│                         HANGAR                                          │
│                    (copper/brass title treatment)                       │
│                                                                         │
│  ┌─────────────────────────────────────┐  ┌───────────────────────────┐ │
│  │                                     │  │  MATERIALS: 1,250         │ │
│  │         SHIP DISPLAY AREA           │  │  ─────────────────────   │ │
│  │         [selected ship sprite]     │  │  HP         ████████░░ 14  │ │
│  │         [ship propulsion glow]     │  │  Defense    ██████░░░░ 8   │ │
│  │                                     │  │  Attack    ████████░░ 12  │ │
│  │         [pilot portrait]            │  │  Speed     ██████████ 35  │ │
│  │         [combo label]               │  │  Fire Pwr  ██████░░░░ 10  │ │
│  │                                     │  │  Fire Spd  ████████░░ 6.7 │ │
│  └─────────────────────────────────────┘  └───────────────────────────┘ │
│                    ↑ ship + pilot              ↑ STAT DISPLAY            │
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │  STAT UPGRADE PANEL         │  │  WEAPON UPGRADE PANEL           │  │
│  │  [placeholder zones]        │  │  [placeholder zones]           │  │
│  │  HP +1  Defense +1  etc.    │  │  Primary  Secondary  Bomb        │  │
│  │  (exact types: 8.A.2)       │  │  (exact types: 8.A.3)            │  │
│  └─────────────────────────────┘  └─────────────────────────────────┘  │
│           ↑ upgrade panels (placeholder layout)                           │
│                                                                         │
│                    [A] READY    [B] BACK / CHANGE SHIP                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Placement:** Ship display left; stat display right; upgrade panels bottom; prompt bar at bottom. Ornate inventor-fair framing throughout.  

### 1.3 Layout Zones (1280×720)


| Zone                     | Position (1280×720)            | Content                                                               | Notes                                                          |
| ------------------------ | ------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Title**                | Center, y: 48–88               | "HANGAR"                                                              | Copper/brass treatment; period-appropriate typography          |
| **Ship display**         | Left, x: 24–420, y: 100–480    | Selected ship sprite, propulsion glow, pilot portrait, combo label    | Prominent; ship facing north; pilot below ship                 |
| **Materials**            | Right, x: 440–1256, y: 100–130 | "MATERIALS: X,XXX"                                                    | Currency for upgrades; right-aligned in stat column            |
| **Stat display**         | Right, x: 440–1256, y: 140–420 | Ship stats (HP, Defense, Attack, Speed, Fire Power, Fire Speed, etc.) | Per pilot_ship_stat_design_lock; ship-owned stats; bar + value |
| **Stat upgrade panel**   | Left, x: 24–620, y: 500–660    | Placeholder: stat upgrade buttons                                     | Exact upgrade types from 8.A.2 economy design                  |
| **Weapon upgrade panel** | Right, x: 640–1256, y: 500–660 | Placeholder: weapon/bomb upgrade buttons                              | Exact upgrade types from 8.A.3 weapon/bomb design              |
| **Prompt**               | Bottom, y: 672–720             | [A] READY [B] BACK                                                    | Secondary; copper/brass; 48 px height                          |


**Safe zone:** 24 px inset from edges. Content readable at 1080p.

---

## 2. Selection / Upgrade Flow

### 2.1 Navigation


| Input                         | Action                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| **D-pad Left / Stick Left**   | Move focus to previous focusable (ship display → stat display → upgrade panels; wrap) |
| **D-pad Right / Stick Right** | Move focus to next focusable                                                          |
| **D-pad Up / Stick Up**       | Move focus up within current panel (e.g. stat row, upgrade slot)                      |
| **D-pad Down / Stick Down**   | Move focus down within current panel                                                  |
| **A / Enter**                 | Confirm: if on upgrade → purchase (if affordable); if on Ready → proceed to level     |
| **B / Escape / Back**         | Back: if in upgrade detail → exit; else → ShipSelect or Title                         |
| **X** (optional)              | Change ship → ShipSelect                                                              |


**Controller-first:** D-pad and left stick drive focus. A = confirm/purchase/ready. B = back. Keyboard: Arrow keys, Enter, Escape.

### 2.2 Flow Diagram

```
Title Screen / ShipSelect
     │
     │ [Enter Hangar]
     ▼
Hangar
     │
     ├── D-pad/Stick → move focus (ship display, stat display, upgrade panels)
     ├── A on upgrade slot → purchase (if materials sufficient)
     ├── A on Ready → proceed to Gameplay
     │
     ├── B → Back to ShipSelect (or Title if entered from title)
     │
     └── X (optional) → Change ship → ShipSelect
```

### 2.3 Default Focus

- **On enter:** Focus on first upgrade slot (Stat upgrade panel, first available slot) or Ready if no upgrades available.
- **Alternative:** Focus on Ship display (visual anchor) with first tap moving to upgrade panels.
- **Recommendation:** Focus on first stat upgrade slot (if any) or Ready. User can navigate to view ship/stats.

### 2.4 Flow Summary


| Step | Action                                                             |
| ---- | ------------------------------------------------------------------ |
| 1    | Enter hangar with selected ship+pilot                              |
| 2    | Ship display shows selected ship; stat display shows current stats |
| 3    | Navigate to upgrade panels; spend materials to upgrade             |
| 4    | Ready → proceed to level (Gameplay)                                |


---

## 3. Visual Feedback

### 3.1 Focus State


| State                                 | Visual treatment                                                                                                                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Focused**                           | Copper frame (#B87333) 2–3 px; brass highlight (#B5A642); ship propulsion glow accent (ship-specific color) on ship display; optional subtle scale (1.02–1.05×) on focused upgrade slot |
| **Unfocused**                         | Darker frame; reduced opacity (0.75–0.85) or desaturated; no glow accent                                                                                                                |
| **Hover (mouse)**                     | Same as focused when mouse over (optional; controller-first)                                                                                                                            |
| **Disabled (insufficient materials)** | Muted; grayed-out; show cost in red or dimmed                                                                                                                                           |


### 3.2 Ship Propulsion Glow Accents (Per Art Style Guide)

Ship display uses ship's canonical propulsion glow for accent. Per [art_style_guide.md](../art_style_guide.md):


| Ship    | Glow color   | Hex     | Use                                  |
| ------- | ------------ | ------- | ------------------------------------ |
| Sparrow | Cyan/blue    | #00FFFF | Ship display accent, frame highlight |
| Turtle  | Amber/gold   | #FFBF00 | Ship display accent, frame highlight |
| Wolf    | White/silver | #C0C0C0 | Ship display accent, frame highlight |
| Dragon  | Orange/red   | #FF4500 | Ship display accent, frame highlight |


### 3.3 Stat Bars


| Property   | Value                 | Rationale                       |
| ---------- | --------------------- | ------------------------------- |
| **Fill**   | Left-to-right         | Per HUD design; consistent      |
| **Frame**  | 2–3 px copper border  | Matches HUD, ship select        |
| **Height** | 14–18 px per stat row | Compact; multiple stats visible |
| **Label**  | Left; value right     | "HP", "14" or "14/14"           |


---

## 4. Visual Spec

### 4.1 Style (Per Art Style Guide)

- **Aesthetic:** Illustrated, ornate, inventor-fair. Aether accents, filigree framing.
- **Design system compliance:** Per [design_system.md](../design_system.md). Matches HUD, results screen, ship select, title screen tone.
- **Functional first:** Stat display legible; upgrade slots clear; controller navigation obvious.

### 4.2 Palette


| Use             | Color        | Hex     | Notes                             |
| --------------- | ------------ | ------- | --------------------------------- |
| Frame / trim    | Copper       | #B87333 | Slot borders; consistent with HUD |
| Frame highlight | Brass / gold | #B5A642 | Focused slot; warm metallic       |
| Background      | Dark brown   | #3d2914 | Panel fill; matches HUD bars      |
| Text            | Warm white   | #F5F0E6 | Labels; legible                   |
| Materials       | Aether blue  | #4A90D9 | Currency accent                   |
| Sparrow accent  | Cyan         | #00FFFF | Ship display glow                 |
| Turtle accent   | Amber        | #FFBF00 | Ship display glow                 |
| Wolf accent     | Silver       | #C0C0C0 | Ship display glow                 |
| Dragon accent   | Orange-red   | #FF4500 | Ship display glow                 |
| Disabled        | Muted gray   | #6B6B6B | Insufficient materials            |


### 4.3 Component Dimensions


| Component             | Dimensions             | Notes                                                  |
| --------------------- | ---------------------- | ------------------------------------------------------ |
| **Ship display area** | ~396×380 px            | Left panel; ship sprite centered; pilot portrait below |
| **Stat display**      | ~816×280 px            | Right column; stacked stat rows                        |
| **Stat row**          | Full width × 28–32 px  | Label + bar + value                                    |
| **Upgrade panel**     | ~596×160 px each       | Two panels side-by-side; placeholder slots             |
| **Upgrade slot**      | ~120–160 px × 48–56 px | Per slot; exact count from 8.A.2, 8.A.3                |
| **Ready button**      | 160–200 px × 40–48 px  | Per results_screen_design                              |
| **Prompt bar**        | Full width × 48 px     | Bottom; [A] READY [B] BACK                             |


### 4.4 Ship Display


| Property           | Value                  | Rationale                       |
| ------------------ | ---------------------- | ------------------------------- |
| **Ship sprite**    | facing_n; scale to fit | Top-down north; canonical pose  |
| **Pilot portrait** | 80×80 or 96×96 display | Scaled from 256×256; below ship |
| **Combo label**    | e.g. "SPARROW · SPEED" | Ship + pilot name               |


---

## 5. Input Mapping

### 5.1 Controller (Primary)


| Button      | Action                       |
| ----------- | ---------------------------- |
| D-pad Left  | Focus previous               |
| D-pad Right | Focus next                   |
| D-pad Up    | Focus up within panel        |
| D-pad Down  | Focus down within panel      |
| Left Stick  | Same as D-pad                |
| A           | Confirm / Purchase / Ready   |
| B           | Back / Change ship (context) |
| X           | Change ship (optional)       |


### 5.2 Keyboard


| Key         | Action                     |
| ----------- | -------------------------- |
| Arrow Left  | Focus previous             |
| Arrow Right | Focus next                 |
| Arrow Up    | Focus up within panel      |
| Arrow Down  | Focus down within panel    |
| Enter       | Confirm / Purchase / Ready |
| Escape      | Back                       |


**Note:** Mouse click on upgrade slot or Ready can activate (optional). Controller-first; keyboard parity.

---

## 6. Asset Paths

Per [engine_learnings.md](../dev_standards/engine_learnings.md): Assets in `public/`; paths from root.


| Asset              | Path                                            | Notes                           |
| ------------------ | ----------------------------------------------- | ------------------------------- |
| Sparrow (facing N) | `/images/ships/sparrow/sparrow_facing_n.png`    | Ship display                    |
| Turtle (facing N)  | `/images/ships/turtle/turtle_facing_n.png`      | Ship display                    |
| Wolf (facing N)    | `/images/ships/wolf/wolf_facing_n.png`          | Ship display                    |
| Dragon (facing N)  | `/images/ships/dragon/dragon_facing_n.png`      | Ship display                    |
| Pilot Speed        | `/images/pilots/pilot_speed_specialist.png`     | Pilot portrait                  |
| Pilot Weapon       | `/images/pilots/pilot_weapon_specialist.png`    | Pilot portrait                  |
| Pilot Defensive    | `/images/pilots/pilot_defensive_specialist.png` | Pilot portrait                  |
| Pilot Rookie       | `/images/pilots/pilot_neutral_rookie.png`       | Pilot portrait                  |
| Ship display frame | `/images/ui/hangar/ship_display_frame.png`      | Optional; can draw procedurally |
| Stat bar frame     | `/images/ui/hangar/stat_bar_frame.png`          | Optional; reuse HUD bar style   |
| Upgrade slot frame | `/images/ui/hangar/upgrade_slot_frame.png`      | Optional; copper-framed         |
| Filigree corner    | `/images/ui/hud/filigree_corner.png`            | Reusable from HUD               |


**Placeholder:** Panels can be drawn via Canvas 2D (`fillRect`, `strokeRect`) until assets exist. Ship and pilot sprites already in `public/images/`.

---

## 7. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Canvas 2D:** Hangar is a distinct scene or overlay. Draw on same canvas as title/ship select or separate overlay. Use `ctx.getContext('2d')`. Draw after background; ensure no z-fighting.
- **Resolution:** Internal 1280×720; scale to viewport. Layout uses center-relative and zone-based positioning. Letterbox/pillarbox when aspect differs—hangar stays within gameplay area. Pick largest 16:9 that fits.
- **Asset loading:** Images via `new Image()`; paths like `/images/ships/sparrow/sparrow_facing_n.png`. Preload ship and pilot sprites with ShipSelect or on Hangar scene enter.
- **Input:** Hangar captures input (D-pad, stick, A, B). Prevent input from reaching other scenes. Focus management: track `focusedPanel` and `focusedIndex`; wrap on edges.
- **Gamepad polling:** Use `navigator.getGamepads()`; poll each frame. Map D-pad (axes 6/7 or buttons) and A/B. Per engine_learnings: gamepad requires polling.
- **Transition:** Fade or cut from ShipSelect to Hangar; from Hangar to Gameplay on Ready. 0.3–0.5 s transition acceptable.
- **Performance:** 60 FPS target. Hangar is lightweight—ship sprite, pilot portrait, stat bars, upgrade slots. Avoid per-frame allocations.
- **Scene state:** Hangar receives `{ shipId, pilotId }` from ShipSelect. Pass same to Gameplay on Ready. Materials/upgrades from economy design (8.A.2) when implemented.

---

## 8. Upgrade Panel Placeholders

Exact upgrade types defined in 8.A.2 (economy) and 8.A.3 (weapon/bomb). This spec defines layout only.


| Panel                    | Placeholder zones                                                  | Filled by                        |
| ------------------------ | ------------------------------------------------------------------ | -------------------------------- |
| **Stat upgrade panel**   | Slots for HP, Defense, Attack, Speed, Fire Power, Fire Speed, etc. | 8.A.2 upgrade economy design     |
| **Weapon upgrade panel** | Slots for Primary, Secondary, Bomb upgrades                        | 8.A.3 weapon/bomb upgrade design |


Layout: two panels side-by-side; grid or list of upgrade slots. Each slot shows: icon/label, current tier, cost (materials), [A] to purchase when focused.

---

## 9. Delegation (8.A.1)


| Specialist                 | Parts produced                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Visual Design**          | Full deliverable: layout (ASCII wireframe, zones, placement), flow (selection/upgrade/ready), controller navigation (D-pad, A/B, input mapping), visual feedback (focus states, propulsion glow, stat bars), visual spec (palette, dimensions, ship display), asset paths, upgrade panel placeholders, platform/engine gotchas. Per routing: Ships, UI mood, VFX → Visual Design. |
| **Design system** (canon)  | Referenced for compliance; [design_system.md](../design_system.md) menus/Hangar/Upgrade/Meta.                                                                                                                                                                                                                                                                                     |
| **Combat Systems** (canon) | Stats from [pilot_ship_stat_design_lock.md](pilot_ship_stat_design_lock.md); upgrade types deferred to 8.A.2, 8.A.3.                                                                                                                                                                                                                                                              |


---

## 10. References


| Document                                                         | Purpose                                                     |
| ---------------------------------------------------------------- | ----------------------------------------------------------- |
| [design_system.md](../design_system.md)                          | Menus (Hangar/Upgrade/Meta); ship stats; controller mapping |
| [art_style_guide.md](../art_style_guide.md)                      | Kaladesh aesthetic; copper/brass; illustrated, ornate       |
| [pilot_ship_stat_design_lock.md](pilot_ship_stat_design_lock.md) | Ship-owned vs pilot-owned stats; materials = currency       |
| [ship_selection_ui_design.md](ship_selection_ui_design.md)       | 4-ship row; copper/brass; propulsion glow; controller flow  |
| [hud_design.md](hud_design.md)                                   | Layout structure; copper/brass palette; bar spec            |
| [results_screen_design.md](results_screen_design.md)             | Button spec; controller-first; flow structure               |
| [engine_learnings.md](../dev_standards/engine_learnings.md)      | Canvas 2D, resolution, asset paths, input                   |


---

## 11. Sign-Off


| Role              | Status  | Date       |
| ----------------- | ------- | ---------- |
| **Visual Design** | Done    | 2026-03-09 |
| **CEO**           | Done    | 2026-03-09 |


---

## Gate

This document gates:

- **8.1** — Hangar scene tech: Hangar scene; ship display (selected ship model); stat display; upgrade panels per layout design; flow (select ship → upgrade → ready)

