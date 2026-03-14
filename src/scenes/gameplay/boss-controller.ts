import { SCROLL_SPEED_PX_S } from '../../level/level-scroll-controller';
import { createBoss, type Boss } from '../../enemies/boss-factory';
import type { BossConfig } from '../../levels/level-spec';

/** Duration for parallax to ease to halt when boss enters (seconds) */
const BOSS_PARALLAX_DECAY_DURATION_S = 5;

export interface BossControllerState {
  bossPhase: boolean;
  boss: Boss | null;
  bossTransitionTime: number;
  gameTime: number;
  parallaxScrollOffset: number;
  screenWidth: number;
  /** Boss config from level spec (8.5). */
  bossConfig?: BossConfig;
  setParallaxScrollOffset: (v: number) => void;
  setBoss: (b: Boss | null) => void;
}

/**
 * Update boss phase: parallax decay when boss enters, boss spawn at transition time.
 * Uses createBoss factory to instantiate boss from level spec config.
 */
export function updateBossPhase(
  deltaTime: number,
  state: BossControllerState
): void {
  if (!state.bossPhase) return;

  const elapsed = state.gameTime - (state.bossTransitionTime - 1);
  const decay = Math.max(0, 1 - elapsed / BOSS_PARALLAX_DECAY_DURATION_S);
  state.setParallaxScrollOffset(
    state.parallaxScrollOffset + SCROLL_SPEED_PX_S * deltaTime * decay
  );

  if (
    state.boss === null &&
    state.gameTime >= state.bossTransitionTime
  ) {
    const config: BossConfig = state.bossConfig ?? { archetypeId: 'placeholder' };
    const boss = createBoss(config);
    boss.reset(state.screenWidth / 2 - boss.getWidth() / 2, 80);
    void boss.load();
    state.setBoss(boss);
  }
}
