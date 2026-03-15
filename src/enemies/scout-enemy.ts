import { loadImage } from '../assets/asset-loader';
import { Thruster, SCOUT_THRUSTER_CONFIG } from '../effects/thruster-effect';
import { drawImageFit, drawRect } from '../render/renderer';
import {
  fireScoutWeapon,
  SCOUT_FIRE_RATE_S,
  SCOUT_ATTACK,
} from '../weapons/scout-weapon';
import type { EnemyProjectileOptions } from '../projectiles/enemy-projectile';
import type { MovementBehaviorId } from '../levels/attack-pattern-resolver';
import { applyMovement } from './scout-movement';
import type { ScoutMovementContext } from './scout-movement';

/** Scout stats per scout_design_lock.md */
const SCOUT_HP = 15;
const SCOUT_DEFENSE = 1;

/** Scout size ~48×48 base, scaled +30% + 20% on-screen (CEO) */
const BASE_SIZE = 48;
const SPRITE_SCALE = 1.3 * 1.2;
export const SCOUT_SIZE = Math.round(BASE_SIZE * SPRITE_SCALE);

const SPRITE_PATH = '/images/enemies/scout_flying.png';
const FALLBACK_COLOR = '#FFBF00';

/** Speed south: 150 px/s (1.5× original 100) */
const SCOUT_SPEED_PX_S = 150;

/**
 * Scout enemy. HP 15, Defense 1. Moves south. Takes damage per basic_gun_design_lock.
 */
export class ScoutEnemy {
  hp: number;
  readonly defense: number;
  readonly attack: number;
  x: number;
  y: number;
  private spawnX = 0;
  private spawnY = 0;
  /** Spawn time (game time when scout entered). -1 when not set (legacy path). */
  private spawnTime = -1;
  private behaviorId: MovementBehaviorId = 'straight';
  private readonly thrusterLeft: Thruster;
  private readonly thrusterRight: Thruster;
  private lastFireTime = -Infinity;
  private sprite: HTMLImageElement | null = null;
  private loaded = false;

  constructor() {
    this.hp = SCOUT_HP;
    this.defense = SCOUT_DEFENSE;
    this.attack = SCOUT_ATTACK;
    this.x = 0;
    this.y = 0;
    this.thrusterLeft = new Thruster({ ...SCOUT_THRUSTER_CONFIG, originXOffset: 0.42 });
    this.thrusterRight = new Thruster({ ...SCOUT_THRUSTER_CONFIG, originXOffset: 0.58 });
  }

  /**
   * Try to fire at player. Returns projectile options if cooldown elapsed; otherwise null.
   * Caller spawns projectile via EnemyProjectilePool.get(options).
   */
  tryFire(now: number): EnemyProjectileOptions | null {
    if (now - this.lastFireTime < SCOUT_FIRE_RATE_S) return null;
    this.lastFireTime = now;
    return fireScoutWeapon({
      scoutX: this.x,
      scoutY: this.y,
      scoutSize: SCOUT_SIZE,
      attack: this.attack,
      spawnTime: now,
    });
  }

  /**
   * Reset for pool reuse. Sets position, full HP, and fire cooldown.
   * Optional behaviorId and spawnTime for movement behaviors; omit for legacy straight movement.
   * Sprite stays loaded; no reload needed.
   */
  reset(
    x: number,
    y: number,
    behaviorId?: MovementBehaviorId,
    spawnTime?: number
  ): void {
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.spawnTime = spawnTime ?? -1;
    this.behaviorId = behaviorId ?? 'straight';
    this.hp = SCOUT_HP;
    this.lastFireTime = -Infinity; // allow immediate first shot
  }

  /** Load sprite via asset-loader. Call from pool prewarm or scene enter(). */
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
   * Update position. When gameTime (and spawnTime at reset) are provided, uses movement behavior.
   * Otherwise uses legacy straight south movement (y += speed * deltaTime).
   */
  update(
    deltaTime: number,
    gameTime?: number,
    context?: ScoutMovementContext
  ): void {
    if (gameTime !== undefined && this.spawnTime >= 0) {
      const pos = applyMovement(
        this.behaviorId,
        this.spawnX,
        this.spawnY,
        this.spawnTime,
        gameTime,
        context
      );
      this.x = pos.x;
      this.y = pos.y;
    } else {
      this.y += SCOUT_SPEED_PX_S * deltaTime;
    }
  }

  /**
   * Apply damage per basic_gun_design_lock: actualDamage = Max(0.1, weaponStrength / targetDefense).
   * @param weaponStrength - From projectile (e.g. Sparrow Attack 20 → 5)
   * @returns true if Scout is dead (hp <= 0)
   */
  takeDamage(weaponStrength: number): boolean {
    const actualDamage = Math.max(0.1, weaponStrength / this.defense);
    this.hp -= actualDamage;
    return this.hp <= 0;
  }

  /**
   * Draw Scout. If screenX, screenY provided (scene passes screen coords), draw there.
   * Else draw at (this.x, this.y) for backward compat in tests.
   * When gameTime is provided, draws two small thrusters on thruster ports.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    screenX?: number,
    screenY?: number,
    gameTime?: number
  ): void {
    const x = screenX ?? this.x;
    const y = screenY ?? this.y;
    if (this.sprite && this.loaded) {
      drawImageFit(ctx, this.sprite, x, y, SCOUT_SIZE, SCOUT_SIZE);
    } else {
      drawRect(ctx, x, y, SCOUT_SIZE, SCOUT_SIZE, FALLBACK_COLOR);
    }
    if (gameTime !== undefined) {
      this.thrusterLeft.draw(ctx, x, y, SCOUT_SIZE, SCOUT_SIZE, gameTime);
      this.thrusterRight.draw(ctx, x, y, SCOUT_SIZE, SCOUT_SIZE, gameTime);
    }
  }

  /** Release sprite reference. Call from scene exit(). */
  dispose(): void {
    this.sprite = null;
  }
}
