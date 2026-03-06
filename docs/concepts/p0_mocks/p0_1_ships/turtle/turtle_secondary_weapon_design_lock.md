# Turtle Secondary Weapon Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.T.3**

Turtle secondary weapon—**spread shot**: 8 round projectiles fired in all directions. Tank-appropriate area denial. Locks fire pattern, damage, mana cost, cooldown, and VFX. Gates 6.T.6 (Turtle entity + weapons).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Turtle propulsion #FFBF00; spread projectiles align with ship energy signature |
| **Boss fight (forest)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Player in combat; projectiles must read against forest background |
| **Turtle design lock** | [turtle_design_lock.md](turtle_design_lock.md) | Attack 14, Mana 20; tank archetype; amber/gold propulsion |
| **Turtle primary weapon** | [turtle_primary_weapon_design_lock.md](turtle_primary_weapon_design_lock.md) | Arc shot; secondary is distinct (traveling projectiles vs static arc) |

---

## 1. Combat Systems

### Damage Formula

Per [basic_gun_design_lock.md](../../../basic_gun_design_lock.md): `weaponStrength = Attack × 0.25`. Turtle (Attack 14) = **3.5** baseline.

**Turtle secondary modifier:** Each spread projectile deals **50%** of weaponStrength. `turtleSpreadDamage = weaponStrength(Attack) × 0.5` → **1.75** (round to **2** for implementation).

- **Rationale:** 8 shots × 2 damage = 16 total if all hit one target (rare). Typical: 2–3 shots hit a single enemy → 4–6 damage per use. Situational burst; area denial for swarms.

### Fire Pattern — Spread Shot

- **Spread shot:** 8 round projectiles fired simultaneously in all directions.
- **Angles:** Start at **0° (North)**, then every **45°** around the circle.
  - 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
- **Origin:** Ship center.
- **Projectile count:** **8** (fixed).
- **Mana cost:** **5** — consumes mana; not spammable.
- **Cooldown:** **1.5 s** — deliberate; tank feel.

### Projectile Behavior

| Property | Value | Rationale |
|----------|-------|-----------|
| **Speed** | 180 px/s | Slower than Sparrow (240 px/s); tank projectiles feel heavier |
| **Lifetime** | 1.5 s | Range ~270 px; enough for area denial, not screen-spanning |
| **Shape** | Round (circular) | Distinct from Sparrow's elongated shots; "round projectiles" per spec |

### Distinct from Primary

| Aspect | Primary (Arc) | Secondary (Spread) |
|--------|---------------|---------------------|
| **Type** | Static curved beam | Traveling projectiles |
| **Direction** | Forward only | All 8 directions |
| **Mana** | 0 | 5 |
| **Cooldown** | 0.25 s | 1.5 s |
| **Use case** | Sustained forward DPS | Burst, area denial, swarm clear |

---

## 2. Visual Design

**Canon:** [art_style_guide.md](../../../art_style_guide.md) — VFX Language, Ship Propulsion Glow Colors. Turtle propulsion glow = #FFBF00 (amber/gold).

Per art_style_guide: *"Energy blasts and projectiles: clear, readable, impactful. Bright cores and trails."*

### 2.1 Projectile VFX

| Property | Value | Rationale |
|----------|-------|-----------|
| **Color** | Amber/gold | #FFBF00 |
| **Shape** | Round (circular) | Distinct from Sparrow; "round projectiles" per spec |
| **Size** | 10–12 px diameter | Readable at combat distance; slightly larger than Sparrow (8–12 px) for "heavy" feel |
| **Intensity** | Full saturation at core | Bright; clear read |
| **Trail** | Short, 40–60% opacity | Lightweight; pool-friendly |

**Rationale:** Turtle uses #FFBF00 for propulsion. Spread projectiles share that aether energy signature. Amber contrasts with forest and industrial. Distinct from Sparrow (cyan) and enemy (orange/amber).

### 2.2 Readability

- **Contrast:** Amber reads against forest (green) and industrial (gray/brown).
- **Enemy differentiation:** Turtle spread = gold-tinted amber; distinguishable in co-op.
- **8-way burst:** Visual "starburst" on fire; reads as area denial.

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Projectile pooling:** Reuse existing PlayerProjectile pool or extend. 8 projectiles per fire; pool must support Turtle + other ships. Burst of 8 is one-time per 1.5 s.
- **Angle math:** 0° = North (negative Y in screen coords). Angles increase clockwise: 0°, 45°, 90°, … 315°.
- **Coordinate system:** Projectiles use world Y (like existing projectiles); draw at screen Y for parallax.

---

## 4. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `TURTLE_SECONDARY_COOLDOWN_S` | 1.5 | Cooldown between uses |
| `TURTLE_SECONDARY_MANA_COST` | 5 | Mana consumed per use |
| `TURTLE_SECONDARY_PROJECTILE_COUNT` | 8 | Fixed |
| `TURTLE_SECONDARY_ANGLES_DEG` | [0, 45, 90, 135, 180, 225, 270, 315] | Degrees from North |
| `TURTLE_SECONDARY_PROJECTILE_SPEED_PX_S` | 180 | Slower than Sparrow |
| `TURTLE_SECONDARY_PROJECTILE_LIFETIME_S` | 1.5 | Range ~270 px |
| `TURTLE_SECONDARY_DAMAGE_MULTIPLIER` | 0.5 | weaponStrength(Attack) × 0.5 |
| `TURTLE_SECONDARY_PROJECTILE_COLOR` | #FFBF00 | Amber/gold |

---

## 5. References

| Document | Purpose |
|----------|---------|
| [turtle_design_lock.md](turtle_design_lock.md) | Turtle stats, propulsion color |
| [turtle_primary_weapon_design_lock.md](turtle_primary_weapon_design_lock.md) | Primary arc shot; distinct secondary |
| [basic_gun_design_lock.md](../../../basic_gun_design_lock.md) | Damage formula baseline |
| [art_style_guide.md](../../../art_style_guide.md) | VFX language, projectile clarity |

---

## 6. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-06 |
| **Visual Design** | Approved | 2026-03-06 |
| **CEO** | Approved | 2026-03-06 |

---

## Gate

This document gates:
- **6.T.6** — Turtle entity + secondary weapon implementation
