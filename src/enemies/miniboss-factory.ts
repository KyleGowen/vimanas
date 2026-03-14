/**
 * Mini-boss Factory (8.5)
 *
 * Returns the appropriate MiniBoss instance based on archetypeId from level spec.
 * Applies HP defaults when not specified in config.
 */

import {
  MiniBoss,
  MINI_BOSS_HP_ELITE_SCOUT,
  MINI_BOSS_HP_ELITE_MEDIUM,
} from './mini-boss';
import type { MinibossConfig } from '../levels/level-spec';

/**
 * Get default HP for mini-boss archetype.
 */
function getDefaultHp(archetypeId: string): number {
  switch (archetypeId) {
    case 'elite_medium':
      return MINI_BOSS_HP_ELITE_MEDIUM;
    case 'elite_scout':
    default:
      return MINI_BOSS_HP_ELITE_SCOUT;
  }
}

/**
 * Create a mini-boss instance based on the level spec's miniboss config.
 * Falls back to elite_scout defaults for unknown archetypeIds with console warning.
 */
export function createMiniBoss(config: MinibossConfig): MiniBoss {
  const knownArchetypes = ['elite_scout', 'elite_medium'];
  if (!knownArchetypes.includes(config.archetypeId)) {
    console.warn(
      `[MiniBossFactory] Unknown archetypeId "${config.archetypeId}", using elite_scout defaults`
    );
  }
  const hp = config.hp ?? getDefaultHp(config.archetypeId);
  return new MiniBoss({ hp, archetypeId: config.archetypeId });
}
