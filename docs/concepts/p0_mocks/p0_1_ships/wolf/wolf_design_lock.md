# Wolf Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.W.1**

Wolf is the **neutral archetype**—balanced, versatile, no specialization. This document locks stats and visuals for production. Gates 6.W.2 (primary weapon), 6.W.3 (secondary weapon), 6.W.4 (shield), 6.W.5 (sprite sheet), and 6.W.6 (Wolf entity).

---

## P0 Mocks Considered

Design locks must reference approved p0 mocks. The following inform this lock:

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Primary reference. [wolf_ship_pilot_style.png](wolf_ship_pilot_style.png) — silhouette, palette, fighter jet form, grey/silver/brass. CEO approved 2025-03-02. |
| **Title screen** | [p0_5_title_screen](../../p0_5_title_screen/title_screen_mocks_deliverable.md) | Wolf in UI context — propulsion glow (white/silver) at distance, scale vs frame, flying pose. CEO approved 2025-03-02. |
| **Boss fight (forest)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Wolf in combat — player ship scale vs boss, foreground placement, neutral grey/silver read against forest. CEO approved 2025-03-02. |
| **Pilot mocks** | [p0_2_pilots](../../p0_2_pilots/pilot_mocks_deliverable.md) | Ships must match pilot portrait style (illustrated, Kaladesh). Ship mocks already align. |

---

## 1. Stats Block

Per [design_system.md](../../../design_system.md): All 4 ships start with the same total stat points, allocated differently. Wolf is the neutral archetype—no specialization. Contrast: Sparrow (Speed), Turtle (HP/Defense), Dragon (Attack).

| Stat | Value | Rationale |
|------|-------|-----------|
| **HP** | 20 | Moderate—balanced. Neither fragile nor tanky. |
| **Defense** | 20 | Moderate—standard hull. No armor focus, no glass cannon. |
| **Attack** | 20 | Moderate—reliable output. Not the gunship (Dragon), not the tank (Turtle). |
| **Mana** | 20 | Moderate—enough for secondary, shield, and mana weapons. |
| **Speed** | 20 | Moderate—mid-range mobility. Not Sparrow-fast, not Turtle-slow. |
| **Total** | **100** | Same baseline as Sparrow, Turtle, Dragon. |

**Combat Systems note:** Wolf is the baseline ship—every stat at 20. No trade-offs, no specialization. Reliable, versatile, threatening at a glance. Ideal for players who want a jack-of-all-trades: decent evasion, decent durability, decent damage. Other ships define themselves against Wolf: Sparrow favors Speed, Turtle HP/Defense, Dragon Attack.

---

## 2. Visual Lock

### Silhouette

- **Fighter jet, less busy:** Same fighter style as Sparrow. Clean lines. No wolf head, no animal features. Per [player_ship_wolf_poc.md](player_ship_wolf_poc.md).
- **Top-down read:** Moderate wingspan. Between Sparrow and Turtle in size. Balanced, not sleek, not heavy.
- **Size:** Mid-size. Neutral. Fits 1–4 player sprites on screen without crowding.

**Reference:** [wolf_ship_pilot_style.png](wolf_ship_pilot_style.png) — approved pilot-style mock (CEO approved 2025-03-02). See [ship_mocks_pilot_style_deliverable.md](../ship_mocks_pilot_style_deliverable.md).

### Palette

| Use | Color | Hex | Notes |
|-----|-------|-----|-------|
| Hull primary | Grey | #808080 | Neutral base |
| Hull secondary | Silver | #C0C0C0 | Accents, panels |
| Trim | Brass | #CD7F32 | Metallic highlights |
| Accent | Copper | #B87333 | Warm metallic accents |
| Interior | Dark grey | #4A4A4A | Cockpit, depth |
| Highlight | Light silver | #E0E0E0 | Edge highlights |
| Shadow | Dark grey | #3A3A3A | Depth, underside |
| **Propulsion glow** | **White/silver** | **#E8E8E8** | Engine exhaust, thruster trails, luminous accents |

Per [art_style_guide.md](../../../art_style_guide.md): Wolf propulsion glow = white/silver (neutral, balanced). Hex #E8E8E8 for implementation.

### Vimana Language

- **Balanced, versatile:** Clean fighter silhouette. Ornate panels without overload. Copper, brass, gold accents.
- **Ornate mechanical:** Filigree, flowing lines. Beauty alongside functionality. Moderate detail—not minimal, not heavy.
- **Detail:** Moderate exhaust. Reliable, threatening read. Inventor craft with versatile presence.
- **Kaladesh pillar:** Gilded, Indian fantasy—NOT Victorian steampunk.

### Thruster

- **Single exhaust at center back:** Per CEO—Wolf thrust = single thrust at center back. No side thrusters (unlike Turtle's 3 thrusters).
- **Position:** Center X (`originXOffset` 0.5), rear (`originYOffset` ~0.74–0.84 to match Sparrow/Turtle). Implementation uses `WOLF_THRUSTER_CONFIG` in `src/effects/thruster-effect.ts`.
- **Palette:** White/silver (#E8E8E8 core, #B0B0B0 mid, transparent tip). Per [art_style_guide.md](../../../art_style_guide.md) propulsion glow—neutral, balanced.
- **Identity:** Single-exhaust fighter. Clean, focused propulsion read. Versatile baseline—not multi-nozzle (Turtle), not aether-cyan (Sparrow).

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Asset paths:** Images in `public/` are at root: `/images/ships/wolf/wolf_*.png`. Use same path convention as Sparrow (`/images/ships/sparrow/`) and Turtle (`/images/ships/turtle/`).
- **Loading:** Use `new Image()`; set `src`; await `onload`. Same-origin when served by Vite.
- **Individual sprites:** Per [sparrow_sprite_sheet_spec.md](../sparrow/sparrow_sprite_sheet_spec.md) pose list — same pose set (flying, bank L/R, boost, idle, firing, damage, hit flash); individual PNG files, 256×256. Wolf sprites (6.W.5) in `public/images/ships/wolf/`.

---

## 4. References

| Document | Purpose |
|----------|---------|
| [player_ship_wolf_poc.md](player_ship_wolf_poc.md) | Original POC—palette, silhouette, design intent |
| [ship_mocks_pilot_style_deliverable.md](../ship_mocks_pilot_style_deliverable.md) | Approved pilot-style mocks—canonical ship art |
| [wolf_ship_pilot_style.png](wolf_ship_pilot_style.png) | Visual reference—fighter jet, grey/silver/brass, Kaladesh |
| [design_system.md](../../../design_system.md) | Ship stats, controls, viewport |
| [art_style_guide.md](../../../art_style_guide.md) | Kaladesh pillar, propulsion glow, sophistication |
| [basic_gun_design_lock.md](../../../basic_gun_design_lock.md) | Damage formula baseline; Wolf weapons will extend |

---

## 5. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-07 |
| **Visual Design** | Approved | 2026-03-07 |
| **CEO** | Pending | — |

---

## Gate

This document gates:
- **6.W.2** — Wolf primary weapon design
- **6.W.3** — Wolf secondary weapon design
- **6.W.4** — Wolf shield design
- **6.W.5** — Wolf individual sprites (poses, palette, propulsion glow)
- **6.W.6** — Wolf entity (stats, visuals, weapons, shield)
