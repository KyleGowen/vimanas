import { describe, it, expect } from 'vitest';
import { drawDragonChargedBall } from './dragon-charged-ball-effect';
import { createMockCanvasContext } from '../test-utils';

describe('dragon-charged-ball-effect', () => {
  describe('drawDragonChargedBall', () => {
    it('does not throw with typical params', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawDragonChargedBall(ctx, 100, 200, 40, 1)
      ).not.toThrow();
    });

    it('does not throw with zero radius', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawDragonChargedBall(ctx, 50, 50, 0, 0)
      ).not.toThrow();
    });
  });
});
