import { describe, it, expect } from 'vitest';
import {
  drawArcShot,
  TURTLE_ARC_PALETTE,
  TURTLE_ARC_DRAW_CONFIG,
} from './arc-shot-effect';
import { createMockCanvasContext } from '../test-utils';

describe('arc-shot-effect', () => {
  describe('drawArcShot', () => {
    it('does not throw when age is within duration', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawArcShot(ctx, 100, 200, 1, 0, 2, TURTLE_ARC_DRAW_CONFIG)
      ).not.toThrow();
    });

    it('does not throw when age is 0', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawArcShot(ctx, 100, 200, 0, 0, 2, TURTLE_ARC_DRAW_CONFIG)
      ).not.toThrow();
    });

    it('does not throw with custom config', () => {
      const ctx = createMockCanvasContext();
      const config = {
        ...TURTLE_ARC_DRAW_CONFIG,
        numLayers: 2,
        pulseFreq: 8,
      };
      expect(() =>
        drawArcShot(ctx, 50, 100, 0.5, 0, 1, config)
      ).not.toThrow();
    });
  });

  describe('TURTLE_ARC_PALETTE', () => {
    it('has core, edge, fade', () => {
      expect(TURTLE_ARC_PALETTE.core).toBe('#FFFFCC');
      expect(TURTLE_ARC_PALETTE.edge).toBe('#FF8800');
      expect(TURTLE_ARC_PALETTE.fade).toContain('rgba');
    });
  });
});
