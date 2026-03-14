import { describe, it, expect } from 'vitest';
import { applySpeedBoost, type SpeedBoostInput } from './speed-boost';
import {
  DEFAULT_SPEED_BOOST_CONFIG,
  type SpeedBoostConfig,
} from './speed-boost-config';

function createMockInput(pressedKeys: Set<string>): SpeedBoostInput {
  return {
    isKeyDown: (code: string) => pressedKeys.has(code),
  };
}

describe('applySpeedBoost', () => {
  it('returns deltaTime unchanged when key not pressed', () => {
    const input = createMockInput(new Set());
    expect(applySpeedBoost(0.016, input)).toBe(0.016);
    expect(applySpeedBoost(0.1, input)).toBe(0.1);
  });

  it('returns deltaTime unchanged when different key pressed', () => {
    const input = createMockInput(new Set(['KeyW']));
    expect(applySpeedBoost(0.016, input)).toBe(0.016);
  });

  it('multiplies deltaTime by 10 when Period key held (default config)', () => {
    const input = createMockInput(new Set(['Period']));
    expect(applySpeedBoost(0.016, input)).toBe(0.16);
    expect(applySpeedBoost(0.1, input)).toBe(1);
  });

  it('uses custom keyCode when provided', () => {
    const config: SpeedBoostConfig = { keyCode: 'KeyF', multiplier: 5 };
    const input = createMockInput(new Set(['KeyF']));
    expect(applySpeedBoost(0.016, input, config)).toBe(0.08);
  });

  it('uses custom multiplier when provided', () => {
    const config: SpeedBoostConfig = { keyCode: 'Period', multiplier: 3 };
    const input = createMockInput(new Set(['Period']));
    expect(applySpeedBoost(0.016, input, config)).toBe(0.048);
  });

  it('uses custom key and multiplier together', () => {
    const config: SpeedBoostConfig = { keyCode: 'Slash', multiplier: 10 };
    const input = createMockInput(new Set(['Slash']));
    expect(applySpeedBoost(0.02, input, config)).toBe(0.2);
  });
});

describe('DEFAULT_SPEED_BOOST_CONFIG', () => {
  it('has Period key and 10× multiplier', () => {
    expect(DEFAULT_SPEED_BOOST_CONFIG.keyCode).toBe('Period');
    expect(DEFAULT_SPEED_BOOST_CONFIG.multiplier).toBe(10);
  });
});
