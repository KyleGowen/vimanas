import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BootScene } from './boot-scene';
import type { GameContext } from '../game';

import { createMockCanvasContext } from '../test-utils';

vi.mock('../assets/asset-loader', () => ({
  loadImage: vi.fn().mockResolvedValue({ width: 1280, height: 720 } as HTMLImageElement),
}));

function createMockContext(
  deltaTime: number,
  options: { isStartPressed?: boolean; consumeClick?: { x: number; y: number } | null } = {}
): GameContext {
  const { isStartPressed = false, consumeClick = null } = options;
  const canvas = document.createElement('canvas');
  const ctx = createMockCanvasContext();
  return {
    canvas,
    ctx,
    input: {
      isStartPressed: () => isStartPressed,
      consumeClick: () => consumeClick,
    } as GameContext['input'],
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
    goToScene = vi.fn() as unknown as (id: 'boot' | 'gameplay' | 'shipSelect') => void;
  });

  it('does not transition when no input', () => {
    const ctx = createMockContext(0);
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(createMockContext(0.016));
    scene.update(createMockContext(0.016));
    expect(goToScene).not.toHaveBeenCalled();
  });

  it('transitions to shipSelect immediately when isStartPressed', () => {
    const ctx = createMockContext(0, { isStartPressed: true });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('shipSelect');
  });

  it('transitions to shipSelect when click anywhere', () => {
    const ctx = createMockContext(0, { consumeClick: { x: 100, y: 200 } });
    ctx.goToScene = goToScene;
    scene.enter(ctx);
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('shipSelect');
  });

  it('loads title screen image on enter', async () => {
    const { loadImage } = await import('../assets/asset-loader');
    const ctx = createMockContext(0);
    scene.enter(ctx);
    expect(loadImage).toHaveBeenCalledWith('/images/title_screen.png');
  });
});
