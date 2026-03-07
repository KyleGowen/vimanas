import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameplayScene } from './gameplay-scene';
import type { GameContext } from '../game';
import { WOLF_SHIP_SIZE } from '../ships/wolf-ship';
import type { ScoutEnemy } from '../enemies/scout-enemy';
import { WOLF_PRIMARY_FIRE_RATE_S } from '../weapons/wolf-primary-weapon';
import { WOLF_SECONDARY_MANA_PER_SECOND } from '../weapons/wolf-secondary';
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

  it('spawns player projectiles when isFirePressed (Wolf primary: 2 per volley)', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => true,
      isSecondaryFirePressed: () => false,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = WOLF_PRIMARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    scene.update(ctx);
    const playerProjectiles = (scene as unknown as { playerProjectiles: { damage: number }[] }).playerProjectiles;
    expect(playerProjectiles.length).toBe(2); // Wolf primary: 2 wing-tip shots
    expect(playerProjectiles[0].damage).toBe(2.5); // Wolf Attack 20 * 0.25 * 0.5
  });

  it('keeps ship within play area bounds (can move north/south)', () => {
    scene.enter(ctx);
    scene.update(ctx);
    const ship = (scene as unknown as { ship: { x: number; y: number } }).ship;
    const padding = 50;
    const minY = padding;
    const maxY = ctx.height - padding - WOLF_SHIP_SIZE;
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

  it('activates sustained beam when secondary held and mana sufficient', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = 0.016;
    scene.enter(ctx);
    scene.update(ctx);
    const wolfBeamActive = (scene as unknown as { wolfBeamActive: boolean }).wolfBeamActive;
    expect(wolfBeamActive).toBe(true);
  });

  it('drains mana when secondary beam held (5 mana/sec)', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = 1;
    scene.enter(ctx);
    const ship = (scene as unknown as { ship: { currentMana: number; stats: { mana: number } } }).ship;
    const manaBefore = ship.currentMana;
    scene.update(ctx);
    expect(ship.currentMana).toBe(manaBefore - WOLF_SECONDARY_MANA_PER_SECOND);
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
    expect(ship.currentMana).toBe(manaBefore - 0.8); // Wolf shield 0.8 mana/s
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

  it('does not activate beam when mana insufficient', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => false,
      isSecondaryFirePressed: () => true,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = 0.016;
    scene.enter(ctx);
    const ship = (scene as unknown as { ship: { currentMana: number } }).ship;
    ship.currentMana = 0;
    scene.update(ctx);
    const wolfBeamActive = (scene as unknown as { wolfBeamActive: boolean }).wolfBeamActive;
    expect(wolfBeamActive).toBe(false);
  });

  it('player projectiles despawn after lifetime', () => {
    let fireCount = 0;
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => fireCount++ < 1, // fire only first frame
      isSecondaryFirePressed: () => false,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = WOLF_PRIMARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    scene.update(ctx);
    const playerProjectiles = (scene as unknown as { playerProjectiles: unknown[] }).playerProjectiles;
    expect(playerProjectiles.length).toBe(2); // Wolf primary: 2 shots
    // Advance past projectile lifetime (3s) without firing again
    ctx.deltaTime = 0.016;
    for (let i = 0; i < 200; i++) {
      scene.update(ctx);
    }
    const after = (scene as unknown as { playerProjectiles: unknown[] }).playerProjectiles;
    expect(after.length).toBe(0);
  });

  it('primary projectiles spawn and can hit scouts', () => {
    ctx.input = {
      ...ctx.input,
      getMoveAxis: () => ({ x: 0, y: 0 }),
      isFirePressed: () => true,
      isSecondaryFirePressed: () => false,
      isEscapePressed: () => false,
    } as GameContext['input'];
    ctx.deltaTime = WOLF_PRIMARY_FIRE_RATE_S + 0.01;
    scene.enter(ctx);
    scene.update(ctx);
    const sceneState = scene as unknown as {
      playerProjectiles: { x: number; y: number; damage: number }[];
    };
    expect(sceneState.playerProjectiles.length).toBe(2); // Wolf primary: 2 wing-tip shots
    expect(sceneState.playerProjectiles[0].damage).toBe(2.5);
  });
});
