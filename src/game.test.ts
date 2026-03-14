import { describe, it, expect, beforeEach } from 'vitest';
import { Game, parseLevelIdFromSearch } from './game';
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

describe('parseLevelIdFromSearch (8.6)', () => {
  it('returns level id from ?level= query', () => {
    expect(parseLevelIdFromSearch('?level=level_city_metropolis_1')).toBe('level_city_metropolis_1');
  });

  it('returns undefined when level param is missing', () => {
    expect(parseLevelIdFromSearch('')).toBeUndefined();
    expect(parseLevelIdFromSearch('?foo=bar')).toBeUndefined();
  });

  it('returns undefined when level param is empty', () => {
    expect(parseLevelIdFromSearch('?level=')).toBeUndefined();
  });
});
