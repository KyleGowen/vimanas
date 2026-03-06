import { describe, it, expect } from 'vitest';
import { aabbOverlap } from './collision';

describe('aabbOverlap', () => {
  it('returns true when rects overlap', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 5, y: 5, width: 10, height: 10 };
    expect(aabbOverlap(a, b)).toBe(true);
  });

  it('returns false when rects do not overlap', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 20, y: 20, width: 10, height: 10 };
    expect(aabbOverlap(a, b)).toBe(false);
  });

  it('returns true when rects touch at edge', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 10, y: 0, width: 10, height: 10 };
    expect(aabbOverlap(a, b)).toBe(true);
  });

  it('returns true when rects share a corner (edge-inclusive overlap)', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 10, y: 10, width: 10, height: 10 };
    expect(aabbOverlap(a, b)).toBe(true);
  });

  it('returns true when one rect contains the other', () => {
    const a = { x: 0, y: 0, width: 100, height: 100 };
    const b = { x: 25, y: 25, width: 50, height: 50 };
    expect(aabbOverlap(a, b)).toBe(true);
  });
});
