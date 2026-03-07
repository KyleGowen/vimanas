import { describe, it, expect } from 'vitest';
import {
  drawWolfSustainedBeam,
  WOLF_BEAM_GROWTH_RATE,
  WOLF_BEAM_WIDTH,
} from './wolf-beam-effect';
import { createMockCanvasContext } from '../test-utils';

describe('wolf-beam-effect', () => {
  describe('drawWolfSustainedBeam', () => {
    it('does not throw with typical params', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawWolfSustainedBeam(ctx, 100, 200, 1, 100)
      ).not.toThrow();
    });

    it('does not throw with zero length', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawWolfSustainedBeam(ctx, 100, 200, 0, 0)
      ).not.toThrow();
    });

    it('does not throw with short length (taper only)', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawWolfSustainedBeam(ctx, 100, 200, 0.5, 10)
      ).not.toThrow();
    });
  });

  describe('constants', () => {
    it('WOLF_BEAM_GROWTH_RATE is 620', () => {
      expect(WOLF_BEAM_GROWTH_RATE).toBe(620);
    });

    it('WOLF_BEAM_WIDTH is 14', () => {
      expect(WOLF_BEAM_WIDTH).toBe(14);
    });
  });
});
