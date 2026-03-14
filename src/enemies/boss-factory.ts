/**
 * Boss Factory (8.5)
 *
 * Returns the appropriate boss class based on archetypeId from level spec.
 * Currently only "placeholder" is implemented; others are Phase 12.
 */

import { BossPlaceholder } from './boss-placeholder';
import type { BossConfig } from '../levels/level-spec';

export type Boss = BossPlaceholder;

/**
 * Create a boss instance based on the level spec's boss config.
 * Falls back to BossPlaceholder for unknown archetypeIds with console warning.
 */
export function createBoss(config: BossConfig): Boss {
  if (config.archetypeId !== 'placeholder') {
    console.warn(
      `[BossFactory] Unknown archetypeId "${config.archetypeId}", using placeholder`
    );
  }
  return new BossPlaceholder({ hp: config.hp });
}
