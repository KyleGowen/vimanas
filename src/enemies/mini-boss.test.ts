import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  MiniBoss,
  MINI_BOSS_WIDTH,
  MINI_BOSS_HEIGHT,
  MINI_BOSS_HP_ELITE_SCOUT,
  MINI_BOSS_HP_ELITE_MEDIUM,
} from './mini-boss';
import { createMockCanvasContext } from '../test-utils';

describe('MiniBoss', () => {
  beforeEach(() => {
    vi.stubGlobal('performance', { now: () => 0 });
  });

  describe('constructor', () => {
    it('constructs with specified HP and archetypeId', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      expect(miniBoss.hp).toBe(150);
      expect(miniBoss.archetypeId).toBe('elite_scout');
    });

    it('initializes position to 0,0', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      expect(miniBoss.x).toBe(0);
      expect(miniBoss.y).toBe(0);
    });

    it('has defense and attack stats', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      expect(miniBoss.defense).toBe(3);
      expect(miniBoss.attack).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('sets position and restores HP', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      miniBoss.hp = 50;
      miniBoss.reset(100, 200);
      expect(miniBoss.x).toBe(100);
      expect(miniBoss.y).toBe(200);
      expect(miniBoss.hp).toBe(150);
    });
  });

  describe('tryFire', () => {
    it('returns projectile options when cooldown elapsed', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      miniBoss.reset(100, 50);
      const result = miniBoss.tryFire(1, 0);
      expect(result).not.toBeNull();
      expect(result!.x).toBeDefined();
      expect(result!.y).toBeDefined();
      expect(result!.vy).toBeGreaterThan(0);
    });

    it('returns null when cooldown not elapsed', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      miniBoss.reset(100, 50);
      miniBoss.tryFire(1, 0);
      const result = miniBoss.tryFire(1.5, 0);
      expect(result).toBeNull();
    });
  });

  describe('takeDamage', () => {
    it('reduces HP and returns false when alive', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      const dead = miniBoss.takeDamage(10);
      expect(dead).toBe(false);
      expect(miniBoss.hp).toBeLessThan(150);
    });

    it('returns true when dead (hp <= 0)', () => {
      const miniBoss = new MiniBoss({ hp: 1, archetypeId: 'elite_scout' });
      const dead = miniBoss.takeDamage(100);
      expect(dead).toBe(true);
    });

    it('applies damage formula with defense', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      const initialHp = miniBoss.hp;
      miniBoss.takeDamage(15);
      const expectedDamage = Math.max(0.1, 15 / miniBoss.defense);
      expect(miniBoss.hp).toBeCloseTo(initialHp - expectedDamage);
    });
  });

  describe('draw', () => {
    it('does not throw', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      miniBoss.reset(100, 50);
      const ctx = createMockCanvasContext();
      expect(() => miniBoss.draw(ctx)).not.toThrow();
    });
  });

  describe('isLoaded', () => {
    it('returns false before load is called', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      expect(miniBoss.isLoaded()).toBe(false);
    });
  });

  describe('dispose', () => {
    it('does not throw', () => {
      const miniBoss = new MiniBoss({ hp: 150, archetypeId: 'elite_scout' });
      expect(() => miniBoss.dispose()).not.toThrow();
    });
  });

  describe('constants', () => {
    it('MINI_BOSS_WIDTH is defined and positive', () => {
      expect(MINI_BOSS_WIDTH).toBeGreaterThan(0);
    });

    it('MINI_BOSS_HEIGHT is defined and positive', () => {
      expect(MINI_BOSS_HEIGHT).toBeGreaterThan(0);
    });

    it('MINI_BOSS_HP_ELITE_SCOUT is 150', () => {
      expect(MINI_BOSS_HP_ELITE_SCOUT).toBe(150);
    });

    it('MINI_BOSS_HP_ELITE_MEDIUM is 250', () => {
      expect(MINI_BOSS_HP_ELITE_MEDIUM).toBe(250);
    });
  });
});
