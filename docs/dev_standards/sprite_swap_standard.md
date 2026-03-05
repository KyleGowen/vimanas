# Sprite Swap Standard

**Status:** Draft (design only—implementation delegated separately)  
**Canon references:** [tech_architecture.md](../tech_architecture.md), [design_system.md](../design_system.md), [art_style_guide.md](../art_style_guide.md)

## Purpose

Enable artists and designers to swap sprites for on-screen objects (ships, enemies, projectiles, powerups, etc.) **without touching game logic**. JSON or TypeScript config holds sprite paths; entities read from config. Runtime swapping (ship variants, damage states) is supported.

---

## Core Pattern (Framework-Free)

```
JSON/TS config (sprite paths)  →  Asset loader  →  Entity draw
```

1. **Config** holds sprite path(s) in `public/images/`.
2. **Asset loader** loads images via `new Image()`; caches by path.
3. **Entity** (ship, projectile, etc.) receives loaded image reference; renderer draws it to canvas.

**Design principle:** Artists change the config or replace image files; game logic stays untouched.

---

## Config Schema

### TypeScript interface

```typescript
interface SpriteAppearanceConfig {
  default: string;      // Path: /images/ships/sparrow_facing_n.png
  damaged?: string;     // Optional: damage state
  variants?: string[];  // Optional: ship skins, etc.
}
```

### Example: `src/config/ships.ts`

```typescript
export const sparrowSprites: SpriteAppearanceConfig = {
  default: '/images/ships/sparrow_facing_n.png',
  damaged: '/images/ships/sparrow_damage.png',
  variants: ['/images/ships/sparrow_facing_n.png'], // Add skins as needed
};
```

### Example: `src/config/projectiles.ts`

```typescript
export const playerProjectileSprite = '/images/projectiles/sparrow_laser_beam.png';
```

---

## Folder Structure

```
public/images/
  ships/           # sparrow_*.png, turtle_*.png, etc.
  enemies/        # Scout_*.png, etc.
  projectiles/    # sparrow_laser_beam.png, etc.
  powerups/       # (future)
  vfx/            # (future)

src/config/
  ships.ts         # Ship sprite configs
  projectiles.ts  # Projectile sprite paths
  enemies.ts      # Enemy sprite configs
```

---

## Workflow: Adding or Swapping Sprites

### Adding a new sprite-based object

1. **Create the sprite** — Place in `public/images/{type}/` with naming convention.
2. **Add config entry** — Add path to `src/config/{type}.ts`.
3. **Wire entity** — Entity reads path from config; loader fetches image; renderer draws.

### Swapping art for an existing object

1. **Replace the image file** — Overwrite or add new file in `public/images/{type}/`.
2. **Update config** — Change path in `src/config/{type}.ts` if filename changed.
3. **Done** — No entity logic changes. Next load uses new art.

### Runtime swapping (damage states, variants)

- **Damage states:** Entity holds reference to `default` and `damaged` images; switches when HP threshold met.
- **Variants:** Entity receives variant index; looks up `variants[index]` from config.

---

## Naming Conventions

| Object Type | Folder | Naming | Example |
|-------------|--------|--------|---------|
| Player ship | `images/ships/` | `{ship}_{pose}.png` | `sparrow_facing_n.png`, `sparrow_damage.png` |
| Enemy | `images/enemies/` | `{enemy}_{pose}.png` | `Scout_Default.png`, `Scout_Damaged.png` |
| Projectile | `images/projectiles/` | `{source}_{type}.png` | `sparrow_laser_beam.png` |
| Powerup | `images/powerups/` | `{name}.png` | `HealthPickup.png` |

---

## Still true?

- [ ] Review after implementation
- [ ] Confirm with art pipeline when asset workflow is finalized
