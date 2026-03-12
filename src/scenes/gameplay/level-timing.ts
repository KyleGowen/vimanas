/**
 * Level Timing System (8.4)
 *
 * Time-based and wave-based triggers for boss and mini-boss spawn.
 * Uses gameTime (accumulated in GameplayScene) per engine_learnings.md.
 *
 * Trigger priority:
 * 1. Time-based: if preBossSeconds is set AND gameTime >= preBossSeconds → boss spawns
 * 2. Wave-based: else if preBossWaves is set AND completedWaves >= preBossWaves → boss spawns
 * 3. All-waves: else if both null → boss spawns when ALL waves complete (via onLevelWavesComplete)
 */

import type { LevelTimingConfig } from '../../levels/level-spec';

/**
 * Check if boss should spawn based on time config.
 * Returns true when gameTime >= preBossSeconds.
 * When preBossSeconds is null, returns false (wave-based or wave-completion triggers boss).
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
 * Check if mini-boss should spawn based on time config.
 * Returns true when gameTime >= preMiniBossSeconds.
 * When preMiniBossSeconds is null, returns false (wave-based or no mini-boss).
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

/**
 * Check if boss should spawn based on wave count.
 * Returns true when completedWaves >= preBossWaves.
 * When preBossWaves is null, returns false (time-based or all-waves-complete triggers boss).
 */
export function shouldTriggerBossFromWaves(
  timing: LevelTimingConfig | undefined,
  completedWaves: number,
  bossPhaseActive: boolean
): boolean {
  if (bossPhaseActive) return false;
  const preBossWaves = timing?.preBossWaves;
  if (typeof preBossWaves !== 'number') return false;
  return completedWaves >= preBossWaves;
}

/**
 * Check if mini-boss should spawn based on wave count.
 * Returns true when completedWaves >= preMiniBossWaves.
 * When preMiniBossWaves is null, returns false (time-based or no mini-boss).
 */
export function shouldTriggerMiniBossFromWaves(
  timing: LevelTimingConfig | undefined,
  completedWaves: number,
  miniBossPhaseActive: boolean
): boolean {
  if (miniBossPhaseActive) return false;
  const preMiniBossWaves = timing?.preMiniBossWaves;
  if (typeof preMiniBossWaves !== 'number') return false;
  return completedWaves >= preMiniBossWaves;
}
