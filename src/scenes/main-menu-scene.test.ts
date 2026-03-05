import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MainMenuScene } from './main-menu-scene';
import type { GameContext } from '../game';

import { createMockCanvasContext } from '../test-utils';

function createMockContext(): GameContext {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = createMockCanvasContext();
  return {
    canvas,
    ctx,
    input: {
      isStartPressed: () => false,
      consumeClick: () => null,
      isClickInBounds: () => false,
    } as unknown as GameContext['input'],
    width: 1280,
    height: 720,
    deltaTime: 0.016,
    goToScene: () => {},
  };
}

describe('MainMenuScene', () => {
  let scene: MainMenuScene;
  let goToScene: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scene = new MainMenuScene();
    goToScene = vi.fn();
  });

  it('transitions to gameplay when isStartPressed', () => {
    const ctx = createMockContext();
    ctx.goToScene = goToScene;
    ctx.input = {
      ...ctx.input,
      isStartPressed: () => true,
      consumeClick: () => null,
      isClickInBounds: () => false,
    } as GameContext['input'];
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay');
  });

  it('transitions to gameplay when click in button bounds', () => {
    const ctx = createMockContext();
    ctx.goToScene = goToScene;
    ctx.input = {
      isStartPressed: () => false,
      consumeClick: () => ({ x: 640, y: 335 }),
      isClickInBounds: () => true,
    } as unknown as GameContext['input'];
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('gameplay');
  });

  it('does not transition when no input', () => {
    const ctx = createMockContext();
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).not.toHaveBeenCalled();
  });
});
