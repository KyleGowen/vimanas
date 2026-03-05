# Sparrow Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 2.A.1**

Sparrow is the **fast archetype**—sleek, nimble, bird-inspired. This document locks stats and visuals for production. Gates 2.A.2 (sprite sheet) and 2.1 (Sparrow entity).

---

## P0 Mocks Considered

Design locks must reference approved p0 mocks. The following inform this lock:

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Primary reference. [sparrow_ship_pilot_style.png](sparrow_ship_pilot_style.png) — silhouette, palette, filigree, aether glow. CEO approved 2025-03-02. |
| **Title screen** | [p0_5_title_screen](../../p0_5_title_screen/title_screen_mocks_deliverable.md) | Sparrow in UI context. [title_screen_mock_sparrow.png](../../p0_5_title_screen/title_screen_mock_sparrow.png) — propulsion glow (#00FFFF) at distance, scale vs frame, flying-right pose. CEO approved 2025-03-02. |
| **Boss fight (forest)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Sparrow in combat. [boss_mock_1_forest.png](../../p0_4_boss/boss_mock_1_forest.png) — player ship scale vs boss, foreground placement, cyan/cobalt read against forest. CEO approved 2025-03-02. |
| **Pilot mocks** | [p0_2_pilots](../../p0_2_pilots/pilot_mocks_deliverable.md) | Ships must match pilot portrait style (illustrated, Kaladesh). Ship mocks already align. |

---

## 1. Stats Block

Per [design_system.md](../../../design_system.md): All 4 ships start with the same total stat points, allocated differently. Sparrow trades durability for mobility.

| Stat | Value | Rationale |
|------|-------|------------|
| **HP** | 14 | Low—fast ships are fragile. Evasion over tanking. |
| **Defense** | 12 | Low—light hull, minimal armor. Speed is the defense. |
| **Attack** | 20 | Moderate—standard weapon output. Not the gunship. |
| **Mana** | 19 | Moderate—enough for mana weapons and bombs. |
| **Speed** | 35 | **High**—primary identity. Fastest of the four. |
| **Total** | **100** | Same baseline as Turtle, Wolf, Dragon. |

**Combat Systems note:** Speed 35 establishes Sparrow as the mobility king. Lower HP/Defense (14/12) means Sparrow rewards positioning and evasion—Star Fox 64 feel: acceleration, deceleration, and dodging are the core loop. Other ships balance against this: Turtle will favor HP/Defense, Dragon Attack, Wolf balanced.

---

## 2. Visual Lock

### Silhouette

- **Bird-inspired:** Tapered nose, swept wings, compact body. Sparrow in flight—compact, aerodynamic, purposeful.
- **Top-down read:** Narrow arrowhead with wing extensions. Nose points forward; tail tapers. No ambiguity about facing.
- **Size:** Smallest of the four ships. Suggests agility. Fits 1–4 player sprites on screen without crowding.

**Reference:** [sparrow_ship_pilot_style.png](sparrow_ship_pilot_style.png) — approved pilot-style mock (CEO approved 2025-03-02). See [ship_mocks_pilot_style_deliverable.md](../ship_mocks_pilot_style_deliverable.md).

### Palette

| Use | Color | Hex | Notes |
|-----|-------|-----|-------|
| Hull primary | Cobalt | #0047AB | Cool blue, readable |
| Hull secondary | Cyan | #00BFFF | Accents, wing edges |
| Trim | Silver | #C0C0C0 | Metallic highlights |
| Interior | Dark blue | #001F3F | Cockpit, depth |
| Highlight | Pale blue | #87CEEB | Edge highlights |
| Shadow | Navy | #000080 | Depth, underside |
| **Propulsion glow** | **Cyan** | **#00FFFF** | Engine exhaust, thruster trails, luminous accents |

Per [art_style_guide.md](../../../art_style_guide.md): Sparrow propulsion glow = #00FFFF (aether glow, sleek, cool).

### Vimana Language

- **Organic curves:** Bird-like silhouette; sleek, aerodynamic.
- **Ornate mechanical:** Filigree, flowing lines. Beauty alongside functionality.
- **Detail:** Single exhaust with aether glow. Copper, gold, or brass accents. Inventor craft, elegant design.
- **Kaladesh pillar:** Gilded, Indian fantasy—NOT Victorian steampunk.

---

## 3. References

| Document | Purpose |
|----------|---------|
| [player_ship_sparrow_poc.md](player_ship_sparrow_poc.md) | Original POC—palette, silhouette, design intent |
| [ship_mocks_pilot_style_deliverable.md](../ship_mocks_pilot_style_deliverable.md) | Approved pilot-style mocks—canonical ship art |
| [sparrow_ship_pilot_style.png](sparrow_ship_pilot_style.png) | Visual reference—bird-inspired, cobalt/cyan, Kaladesh |
| [sparrow_sprite_sheet_spec.md](sparrow_sprite_sheet_spec.md) | Sprite sheet spec—poses, layout, prompts |
| [design_system.md](../../../design_system.md) | Ship stats, controls, viewport |
| [art_style_guide.md](../../../art_style_guide.md) | Kaladesh pillar, propulsion glow, sophistication |

---

## 4. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2025-03-03 |
| **Visual Design** | Approved | 2025-03-03 |
| **CEO** | Approved | 2025-03-03 |

---

## Gate

This document gates:
- **2.A.2** — Sparrow sprite sheet (poses, palette, propulsion glow)
- **2.1** — Sparrow entity (stats, visuals, behavior)
