# Turtle Primary Weapon Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.T.2**

Turtle primary weapon—**arc shot**: curved beam that shoots out in front of the ship. Tank-appropriate feel. Locks fire pattern, damage, behavior, and VFX. Gates 6.T.6 (Turtle entity + weapons).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Turtle propulsion #FFBF00; arc VFX aligns with ship energy signature |
| **Boss fight (forest)** | [p0_4_boss](../../p0_4_boss/boss_mocks_deliverable.md) | Player in combat; arc must read against forest background |
| **Turtle design lock** | [turtle_design_lock.md](turtle_design_lock.md) | Attack 14, Mana 20; tank archetype; amber/gold propulsion |

---

## 1. Combat Systems

### Damage Formula

Per [basic_gun_design_lock.md](../../../basic_gun_design_lock.md): `weaponStrength = Attack × 0.25`. Turtle (Attack 14) = **3.5 damage** baseline.

**Turtle primary modifier:** +15% for "heavy" feel. `turtlePrimaryDamage = weaponStrength(Attack) × 1.15` → **4.025** (round to **4** for implementation).

- **Rationale:** Tank identity—impactful per shot. Compensates for slower fire rate and short arc duration.

### Fire Rate

- **0.25 s** cooldown (~4 shots/s)
- Slower than Sparrow (0.15 s). Tank feel: deliberate, measured.

### Fire Pattern — Arc Shot

- **Arc shot:** Curved beam that shoots out in front of the ship. Not a traveling projectile.
- **Shape:** Curved beam (arc) — like a curved blade or crescent in front of the ship.
- **Width:** Wider than the Turtle ship (~100 px). Arc spans ~120 px at widest.
- **Length:** Extends forward ~100–120 px from muzzle.
- **Duration:** **0.2 s** — dissipates fairly quickly. Arc is visible briefly, then fades.
- **Muzzle:** Ship center-top (north-facing).
- **Mana cost:** **0** — primary is free.

### Hit Detection

- Enemies that overlap the arc's hit area during its active duration take damage.
- Arc is static (anchored at spawn); does not travel. Hit area is the curved beam region.

---

## 2. Visual Design

**Canon:** [art_style_guide.md](../../../art_style_guide.md) — VFX Language, Ship Propulsion Glow Colors. Turtle propulsion glow = #FFBF00 (amber/gold).

Per art_style_guide: *"Energy blasts and projectiles: clear, readable, impactful. Bright cores and trails."*

### 2.1 Arc VFX

| Property | Value | Rationale |
|----------|-------|-----------|
| **Color** | Amber/gold | #FFBF00 |
| **Shape** | Curved beam (quadratic Bezier or arc) | Arc reads as distinct from Sparrow's straight shots |
| **Width** | Wider than ship (~120 px at widest) | Tank presence; area denial |
| **Intensity** | Full saturation at core; fades toward edges | Bright core; dissipates at edges |
| **Dissipation** | Opacity fades over 0.2 s lifetime | "Dissipates fairly quickly" |

**Rationale:** Turtle uses #FFBF00 for propulsion. Arc shares that aether energy signature. Amber contrasts with forest and industrial. Distinct from Sparrow (cyan) and enemy (orange/amber).

### 2.2 Readability

- **Contrast:** Amber reads against forest (green) and industrial (gray/brown).
- **Enemy differentiation:** Turtle arc = gold-tinted amber; distinguishable in co-op.

---

## 3. Platform / Engine Gotchas

Per [engine_learnings.md](../../../dev_standards/engine_learnings.md):

- **Arc shot module:** New `src/arc-shot/` module. ArcShot class: origin, damage, spawnTime, duration. Draw curved beam; collision via point-in-arc or distance-to-curve.
- **Pooling:** ArcShotPool for zero-allocation firing. Turtle fires ~4/s; pool size ~2–3 active arcs.
- **Coordinate system:** Arc origin in world Y (like projectiles); draw at screen Y for parallax.

---

## 4. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `TURTLE_PRIMARY_FIRE_RATE_S` | 0.25 | Cooldown between shots |
| `TURTLE_PRIMARY_ARC_DURATION_S` | 0.2 | Arc dissipates quickly |
| `TURTLE_PRIMARY_ARC_LENGTH_PX` | 100–120 | Extends forward from muzzle |
| `TURTLE_PRIMARY_ARC_WIDTH_PX` | 120 | Wider than ship |
| `TURTLE_PRIMARY_DAMAGE_MULTIPLIER` | 1.15 | weaponStrength(Attack) × 1.15 |
| `TURTLE_PRIMARY_ARC_COLOR` | #FFBF00 | Amber/gold |

---

## 5. Arc Shot Module (Implementation)

The arc shot requires a new `src/arc-shot/` module:

- **ArcShot class:** Holds origin (x, y), damage, spawnTime, duration. Does not move.
- **update(gameTime):** Returns false when `gameTime - spawnTime > duration`.
- **overlapsEnemy(x, y, width, height):** Returns true if enemy AABB overlaps the arc's hit area. Arc is a curved region (quadratic Bezier with thickness); approximate with distance-to-curve or polygon.
- **draw(ctx, screenX, screenY, gameTime):** Draw curved beam. Opacity fades over lifetime (1 → 0 over duration).
- **ArcShotPool:** Prewarm 2–3 ArcShots; Get/Return on fire/expire.

---

## 6. References

| Document | Purpose |
|----------|---------|
| [turtle_design_lock.md](turtle_design_lock.md) | Turtle stats, propulsion color |
| [basic_gun_design_lock.md](../../../basic_gun_design_lock.md) | Damage formula baseline |
| [art_style_guide.md](../../../art_style_guide.md) | VFX language, projectile clarity |

---

## 7. Sign-Off

| Role | Status | Date |
|------|--------|------|
| **Combat Systems** | Approved | 2026-03-06 |
| **Visual Design** | Approved | 2026-03-06 |
| **CEO** | Approved | 2026-03-06 |

---

## Gate

This document gates:
- **6.T.6** — Turtle entity + primary weapon implementation
