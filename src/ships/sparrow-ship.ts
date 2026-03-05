import { loadImage } from '../assets/asset-loader';
import { drawImage, drawRect } from '../render/renderer';

/** Sparrow stats per sparrow_design_lock.md */
export interface SparrowShipStats {
  hp: number;
  defense: number;
  attack: number;
  mana: number;
  speed: number;
}

/** Default Sparrow stats: HP 14, Defense 12, Attack 20, Mana 19, Speed 35 */
export const SPARROW_STATS: SparrowShipStats = {
  hp: 14,
  defense: 12,
  attack: 20,
  mana: 19,
  speed: 35,
};

const SPRITE_PATH = '/images/ships/sparrow_facing_n.png';
const SHIP_WIDTH = 64;
const SHIP_HEIGHT = 64;
const FALLBACK_COLOR = '#00FFFF';

/** Ship size for bounds; Sparrow is 64×64 per design lock */
export const SPARROW_SHIP_SIZE = 64;

/** Scale factor: speed * deltaTime * MOVE_SCALE ≈ px/s at 60fps. Speed 35 → ~336 px/s */
const MOVE_SCALE = 10;

export interface PlayAreaBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export class SparrowShip {
  readonly stats: SparrowShipStats;
  x: number;
  y: number;
  private sprite: HTMLImageElement | null = null;
  private loaded = false;

  constructor(stats: SparrowShipStats = SPARROW_STATS) {
    this.stats = { ...stats };
    this.x = 0;
    this.y = 0;
  }

  /** Load sprite via asset-loader. Call from scene enter(). */
  async load(): Promise<void> {
    try {
      this.sprite = await loadImage(SPRITE_PATH);
      this.loaded = true;
    } catch {
      this.loaded = true;
    }
  }

  /** Whether the sprite has finished loading (success or failure). */
  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Update position from move axis, clamped to bounds.
   * InputService → SparrowShip; ship owns its movement.
   * Speed 35 * deltaTime * 10 ≈ 336 px/s at 60fps.
   */
  update(
    moveAxis: { x: number; y: number },
    deltaTime: number,
    bounds: PlayAreaBounds
  ): void {
    const speed = this.stats.speed * deltaTime * MOVE_SCALE;
    this.x += moveAxis.x * speed;
    this.y += moveAxis.y * speed;
    this.x = Math.max(bounds.minX, Math.min(bounds.maxX, this.x));
    this.y = Math.max(bounds.minY, Math.min(bounds.maxY, this.y));
  }

  /** Draw ship at (x, y), 64×64, top-down. Cyan fallback if not loaded. */
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.sprite && this.loaded) {
      drawImage(ctx, this.sprite, this.x, this.y, SHIP_WIDTH, SHIP_HEIGHT);
    } else {
      drawRect(ctx, this.x, this.y, SHIP_WIDTH, SHIP_HEIGHT, FALLBACK_COLOR);
    }
  }

  /** Release sprite reference. Call from scene exit(). */
  dispose(): void {
    this.sprite = null;
  }
}
