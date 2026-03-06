# Turtle Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.T.1**

Turtle is the **tank archetype**—heavy, durable, armored. This document locks stats and visuals for production. Gates 6.T.2 (primary weapon), 6.T.3 (secondary weapon), 6.T.4 (shield), 6.T.5 (sprite sheet), and 6.T.6 (Turtle entity).

---

## P0 Mocks Considered

Design locks must reference approved p0 mocks. The following inform this lock:

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Primary reference. [turtle_ship_pilot_style.png](turtle_ship_pilot_style.png) — silhouette, palette, thick hull, armored read. CEO approved 2025-03-02. |
| **Title screen** | [p0_5_title_screen](../../p0_5_title_screen/title_screen_mocks_deliverable.md) | Turtle in UI context — propulsion glow (#FFBF00) at distance, scale vs frame, flying pose. CEO approved 2025-03-02. |
| **Boss fight (forest)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Turtle in combat — player ship scale vs boss, foreground placement, earth brown/amber read against forest. CEO approved 2025-03-02. |
| **Pilot mocks** | [p0_2_pilots](../../p0_2_pilots/pilot_mocks_deliverable.md) | Ships must match pilot portrait style (illustrated, Kaladesh). Ship mocks already align. |

---

## 1. Stats Block

Per [design_system.md](../../../design_system.md): All 4 ships start with the same total stat points, allocated differently. Turtle trades mobility for durability.

| Stat | Value | Rationale |
|------|-------|------------|
| **HP** | 26 | **High**—tank identity. Absorb damage; positioning less critical than Sparrow. |
| **Defense** | 24 | **High**—armored hull. Damage reduction is primary defense. |
| **Attack** | 14 | Moderate-low—not the gunship. Reliable output, not burst. |
| **Mana** | 20 | Moderate-high—enough for secondary, shield, and mana weapons. |
| **Speed** | 16 | **Low**—primary trade-off. Slowest of the four. Deliberate movement. |
| **Total** | **100** | Same baseline as Sparrow, Wolf, Dragon. |

**Combat Systems note:** Speed 16 establishes Turtle as the tank. High HP/Defense (26/24) means Turtle rewards holding position and absorbing hits—tank-and-spank feel. Evasion is secondary; shield and armor carry. Other ships balance against this: Sparrow favors Speed, Dragon Attack, Wolf balanced.

---

## 2. Visual Lock

### Silhouette

- **Spaceship, thicker:** Same fighter style as Sparrow. Heavier hull. No shell, no animal features. Per [player_ship_turtle_poc.md](player_ship_turtle_poc.md).
- **Top-down read:** Thicker, less aerodynamic than Sparrow. Heavy. Armored plates read at a glance.
- **Size:** Slightly larger than Sparrow. Suggests durability. Fits 1–4 player sprites on screen without crowding.

**Reference:** [turtle_ship_pilot_style.png](turtle_ship_pilot_style.png) — approved pilot-style mock (CEO approved 2025-03-02). See [ship_mocks_pilot_style_deliverable.md](../ship_mocks_pilot_style_deliverable.md).

### Palette

| Use | Color | Hex | Notes |
|-----|-------|-----|-------|
| Hull primary | Earth brown | #4A3728 | Heavy, grounded |
| Hull secondary | Copper | #B87333 | Accents, plates |
| Trim | Brass | #CD7F32 | Metallic highlights |
| Interior | Dark brown | #3D2914 | Cockpit, depth |
| Highlight | Amber | #FFBF00 | Edge highlights, aether accents |
| Shadow | Dark brown | #2A1810 | Depth, underside |
| **Propulsion glow** | **Amber/gold** | **#FFBF00** | Engine exhaust, thruster trails, luminous accents |

Per [art_style_guide.md](../../../art_style_guide.md): Turtle propulsion glow = #FFBF00 (amber/gold, warm, earthy, slower exhaust).

### Vimana Language

- **Heavy, armored:** Thick hull, fortress-like presence. Ornate mechanical.
- **Ornate mechanical:** Filigree, gears, ornate geometric patterns. Beauty alongside functionality.
- **Detail:** Heavier ornamentation than Sparrow. Slower, subtler exhaust. Copper, brass, gold accents. Inventor craft with durable presence.
- **Kaladesh pillar:** Gilded, Indian fantasy—NOT Victorian steampunk.

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Asset paths:** Images in `public/` are at root: `/images/ships/turtle/turtle_*.png`. Use same path convention as Sparrow (`/images/ships/sparrow/`).
- **Loading:** Use `new Image()`; set `src`; await `onload`. Same-origin when served by Vite.
- **Individual sprites:** Per [sparrow_sprite_sheet_spec.md](../sparrow/sparrow_sprite_sheet_spec.md) pose list — same pose set (flying, bank L/R, boost, idle, firing, damage, hit flash); individual PNG files, 256×256. Turtle sprites (6.T.5) in `public/images/ships/turtle/`.

---

## 4. References

| Document | Purpose |
|----------|---------|
| [player_ship_turtle_poc.md](player_ship_turtle_poc.md) | Original POC—palette, silhouette, design intent |
| [ship_mocks_pilot_style_deliverable.md](../ship_mocks_pilot_style_deliverable.md) | Approved pilot-style mocks—canonical ship art |
| [turtle_ship_pilot_style.png](turtle_ship_pilot_style.png) | Visual reference—heavy, earth brown/copper/brass, Kaladesh |
| [design_system.md](../../../design_system.md) | Ship stats, controls, viewport |
| [art_style_guide.md](../../../art_style_guide.md) | Kaladesh pillar, propulsion glow, sophistication |
| [basic_gun_design_lock.md](../../../basic_gun_design_lock.md) | Damage formula baseline; Turtle weapons will extend |

---

## 5. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-06 |
| **Visual Design** | Approved | 2026-03-06 |
| **CEO** | Approved | 2026-03-06 |

---

## Gate

This document gates:
- **6.T.2** — Turtle primary weapon design
- **6.T.3** — Turtle secondary weapon design
- **6.T.4** — Turtle shield design
- **6.T.5** — Turtle individual sprites (poses, palette, propulsion glow)
- **6.T.6** — Turtle entity (stats, visuals, weapons, shield)
