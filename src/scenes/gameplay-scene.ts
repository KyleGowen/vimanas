import type { GameContext, Scene } from '../game';
import { clear, drawText } from '../render/renderer';
import { CombatHUD } from '../ui/combat-hud';
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
import {
  BossPlaceholder,
  BOSS_WIDTH,
  BOSS_HEIGHT,
} from '../enemies/boss-placeholder';
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
  private gameTime = 0;
  private paused = false;
  private gameOver = false;
  private levelComplete = false;
  private bossPhase = false;
  private boss: BossPlaceholder | null = null;
  private bossTransitionTime = 0;
  private wasEscapeDown = false;
  private goToScene?: (id: 'boot' | 'gameplay') => void;
  private score = 0;
  private readonly combatHud = new CombatHUD();

  constructor() {
    this.ship = new SparrowShip();
    this.projectilePool = new ProjectilePool();
    this.enemyProjectilePool = new EnemyProjectilePool();
    this.enemyPool = new EnemyPool();
    this.waveSpawner = new WaveSpawner(this.enemyPool, {
      onScoutSpawned: () => {},
      onWaveComplete: () => {},
      onLevelWavesComplete: () => {
        this.bossPhase = true;
        this.bossTransitionTime = this.gameTime + 1;
      },
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
    this.waveSpawner.reset(0);
    this.lastFireTime = 0;
    this.gameTime = 0;
    this.paused = false;
    this.gameOver = false;
    this.levelComplete = false;
    this.bossPhase = false;
    this.boss = null;
    this.bossTransitionTime = 0;
    this.wasEscapeDown = false;
    this.score = 0;
    void this.ship.load();
    void this.combatHud.load();
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

    if (this.levelComplete) {
      const clicked = ctx.input.consumeClick();
      if ((clicked || ctx.input.isStartPressed()) && this.goToScene) {
        this.goToScene('boot');
      }
      return;
    }

    if (this.paused) return;

    this.gameTime += ctx.deltaTime;

    if (!this.bossPhase) {
      this.levelScroll.update(ctx.deltaTime);
    }

    if (
      this.bossPhase &&
      this.boss === null &&
      this.gameTime >= this.bossTransitionTime
    ) {
      this.boss = new BossPlaceholder();
      this.boss.reset(ctx.width / 2 - BOSS_WIDTH / 2, 80);
      void this.boss.load();
    }

    this.waveSpawner.setSpawnWorldY(this.levelScroll.getSpawnWorldYAboveViewport());
    for (const scout of this.waveSpawner.update(this.gameTime)) {
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
      if (this.gameTime - this.lastFireTime >= BASIC_GUN_FIRE_RATE_S) {
        this.lastFireTime = this.gameTime;
        const opts = fireBasicGun({
          shipX: this.ship.x,
          shipY: scrollOffset + this.ship.y,
          shipSize: SPARROW_SHIP_SIZE,
          attack: this.ship.stats.attack,
          spawnTime: this.gameTime,
        });
        const p = this.projectilePool.get(opts);
        if (p) this.projectiles.push(p);
      }
    }

    const projectileBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
      gameTime: this.gameTime,
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

    const viewportMinY = scrollOffset;
    const viewportMaxY = scrollOffset + ctx.height;
    for (const scout of this.scouts) {
      const onScreen = scout.y >= viewportMinY && scout.y <= viewportMaxY;
      if (!onScreen) continue;
      const opts = scout.tryFire(this.gameTime);
      if (opts) {
        const ep = this.enemyProjectilePool.get(opts);
        if (ep) this.enemyProjectiles.push(ep);
      }
    }

    if (this.boss && !this.levelComplete) {
      const opts = this.boss.tryFire(this.gameTime, scrollOffset);
      if (opts) {
        const ep = this.enemyProjectilePool.get(opts);
        if (ep) this.enemyProjectiles.push(ep);
      }
    }

    const enemyProjectileBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
      gameTime: this.gameTime,
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
      let hit = false;
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
            this.score += 100;
            this.enemyPool.return(scout);
            this.scouts[si] = this.scouts[this.scouts.length - 1];
            this.scouts.pop();
          }
          hit = true;
          break;
        }
      }
      if (!hit && this.boss) {
        projectileRect.x = p.x - PROJECTILE_SIZE / 2;
        projectileRect.y =
          this.levelScroll.worldToScreenY(p.y) - PROJECTILE_SIZE / 2;
        const bossRect = {
          x: this.boss.x,
          y: this.boss.y,
          width: BOSS_WIDTH,
          height: BOSS_HEIGHT,
        };
        if (aabbOverlap(projectileRect, bossRect)) {
          const dead = this.boss.takeDamage(p.damage);
          this.projectilePool.return(p);
          this.projectiles.splice(pi, 1);
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
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
    this.ship.draw(ctx.ctx, this.ship.x, this.ship.y, this.gameTime);
    for (const scout of this.scouts) {
      scout.draw(
        ctx.ctx,
        scout.x,
        this.levelScroll.worldToScreenY(scout.y),
        this.gameTime
      );
    }
    if (this.boss) {
      this.boss.draw(ctx.ctx);
    }
    for (const p of this.projectiles) {
      p.draw(
        ctx.ctx,
        p.x,
        this.levelScroll.worldToScreenY(p.y),
        this.gameTime
      );
    }
    for (const ep of this.enemyProjectiles) {
      ep.draw(
        ctx.ctx,
        ep.x,
        this.levelScroll.worldToScreenY(ep.y),
        this.gameTime
      );
    }
    this.combatHud.draw({
      ctx: ctx.ctx,
      width: ctx.width,
      height: ctx.height,
      ship: this.ship,
      score: this.score,
      lives: 1,
      boss: this.boss ?? undefined,
    });
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
    if (this.levelComplete) {
      ctx.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.ctx.fillRect(0, 0, ctx.width, ctx.height);
      drawText(ctx.ctx, 'LEVEL COMPLETE', ctx.width / 2, ctx.height / 2 - 20, {
        font: '48px sans-serif',
        color: '#44ff44',
        align: 'center',
        baseline: 'middle',
      });
      drawText(
        ctx.ctx,
        'Click or press Enter to continue',
        ctx.width / 2,
        ctx.height / 2 + 20,
        {
          font: '20px sans-serif',
          color: '#aaaaaa',
          align: 'center',
          baseline: 'middle',
        }
      );
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
    this.combatHud.dispose();
    this.parallaxController.dispose();
    this.ship.dispose();
    if (this.boss) {
      this.boss.dispose();
      this.boss = null;
    }
    for (const scout of this.scouts) {
      this.enemyPool.return(scout);
    }
    this.scouts = [];
  }
}
