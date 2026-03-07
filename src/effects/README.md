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

## Energy Ring

Procedural elliptical ring for Sparrow secondary. Spawns at muzzle, grows as it travels.

### Usage

Energy rings are spawned by `fireSparrowSecondary()` and drawn by `EnergyRingProjectile.draw()`:

```ts
import { drawEnergyRing, SPARROW_ENERGY_RING_CONFIG } from '../effects/energy-ring-effect';

// In EnergyRingProjectile.draw()
drawEnergyRing(ctx, x, y, radius, gameTime, SPARROW_ENERGY_RING_CONFIG);
```

### Config

- `SPARROW_ENERGY_RING_CONFIG` — cyan, elliptical (radiusX 1.4, radiusY 0.45), thin band (innerRadiusRatio 0.85).

### Elliptical rendering

Use `ctx.translate` + `ctx.scale` so the radial gradient matches the ellipse. See [ENERGY_RING_CONTEXT.md](ENERGY_RING_CONTEXT.md) and engine_learnings.md.

## Shield Effect

Sprite-outline glow when Sparrow holds shield. Uses `ctx.shadowBlur` to follow the ship silhouette.

### Usage

`SparrowShip` draws the shield when `shieldActive` and `gameTime` provided:

```ts
import { drawShieldGlow, SPARROW_SHIELD_CONFIG } from '../effects/shield-effect';

// In SparrowShip.draw(), when shield active (before ship and thruster)
drawShieldGlow(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime, SPARROW_SHIELD_CONFIG, this.sprite);
```

### Config

- `SPARROW_SHIELD_CONFIG` — cyan palette, outlineBlur 18, opacity 1.
- Pass sprite for silhouette glow; null/undefined falls back to radial circle.

See [SHIELD_EFFECT_CONTEXT.md](SHIELD_EFFECT_CONTEXT.md).

## Arc Shot (Turtle Primary)

Curved beam for Turtle primary. Multi-layer stroked Bezier with firey palette and shadowBlur glow.

### Usage

Arc shot is spawned by `fireTurtlePrimary()` and drawn by `ArcShot.draw()`:

```ts
import { drawArcShot, TURTLE_ARC_DRAW_CONFIG } from '../arc-shot/arc-shot-effect';

// In ArcShot.draw()
drawArcShot(ctx, x, y, gameTime, this.spawnTime, ARC_SHOT_DURATION_S, TURTLE_ARC_DRAW_CONFIG);
```

### Config

- `TURTLE_ARC_DRAW_CONFIG` — firey yellow/orange (#FFFFCC core, #FF8800 edge), 4 layers, pulseFreq 12.
- Band width: thin (4–13 px per layer). Arc span: 298 px.

See [arc-shot/CONTEXT.md](../arc-shot/CONTEXT.md).

## Turtle Spread Sphere (Turtle Secondary)

Spherical projectiles for Turtle spread shot. Same palette and multi-layer glow as the arc shot, in sphere form.

### Usage

Spread projectiles are spawned by `fireTurtleSpread()` and drawn by `TurtleSpreadProjectile.draw()`:

```ts
import { drawTurtleSpreadSphere, TURTLE_SPREAD_SPHERE_CONFIG } from '../effects/turtle-spread-effect';

// In TurtleSpreadProjectile.draw()
drawTurtleSpreadSphere(ctx, x, y, gameTime, this.spawnTime, TURTLE_SPREAD_LIFETIME_S, {
  ...TURTLE_SPREAD_SPHERE_CONFIG,
  radius: TURTLE_SPREAD_PROJECTILE_SIZE / 2,
});
```

### Config

- `TURTLE_SPREAD_SPHERE_CONFIG` — same firey palette as arc (#FFFFCC core, #FF8800 edge), 4 layers, pulseFreq 12.
