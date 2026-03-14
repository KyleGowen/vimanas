import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateBossPhase, type BossControllerState } from './boss-controller';
import { BossPlaceholder } from '../../enemies/boss-placeholder';

describe('boss-controller', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  function createState(overrides: Partial<BossControllerState> = {}): BossControllerState {
    return {
      bossPhase: false,
      boss: null,
      bossTransitionTime: 5,
      gameTime: 10,
      parallaxScrollOffset: 0,
      screenWidth: 1280,
      setParallaxScrollOffset: vi.fn(),
      setBoss: vi.fn(),
      ...overrides,
    };
  }

  it('does nothing when bossPhase is false', () => {
    const state = createState({ bossPhase: false });
    updateBossPhase(0.016, state);
    expect(state.setParallaxScrollOffset).not.toHaveBeenCalled();
    expect(state.setBoss).not.toHaveBeenCalled();
  });

  it('calls setParallaxScrollOffset when bossPhase is true', () => {
    const state = createState({
      bossPhase: true,
      gameTime: 4,
      parallaxScrollOffset: 100,
    });
    updateBossPhase(0.016, state);
    expect(state.setParallaxScrollOffset).toHaveBeenCalled();
  });

  it('spawns boss when gameTime >= bossTransitionTime', () => {
    const state = createState({
      bossPhase: true,
      gameTime: 5,
      bossTransitionTime: 5,
    });
    updateBossPhase(0.016, state);
    expect(state.setBoss).toHaveBeenCalled();
    const boss = (state.setBoss as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(boss).not.toBeNull();
    expect(boss.x).toBeDefined();
    expect(boss.y).toBe(80);
  });

  it('does not spawn boss when boss already exists', () => {
    const existingBoss = new BossPlaceholder();
    const state = createState({
      bossPhase: true,
      boss: existingBoss,
      gameTime: 10,
    });
    updateBossPhase(0.016, state);
    expect(state.setBoss).not.toHaveBeenCalled();
  });

  it('uses bossConfig to set HP when provided', () => {
    const state = createState({
      bossPhase: true,
      gameTime: 5,
      bossTransitionTime: 5,
      bossConfig: { archetypeId: 'placeholder', hp: 500 },
    });
    updateBossPhase(0.016, state);
    const boss = (state.setBoss as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(boss.hp).toBe(500);
  });

  it('uses default HP when bossConfig is not provided', () => {
    const state = createState({
      bossPhase: true,
      gameTime: 5,
      bossTransitionTime: 5,
    });
    updateBossPhase(0.016, state);
    const boss = (state.setBoss as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(boss.hp).toBe(150);
  });

  it('warns for unknown archetypeId and falls back to placeholder', () => {
    const state = createState({
      bossPhase: true,
      gameTime: 5,
      bossTransitionTime: 5,
      bossConfig: { archetypeId: 'unknown_boss_type' },
    });
    updateBossPhase(0.016, state);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unknown archetypeId "unknown_boss_type"')
    );
    const boss = (state.setBoss as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(boss).toBeInstanceOf(BossPlaceholder);
  });
});
