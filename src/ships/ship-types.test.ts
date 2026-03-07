import { describe, it, expect } from 'vitest';
import type { PlayAreaBounds, ShipStatsBase } from './ship-types';

describe('ship-types', () => {
  it('PlayAreaBounds has required fields', () => {
    const bounds: PlayAreaBounds = {
      minX: 0,
      maxX: 1280,
      minY: 0,
      maxY: 720,
    };
    expect(bounds.minX).toBe(0);
    expect(bounds.maxX).toBe(1280);
    expect(bounds.minY).toBe(0);
    expect(bounds.maxY).toBe(720);
  });

  it('ShipStatsBase extends movement config with combat stats', () => {
    const stats: ShipStatsBase = {
      speed: 42,
      forwardSpeed: 52.5,
      backwardSpeed: 37.8,
      leftSpeed: 46,
      rightSpeed: 46,
      hp: 28,
      defense: 12,
      attack: 20,
      mana: 19,
      manaRegenRate: 3,
    };
    expect(stats.hp).toBe(28);
    expect(stats.attack).toBe(20);
    expect(stats.manaRegenRate).toBe(3);
  });
});
