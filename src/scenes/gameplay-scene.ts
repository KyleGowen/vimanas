import type { GameContext, Scene } from '../game';
import { clear, drawText } from '../render/renderer';
import { CombatHUD } from '../ui/combat-hud';
import {
  LevelScrollController,
  PLAYER_BOTTOM_OFFSET_PX,
  SCROLL_SPEED_PX_S,
} from '../level/level-scroll-controller';
import { ParallaxController } from '../parallax/parallax-controller';
import { type PlayerProjectile } from '../projectiles/player-projectile';
import { PROJECTILE_SIZE } from '../projectiles/player-projectile';
import {
  type HomingCrescentProjectile,
  HOMING_CRESCENT_SIZE,
} from '../projectiles/homing-crescent-projectile';
import { type ChargedBallProjectile } from '../projectiles/charged-ball-projectile';
import { drawDragonChargedBall } from '../effects/dragon-charged-ball-effect';
import { type EnemyProjectile, ENEMY_PROJECTILE_SIZE } from '../projectiles/enemy-projectile';
import {
  createDefaultShip,
  DEFAULT_SHIP,
  getDefaultShipMana,
  getDefaultShipMaxHp,
  getDefaultShipSize,
  type DefaultShip,
} from '../config/gameplay-config';
import { fireWolfPrimary, WOLF_PRIMARY_FIRE_RATE_S } from '../weapons/wolf-primary-weapon';
import {
  WOLF_SECONDARY_MANA_PER_SECOND,
  wolfSecondaryDamagePerSecond,
  getWolfSecondaryMuzzle,
} from '../weapons/wolf-secondary';
import {
  drawWolfSustainedBeam,
  WOLF_BEAM_GROWTH_RATE,
  WOLF_BEAM_WIDTH,
} from '../effects/wolf-beam-effect';
import { WolfShip, WOLF_SHIP_SIZE } from '../ships/wolf-ship';
import { TurtleShip } from '../ships/turtle-ship';
import {
  DragonShip,
  DRAGON_SHIP_SIZE,
  DRAGON_MEDITATING_REGEN_MULTIPLIER,
} from '../ships/dragon-ship';
import { fireTurtlePrimary, TURTLE_PRIMARY_FIRE_RATE_S } from '../weapons/turtle-primary-weapon';
import {
  fireDragonPrimary,
  DRAGON_PRIMARY_FIRE_RATE_S,
  DRAGON_PRIMARY_MANA_COST,
} from '../weapons/dragon-primary-weapon';
import {
  fireDragonChargedBall,
  DRAGON_SECONDARY_MANA_PER_SECOND,
  DRAGON_SECONDARY_MIN_CHARGE_S,
  DRAGON_SECONDARY_MIN_RADIUS,
  DRAGON_SECONDARY_RADIUS_GROWTH_PER_SEC,
} from '../weapons/dragon-secondary';
import {
  fireTurtleSpread,
  TURTLE_SECONDARY_MANA_COST,
  TURTLE_SECONDARY_FIRE_RATE_S,
} from '../weapons/turtle-secondary';
import { type ArcShot } from '../arc-shot/arc-shot';
import {
  type TurtleSpreadProjectile,
  TURTLE_SPREAD_PROJECTILE_SIZE,
} from '../projectiles/turtle-spread-projectile';
import { ProjectilePool } from '../pools/projectile-pool';
import { ArcShotPool } from '../pools/arc-shot-pool';
import { TurtleSpreadPool } from '../pools/turtle-spread-pool';
import { HomingCrescentPool } from '../pools/homing-crescent-pool';
import { ChargedBallPool } from '../pools/charged-ball-pool';
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
import { isEnemyInWolfFrontArc } from '../effects/wolf-shield-effect';

/** Wolf shield contact damage: 1 dps to enemies in front arc */
const WOLF_SHIELD_CONTACT_DAMAGE_PER_SECOND = 1;

/** Padding from screen edges for play area bounds */
const PLAY_AREA_PADDING = 50;

