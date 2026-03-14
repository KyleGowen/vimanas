import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMiniBoss } from './miniboss-factory';
import { MiniBoss, MINI_BOSS_HP_ELITE_SCOUT, MINI_BOSS_HP_ELITE_MEDIUM } from './mini-boss';

describe('miniboss-factory', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  describe('createMiniBoss', () => {
    it('returns MiniBoss for archetypeId "elite_scout"', () => {
      const miniBoss = createMiniBoss({ archetypeId: 'elite_scout' });
      expect(miniBoss).toBeInstanceOf(MiniBoss);
      expect(miniBoss.archetypeId).toBe('elite_scout');
    });

    it('returns MiniBoss for archetypeId "elite_medium"', () => {
      const miniBoss = createMiniBoss({ archetypeId: 'elite_medium' });
      expect(miniBoss).toBeInstanceOf(MiniBoss);
      expect(miniBoss.archetypeId).toBe('elite_medium');
    });

    it('applies hp from config when specified', () => {
      const miniBoss = createMiniBoss({ archetypeId: 'elite_scout', hp: 300 });
      expect(miniBoss.hp).toBe(300);
    });

    it('uses default hp for elite_scout when not specified', () => {
      const miniBoss = createMiniBoss({ archetypeId: 'elite_scout' });
      expect(miniBoss.hp).toBe(MINI_BOSS_HP_ELITE_SCOUT);
    });

    it('uses default hp for elite_medium when not specified', () => {
      const miniBoss = createMiniBoss({ archetypeId: 'elite_medium' });
      expect(miniBoss.hp).toBe(MINI_BOSS_HP_ELITE_MEDIUM);
    });

    it('warns for unknown archetypeId and falls back to elite_scout defaults', () => {
      const miniBoss = createMiniBoss({ archetypeId: 'unknown_type' });
      expect(miniBoss).toBeInstanceOf(MiniBoss);
      expect(miniBoss.hp).toBe(MINI_BOSS_HP_ELITE_SCOUT);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown archetypeId "unknown_type"')
      );
    });

    it('does not warn for known archetypeIds', () => {
      createMiniBoss({ archetypeId: 'elite_scout' });
      createMiniBoss({ archetypeId: 'elite_medium' });
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('unknown archetypeId still stores the archetypeId', () => {
      const miniBoss = createMiniBoss({ archetypeId: 'custom_type' });
      expect(miniBoss.archetypeId).toBe('custom_type');
    });
  });
});
