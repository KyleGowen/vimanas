import { describe, it, expect } from 'vitest';
import {
  drawWolfShieldZone,
  isEnemyInWolfFrontArc,
  WOLF_SHIELD_ARC_RADIUS_PX,
  getWolfShieldRadius,
} from './wolf-shield-effect';
import { createMockCanvasContext } from '../test-utils';

describe('Wolf shield effect', () => {
  it('drawWolfShieldZone does not throw', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawWolfShieldZone(ctx, 100, 100, 100, 100, 85, 1.5)
    ).not.toThrow();
  });

  it('WOLF_SHIELD_ARC_RADIUS_PX is computed from ship size', () => {
    const r = getWolfShieldRadius(100, 100);
    expect(r).toBe(WOLF_SHIELD_ARC_RADIUS_PX);
    expect(r).toBeGreaterThan(70);
    expect(r).toBeLessThan(100);
  });

  it('isEnemyInWolfFrontArc returns true when enemy center is in front semicircle', () => {
    const wolfX = 100;
    const wolfY = 100;
    const shipSize = 100;
    const shipWorldY = 200; // scrollOffset + wolfY + shipSize/2
    // Enemy within radius, in front (above): small dy negative
    const enemyCx = 150;
    const enemyCy = 150; // 50px above center, within radius ~85
    expect(
      isEnemyInWolfFrontArc(wolfX, wolfY, shipSize, shipWorldY, enemyCx, enemyCy)
    ).toBe(true);
  });

  it('isEnemyInWolfFrontArc returns false when enemy is behind (left half)', () => {
    const wolfX = 100;
    const wolfY = 100;
    const shipSize = 100;
    const shipWorldY = 200;
    const enemyCx = 50; // left of wolf center (150, 200)
    const enemyCy = 200;
    expect(
      isEnemyInWolfFrontArc(wolfX, wolfY, shipSize, shipWorldY, enemyCx, enemyCy)
    ).toBe(false);
  });

  it('isEnemyInWolfFrontArc returns false when enemy is beyond radius', () => {
    const wolfX = 100;
    const wolfY = 100;
    const shipSize = 100;
    const shipWorldY = 200;
    const enemyCx = 500; // far away
    const enemyCy = 100;
    expect(
      isEnemyInWolfFrontArc(wolfX, wolfY, shipSize, shipWorldY, enemyCx, enemyCy)
    ).toBe(false);
  });
});