/** Duration for parallax to ease to halt when boss enters (seconds) */
const BOSS_PARALLAX_DECAY_DURATION_S = 5;

export class GameplayScene implements Scene {
  private readonly levelScroll = new LevelScrollController();
  private readonly parallaxController = new ParallaxController();
  private ship: DefaultShip;
  private readonly projectilePool: ProjectilePool;
  private readonly homingCrescentPool: HomingCrescentPool;
  private readonly chargedBallPool: ChargedBallPool;
  private readonly arcShotPool: ArcShotPool;
  private readonly turtleSpreadPool: TurtleSpreadPool;
  private readonly enemyProjectilePool: EnemyProjectilePool;
  private readonly enemyPool: EnemyPool;
  private readonly waveSpawner: WaveSpawner;
  private playerProjectiles: PlayerProjectile[] = [];
  private homingCrescentProjectiles: HomingCrescentProjectile[] = [];
  private chargedBallProjectiles: ChargedBallProjectile[] = [];
  private arcShots: ArcShot[] = [];
  private spreadProjectiles: TurtleSpreadProjectile[] = [];
  private enemyProjectiles: EnemyProjectile[] = [];
  private scouts: ScoutEnemy[] = [];
  private lastFireTime = 0;
  private lastSecondaryFireTime = 0;
  /** Dragon secondary: charge start time; -1 when not charging */
  private dragonChargeStartTime = -1;
  private gameTime = 0;
  /** Wolf sustained beam active this frame (hold secondary fire) */
  private wolfBeamActive = false;
  /** Seconds beam has been held; grows length until mana runs out */
  private wolfBeamDuration = 0;
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
    this.ship = createDefaultShip();
    this.projectilePool = new ProjectilePool(28);
    this.homingCrescentPool = new HomingCrescentPool();
    this.chargedBallPool = new ChargedBallPool();
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
    const shipSize = getDefaultShipSize();
    this.ship.x = ctx.width / 2 - shipSize / 2;
    this.ship.y = ctx.height - PLAYER_BOTTOM_OFFSET_PX;
    this.ship.stats.hp = getDefaultShipMaxHp();
    this.ship.currentMana = getDefaultShipMana();
    for (const p of this.playerProjectiles) {
      this.projectilePool.return(p);
    }
    this.playerProjectiles = [];
    for (const hc of this.homingCrescentProjectiles) {
      this.homingCrescentPool.return(hc);
    }
    this.homingCrescentProjectiles = [];
    for (const cb of this.chargedBallProjectiles) {
      this.chargedBallPool.return(cb);
    }
    this.chargedBallProjectiles = [];
    this.dragonChargeStartTime = -1;
    for (const a of this.arcShots) {
      this.arcShotPool.return(a);
    }
    this.arcShots = [];
    for (const p of this.spreadProjectiles) {
      this.turtleSpreadPool.return(p);
    }
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
    this.wolfBeamActive = false;
    this.wolfBeamDuration = 0;
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
    const shipSize = getDefaultShipSize();
    const playAreaBounds = {
      minX: PLAY_AREA_PADDING,
      maxX: ctx.width - PLAY_AREA_PADDING - shipSize,
      minY: PLAY_AREA_PADDING,
      maxY: ctx.height - PLAY_AREA_PADDING - shipSize,
    };
    this.ship.update(ctx.input.getMoveAxis(), ctx.deltaTime, playAreaBounds);

    const secondaryFireDown = ctx.input.isSecondaryFirePressed();
    const shieldDown = ctx.input.isShieldPressed();

    if (this.ship instanceof DragonShip) {
      if (shieldDown) {
        this.ship.setShieldInput(true);
        const boostedRegen =
          this.ship.stats.manaRegenRate *
          DRAGON_MEDITATING_REGEN_MULTIPLIER *
          ctx.deltaTime;
        this.ship.currentMana = Math.min(
          this.ship.stats.mana,
          this.ship.currentMana + boostedRegen
        );
      } else {
        this.ship.setShieldInput(false);
        if (!secondaryFireDown) {
          this.ship.currentMana = Math.min(
            this.ship.stats.mana,
            this.ship.currentMana + this.ship.stats.manaRegenRate * ctx.deltaTime
          );
        }
      }
    } else {
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
    }

