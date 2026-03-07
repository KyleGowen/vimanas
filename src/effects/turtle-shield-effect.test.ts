import { describe, it, expect } from 'vitest';
import {
  drawTurtleShieldZone,
  drawTurtleShieldSphere,
  TURTLE_SHIELD_RADIUS_PX,
} from './turtle-shield-effect';
import { createMockCanvasContext } from '../test-utils';

describe('turtle-shield-effect', () => {
  describe('drawTurtleShieldZone', () => {
    it('does not throw with typical params', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawTurtleShieldZone(ctx, 100, 200, 100, 100, 80, 1)
      ).not.toThrow();
    });
  });

  describe('drawTurtleShieldSphere', () => {
    it('does not throw when age is within lifetime', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawTurtleShieldSphere(ctx, 100, 200, 30, 1, 0.5, 2)
      ).not.toThrow();
    });

    it('does not throw when age is 0', () => {
      const ctx = createMockCanvasContext();
      expect(() =>
        drawTurtleShieldSphere(ctx, 50, 50, 20, 0, 0, 1)
      ).not.toThrow();
    });
  });

  describe('TURTLE_SHIELD_RADIUS_PX', () => {
    it('is 165', () => {
      expect(TURTLE_SHIELD_RADIUS_PX).toBe(165);
    });
  });
});
