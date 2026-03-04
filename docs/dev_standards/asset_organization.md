# Asset Organization

**Status:** Active  
**Audience:** Unity Gameplay Engineer, Artists  
**Source:** Asset reorganization (2026-03-04)

---

## Purpose

Organize sprites and assets per [sprite_swap_standard.md](sprite_swap_standard.md) for consistent structure, discoverability, and future SpriteApplier migration.

---

## Content Structure

```
Assets/Content/Sprites/
  Ships/           # Player ship sprites (Sparrow_*.png, sparrow_*.png)
  Enemies/         # Enemy body sprites (ScoutEnemyPlaceholder; enemy projectiles in Projectiles/)
  Projectiles/     # Projectile sprites (sparrow_laser_beam.png, ProjectilePlaceholder, EnemyProjectilePlaceholder)
  Powerups/        # Powerup sprites (future)
  VFX/             # Explosions, hit effects (future)
  Archive/         # Deprecated/legacy (Sparrow_History from original sprite sheet)
```

### Naming

- **Ships:** `sparrow_*.png` (sparrow_facing_n, sparrow_boost, sparrow_firing, etc.)
- **Enemies:** `Scout_*.png`, `*Placeholder.png` until final art
- **Projectiles:** `sparrow_laser_beam.png`, `*Placeholder.png`

---

## Resources Structure (Build-Critical)

Runtime `Resources.Load<Sprite>(path)` fallbacks require sprites in `Assets/Resources/Sprites/`. Structure mirrors Content:

```
Assets/Resources/Sprites/
  Ships/           # sparrow_facing_n, sparrow_boost, sparrow_firing, sparrow_idle
  Projectiles/     # sparrow_laser_beam
```

**Rationale:** Mirrors Content layout for consistency. Code paths: `Sprites/Ships/sparrow_facing_n`, `Sprites/Projectiles/sparrow_laser_beam`. See [unity_learnings.md](unity_learnings.md) for textureType/spriteMode requirements.

---

## Code References

| Component | Path |
|-----------|------|
| SparrowSpriteController | `Sprites/Ships/sparrow_facing_n`, `sparrow_boost`, `sparrow_firing` |
| GameplayUIController | `Sprites/Ships/sparrow_facing_n`, `Sprites/Projectiles/sparrow_laser_beam` |
| Projectile | `Sprites/Projectiles/sparrow_laser_beam` |

---

## Prefab References

Prefabs reference sprites by GUID (serialized in SpriteRenderer, SparrowSpriteController). Moving assets with their `.meta` files preserves GUIDs; prefab references remain valid.

| Prefab | Sprite Source |
|--------|---------------|
| SparrowShip | Content/Sprites/Ships/sparrow_facing_n (SpriteRenderer + SparrowSpriteController) |
| Projectile | Content/Sprites/Projectiles/sparrow_laser_beam |
| ScoutEnemy | Content/Sprites/Enemies/ScoutEnemyPlaceholder |
| EnemyProjectile | Content/Sprites/Projectiles/EnemyProjectilePlaceholder |

---

## Archive

`Content/Sprites/Archive/Sparrow_History/` contains original sprite sheet exports. Kept for reference; not used at runtime.

---

## Still true?

- [ ] Revisit when SpriteApplier migration completes (sprite_swap_standard)
- [ ] Add Powerups/, VFX/ content as features ship
