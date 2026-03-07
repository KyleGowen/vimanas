# Dragon Primary Weapon Design Lock

**Joint Deliverable · Combat Systems + Visual Design · 6.D.2**

Dragon primary weapon—**homing crescent shots**: two crescent-shaped projectiles fired from the wings, each homing toward the nearest enemy. Costs 1 mana per fire. Cannot fire without mana. Locks fire pattern, damage, muzzle positions, homing behavior, and VFX. Gates 6.D.6 (Dragon entity + weapons).

---

## P0 Mocks Considered

| P0 Mock | Path | What it informs |
|---------|------|-----------------|
| **Ship mocks** | [p0_1_ships](../ship_mocks_pilot_style_deliverable.md) | Dragon teal energy cores; crescent shots align with wing geometry |
| **Dragon design lock** | [dragon_design_lock.md](dragon_design_lock.md) | Attack 18, Mana 28; mana archetype; orange/red propulsion, teal accents |

---

## 1. Combat Systems

### Damage Formula

Per [basic_gun_design_lock.md](../../../basic_gun_design_lock.md): `weaponStrength = Attack × 0.25`. Dragon (Attack 18) = **4.5** baseline.

**Dragon primary modifier:** 0.6× multiplier → **2.7 damage** per crescent (rounded for implementation).

- **Rationale:** Homing is powerful; lower per-shot damage balances. Two shots = ~5.4 total per volley.

### Fire Rate

- **0.35 s** cooldown (~2.86 volleys/s)
- Slightly slower than Wolf (0.3 s). Homing shots are deliberate; mana cost limits spam.

### Fire Pattern — Dual Wing Crescent, Homing

- **Two shots per trigger:** One from left wing, one from right wing. Fired simultaneously.
- **Direction:** Initial velocity north (ship facing). Each projectile homes toward nearest enemy.
- **Mana cost:** **1** per fire. Cannot fire if `currentMana < 1`.
- **Homing:** Each frame, find nearest scout or boss; steer velocity toward target. Homing strength tunable (e.g. 30–50% of velocity lerp per frame).

### Muzzle Positions

For a 100×100 ship (`DRAGON_SHIP_SIZE`), wing tips similar to Wolf:

| Muzzle | X | Y | Rationale |
|--------|---|---|-----------|
| **Left wing** | `shipX + shipSize × 0.25` | `shipY + shipSize × 0.45` |
| **Right wing** | `shipX + shipSize × 0.75` | `shipY + shipSize × 0.45` |

### Projectile Speed

- **200 px/s** base (slightly slower than Wolf 240; homing compensates)

### Projectile Lifetime

- **3 s** — same as other projectiles.

### Homing Logic

- **Target selection:** Nearest enemy (scout or boss) to projectile at spawn; re-evaluate each frame or every N frames.
- **Steering:** Lerp velocity toward direction-to-target. `vx += (targetX - projX) * homingStrength * deltaTime` (normalize, scale).
- **Homing strength:** 2–3 rad/s turn rate or equivalent. Tune for satisfying curve without instant snap.

---

## 2. Visual Design

### Crescent Shape

- **Shape:** Crescent moon—curved arc, not a rectangle. Energy styled.
- **Color:** Teal glow (#00CED1 core, #20B2AA mid, transparent edges). Dragon palette + teal per user spec.
- **Size:** ~12–16 px nominal width; readable at combat distance.

### Readability

- **Contrast:** Teal reads against forest (green) and industrial (gray/brown).
- **Dual shots:** Two crescents per volley; homing creates distinct curved paths.

---

## 3. Implementation Constants (Reference)

| Constant | Value | Notes |
|----------|-------|-------|
| `DRAGON_PRIMARY_MANA_COST` | 1 | Per fire |
| `DRAGON_PRIMARY_FIRE_RATE_S` | 0.35 | Cooldown |
| `DRAGON_PRIMARY_PROJECTILE_SPEED_PX_S` | 200 | Base speed |
| `DRAGON_PRIMARY_PROJECTILE_LIFETIME_S` | 3 | Same as others |
| `DRAGON_PRIMARY_DAMAGE_MULTIPLIER` | 0.6 | vs weaponStrength |
| `DRAGON_PRIMARY_HOMING_STRENGTH` | 2.5 | rad/s or equivalent |

---

## 4. References

| Document | Purpose |
|----------|---------|
| [dragon_design_lock.md](dragon_design_lock.md) | Dragon stats, palette |
| [wolf_primary_weapon_design_lock.md](../wolf/wolf_primary_weapon_design_lock.md) | Format reference, muzzle positions |
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
- **6.D.6** — Dragon entity + primary weapon implementation
