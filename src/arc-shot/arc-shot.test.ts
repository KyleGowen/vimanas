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
    expect(arc.update(0.2, { gameTime: 0.2 })).toBe(true);
    expect(arc.update(0.21, { gameTime: 0.21 })).toBe(false);
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
    expect(arc.overlapsRect(200, 200, 30, 30)).toBe(false);
    expect(arc.overlapsRect(50, 50, 20, 20)).toBe(false);
    expect(arc.overlapsRect(100, 300, 20, 20)).toBe(false);
  });

  it('ARC_SHOT_DURATION_S is 0.2', () => {
    expect(ARC_SHOT_DURATION_S).toBe(0.2);
  });

  it('ARC_LENGTH_PX and ARC_WIDTH_PX are 120', () => {
    expect(ARC_LENGTH_PX).toBe(120);
    expect(ARC_WIDTH_PX).toBe(120);
  });
});
