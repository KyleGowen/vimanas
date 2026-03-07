import { describe, it, expect } from 'vitest';
import {
  fireTurtleSpread,
  TURTLE_SECONDARY_MANA_COST,
  TURTLE_SECONDARY_FIRE_RATE_S,
  TURTLE_SPREAD_SPEED_PX_S,
} from './turtle-secondary';

describe('turtle-secondary', () => {
  const opts = {
    shipX: 100,
    shipY: 200,
    shipSize: 100,
    attack: 20,
    spawnTime: 1,
  };

  it('fireTurtleSpread returns 8 projectile options', () => {
    const result = fireTurtleSpread(opts);
    expect(result).toHaveLength(8);
  });

  it('all projectiles have same origin', () => {
    const result = fireTurtleSpread(opts);
    const originX = 100 + 50;
    const originY = 200 + 80;
    for (const p of result) {
      expect(p.x).toBe(originX);
      expect(p.y).toBe(originY);
    }
  });

  it('projectiles spread in 8 directions', () => {
    const result = fireTurtleSpread(opts);
    const velocities = result.map((p) => [p.vx, p.vy]);
    const unique = new Set(velocities.map((v) => v.join(',')));
    expect(unique.size).toBe(8);
  });

  it('TURTLE_SECONDARY_MANA_COST is 5', () => {
    expect(TURTLE_SECONDARY_MANA_COST).toBe(5);
  });

  it('TURTLE_SECONDARY_FIRE_RATE_S is 1.5', () => {
    expect(TURTLE_SECONDARY_FIRE_RATE_S).toBe(1.5);
  });

  it('TURTLE_SPREAD_SPEED_PX_S is 135', () => {
    expect(TURTLE_SPREAD_SPEED_PX_S).toBe(135);
  });
});
