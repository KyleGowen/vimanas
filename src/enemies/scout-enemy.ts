import { loadImage } from '../assets/asset-loader';
import { Thruster, SCOUT_THRUSTER_CONFIG } from '../effects/thruster-effect';
import { drawImage, drawRect } from '../render/renderer';
import {
  fireScoutWeapon,
  SCOUT_FIRE_RATE_S,
  SCOUT_ATTACK,
} from '../weapons/scout-weapon';
import type { EnemyProjectileOptions } from '../projectiles/enemy-projectile';

/** Scout stats per scout_design_lock.md */
const SCOUT_HP = 15;
const SCOUT_DEFENSE = 1;

/** Scout size ~48×48 base, scaled +30% for test */
const BASE_SIZE = 48;
const SPRITE_SCALE = 1.3;
export const SCOUT_SIZE = Math.round(BASE_SIZE * SPRITE_SCALE);

const SPRITE_PATH = '/images/enemies/scout_flying.png';
const FALLBACK_COLOR = '#FFBF00';

/** Speed south: ~100 px/s per task spec */
const SCOUT_SPEED_PX_S = 100;

/**
 * Scout enemy. HP 15, Defense 1. Moves south. Takes damage per basic_gun_design_lock.
 */
export class ScoutEnemy {
  hp: number;
  readonly defense: number;
  readonly attack: number;
  x: number;
  y: number;
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
   * Sprite stays loaded; no reload needed.
   */
  reset(x: number, y: number): void {
    this.x = x;
    this.y = y;
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
   * Move south (y increases toward bottom). Speed ~100 px/s.
   * Uses delta time for frame-rate independence.
   */
  update(deltaTime: number): void {
    this.y += SCOUT_SPEED_PX_S * deltaTime;
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
      drawImage(ctx, this.sprite, x, y, SCOUT_SIZE, SCOUT_SIZE);
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
