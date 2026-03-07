import { loadImage } from '../assets/asset-loader';
import { Thruster, TURTLE_THRUSTER_CONFIG } from '../effects/thruster-effect';
import {
  drawTurtleShieldZone,
  TURTLE_SHIELD_RADIUS_PX,
} from '../effects/turtle-shield-effect';
import { drawImageFit, drawRect } from '../render/renderer';
import {
  type ShipMovementConfig,
  MOVE_SCALE,
  getSpeedX,
  getSpeedY,
} from './ship-movement';

/** Turtle stats per turtle_design_lock.md. Movement speeds are per-direction. */
export interface TurtleShipStats extends ShipMovementConfig {
  hp: number;
  defense: number;
  attack: number;
  mana: number;
  manaRegenRate: number;
}

/** Default Turtle stats: HP 26, Defense 24, Attack 14, Mana 20, Speed 16, ManaRegen 3.2/s. */
export const TURTLE_STATS: TurtleShipStats = {
  hp: 26,
  defense: 24,
  attack: 14,
  mana: 20,
  manaRegenRate: 3.2,
  speed: 16,
  forwardSpeed: 20,
  backwardSpeed: 14.4,
  leftSpeed: 17.6,
  rightSpeed: 17.6,
};

const SPRITE_PATHS = {
  facing_n: '/images/ships/turtle/turtle_facing_n.png',
  tilt_left: '/images/ships/turtle/turtle_tilt_left.png',
  tilt_right: '/images/ships/turtle/turtle_tilt_right.png',
} as const;

const BASE_SIZE = 64;
/** 1.3 base + 20% on-screen size increase (same as Sparrow) */
const SPRITE_SCALE = 1.3 * 1.2;
const SHIP_WIDTH = Math.round(BASE_SIZE * SPRITE_SCALE);
const SHIP_HEIGHT = Math.round(BASE_SIZE * SPRITE_SCALE);
const FALLBACK_COLOR = '#FFBF00';

/** Ship size for bounds; Turtle 64×64 base, scaled same as Sparrow */
export const TURTLE_SHIP_SIZE = SHIP_WIDTH;

/** Shield: 0.75 mana per second while held per turtle_shield_design_lock */
export const TURTLE_SHIELD_MANA_PER_SECOND = 0.75;

/** Shield: 65% damage reduction per turtle_shield_design_lock */
export const TURTLE_SHIELD_DAMAGE_REDUCTION = 0.65;

export interface PlayAreaBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** Side thrusters at 60% of main size; each animates independently (phase offsets). */
const SIDE_THRUSTER_SCALE = 0.6;

export class TurtleShip {
  readonly stats: TurtleShipStats;
  /** Current mana; depletes on secondary fire and shield, regens when not using either. */
  currentMana: number;
  x: number;
  y: number;
  private readonly thruster: Thruster;
  private readonly thrusterLeft: Thruster;
  private readonly thrusterRight: Thruster;
  private sprites: Map<string, HTMLImageElement> = new Map();
  private loaded = false;
  /** Last move axis from update(); used for pose selection and thruster scaling. */
  private lastMoveAxis = { x: 0, y: 0 };
  /** True when shield is held and mana is sufficient. */
  shieldActive = false;

  constructor(stats: TurtleShipStats = TURTLE_STATS) {
    this.stats = { ...stats };
    this.currentMana = this.stats.mana;
    this.x = 0;
    this.y = 0;
    this.thruster = new Thruster(TURTLE_THRUSTER_CONFIG);
    const sideConfig = {
      ...TURTLE_THRUSTER_CONFIG,
      widthRatio: (TURTLE_THRUSTER_CONFIG.widthRatio ?? 0.12) * SIDE_THRUSTER_SCALE,
      heightRatio: 0.396 * SIDE_THRUSTER_SCALE,
    };
    this.thrusterLeft = new Thruster({ ...sideConfig, originXOffset: 0.37 });
    this.thrusterRight = new Thruster({ ...sideConfig, originXOffset: 0.63 });
  }

  /** Max HP for HUD (initial value). */
  get maxHp(): number {
    return TURTLE_STATS.hp;
  }

  /** Max mana for HUD. */
  get maxMana(): number {
    return TURTLE_STATS.mana;
  }

  /** Load sprites via asset-loader. Call from scene enter(). */
  async load(): Promise<void> {
    let facingN: HTMLImageElement | null = null;
    for (const [pose, path] of Object.entries(SPRITE_PATHS)) {
      try {
        const img = await loadImage(path);
        this.sprites.set(pose, img);
        if (pose === 'facing_n') facingN = img;
      } catch {
        if (facingN) this.sprites.set(pose, facingN);
      }
    }
    this.loaded = true;
  }

  /** Whether sprites have finished loading (success or failure). */
  isLoaded(): boolean {
    return this.loaded;
  }

  /** Get current sprite based on pose. Uses facing_n for boost, idle, firing, damage, hit_flash. */
  private getSprite(): HTMLImageElement | null {
    if (this.lastMoveAxis.x < 0) {
      return this.sprites.get('tilt_left') ?? this.sprites.get('facing_n') ?? null;
    }
    if (this.lastMoveAxis.x > 0) {
      return this.sprites.get('tilt_right') ?? this.sprites.get('facing_n') ?? null;
    }
    return this.sprites.get('facing_n') ?? null;
  }

  /**
   * Apply damage per basic_gun_design_lock: actualDamage = Max(0.1, weaponStrength / targetDefense).
   * Shield reduces damage by TURTLE_SHIELD_DAMAGE_REDUCTION when active.
   */
  takeDamage(weaponStrength: number): boolean {
    let actualDamage = Math.max(0.1, weaponStrength / this.stats.defense);
    if (this.shieldActive) {
      actualDamage *= 1 - TURTLE_SHIELD_DAMAGE_REDUCTION;
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
      this.currentMana - TURTLE_SHIELD_MANA_PER_SECOND * deltaTime
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
   * When gameTime is provided, draws thruster effect behind ship.
   * Shield zone is drawn by caller when shieldActive (turtle-shield-effect).
   */
  draw(
    ctx: CanvasRenderingContext2D,
    screenX?: number,
    screenY?: number,
    gameTime?: number
  ): void {
    const x = screenX ?? this.x;
    const y = screenY ?? this.y;
    if (gameTime !== undefined && this.shieldActive) {
      drawTurtleShieldZone(
        ctx,
        x,
        y,
        SHIP_WIDTH,
        SHIP_HEIGHT,
        TURTLE_SHIELD_RADIUS_PX,
        gameTime
      );
    }
    const sprite = this.getSprite();
    if (sprite && this.loaded) {
      drawImageFit(ctx, sprite, x, y, SHIP_WIDTH, SHIP_HEIGHT);
    } else {
      drawRect(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, FALLBACK_COLOR);
    }
    if (gameTime !== undefined) {
      this.thruster.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime, this.lastMoveAxis);
      this.thrusterLeft.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime + 1.5, this.lastMoveAxis);
      this.thrusterRight.draw(ctx, x, y, SHIP_WIDTH, SHIP_HEIGHT, gameTime + 3.2, this.lastMoveAxis);
    }
  }

  /** Release sprite references. Call from scene exit(). */
  dispose(): void {
    this.sprites.clear();
  }
}
