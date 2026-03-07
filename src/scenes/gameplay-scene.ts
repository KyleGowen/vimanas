import type { GameContext, Scene } from '../game';
import { clear, drawText } from '../render/renderer';
import { CombatHUD } from '../ui/combat-hud';
import {
  LevelScrollController,
  PLAYER_BOTTOM_OFFSET_PX,
  SCROLL_SPEED_PX_S,
} from '../level/level-scroll-controller';
import { ParallaxController } from '../parallax/parallax-controller';
import { type ArcShot } from '../arc-shot/arc-shot';
import {
  type TurtleSpreadProjectile,
  TURTLE_SPREAD_PROJECTILE_SIZE,
} from '../projectiles/turtle-spread-projectile';
import { type EnemyProjectile, ENEMY_PROJECTILE_SIZE } from '../projectiles/enemy-projectile';
import { fireTurtlePrimary, TURTLE_PRIMARY_FIRE_RATE_S } from '../weapons/turtle-primary-weapon';
import {
  fireTurtleSpread,
  TURTLE_SECONDARY_MANA_COST,
  TURTLE_SECONDARY_FIRE_RATE_S,
} from '../weapons/turtle-secondary';
import { TurtleShip, TURTLE_SHIP_SIZE, TURTLE_STATS } from '../ships/turtle-ship';
import { ArcShotPool } from '../pools/arc-shot-pool';
import { TurtleSpreadPool } from '../pools/turtle-spread-pool';
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

/** Duration for parallax to ease to halt when boss enters (seconds) */
const BOSS_PARALLAX_DECAY_DURATION_S = 5;

export class GameplayScene implements Scene {
  private readonly levelScroll = new LevelScrollController();
  private readonly parallaxController = new ParallaxController();
  private ship: TurtleShip;
  private readonly arcShotPool: ArcShotPool;
  private readonly turtleSpreadPool: TurtleSpreadPool;
  private readonly enemyProjectilePool: EnemyProjectilePool;
  private readonly enemyPool: EnemyPool;
  private readonly waveSpawner: WaveSpawner;
  private arcShots: ArcShot[] = [];
  private spreadProjectiles: TurtleSpreadProjectile[] = [];
  private enemyProjectiles: EnemyProjectile[] = [];
  private scouts: ScoutEnemy[] = [];
  private lastFireTime = 0;
  private lastSecondaryFireTime = 0;
  private gameTime = 0;
  private paused = false;
  private gameOver = false;
  private levelComplete = false;
  private bossPhase = false;
  private boss: BossPlaceholder | null = null;
  private bossTransitionTime = 0;
  /** Parallax scroll offset; eases to halt when boss enters */
  private parallaxScrollOffset = 0;
  private wasEscapeDown = false;
  private goToScene?: (id: 'boot' | 'gameplay' | 'results', state?: unknown) => void;
  private score = 0;
  private readonly combatHud = new CombatHUD();

  constructor() {
    this.ship = new TurtleShip();
    this.arcShotPool = new ArcShotPool();
    this.turtleSpreadPool = new TurtleSpreadPool();
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
    this.parallaxScrollOffset = 0;
    this.levelScroll.setScreenSize(ctx.width, ctx.height);
    this.parallaxController.setScreenSize(ctx.width, ctx.height);
    void this.parallaxController.load();
    this.ship.x = ctx.width / 2 - TURTLE_SHIP_SIZE / 2;
    this.ship.y = ctx.height - PLAYER_BOTTOM_OFFSET_PX;
    this.ship.stats.hp = TURTLE_STATS.hp;
    this.ship.currentMana = this.ship.stats.mana;
    for (const a of this.arcShots) {
      this.arcShotPool.return(a);
    }
    for (const p of this.spreadProjectiles) {
      this.turtleSpreadPool.return(p);
    }
    this.arcShots = [];
    this.spreadProjectiles = [];
    for (const p of this.enemyProjectiles) {
      this.enemyProjectilePool.return(p);
    }
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
    this.lastSecondaryFireTime = 0;
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
      if (this.goToScene) {
        this.goToScene('results', {
          victory: false,
          score: this.score,
          lives: 0,
        });
      }
      return;
    }

    if (this.levelComplete) {
      if (this.goToScene) {
        this.goToScene('results', {
          victory: true,
          score: this.score,
          lives: 1,
        });
      }
      return;
    }

    if (this.paused) return;

    this.gameTime += ctx.deltaTime;

    if (!this.bossPhase) {
      this.levelScroll.update(ctx.deltaTime);
      this.parallaxScrollOffset = this.levelScroll.getScrollOffset();
    } else {
      const elapsed = this.gameTime - (this.bossTransitionTime - 1);
      const decay = Math.max(0, 1 - elapsed / BOSS_PARALLAX_DECAY_DURATION_S);
      this.parallaxScrollOffset += SCROLL_SPEED_PX_S * ctx.deltaTime * decay;
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
      maxX: ctx.width - PLAY_AREA_PADDING - TURTLE_SHIP_SIZE,
      minY: PLAY_AREA_PADDING,
      maxY: ctx.height - PLAY_AREA_PADDING - TURTLE_SHIP_SIZE,
    };
    this.ship.update(ctx.input.getMoveAxis(), ctx.deltaTime, playAreaBounds);

