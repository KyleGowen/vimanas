# Speed Boost — Context

**Purpose:** Hold a key to multiply game speed (deltaTime). Right-hand friendly for one-handed playtesting.

---

## Design

- **Where:** Applied in the game loop before passing deltaTime to scenes. All time-based systems (movement, projectiles, scroll, animations) scale uniformly.
- **Input:** Uses `InputService.isKeyDown(keyCode)`. No coupling to InputService beyond the minimal `SpeedBoostInput` interface.
- **Config:** Key and multiplier are configurable. Default: Period (.) key, 5× speed.

---

## Integration Points

| Consumer | Usage |
|----------|-------|
| `Game` | Calls `applySpeedBoost(deltaTime, input, config)` in loop; passes `config.keyCode` to `InputService.init()` for preventDefault |
| `main.ts` | Uses default Game constructor; no speed boost options passed |

---

## Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `keyCode` | string | 'Period' | KeyboardEvent.code (e.g. 'Period' for ., 'Slash' for /) |
| `multiplier` | number | 5 | Factor applied to deltaTime when key held |

---

## Files

- `speed-boost-config.ts` — Config interface and default
- `speed-boost.ts` — `applySpeedBoost()` and `SpeedBoostInput` interface
- `index.ts` — Barrel exports
- `speed-boost.test.ts` — Unit tests

---

## Tuning

- **Different key:** Use a right-hand key (e.g. Slash, Quote, Semicolon) so left hand stays on WASD.
- **Different multiplier:** 3× for subtle boost; 10× for fast-forward.

---

## Still true?

- [ ] Review when adding gamepad support for speed boost
