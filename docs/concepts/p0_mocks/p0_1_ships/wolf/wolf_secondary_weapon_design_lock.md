# Wolf Secondary Weapon Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.W.3**

Wolf secondary weapon—**solid laser beam** fired from center nose muzzle. Per CEO: secondary = solid laser beam from center nose. Locks fire pattern, damage, mana cost, cooldown, and VFX. Gates 6.W.6 (Wolf entity + weapons).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Wolf propulsion #E8E8E8; beam aligns with ship energy signature |
| **Boss fight (forest)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Player in combat; beam must read against forest background |
| **Wolf design lock** | [wolf_design_lock.md](wolf_design_lock.md) | Attack 20, Mana 20; neutral archetype; white/silver propulsion |
| **Wolf primary weapon** | (6.W.2) | Dual wing-tip shots; secondary is distinct (center nose beam vs wing-tip) |

---

## 1. Combat Systems

### Damage Formula

Per [basic_gun_design_lock.md](../../../basic_gun_design_lock.md): `weaponStrength = Attack × 0.25`. Wolf (Attack 20) = **5** baseline.

**Wolf secondary modifier:** Full weaponStrength. `wolfBeamDamage = weaponStrength(Attack)` → **5** per hit.

- **Rationale:** Single beam, single target. Wolf is baseline—no modifier. Reliable punch. Balanced vs Sparrow (1 mana, 5 damage per ring) and Turtle (5 mana, 8 projectiles × 2 damage).

### Beam Behavior — Single-Shot Traveling Beam (Recommended)

- **Choice:** **(B) Single-shot beam projectile that travels** — recommended for implementation simplicity and Wolf identity.
- **Rationale:** Wolf is neutral, versatile. A traveling beam projectile reuses existing `drawProjectileBeam` + projectile pool. Sustained hold-to-fire (A) would require new systems (beam entity, hit-scan, hold state) and skews toward Dragon's attack focus. Single-shot = balanced, deliberate, Star Fox 64–style.

**Alternative:** If playtest shows sustained beam feels better for Wolf identity, revisit (A). Document decision here.

### Fire Pattern

- **Origin:** Center nose muzzle.
- **Muzzle position:** `(shipX + shipSize/2, shipY)` or `(shipX + shipSize/2, shipY + shipSize * 0.1)` — center nose; use shipY for center-top (Sparrow-style) or slight offset if nose tip sits below top. Tune per sprite anchor.
- **Direction:** North (0°, negative Y). Same as Sparrow secondary.
- **Projectile count:** **1** beam per fire.
- **Mana cost:** **3** — moderate; not spammable, not heavy.
- **Cooldown:** **0.9 s** — deliberate; balanced feel.

### Projectile Behavior

| Property | Value | Rationale |
|----------|-------|-----------|
| **Speed** | 280 px/s | Slightly faster than Sparrow (240 px/s); beam feels focused, punchy |
| **Lifetime** | 1.8 s | Range ~504 px; sufficient reach, not screen-spanning |
| **Shape** | Thick beam (elongated) | Uses `ProjectileBeamConfig`; distinct from Sparrow rings, Turtle spread |

### Distinct from Primary

| Aspect | Primary (Dual wing-tip) | Secondary (Center nose beam) |
|--------|--------------------------|------------------------------|
| **Type** | Two projectiles from wings | Single beam from nose |
| **Origin** | Wing tips (left/right) | Center nose |
| **Mana** | 0 | 3 |
| **Cooldown** | ~0.15 s (per basic gun) | 0.9 s |
| **Use case** | Sustained forward DPS | Focused burst, single-target punch |

---

## 2. Visual Design

**Canon:** [art_style_guide.md](../../../art_style_guide.md) — VFX Language, Ship Propulsion Glow Colors. Wolf propulsion glow = #E8E8E8 (white/silver).

Per art_style_guide: *"Energy blasts and projectiles: clear, readable, impactful. Bright cores and trails."*

### 2.1 Beam VFX

| Property | Value | Rationale |
|----------|-------|-----------|
| **Color** | White/silver | #E8E8E8 (core), #C0C0C0 (mid), rgba(192,192,192,0) (tip) |
| **Shape** | Thick beam | Elongated; uses `drawProjectileBeam` |
| **Length** | 40 px | Longer than player default (24); "solid laser" read |
| **Width** | 12 px | Thick; distinct from Sparrow (6), Turtle round shots |
| **Intensity** | Full saturation at core | Bright; clear read |
| **Trail** | Gradient tip to transparent | Same as existing beam effect |

**Rationale:** Wolf uses #E8E8E8 for propulsion. Beam shares that aether energy signature. White/silver contrasts with forest and industrial. Distinct from Sparrow (cyan), Turtle (amber), enemy (orange).

### 2.2 Readability

- **Contrast:** White/silver reads against forest (green) and industrial (gray/brown).
- **Enemy differentiation:** Wolf beam = neutral white/silver; distinguishable in co-op.
- **Center nose origin:** Visual continuity—beam emerges from ship nose, not wings.

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Projectile pooling:** Reuse PlayerProjectile pool. 1 beam per fire; same pool as Sparrow, Turtle. Wolf beam uses `ProjectileBeamConfig` with Wolf palette—projectile type or draw override.
- **Beam effect:** Extend `projectile-beam-effect.ts` with `WOLF_SECONDARY_BEAM_CONFIG` (palette, length 40, width 12). Reuse `drawProjectileBeam`.
- **Muzzle offset:** `shipY` (center-top) or `shipY + shipSize * 0.1`; adjust per Wolf sprite anchor.
- **Coordinate system:** 0° = North (negative Y). Same as Sparrow secondary.

---

## 4. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `WOLF_SECONDARY_COOLDOWN_S` | 0.9 | Cooldown between uses |
| `WOLF_SECONDARY_MANA_COST` | 3 | Mana consumed per use |
| `WOLF_SECONDARY_PROJECTILE_SPEED_PX_S` | 280 | Slightly faster than Sparrow |
| `WOLF_SECONDARY_PROJECTILE_LIFETIME_S` | 1.8 | Range ~504 px |
| `WOLF_SECONDARY_DAMAGE_MULTIPLIER` | 1.0 | weaponStrength(Attack) × 1.0 |
| `WOLF_SECONDARY_BEAM_LENGTH` | 40 | px |
| `WOLF_SECONDARY_BEAM_WIDTH` | 12 | px |
| `WOLF_SECONDARY_BEAM_PALETTE` | core #E8E8E8, mid #C0C0C0, tip transparent | White/silver |

---

## 5. References

| Document | Purpose |
|----------|---------|
| [wolf_design_lock.md](wolf_design_lock.md) | Wolf stats, propulsion color |
| [turtle_secondary_weapon_design_lock.md](../turtle/turtle_secondary_weapon_design_lock.md) | Format reference, secondary weapon structure |
| [basic_gun_design_lock.md](../../../basic_gun_design_lock.md) | Damage formula baseline |
| [art_style_guide.md](../../../art_style_guide.md) | VFX language, projectile clarity |
| [src/weapons/sparrow-secondary.ts](../../../src/weapons/sparrow-secondary.ts) | Muzzle position pattern (center-top) |

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
- **6.W.6** — Wolf entity + secondary weapon implementation
