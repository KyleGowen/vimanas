# Dragon Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.D.1**

Dragon is the **mana archetype**—high mana pool, faster mana regeneration, mana-centric weapons and meditating. This document locks stats and visuals for production. Gates 6.D.2 (primary weapon), 6.D.3 (secondary weapon), 6.D.4 (shield), 6.D.5 (sprite sheet), and 6.D.6 (Dragon entity).

---

## P0 Mocks Considered

Design locks must reference approved p0 mocks. The following inform this lock:

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Primary reference. [dragon_ship_pilot_style.png](dragon_ship_pilot_style.png) — silhouette, palette, ornate gunship, red/gold/teal. CEO approved. |
| **Player ship POC** | [player_ship_dragon_poc.md](player_ship_dragon_poc.md) | Dark red, copper, gold, brass; multiple exhausts; orange/red propulsion |
| **Boss fight (industrial)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Dragon in combat context; Conduit-Crawler pairing |

---

## 1. Stats Block

Per [design_system.md](../../../design_system.md): All 4 ships start with the same total stat points, allocated differently. Dragon is the **mana archetype**—high mana, faster regen, mana-costing primary.

| Stat | Value | Rationale |
|------|-------|-----------|
| **HP** | 18 | Slightly lower—mana focus trades durability |
| **Defense** | 16 | Lower—glass-cannon mana ship |
| **Attack** | 18 | Moderate—primary/secondary scale with attack |
| **Mana** | 28 | High—mana ship identity |
| **Speed** | 20 | Moderate—per-direction similar to Wolf |
| **Mana Regen** | 4 | Faster than Wolf (3), Turtle (3.2)—mana ship identity |
| **Total** | **100** | Same baseline as other ships |

**Per-direction speeds:** forwardSpeed 25, backwardSpeed 18, leftSpeed 32, rightSpeed 32 (same as Wolf for consistency).

---

## 2. Visual Lock

### Silhouette

- **Gunship, ornate:** Multiple weapon ports, teal energy cores, gold/copper/brass accents. Per [player_ship_dragon_poc.md](player_ship_dragon_poc.md).
- **Top-down read:** Compact fighter, multiple exhausts. Aggressive, mana-focused.
- **Size:** Same scale as Wolf/Sparrow—64×64 base, scaled for play area.

**Reference:** CEO-provided `dragon_facing_n.png` — north-facing sprite. Skip other poses per user.

### Palette

| Use | Color | Hex | Notes |
|-----|-------|-----|-------|
| Hull primary | Dark red | #8B0000 | Aggressive base |
| Hull secondary | Copper | #B87333 | Accents |
| Trim | Brass | #CD7F32 | Metallic highlights |
| Weapon glow | Teal | #00CED1 | Energy cores, crescent shots |
| **Propulsion glow** | **Orange/red** | **#FF4500** | Engine exhaust, thruster trails |

Per [art_style_guide.md](../../../art_style_guide.md): Dragon propulsion = orange/red. Hex #FF4500 for implementation. THRUSTER_PALETTES.dragon already defined.

### Thruster

- **3 thrusters:** 1 main center back, 2 wing thrusters (33% smaller than main).
- **Main:** Center X (`originXOffset` 0.5), rear (`originYOffset` ~0.74–0.79). Uses `DRAGON_THRUSTER_CONFIG`.
- **Wing thrusters:** 67% of main size (widthRatio, heightRatio × 0.67). Positioned at wing rear (originXOffset ~0.37, 0.63).
- **Palette:** Orange/red (#FF4500 core, #CC3300 mid, transparent tip).

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Asset paths:** `/images/ships/dragon/dragon_facing_n.png`
- **Single sprite:** Use `dragon_facing_n.png` for all poses (no tilt/boost sprites).

---

## 4. References

| Document | Purpose |
|----------|---------|
| [player_ship_dragon_poc.md](player_ship_dragon_poc.md) | Original POC—palette, silhouette |
| [wolf_design_lock.md](../wolf/wolf_design_lock.md) | Format reference, stats structure |
| [design_system.md](../../../design_system.md) | Ship stats, controls |
| [art_style_guide.md](../../../art_style_guide.md) | Propulsion glow, VFX |

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
- **6.D.2** — Dragon primary weapon design
- **6.D.3** — Dragon secondary weapon design
- **6.D.4** — Dragon shield design
- **6.D.5** — Dragon sprites
- **6.D.6** — Dragon entity
