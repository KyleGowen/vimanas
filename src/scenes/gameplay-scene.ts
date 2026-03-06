import type { GameContext, Scene } from '../game';
import { clear, drawText } from '../render/renderer';
import {
  LevelScrollController,
  PLAYER_BOTTOM_OFFSET_PX,
} from '../level/level-scroll-controller';
import { ParallaxController } from '../parallax/parallax-controller';
import { type PlayerProjectile, PROJECTILE_SIZE } from '../projectiles/player-projectile';
import { type EnemyProjectile, ENEMY_PROJECTILE_SIZE } from '../projectiles/enemy-projectile';
import { fireBasicGun, BASIC_GUN_FIRE_RATE_S } from '../weapons/basic-gun';
import { SparrowShip, SPARROW_SHIP_SIZE, SPARROW_STATS } from '../ships/sparrow-ship';
import { ProjectilePool } from '../pools/projectile-pool';
import { EnemyProjectilePool } from '../pools/enemy-projectile-pool';
import { EnemyPool } from '../pools/enemy-pool';
import { ScoutEnemy, SCOUT_SIZE } from '../enemies/scout-enemy';
import { aabbOverlap } from '../util/collision';
import { WaveSpawner } from '../waves/wave-spawner';

/** Padding from screen edges for play area bounds */
const PLAY_AREA_PADDING = 50;

export class GameplayScene implements Scene {
  private readonly levelScroll = new LevelScrollController();
  private readonly parallaxController = new ParallaxController();
  private ship: SparrowShip;
  private readonly projectilePool: ProjectilePool;
  private readonly enemyProjectilePool: EnemyProjectilePool;
  private readonly enemyPool: EnemyPool;
  private readonly waveSpawner: WaveSpawner;
  private projectiles: PlayerProjectile[] = [];
  private enemyProjectiles: EnemyProjectile[] = [];
  private scouts: ScoutEnemy[] = [];
  private lastFireTime = 0;
  private paused = false;
  private gameOver = false;
  private wasEscapeDown = false;
  private goToScene?: (id: 'boot' | 'gameplay') => void;

  constructor() {
    this.ship = new SparrowShip();
    this.projectilePool = new ProjectilePool();
    this.enemyProjectilePool = new EnemyProjectilePool();
    this.enemyPool = new EnemyPool();
    this.waveSpawner = new WaveSpawner(this.enemyPool, {
      onScoutSpawned: () => {},
      onWaveComplete: () => {},
    });
  }

  enter(ctx: GameContext): void {
    this.goToScene = ctx.goToScene;
    this.levelScroll.reset();
    this.levelScroll.setScreenSize(ctx.width, ctx.height);
    this.parallaxController.setScreenSize(ctx.width, ctx.height);
    void this.parallaxController.load();
    this.ship.x = ctx.width / 2 - SPARROW_SHIP_SIZE / 2;
    this.ship.y = ctx.height - PLAYER_BOTTOM_OFFSET_PX;
    this.ship.stats.hp = SPARROW_STATS.hp;
    for (const p of this.projectiles) {
      this.projectilePool.return(p);
    }
    for (const p of this.enemyProjectiles) {
      this.enemyProjectilePool.return(p);
    }
    this.projectiles = [];
    this.enemyProjectiles = [];
    for (const scout of this.scouts) {
      this.enemyPool.return(scout);
    }
    this.scouts = [];
    void this.enemyPool.prewarm();
    this.waveSpawner.setScreenSize(ctx.width, ctx.height);
    this.waveSpawner.setSpawnWorldY(this.levelScroll.getSpawnWorldYAboveViewport());
    this.waveSpawner.reset();
    this.lastFireTime = 0;
    this.paused = false;
    this.gameOver = false;
    this.wasEscapeDown = false;
    void this.ship.load();
  }

