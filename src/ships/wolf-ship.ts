import { loadImage } from '../assets/asset-loader';
import { Thruster, WOLF_THRUSTER_CONFIG } from '../effects/thruster-effect';
import { drawWolfShieldZone, WOLF_SHIELD_ARC_RADIUS_PX } from '../effects/wolf-shield-effect';
import { drawImageFit, drawRect } from '../render/renderer';
import {
  type ShipMovementConfig,
  MOVE_SCALE,
  getSpeedX,
  getSpeedY,
} from './ship-movement';

/** Wolf stats per wolf_design_lock.md. Movement speeds are per-direction. */
export interface WolfShipStats extends ShipMovementConfig {
  hp: number;
  defense: number;
  attack: number;
  mana: number;
  manaRegenRate: number;
}

/** Default Wolf stats: HP 20, Defense 20, Attack 20, Mana 20, Speed 20. Per-direction: forward +25%, backward 90%, left/right 110%. */
export const WOLF_STATS: WolfShipStats = {
  hp: 20,
  defense: 20,
  attack: 20,
  mana: 20,
  manaRegenRate: 3,
  speed: 20,
  forwardSpeed: 25,
  backwardSpeed: 18,
  leftSpeed: 32,
  rightSpeed: 32,
};

const SPRITE_PATH = '/images/ships/wolf/wolf_facing_n.png';
const BASE_SIZE = 64;
/** 1.3 base + 20% on-screen size increase (same as Sparrow/Turtle) */
const SPRITE_SCALE = 1.3 * 1.2;
const SHIP_WIDTH = Math.round(BASE_SIZE * SPRITE_SCALE);
const SHIP_HEIGHT = Math.round(BASE_SIZE * SPRITE_SCALE);
const FALLBACK_COLOR = '#E8E8E8';

/** Ship size for bounds; Wolf 64×64 base, scaled same as Sparrow/Turtle */
export const WOLF_SHIP_SIZE = SHIP_WIDTH;

/** Shield: 0.8 mana per second while held per wolf_shield_design_lock */
export const WOLF_SHIELD_MANA_PER_SECOND = 0.8;

/** Shield: 45% damage reduction (front arc only) per wolf_shield_design_lock */
export const WOLF_SHIELD_DAMAGE_REDUCTION = 0.45;

export interface PlayAreaBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export class WolfShip {
  readonly stats: WolfShipStats;
  /** Current mana; depletes on secondary fire and shield, regens when not using either. */
  currentMana: number;
  x: number;
  y: number;
  private readonly thruster: Thruster;
  private sprite: HTMLImageElement | null = null;
  private loaded = false;
  /** Last move axis from update(); used for thruster scaling. */
  private lastMoveAxis = { x: 0, y: 0 };
  /** True when shield is held and mana is sufficient. */
  shieldActive = false;

  constructor(stats: WolfShipStats = WOLF_STATS) {
    this.stats = { ...stats };
    this.currentMana = this.stats.mana;
    this.x = 0;
    this.y = 0;
    this.thruster = new Thruster(WOLF_THRUSTER_CONFIG);
  }

  /** Max HP for HUD (initial value). */
  get maxHp(): number {
    return WOLF_STATS.hp;
  }

  /** Max mana for HUD. */
  get maxMana(): number {
    return WOLF_STATS.mana;
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
   * Shield reduces damage by WOLF_SHIELD_DAMAGE_REDUCTION when active AND damage source is in front arc.
   * @param weaponStrength - From enemy projectile
   * @param damageSourceX - World X of damage source (for front-arc check)
   * @param damageSourceY - World Y of damage source (for front-arc check)
   * @param shipWorldY - World Y of ship center (scrollOffset + ship.y + shipSize/2). Required for front-arc check.
   * @returns true if ship is dead (hp <= 0)
   */
  takeDamage(
    weaponStrength: number,
    damageSourceX?: number,
    damageSourceY?: number,
    shipWorldY?: number
  ): boolean {
    let actualDamage = Math.max(0.1, weaponStrength / this.stats.defense);
    if (
      this.shieldActive &&
      damageSourceX !== undefined &&
      damageSourceY !== undefined &&
      shipWorldY !== undefined
    ) {
      const cx = this.x + WOLF_SHIP_SIZE / 2;
      const cy = shipWorldY;
      const angle = Math.atan2(damageSourceY - cy, damageSourceX - cx);
      // North-facing: front arc is -90° to +90° (angle -π/2 to π/2). In screen coords, north = -Y.
      const frontArcMin = -Math.PI / 2;
      const frontArcMax = Math.PI / 2;
      if (angle >= frontArcMin && angle <= frontArcMax) {
        actualDamage *= 1 - WOLF_SHIELD_DAMAGE_REDUCTION;
      }
    } else if (this.shieldActive && (damageSourceX === undefined || damageSourceY === undefined || shipWorldY === undefined)) {
      // No source position: assume front (conservative for player)
      actualDamage *= 1 - WOLF_SHIELD_DAMAGE_REDUCTION;
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
      this.currentMana - WOLF_SHIELD_MANA_PER_SECOND * deltaTime
    );
  }

  /**
   * Update position from move axis, clamped to bounds.
   * Per-direction speeds (forwardSpeed, backwardSpeed, leftSpeed, rightSpeed).
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
   * Shield zone drawn before ship (per engine_learnings: shield before ship).
   * Thruster drawn behind ship (drawOrder: behind).
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
        drawWolfShieldZone(
          ctx,
          x,
          y,
          SHIP_WIDTH,
          SHIP_HEIGHT,
          WOLF_SHIELD_ARC_RADIUS_PX,
          gameTime,
          this.sprite ?? undefined
        );
      }
      // Thruster draws behind ship when drawOrder is 'behind'
      if (this.thruster.drawOrder === 'behind') {
        this.thruster.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime, this.lastMoveAxis);
      }
    }
    if (this.sprite && this.loaded) {
      drawImageFit(ctx, this.sprite, x, y, SHIP_WIDTH, SHIP_HEIGHT);
    } else {
      drawRect(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, FALLBACK_COLOR);
    }
    if (gameTime !== undefined && this.thruster.drawOrder === 'inFront') {
      this.thruster.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime, this.lastMoveAxis);
    }
  }

  /** Release sprite reference. Call from scene exit(). */
  dispose(): void {
    this.sprite = null;
  }
}