    const secondaryFireDown = ctx.input.isSecondaryFirePressed();
    const shieldDown = ctx.input.isShieldPressed();
    if (!secondaryFireDown && !shieldDown) {
      this.ship.currentMana = Math.min(
        this.ship.stats.mana,
        this.ship.currentMana + this.ship.stats.manaRegenRate * ctx.deltaTime
      );
    }

    if (shieldDown && this.ship.currentMana > 0) {
      this.ship.consumeShieldMana(ctx.deltaTime);
      this.ship.setShieldInput(true);
    } else {
      this.ship.setShieldInput(false);
    }

    if (ctx.input.isFirePressed()) {
      if (this.gameTime - this.lastFireTime >= TURTLE_PRIMARY_FIRE_RATE_S) {
        this.lastFireTime = this.gameTime;
        const opts = fireTurtlePrimary({
          shipX: this.ship.x,
          shipY: scrollOffset + this.ship.y,
          shipSize: TURTLE_SHIP_SIZE,
          attack: this.ship.stats.attack,
          spawnTime: this.gameTime,
        });
        const a = this.arcShotPool.get(opts);
        if (a) this.arcShots.push(a);
      }
    }

    if (
      secondaryFireDown &&
      this.ship.currentMana >= TURTLE_SECONDARY_MANA_COST &&
      this.gameTime - this.lastSecondaryFireTime >= TURTLE_SECONDARY_FIRE_RATE_S
    ) {
      this.lastSecondaryFireTime = this.gameTime;
      this.ship.currentMana -= TURTLE_SECONDARY_MANA_COST;
      const opts = fireTurtleSpread({
        shipX: this.ship.x,
        shipY: scrollOffset + this.ship.y,
        shipSize: TURTLE_SHIP_SIZE,
        attack: this.ship.stats.attack,
        spawnTime: this.gameTime,
      });
      const projectiles = this.turtleSpreadPool.getSpread(opts);
      this.spreadProjectiles.push(...projectiles);
    }

    const projectileBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
      gameTime: this.gameTime,
    };
    for (let i = this.arcShots.length - 1; i >= 0; i--) {
      const a = this.arcShots[i];
      const alive = a.update(ctx.deltaTime, projectileBounds);
      if (!alive) {
        this.arcShotPool.return(a);
        this.arcShots.splice(i, 1);
      }
    }

    for (let i = this.spreadProjectiles.length - 1; i >= 0; i--) {
      const p = this.spreadProjectiles[i];
      const alive = p.update(ctx.deltaTime, projectileBounds);
      if (!alive) {
        this.turtleSpreadPool.return(p);
        this.spreadProjectiles.splice(i, 1);
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
      width: TURTLE_SHIP_SIZE,
      height: TURTLE_SHIP_SIZE,
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

    for (const arc of this.arcShots) {
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        if (
          !arc.hitTargets.has(scout) &&
          arc.overlapsRect(scout.x, scout.y, SCOUT_SIZE, SCOUT_SIZE)
        ) {
          arc.hitTargets.add(scout);
          const dead = scout.takeDamage(arc.damage);
          if (dead) {
            this.waveSpawner.notifyScoutDied();
            this.score += 100;
            this.enemyPool.return(scout);
            this.scouts[si] = this.scouts[this.scouts.length - 1];
            this.scouts.pop();
          }
        }
      }
      if (this.boss && !arc.hitTargets.has(this.boss)) {
        const bossWorldY = scrollOffset + this.boss.y;
        if (arc.overlapsRect(this.boss.x, bossWorldY, BOSS_WIDTH, BOSS_HEIGHT)) {
          arc.hitTargets.add(this.boss);
          const dead = this.boss.takeDamage(arc.damage);
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
    }

    const spreadRect = {
      x: 0,
      y: 0,
      width: TURTLE_SPREAD_PROJECTILE_SIZE,
      height: TURTLE_SPREAD_PROJECTILE_SIZE,
    };
    for (let pi = this.spreadProjectiles.length - 1; pi >= 0; pi--) {
      const p = this.spreadProjectiles[pi];
      spreadRect.x = p.x - TURTLE_SPREAD_PROJECTILE_SIZE / 2;
      spreadRect.y = p.y - TURTLE_SPREAD_PROJECTILE_SIZE / 2;
      let hit = false;
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        const scoutRect = { x: scout.x, y: scout.y, width: SCOUT_SIZE, height: SCOUT_SIZE };
        if (aabbOverlap(spreadRect, scoutRect)) {
          const dead = scout.takeDamage(p.damage);
          this.turtleSpreadPool.return(p);
          this.spreadProjectiles.splice(pi, 1);
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
        spreadRect.x = p.x - TURTLE_SPREAD_PROJECTILE_SIZE / 2;
        spreadRect.y = this.levelScroll.worldToScreenY(p.y) - TURTLE_SPREAD_PROJECTILE_SIZE / 2;
        const bossRect = {
          x: this.boss.x,
          y: this.boss.y,
          width: BOSS_WIDTH,
          height: BOSS_HEIGHT,
        };
        if (aabbOverlap(spreadRect, bossRect)) {
          const dead = this.boss.takeDamage(p.damage);
          this.turtleSpreadPool.return(p);
          this.spreadProjectiles.splice(pi, 1);
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
      this.parallaxScrollOffset,
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
    for (const a of this.arcShots) {
      a.draw(
        ctx.ctx,
        a.x,
        this.levelScroll.worldToScreenY(a.y),
        this.gameTime
      );
    }
    for (const p of this.spreadProjectiles) {
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
