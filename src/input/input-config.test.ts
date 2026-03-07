import { describe, it, expect } from 'vitest';
import { SHIELD_KEY_CODES } from './input-config';

describe('input-config', () => {
  it('exports SHIELD_KEY_CODES as array', () => {
    expect(Array.isArray(SHIELD_KEY_CODES)).toBe(true);
  });

  it('SHIELD_KEY_CODES contains expected keys', () => {
    expect(SHIELD_KEY_CODES).toContain('ShiftLeft');
    expect(SHIELD_KEY_CODES).toContain('ShiftRight');
    expect(SHIELD_KEY_CODES).toContain('KeyI');
  });

  it('SHIELD_KEY_CODES has length 3', () => {
    expect(SHIELD_KEY_CODES).toHaveLength(3);
  });
});