    if (ctx.input.isFirePressed()) {
      if (DEFAULT_SHIP === 'wolf') {
        if (this.gameTime - this.lastFireTime >= WOLF_PRIMARY_FIRE_RATE_S) {
          this.lastFireTime = this.gameTime;
          const [optsLeft, optsRight] = fireWolfPrimary({
            shipX: this.ship.x,
            shipY: scrollOffset + this.ship.y,
            shipSize: WOLF_SHIP_SIZE,
            attack: this.ship.stats.attack,
            spawnTime: this.gameTime,
          });
          const p1 = this.projectilePool.get(optsLeft);
          const p2 = this.projectilePool.get(optsRight);
          if (p1) this.playerProjectiles.push(p1);
          if (p2) this.playerProjectiles.push(p2);
        }
      } else if (this.ship instanceof DragonShip) {
        const dragon = this.ship;
        if (
          !dragon.meditatingActive &&
          this.ship.currentMana >= DRAGON_PRIMARY_MANA_COST &&
          this.gameTime - this.lastFireTime >= DRAGON_PRIMARY_FIRE_RATE_S
        ) {
          this.lastFireTime = this.gameTime;
          this.ship.currentMana -= DRAGON_PRIMARY_MANA_COST;
          const [optsLeft, optsRight] = fireDragonPrimary({
            shipX: this.ship.x,
            shipY: scrollOffset + this.ship.y,
            shipSize: DRAGON_SHIP_SIZE,
            attack: this.ship.stats.attack,
            spawnTime: this.gameTime,
          });
          const hc1 = this.homingCrescentPool.get(optsLeft);
          const hc2 = this.homingCrescentPool.get(optsRight);
          if (hc1) this.homingCrescentProjectiles.push(hc1);
          if (hc2) this.homingCrescentProjectiles.push(hc2);
        }
      } else {
        if (this.gameTime - this.lastFireTime >= TURTLE_PRIMARY_FIRE_RATE_S) {
          this.lastFireTime = this.gameTime;
          const opts = fireTurtlePrimary({
            shipX: this.ship.x,
            shipY: scrollOffset + this.ship.y,
            shipSize,
            attack: this.ship.stats.attack,
            spawnTime: this.gameTime,
          });
          const arc = this.arcShotPool.get(opts);
          if (arc) this.arcShots.push(arc);
        }
      }
    }

    // Wolf: sustained beam while secondary held; 2 mana/sec; grows from nose until mana runs out
    this.wolfBeamActive =
      DEFAULT_SHIP === 'wolf' &&
      secondaryFireDown &&
      this.ship.currentMana > 0;
    if (this.wolfBeamActive) {
      this.wolfBeamDuration += ctx.deltaTime;
      const manaCost = WOLF_SECONDARY_MANA_PER_SECOND * ctx.deltaTime;
      this.ship.currentMana = Math.max(0, this.ship.currentMana - manaCost);
    } else {
      this.wolfBeamDuration = 0;
    }

