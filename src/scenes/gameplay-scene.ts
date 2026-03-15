import type { GameContext, Scene } from '../game';
import { clear, drawText } from '../render/renderer';
import { CombatHUD } from '../ui/combat-hud';
import {
  LevelScrollController,
  PLAYER_BOTTOM_OFFSET_PX,
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
  type DefaultShip,
} from '../config/gameplay-config';
import {
  createShip,
  getShipSize,
  getShipMaxHp,
  getShipMana,
  isValidShipId,
  type ShipId,
} from '../config/ship-registry';
import {
  applyPilotModifiers,
  DEFAULT_PILOT,
  isValidPilotId,
  type PilotId,
} from '../config/pilot-registry';
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
import { SparrowShip } from '../ships/sparrow-ship';
import { WolfShip, WOLF_SHIP_SIZE } from '../ships/wolf-ship';
import {
  DragonShip,
  DRAGON_SHIP_SIZE,
  DRAGON_MEDITATING_REGEN_MULTIPLIER,
} from '../ships/dragon-ship';
import { TurtleShip } from '../ships/turtle-ship';
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
import { fireBasicGun, BASIC_GUN_FIRE_RATE_S } from '../weapons/basic-gun';
import {
  fireSparrowSecondary,
  SPARROW_SECONDARY_MANA_COST,
  SPARROW_SECONDARY_FIRE_RATE_S,
} from '../weapons/sparrow-secondary';
import { type ArcShot } from '../arc-shot/arc-shot';
import {
  type TurtleSpreadProjectile,
  TURTLE_SPREAD_PROJECTILE_SIZE,
} from '../projectiles/turtle-spread-projectile';
import { type EnergyRingProjectile } from '../projectiles/energy-ring-projectile';
import { ProjectilePool } from '../pools/projectile-pool';
import { EnergyRingPool } from '../pools/energy-ring-pool';
import { ArcShotPool } from '../pools/arc-shot-pool';
import { TurtleSpreadPool } from '../pools/turtle-spread-pool';
import { HomingCrescentPool } from '../pools/homing-crescent-pool';
import { ChargedBallPool } from '../pools/charged-ball-pool';
import { EnemyProjectilePool } from '../pools/enemy-projectile-pool';
import { EnemyPool } from '../pools/enemy-pool';
import { ElitePool } from '../pools/elite-pool';
import { ScoutEnemy, SCOUT_SIZE } from '../enemies/scout-enemy';
import { EliteEnemy, ELITE_SIZE } from '../enemies/elite-enemy';
import type { Boss } from '../enemies/boss-factory';
import { MiniBoss } from '../enemies/mini-boss';
import { aabbOverlap } from '../util/collision';
import { WaveSpawner } from '../waves/wave-spawner';
import { isEnemyInWolfFrontArc } from '../effects/wolf-shield-effect';
import { updateBossPhase } from './gameplay/boss-controller';
import { updateMiniBossPhase } from './gameplay/miniboss-controller';
import {
  getLevelIdFromState,
  loadLevelSpec,
  loadLevelSpecSync,
} from '../levels/level-loader';
import type { LevelSpec } from '../levels/level-spec';
import { DEFAULT_LEVEL_ID } from '../levels/level-spec';
import {
  shouldTriggerBossFromTiming,
  shouldTriggerMiniBossFromTiming,
  shouldTriggerBossFromWaves,
  shouldTriggerMiniBossFromWaves,
} from './gameplay/level-timing';

/** Wolf shield contact damage: 1 dps to enemies in front arc */
const WOLF_SHIELD_CONTACT_DAMAGE_PER_SECOND = 1;

/** Padding from screen edges for play area bounds */
const PLAY_AREA_PADDING = 50;

/** Mini-boss cannot take damage for this long after spawn (avoids instant kill from existing projectiles). */
const MINI_BOSS_INVULN_S = 1;

