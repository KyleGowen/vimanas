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