  update(ctx: GameContext): void {
    const escapeDown = ctx.input.isEscapePressed();
    if (escapeDown && !this.wasEscapeDown && !this.gameOver) {
      this.paused = !this.paused;
    }
    this.wasEscapeDown = escapeDown;

    if (this.gameOver) {
      const clicked = ctx.input.consumeClick();
      if ((clicked || ctx.input.isStartPressed()) && this.goToScene) {
        this.goToScene('gameplay');
      }
      return;
    }

    if (this.paused) return;

    this.levelScroll.update(ctx.deltaTime);

    const now = performance.now() / 1000;
    this.waveSpawner.setSpawnWorldY(this.levelScroll.getSpawnWorldYAboveViewport());
    for (const scout of this.waveSpawner.update(now)) {
      this.scouts.push(scout);
    }

    const scrollOffset = this.levelScroll.getScrollOffset();
    const playAreaBounds = {
      minX: PLAY_AREA_PADDING,
      maxX: ctx.width - PLAY_AREA_PADDING - SPARROW_SHIP_SIZE,
      minY: PLAY_AREA_PADDING,
      maxY: ctx.height - PLAY_AREA_PADDING - SPARROW_SHIP_SIZE,
    };
    this.ship.update(ctx.input.getMoveAxis(), ctx.deltaTime, playAreaBounds);

    if (ctx.input.isFirePressed()) {
      if (now - this.lastFireTime >= BASIC_GUN_FIRE_RATE_S) {
        this.lastFireTime = now;
        const opts = fireBasicGun({
          shipX: this.ship.x,
          shipY: scrollOffset + this.ship.y,
          shipSize: SPARROW_SHIP_SIZE,
          attack: this.ship.stats.attack,
          spawnTime: now,
        });
        const p = this.projectilePool.get(opts);
        if (p) this.projectiles.push(p);
      }
    }

    const projectileBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
    };
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const alive = p.update(ctx.deltaTime, projectileBounds);
      if (!alive) {
        this.projectilePool.return(p);
        this.projectiles.splice(i, 1);
      }
    }

    for (const scout of this.scouts) {
      scout.update(ctx.deltaTime);
    }

    for (let si = this.scouts.length - 1; si >= 0; si--) {
      const scout = this.scouts[si];
      if (this.levelScroll.isBelowViewport(scout.y, SCOUT_SIZE)) {
        this.waveSpawner.notifyScoutDied();
        this.enemyPool.return(scout);
        this.scouts[si] = this.scouts[this.scouts.length - 1];
        this.scouts.pop();
      }
    }

    for (const scout of this.scouts) {
      const opts = scout.tryFire(now);
      if (opts) {
        const ep = this.enemyProjectilePool.get(opts);
        if (ep) this.enemyProjectiles.push(ep);
      }
    }

    const enemyProjectileBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
    };
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const p = this.enemyProjectiles[i];
      const alive = p.update(ctx.deltaTime, enemyProjectileBounds);
      if (!alive) {
        this.enemyProjectilePool.return(p);
        this.enemyProjectiles.splice(i, 1);
      }
    }

    const enemyProjectileRect = {
      x: 0,
      y: 0,
      width: ENEMY_PROJECTILE_SIZE,
      height: ENEMY_PROJECTILE_SIZE,
    };
    const shipRect = {
      x: this.ship.x,
      y: scrollOffset + this.ship.y,
      width: SPARROW_SHIP_SIZE,
      height: SPARROW_SHIP_SIZE,
    };
    for (let ei = this.enemyProjectiles.length - 1; ei >= 0; ei--) {
      const ep = this.enemyProjectiles[ei];
      enemyProjectileRect.x = ep.x - ENEMY_PROJECTILE_SIZE / 2;
      enemyProjectileRect.y = ep.y - ENEMY_PROJECTILE_SIZE / 2;
      if (aabbOverlap(enemyProjectileRect, shipRect)) {
        const dead = this.ship.takeDamage(ep.weaponStrength);
        this.enemyProjectilePool.return(ep);
        this.enemyProjectiles.splice(ei, 1);
        if (dead) this.gameOver = true;
        break;
      }
    }

    const projectileRect = { x: 0, y: 0, width: PROJECTILE_SIZE, height: PROJECTILE_SIZE };
    for (let pi = this.projectiles.length - 1; pi >= 0; pi--) {
      const p = this.projectiles[pi];
      projectileRect.x = p.x - PROJECTILE_SIZE / 2;
      projectileRect.y = p.y - PROJECTILE_SIZE / 2;
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        const scoutRect = { x: scout.x, y: scout.y, width: SCOUT_SIZE, height: SCOUT_SIZE };
        if (aabbOverlap(projectileRect, scoutRect)) {
          const dead = scout.takeDamage(p.damage);
          this.projectilePool.return(p);
          this.projectiles.splice(pi, 1);
          if (dead) {
            this.waveSpawner.notifyScoutDied();
            this.enemyPool.return(scout);
            this.scouts[si] = this.scouts[this.scouts.length - 1];
            this.scouts.pop();
          }
          break;
        }
      }
    }
  }

  draw(ctx: GameContext): void {
    clear(ctx.ctx, ctx.width, ctx.height, '#0a1520');
    this.parallaxController.draw(
      ctx.ctx,
      this.levelScroll.getScrollOffset(),
      ctx.width,
      ctx.height
    );
    drawText(ctx.ctx, `Wave ${this.waveSpawner.currentWaveIndex}`, 20, 30, {
      font: '16px sans-serif',
      color: '#aaaaaa',
      align: 'left',
      baseline: 'top',
    });
    drawText(ctx.ctx, `HP: ${this.ship.stats.hp}`, 20, 52, {
      font: '16px sans-serif',
      color: '#ffffff',
      align: 'left',
      baseline: 'top',
    });
    this.ship.draw(ctx.ctx, this.ship.x, this.ship.y);
    for (const scout of this.scouts) {
      scout.draw(ctx.ctx, scout.x, this.levelScroll.worldToScreenY(scout.y));
    }
    for (const p of this.projectiles) {
      p.draw(ctx.ctx, p.x, this.levelScroll.worldToScreenY(p.y));
    }
    for (const ep of this.enemyProjectiles) {
      ep.draw(ctx.ctx, ep.x, this.levelScroll.worldToScreenY(ep.y));
    }
    if (this.gameOver) {
      ctx.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.ctx.fillRect(0, 0, ctx.width, ctx.height);
      drawText(ctx.ctx, 'GAME OVER', ctx.width / 2, ctx.height / 2 - 20, {
        font: '48px sans-serif',
        color: '#ff4444',
        align: 'center',
        baseline: 'middle',
      });
      drawText(ctx.ctx, 'Click or press Enter to restart', ctx.width / 2, ctx.height / 2 + 20, {
        font: '20px sans-serif',
        color: '#aaaaaa',
        align: 'center',
        baseline: 'middle',
      });
    }
    if (this.paused) {
      ctx.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.ctx.fillRect(0, 0, ctx.width, ctx.height);
      drawText(ctx.ctx, 'PAUSED', ctx.width / 2, ctx.height / 2 - 20, {
        font: '48px sans-serif',
        color: '#ffffff',
        align: 'center',
        baseline: 'middle',
      });
      drawText(ctx.ctx, 'Press Escape to resume', ctx.width / 2, ctx.height / 2 + 20, {
        font: '20px sans-serif',
        color: '#aaaaaa',
        align: 'center',
        baseline: 'middle',
      });
    }
  }

  exit(): void {
    this.goToScene = undefined;
    this.parallaxController.dispose();
    this.ship.dispose();
    for (const scout of this.scouts) {
      this.enemyPool.return(scout);
    }
    this.scouts = [];
  }
}
