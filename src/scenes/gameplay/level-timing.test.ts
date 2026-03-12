/**
 * Level Timing System Tests (8.4)
 *
 * Tests for time-based and wave-based triggers for boss and mini-boss spawn.
 * Uses gameTime (not performance.now()) per engine_learnings.md.
 */

import { describe, it, expect } from 'vitest';
import type { LevelTimingConfig } from '../../levels/level-spec';
import {
  shouldTriggerBossFromTiming,
  shouldTriggerMiniBossFromTiming,
  shouldTriggerBossFromWaves,
  shouldTriggerMiniBossFromWaves,
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

  describe('shouldTriggerBossFromWaves', () => {
    it('returns true when completedWaves >= preBossWaves', () => {
      const timing: LevelTimingConfig = { preBossWaves: 3, preBossSeconds: null };
      expect(shouldTriggerBossFromWaves(timing, 3, false)).toBe(true);
      expect(shouldTriggerBossFromWaves(timing, 4, false)).toBe(true);
      expect(shouldTriggerBossFromWaves(timing, 5, false)).toBe(true);
    });

    it('returns false when completedWaves < preBossWaves', () => {
      const timing: LevelTimingConfig = { preBossWaves: 3, preBossSeconds: null };
      expect(shouldTriggerBossFromWaves(timing, 0, false)).toBe(false);
      expect(shouldTriggerBossFromWaves(timing, 1, false)).toBe(false);
      expect(shouldTriggerBossFromWaves(timing, 2, false)).toBe(false);
    });

    it('returns false when preBossWaves is null (time or all-waves mode)', () => {
      const timing: LevelTimingConfig = { preBossWaves: null, preBossSeconds: null };
      expect(shouldTriggerBossFromWaves(timing, 0, false)).toBe(false);
      expect(shouldTriggerBossFromWaves(timing, 10, false)).toBe(false);
    });

    it('returns false when boss phase already active', () => {
      const timing: LevelTimingConfig = { preBossWaves: 3, preBossSeconds: null };
      expect(shouldTriggerBossFromWaves(timing, 3, true)).toBe(false);
      expect(shouldTriggerBossFromWaves(timing, 5, true)).toBe(false);
    });

    it('returns false when timing is undefined', () => {
      expect(shouldTriggerBossFromWaves(undefined, 3, false)).toBe(false);
    });

    it('handles timing with only preBossWaves set', () => {
      const timing: LevelTimingConfig = { preBossWaves: 2 };
      expect(shouldTriggerBossFromWaves(timing, 2, false)).toBe(true);
      expect(shouldTriggerBossFromWaves(timing, 1, false)).toBe(false);
    });
  });

  describe('shouldTriggerMiniBossFromWaves', () => {
    it('returns true when completedWaves >= preMiniBossWaves', () => {
      const timing: LevelTimingConfig = { preMiniBossWaves: 2, preBossWaves: 4 };
      expect(shouldTriggerMiniBossFromWaves(timing, 2, false)).toBe(true);
      expect(shouldTriggerMiniBossFromWaves(timing, 3, false)).toBe(true);
      expect(shouldTriggerMiniBossFromWaves(timing, 4, false)).toBe(true);
    });

    it('returns false when completedWaves < preMiniBossWaves', () => {
      const timing: LevelTimingConfig = { preMiniBossWaves: 2, preBossWaves: 4 };
      expect(shouldTriggerMiniBossFromWaves(timing, 0, false)).toBe(false);
      expect(shouldTriggerMiniBossFromWaves(timing, 1, false)).toBe(false);
    });

    it('returns false when preMiniBossWaves is null (no mini-boss)', () => {
      const timing: LevelTimingConfig = { preMiniBossWaves: null, preBossWaves: 3 };
      expect(shouldTriggerMiniBossFromWaves(timing, 0, false)).toBe(false);
      expect(shouldTriggerMiniBossFromWaves(timing, 10, false)).toBe(false);
    });

    it('returns false when mini-boss phase already active', () => {
      const timing: LevelTimingConfig = { preMiniBossWaves: 2, preBossWaves: 4 };
      expect(shouldTriggerMiniBossFromWaves(timing, 2, true)).toBe(false);
      expect(shouldTriggerMiniBossFromWaves(timing, 3, true)).toBe(false);
    });

    it('returns false when timing is undefined', () => {
      expect(shouldTriggerMiniBossFromWaves(undefined, 2, false)).toBe(false);
    });
  });

  describe('wave-based timing sequence', () => {
    it('mini-boss triggers before boss when both wave-configured', () => {
      const timing: LevelTimingConfig = { preMiniBossWaves: 2, preBossWaves: 4 };
      let miniBossActive = false;
      let bossActive = false;

      for (let waves = 0; waves <= 5; waves++) {
        if (shouldTriggerMiniBossFromWaves(timing, waves, miniBossActive)) {
          miniBossActive = true;
        }
        if (shouldTriggerBossFromWaves(timing, waves, bossActive)) {
          bossActive = true;
        }
      }

      expect(miniBossActive).toBe(true);
      expect(bossActive).toBe(true);
    });

    it('only boss triggers when no mini-boss wave configured', () => {
      const timing: LevelTimingConfig = { preMiniBossWaves: null, preBossWaves: 3 };
      let miniBossTriggered = false;
      let bossTriggered = false;

      for (let waves = 0; waves <= 5; waves++) {
        if (shouldTriggerMiniBossFromWaves(timing, waves, false)) {
          miniBossTriggered = true;
        }
        if (shouldTriggerBossFromWaves(timing, waves, false)) {
          bossTriggered = true;
        }
      }

      expect(miniBossTriggered).toBe(false);
      expect(bossTriggered).toBe(true);
    });

    it('neither triggers when wave counts are null (time or all-waves mode)', () => {
      const timing: LevelTimingConfig = { preMiniBossWaves: null, preBossWaves: null };

      for (let waves = 0; waves <= 10; waves++) {
        expect(shouldTriggerMiniBossFromWaves(timing, waves, false)).toBe(false);
        expect(shouldTriggerBossFromWaves(timing, waves, false)).toBe(false);
      }
    });
  });

  describe('time vs wave priority scenarios', () => {
    it('time trigger fires before wave trigger if time reached first', () => {
      const timing: LevelTimingConfig = {
        preBossSeconds: 30,
        preBossWaves: 5,
      };

      const timeTriggers = shouldTriggerBossFromTiming(timing, 30, false);
      const waveTriggersAt2 = shouldTriggerBossFromWaves(timing, 2, false);

      expect(timeTriggers).toBe(true);
      expect(waveTriggersAt2).toBe(false);
    });

    it('wave trigger fires if wave count reached and time not set', () => {
      const timing: LevelTimingConfig = {
        preBossSeconds: null,
        preBossWaves: 3,
      };

      const timeTriggers = shouldTriggerBossFromTiming(timing, 100, false);
      const waveTriggers = shouldTriggerBossFromWaves(timing, 3, false);

      expect(timeTriggers).toBe(false);
      expect(waveTriggers).toBe(true);
    });

    it('neither triggers if both conditions not met', () => {
      const timing: LevelTimingConfig = {
        preBossSeconds: 60,
        preBossWaves: 5,
      };

      const timeTriggers = shouldTriggerBossFromTiming(timing, 30, false);
      const waveTriggers = shouldTriggerBossFromWaves(timing, 3, false);

      expect(timeTriggers).toBe(false);
      expect(waveTriggers).toBe(false);
    });

    it('both would trigger independently when conditions met', () => {
      const timing: LevelTimingConfig = {
        preBossSeconds: 30,
        preBossWaves: 3,
      };

      const timeTriggers = shouldTriggerBossFromTiming(timing, 30, false);
      const waveTriggers = shouldTriggerBossFromWaves(timing, 3, false);

      expect(timeTriggers).toBe(true);
      expect(waveTriggers).toBe(true);
    });
  });
});
