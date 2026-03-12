/**
 * Level Timing System Tests (8.4)
 *
 * Tests for time-based triggers for boss and mini-boss spawn.
 * Uses gameTime (not performance.now()) per engine_learnings.md.
 */

import { describe, it, expect } from 'vitest';
import type { LevelTimingConfig } from '../../levels/level-spec';
import {
  shouldTriggerBossFromTiming,
  shouldTriggerMiniBossFromTiming,
} from './level-timing';

describe('Level Timing System (8.4)', () => {
  describe('shouldTriggerBossFromTiming', () => {
    it('returns true when gameTime >= preBossSeconds', () => {
      const timing: LevelTimingConfig = { preBossSeconds: 30, preMiniBossSeconds: null };
      expect(shouldTriggerBossFromTiming(timing, 30, false)).toBe(true);
      expect(shouldTriggerBossFromTiming(timing, 31, false)).toBe(true);
      expect(shouldTriggerBossFromTiming(timing, 45, false)).toBe(true);
    });

    it('returns false when gameTime < preBossSeconds', () => {
      const timing: LevelTimingConfig = { preBossSeconds: 30, preMiniBossSeconds: null };
      expect(shouldTriggerBossFromTiming(timing, 0, false)).toBe(false);
      expect(shouldTriggerBossFromTiming(timing, 15, false)).toBe(false);
      expect(shouldTriggerBossFromTiming(timing, 29.9, false)).toBe(false);
    });

    it('returns false when preBossSeconds is null (wave completion triggers boss)', () => {
      const timing: LevelTimingConfig = { preBossSeconds: null, preMiniBossSeconds: null };
      expect(shouldTriggerBossFromTiming(timing, 0, false)).toBe(false);
      expect(shouldTriggerBossFromTiming(timing, 1000, false)).toBe(false);
    });

    it('returns false when boss phase already active', () => {
      const timing: LevelTimingConfig = { preBossSeconds: 30, preMiniBossSeconds: null };
      expect(shouldTriggerBossFromTiming(timing, 30, true)).toBe(false);
      expect(shouldTriggerBossFromTiming(timing, 60, true)).toBe(false);
    });

    it('returns false when timing is undefined', () => {
      expect(shouldTriggerBossFromTiming(undefined, 30, false)).toBe(false);
    });

    it('handles timing with only preBossSeconds set', () => {
      const timing: LevelTimingConfig = { preBossSeconds: 10 };
      expect(shouldTriggerBossFromTiming(timing, 10, false)).toBe(true);
      expect(shouldTriggerBossFromTiming(timing, 5, false)).toBe(false);
    });
  });

  describe('shouldTriggerMiniBossFromTiming', () => {
    it('returns true when gameTime >= preMiniBossSeconds', () => {
      const timing: LevelTimingConfig = { preMiniBossSeconds: 15, preBossSeconds: 30 };
      expect(shouldTriggerMiniBossFromTiming(timing, 15, false)).toBe(true);
      expect(shouldTriggerMiniBossFromTiming(timing, 16, false)).toBe(true);
      expect(shouldTriggerMiniBossFromTiming(timing, 20, false)).toBe(true);
    });

    it('returns false when gameTime < preMiniBossSeconds', () => {
      const timing: LevelTimingConfig = { preMiniBossSeconds: 15, preBossSeconds: 30 };
      expect(shouldTriggerMiniBossFromTiming(timing, 0, false)).toBe(false);
      expect(shouldTriggerMiniBossFromTiming(timing, 10, false)).toBe(false);
      expect(shouldTriggerMiniBossFromTiming(timing, 14.9, false)).toBe(false);
    });

    it('returns false when preMiniBossSeconds is null (no mini-boss)', () => {
      const timing: LevelTimingConfig = { preMiniBossSeconds: null, preBossSeconds: 30 };
      expect(shouldTriggerMiniBossFromTiming(timing, 0, false)).toBe(false);
      expect(shouldTriggerMiniBossFromTiming(timing, 1000, false)).toBe(false);
    });

    it('returns false when mini-boss phase already active', () => {
      const timing: LevelTimingConfig = { preMiniBossSeconds: 15, preBossSeconds: 30 };
      expect(shouldTriggerMiniBossFromTiming(timing, 15, true)).toBe(false);
      expect(shouldTriggerMiniBossFromTiming(timing, 20, true)).toBe(false);
    });

    it('returns false when timing is undefined', () => {
      expect(shouldTriggerMiniBossFromTiming(undefined, 15, false)).toBe(false);
    });
  });

  describe('timing sequence', () => {
    it('mini-boss triggers before boss when both configured', () => {
      const timing: LevelTimingConfig = { preMiniBossSeconds: 15, preBossSeconds: 30 };
      let miniBossActive = false;
      let bossActive = false;

      for (let gameTime = 0; gameTime <= 35; gameTime += 5) {
        if (shouldTriggerMiniBossFromTiming(timing, gameTime, miniBossActive)) {
          miniBossActive = true;
        }
        if (shouldTriggerBossFromTiming(timing, gameTime, bossActive)) {
          bossActive = true;
        }
      }

      expect(miniBossActive).toBe(true);
      expect(bossActive).toBe(true);
    });

    it('only boss triggers when no mini-boss configured', () => {
      const timing: LevelTimingConfig = { preMiniBossSeconds: null, preBossSeconds: 30 };
      let miniBossTriggered = false;
      let bossTriggered = false;

      for (let gameTime = 0; gameTime <= 35; gameTime += 5) {
        if (shouldTriggerMiniBossFromTiming(timing, gameTime, false)) {
          miniBossTriggered = true;
        }
        if (shouldTriggerBossFromTiming(timing, gameTime, false)) {
          bossTriggered = true;
        }
      }

      expect(miniBossTriggered).toBe(false);
      expect(bossTriggered).toBe(true);
    });

    it('neither triggers when timing is null (wave completion mode)', () => {
      const timing: LevelTimingConfig = { preMiniBossSeconds: null, preBossSeconds: null };

      for (let gameTime = 0; gameTime <= 120; gameTime += 10) {
        expect(shouldTriggerMiniBossFromTiming(timing, gameTime, false)).toBe(false);
        expect(shouldTriggerBossFromTiming(timing, gameTime, false)).toBe(false);
      }
    });
  });
});
