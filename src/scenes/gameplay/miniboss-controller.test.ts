import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateMiniBossPhase, type MiniBossControllerState } from './miniboss-controller';
import { MiniBoss, MINI_BOSS_WIDTH } from '../../enemies/mini-boss';

describe('miniboss-controller', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  function createState(overrides: Partial<MiniBossControllerState> = {}): MiniBossControllerState {
    return {
      miniBossPhase: false,
      miniBoss: null,
      miniBossDefeated: false,
      screenWidth: 1280,
      screenHeight: 720,
      minibossConfig: null,
      setMiniBoss: vi.fn(),
      ...overrides,
    };
  }

  describe('updateMiniBossPhase', () => {
    it('does nothing when miniBossPhase is false', () => {
      const state = createState({ miniBossPhase: false });
      updateMiniBossPhase(state);
      expect(state.setMiniBoss).not.toHaveBeenCalled();
    });

    it('does nothing when miniBossDefeated is true', () => {
      const state = createState({
        miniBossPhase: true,
        miniBossDefeated: true,
        minibossConfig: { archetypeId: 'elite_scout' },
      });
      updateMiniBossPhase(state);
      expect(state.setMiniBoss).not.toHaveBeenCalled();
    });

    it('does nothing when miniBoss already exists', () => {
      const existingMiniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      const state = createState({
        miniBossPhase: true,
        miniBoss: existingMiniBoss,
        minibossConfig: { archetypeId: 'elite_scout' },
      });
      updateMiniBossPhase(state);
      expect(state.setMiniBoss).not.toHaveBeenCalled();
    });

    it('does nothing when minibossConfig is null (no mini-boss this level)', () => {
      const state = createState({
        miniBossPhase: true,
        minibossConfig: null,
      });
      updateMiniBossPhase(state);
      expect(state.setMiniBoss).not.toHaveBeenCalled();
    });

    it('spawns mini-boss when conditions are met', () => {
      const setMiniBoss = vi.fn();
      const state = createState({
        miniBossPhase: true,
        minibossConfig: { archetypeId: 'elite_scout', hp: 150 },
        setMiniBoss,
      });
      updateMiniBossPhase(state);
      expect(setMiniBoss).toHaveBeenCalledTimes(1);
      const spawnedMiniBoss = setMiniBoss.mock.calls[0][0];
      expect(spawnedMiniBoss).toBeInstanceOf(MiniBoss);
    });

    it('spawns mini-boss with correct HP from config', () => {
      const setMiniBoss = vi.fn();
      const state = createState({
        miniBossPhase: true,
        minibossConfig: { archetypeId: 'elite_medium', hp: 400 },
        setMiniBoss,
      });
      updateMiniBossPhase(state);
      const spawnedMiniBoss = setMiniBoss.mock.calls[0][0] as MiniBoss;
      expect(spawnedMiniBoss.hp).toBe(400);
    });

    it('spawns mini-boss centered horizontally', () => {
      const setMiniBoss = vi.fn();
      const state = createState({
        miniBossPhase: true,
        screenWidth: 1280,
        minibossConfig: { archetypeId: 'elite_scout' },
        setMiniBoss,
      });
      updateMiniBossPhase(state);
      const spawnedMiniBoss = setMiniBoss.mock.calls[0][0] as MiniBoss;
      const expectedX = 1280 / 2 - MINI_BOSS_WIDTH / 2;
      expect(spawnedMiniBoss.x).toBe(expectedX);
    });

    it('spawns mini-boss at expected Y position', () => {
      const setMiniBoss = vi.fn();
      const state = createState({
        miniBossPhase: true,
        minibossConfig: { archetypeId: 'elite_scout' },
        setMiniBoss,
      });
      updateMiniBossPhase(state);
      const spawnedMiniBoss = setMiniBoss.mock.calls[0][0] as MiniBoss;
      expect(spawnedMiniBoss.y).toBe(120);
    });

    it('uses archetype from config', () => {
      const setMiniBoss = vi.fn();
      const state = createState({
        miniBossPhase: true,
        minibossConfig: { archetypeId: 'elite_medium' },
        setMiniBoss,
      });
      updateMiniBossPhase(state);
      const spawnedMiniBoss = setMiniBoss.mock.calls[0][0] as MiniBoss;
      expect(spawnedMiniBoss.archetypeId).toBe('elite_medium');
    });
  });
});
