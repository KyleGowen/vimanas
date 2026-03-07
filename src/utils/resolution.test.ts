import { describe, it, expect, afterEach } from 'vitest';
import { pickLargest16x9InViewport } from './resolution';

describe('resolution', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      writable: true,
    });
  });

  it('returns 640x360 for small viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 640, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 360, writable: true });
    expect(pickLargest16x9InViewport()).toEqual([640, 360]);
  });

  it('returns 1280x720 for 1280x720 viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1280,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 720,
      writable: true,
    });
    expect(pickLargest16x9InViewport()).toEqual([1280, 720]);
  });

  it('returns largest fit for 1920x1080 viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 1920,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 1080,
      writable: true,
    });
    expect(pickLargest16x9InViewport()).toEqual([1920, 1080]);
  });

  it('returns 640x360 when viewport is smaller than smallest option', () => {
    Object.defineProperty(window, 'innerWidth', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 100, writable: true });
    expect(pickLargest16x9InViewport()).toEqual([640, 360]);
  });

  it('picks 854x480 for 900x500 viewport', () => {
    Object.defineProperty(window, 'innerWidth', { value: 900, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 500, writable: true });
    expect(pickLargest16x9InViewport()).toEqual([854, 480]);
  });
});
