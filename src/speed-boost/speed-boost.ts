import type { SpeedBoostConfig } from './speed-boost-config';
import { DEFAULT_SPEED_BOOST_CONFIG } from './speed-boost-config';

/** Minimal input interface for speed boost (avoids coupling to InputService). */
export interface SpeedBoostInput {
  isKeyDown(code: string): boolean;
}

/**
 * Apply speed boost to deltaTime when the configured key is held.
 * @returns Scaled deltaTime (original * multiplier when key held, else original)
 */
export function applySpeedBoost(
  deltaTime: number,
  input: SpeedBoostInput,
  config: SpeedBoostConfig = DEFAULT_SPEED_BOOST_CONFIG
): number {
  if (input.isKeyDown(config.keyCode)) {
    return deltaTime * config.multiplier;
  }
  return deltaTime;
}
