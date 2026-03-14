import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createBoss } from './boss-factory';
import { BossPlaceholder } from './boss-placeholder';
import { RootSeekerBoss } from './root-seeker-boss';

describe('boss-factory', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  describe('createBoss', () => {
    it('returns BossPlaceholder for archetypeId "placeholder"', () => {
      const boss = createBoss({ archetypeId: 'placeholder' });
      expect(boss).toBeInstanceOf(BossPlaceholder);
    });

    it('applies hp from config to BossPlaceholder', () => {
      const boss = createBoss({ archetypeId: 'placeholder', hp: 500 });
      expect(boss.hp).toBe(500);
    });

    it('uses default hp when not specified', () => {
      const boss = createBoss({ archetypeId: 'placeholder' });
      expect(boss.hp).toBe(150);
    });

    it('warns for unknown archetypeId and falls back to placeholder', () => {
      const boss = createBoss({ archetypeId: 'unknown_archetype' });
      expect(boss).toBeInstanceOf(BossPlaceholder);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown archetypeId "unknown_archetype"')
      );
    });

    it('does not warn for archetypeId "placeholder"', () => {
      createBoss({ archetypeId: 'placeholder' });
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('returns RootSeekerBoss for archetypeId "root_seeker"', () => {
      const boss = createBoss({ archetypeId: 'root_seeker' });
      expect(boss).toBeInstanceOf(RootSeekerBoss);
    });

    it('applies hp from config to RootSeekerBoss', () => {
      const boss = createBoss({ archetypeId: 'root_seeker', hp: 300 });
      expect(boss.hp).toBe(300);
    });

    it('respects phases in config (passthrough to placeholder)', () => {
      const boss = createBoss({ archetypeId: 'placeholder', hp: 200, phases: 3 });
      expect(boss.hp).toBe(200);
    });
  });
});
