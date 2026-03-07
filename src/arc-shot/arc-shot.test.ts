import { describe, it, expect } from 'vitest';
import { ArcShot, ARC_SHOT_DURATION_S, ARC_LENGTH_PX, ARC_WIDTH_PX } from './arc-shot';

describe('ArcShot', () => {
  it('expires after duration', () => {
    const arc = new ArcShot({
      x: 100,
      y: 200,
      damage: 4,
      spawnTime: 0,
    });
    expect(arc.update(0, { gameTime: 0 })).toBe(true);
    expect(arc.update(0.1, { gameTime: 0.1 })).toBe(true);
    expect(arc.update(0.3, { gameTime: 0.3 })).toBe(true);
    expect(arc.update(0.32, { gameTime: 0.32 })).toBe(false);
  });

  it('overlapsRect returns true when enemy in arc AABB', () => {
    const arc = new ArcShot({
      x: 100,
      y: 200,
      damage: 4,
      spawnTime: 0,
    });
    expect(arc.overlapsRect(90, 150, 30, 30)).toBe(true);
    expect(arc.overlapsRect(100, 100, 20, 20)).toBe(true);
    expect(arc.overlapsRect(140, 180, 25, 25)).toBe(true);
  });

  it('overlapsRect returns false when enemy outside arc AABB', () => {
    const arc = new ArcShot({
      x: 100,
      y: 200,
      damage: 4,
      spawnTime: 0,
    });
    expect(arc.overlapsRect(250, 100, 30, 30)).toBe(false);
    expect(arc.overlapsRect(50, 250, 20, 20)).toBe(false);
    expect(arc.overlapsRect(100, 300, 20, 20)).toBe(false);
  });

  it('ARC_SHOT_DURATION_S is 0.3125', () => {
    expect(ARC_SHOT_DURATION_S).toBe(0.3125);
  });

  it('ARC_LENGTH_PX is 160, ARC_WIDTH_PX is 298', () => {
    expect(ARC_LENGTH_PX).toBe(160);
    expect(ARC_WIDTH_PX).toBe(298);
  });

  it('hitTargets tracks enemies hit once per arc, cleared on reset', () => {
    const arc = new ArcShot({ x: 100, y: 200, damage: 4, spawnTime: 0 });
    const enemy1 = {};
    const enemy2 = {};
    expect(arc.hitTargets.has(enemy1)).toBe(false);
    arc.hitTargets.add(enemy1);
    expect(arc.hitTargets.has(enemy1)).toBe(true);
    expect(arc.hitTargets.has(enemy2)).toBe(false);
    arc.hitTargets.add(enemy2);
    expect(arc.hitTargets.has(enemy2)).toBe(true);
    arc.reset({ x: 50, y: 100, damage: 2, spawnTime: 1 });
    expect(arc.hitTargets.has(enemy1)).toBe(false);
    expect(arc.hitTargets.has(enemy2)).toBe(false);
  });
});
