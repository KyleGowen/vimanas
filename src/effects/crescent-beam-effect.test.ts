import { describe, it, expect } from 'vitest';
import { drawCrescentBeam } from './crescent-beam-effect';
import { createMockCanvasContext } from '../test-utils';

describe('crescent-beam-effect', () => {
  describe('drawCrescentBeam', () => {
    it('does not throw with zero velocity (fallback direction)', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawCrescentBeam(ctx, 100, 200, 0, 0, 1)
      ).not.toThrow();
    });

    it('does not throw with typical velocity', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawCrescentBeam(ctx, 100, 200, 50, -100, 1)
      ).not.toThrow();
    });

    it('does not throw with horizontal velocity', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawCrescentBeam(ctx, 100, 200, 1, 0, 0.5)
      ).not.toThrow();
    });
  });
});
