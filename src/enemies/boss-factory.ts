/**
 * Boss Factory (8.5, 8.7)
 *
 * Returns the appropriate boss class based on archetypeId from level spec.
 * placeholder, root_seeker implemented; others Phase 12.
 */

import { BossPlaceholder } from './boss-placeholder';
import { RootSeekerBoss } from './root-seeker-boss';
import type { BossConfig } from '../levels/level-spec';

export type Boss = BossPlaceholder | RootSeekerBoss;

/**
 * Create a boss instance based on the level spec's boss config.
 * Falls back to BossPlaceholder for unknown archetypeIds with console warning.
 */
export function createBoss(config: BossConfig): Boss {
  if (config.archetypeId === 'root_seeker') {
    return new RootSeekerBoss({ hp: config.hp });
  }
  if (config.archetypeId !== 'placeholder') {
    console.warn(
      `[BossFactory] Unknown archetypeId "${config.archetypeId}", using placeholder`
    );
  }
  return new BossPlaceholder({ hp: config.hp });
}
