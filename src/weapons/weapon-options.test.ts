import { describe, it, expect } from 'vitest';
import {
  getWingTipMuzzlePositions,
  type PrimaryWeaponOptions,
} from './weapon-options';

describe('weapon-options', () => {
  describe('getWingTipMuzzlePositions', () => {
    it('returns leftX at 25% of ship width from shipX', () => {
      const opts: PrimaryWeaponOptions = {
        shipX: 100,
        shipY: 200,
        shipSize: 100,
        attack: 20,
        spawnTime: 0,
      };
      const result = getWingTipMuzzlePositions(opts);
      expect(result.leftX).toBe(100 + 100 * 0.25);
      expect(result.leftX).toBe(125);
    });

    it('returns rightX at 75% of ship width from shipX', () => {
      const opts: PrimaryWeaponOptions = {
        shipX: 100,
        shipY: 200,
        shipSize: 100,
        attack: 20,
        spawnTime: 0,
      };
      const result = getWingTipMuzzlePositions(opts);
      expect(result.rightX).toBe(100 + 100 * 0.75);
      expect(result.rightX).toBe(175);
    });

    it('returns y at 45% of ship size from shipY', () => {
      const opts: PrimaryWeaponOptions = {
        shipX: 100,
        shipY: 200,
        shipSize: 100,
        attack: 20,
        spawnTime: 0,
      };
      const result = getWingTipMuzzlePositions(opts);
      expect(result.y).toBe(200 + 100 * 0.45);
      expect(result.y).toBe(245);
    });

    it('handles zero shipSize', () => {
      const opts: PrimaryWeaponOptions = {
        shipX: 50,
        shipY: 50,
        shipSize: 0,
        attack: 10,
        spawnTime: 0,
      };
      const result = getWingTipMuzzlePositions(opts);
      expect(result).toEqual({ leftX: 50, rightX: 50, y: 50 });
    });
  });
});
