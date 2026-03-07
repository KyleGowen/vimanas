import { describe, it, expect, vi } from 'vitest';
import { updateBossPhase } from './boss-controller';

describe('boss-controller', () => {
  it('does nothing when bossPhase is false', () => {
    const setParallax = vi.fn();
    const setBoss = vi.fn();
    const state = {
      bossPhase: false,
      boss: null,
      bossTransitionTime: 5,
      gameTime: 10,
      parallaxScrollOffset: 0,
      screenWidth: 1280,
      setParallaxScrollOffset: setParallax,
      setBoss,
    };
    updateBossPhase(0.016, state);
    expect(setParallax).not.toHaveBeenCalled();
    expect(setBoss).not.toHaveBeenCalled();
  });

  it('calls setParallaxScrollOffset when bossPhase is true', () => {
    const setParallax = vi.fn();
    const setBoss = vi.fn();
    const state = {
      bossPhase: true,
      boss: null,
      bossTransitionTime: 5,
      gameTime: 4,
      parallaxScrollOffset: 100,
      screenWidth: 1280,
      setParallaxScrollOffset: setParallax,
      setBoss,
    };
    updateBossPhase(0.016, state);
    expect(setParallax).toHaveBeenCalled();
  });

  it('spawns boss when gameTime >= bossTransitionTime', () => {
    const setParallax = vi.fn();
    const setBoss = vi.fn();
    const state = {
      bossPhase: true,
      boss: null,
      bossTransitionTime: 5,
      gameTime: 5,
      parallaxScrollOffset: 0,
      screenWidth: 1280,
      setParallaxScrollOffset: setParallax,
      setBoss,
    };
    updateBossPhase(0.016, state);
    expect(setBoss).toHaveBeenCalled();
    const boss = setBoss.mock.calls[0][0];
    expect(boss).not.toBeNull();
    expect(boss.x).toBeDefined();
    expect(boss.y).toBe(80);
  });

  it('does not spawn boss when boss already exists', () => {
    const setBoss = vi.fn();
    const existingBoss = { x: 0, y: 0 };
    const state = {
      bossPhase: true,
      boss: existingBoss,
      bossTransitionTime: 5,
      gameTime: 10,
      parallaxScrollOffset: 0,
      screenWidth: 1280,
      setParallaxScrollOffset: () => {},
      setBoss,
    };
    updateBossPhase(0.016, state);
    expect(setBoss).not.toHaveBeenCalled();
  });
});
