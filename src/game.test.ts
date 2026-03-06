import { describe, it, expect, beforeEach } from 'vitest';
import { Game } from './game';
import { createMockCanvasContext } from './test-utils';

function createCanvasAndContext(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  return { canvas, ctx: createMockCanvasContext() };
}

describe('Game', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    const setup = createCanvasAndContext();
    canvas = setup.canvas;
    ctx = setup.ctx;
  });

  it('constructs successfully', () => {
    const game = new Game(canvas, ctx);
    expect(game).toBeDefined();
  });

  it('goToScene switches to gameplay without throwing', () => {
    const game = new Game(canvas, ctx);
    game.goToScene('gameplay');
    expect(game).toBeDefined();
  });

  it('goToScene switches to results with state', () => {
    const game = new Game(canvas, ctx);
    game.goToScene('results', { victory: true, score: 1000, lives: 1 });
    expect(game).toBeDefined();
  });
});
