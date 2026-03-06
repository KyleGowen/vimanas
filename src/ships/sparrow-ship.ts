import { loadImage } from '../assets/asset-loader';
import { Thruster, SPARROW_THRUSTER_CONFIG } from '../effects/thruster-effect';
import {
  drawShieldGlow,
  SPARROW_SHIELD_CONFIG,
} from '../effects/shield-effect';
import { drawImage, drawRect } from '../render/renderer';
import {
  type ShipMovementConfig,
  MOVE_SCALE,
  getSpeedX,
  getSpeedY,
} from './ship-movement';

/** Sparrow stats per sparrow_design_lock.md. Movement speeds are per-direction. */
export interface SparrowShipStats extends ShipMovementConfig {
  hp: number;
  defense: number;
  attack: number;
  mana: number;
  manaRegenRate: number;
}

/** Default Sparrow stats: HP 28 (CEO: doubled), Defense 12, Attack 20, Mana 19, ManaRegen 3/s, Speed 42. Forward +25%, backward -10%. */
export const SPARROW_STATS: SparrowShipStats = {
  hp: 28,
  defense: 12,
  attack: 20,
  mana: 19,
  manaRegenRate: 3,
  speed: 42,
  forwardSpeed: 52.5,
  backwardSpeed: 37.8,
  leftSpeed: 46,
  rightSpeed: 46,
};

const SPRITE_PATH = '/images/ships/sparrow/sparrow_facing_n.png';
const BASE_SIZE = 64;
/** 1.3 base + 20% on-screen size increase (CEO) */
const SPRITE_SCALE = 1.3 * 1.2;
const SHIP_WIDTH = Math.round(BASE_SIZE * SPRITE_SCALE);
const SHIP_HEIGHT = Math.round(BASE_SIZE * SPRITE_SCALE);
const FALLBACK_COLOR = '#00FFFF';

/** Ship size for bounds; Sparrow 64×64 base, scaled +30% (CEO) */
export const SPARROW_SHIP_SIZE = SHIP_WIDTH;

/** Shield: 1 mana per second while held. Configurable for balance/upgrades. */
export const SPARROW_SHIELD_MANA_PER_SECOND = 1;

/** Shield: 50% damage reduction. Configurable for balance/upgrades. */
export const SPARROW_SHIELD_DAMAGE_REDUCTION = 0.5;

export interface PlayAreaBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export class SparrowShip {
  readonly stats: SparrowShipStats;
  /** Current mana; depletes on secondary fire and shield, regens when not using either. */
  currentMana: number;
  x: number;
  y: number;
  private readonly thruster: Thruster;
  private sprite: HTMLImageElement | null = null;
  private loaded = false;
  /** Last move axis from update(); used to scale thruster when moving north. */
  private lastMoveAxis = { x: 0, y: 0 };
  /** True when shield is held and mana is sufficient. */
  shieldActive = false;

  constructor(stats: SparrowShipStats = SPARROW_STATS) {
    this.stats = { ...stats };
    this.currentMana = this.stats.mana;
    this.x = 0;
    this.y = 0;
    this.thruster = new Thruster(SPARROW_THRUSTER_CONFIG);
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
   * Apply damage per basic_gun_design_lock: actualDamage = Max(0.1, weaponStrength / targetDefense).
   * Shield reduces damage by SPARROW_SHIELD_DAMAGE_REDUCTION when active.
   * @param weaponStrength - From enemy projectile
   * @returns true if ship is dead (hp <= 0)
   */
  takeDamage(weaponStrength: number): boolean {
    let actualDamage = Math.max(0.1, weaponStrength / this.stats.defense);
    if (this.shieldActive) {
      actualDamage *= 1 - SPARROW_SHIELD_DAMAGE_REDUCTION;
    }
    this.stats.hp -= actualDamage;
    return this.stats.hp <= 0;
  }

  /** Set shield state from input. Call each frame from scene. */
  setShieldInput(held: boolean): void {
    this.shieldActive = held && this.currentMana > 0;
  }

  /** Consume mana for shield. Call when shield is active. */
  consumeShieldMana(deltaTime: number): void {
    this.currentMana = Math.max(
      0,
      this.currentMana - SPARROW_SHIELD_MANA_PER_SECOND * deltaTime
    );
  }

  /**
   * Update position from move axis, clamped to bounds.
   * InputService → SparrowShip; ship owns its movement.
   * Per-direction speeds (forwardSpeed, backwardSpeed, leftSpeed, rightSpeed) override base speed when set.
   * Speed 35 * deltaTime * 10 ≈ 336 px/s at 60fps.
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
   * Draw ship. If screenX, screenY provided (scene passes screen coords), draw there.
   * Else draw at (this.x, this.y) for backward compat in tests.
   * When gameTime is provided, draws thruster effect behind ship first.
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
      if (this.shieldActive) {
        drawShieldGlow(
          ctx,
          x,
          y,
          SHIP_WIDTH,
          SHIP_HEIGHT,
          gameTime,
          SPARROW_SHIELD_CONFIG,
          this.sprite
        );
      }
    }
    if (this.sprite && this.loaded) {
      drawImage(ctx, this.sprite, x, y, SHIP_WIDTH, SHIP_HEIGHT);
    } else {
      drawRect(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, FALLBACK_COLOR);
    }
    if (gameTime !== undefined) {
      this.thruster.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime, this.lastMoveAxis);
    }
  }

  /** Release sprite reference. Call from scene exit(). */
  dispose(): void {
    this.sprite = null;
  }
}
