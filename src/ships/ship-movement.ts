/**
 * Per-direction movement speed configuration for ships.
 * Each direction can be set independently; omitted values default to `speed`.
 */
export interface ShipMovementConfig {
  /** Base speed; used when per-direction values are not set. */
  speed: number;
  /** Forward (north, moveAxis.y < 0). Default: speed */
  forwardSpeed?: number;
  /** Backward (south, moveAxis.y > 0). Default: speed */
  backwardSpeed?: number;
  /** Left (moveAxis.x < 0). Default: speed */
  leftSpeed?: number;
  /** Right (moveAxis.x > 0). Default: speed */
  rightSpeed?: number;
}

/** Scale factor: speed * deltaTime * MOVE_SCALE ≈ px/s at 60fps. Speed 35 → ~336 px/s */
export const MOVE_SCALE = 10;

/**
 * Get effective speed for X axis (left/right).
 */
export function getSpeedX(config: ShipMovementConfig, moveAxisX: number): number {
  if (moveAxisX > 0) return config.rightSpeed ?? config.speed;
  if (moveAxisX < 0) return config.leftSpeed ?? config.speed;
  return config.speed;
}

/**
 * Get effective speed for Y axis (forward/backward).
 */
export function getSpeedY(config: ShipMovementConfig, moveAxisY: number): number {
  if (moveAxisY < 0) return config.forwardSpeed ?? config.speed;
  if (moveAxisY > 0) return config.backwardSpeed ?? config.speed;
  return config.speed;
}
