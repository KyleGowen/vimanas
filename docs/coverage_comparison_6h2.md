# Coverage Comparison — 6.H.2 Test Hardening

**Run `npm run test:coverage` to regenerate coverage reports.**

## Before vs After

| Metric     | Before   | After    | Delta    |
|------------|----------|----------|----------|
| Statements | 59.65%   | 79.44%   | +19.79%  |
| Branches   | 54.11%   | 63.31%   | +9.20%   |
| Functions  | 72.05%   | 87.54%   | +15.49%  |
| Lines      | 59.96%   | 80.11%   | +20.15%  |

## Test Count

| Type              | Before | After |
|-------------------|--------|-------|
| Unit tests        | 324    | 442   |
| Unit test files   | 41     | 68    |
| Integration tests | 4      | 11    |
| Integration files | 2      | 5     |

## New Unit Test Files

weapon-options, shield-utils, resolution, input-config, thruster-config, speed-boost/index, ship-types, arc-shot-effect, crescent-beam-effect, dragon-charged-ball-effect, dragon-shield-effect, turtle-shield-effect, wolf-beam-effect, charged-ball-projectile, homing-crescent-projectile, turtle-spread-projectile, charged-ball-pool, homing-crescent-pool, turtle-spread-pool, boss-weapon, dragon-primary-weapon, dragon-secondary, turtle-secondary, wolf-secondary, dragon-ship, boss-controller, boss-placeholder

## New Integration Tests

- Boot → Gameplay
- Results → Boot (victory Continue, defeat Menu)
- Results → Gameplay (victory Retry, defeat Retry)
- Gameplay → Results (game over)
- Turtle spread combat flow
