# Dragon Secondary Weapon Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.D.3**

Dragon secondary weapon—**charged shot**: hold to charge a ball of energy in front of the dragon; release to fire. Mana drains while charging. Damage scales with charge time. Locks charge behavior, damage formula, mana drain, and VFX. Gates 6.D.6 (Dragon entity + weapons).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Dragon teal/red/gold energy; charged ball aligns with ship palette |
| **Dragon design lock** | [dragon_design_lock.md](dragon_design_lock.md) | Attack 18, Mana 28; mana archetype |

---

## 1. Combat Systems

### Charge Behavior

- **Hold:** Ball of energy grows in front of dragon. Charge duration accumulates.
- **Release:** Shoots ball forward at current size. Damage proportional to charge time.
- **Mana:** Drains mana per second while charging. Cannot charge if mana insufficient.
- **Min charge:** 0.2 s — below this, no shot on release (or minimal damage).
- **Max charge:** 2.0 s — cap; ball size and damage stop increasing.

### Damage Formula

- **Base:** `weaponStrength = Attack × 0.25` → 4.5 for Dragon.
- **Charge multiplier:** `damage = baseDamage × (1 + chargeMultiplier × chargeDuration)`
- **chargeMultiplier:** 1.5 (e.g. 0.2 s charge → 1.3×, 2 s charge → 4×)
- **At min charge (0.2 s):** ~2.9 damage
- **At max charge (2 s):** ~20 damage

### Mana Drain

- **4 mana per second** while charging.
- At max charge (2 s) = 8 mana consumed. Dragon has 28 mana; ~3 full charges from full.

### Muzzle / Origin

- **Center nose:** `(shipX + shipSize/2, shipY + shipSize * 0.1)` — ball grows in front of dragon.
- **Direction:** North (negative Y).

### Projectile Behavior (on release)

- **Speed:** 280 px/s — faster than primary; big payoff for charge.
- **Lifetime:** 2 s — or until off-screen.
- **Size:** Scales with charge (e.g. 8 px at min, 24 px at max). Collision uses radius.

---

## 2. Visual Design

### Charged Ball VFX

| Property | Value | Rationale |
|----------|-------|-----------|
| **Color** | Red/gold/teal gradient | Dragon palette; core bright, outer glow |
| **Shape** | Sphere/circle | Energy ball |
| **Growth** | Linear with charge time | 0.2 s → small, 2 s → large |
| **Intensity** | Pulsing core | Animated; reads as charged |

### Readability

- **Contrast:** Red/gold/teal reads against forest and industrial.
- **Charge cue:** Ball size and glow intensity indicate charge level.

---

## 3. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `DRAGON_SECONDARY_MANA_PER_SECOND` | 4 | Drain while charging |
| `DRAGON_SECONDARY_MIN_CHARGE_S` | 0.2 | Min for valid shot |
| `DRAGON_SECONDARY_MAX_CHARGE_S` | 2.0 | Cap |
| `DRAGON_SECONDARY_CHARGE_DAMAGE_MULTIPLIER` | 1.5 | Per second of charge |
| `DRAGON_SECONDARY_PROJECTILE_SPEED_PX_S` | 280 | On release |
| `DRAGON_SECONDARY_PROJECTILE_LIFETIME_S` | 2 | |

---

## 4. References

| Document | Purpose |
|----------|---------|
| [dragon_design_lock.md](dragon_design_lock.md) | Dragon stats |
| [wolf_secondary_weapon_design_lock.md](../wolf/wolf_secondary_weapon_design_lock.md) | Format reference |
| [basic_gun_design_lock.md](../../../basic_gun_design_lock.md) | Damage formula baseline |

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
- **6.D.6** — Dragon entity + secondary weapon implementation
