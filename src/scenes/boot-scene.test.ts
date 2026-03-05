import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BootScene } from './boot-scene';
import type { GameContext } from '../game';

import { createMockCanvasContext } from '../test-utils';

function createMockContext(deltaTime: number): GameContext {
  const canvas = document.createElement('canvas');
  const ctx = createMockCanvasContext();
  return {
    canvas,
    ctx,
    input: {} as GameContext['input'],
    width: 1280,
    height: 720,
    deltaTime,
    goToScene: () => {},
  };
}

describe('BootScene', () => {
  let scene: BootScene;
  let goToScene: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scene = new BootScene();
    goToScene = vi.fn() as unknown as (id: 'boot' | 'mainmenu' | 'gameplay') => void;
  });

  it('transitions to mainmenu after 1.5s', () => {
    const ctx = createMockContext(0);
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(createMockContext(1.0));
    expect(goToScene).not.toHaveBeenCalled();
    scene.update(createMockContext(0.5));
    expect(goToScene).toHaveBeenCalledWith('mainmenu');
  });

  it('does not transition before 1.5s', () => {
    const ctx = createMockContext(0);
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(createMockContext(1.4));
    expect(goToScene).not.toHaveBeenCalled();
  });
});
