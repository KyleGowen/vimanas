# Weapons — Context

Weapon fire logic: spawn options, damage, fire rate. Projectiles/arcs live in their own modules.

---

## Turtle Primary (Arc Shot)

| Constant | Value | File |
|----------|-------|------|
| `TURTLE_PRIMARY_FIRE_RATE_S` | 0.4 s | turtle-primary-weapon.ts |
| `TURTLE_PRIMARY_DAMAGE_MULTIPLIER` | 1.15 | turtle-primary-weapon.ts |

**fireTurtlePrimary(options):** Computes `ArcShotOptions` — muzzle at ship center-top, damage = weaponStrength(attack) × 1.15.

**Arc behavior:** See [src/arc-shot/CONTEXT.md](../arc-shot/CONTEXT.md) — duration, hit detection, multi-hit, VFX.

---

## Other Weapons

- **Sparrow primary:** basic-gun.ts, player-projectile
- **Sparrow secondary:** sparrow-secondary.ts, energy-ring-projectile
- **Turtle secondary:** turtle-secondary.ts, turtle-spread-projectile
- **Scout/Boss:** scout-weapon.ts, boss-weapon.ts, enemy-projectile
