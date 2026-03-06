# Effects

VFX module for procedural and sprite-based effects: thrusters, explosions, hit feedback, etc.

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
