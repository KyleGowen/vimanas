import { describe, it, expect } from 'vitest';
import {
  drawEnergyRing,
  SPARROW_ENERGY_RING_CONFIG,
  SPARROW_ENERGY_RING_PALETTE,
  type EnergyRingConfig,
} from './energy-ring-effect';
import { createMockCanvasContext } from '../test-utils';

describe('drawEnergyRing', () => {
  it('does not throw with zero radius', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawEnergyRing(ctx, 100, 200, 0, 0, SPARROW_ENERGY_RING_CONFIG)
    ).not.toThrow();
  });

  it('does not throw with typical radius', () => {
    const ctx = createMockCanvasContext();
    expect(() =>
      drawEnergyRing(ctx, 100, 200, 16, 0.5, SPARROW_ENERGY_RING_CONFIG)
    ).not.toThrow();
  });

  it('does not throw with custom config', () => {
    const ctx = createMockCanvasContext();
    const config: EnergyRingConfig = {
      palette: SPARROW_ENERGY_RING_PALETTE,
      innerRadiusRatio: 0.9,
      radiusXScale: 1.2,
      radiusYScale: 0.5,
    };
    expect(() =>
      drawEnergyRing(ctx, 50, 100, 20, 1, config)
    ).not.toThrow();
  });
});

describe('presets', () => {
  it('SPARROW_ENERGY_RING_PALETTE has cyan core', () => {
    expect(SPARROW_ENERGY_RING_PALETTE.core).toBe('#00FFFF');
    expect(SPARROW_ENERGY_RING_PALETTE.mid).toBe('#0088CC');
    expect(SPARROW_ENERGY_RING_PALETTE.tip).toContain('rgba');
  });

  it('SPARROW_ENERGY_RING_CONFIG has elliptical shape', () => {
    expect(SPARROW_ENERGY_RING_CONFIG.radiusXScale).toBe(1.4);
    expect(SPARROW_ENERGY_RING_CONFIG.radiusYScale).toBe(0.45);
  });
});