    // Dragon: charged ball — hold to charge, release to fire; mana drains while charging
    if (this.ship instanceof DragonShip) {
      const dragon = this.ship;
      if (secondaryFireDown && !dragon.meditatingActive) {
        if (this.dragonChargeStartTime < 0 && this.ship.currentMana > 0) {
          this.dragonChargeStartTime = this.gameTime;
        }
        if (this.dragonChargeStartTime >= 0) {
          const manaCost = DRAGON_SECONDARY_MANA_PER_SECOND * ctx.deltaTime;
          this.ship.currentMana = Math.max(0, this.ship.currentMana - manaCost);
          if (this.ship.currentMana <= 0) {
            this.dragonChargeStartTime = -1;
          }
        }
      } else {
        if (this.dragonChargeStartTime >= 0) {
          const chargeDuration = this.gameTime - this.dragonChargeStartTime;
          if (chargeDuration >= DRAGON_SECONDARY_MIN_CHARGE_S) {
            const opts = fireDragonChargedBall({
              shipX: this.ship.x,
              shipY: scrollOffset + this.ship.y,
              shipSize: DRAGON_SHIP_SIZE,
              attack: this.ship.stats.attack,
              chargeDuration,
              spawnTime: this.gameTime,
            });
            const cb = this.chargedBallPool.get(opts);
            if (cb) this.chargedBallProjectiles.push(cb);
          }
        }
        this.dragonChargeStartTime = -1;
      }
    } else if (DEFAULT_SHIP === 'turtle') {
      if (
        secondaryFireDown &&
        this.ship.currentMana >= TURTLE_SECONDARY_MANA_COST &&
        this.gameTime - this.lastSecondaryFireTime >= TURTLE_SECONDARY_FIRE_RATE_S
      ) {
        this.lastSecondaryFireTime = this.gameTime;
        this.ship.currentMana -= TURTLE_SECONDARY_MANA_COST;
        const optsList = fireTurtleSpread({
          shipX: this.ship.x,
          shipY: scrollOffset + this.ship.y,
          shipSize,
          attack: this.ship.stats.attack,
          spawnTime: this.gameTime,
        });
        for (const opts of optsList) {
          const sp = this.turtleSpreadPool.get(opts);
          if (sp) this.spreadProjectiles.push(sp);
        }
      }
    }