export class GameplayScene implements Scene {
  private readonly levelScroll = new LevelScrollController();
  private readonly parallaxController = new ParallaxController();
  private ship: DefaultShip;
  private shipId: ShipId;
  private pilotId: PilotId;
  private readonly projectilePool: ProjectilePool;
  private readonly energyRingPool: EnergyRingPool;
  private readonly homingCrescentPool: HomingCrescentPool;
  private readonly chargedBallPool: ChargedBallPool;
  private readonly arcShotPool: ArcShotPool;
  private readonly turtleSpreadPool: TurtleSpreadPool;
  private readonly enemyProjectilePool: EnemyProjectilePool;
  private readonly enemyPool: EnemyPool;
  private readonly elitePool: ElitePool;
  private readonly waveSpawner: WaveSpawner;
  private playerProjectiles: PlayerProjectile[] = [];
  private homingCrescentProjectiles: HomingCrescentProjectile[] = [];
  private chargedBallProjectiles: ChargedBallProjectile[] = [];
  private arcShots: ArcShot[] = [];
  private energyRings: EnergyRingProjectile[] = [];
  private spreadProjectiles: TurtleSpreadProjectile[] = [];
  private enemyProjectiles: EnemyProjectile[] = [];
  private scouts: ScoutEnemy[] = [];
  private elites: EliteEnemy[] = [];
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
  private boss: Boss | null = null;
  private bossTransitionTime = 0;
  /** Mini-boss phase active (8.5: mini-boss spawning). Set when preMiniBossSeconds reached. */
  private miniBossPhase = false;
  /** Mini-boss entity (8.5). Null if not spawned or level has no mini-boss. */
  private miniBoss: MiniBoss | null = null;
  /** Whether mini-boss has been defeated (8.5). Gameplay continues after; boss comes later. */
  private miniBossDefeated = false;
  /** Number of waves completed (for wave-based boss/mini-boss triggers). */
  private completedWaves = 0;
  /** Parallax scroll offset; eases to halt when boss enters */
  private parallaxScrollOffset = 0;
  private wasEscapeDown = false;
  private goToScene?: (id: 'boot' | 'gameplay' | 'results', state?: unknown) => void;
  private score = 0;
  private readonly combatHud = new CombatHUD();
  /** Level spec from config (9.1). Used by WaveSpawner when refactored (9.2). */
  private levelSpec: LevelSpec | null = null;
  /** True while async loading a non-embedded level (8.6). */
  private loadingLevel = false;
  /** True if async load failed and we fell back to default level (8.6). */
  private levelLoadError = false;
  /** Run post-spec init (theme, waveSpawner.reset) on next update when async load completes (8.6). */
  private pendingLevelInit = false;

  constructor() {
    this.ship = createDefaultShip();
    this.shipId = DEFAULT_SHIP;
    this.pilotId = DEFAULT_PILOT;
    this.projectilePool = new ProjectilePool(28);
    this.energyRingPool = new EnergyRingPool();
    this.homingCrescentPool = new HomingCrescentPool();
    this.chargedBallPool = new ChargedBallPool();
    this.arcShotPool = new ArcShotPool();
    this.turtleSpreadPool = new TurtleSpreadPool();
    this.enemyProjectilePool = new EnemyProjectilePool();
    this.enemyPool = new EnemyPool();
    this.elitePool = new ElitePool();
    this.waveSpawner = new WaveSpawner(this.enemyPool, {
      onScoutSpawned: () => {},
      onWaveComplete: () => {
        this.completedWaves++;
      },
      onLevelWavesComplete: () => {
        if (!this.bossPhase) {
          this.bossPhase = true;
          this.bossTransitionTime = this.gameTime + 1;
        }
      },
    }, this.elitePool);
  }

