/**
 * LevelScrollController — Manages vertical world scroll.
 * World Y increases downward. Camera scrolls upward (scrollOffset increases).
 * Player stays at fixed screen position (bottom third); entities use world coordinates.
 * Uses delta time for frame-rate independence per engine_learnings.md.
 */

/** Scroll speed in world units per second (pixels per second). */
export const SCROLL_SPEED_PX_S = 80;

/** Player offset from bottom of screen (keeps ship in bottom third). */
export const PLAYER_BOTTOM_OFFSET_PX = 150;

export interface VisibleWorldBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

export class LevelScrollController {
  /** World Y at top of visible viewport. Increases as camera scrolls upward. */
  private scrollOffset = 0;

  private screenWidth = 1280;
  private screenHeight = 720;

  /**
   * Configure screen dimensions. Call before first update.
   */
  setScreenSize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  /**
   * Reset scroll to start. Call on scene enter.
   */
  reset(): void {
    this.scrollOffset = 0;
  }

  /**
   * Advance scroll by deltaTime. Call each frame.
   */
  update(deltaTime: number): void {
    this.scrollOffset += SCROLL_SPEED_PX_S * deltaTime;
  }

  /**
   * Convert world Y to screen Y.
   * screenY = worldY - scrollOffset
   */
  worldToScreenY(worldY: number): number {
    return worldY - this.scrollOffset;
  }

  /**
   * Convert screen Y to world Y.
   * worldY = screenY + scrollOffset
   */
  screenToWorldY(screenY: number): number {
    return screenY + this.scrollOffset;
  }

  /**
   * World Y for player at fixed screen position (bottom third).
   * Player stays at screenY = height - PLAYER_BOTTOM_OFFSET_PX.
   */
  getPlayerWorldY(): number {
    return this.scrollOffset + this.screenHeight - PLAYER_BOTTOM_OFFSET_PX;
  }

  /**
   * Current scroll offset (world Y at top of viewport).
   */
  getScrollOffset(): number {
    return this.scrollOffset;
  }

  /**
   * Visible world bounds for viewport. Useful for spawn/offscreen checks.
   */
  getVisibleWorldBounds(): VisibleWorldBounds {
    return {
      minX: 0,
      maxX: this.screenWidth,
      minY: this.scrollOffset,
      maxY: this.scrollOffset + this.screenHeight,
      width: this.screenWidth,
      height: this.screenHeight,
    };
  }

  /**
   * World Y for spawning above visible area. Spawn above top of viewport.
   */
  getSpawnWorldYAboveViewport(margin: number = 50): number {
    return this.scrollOffset - margin;
  }

  /**
   * Whether a world Y is below the visible viewport (offscreen).
   */
  isBelowViewport(worldY: number, margin: number = 0): boolean {
    return worldY > this.scrollOffset + this.screenHeight + margin;
  }

  /**
   * Whether a world Y is above the visible viewport.
   */
  isAboveViewport(worldY: number, margin: number = 0): boolean {
    return worldY < this.scrollOffset - margin;
  }
}
