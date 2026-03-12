/**
 * Level Timing System (8.4)
 *
 * Time-based triggers for boss and mini-boss spawn.
 * Uses gameTime (accumulated in GameplayScene) per engine_learnings.md.
 */

import type { LevelTimingConfig } from '../../levels/level-spec';

/**
 * Check if boss should spawn based on timing config.
 * Returns true when gameTime >= preBossSeconds.
 * When preBossSeconds is null, returns false (wave completion triggers boss).
 */
export function shouldTriggerBossFromTiming(
  timing: LevelTimingConfig | undefined,
  gameTime: number,
  bossPhaseActive: boolean
): boolean {
  if (bossPhaseActive) return false;
  const preBoss = timing?.preBossSeconds;
  if (typeof preBoss !== 'number') return false;
  return gameTime >= preBoss;
}

/**
 * Check if mini-boss should spawn based on timing config.
 * Returns true when gameTime >= preMiniBossSeconds.
 * When preMiniBossSeconds is null, returns false (no mini-boss).
 */
export function shouldTriggerMiniBossFromTiming(
  timing: LevelTimingConfig | undefined,
  gameTime: number,
  miniBossPhaseActive: boolean
): boolean {
  if (miniBossPhaseActive) return false;
  const preMiniBoss = timing?.preMiniBossSeconds;
  if (typeof preMiniBoss !== 'number') return false;
  return gameTime >= preMiniBoss;
}