  enter(ctx: GameContext): void {
    this.goToScene = ctx.goToScene;
    const raw = ctx.sceneState;
    if (raw && typeof raw === 'object' && 'shipId' in raw && isValidShipId(raw.shipId)) {
      this.ship.dispose();
      this.ship = createShip(raw.shipId);
      this.shipId = raw.shipId;
    }
    if (raw && typeof raw === 'object' && 'pilotId' in raw && isValidPilotId(raw.pilotId)) {
      this.pilotId = raw.pilotId;
    } else {
      this.pilotId = DEFAULT_PILOT;
    }
    const levelId = getLevelIdFromState(raw);
    this.levelLoadError = false;
    this.pendingLevelInit = false;
    this.levelSpec = loadLevelSpecSync(levelId);
    this.loadingLevel = this.levelSpec === null;

    if (this.levelSpec === null) {
      loadLevelSpec(levelId).then((spec) => {
        if (spec) {
          this.levelSpec = spec;
        } else {
          this.levelSpec = loadLevelSpecSync(DEFAULT_LEVEL_ID);
          this.levelLoadError = true;
        }
        this.loadingLevel = false;
        this.pendingLevelInit = true;
      });
    }

    this.levelScroll.reset();
    this.parallaxScrollOffset = 0;
    this.levelScroll.setScreenSize(ctx.width, ctx.height);
    this.parallaxController.setScreenSize(ctx.width, ctx.height);
    this.parallaxController.setTheme(this.levelSpec?.theme ?? 'forest');
    void this.parallaxController.load();
    const shipSize = getShipSize(this.shipId);
    this.ship.x = ctx.width / 2 - shipSize / 2;
    this.ship.y = ctx.height - PLAYER_BOTTOM_OFFSET_PX;
    this.ship.stats.hp = getShipMaxHp(this.shipId);
    this.ship.currentMana = getShipMana(this.shipId);
    applyPilotModifiers(this.ship.stats, this.pilotId);
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
    for (const r of this.energyRings) {
      this.energyRingPool.return(r);
    }
    this.energyRings = [];
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
    for (const elite of this.elites) {
      this.elitePool.return(elite);
    }
    this.elites = [];
    void this.enemyPool.prewarm();
    void this.elitePool.prewarm();
    this.waveSpawner.setScreenSize(ctx.width, ctx.height);
    this.waveSpawner.setSpawnWorldY(this.levelScroll.getSpawnWorldYAboveViewport());
    this.waveSpawner.reset(0, this.levelSpec);
    this.lastFireTime = 0;
    this.lastSecondaryFireTime = 0;
    this.gameTime = 0;
    this.wolfBeamActive = false;
    this.wolfBeamDuration = 0;
    this.paused = false;
    this.gameOver = false;
    this.levelComplete = false;
    this.bossPhase = false;
    this.miniBossPhase = false;
    this.completedWaves = 0;
    this.boss = null;
    this.miniBoss = null;
    this.miniBossDefeated = false;
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

    if (this.loadingLevel) return;

    if (this.pendingLevelInit && this.levelSpec) {
      this.parallaxController.setTheme(this.levelSpec.theme ?? 'forest');
      this.waveSpawner.setSpawnWorldY(this.levelScroll.getSpawnWorldYAboveViewport());
      this.waveSpawner.reset(0, this.levelSpec);
      this.pendingLevelInit = false;
    }

    if (this.gameOver) {
      if (this.goToScene) {
        this.goToScene('results', {
          victory: false,
          score: this.score,
          lives: 0,
          shipId: this.shipId,
          pilotId: this.pilotId,
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
          shipId: this.shipId,
          pilotId: this.pilotId,
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
      updateBossPhase(ctx.deltaTime, {
        bossPhase: this.bossPhase,
        boss: this.boss,
        bossTransitionTime: this.bossTransitionTime,
        gameTime: this.gameTime,
        parallaxScrollOffset: this.parallaxScrollOffset,
        screenWidth: ctx.width,
        bossConfig: this.levelSpec?.boss,
        setParallaxScrollOffset: (v) => { this.parallaxScrollOffset = v; },
        setBoss: (b) => { this.boss = b; },
      });
    }

    // Run wave spawner before trigger checks so completedWaves is up to date when we decide to spawn mini-boss/boss
    this.waveSpawner.setSpawnWorldY(this.levelScroll.getSpawnWorldYAboveViewport());
    if (!(this.miniBoss && !this.miniBossDefeated)) {
      const spawnResult = this.waveSpawner.update(this.gameTime);
      for (const scout of spawnResult.scouts) {
        this.scouts.push(scout);
      }
      for (const elite of spawnResult.elites) {
        this.elites.push(elite);
      }
    }

    // 8.4: Level timing — time-based OR wave-based triggers for mini-boss and boss (after wave update so completedWaves is current)
    const timing = this.levelSpec?.timing;
    if (
      shouldTriggerMiniBossFromTiming(timing, this.gameTime, this.miniBossPhase) ||
      shouldTriggerMiniBossFromWaves(timing, this.completedWaves, this.miniBossPhase)
    ) {
      this.miniBossPhase = true;
    }
    if (
      shouldTriggerBossFromTiming(timing, this.gameTime, this.bossPhase) ||
      shouldTriggerBossFromWaves(timing, this.completedWaves, this.bossPhase)
    ) {
      this.bossPhase = true;
      this.bossTransitionTime = this.gameTime + 1;
    }

    // 8.5: Mini-boss spawn when miniBossPhase triggers
    if (this.miniBossPhase && !this.miniBossDefeated) {
      updateMiniBossPhase({
        miniBossPhase: this.miniBossPhase,
        miniBoss: this.miniBoss,
        miniBossDefeated: this.miniBossDefeated,
        screenWidth: ctx.width,
        screenHeight: ctx.height,
        gameTime: this.gameTime,
        minibossConfig: this.levelSpec?.miniboss ?? null,
        setMiniBoss: (m) => { this.miniBoss = m; },
      });
    }
    if (this.miniBoss) {
      this.miniBoss.update(ctx.deltaTime, ctx.width, ctx.height);
    }

    const scrollOffset = this.levelScroll.getScrollOffset();
    const shipSize = getShipSize(this.shipId);
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
      if (this.ship instanceof WolfShip) {
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
      } else if (this.ship instanceof SparrowShip) {
        if (this.gameTime - this.lastFireTime >= BASIC_GUN_FIRE_RATE_S) {
          this.lastFireTime = this.gameTime;
          const opts = fireBasicGun({
            shipX: this.ship.x,
            shipY: scrollOffset + this.ship.y,
            shipSize,
            attack: this.ship.stats.attack,
            spawnTime: this.gameTime,
          });
          const p = this.projectilePool.get(opts);
          if (p) this.playerProjectiles.push(p);
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
      } else if (this.ship instanceof TurtleShip) {
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
      this.ship instanceof WolfShip &&
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
    } else if (this.ship instanceof TurtleShip) {
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
    } else if (this.ship instanceof SparrowShip) {
      if (
        secondaryFireDown &&
        this.ship.currentMana >= SPARROW_SECONDARY_MANA_COST &&
        this.gameTime - this.lastSecondaryFireTime >= SPARROW_SECONDARY_FIRE_RATE_S
      ) {
        this.lastSecondaryFireTime = this.gameTime;
        this.ship.currentMana -= SPARROW_SECONDARY_MANA_COST;
        const opts = fireSparrowSecondary({
          shipX: this.ship.x,
          shipY: scrollOffset + this.ship.y,
          shipSize,
          attack: this.ship.stats.attack,
          spawnTime: this.gameTime,
        });
        const ring = this.energyRingPool.get(opts);
        if (ring) this.energyRings.push(ring);
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

    // Energy ring update (Sparrow secondary)
    const energyRingBounds = {
      width: ctx.width,
      height: ctx.height,
      scrollOffset: this.levelScroll.getScrollOffset(),
      gameTime: this.gameTime,
    };
    for (let ri = this.energyRings.length - 1; ri >= 0; ri--) {
      const ring = this.energyRings[ri];
      const alive = ring.update(ctx.deltaTime, energyRingBounds);
      if (!alive) {
        this.energyRingPool.return(ring);
        this.energyRings.splice(ri, 1);
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
      for (let ei = this.elites.length - 1; ei >= 0; ei--) {
        const elite = this.elites[ei];
        const eliteRect = { x: elite.x, y: elite.y, width: ELITE_SIZE, height: ELITE_SIZE };
        if (aabbOverlap(beamRect, eliteRect)) {
          const dead = elite.takeDamage(beamDamage);
          if (dead) {
            this.waveSpawner.notifyEliteDied();
            this.score += 200;
            this.elitePool.return(elite);
            this.elites[ei] = this.elites[this.elites.length - 1];
            this.elites.pop();
          }
        }
      }
      if (this.boss && !this.levelComplete) {
        const bossWorldY = scrollOffset + this.boss.y;
        const bossRect = { x: this.boss.x, y: bossWorldY, width: this.boss.getWidth(), height: this.boss.getHeight() };
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
      // 8.5: Mini-boss beam collision
      if (this.miniBoss && !this.miniBossDefeated) {
        const miniBossWorldY = scrollOffset + this.miniBoss.y;
        const miniBossRect = { x: this.miniBoss.x, y: miniBossWorldY, width: this.miniBoss.getWidth(), height: this.miniBoss.getHeight() };
        if (aabbOverlap(beamRect, miniBossRect) && this.gameTime - this.miniBoss.getSpawnTime() >= MINI_BOSS_INVULN_S) {
          const dead = this.miniBoss.takeDamage(beamDamage);
          if (dead) {
            this.score += 500;
            this.miniBossDefeated = true;
            this.miniBoss.dispose();
            this.miniBoss = null;
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
      for (let ei = this.elites.length - 1; ei >= 0; ei--) {
        const elite = this.elites[ei];
        const eliteCx = elite.x + ELITE_SIZE / 2;
        const eliteCy = elite.y + ELITE_SIZE / 2;
        if (
          isEnemyInWolfFrontArc(
            this.ship.x,
            this.ship.y,
            WOLF_SHIP_SIZE,
            shipWorldY,
            eliteCx,
            eliteCy
          )
        ) {
          const dead = elite.takeDamage(contactDamage);
          if (dead) {
            this.waveSpawner.notifyEliteDied();
            this.score += 200;
            this.elitePool.return(elite);
            this.elites[ei] = this.elites[this.elites.length - 1];
            this.elites.pop();
          }
        }
      }
      if (this.boss && !this.levelComplete) {
        const bossWorldY = scrollOffset + this.boss.y;
        const bossCx = this.boss.x + this.boss.getWidth() / 2;
        const bossCy = bossWorldY + this.boss.getHeight() / 2;
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
      // 8.5: Mini-boss Wolf shield contact damage
      if (this.miniBoss && !this.miniBossDefeated) {
        const miniBossWorldY = scrollOffset + this.miniBoss.y;
        const miniBossCx = this.miniBoss.x + this.miniBoss.getWidth() / 2;
        const miniBossCy = miniBossWorldY + this.miniBoss.getHeight() / 2;
        if (
          isEnemyInWolfFrontArc(
            this.ship.x,
            this.ship.y,
            WOLF_SHIP_SIZE,
            shipWorldY,
            miniBossCx,
            miniBossCy
          ) &&
          this.gameTime - this.miniBoss.getSpawnTime() >= MINI_BOSS_INVULN_S
        ) {
          const dead = this.miniBoss.takeDamage(contactDamage);
          if (dead) {
            this.score += 500;
            this.miniBossDefeated = true;
            this.miniBoss.dispose();
            this.miniBoss = null;
          }
        }
      }
    }

    const movementContext = { centerX: ctx.width / 2 };
    for (const scout of this.scouts) {
      scout.update(ctx.deltaTime, this.gameTime, movementContext);
    }
    for (const elite of this.elites) {
      elite.update(ctx.deltaTime, this.gameTime, movementContext);
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
    for (let ei = this.elites.length - 1; ei >= 0; ei--) {
      const elite = this.elites[ei];
      if (this.levelScroll.isBelowViewport(elite.y, ELITE_SIZE)) {
        this.waveSpawner.notifyEliteDied();
        this.elitePool.return(elite);
        this.elites[ei] = this.elites[this.elites.length - 1];
        this.elites.pop();
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
    for (const elite of this.elites) {
      const onScreen = elite.y >= viewportMinY && elite.y <= viewportMaxY;
      if (!onScreen) continue;
      const opts = elite.tryFire(this.gameTime);
      if (opts) {
        const ep = this.enemyProjectilePool.get(opts);
        if (ep) this.enemyProjectiles.push(ep);
      }
    }

    if (this.boss && !this.levelComplete) {
      const primary = this.boss.tryFire(this.gameTime, scrollOffset);
      const primaryArr = primary == null ? [] : Array.isArray(primary) ? primary : [primary];
      for (const opts of primaryArr) {
        const ep = this.enemyProjectilePool.get(opts);
        if (ep) this.enemyProjectiles.push(ep);
      }
      const secondary =
        'trySecondaryFire' in this.boss && typeof this.boss.trySecondaryFire === 'function'
          ? this.boss.trySecondaryFire(this.gameTime, scrollOffset)
          : null;
      if (secondary) {
        for (const opts of secondary) {
          const ep = this.enemyProjectilePool.get(opts);
          if (ep) this.enemyProjectiles.push(ep);
        }
      }
    }

    // 8.5: Mini-boss firing (no shots during invulnerability window)
    if (
      this.miniBoss &&
      !this.miniBossDefeated &&
      this.gameTime - this.miniBoss.getSpawnTime() >= MINI_BOSS_INVULN_S
    ) {
      const opts = this.miniBoss.tryFire(this.gameTime, scrollOffset);
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
        if (this.boss && ep.sourceId === 'root_seeker_primary' && 'addHp' in this.boss) {
          (this.boss as { addHp: (n: number) => void }).addHp(5);
        }
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
      if (!hit) {
        for (let ei = this.elites.length - 1; ei >= 0; ei--) {
          const elite = this.elites[ei];
          const eliteRect = { x: elite.x, y: elite.y, width: ELITE_SIZE, height: ELITE_SIZE };
          if (aabbOverlap(playerProjectileRect, eliteRect)) {
            const dead = elite.takeDamage(p.damage);
            this.projectilePool.return(p);
            this.playerProjectiles.splice(pi, 1);
            if (dead) {
              this.waveSpawner.notifyEliteDied();
              this.score += 200;
              this.elitePool.return(elite);
              this.elites[ei] = this.elites[this.elites.length - 1];
              this.elites.pop();
            }
            hit = true;
            break;
          }
        }
      }
      if (!hit && this.boss) {
        const bossWorldY = scrollOffset + this.boss.y;
        playerProjectileRect.x = p.x - PROJECTILE_SIZE / 2;
        playerProjectileRect.y = p.y - PROJECTILE_SIZE / 2;
        const bossRect = {
          x: this.boss.x,
          y: bossWorldY,
          width: this.boss.getWidth(),
          height: this.boss.getHeight(),
        };
        if (aabbOverlap(playerProjectileRect, bossRect)) {
          const dead = this.boss.takeDamage(p.damage);
          this.projectilePool.return(p);
          this.playerProjectiles.splice(pi, 1);
          hit = true;
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
      // 8.5: Mini-boss collision
      if (!hit && this.miniBoss && !this.miniBossDefeated) {
        const miniBossWorldY = scrollOffset + this.miniBoss.y;
        playerProjectileRect.x = p.x - PROJECTILE_SIZE / 2;
        playerProjectileRect.y = p.y - PROJECTILE_SIZE / 2;
        const miniBossRect = {
          x: this.miniBoss.x,
          y: miniBossWorldY,
          width: this.miniBoss.getWidth(),
          height: this.miniBoss.getHeight(),
        };
        if (aabbOverlap(playerProjectileRect, miniBossRect) && this.gameTime - this.miniBoss.getSpawnTime() >= MINI_BOSS_INVULN_S) {
          const dead = this.miniBoss.takeDamage(p.damage);
          this.projectilePool.return(p);
          this.playerProjectiles.splice(pi, 1);
          if (dead) {
            this.score += 500;
            this.miniBossDefeated = true;
            this.miniBoss.dispose();
            this.miniBoss = null;
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
      for (let ei = this.elites.length - 1; ei >= 0; ei--) {
        const elite = this.elites[ei];
        if (!arc.hitTargets.has(elite) && arc.overlapsRect(elite.x, elite.y, ELITE_SIZE, ELITE_SIZE)) {
          arc.hitTargets.add(elite);
          const dead = elite.takeDamage(arc.damage);
          if (dead) {
            this.waveSpawner.notifyEliteDied();
            this.score += 200;
            this.elitePool.return(elite);
            this.elites[ei] = this.elites[this.elites.length - 1];
            this.elites.pop();
          }
        }
      }
      if (this.boss && !this.levelComplete) {
        const bossWorldY = scrollOffset + this.boss.y;
        if (!arc.hitTargets.has(this.boss) && arc.overlapsRect(this.boss.x, bossWorldY, this.boss.getWidth(), this.boss.getHeight())) {
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
      // 8.5: Mini-boss arc shot collision
      if (this.miniBoss && !this.miniBossDefeated) {
        const miniBossWorldY = scrollOffset + this.miniBoss.y;
        if (!arc.hitTargets.has(this.miniBoss) && arc.overlapsRect(this.miniBoss.x, miniBossWorldY, this.miniBoss.getWidth(), this.miniBoss.getHeight()) && this.gameTime - this.miniBoss.getSpawnTime() >= MINI_BOSS_INVULN_S) {
          arc.hitTargets.add(this.miniBoss);
          const dead = this.miniBoss.takeDamage(arc.damage);
          if (dead) {
            this.score += 500;
            this.miniBossDefeated = true;
            this.miniBoss.dispose();
            this.miniBoss = null;
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
      if (!hit) {
        for (let ei = this.elites.length - 1; ei >= 0; ei--) {
          const elite = this.elites[ei];
          const eliteRect = { x: elite.x, y: elite.y, width: ELITE_SIZE, height: ELITE_SIZE };
          if (aabbOverlap(spreadRect, eliteRect)) {
            const dead = elite.takeDamage(sp.damage);
            this.turtleSpreadPool.return(sp);
            this.spreadProjectiles.splice(spi, 1);
            if (dead) {
              this.waveSpawner.notifyEliteDied();
              this.score += 200;
              this.elitePool.return(elite);
              this.elites[ei] = this.elites[this.elites.length - 1];
              this.elites.pop();
            }
            hit = true;
            break;
          }
        }
      }
      if (!hit && this.boss) {
        const bossWorldY = scrollOffset + this.boss.y;
        const bossRect = { x: this.boss.x, y: bossWorldY, width: this.boss.getWidth(), height: this.boss.getHeight() };
        if (aabbOverlap(spreadRect, bossRect)) {
          const dead = this.boss.takeDamage(sp.damage);
          this.turtleSpreadPool.return(sp);
          this.spreadProjectiles.splice(spi, 1);
          hit = true;
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
      // 8.5: Mini-boss spread collision
      if (!hit && this.miniBoss && !this.miniBossDefeated) {
        const miniBossWorldY = scrollOffset + this.miniBoss.y;
        const miniBossRect = { x: this.miniBoss.x, y: miniBossWorldY, width: this.miniBoss.getWidth(), height: this.miniBoss.getHeight() };
        if (aabbOverlap(spreadRect, miniBossRect) && this.gameTime - this.miniBoss.getSpawnTime() >= MINI_BOSS_INVULN_S) {
          const dead = this.miniBoss.takeDamage(sp.damage);
          this.turtleSpreadPool.return(sp);
          this.spreadProjectiles.splice(spi, 1);
          if (dead) {
            this.score += 500;
            this.miniBossDefeated = true;
            this.miniBoss.dispose();
            this.miniBoss = null;
          }
        }
      }
    }

    // Energy ring collision (Sparrow secondary)
    for (let ri = this.energyRings.length - 1; ri >= 0; ri--) {
      const ring = this.energyRings[ri];
      const radius = ring.getRadius(this.gameTime);
      const ringRect = {
        x: ring.x - radius,
        y: ring.y - radius,
        width: radius * 2,
        height: radius * 2,
      };
      let hit = false;
      for (let si = this.scouts.length - 1; si >= 0; si--) {
        const scout = this.scouts[si];
        const scoutRect = { x: scout.x, y: scout.y, width: SCOUT_SIZE, height: SCOUT_SIZE };
        if (aabbOverlap(ringRect, scoutRect)) {
          const dead = scout.takeDamage(ring.damage);
          this.energyRingPool.return(ring);
          this.energyRings.splice(ri, 1);
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
      if (!hit) {
        for (let ei = this.elites.length - 1; ei >= 0; ei--) {
          const elite = this.elites[ei];
          const eliteRect = { x: elite.x, y: elite.y, width: ELITE_SIZE, height: ELITE_SIZE };
          if (aabbOverlap(ringRect, eliteRect)) {
            const dead = elite.takeDamage(ring.damage);
            this.energyRingPool.return(ring);
            this.energyRings.splice(ri, 1);
            if (dead) {
              this.waveSpawner.notifyEliteDied();
              this.score += 200;
              this.elitePool.return(elite);
              this.elites[ei] = this.elites[this.elites.length - 1];
              this.elites.pop();
            }
            hit = true;
            break;
          }
        }
      }
      if (!hit && this.boss) {
        const bossWorldY = scrollOffset + this.boss.y;
        const bossRect = { x: this.boss.x, y: bossWorldY, width: this.boss.getWidth(), height: this.boss.getHeight() };
        if (aabbOverlap(ringRect, bossRect)) {
          const dead = this.boss.takeDamage(ring.damage);
          this.energyRingPool.return(ring);
          this.energyRings.splice(ri, 1);
          hit = true;
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
      // 8.5: Mini-boss energy ring collision
      if (!hit && this.miniBoss && !this.miniBossDefeated) {
        const miniBossWorldY = scrollOffset + this.miniBoss.y;
        const miniBossRect = { x: this.miniBoss.x, y: miniBossWorldY, width: this.miniBoss.getWidth(), height: this.miniBoss.getHeight() };
        if (aabbOverlap(ringRect, miniBossRect) && this.gameTime - this.miniBoss.getSpawnTime() >= MINI_BOSS_INVULN_S) {
          const dead = this.miniBoss.takeDamage(ring.damage);
          this.energyRingPool.return(ring);
          this.energyRings.splice(ri, 1);
          if (dead) {
            this.score += 500;
            this.miniBossDefeated = true;
            this.miniBoss.dispose();
            this.miniBoss = null;
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
      if (!hit) {
        for (let ei = this.elites.length - 1; ei >= 0; ei--) {
          const elite = this.elites[ei];
          const eliteRect = { x: elite.x, y: elite.y, width: ELITE_SIZE, height: ELITE_SIZE };
          if (aabbOverlap(chargedBallRect, eliteRect)) {
            const dead = elite.takeDamage(cb.damage);
            this.chargedBallPool.return(cb);
            this.chargedBallProjectiles.splice(cbi, 1);
            if (dead) {
              this.waveSpawner.notifyEliteDied();
              this.score += 200;
              this.elitePool.return(elite);
              this.elites[ei] = this.elites[this.elites.length - 1];
              this.elites.pop();
            }
            hit = true;
            break;
          }
        }
      }
      if (!hit && this.boss) {
        const bossWorldY = scrollOffset + this.boss.y;
        const bossRect = { x: this.boss.x, y: bossWorldY, width: this.boss.getWidth(), height: this.boss.getHeight() };
        if (aabbOverlap(chargedBallRect, bossRect)) {
          const dead = this.boss.takeDamage(cb.damage);
          this.chargedBallPool.return(cb);
          this.chargedBallProjectiles.splice(cbi, 1);
          hit = true;
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
      // 8.5: Mini-boss charged ball collision
      if (!hit && this.miniBoss && !this.miniBossDefeated) {
        const miniBossWorldY = scrollOffset + this.miniBoss.y;
        const miniBossRect = { x: this.miniBoss.x, y: miniBossWorldY, width: this.miniBoss.getWidth(), height: this.miniBoss.getHeight() };
        if (aabbOverlap(chargedBallRect, miniBossRect) && this.gameTime - this.miniBoss.getSpawnTime() >= MINI_BOSS_INVULN_S) {
          const dead = this.miniBoss.takeDamage(cb.damage);
          this.chargedBallPool.return(cb);
          this.chargedBallProjectiles.splice(cbi, 1);
          if (dead) {
            this.score += 500;
            this.miniBossDefeated = true;
            this.miniBoss.dispose();
            this.miniBoss = null;
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
      if (!hit) {
        for (let ei = this.elites.length - 1; ei >= 0; ei--) {
          const elite = this.elites[ei];
          const eliteRect = { x: elite.x, y: elite.y, width: ELITE_SIZE, height: ELITE_SIZE };
          if (aabbOverlap(homingRect, eliteRect)) {
            const dead = elite.takeDamage(hc.damage);
            this.homingCrescentPool.return(hc);
            this.homingCrescentProjectiles.splice(hci, 1);
            if (dead) {
              this.waveSpawner.notifyEliteDied();
              this.score += 200;
              this.elitePool.return(elite);
              this.elites[ei] = this.elites[this.elites.length - 1];
              this.elites.pop();
            }
            hit = true;
            break;
          }
        }
      }
      if (!hit && this.boss) {
        const bossWorldY = scrollOffset + this.boss.y;
        const bossRect = { x: this.boss.x, y: bossWorldY, width: this.boss.getWidth(), height: this.boss.getHeight() };
        if (aabbOverlap(homingRect, bossRect)) {
          const dead = this.boss.takeDamage(hc.damage);
          this.homingCrescentPool.return(hc);
          this.homingCrescentProjectiles.splice(hci, 1);
          hit = true;
          if (dead) {
            this.score += 1000;
            this.levelComplete = true;
            this.boss.dispose();
            this.boss = null;
          }
        }
      }
      // 8.5: Mini-boss homing crescent collision
      if (!hit && this.miniBoss && !this.miniBossDefeated) {
        const miniBossWorldY = scrollOffset + this.miniBoss.y;
        const miniBossRect = { x: this.miniBoss.x, y: miniBossWorldY, width: this.miniBoss.getWidth(), height: this.miniBoss.getHeight() };
        if (aabbOverlap(homingRect, miniBossRect) && this.gameTime - this.miniBoss.getSpawnTime() >= MINI_BOSS_INVULN_S) {
          const dead = this.miniBoss.takeDamage(hc.damage);
          this.homingCrescentPool.return(hc);
          this.homingCrescentProjectiles.splice(hci, 1);
          if (dead) {
            this.score += 500;
            this.miniBossDefeated = true;
            this.miniBoss.dispose();
            this.miniBoss = null;
          }
        }
      }
    }
  }

  draw(ctx: GameContext): void {
    clear(ctx.ctx, ctx.width, ctx.height, '#0a1520');

    if (this.loadingLevel) {
      drawText(ctx.ctx, 'Loading level...', ctx.width / 2, ctx.height / 2, {
        font: '24px sans-serif',
        color: '#ffffff',
        align: 'center',
        baseline: 'middle',
      });
      return;
    }

    this.parallaxController.draw(
      ctx.ctx,
      this.parallaxScrollOffset,
      ctx.width,
      ctx.height
    );
    if (this.levelLoadError) {
      drawText(ctx.ctx, 'Level failed to load; playing default.', ctx.width / 2, 28, {
        font: '14px sans-serif',
        color: '#ffaa00',
        align: 'center',
        baseline: 'middle',
      });
    }
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
    for (const elite of this.elites) {
      elite.draw(
        ctx.ctx,
        elite.x,
        this.levelScroll.worldToScreenY(elite.y)
      );
    }
    if (this.boss) {
      this.boss.draw(ctx.ctx);
    }
    // 8.5: Draw mini-boss
    if (this.miniBoss) {
      this.miniBoss.draw(ctx.ctx);
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
    for (const ring of this.energyRings) {
      ring.draw(ctx.ctx, ring.x, this.levelScroll.worldToScreenY(ring.y), this.gameTime);
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
    // 8.5: Dispose mini-boss
    if (this.miniBoss) {
      this.miniBoss.dispose();
      this.miniBoss = null;
    }
    for (const scout of this.scouts) {
      this.enemyPool.return(scout);
    }
    this.scouts = [];
    for (const elite of this.elites) {
      this.elitePool.return(elite);
    }
    this.elites = [];
  }
}
