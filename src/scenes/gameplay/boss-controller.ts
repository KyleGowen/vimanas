import { SCROLL_SPEED_PX_S } from '../../level/level-scroll-controller';
import { BossPlaceholder, BOSS_WIDTH } from '../../enemies/boss-placeholder';

/** Duration for parallax to ease to halt when boss enters (seconds) */
const BOSS_PARALLAX_DECAY_DURATION_S = 5;

export interface BossControllerState {
  bossPhase: boolean;
  boss: BossPlaceholder | null;
  bossTransitionTime: number;
  gameTime: number;
  parallaxScrollOffset: number;
  screenWidth: number;
  /** Boss HP override from level spec (9.5). */
  bossHp?: number;
  setParallaxScrollOffset: (v: number) => void;
  setBoss: (b: BossPlaceholder | null) => void;
}

/**
 * Update boss phase: parallax decay when boss enters, boss spawn at transition time.
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
    const boss = new BossPlaceholder(
      state.bossHp != null ? { hp: state.bossHp } : undefined
    );
    boss.reset(state.screenWidth / 2 - BOSS_WIDTH / 2, 80);
    void boss.load();
    state.setBoss(boss);
  }
}
