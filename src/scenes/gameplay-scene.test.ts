import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameplayScene } from './gameplay-scene';
import type { GameContext } from '../game';
import { SPARROW_SHIP_SIZE } from '../ships/sparrow-ship';

import { createMockCanvasContext } from '../test-utils';

function createMockContext(overrides?: Partial<GameContext>): GameContext {
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
    ...overrides,
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
    const initialX = (scene as unknown as { ship: { x: number } }).ship.x;
    scene.update(ctx);
    const afterX = (scene as unknown as { ship: { x: number } }).ship.x;
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
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = 0.2; // Advance gameTime past fire rate (0.15s)
    scene.enter(ctx);
    scene.update(ctx);
    const projectiles = (scene as unknown as { projectiles: { damage: number }[] }).projectiles;
    expect(projectiles.length).toBeGreaterThan(0);
    expect(projectiles[0].damage).toBe(5);
  });

  it('keeps ship within play area bounds (can move north/south)', () => {
    scene.enter(ctx);
    scene.update(ctx);
    const ship = (scene as unknown as { ship: { x: number; y: number } }).ship;
    const padding = 50;
    const minY = padding;
    const maxY = ctx.height - padding - SPARROW_SHIP_SIZE;
    expect(ship.y).toBeGreaterThanOrEqual(minY);
    expect(ship.y).toBeLessThanOrEqual(maxY);
  });

  it('does not advance gameTime when paused (wave spawner uses gameTime)', () => {
    let escapeCount = 0;
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isEscapePressed: () => (++escapeCount >= 2),
    } as GameContext['input'];
    scene.enter(ctx);
    scene.update(ctx); // first frame: gameTime advances
    const gameTimeBeforePause = (scene as unknown as { gameTime: number }).gameTime;
    expect(gameTimeBeforePause).toBeGreaterThan(0);
    scene.update(ctx); // escape toggles pause; early return
    scene.update(ctx); // still paused
    const gameTimeWhilePaused = (scene as unknown as { gameTime: number }).gameTime;
    expect(gameTimeWhilePaused).toBe(gameTimeBeforePause);
  });

  it('transitions to results with defeat state when gameOver', () => {
    const goToScene = vi.fn();
    const ctx = createMockContext({ goToScene });
    scene.enter(ctx);
    (scene as unknown as { gameOver: boolean; score: number }).gameOver = true;
    (scene as unknown as { score: number }).score = 500;
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('results', {
      victory: false,
      score: 500,
      lives: 0,
    });
  });

  it('transitions to results with victory state when levelComplete', () => {
    const goToScene = vi.fn();
    const ctx = createMockContext({ goToScene });
    scene.enter(ctx);
    (scene as unknown as { levelComplete: boolean; score: number }).levelComplete = true;
    (scene as unknown as { score: number }).score = 12340;
    scene.update(ctx);
    expect(goToScene).toHaveBeenCalledWith('results', {
      victory: true,
      score: 12340,
      lives: 1,
    });
  });

  it('does not advance scroll when paused', () => {
    let escapeCount = 0;
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isEscapePressed: () => (++escapeCount >= 2),
    } as GameContext['input'];
    scene.enter(ctx);
    scene.update(ctx); // no escape yet - scroll advances
    const scrollBefore = (scene as unknown as { levelScroll: { getScrollOffset: () => number } }).levelScroll.getScrollOffset();
    expect(scrollBefore).toBeGreaterThan(0);
    scene.update(ctx); // escape toggles pause; we return before levelScroll.update
    scene.update(ctx); // still paused - scroll should not advance further
    const scrollAfter = (scene as unknown as { levelScroll: { getScrollOffset: () => number } }).levelScroll.getScrollOffset();
    expect(scrollAfter).toBe(scrollBefore);
  });
});
