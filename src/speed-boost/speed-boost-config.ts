/** Configuration for the speed boost feature (hold key to multiply game speed). */
export interface SpeedBoostConfig {
  /** KeyboardEvent.code (e.g. 'Period' for .) */
  keyCode: string;
  /** Multiplier applied to deltaTime when key is held (e.g. 5 for 5× speed) */
  multiplier: number;
}

/** Default: Period (.) key, 5× speed. Right-hand friendly. */
export const DEFAULT_SPEED_BOOST_CONFIG: SpeedBoostConfig = {
  keyCode: 'Period',
  multiplier: 5,
};
