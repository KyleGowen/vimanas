import { describe, it, expect } from 'vitest';
import {
  applyMovement,
  SCOUT_SPEED_PX_S,
} from './scout-movement';

describe('scout-movement', () => {
  const spawnX = 200;
  const spawnY = 100;
  const spawnTime = 10;

  describe('straight', () => {
    it('keeps x constant and increases y by speed * t', () => {
      const r = applyMovement('straight', spawnX, spawnY, spawnTime, 11);
      expect(r.x).toBe(200);
      expect(r.y).toBe(100 + SCOUT_SPEED_PX_S * 1);
    });

    it('at t=0 returns spawn position', () => {
      const r = applyMovement('straight', spawnX, spawnY, spawnTime, spawnTime);
      expect(r.x).toBe(spawnX);
      expect(r.y).toBe(spawnY);
    });
  });

  describe('zig_zag', () => {
    it('keeps y same as straight, x oscillates', () => {
      const r = applyMovement('zig_zag', spawnX, spawnY, spawnTime, spawnTime + 0.5);
      expect(r.y).toBe(100 + SCOUT_SPEED_PX_S * 0.5);
      expect(r.x).not.toBe(spawnX);
    });

    it('at t=0 returns spawn position', () => {
      const r = applyMovement('zig_zag', spawnX, spawnY, spawnTime, spawnTime);
      expect(r.x).toBe(spawnX);
      expect(r.y).toBe(spawnY);
    });

    it('at t=1 x is at peak (sin(π/2)=1)', () => {
      const r = applyMovement('zig_zag', spawnX, spawnY, spawnTime, spawnTime + 1);
      expect(r.x).toBe(spawnX + 135);
    });
  });

  describe('scatter_converge', () => {
    it('with centerX moves x toward center over time', () => {
      const leftSpawn = 100;
      const centerX = 400;
      const r = applyMovement(
        'scatter_converge',
        leftSpawn,
        spawnY,
        spawnTime,
        spawnTime + 3,
        { centerX }
      );
      expect(r.x).toBeGreaterThan(leftSpawn);
      expect(r.x).toBeLessThanOrEqual(centerX + 20);
    });
  });

  describe('pincer_swoop', () => {
    it('moves x toward centerX', () => {
      const r = applyMovement(
        'pincer_swoop',
        100,
        spawnY,
        spawnTime,
        spawnTime + 2,
        { centerX: 400 }
      );
      expect(r.x).toBeGreaterThan(100);
      expect(r.x).toBeLessThan(400);
    });
  });

  describe('swoop_in_out', () => {
    it('starts at spawn, moves to center, then back', () => {
      const left = 100;
      const centerX = 400;
      const atStart = applyMovement('swoop_in_out', left, spawnY, spawnTime, spawnTime, { centerX });
      expect(atStart.x).toBe(left);
      const atIn = applyMovement('swoop_in_out', left, spawnY, spawnTime, spawnTime + 1.2, { centerX });
      expect(atIn.x).toBeCloseTo(centerX);
      const atHold = applyMovement('swoop_in_out', left, spawnY, spawnTime, spawnTime + 1.5, { centerX });
      expect(atHold.x).toBeCloseTo(centerX);
      const afterOut = applyMovement('swoop_in_out', left, spawnY, spawnTime, spawnTime + 3, { centerX });
      expect(afterOut.x).toBeCloseTo(left);
    });
  });

  describe('dive_arc', () => {
    it('moves toward center while descending', () => {
      const r = applyMovement('dive_arc', 100, spawnY, spawnTime, spawnTime + 2, { centerX: 400 });
      expect(r.x).toBeGreaterThan(100);
      expect(r.y).toBe(spawnY + SCOUT_SPEED_PX_S * 2);
    });
  });

  describe('sniper_pause', () => {
    it('pauses y for duration then resumes', () => {
      const beforePause = applyMovement('sniper_pause', spawnX, spawnY, spawnTime, spawnTime + 1);
      const duringPause = applyMovement('sniper_pause', spawnX, spawnY, spawnTime, spawnTime + 2.5);
      const afterPause = applyMovement('sniper_pause', spawnX, spawnY, spawnTime, spawnTime + 4);
      expect(beforePause.y).toBeLessThan(duringPause.y);
      expect(afterPause.y).toBeGreaterThan(duringPause.y);
    });
  });

  describe('column_advance', () => {
    it('behaves like straight', () => {
      const r = applyMovement('column_advance', spawnX, spawnY, spawnTime, spawnTime + 1);
      expect(r.x).toBe(spawnX);
      expect(r.y).toBe(spawnY + SCOUT_SPEED_PX_S * 1);
    });
  });

  describe('negative t', () => {
    it('clamps t to 0 so position is spawn', () => {
      const r = applyMovement('straight', spawnX, spawnY, spawnTime, spawnTime - 1);
      expect(r.x).toBe(spawnX);
      expect(r.y).toBe(spawnY);
    });
  });
});
