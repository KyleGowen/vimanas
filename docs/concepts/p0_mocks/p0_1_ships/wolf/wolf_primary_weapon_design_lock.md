# Wolf Primary Weapon Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.W.2**

Wolf primary weapon—**dual wing-tip shots**: two projectiles fired simultaneously from the left and right wing tips. Balanced fighter feel. Locks fire pattern, damage, muzzle positions, and VFX. Gates 6.W.6 (Wolf entity + weapons).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Wolf propulsion #E8E8E8; dual projectiles align with wing geometry |
| **Boss fight (forest)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Player in combat; projectiles must read against forest background |
| **Wolf design lock** | [wolf_design_lock.md](wolf_design_lock.md) | Attack 20, Mana 20; neutral archetype; white/silver propulsion |

---

## 1. Combat Systems

### Damage Formula

Per [basic_gun_design_lock.md](../../../basic_gun_design_lock.md): `weaponStrength = Attack × 0.25`. Wolf (Attack 20) = **5 damage** baseline per shot.

- **No modifier:** Wolf primary uses baseline formula. Each of the two shots deals 5 damage vs Scout (Defense 1).
- **Rationale:** Neutral archetype—no specialization. Same per-shot damage as Sparrow; dual shots double effective output per trigger pull.

### Fire Rate

- **0.15 s** cooldown (~6.67 volleys/s)
- Same as Sparrow basic gun. Balanced fighter feel—responsive, clear shots, not bullet-hell.
- Each volley = 2 projectiles (left + right wing tip) fired simultaneously.

### Fire Pattern — Dual Wing-Tip

- **Two shots per trigger:** One from left wing tip, one from right wing tip. Fired simultaneously.
- **Direction:** Both travel in ship facing direction (forward/north when facing up).
- **Mana cost:** **0** — primary is free.

### Muzzle Positions

For a 100×100 ship (`WOLF_SHIP_SIZE`), wing tips are at roughly 25–35% from center on X, near the front (top) of the ship. Use pixel offsets from ship top-left (`shipX`, `shipY`):

| Muzzle | X | Y | Rationale |
|--------|---|---|-----------|
| **Left wing tip** | `shipX + shipSize × 0.25` | `shipY + shipSize × 0.15` | 25% from left edge; 15% from top (front/nose) |
| **Right wing tip** | `shipX + shipSize × 0.75` | `shipY + shipSize × 0.15` | 75% from left edge; 15% from top |

**From ship center** (if implementation uses center as reference):
- Center = `(shipX + shipSize/2, shipY + shipSize/2)`
- Left tip offset: `(-shipSize × 0.25, -shipSize × 0.35)`
- Right tip offset: `(+shipSize × 0.25, -shipSize × 0.35)`

**Note:** Adjust ±5% on X (e.g. 0.25 → 0.30) if Wolf sprite geometry places wing tips further out. Canonical reference: [wolf_ship_pilot_style.png](wolf_ship_pilot_style.png).

### Projectile Speed

- **240 px/s** (per basic_gun implementation)
- Same as Sparrow. Consistent player projectile feel across ships.

### Projectile Lifetime

- **3 s**
- Same as basic gun. Range ~720 px at 240 px/s.

---

## 2. Visual Design

**Canon:** [art_style_guide.md](../../../art_style_guide.md) — VFX Language, Ship Propulsion Glow Colors. Wolf propulsion glow = #E8E8E8 (white/silver).

Per art_style_guide: *"Energy blasts and projectiles: clear, readable, impactful. Bright cores and trails."*

### 2.1 Projectile VFX

| Property | Value | Rationale |
|----------|-------|-----------|
| **Color** | White/silver | #E8E8E8 |
| **Size** | 8–12 px diameter (sprite source); scale for readability | Same as basic gun; large enough to read at combat distance |
| **Intensity** | Full saturation at core; near-white center | Bright core per art_style_guide |
| **Blend** | Additive or soft additive | Glow reads against dark and light backgrounds |

**Rationale:** Wolf uses #E8E8E8 for propulsion. Projectiles share that aether energy signature—visual continuity between ship and weapon. White/silver contrasts with forest (green) and industrial (gray/brown). Distinct from Sparrow (cyan), Turtle (amber), and enemy (orange/amber).

### 2.2 Trail

| Property | Value | Rationale |
|----------|-------|-----------|
| **Length** | 0.5–1.0× projectile speed | Short enough for 60 FPS; long enough to read direction |
| **Opacity** | 60–80% at head, 0% at tail (linear falloff) | Soft halo; no muddy edges |
| **Color** | Same white/silver (#E8E8E8) at 40–60% opacity | Trail reads as same energy; softer than core |

### 2.3 Readability

- **Contrast:** White/silver reads against forest and industrial. Neutral palette—no faction overlap with Sparrow (cyan) or Turtle (amber).
- **Dual shots:** Two projectiles per volley—ensure spacing is readable; no overlap at muzzle.

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Dual muzzle spawn:** Wolf primary fires two projectiles per trigger. Use `getProjectileOptions()` twice with different muzzle positions, or a `getProjectileOptionsForVolley()` that returns an array of 2 options.
- **Projectile pooling:** Same pool as basic gun. Wolf fires ~6.67 volleys/s × 2 = ~13.3 projectiles/s at max fire rate. Pool size must accommodate 2× Sparrow's peak (Sparrow ~6–7; Wolf ~14).
- **Coordinate system:** Muzzle positions in world Y (like projectiles); draw at screen Y for parallax.

---

## 4. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `WOLF_SHIP_SIZE` | 100 | Ship dimensions (px) |
| `WOLF_PRIMARY_FIRE_RATE_S` | 0.15 | Cooldown between volleys |
| `WOLF_PRIMARY_MUZZLE_LEFT_X` | shipSize × 0.25 | Left wing tip X (from ship left) |
| `WOLF_PRIMARY_MUZZLE_LEFT_Y` | shipSize × 0.15 | Left wing tip Y (from ship top) |
| `WOLF_PRIMARY_MUZZLE_RIGHT_X` | shipSize × 0.75 | Right wing tip X |
| `WOLF_PRIMARY_MUZZLE_RIGHT_Y` | shipSize × 0.15 | Right wing tip Y |
| `WOLF_PRIMARY_PROJECTILE_SPEED_PX_S` | 240 | Same as basic gun |
| `WOLF_PRIMARY_PROJECTILE_LIFETIME_S` | 3 | Same as basic gun |
| `WOLF_PRIMARY_DAMAGE_MULTIPLIER` | 1.0 | Baseline (no modifier) |
| `WOLF_PRIMARY_PROJECTILE_COLOR` | #E8E8E8 | White/silver |
| `WOLF_PRIMARY_MANA_COST` | 0 | Primary is free |

---

## 5. References

| Document | Purpose |
|----------|---------|
| [wolf_design_lock.md](wolf_design_lock.md) | Wolf stats, propulsion color |
| [basic_gun_design_lock.md](../../../basic_gun_design_lock.md) | Damage formula baseline, projectile speed/lifetime |
| [turtle_primary_weapon_design_lock.md](../turtle/turtle_primary_weapon_design_lock.md) | Format reference, implementation constants |
| [art_style_guide.md](../../../art_style_guide.md) | VFX language, projectile clarity |

---

## 6. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-07 |
| **Visual Design** | Pending | — |
| **CEO** | Pending | — |

---

## Gate

This document gates:
- **6.W.6** — Wolf entity + primary weapon implementation
