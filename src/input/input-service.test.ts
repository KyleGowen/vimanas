import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputService } from './input-service';

describe('InputService', () => {
  let input: InputService;

  beforeEach(() => {
    input = new InputService();
    input.init();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('keyboard input', () => {
    it('isKeyDown returns false when key not pressed', () => {
      expect(input.isKeyDown('KeyW')).toBe(false);
      expect(input.isKeyDown('Space')).toBe(false);
    });

    it('isKeyDown returns true after keydown', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
      expect(input.isKeyDown('KeyW')).toBe(true);
    });

    it('isKeyDown returns false after keyup', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' }));
      expect(input.isKeyDown('KeyW')).toBe(false);
    });

    it('getMoveAxis returns (0,0) when no keys', () => {
      expect(input.getMoveAxis()).toEqual({ x: 0, y: 0 });
    });

    it('getMoveAxis returns correct axis for WASD', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
      expect(input.getMoveAxis()).toEqual({ x: 0, y: -1 });

      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' }));
      expect(input.getMoveAxis()).toEqual({ x: 0, y: 0 });

      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyS' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
      expect(input.getMoveAxis()).toEqual({ x: -1, y: 0 });

      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyA' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }));
      expect(input.getMoveAxis()).toEqual({ x: 1, y: 0 });
    });

    it('isFirePressed returns true when Space pressed', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      expect(input.isFirePressed()).toBe(true);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }));
      expect(input.isFirePressed()).toBe(false);
    });

    it('isSecondaryFirePressed returns true when KeyJ pressed', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ' }));
      expect(input.isSecondaryFirePressed()).toBe(true);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyJ' }));
      expect(input.isSecondaryFirePressed()).toBe(false);
    });

    it('isShieldPressed returns true when KeyI pressed', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyI' }));
      expect(input.isShieldPressed()).toBe(true);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyI' }));
      expect(input.isShieldPressed()).toBe(false);
    });

    it('isEscapePressed returns true when Escape pressed', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
      expect(input.isEscapePressed()).toBe(true);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Escape' }));
      expect(input.isEscapePressed()).toBe(false);
    });

    it('isStartPressed returns true for Enter or Space', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }));
      expect(input.isStartPressed()).toBe(true);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Enter' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      expect(input.isStartPressed()).toBe(true);
    });

    it('isPrimaryActionPressed returns true for Enter', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }));
      expect(input.isPrimaryActionPressed()).toBe(true);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Enter' }));
      expect(input.isPrimaryActionPressed()).toBe(false);
    });

    it('isRetryPressed returns true for KeyR', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' }));
      expect(input.isRetryPressed()).toBe(true);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyR' }));
      expect(input.isRetryPressed()).toBe(false);
    });

    it('isMenuPressed returns true for Escape', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
      expect(input.isMenuPressed()).toBe(true);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Escape' }));
      expect(input.isMenuPressed()).toBe(false);
    });

    it('getMenuNavigateX returns -1 for ArrowLeft', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
      expect(input.getMenuNavigateX()).toBe(-1);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }));
      expect(input.getMenuNavigateX()).toBe(0);
    });

    it('getMenuNavigateX returns 1 for ArrowRight', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
      expect(input.getMenuNavigateX()).toBe(1);
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }));
      expect(input.getMenuNavigateX()).toBe(0);
    });
  });

  describe('isClickInBounds', () => {
    it('returns true when click inside bounds', () => {
      expect(input.isClickInBounds(0, 0, 100, 50, 50, 25)).toBe(true);
      expect(input.isClickInBounds(10, 20, 80, 40, 10, 20)).toBe(true);
      expect(input.isClickInBounds(10, 20, 80, 40, 89, 59)).toBe(true);
    });

    it('returns false when click outside bounds', () => {
      expect(input.isClickInBounds(0, 0, 100, 50, 101, 25)).toBe(false);
      expect(input.isClickInBounds(0, 0, 100, 50, 50, 51)).toBe(false);
      expect(input.isClickInBounds(10, 20, 80, 40, 9, 25)).toBe(false);
    });
  });

  describe('consumeClick', () => {
    it('returns null when no click', () => {
      expect(input.consumeClick()).toBeNull();
    });
  });
});
