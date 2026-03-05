import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameplayScene } from './gameplay-scene';
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
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isEscapePressed: () => false,
    } as GameContext['input'],
    width: 1280,
    height: 720,
    deltaTime: 0.016,
    goToScene: () => {},
  };
}

describe('GameplayScene', () => {
  let scene: GameplayScene;
  let ctx: GameContext;

  beforeEach(() => {
    scene = new GameplayScene();
    ctx = createMockContext();
    vi.stubGlobal('performance', { now: () => 0 });
  });

  it('initializes ship position on enter', () => {
    scene.enter(ctx);
    scene.update(ctx);
    scene.draw(ctx);
    expect(ctx.ctx.fillStyle).toBeDefined();
  });

  it('moves ship when getMoveAxis returns non-zero', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 1, y: 0 }),
      isFirePressed: () => false,
      isEscapePressed: () => false,
    } as GameContext['input'];
    scene.enter(ctx);
    const initialX = (scene as unknown as { shipX: number }).shipX;
    scene.update(ctx);
    const afterX = (scene as unknown as { shipX: number }).shipX;
    expect(afterX).toBeGreaterThan(initialX);
  });

  it('toggles pause when Escape pressed', () => {
    let escapeCount = 0;
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isEscapePressed: () => ++escapeCount >= 1,
    } as GameContext['input'];
    scene.enter(ctx);
    scene.update(ctx);
    expect((scene as unknown as { paused: boolean }).paused).toBe(true);
  });

  it('spawns projectile when isFirePressed', () => {
    vi.stubGlobal('performance', { now: () => 1000 });
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    scene.enter(ctx);
    scene.update(ctx);
    expect((scene as unknown as { projectiles: unknown[] }).projectiles.length).toBeGreaterThan(0);
  });
});
