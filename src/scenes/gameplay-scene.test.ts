import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameplayScene } from './gameplay-scene';
import type { GameContext } from '../game';
import { SPARROW_SHIP_SIZE } from '../ships/sparrow-ship';
import type { ScoutEnemy } from '../enemies/scout-enemy';
import { SPARROW_SECONDARY_FIRE_RATE_S } from '../weapons/sparrow-secondary';
import { ENERGY_RING_LIFETIME_S } from '../projectiles/energy-ring-projectile';
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
      isSecondaryFirePressed: () => false,
      isShieldPressed: () => false,
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
      isSecondaryFirePressed: () => false,
      isEscapePressed: () => false,
    } as GameContext['input'];
    scene.enter(ctx);
    const initialX = (scene as unknown as { ship: { x: number } }).ship.x;
    scene.update(ctx);
    const afterX = (scene as unknown as { ship: { x: number } }).ship.x;
    expect(afterX).toBeGreaterThan(initialX);
  });

  it('uses per-direction speeds when ship has forwardSpeed/backwardSpeed', () => {
    type SceneWithShip = { ship: { x: number; y: number; stats: { forwardSpeed?: number; backwardSpeed?: number; speed: number } } };
    scene.enter(ctx);
    const ship = (scene as unknown as SceneWithShip).ship;
    ship.stats.forwardSpeed = 60;
    ship.stats.backwardSpeed = 20;
    ship.stats.speed = 40;
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: -1 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => false,
      isEscapePressed: () => false,
    } as GameContext['input'];
    const yBefore = ship.y;
    scene.update(ctx);
    const yAfterForward = ship.y;
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 1 }),
    } as GameContext['input'];
    scene.update(ctx);
    const yAfterBackward = ship.y;
    const forwardDelta = yBefore - yAfterForward;
    const backwardDelta = yAfterBackward - yAfterForward;
    expect(forwardDelta).toBeGreaterThan(backwardDelta);
  });

  it('toggles pause when Escape pressed', () => {
    let escapeCount = 0;
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => false,
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
      isSecondaryFirePressed: () => false,
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

  it('parallax slowly decelerates when boss phase starts', () => {
    scene.enter(ctx);
    ctx.deltaTime = 0.1;
    for (let i = 0; i < 20; i++) scene.update(ctx);
    const state = scene as unknown as {
      bossPhase: boolean;
      bossTransitionTime: number;
      gameTime: number;
      parallaxScrollOffset: number;
      levelScroll: { getScrollOffset: () => number };
    };
    state.bossPhase = true;
    state.bossTransitionTime = state.gameTime + 1;
    const parallaxAtStart = state.parallaxScrollOffset;
    expect(parallaxAtStart).toBe(state.levelScroll.getScrollOffset());

    ctx.deltaTime = 0.5;
    scene.update(ctx);
    expect(state.parallaxScrollOffset).toBeGreaterThan(parallaxAtStart);

    for (let i = 0; i < 15; i++) {
      ctx.deltaTime = 0.5;
      scene.update(ctx);
    }
    const parallaxAfterDecay = state.parallaxScrollOffset;
    ctx.deltaTime = 0.5;
    scene.update(ctx);
    expect(state.parallaxScrollOffset).toBe(parallaxAfterDecay);
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

  it('spawns energy ring when isSecondaryFirePressed and mana sufficient', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = SPARROW_SECONDARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    scene.update(ctx);
    const energyRings = (scene as unknown as { energyRings: { damage: number }[] }).energyRings;
    expect(energyRings.length).toBeGreaterThan(0);
    expect(energyRings[0].damage).toBe(5);
  });

  it('decreases mana when secondary fire spawns ring', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = SPARROW_SECONDARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    const ship = (scene as unknown as { ship: { currentMana: number; stats: { mana: number } } }).ship;
    const manaBefore = ship.currentMana;
    scene.update(ctx);
    expect(ship.currentMana).toBe(manaBefore - 1);
  });

  it('regenerates mana when secondary fire not pressed', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => false,
      isShieldPressed: () => false,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = 0.5;
    scene.enter(ctx);
    const ship = (scene as unknown as { ship: { currentMana: number; stats: { mana: number; manaRegenRate: number } } }).ship;
    ship.currentMana = 10; // below max
    scene.update(ctx);
    expect(ship.currentMana).toBeGreaterThan(10);
  });

  it('drains mana when shield held', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => false,
      isShieldPressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = 1;
    scene.enter(ctx);
    const ship = (scene as unknown as { ship: { currentMana: number } }).ship;
    const manaBefore = ship.currentMana;
    scene.update(ctx);
    expect(ship.currentMana).toBe(manaBefore - 1);
  });

  it('blocks mana regen when shield held', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => false,
      isShieldPressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = 0.5;
    scene.enter(ctx);
    const ship = (scene as unknown as { ship: { currentMana: number } }).ship;
    ship.currentMana = 10;
    scene.update(ctx);
    expect(ship.currentMana).toBeLessThan(10);
  });

  it('does not spawn ring when mana insufficient', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = SPARROW_SECONDARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    const ship = (scene as unknown as { ship: { currentMana: number } }).ship;
    ship.currentMana = 0;
    scene.update(ctx);
    const energyRings = (scene as unknown as { energyRings: unknown[] }).energyRings;
    expect(energyRings.length).toBe(0);
  });

  it('energy ring despawns after lifetime', () => {
    let fireCount = 0;
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => fireCount++ < 1,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = SPARROW_SECONDARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    scene.update(ctx);
    const energyRings = (scene as unknown as { energyRings: unknown[] }).energyRings;
    expect(energyRings.length).toBe(1);
    // Advance past ring lifetime without firing again
    ctx.deltaTime = 0.016;
    for (let i = 0; i < 70; i++) {
      scene.update(ctx);
    }
    const ringsAfter = (scene as unknown as { energyRings: unknown[] }).energyRings;
    expect(ringsAfter.length).toBe(0);
  });

  it('energy ring hitting scout damages scout and updates score', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    scene.enter(ctx);
    const sceneState = scene as unknown as {
      ship: { x: number; y: number };
      scouts: ScoutEnemy[];
      enemyPool: { get: (x: number, y: number) => ScoutEnemy | null };
      energyRings: { x: number; y: number }[];
      score: number;
      levelScroll: { getScrollOffset: () => number };
    };
    ctx.deltaTime = SPARROW_SECONDARY_FIRE_RATE_S + 0.01;
    scene.update(ctx);
    expect(sceneState.energyRings.length).toBe(1);
    const ringY = sceneState.energyRings[0].y;
    const ringX = sceneState.energyRings[0].x;
    const scout = sceneState.enemyPool.get(ringX, ringY - 30);
    expect(scout).not.toBeNull();
    if (scout) {
      sceneState.scouts.push(scout);
    }
    const scoreBefore = sceneState.score;
    for (let i = 0; i < 15; i++) {
      ctx.deltaTime = 0.05;
      scene.update(ctx);
    }
    expect(sceneState.score).toBe(scoreBefore + 100);
  });
});
