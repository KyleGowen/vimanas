import { Game } from './game';
import { pickLargest16x9InViewport } from './utils/resolution';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
if (!canvas) throw new Error('Canvas not found');

const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('2D context not available');

function applyResolution(): void {
  const [w, h] = pickLargest16x9InViewport();
  canvas.width = w;
  canvas.height = h;
}

applyResolution();
window.addEventListener('resize', applyResolution);

const game = new Game(canvas, ctx);
game.start();
