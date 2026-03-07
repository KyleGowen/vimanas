import { describe, it, expect } from 'vitest';
import { clear, drawRect, drawImage, drawImageFit, drawText } from './renderer';

function createMockContext() {
  const calls: { method: string; args: unknown[] }[] = [];
  const ctx = {
    fillStyle: '',
    font: '',
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'alphabetic' as CanvasTextBaseline,
    fillRect: (...args: unknown[]) => calls.push({ method: 'fillRect', args }),
    drawImage: (...args: unknown[]) => calls.push({ method: 'drawImage', args }),
    fillText: (...args: unknown[]) => calls.push({ method: 'fillText', args }),
    _calls: calls,
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

describe('renderer', () => {
  describe('clear', () => {
    it('fills rect with default color', () => {
      const { ctx, calls } = createMockContext();
      clear(ctx, 100, 100);
      expect(ctx.fillStyle).toBe('#0a0a0f');
      expect(calls).toHaveLength(1);
      expect(calls[0].method).toBe('fillRect');
      expect(calls[0].args).toEqual([0, 0, 100, 100]);
    });

    it('fills rect with custom color', () => {
      const { ctx, calls } = createMockContext();
      clear(ctx, 200, 150, '#ff0000');
      expect(ctx.fillStyle).toBe('#ff0000');
      expect(calls[0].args).toEqual([0, 0, 200, 150]);
    });
  });

  describe('drawRect', () => {
    it('draws rect at position with color', () => {
      const { ctx, calls } = createMockContext();
      drawRect(ctx, 10, 20, 30, 40, '#00FFFF');
      expect(ctx.fillStyle).toBe('#00FFFF');
      expect(calls[0].args).toEqual([10, 20, 30, 40]);
    });
  });

  describe('drawImage', () => {
    it('draws image with dimensions', () => {
      const { ctx, calls } = createMockContext();
      const img = document.createElement('img');
      drawImage(ctx, img, 5, 10, 64, 64);
      expect(calls[0].method).toBe('drawImage');
      expect(calls[0].args).toEqual([img, 5, 10, 64, 64]);
    });

    it('draws image without dimensions', () => {
      const { ctx, calls } = createMockContext();
      const img = document.createElement('img');
      drawImage(ctx, img, 0, 0);
      expect(calls[0].args).toEqual([img, 0, 0]);
    });
  });

  describe('drawImageFit', () => {
    it('preserves aspect ratio and centers non-square image in target rect', () => {
      const { ctx, calls } = createMockContext();
      const img = document.createElement('img');
      Object.defineProperty(img, 'naturalWidth', { value: 200 });
      Object.defineProperty(img, 'naturalHeight', { value: 100 });
      drawImageFit(ctx, img, 10, 20, 100, 100);
      expect(calls[0].method).toBe('drawImage');
      // 200x100 fits in 100x100: scale = min(0.5, 1) = 0.5 → draw 100x50, pad (0, 25)
      expect(calls[0].args).toEqual([img, 10, 45, 100, 50]);
    });

    it('draws square image centered when target is square', () => {
      const { ctx, calls } = createMockContext();
      const img = document.createElement('img');
      Object.defineProperty(img, 'naturalWidth', { value: 64 });
      Object.defineProperty(img, 'naturalHeight', { value: 64 });
      drawImageFit(ctx, img, 0, 0, 100, 100);
      expect(calls[0].args).toEqual([img, 0, 0, 100, 100]);
    });

    it('falls back to stretch when image has no dimensions', () => {
      const { ctx, calls } = createMockContext();
      const img = document.createElement('img');
      drawImageFit(ctx, img, 5, 10, 64, 64);
      expect(calls[0].args).toEqual([img, 5, 10, 64, 64]);
    });
  });

  describe('drawText', () => {
    it('draws text with defaults', () => {
      const { ctx, calls } = createMockContext();
      drawText(ctx, 'Hello', 10, 20);
      expect(ctx.font).toBe('24px sans-serif');
      expect(ctx.fillStyle).toBe('#ffffff');
      expect(ctx.textAlign).toBe('left');
      expect(calls[0].args).toEqual(['Hello', 10, 20]);
    });

    it('draws text with options', () => {
      const { ctx, calls } = createMockContext();
      drawText(ctx, 'VIMANAS', 100, 50, {
        font: '48px sans-serif',
        color: '#87CEEB',
        align: 'center',
        baseline: 'middle',
      });
      expect(ctx.font).toBe('48px sans-serif');
      expect(ctx.fillStyle).toBe('#87CEEB');
      expect(ctx.textAlign).toBe('center');
      expect(ctx.textBaseline).toBe('middle');
      expect(calls[0].args).toEqual(['VIMANAS', 100, 50]);
    });
  });
});
