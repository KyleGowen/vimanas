/**
 * Mini-boss Controller (8.5)
 *
 * Handles mini-boss spawn when miniBossPhase becomes true.
 * Mini-boss appears mid-screen (not at boss position).
 * When defeated, sets miniBossDefeated = true; gameplay continues, boss comes later.
 */

import { createMiniBoss } from '../../enemies/miniboss-factory';
import { MiniBoss, MINI_BOSS_WIDTH } from '../../enemies/mini-boss';
import type { MinibossConfig } from '../../levels/level-spec';

export interface MiniBossControllerState {
  miniBossPhase: boolean;
  miniBoss: MiniBoss | null;
  miniBossDefeated: boolean;
  screenWidth: number;
  screenHeight: number;
  /** Mini-boss config from level spec. Null = no mini-boss this level. */
  minibossConfig: MinibossConfig | null;
  setMiniBoss: (m: MiniBoss | null) => void;
}

/** Y position for mini-boss spawn (mid-upper screen) */
const MINI_BOSS_SPAWN_Y = 120;

/**
 * Update mini-boss phase: spawn mini-boss when miniBossPhase triggers.
 * Mini-boss spawns centered horizontally at MINI_BOSS_SPAWN_Y.
 */
export function updateMiniBossPhase(state: MiniBossControllerState): void {
  if (!state.miniBossPhase) return;
  if (state.miniBossDefeated) return;
  if (state.miniBoss !== null) return;
  if (!state.minibossConfig) return;

  const miniBoss = createMiniBoss(state.minibossConfig);
  miniBoss.reset(state.screenWidth / 2 - MINI_BOSS_WIDTH / 2, MINI_BOSS_SPAWN_Y);
  void miniBoss.load();
  state.setMiniBoss(miniBoss);
}
