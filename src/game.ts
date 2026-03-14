import { InputService } from './input/input-service';
import { SHIELD_KEY_CODES } from './input/input-config';
import {
  applySpeedBoost,
  DEFAULT_SPEED_BOOST_CONFIG,
  type SpeedBoostConfig,
} from './speed-boost';
import { BootScene } from './scenes/boot-scene';
import { GameplayScene } from './scenes/gameplay-scene';
import { ResultsScene } from './scenes/results-scene';
import { ShipSelectScene } from './scenes/ship-select-scene';

export type SceneId = 'boot' | 'gameplay' | 'results' | 'shipSelect';

export interface GameplaySceneState {
  shipId?: string;
  pilotId?: string;
  levelId?: string;
}

export interface ResultsSceneState {
  victory: boolean;
  score: number;
  lives: number;
  shipId?: string;
  pilotId?: string;
}

export interface GameContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: InputService;
  width: number;
  height: number;
  deltaTime: number;
  goToScene: (id: SceneId, state?: unknown) => void;
  /** State passed when transitioning to a scene (e.g. results). Cleared after enter(). */
  sceneState?: unknown;
}

export interface Scene {
  enter(ctx: GameContext): void;
  update(ctx: GameContext): void;
  draw(ctx: GameContext): void;
  exit(): void;
}

/** Parse level ID from URL search string (?level=level_foo). Used for 8.6 Director-generated levels. Exported for tests. */
export function parseLevelIdFromSearch(search: string): string | undefined {
  const params = new URLSearchParams(search);
  const level = params.get('level');
  return level && level.length > 0 ? level : undefined;
}

function getInitialLevelIdFromUrl(): string | undefined {
  return parseLevelIdFromSearch(typeof window !== 'undefined' ? window.location.search : '');
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: InputService;
  private scenes: Map<SceneId, Scene>;
  private currentScene: SceneId = 'boot';
  private lastTime = 0;
  private running = false;
  private speedBoostConfig: SpeedBoostConfig;
  private pendingSceneState: unknown = null;
  private readonly initialLevelId: string | undefined;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    options?: { speedBoost?: SpeedBoostConfig }
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.input = new InputService();
    this.speedBoostConfig = options?.speedBoost ?? DEFAULT_SPEED_BOOST_CONFIG;
    this.scenes = new Map<SceneId, Scene>([
      ['boot', new BootScene()],
      ['shipSelect', new ShipSelectScene()],
      ['gameplay', new GameplayScene()],
      ['results', new ResultsScene()],
    ]);
    this.initialLevelId = getInitialLevelIdFromUrl();
  }

  start(): void {
    this.input.init(this.canvas, [
      this.speedBoostConfig.keyCode,
      ...SHIELD_KEY_CODES,
    ]);
    this.running = true;
    this.lastTime = performance.now();
    const scene = this.scenes.get(this.currentScene);
    if (scene) {
      scene.enter(this.getContext(0));
    }
    this.canvas.focus();
    this.loop(0);
  }

  private loop(timestamp: number): void {
    if (!this.running) return;
    let deltaTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    deltaTime = applySpeedBoost(deltaTime, this.input, this.speedBoostConfig);

    const ctx = this.getContext(deltaTime);
    const scene = this.scenes.get(this.currentScene);
    if (scene) {
      scene.update(ctx);
      scene.draw(ctx);
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  private getContext(deltaTime: number): GameContext {
    return {
      canvas: this.canvas,
      ctx: this.ctx,
      input: this.input,
      width: this.canvas.width,
      height: this.canvas.height,
      deltaTime,
      goToScene: (id, state) => this.goToScene(id, state),
      sceneState: this.pendingSceneState ?? undefined,
    };
  }

  goToScene(id: SceneId, state?: unknown): void {
    let sceneState = state;
    if (id === 'shipSelect' && sceneState === undefined && this.initialLevelId) {
      sceneState = { levelId: this.initialLevelId };
    }
    this.pendingSceneState = sceneState ?? null;
    const oldScene = this.scenes.get(this.currentScene);
    if (oldScene) oldScene.exit();
    this.currentScene = id;
    const newScene = this.scenes.get(id);
    if (newScene) {
      newScene.enter(this.getContext(0));
      this.pendingSceneState = null;
    }
  }
}
