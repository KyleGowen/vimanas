# Speed Boost

Hold a configurable key to multiply game speed (deltaTime). Default: Period (.) key, 5× speed.

## Usage

```ts
import { applySpeedBoost, DEFAULT_SPEED_BOOST_CONFIG } from './speed-boost';

// In game loop
deltaTime = applySpeedBoost(deltaTime, input, config);
```

## Config

- `keyCode`: KeyboardEvent.code (e.g. 'Period' for .)
- `multiplier`: Factor applied to deltaTime when key held (e.g. 5 for 5×)

## Custom config

Pass `speedBoost` to Game constructor:

```ts
const game = new Game(canvas, ctx, {
  speedBoost: { keyCode: 'Slash', multiplier: 10 },
});
```

Add the key to InputService's preventDefault list via `init(canvas, [keyCode])` so it doesn't trigger browser actions.
