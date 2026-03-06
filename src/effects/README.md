# Effects

VFX module for procedural and sprite-based effects: thrusters, projectile beams, explosions, hit feedback, etc.

## Thruster

Procedural thruster effect for ship propulsion. Instance-based and configurable per ship.

### Usage

Ships create a `Thruster` instance with a preset or custom config:

```ts
import { Thruster, SPARROW_THRUSTER_CONFIG } from '../effects/thruster-effect';

// In ship constructor
this.thruster = new Thruster(SPARROW_THRUSTER_CONFIG);

// In ship draw(), when gameTime is provided
this.thruster.draw(ctx, x, y, shipWidth, shipHeight, gameTime);
```

### Presets

- `SPARROW_THRUSTER_CONFIG` — cyan/blue aether (Sparrow)
- `TURTLE_THRUSTER_CONFIG` — amber/gold (Turtle)
- `WOLF_THRUSTER_CONFIG` — white/silver (Wolf)
- `DRAGON_THRUSTER_CONFIG` — orange/red (Dragon)

### Custom config

Use `ThrusterConfig` for full control: palette, widthRatio, heightRatio, originYOffset, numSegments, animation speeds, drawOrder.

See [docs/concepts/thruster_effect.md](../../docs/concepts/thruster_effect.md) for design spec and tuning options.

## Projectile Beam

Procedural glowing beam for projectiles. Replaces pixelated rectangles with beams oriented along velocity.

### Usage

Projectiles call `drawProjectileBeam` in draw() when gameTime is provided:

```ts
import {
  drawProjectileBeam,
  PLAYER_PROJECTILE_BEAM_CONFIG,
} from '../effects/projectile-beam-effect';

// In projectile draw(), when gameTime is provided
drawProjectileBeam(ctx, x, y, this.vx, this.vy, gameTime, PLAYER_PROJECTILE_BEAM_CONFIG);
```

### Presets

- `PLAYER_PROJECTILE_BEAM_CONFIG` — cyan/blue (player)
- `ENEMY_PROJECTILE_BEAM_CONFIG` — orange/amber (enemy)

### Custom config

Use `ProjectileBeamConfig` for full control: palette, length, width, numSegments, animation speeds.

See [docs/concepts/projectile_beam_effect.md](../../docs/concepts/projectile_beam_effect.md) for design spec and tuning options.
