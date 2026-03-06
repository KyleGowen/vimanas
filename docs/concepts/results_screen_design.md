# Results Screen Design Lock

**Visual Design · Phase 5.A.3**

Results screen layout and flow for level complete. Locks victory/defeat states, Retry/Continue flow, and design system compliance. Gates 5.A.4 (Results assets) and 5.2 (Results screen tech).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Title screen** | [p0_5_title_screen/title_screen_mocks_deliverable.md](p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md) | Copper/brass framing, period-appropriate typography. Warm metallics (#B5A642, #B87333). UI mood: illustrated, ornate, inventor-fair. |
| **Boss mocks** | [p0_4_boss/boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Level complete transition. Boss defeat → Results. Visual continuity: same copper/brass language. |
| **Level mocks** | [p0_3_levels/level_mocks_deliverable.md](p0_mocks/p0_3_levels/level_mocks_deliverable.md) | Results screen may use subtle level-appropriate background (forest, industrial, sky) or neutral overlay. |

**Note:** No dedicated results screen P0 mock exists. Design follows title screen and boss mock visual language; layout is net-new.

---

## 1. Flow

### 1.1 Trigger

Per [boss_placeholder_design.md](boss_placeholder_design.md) and [design_system.md](../design_system.md):

| Trigger | Action |
|---------|--------|
| **Boss defeat (HP → 0)** | Brief victory moment (0.5–1 s) → transition to Results screen |
| **Player defeat (all lives lost)** | Defeat state → transition to Results screen |
| **Level complete (no boss yet)** | Victory → Results screen |

**Phase 5 scope:** Boss defeat and player defeat are the primary triggers. Level complete without boss is edge case (e.g. wave-only level).

### 1.2 Retry / Continue Flow

| Action | Result |
|--------|--------|
| **Retry** | Reload current level. Restart from wave 1 (or level start). |
| **Continue** | Proceed to next level. If no next level, return to menu (or ship select in Phase 6). |
| **Menu** (optional) | Return to title/main menu. |

**Controller-first:** Retry (A) and Continue (B or X) mapped for gamepad. Keyboard: Enter = primary (Continue when available), R = Retry.

**Default focus:** Continue when victory; Retry when defeat. Highlight/focus follows selection.

---

## 2. Layout

### 2.1 Victory State

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    [Background: dimmed configurable level]              │
│                                                                         │
│                         LEVEL COMPLETE                                  │
│                    (or "VICTORY" / level name)                          │
│                                                                         │
│                         Score: 12,340                                   │
│                         Lives: 2 ♥♥                                     │
│                                                                         │
│              ┌─────────────────┐  ┌─────────────────┐                   │
│              │    CONTINUE     │  │     RETRY       │                   │
│              └─────────────────┘  └─────────────────┘                   │
│                                                                         │
│                    [filigree framing]                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Defeat State

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    [Background: dimmed  ]                               │
│                                                                         │
│                         DEFEAT                                          │
│                    (or "MISSION FAILED")                                │
│                                                                         │
│                         Score: 8,720                                    │
│                         Lives: 0 ♥                                      │
│                                                                         │
│              ┌─────────────────┐  ┌─────────────────┐                   │
│              │     RETRY       │  │     MENU        │                   │
│              └─────────────────┘  └─────────────────┘                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Defeat:** No Continue (level not complete). Retry and Menu only.

### 2.3 Layout Zones (1280×720)

| Element | Position | Notes |
|---------|----------|-------|
| **Title** | Center, y: 180–220 | "LEVEL COMPLETE" or "DEFEAT" |
| **Score** | Center, y: 280–320 | "Score: 12,340" |
| **Lives** | Center, y: 340–380 | "Lives: 2 ♥♥" (or "0" when defeat) |
| **Buttons** | Center, y: 420–480 | Retry, Continue (or Menu); side-by-side or stacked |
| **Background** | Full screen | Dimmed gameplay (0.5–0.7 opacity) or gradient overlay |

**Safe zone:** 48 px inset. Center content; buttons readable at 1080p.

---

## 3. Visual Spec

### 3.1 Style (Per Art Style Guide)

- **Aesthetic:** Illustrated, ornate, inventor-fair. Aether accents, filigree framing.
- **Design system compliance:** Per [design_system.md](../design_system.md): Results screen is a canonical UI component. Matches HUD and title screen tone.
- **Functional first:** Buttons legible; selection state clear.

### 3.2 Palette

| Use | Color | Hex | Notes |
|-----|-------|-----|-------|
| Victory title | Brass / gold | #B5A642 | Warm, celebratory |
| Defeat title | Muted copper | #8B6914 | Sober; not grim |
| Frame / trim | Copper | #B87333 | Consistent with HUD |
| Button default | Dark brown | #3d2914 | Filled; copper border |
| Button highlight | Aether blue | #4A90D9 | Selected state |
| Text | Warm white | #F5F0E6 | Legible |
| Background overlay | Black 50–70% | rgba(0,0,0,0.5–0.7) | Dim gameplay |

### 3.3 Buttons

| Property | Value | Rationale |
|----------|-------|------------|
| **Size** | 160–200 px wide × 40–48 px tall | Controller-friendly; thumb reach |
| **Spacing** | 24–32 px between buttons | Clear separation |
| **Frame** | 2–3 px copper border | Matches HUD |
| **Highlight** | Aether blue (#4A90D9) border or glow | Selected state |
| **Typography** | All caps, 18–20 px | Legible |

### 3.4 Typography Intent

- **Title:** Large, bold. "LEVEL COMPLETE" or "DEFEAT". Period-appropriate; copper/brass treatment.
- **Score / Lives:** Smaller; secondary info. Legible at 1080p.
- **Buttons:** Clear labels; no ambiguity.

---

## 4. States Summary

| State | Title | Buttons | Notes |
|-------|-------|---------|-------|
| **Victory** | LEVEL COMPLETE | Continue, Retry | Continue = primary (default focus) |
| **Defeat** | DEFEAT | Retry, Menu | Retry = primary (default focus) |

**Phase 5:** Continue may go to "next level" or "menu" if only one level exists. Menu returns to title screen.

---

## 5. Asset Paths

Per [engine_learnings.md](../dev_standards/engine_learnings.md): Assets in `public/`; paths from root.

| Asset | Path | Notes |
|-------|------|-------|
| Results background | `/images/ui/results/results_bg.png` | Optional; gradient overlay can be procedural |
| Button frame | `/images/ui/results/button_frame.png` | Copper-framed; reusable |
| Filigree overlay | `/images/ui/results/filigree_overlay.png` | Decorative; optional |

**Placeholder:** Full layout can be drawn via Canvas 2D until assets exist. No external assets required for MVP.

---

## 6. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Canvas 2D:** Results screen is a distinct scene or overlay. Draw on same canvas or separate overlay. Ensure no gameplay draw calls during Results.
- **Resolution:** Internal 1280×720; scale to viewport. Layout uses center-relative positioning. Letterbox/pillarbox—Results stays within gameplay area.
- **Input:** Results screen captures input (Enter, A, B, R). Prevent input from reaching gameplay. Focus management for controller.
- **Transition:** 0.5–1 s fade or cut from Gameplay to Results. No abrupt flash.
- **Asset loading:** Results assets can be preloaded with HUD or loaded on demand. Paths from `public/` (e.g. `/images/ui/results/button_frame.png`).
- **Performance:** Results screen is static; minimal draw calls. 60 FPS not critical for Results but maintain smooth transition.

---

## 7. References

| Document | Purpose |
|----------|---------|
| [design_system.md](../design_system.md) | Results screen as UI component; level structure |
| [art_style_guide.md](../art_style_guide.md) | UI style: illustrated, ornate, aether accents |
| [boss_placeholder_design.md](boss_placeholder_design.md) | Boss defeat → Results flow |
| [title_screen_mocks_deliverable.md](p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md) | Copper/brass framing; UI mood |

---

## 8. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Visual Design** | Approved | 2026-03-06 |
| **Level/Encounter** | Pending | — |
| **CEO** | Approved | 2026-03-06 |

---

## Gate

This document gates:
- **5.A.4** — Results screen assets (background, buttons, filigree)
- **5.2** — Results screen (level complete → Retry/Continue)
