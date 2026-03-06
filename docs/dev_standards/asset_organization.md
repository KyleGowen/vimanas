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
  ships/
    sparrow/       # Sparrow sprites (sparrow_facing_n.png, etc.)
    turtle/        # Turtle sprites (turtle_facing_n.png, etc.)
    wolf/          # Wolf sprites (future)
    dragon/        # Dragon sprites (future)
  enemies/         # Enemy body sprites (ScoutEnemyPlaceholder, etc.)
  projectiles/     # Projectile sprites (sparrow_laser_beam.png, placeholders)
  powerups/        # Powerup sprites (future)
  vfx/             # Explosions, hit effects (future)
```

### Naming

- **Ships:** One subdir per ship. `sparrow/sparrow_*.png`, `turtle/turtle_*.png` (e.g. sparrow_facing_n, turtle_facing_n)
- **Enemies:** `Scout_*.png`, `*Placeholder.png` until final art
- **Projectiles:** `sparrow_laser_beam.png`, `*Placeholder.png`

---

## Code References

Paths are relative to `public/` root. In code, use `/images/ships/sparrow/sparrow_facing_n.png` (served at root by Vite).

| Entity | Path |
|--------|------|
| Sparrow ship | `/images/ships/sparrow/sparrow_facing_n.png` |
| Projectile | `/images/projectiles/sparrow_laser_beam.png` |
| Scout enemy | `/images/enemies/ScoutEnemyPlaceholder.png` |

---

## Still true?

- [ ] Add Powerups/, VFX/ content as features ship
