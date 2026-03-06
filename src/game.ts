import { InputService } from './input/input-service';
import { BootScene } from './scenes/boot-scene';
import { GameplayScene } from './scenes/gameplay-scene';

export type SceneId = 'boot' | 'gameplay';

export interface GameContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: InputService;
  width: number;
  height: number;
  deltaTime: number;
  goToScene: (id: SceneId) => void;
}

export interface Scene {
  enter(ctx: GameContext): void;
  update(ctx: GameContext): void;
  draw(ctx: GameContext): void;
  exit(): void;
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private input: InputService;
  private scenes: Map<SceneId, Scene>;
  private currentScene: SceneId = 'boot';
  private lastTime = 0;
  private running = false;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.input = new InputService();
    this.scenes = new Map<SceneId, Scene>([
      ['boot', new BootScene()],
      ['gameplay', new GameplayScene()],
    ]);
  }

  start(): void {
    this.input.init(this.canvas);
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

    if (this.input.isSpeedBoostPressed()) {
      deltaTime *= 5;
    }

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
      goToScene: (id) => this.goToScene(id),
    };
  }

  goToScene(id: SceneId): void {
    const oldScene = this.scenes.get(this.currentScene);
    if (oldScene) oldScene.exit();
    this.currentScene = id;
    const newScene = this.scenes.get(id);
    if (newScene) {
      newScene.enter(this.getContext(0));
    }
  }
}
