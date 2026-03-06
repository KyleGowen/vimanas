# Ship Movement — Context

**Purpose:** Per-direction movement speed configuration for player ships. Each ship can have independent forward, backward, left, and right speeds.

---

## Design

- **Where:** `ShipMovementConfig` in `ship-movement.ts`; `SparrowShipStats` extends it. `SparrowShip.update()` uses `getSpeedX`/`getSpeedY` to resolve effective speed per axis.
- **Coordinate convention:** North = moveAxis.y < 0 (up), South = moveAxis.y > 0 (down), Left = moveAxis.x < 0, Right = moveAxis.x > 0.
- **Defaults:** Omitted per-direction values fall back to `speed`. Sparrow: speed 42, forward 52.5, backward 37.8, left/right 46.

---

## Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `speed` | number | required | Base speed; used when per-direction values not set |
| `forwardSpeed` | number | speed | When moving north (moveAxis.y < 0) |
| `backwardSpeed` | number | speed | When moving south (moveAxis.y > 0) |
| `leftSpeed` | number | speed | When moving left (moveAxis.x < 0) |
| `rightSpeed` | number | speed | When moving right (moveAxis.x > 0) |

---

## Integration Points

| Consumer | Usage |
|----------|-------|
| `SparrowShip` | Stats extend ShipMovementConfig; update() calls getSpeedX/getSpeedY |
| `GameplayScene` | Passes moveAxis from InputService to ship.update() |
| Future ships (Turtle, Wolf, Dragon) | Same pattern: stats extend ShipMovementConfig |

---

## Files

- `ship-movement.ts` — ShipMovementConfig, getSpeedX, getSpeedY, MOVE_SCALE
- `ship-movement.test.ts` — Unit tests for helpers
- `sparrow-ship.ts` — SparrowShipStats, SparrowShip.update()
- `sparrow-ship.test.ts` — Unit tests including per-direction movement

---

## Tuning

- **MOVE_SCALE:** 10. speed × deltaTime × MOVE_SCALE ≈ px/frame. At 60fps, speed 42 ≈ 420 px/s.
- **Sparrow feel:** Forward fastest (52.5), backward slowest (37.8), strafe (46) between.

---

## Still true?

- [ ] Review when adding Turtle, Wolf, Dragon ships
