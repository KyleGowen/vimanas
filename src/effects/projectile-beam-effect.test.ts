import { describe, it, expect } from 'vitest';
import {
  drawProjectileBeam,
  PLAYER_PROJECTILE_BEAM_CONFIG,
  ENEMY_PROJECTILE_BEAM_CONFIG,
  PLAYER_PROJECTILE_BEAM_PALETTE,
  ENEMY_PROJECTILE_BEAM_PALETTE,
  type ProjectileBeamConfig,
} from './projectile-beam-effect';
import { createMockCanvasContext } from '../test-utils';

describe('drawProjectileBeam', () => {
  it('does not throw with zero velocity (fallback direction)', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawProjectileBeam(ctx, 100, 200, 0, 0, 1, PLAYER_PROJECTILE_BEAM_CONFIG)
    ).not.toThrow();
  });

  it('does not throw with typical player velocity (upward)', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawProjectileBeam(ctx, 100, 200, 0, -240, 1, PLAYER_PROJECTILE_BEAM_CONFIG)
    ).not.toThrow();
  });

  it('does not throw with typical enemy velocity (downward)', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawProjectileBeam(ctx, 100, 200, 0, 180, 1, ENEMY_PROJECTILE_BEAM_CONFIG)
    ).not.toThrow();
  });

  it('does not throw with custom config', () => {
    const ctx = createMockCanvasContext();
    const config: ProjectileBeamConfig = {
      palette: PLAYER_PROJECTILE_BEAM_PALETTE,
      length: 30,
      width: 8,
      numSegments: 2,
    };
    expect(() =>
      drawProjectileBeam(ctx, 50, 100, 10, -20, 0.5, config)
    ).not.toThrow();
  });
});

describe('presets', () => {
  it('PLAYER_PROJECTILE_BEAM_CONFIG has cyan palette', () => {
    expect(PLAYER_PROJECTILE_BEAM_CONFIG.palette).toEqual(
      PLAYER_PROJECTILE_BEAM_PALETTE
    );
    expect(PLAYER_PROJECTILE_BEAM_CONFIG.palette.core).toBe('#00FFFF');
  });

  it('ENEMY_PROJECTILE_BEAM_CONFIG has orange palette', () => {
    expect(ENEMY_PROJECTILE_BEAM_CONFIG.palette).toEqual(
      ENEMY_PROJECTILE_BEAM_PALETTE
    );
    expect(ENEMY_PROJECTILE_BEAM_CONFIG.palette.core).toBe('#FF8C00');
  });
});
