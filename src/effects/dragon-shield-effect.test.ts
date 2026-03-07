import { describe, it, expect } from 'vitest';
import { drawDragonMeditatingZone } from './dragon-shield-effect';
import { createMockCanvasContext } from '../test-utils';

describe('dragon-shield-effect', () => {
  describe('drawDragonMeditatingZone', () => {
    it('does not throw without sprite (fallback gradient)', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawDragonMeditatingZone(ctx, 100, 200, 100, 100, 1, null)
      ).not.toThrow();
    });

    it('does not throw without sprite (undefined)', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawDragonMeditatingZone(ctx, 50, 50, 80, 80, 0.5)
      ).not.toThrow();
    });
  });
});
