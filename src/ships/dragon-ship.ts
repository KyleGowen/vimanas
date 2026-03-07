import { loadImage } from '../assets/asset-loader';
import { Thruster, DRAGON_THRUSTER_CONFIG } from '../effects/thruster-effect';
import { drawDragonMeditatingZone } from '../effects/dragon-shield-effect';
import { drawImageFit, drawRect } from '../render/renderer';
import {
  MOVE_SCALE,
  getSpeedX,
  getSpeedY,
} from './ship-movement';
import type { PlayAreaBounds, ShipStatsBase } from './ship-types';

/** Dragon stats per dragon_design_lock.md. Mana archetype: high mana, faster regen. */
export type DragonShipStats = ShipStatsBase;

/** Default Dragon stats: HP 18, Defense 16, Attack 18, Mana 28, ManaRegen 4. */
export const DRAGON_STATS: DragonShipStats = {
  hp: 18,
  defense: 16,
  attack: 18,
  mana: 28,
  manaRegenRate: 4,
  speed: 20,
  forwardSpeed: 25,
  backwardSpeed: 18,
  leftSpeed: 32,
  rightSpeed: 32,
};

const SPRITE_PATH = '/images/ships/dragon/dragon_facing_n.png';
const BASE_SIZE = 64;
/** 1.3 base + 20% on-screen size increase (same as Wolf/Turtle) */
const SPRITE_SCALE = 1.3 * 1.2;
const SHIP_WIDTH = Math.round(BASE_SIZE * SPRITE_SCALE);
const SHIP_HEIGHT = Math.round(BASE_SIZE * SPRITE_SCALE);
const FALLBACK_COLOR = '#8B0000';

/** Ship size for bounds; Dragon 64×64 base, scaled same as Wolf/Turtle */
export const DRAGON_SHIP_SIZE = SHIP_WIDTH;

/** Meditating: 1.75× mana regen per dragon_shield_design_lock */
export const DRAGON_MEDITATING_REGEN_MULTIPLIER = 1.75;

/** Wing thrusters: 50% of main height, 80% of main width */
const DRAGON_WING_THRUSTER_HEIGHT_SCALE = 0.5;
const DRAGON_WING_THRUSTER_WIDTH_SCALE = 0.8;

export type { PlayAreaBounds } from './ship-types';

export class DragonShip {
  readonly stats: DragonShipStats;
  /** Current mana; depletes on primary (1/fire) and secondary (drain while charging), regens when not using. */
  currentMana: number;
  x: number;
  y: number;
  private readonly thruster: Thruster;
  private readonly thrusterLeft: Thruster;
  private readonly thrusterRight: Thruster;
  private sprite: HTMLImageElement | null = null;
  private loaded = false;
  /** Last move axis from update(); used for thruster scaling. */
  private lastMoveAxis = { x: 0, y: 0 };
  /** True when shield (meditating) is held. Boosts mana regen, blocks firing. */
  meditatingActive = false;

  constructor(stats: DragonShipStats = DRAGON_STATS) {
    this.stats = { ...stats };
    this.currentMana = this.stats.mana;
    this.x = 0;
    this.y = 0;
    this.thruster = new Thruster(DRAGON_THRUSTER_CONFIG);
    const wingConfig = {
      ...DRAGON_THRUSTER_CONFIG,
      widthRatio: (DRAGON_THRUSTER_CONFIG.widthRatio ?? 0.08) * DRAGON_WING_THRUSTER_WIDTH_SCALE,
      heightRatio: (DRAGON_THRUSTER_CONFIG.heightRatio ?? 0.396) * DRAGON_WING_THRUSTER_HEIGHT_SCALE,
      northHeightScale: 1,
      southWidthScale: 1.2,
      southHeightScale: 0.5,
    };
    this.thrusterLeft = new Thruster({ ...wingConfig, originXOffset: 0.30 });
    this.thrusterRight = new Thruster({ ...wingConfig, originXOffset: 0.70 });
  }

  /** Max HP for HUD (initial value). */
  get maxHp(): number {
    return DRAGON_STATS.hp;
  }

  /** Max mana for HUD. */
  get maxMana(): number {
    return DRAGON_STATS.mana;
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
   * Apply damage per basic_gun_design_lock. Dragon meditating does NOT reduce damage.
   */
  takeDamage(weaponStrength: number): boolean {
    const actualDamage = Math.max(0.1, weaponStrength / this.stats.defense);
    this.stats.hp -= actualDamage;
    return this.stats.hp <= 0;
  }

  /** Set meditating state from shield input. Call each frame from scene. */
  setShieldInput(held: boolean): void {
    this.meditatingActive = held;
  }

  /** Meditating is free — no mana consumption. */
  consumeShieldMana(_deltaTime: number): void {
    // No-op; meditating does not cost mana
  }

  /**
   * Update position from move axis, clamped to bounds.
   */
  update(
    moveAxis: { x: number; y: number },
    deltaTime: number,
    bounds: PlayAreaBounds
  ): void {
    this.lastMoveAxis = moveAxis;
    const speedX = getSpeedX(this.stats, moveAxis.x) * deltaTime * MOVE_SCALE;
    const speedY = getSpeedY(this.stats, moveAxis.y) * deltaTime * MOVE_SCALE;
    this.x += moveAxis.x * speedX;
    this.y += moveAxis.y * speedY;
    this.x = Math.max(bounds.minX, Math.min(bounds.maxX, this.x));
    this.y = Math.max(bounds.minY, Math.min(bounds.maxY, this.y));
  }

  /**
   * Draw ship. Shield (meditating) zone drawn before ship. Thrusters drawn behind ship.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    screenX?: number,
    screenY?: number,
    gameTime?: number
  ): void {
    const x = screenX ?? this.x;
    const y = screenY ?? this.y;
    if (gameTime !== undefined) {
      if (this.meditatingActive) {
        drawDragonMeditatingZone(
          ctx,
          x,
          y,
          SHIP_WIDTH,
          SHIP_HEIGHT,
          gameTime,
          this.sprite ?? undefined
        );
      }
      if (this.thruster.drawOrder === 'behind') {
        this.thruster.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime, this.lastMoveAxis);
        this.thrusterLeft.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime + 1.5, this.lastMoveAxis);
        this.thrusterRight.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime + 3.2, this.lastMoveAxis);
      }
    }
    if (this.sprite && this.loaded) {
      drawImageFit(ctx, this.sprite, x, y, SHIP_WIDTH, SHIP_HEIGHT);
    } else {
      drawRect(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, FALLBACK_COLOR);
    }
    if (gameTime !== undefined && this.thruster.drawOrder === 'inFront') {
      this.thruster.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime, this.lastMoveAxis);
      this.thrusterLeft.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime + 1.5, this.lastMoveAxis);
      this.thrusterRight.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime + 3.2, this.lastMoveAxis);
    }
  }

  /** Release sprite reference. Call from scene exit(). */
  dispose(): void {
    this.sprite = null;
  }
}
