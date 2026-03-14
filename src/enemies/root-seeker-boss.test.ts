import { describe, it, expect } from 'vitest';
import { RootSeekerBoss } from './root-seeker-boss';
import { ROOT_SEEKER_SECONDARY_COOLDOWN_S } from '../weapons/root-seeker-weapon';

describe('RootSeekerBoss', () => {
  describe('addHp (lifesteal)', () => {
    it('increases hp by amount up to maxHp', () => {
      const boss = new RootSeekerBoss({ hp: 100 });
      boss.hp = 80;
      boss.addHp(5);
      expect(boss.hp).toBe(85);
    });

    it('caps hp at maxHp when lifesteal would exceed', () => {
      const boss = new RootSeekerBoss({ hp: 100 });
      boss.hp = 98;
      boss.addHp(5);
      expect(boss.hp).toBe(100);
    });
  });

  describe('trySecondaryFire (leaf wave cooldown)', () => {
    it('returns null before secondary cooldown has elapsed', () => {
      const boss = new RootSeekerBoss();
      boss.reset(100, 50);
      const first = boss.trySecondaryFire(0, 0);
      expect(Array.isArray(first) && first.length > 0).toBe(true);
      const beforeCooldown = boss.trySecondaryFire(ROOT_SEEKER_SECONDARY_COOLDOWN_S - 0.1, 0);
      expect(beforeCooldown).toBeNull();
    });

    it('returns projectiles after cooldown (5s)', () => {
      const boss = new RootSeekerBoss();
      boss.reset(100, 50);
      boss.trySecondaryFire(0, 0);
      const afterCooldown = boss.trySecondaryFire(ROOT_SEEKER_SECONDARY_COOLDOWN_S, 0);
      expect(Array.isArray(afterCooldown) && afterCooldown.length > 0).toBe(true);
    });
  });

  describe('tryFire (primary)', () => {
    it('returns array of projectile options', () => {
      const boss = new RootSeekerBoss();
      boss.reset(100, 50);
      const result = boss.tryFire(0, 0);
      expect(Array.isArray(result)).toBe(true);
      expect((result ?? []).length).toBeGreaterThan(0);
    });
  });
});
