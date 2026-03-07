import { describe, it, expect } from 'vitest';
import {
  applySpeedBoost,
  DEFAULT_SPEED_BOOST_CONFIG,
  type SpeedBoostInput,
} from './index';

describe('speed-boost index', () => {
  it('re-exports applySpeedBoost', () => {
    const input: SpeedBoostInput = { isKeyDown: () => false };
    expect(applySpeedBoost(0.016, input)).toBe(0.016);
  });

  it('re-exports DEFAULT_SPEED_BOOST_CONFIG', () => {
    expect(DEFAULT_SPEED_BOOST_CONFIG.keyCode).toBe('Period');
    expect(DEFAULT_SPEED_BOOST_CONFIG.multiplier).toBe(5);
  });

  it('applySpeedBoost with key held uses default config', () => {
    const input: SpeedBoostInput = { isKeyDown: (c) => c === 'Period' };
    expect(applySpeedBoost(0.016, input)).toBe(0.08);
  });
});
