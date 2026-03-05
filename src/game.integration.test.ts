import { describe, it, expect } from 'vitest';
import { Game } from './game';
import { createMockCanvasContext } from './test-utils';

describe('Game integration', () => {
  it('boots and loads without throwing', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = createMockCanvasContext();

    const game = new Game(canvas, ctx);
    expect(() => game.start()).not.toThrow();
    expect(game).toBeDefined();
  });
});
