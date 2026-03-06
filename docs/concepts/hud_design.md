# Combat HUD Design Lock

**Visual Design · Phase 5.A.1**

Combat HUD layout and visual spec for gameplay. Locks HP bar, mana bar, score, lives; aether accents and filigree framing per [art_style_guide.md](../art_style_guide.md). Gates 5.A.2 (HUD assets) and 5.1 (Combat HUD tech).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Title screen** | [p0_5_title_screen/title_screen_mocks_deliverable.md](p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md) | Copper/brass framing, period-appropriate typography. PRESS START treatment; warm metallics (#B5A642, #B87333). UI mood: illustrated, ornate. |
| **Level mocks** | [p0_3_levels/level_mocks_deliverable.md](p0_mocks/p0_3_levels/level_mocks_deliverable.md) | HUD must read against forest (greens), industrial (grays/copper), sky (blues). Contrast and legibility across all three level palettes. |
| **Boss mocks** | [p0_4_boss/boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Boss UI at top: name label, copper-framed health bar, score/lives. CEO approved 2025-03-02. Establishes top-bar layout and copper frame language. |
| **Boss placeholder** | [boss_placeholder_design.md](boss_placeholder_design.md) | Boss name + health bar placement; score/lives at top-right; copper frame spec. |

---

## 1. Layout Zones

**Base resolution:** 1280×720 (internal). Scale to viewport; legible at 1080p (1920×1080). Per [engine_learnings.md](../dev_standards/engine_learnings.md): dynamic 16:9; pick largest that fits.

### 1.1 Combat HUD (No Boss)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Score]                                    [Lives: ♥♥♥]                │  ← Top bar: 48–56 px height
│                                                                         │
│                                                                         │
│                         PLAY AREA                                       │
│                                                                         │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐                               │
│  │ HP  ████████░░░░ │  │ Mana ██████░░░░ │                              │  ← Bottom-left: 48–56 px height
│  └─────────────────┘  └─────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────┘
```

| Zone | Position (1280×720) | Content | Notes |
|------|---------------------|---------|-------|
| **Top-left** | x: 20–24, y: 12–16 | Score | 6–8 digit display; left-aligned |
| **Top-right** | x: 1240–1260, y: 12–16 | Lives | Lives icons; right-aligned |
| **Bottom-left** | x: 20–24, y: 656–664 | HP bar | Full width ~200–240 px; height 16–20 px |
| **Bottom-left** | x: 20–24, y: 680–688 | Mana bar | Same dimensions as HP; stacked below |

**Safe zone:** 24 px inset from edges. HUD elements do not overlap critical play area (center 70% of screen).

### 1.2 Boss Phase (Boss Active)

When boss is active, the top bar expands:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  BOSS: ROOT-SEEKER                    [Score]  [Lives: ♥♥♥]             │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │    │  ← Copper-framed health bar
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│                         PLAY AREA                                       │
│                                                                         │
│  [HP bar]  [Mana bar]                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Element | Position | Notes |
|---------|----------|-------|
| **Boss name** | Top-left, x: 20, y: 12 | "BOSS: ROOT-SEEKER" or "BOSS: CONDUIT-CRAWLER" |
| **Boss health bar** | Below name; full width minus margins | Copper frame; fill depletes on damage |
| **Score / Lives** | Top-right | Unchanged from combat HUD |
| **Player HP / Mana** | Bottom-left | Unchanged |

Per [boss_placeholder_design.md](boss_placeholder_design.md): Boss UI at top; player HUD (HP, mana) remains at bottom-left.

---

## 2. Visual Spec

### 2.1 Style (Per Art Style Guide)

- **Aesthetic:** Illustrated, ornate, inventor-fair. Aether accents, filigree framing.
- **Functional first, but not plain.** Health bars, score, lives—all legible and visually integrated.
- **Thematic integration:** Textured backgrounds, subtle ancient script overlays, lore-integrated framing. See `sophisticated_ref_6.png`, `sophisticated_ref_7.png` for side panels with script and textured HUD.

### 2.2 Palette

| Use | Color | Hex | Notes |
|-----|-------|-----|-------|
| Frame / trim | Copper | #B87333 | Primary metallic accent |
| Frame highlight | Brass / gold | #B5A642 | Warm metallic; filigree |
| HP fill | Warm red / crimson | #C41E3A | Readable; distinct from mana |
| HP background | Dark brown | #3d2914 | Depleted portion |
| Mana fill | Aether blue | #4A90D9 | Energy; matches ship propulsion family |
| Mana background | Dark slate | #2C3E50 | Depleted portion |
| Score / lives text | Warm white | #F5F0E6 | Legible on dark frame |
| Boss bar frame | Copper | #B87333 | Per boss mocks |

### 2.3 HP Bar

| Property | Value | Rationale |
|----------|-------|------------|
| **Width** | 200–240 px | Readable at 1080p; not dominant |
| **Height** | 16–20 px | Compact; stacked with mana |
| **Fill** | Left-to-right | Depletes leftward or rightward (consistent) |
| **Frame** | 2–3 px copper border | Ornate; filigree corners optional |
| **Corner radius** | 4 px | Soft edge; not sharp |

**Data binding:** HP bar fill = `currentHP / maxHP`. Sparrow max HP = 14 (per [sparrow_design_lock.md](p0_mocks/p0_1_ships/sparrow/sparrow_design_lock.md)).

### 2.4 Mana Bar

| Property | Value | Rationale |
|----------|-------|------------|
| **Dimensions** | Same as HP bar | Visual consistency |
| **Fill color** | Aether blue (#4A90D9) | Energy; distinct from HP |
| **Placeholder behavior** | Show full bar if mana system not yet implemented | Phase 5: mana may be placeholder |

**Data binding:** Mana bar fill = `currentMana / maxMana`. Sparrow max Mana = 19.

### 2.5 Score

| Property | Value | Rationale |
|----------|-------|------------|
| **Format** | 6–8 digits, right-padded zeros  | "00001234"  |
| **Typography intent** | Legible, period-appropriate; copper/brass tone | TBD per design_system typography rules |
| **Min font size** | 18–20 px at 1280×720 | Legible at 1080p |
| **Position** | Top-left, or left of lives | Per boss mocks: score + lives at top |

### 2.6 Lives

| Property | Value | Rationale |
|----------|-------|------------|
| **Display** | Heart icons or ship silhouettes | 1–4 (or more); compact |
| **Icon size** | 20–24 px | Readable; not dominant |
| **Position** | Top-right | Per boss mocks |

### 2.7 Boss Health Bar

| Property | Value | Rationale |
|----------|-------|------------|
| **Frame** | Copper (#B87333), 2–3 px | Per boss mocks; distinct from player bars |
| **Width** | ~80% of top bar width | Centered; leaves margin |
| **Height** | 20–24 px | Readable; prominent |
| **Fill** | Depletes on damage | Same formula as HP bar |

---

## 3. Typography Intent

Per [design_system.md](../design_system.md): Typography Rules TBD. Until established:

- **Score / lives:** Sans-serif or period-appropriate display; high contrast. Avoid thin weights.
- **Boss name:** Slightly larger; copper/brass treatment; all caps optional.
- **Legibility:** Minimum 18 px at 1280×720; scale proportionally for 1080p.

---

## 4. Asset Paths

Per [engine_learnings.md](../dev_standards/engine_learnings.md): Assets in `public/`; paths from root.

| Asset | Path | Notes |
|-------|------|-------|
| HP bar frame | `/images/ui/hud/hp_bar_frame.png` | Optional; can be drawn procedurally |
| Mana bar frame | `/images/ui/hud/mana_bar_frame.png` | Optional |
| Lives icon | `/images/ui/hud/life_icon.png` | Heart or ship silhouette |
| Boss bar frame | `/images/ui/hud/boss_bar_frame.png` | Copper-framed; optional |
| Filigree corner | `/images/ui/hud/filigree_corner.png` | Decorative; reusable |

**Placeholder:** Bars can be drawn via Canvas 2D (`fillRect`, `strokeRect`) until assets exist. Colors from palette above.

---

## 5. Platform / Engine Gotchas

Per [engine_learnings.md](../dev_standards/engine_learnings.md):

- **Canvas 2D:** Use `ctx.getContext('2d')` for HUD. Draw after gameplay layer; or use overlay canvas.
- **Resolution:** Internal 1280×720; scale to viewport. HUD positions use internal coordinates. Letterbox/pillarbox when aspect differs—HUD must stay within gameplay area.
- **Asset loading:** Images via `new Image()`; paths like `/images/ui/hud/hp_bar_frame.png`. Preload with critical assets.
- **Performance:** 60 FPS target. HUD is lightweight—few draw calls per frame. Avoid per-frame allocations.
- **Overlay vs canvas:** HUD can be drawn on same canvas as gameplay (top layer) or separate overlay. Ensure no z-fighting with projectiles/ships.
- **Delta time:** HP/mana bar updates are data-driven; no animation delta needed for fill. Optional: smooth fill interpolation uses delta.

---

## 6. References

| Document | Purpose |
|----------|---------|
| [design_system.md](../design_system.md) | HUD components: ship stats, HP, mana, weapons |
| [art_style_guide.md](../art_style_guide.md) | UI style: illustrated, ornate, aether accents, filigree |
| [boss_placeholder_design.md](boss_placeholder_design.md) | Boss HP bar placement, copper frame |
| [boss_mocks_deliverable.md](p0_mocks/p0_4_boss/boss_mocks_deliverable.md) | Boss UI layout; score/lives |
| [references/README.md](../references/README.md) | sophisticated_ref_6, 7 — thematic UI, textured HUD |

---

## 7. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Visual Design** | Approved | 2026-03-06 |
| **Combat Systems** | Pending | — |
| **CEO** | Approved | 2026-03-06 |

---

## Gate

This document gates:
- **5.A.2** — HUD assets (frames, icons, filigree)
- **5.1** — Combat HUD (HP, mana, score, lives visible; bound to player)
