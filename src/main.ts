import { Game } from './game';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
if (!canvas) throw new Error('Canvas not found');

const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('2D context not available');

const game = new Game(canvas, ctx);
game.start();
