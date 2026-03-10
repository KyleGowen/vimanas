/**
 * Theme → parallax layer configs per docs/concepts/level_theme_taxonomy.md
 */

import type { ThemeId } from './level-spec';
import type { ParallaxLayerConfig } from '../parallax/parallax-layer';

/** Layer configs per theme. Far 0.3x, Mid 0.6x, Near 1.0x. */
const THEME_LAYERS: Record<ThemeId, ParallaxLayerConfig[]> = {
  forest: [
    { spritePath: '/images/level1/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level1/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level1/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
  industrial: [
    { spritePath: '/images/level2/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level2/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level2/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
  sky: [
    { spritePath: '/images/level3/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level3/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level3/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
  city_metropolis: [
    { spritePath: '/images/level4/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level4/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level4/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
  volcano: [
    { spritePath: '/images/level5/parallax_far.png', scrollRatio: 0.3, depth: 1 },
    { spritePath: '/images/level5/parallax_mid.png', scrollRatio: 0.6, depth: 2 },
    { spritePath: '/images/level5/parallax_near.png', scrollRatio: 1.0, depth: 3 },
  ],
};

/** Fallback to forest when theme has no assets or is invalid */
const FALLBACK_THEME: ThemeId = 'forest';

export function getLayerConfigsForTheme(themeId: ThemeId): ParallaxLayerConfig[] {
  return THEME_LAYERS[themeId] ?? THEME_LAYERS[FALLBACK_THEME];
}
