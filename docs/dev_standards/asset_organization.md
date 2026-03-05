# Asset Organization

**Status:** Active  
**Audience:** Full Stack Engineer, Artists  
**Source:** Framework-free pivot (2026-03-05)

---

## Purpose

Organize sprites and assets for consistent structure, discoverability, and sprite swapping per [sprite_swap_standard.md](sprite_swap_standard.md).

---

## Content Structure

```
public/images/
  ships/            # Player ship sprites (sparrow_*.png)
  enemies/          # Enemy body sprites (ScoutEnemyPlaceholder, etc.)
  projectiles/     # Projectile sprites (sparrow_laser_beam.png, placeholders)
  powerups/        # Powerup sprites (future)
  vfx/             # Explosions, hit effects (future)
```

### Naming

- **Ships:** `sparrow_*.png` (sparrow_facing_n, sparrow_boost, sparrow_firing, etc.)
- **Enemies:** `Scout_*.png`, `*Placeholder.png` until final art
- **Projectiles:** `sparrow_laser_beam.png`, `*Placeholder.png`

---

## Code References

Paths are relative to `public/` root. In code, use `/images/ships/sparrow_facing_n.png` (served at root by Vite).

| Entity | Path |
|--------|------|
| Sparrow ship | `/images/ships/sparrow_facing_n.png` |
| Projectile | `/images/projectiles/sparrow_laser_beam.png` |
| Scout enemy | `/images/enemies/ScoutEnemyPlaceholder.png` |

---

## Still true?

- [ ] Add Powerups/, VFX/ content as features ship
