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

### Beam Behavior — Sustained Hold-to-Fire Beam (CEO Approved)

- **Choice:** **(A) Sustained hold-to-fire beam** — active while secondary fire is held.
- **Rationale:** Per CEO: continuous beam, not big bullets; remains active as long as secondary fire is held; consumes 5 mana per second. Energy beam look similar to Cyclops optic blast, color-coded white/silver/grey for Wolf. Beam grows from nose; unlimited length while mana lasts; taper only at back (point at nose), parallel edges for main body.

### Fire Pattern

- **Origin:** Center nose muzzle.
- **Muzzle position:** `(shipX + shipSize/2, shipY)` or `(shipX + shipSize/2, shipY + shipSize * 0.1)` — center nose; use shipY for center-top (Sparrow-style) or slight offset if nose tip sits below top. Tune per sprite anchor.
- **Direction:** North (0°, negative Y). Same as Sparrow secondary.
- **Projectile count:** **1** beam per fire.
- **Mana cost:** **5 per second** — sustained drain while beam is held.

### Projectile Behavior

| Property | Value | Rationale |
|----------|-------|-----------|
| **Length** | Unlimited | Grows at 620 px/s while held; resets when mana runs out |
| **Width** | 14 px | Parallel edges; taper only at back (28 px) near nose |
| **Damage** | weaponStrength(Attack) per second | 5 dps for Wolf Attack 20; continuous damage to enemies in beam |

### Distinct from Primary

| Aspect | Primary (Dual wing-tip) | Secondary (Center nose beam) |
|--------|--------------------------|------------------------------|
| **Type** | Two projectiles from wings | Single beam from nose |
| **Origin** | Wing tips (left/right) | Center nose |
| **Mana** | 0 | 5/sec |
| **Cooldown** | ~0.15 s (per basic gun) | None (hold to sustain) |
| **Use case** | Sustained forward DPS | Sustained beam, hold for continuous damage |

---

## 2. Visual Design

**Canon:** [art_style_guide.md](../../../art_style_guide.md) — VFX Language, Ship Propulsion Glow Colors. Wolf propulsion glow = #E8E8E8 (white/silver).

Per art_style_guide: *"Energy blasts and projectiles: clear, readable, impactful. Bright cores and trails."*

### 2.1 Beam VFX

| Property | Value | Rationale |
|----------|-------|-----------|
| **Color** | White/silver | #E8E8E8 (core), #C0C0C0 (mid), rgba(192,192,192,0) (tip) |
| **Shape** | Thick beam | Cyclops-style: taper at back (point at nose), parallel edges for main body |
| **Length** | Unlimited | Grows 620 px/s; `drawWolfSustainedBeam` in wolf-beam-effect.ts |
| **Width** | 14 px | Thick; distinct from Sparrow (6), Turtle round shots |
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
- **Beam effect:** `wolf-beam-effect.ts` — `drawWolfSustainedBeam()`. Layered gradient (outer grey → mid → core white) for energy beam look. White/silver palette per Wolf.
- **Muzzle offset:** `shipY` (center-top) or `shipY + shipSize * 0.1`; adjust per Wolf sprite anchor.
- **Coordinate system:** 0° = North (negative Y). Same as Sparrow secondary.

---

## 4. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `WOLF_SECONDARY_MANA_PER_SECOND` | 5 | Mana consumed while beam held |
| `WOLF_BEAM_GROWTH_RATE` | 620 | px/s; unlimited length while mana lasts |
| `WOLF_BEAM_WIDTH` | 14 | px; parallel edges |
| Taper length | 28 px | Back only; point at nose |
| Damage per second | weaponStrength(Attack) | 5 for Wolf Attack 20 |

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
| **Visual Design** | Approved | 2026-03-07 |
| **CEO** | **Signed off** | 2026-03-07 |

**Final tuning:** 5 mana/sec, 620 px/s growth, unlimited length, Cyclops-style taper at back only (28 px), parallel edges for main beam body.

---

## Gate

This document gates:
- **6.W.6** — Wolf entity + secondary weapon implementation