    const projectileBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
      gameTime: this.gameTime,
    };
    for (let i = this.playerProjectiles.length - 1; i >= 0; i--) {
      const p = this.playerProjectiles[i];
      const alive = p.update(ctx.deltaTime, projectileBounds);
      if (!alive) {
        this.projectilePool.return(p);
        this.playerProjectiles.splice(i, 1);
      }
    }

    // Arc shot update and expire
    for (let ai = this.arcShots.length - 1; ai >= 0; ai--) {
      const arc = this.arcShots[ai];
      if (!arc.update(ctx.deltaTime, { gameTime: this.gameTime })) {
        this.arcShotPool.return(arc);
        this.arcShots.splice(ai, 1);
      }
    }

    // Turtle spread projectile update
    const spreadBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
      gameTime: this.gameTime,
    };
    for (let spi = this.spreadProjectiles.length - 1; spi >= 0; spi--) {
      const sp = this.spreadProjectiles[spi];
      const alive = sp.update(ctx.deltaTime, spreadBounds);
      if (!alive) {
        this.turtleSpreadPool.return(sp);
        this.spreadProjectiles.splice(spi, 1);
      }
    }

    // Dragon charged ball update
    const chargedBallBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
      gameTime: this.gameTime,
    };
    for (let cbi = this.chargedBallProjectiles.length - 1; cbi >= 0; cbi--) {
      const cb = this.chargedBallProjectiles[cbi];
      const alive = cb.update(ctx.deltaTime, chargedBallBounds);
      if (!alive) {
        this.chargedBallPool.return(cb);
        this.chargedBallProjectiles.splice(cbi, 1);
      }
    }

    // Dragon homing crescent update
    const homingBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
      gameTime: this.gameTime,
    };
    for (let hci = this.homingCrescentProjectiles.length - 1; hci >= 0; hci--) {
      const hc = this.homingCrescentProjectiles[hci];
      const alive = hc.update(ctx.deltaTime, homingBounds, this.scouts, this.boss);
      if (!alive) {
        this.homingCrescentPool.return(hc);
        this.homingCrescentProjectiles.splice(hci, 1);
      }
    }

    // Wolf sustained beam damage: dps to enemies in beam
    if (this.wolfBeamActive) {
      const muzzle = getWolfSecondaryMuzzle({
        shipX: this.ship.x,
        shipY: scrollOffset + this.ship.y,
        shipSize: WOLF_SHIP_SIZE,
      });
      const beamLength = this.wolfBeamDuration * WOLF_BEAM_GROWTH_RATE;
      const beamRect = {
        x: muzzle.x - WOLF_BEAM_WIDTH / 2,
        y: muzzle.y - beamLength,
        width: WOLF_BEAM_WIDTH,
        height: beamLength,
      };
      const beamDps = wolfSecondaryDamagePerSecond(this.ship.stats.attack);
      const beamDamage = beamDps * ctx.deltaTime;

      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        const scoutRect = { x: scout.x, y: scout.y, width: SCOUT_SIZE, height: SCOUT_SIZE };
        if (aabbOverlap(beamRect, scoutRect)) {
          const dead = scout.takeDamage(beamDamage);
          if (dead) {
            this.waveSpawner.notifyScoutDied();
            this.score += 100;
            this.enemyPool.return(scout);
            this.scouts[si] = this.scouts[this.scouts.length - 1];
            this.scouts.pop();
          }
        }
      }
      if (this.boss && !this.levelComplete) {
        const bossWorldY = scrollOffset + this.boss.y;
        const bossRect = { x: this.boss.x, y: bossWorldY, width: BOSS_WIDTH, height: BOSS_HEIGHT };
        if (aabbOverlap(beamRect, bossRect)) {
          const dead = this.boss.takeDamage(beamDamage);
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
    }

    // Wolf shield contact damage: 1 dps to enemies in front arc
    if (this.ship instanceof WolfShip && this.ship.shieldActive) {
      const shipWorldY = scrollOffset + this.ship.y + WOLF_SHIP_SIZE / 2;
      const contactDamage = WOLF_SHIELD_CONTACT_DAMAGE_PER_SECOND * ctx.deltaTime;
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        const scoutCx = scout.x + SCOUT_SIZE / 2;
        const scoutCy = scout.y + SCOUT_SIZE / 2;
        if (
          isEnemyInWolfFrontArc(
            this.ship.x,
            this.ship.y,
            WOLF_SHIP_SIZE,
            shipWorldY,
            scoutCx,
            scoutCy
          )
        ) {
          const dead = scout.takeDamage(contactDamage);
          if (dead) {
            this.waveSpawner.notifyScoutDied();
            this.score += 100;
            this.enemyPool.return(scout);
            this.scouts[si] = this.scouts[this.scouts.length - 1];
            this.scouts.pop();
          }
        }
      }
      if (this.boss && !this.levelComplete) {
        const bossWorldY = scrollOffset + this.boss.y;
        const bossCx = this.boss.x + BOSS_WIDTH / 2;
        const bossCy = bossWorldY + BOSS_HEIGHT / 2;
        if (
          isEnemyInWolfFrontArc(
            this.ship.x,
            this.ship.y,
            WOLF_SHIP_SIZE,
            shipWorldY,
            bossCx,
            bossCy
          )
        ) {
          const dead = this.boss.takeDamage(contactDamage);
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
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
      width: shipSize,
      height: shipSize,
    };
    const shipWorldY = scrollOffset + this.ship.y + shipSize / 2;
    for (let ei = this.enemyProjectiles.length - 1; ei >= 0; ei--) {
      const ep = this.enemyProjectiles[ei];
      enemyProjectileRect.x = ep.x - ENEMY_PROJECTILE_SIZE / 2;
      enemyProjectileRect.y = ep.y - ENEMY_PROJECTILE_SIZE / 2;
      if (aabbOverlap(enemyProjectileRect, shipRect)) {
        const dead =
          this.ship instanceof WolfShip
            ? this.ship.takeDamage(ep.weaponStrength, ep.x, ep.y, shipWorldY)
            : this.ship.takeDamage(ep.weaponStrength);
        this.enemyProjectilePool.return(ep);
        this.enemyProjectiles.splice(ei, 1);
        if (dead) this.gameOver = true;
        break;
      }
    }

    const playerProjectileRect = {
      x: 0,
      y: 0,
      width: PROJECTILE_SIZE,
      height: PROJECTILE_SIZE,
    };
    for (let pi = this.playerProjectiles.length - 1; pi >= 0; pi--) {
      const p = this.playerProjectiles[pi];
      playerProjectileRect.x = p.x - PROJECTILE_SIZE / 2;
      playerProjectileRect.y = p.y - PROJECTILE_SIZE / 2;
      let hit = false;
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        const scoutRect = { x: scout.x, y: scout.y, width: SCOUT_SIZE, height: SCOUT_SIZE };
        if (aabbOverlap(playerProjectileRect, scoutRect)) {
          const dead = scout.takeDamage(p.damage);
          this.projectilePool.return(p);
          this.playerProjectiles.splice(pi, 1);
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
        const bossWorldY = scrollOffset + this.boss.y;
        playerProjectileRect.x = p.x - PROJECTILE_SIZE / 2;
        playerProjectileRect.y = p.y - PROJECTILE_SIZE / 2;
        const bossRect = {
          x: this.boss.x,
          y: bossWorldY,
          width: BOSS_WIDTH,
          height: BOSS_HEIGHT,
        };
        if (aabbOverlap(playerProjectileRect, bossRect)) {
          const dead = this.boss.takeDamage(p.damage);
          this.projectilePool.return(p);
          this.playerProjectiles.splice(pi, 1);
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
    }

    // Arc shot collision (Turtle primary)
    for (const arc of this.arcShots) {
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        if (!arc.hitTargets.has(scout) && arc.overlapsRect(scout.x, scout.y, SCOUT_SIZE, SCOUT_SIZE)) {
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
      if (this.boss && !this.levelComplete) {
        const bossWorldY = scrollOffset + this.boss.y;
        if (!arc.hitTargets.has(this.boss) && arc.overlapsRect(this.boss.x, bossWorldY, BOSS_WIDTH, BOSS_HEIGHT)) {
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

    // Turtle spread projectile collision
    const spreadRect = { x: 0, y: 0, width: TURTLE_SPREAD_PROJECTILE_SIZE, height: TURTLE_SPREAD_PROJECTILE_SIZE };
    for (let spi = this.spreadProjectiles.length - 1; spi >= 0; spi--) {
      const sp = this.spreadProjectiles[spi];
      spreadRect.x = sp.x - TURTLE_SPREAD_PROJECTILE_SIZE / 2;
      spreadRect.y = sp.y - TURTLE_SPREAD_PROJECTILE_SIZE / 2;
      let hit = false;
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        const scoutRect = { x: scout.x, y: scout.y, width: SCOUT_SIZE, height: SCOUT_SIZE };
        if (aabbOverlap(spreadRect, scoutRect)) {
          const dead = scout.takeDamage(sp.damage);
          this.turtleSpreadPool.return(sp);
          this.spreadProjectiles.splice(spi, 1);
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
        const bossWorldY = scrollOffset + this.boss.y;
        const bossRect = { x: this.boss.x, y: bossWorldY, width: BOSS_WIDTH, height: BOSS_HEIGHT };
        if (aabbOverlap(spreadRect, bossRect)) {
          const dead = this.boss.takeDamage(sp.damage);
          this.turtleSpreadPool.return(sp);
          this.spreadProjectiles.splice(spi, 1);
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
    }

    // Dragon charged ball collision
    for (let cbi = this.chargedBallProjectiles.length - 1; cbi >= 0; cbi--) {
      const cb = this.chargedBallProjectiles[cbi];
      const cbSize = cb.size;
      const chargedBallRect = {
        x: cb.x - cbSize / 2,
        y: cb.y - cbSize / 2,
        width: cbSize,
        height: cbSize,
      };
      let hit = false;
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        const scoutRect = { x: scout.x, y: scout.y, width: SCOUT_SIZE, height: SCOUT_SIZE };
        if (aabbOverlap(chargedBallRect, scoutRect)) {
          const dead = scout.takeDamage(cb.damage);
          this.chargedBallPool.return(cb);
          this.chargedBallProjectiles.splice(cbi, 1);
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
        const bossWorldY = scrollOffset + this.boss.y;
        const bossRect = { x: this.boss.x, y: bossWorldY, width: BOSS_WIDTH, height: BOSS_HEIGHT };
        if (aabbOverlap(chargedBallRect, bossRect)) {
          const dead = this.boss.takeDamage(cb.damage);
          this.chargedBallPool.return(cb);
          this.chargedBallProjectiles.splice(cbi, 1);
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
    }

    // Dragon homing crescent collision
    const homingRect = {
      x: 0,
      y: 0,
      width: HOMING_CRESCENT_SIZE,
      height: HOMING_CRESCENT_SIZE,
    };
    for (let hci = this.homingCrescentProjectiles.length - 1; hci >= 0; hci--) {
      const hc = this.homingCrescentProjectiles[hci];
      homingRect.x = hc.x - HOMING_CRESCENT_SIZE / 2;
      homingRect.y = hc.y - HOMING_CRESCENT_SIZE / 2;
      let hit = false;
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        const scoutRect = { x: scout.x, y: scout.y, width: SCOUT_SIZE, height: SCOUT_SIZE };
        if (aabbOverlap(homingRect, scoutRect)) {
          const dead = scout.takeDamage(hc.damage);
          this.homingCrescentPool.return(hc);
          this.homingCrescentProjectiles.splice(hci, 1);
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
        const bossWorldY = scrollOffset + this.boss.y;
        const bossRect = { x: this.boss.x, y: bossWorldY, width: BOSS_WIDTH, height: BOSS_HEIGHT };
        if (aabbOverlap(homingRect, bossRect)) {
          const dead = this.boss.takeDamage(hc.damage);
          this.homingCrescentPool.return(hc);
          this.homingCrescentProjectiles.splice(hci, 1);
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
    if (this.ship instanceof DragonShip && this.dragonChargeStartTime >= 0) {
      const chargeDuration = this.gameTime - this.dragonChargeStartTime;
      const chargeBeyondMin = Math.max(0, chargeDuration - DRAGON_SECONDARY_MIN_CHARGE_S);
      const radius =
        DRAGON_SECONDARY_MIN_RADIUS +
        chargeBeyondMin * DRAGON_SECONDARY_RADIUS_GROWTH_PER_SEC;
      const muzzleX = this.ship.x + DRAGON_SHIP_SIZE / 2;
      const muzzleY = this.ship.y + DRAGON_SHIP_SIZE * 0.05;
      drawDragonChargedBall(ctx.ctx, muzzleX, muzzleY, radius, this.gameTime);
    }
    if (this.wolfBeamActive) {
      const muzzle = getWolfSecondaryMuzzle({
        shipX: this.ship.x,
        shipY: this.ship.y,
        shipSize: WOLF_SHIP_SIZE,
      });
      const beamLength = this.wolfBeamDuration * WOLF_BEAM_GROWTH_RATE;
      drawWolfSustainedBeam(ctx.ctx, muzzle.x, muzzle.y, this.gameTime, beamLength);
    }
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
    for (const p of this.playerProjectiles) {
      p.draw(
        ctx.ctx,
        p.x,
        this.levelScroll.worldToScreenY(p.y),
        this.gameTime
      );
    }
    for (const hc of this.homingCrescentProjectiles) {
      hc.draw(ctx.ctx, hc.x, this.levelScroll.worldToScreenY(hc.y), this.gameTime);
    }
    for (const cb of this.chargedBallProjectiles) {
      cb.draw(ctx.ctx, cb.x, this.levelScroll.worldToScreenY(cb.y), this.gameTime);
    }
    for (const arc of this.arcShots) {
      arc.draw(ctx.ctx, arc.x, this.levelScroll.worldToScreenY(arc.y), this.gameTime);
    }
    for (const sp of this.spreadProjectiles) {
      sp.draw(ctx.ctx, sp.x, this.levelScroll.worldToScreenY(sp.y), this.gameTime);
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
