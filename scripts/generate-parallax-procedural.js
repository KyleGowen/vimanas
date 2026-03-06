#!/usr/bin/env node
/**
 * Phase 5.1.B — Procedural tileable parallax layers for Level 1 (forest).
 * Generates Far, Mid, Near layers via Canvas-style pixel logic.
 * Fully tileable by design: all patterns repeat every HEIGHT pixels vertically.
 *
 * Per plan: Far = gradient + noise + canopy shapes; Mid = organic blobs + paths + gold;
 * Near = finer foliage + copper accents.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const WIDTH = 1280;
const HEIGHT = 720;
const OUT_DIR = path.resolve(process.cwd(), 'public/images/level1');

// Palettes per plan and level_1_forest_design.md
const FAR_DARK = { r: 0x2d, g: 0x6a, b: 0x2d }; // #2d6a2d
const FAR_LIGHT = { r: 0x1a, g: 0x3a, b: 0x1a }; // #1a3a1a
const MID_OLIVE = { r: 0x6b, g: 0x8e, b: 0x23 }; // #6b8e23
const MID_SAGE = { r: 0x8f, g: 0xbc, b: 0x8f }; // #8fbc8f
const MID_BROWN = { r: 0x4a, g: 0x37, b: 0x28 }; // #4a3728 earth brown
const MID_GOLD = { r: 0xb5, g: 0xa6, b: 0x42 }; // #B5A642 gold
const NEAR_SAGE = { r: 0x8f, g: 0xbc, b: 0x8f }; // #8fbc8f
const NEAR_COPPER = { r: 0xb8, g: 0x73, b: 0x33 }; // #B87333 copper

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Tileable noise: same value at (x,y) and (x, y+HEIGHT) */
function noise(x, y) {
  const yy = ((y % HEIGHT) + HEIGHT) % HEIGHT;
  const xx = ((x % WIDTH) + WIDTH) % WIDTH;
  const a = Math.sin(xx * 0.02 + yy * 0.03) * 0.5;
  const b = Math.sin(xx * 0.05 + yy * 0.07 + 1) * 0.5;
  const c = Math.sin(xx * 0.11 + yy * 0.13 + 2) * 0.5;
  return (a + b + c) / 3 * 0.5 + 0.5;
}

/** Seeded hash for deterministic placement; period HEIGHT in y */
function hash(seed, x, y) {
  const yy = ((y % HEIGHT) + HEIGHT) % HEIGHT;
  const n = Math.sin(seed * 12.9898 + x * 78.233 + yy * 45.164) * 43758.5453;
  return n - Math.floor(n);
}

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function blend(c1, c2, t) {
  return {
    r: Math.round(lerp(c1.r, c2.r, t)),
    g: Math.round(lerp(c1.g, c2.g, t)),
    b: Math.round(lerp(c1.b, c2.b, t)),
  };
}

/** Write RGBA pixel at index */
function setPixel(data, idx, r, g, b, a = 255) {
  data[idx] = r;
  data[idx + 1] = g;
  data[idx + 2] = b;
  data[idx + 3] = a;
}

/** Soft circular falloff; d = distance from center, r = radius */
function softCircle(d, r) {
  if (d >= r) return 0;
  const t = d / r;
  return 1 - t * t * (3 - 2 * t); // smoothstep
}

/** Wrapped vertical distance */
function distY(y1, y2) {
  let d = Math.abs(y1 - y2);
  if (d > HEIGHT / 2) d = HEIGHT - d;
  return d;
}

async function generateFar() {
  const pixels = new Uint8ClampedArray(WIDTH * HEIGHT * 4);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 4;
      const ty = y / HEIGHT;
      const grad = blend(FAR_DARK, FAR_LIGHT, ty);
      const n = noise(x, y);
      const noiseAmt = (n - 0.5) * 0.15;
      let r = Math.round(grad.r + noiseAmt * 40);
      let g = Math.round(grad.g + noiseAmt * 40);
      let b = Math.round(grad.b + noiseAmt * 40);

      // Soft circular canopy shapes (tileable: centers on fixed y grid)
      const cellH = 90;
      const rows = Math.ceil(HEIGHT / cellH);
      for (let row = 0; row < rows; row++) {
        const cy = (row * cellH + cellH / 2 + hash(7, row, 0) * 30) % HEIGHT;
        const cx = (hash(3, row, x) * WIDTH * 0.6 + WIDTH * 0.2);
        const rad = 80 + hash(11, row, x) * 60;
        const d = Math.sqrt((x - cx) ** 2 + distY(y, cy) ** 2);
        const fall = softCircle(d, rad);
        if (fall > 0) {
          const light = blend(FAR_DARK, FAR_LIGHT, 0.3);
          r = Math.round(lerp(r, light.r, fall * 0.2));
          g = Math.round(lerp(g, light.g, fall * 0.2));
          b = Math.round(lerp(b, light.b, fall * 0.2));
        }
      }

      setPixel(pixels, idx, Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b)));
    }
  }

  const outPath = path.join(OUT_DIR, 'parallax_far.png');
  await sharp(pixels, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } })
    .png()
    .toFile(outPath);
  return outPath;
}

async function generateMid() {
  const pixels = new Uint8ClampedArray(WIDTH * HEIGHT * 4);

  // Base gradient
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 4;
      const ty = y / HEIGHT;
      const base = blend(MID_OLIVE, MID_SAGE, ty * 0.5 + 0.25);
      const n = noise(x * 2, y * 2);
      const base2 = blend(base, MID_BROWN, (n - 0.4) * 0.3);
      setPixel(pixels, idx, base2.r, base2.g, base2.b);
    }
  }

  // Organic green blobs (tree tops) - tileable
  const blobs = [];
  const cellW = 160;
  const cellH = 72;
  for (let gy = 0; gy < HEIGHT / cellH; gy++) {
    for (let gx = 0; gx < WIDTH / cellW + 1; gx++) {
      const cx = (gx * cellW + hash(13, gx, gy) * cellW * 0.5) % (WIDTH + 100) - 50;
      const cy = gy * cellH + hash(17, gx, gy) * cellH * 0.6;
      const rad = 40 + hash(19, gx, gy) * 50;
      blobs.push({ cx, cy, rad, color: hash(23, gx, gy) > 0.5 ? MID_SAGE : MID_OLIVE });
    }
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 4;
      let r = pixels[idx];
      let g = pixels[idx + 1];
      let b = pixels[idx + 2];

      for (const blob of blobs) {
        const dx = x - blob.cx;
        const dy = Math.min(Math.abs(y - blob.cy), Math.abs(y - blob.cy - HEIGHT), Math.abs(y - blob.cy + HEIGHT));
        const d = Math.sqrt(dx * dx + dy * dy);
        const fall = softCircle(d, blob.rad);
        if (fall > 0) {
          r = Math.round(lerp(r, blob.color.r, fall * 0.7));
          g = Math.round(lerp(g, blob.color.g, fall * 0.7));
          b = Math.round(lerp(b, blob.color.b, fall * 0.7));
        }
      }

      // Earth brown paths (horizontal bands with noise)
      const pathNoise = noise(x * 0.5, y * 0.3);
      if (pathNoise > 0.55 && pathNoise < 0.65) {
        const t = (pathNoise - 0.55) / 0.1;
        const path = blend(MID_BROWN, { r: 0x5a, g: 0x45, b: 0x35 }, t);
        r = Math.round(lerp(r, path.r, 0.4));
        g = Math.round(lerp(g, path.g, 0.4));
        b = Math.round(lerp(b, path.b, 0.4));
      }

      // Gold accents (small dots)
      if (hash(31, Math.floor(x / 8), Math.floor(y / 8)) > 0.97) {
        r = Math.round(lerp(r, MID_GOLD.r, 0.5));
        g = Math.round(lerp(g, MID_GOLD.g, 0.5));
        b = Math.round(lerp(b, MID_GOLD.b, 0.5));
      }

      setPixel(pixels, idx, Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b)));
    }
  }

  const outPath = path.join(OUT_DIR, 'parallax_mid.png');
  await sharp(pixels, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } })
    .png()
    .toFile(outPath);
  return outPath;
}

async function generateNear() {
  const pixels = new Uint8ClampedArray(WIDTH * HEIGHT * 4);

  // Base gradient
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 4;
      const ty = y / HEIGHT;
      const base = blend(NEAR_SAGE, { r: 0x7a, g: 0xac, b: 0x7a }, ty);
      const n = noise(x * 3, y * 3);
      const base2 = blend(base, NEAR_COPPER, (n - 0.5) * 0.15);
      setPixel(pixels, idx, base2.r, base2.g, base2.b);
    }
  }

  // Finer foliage shapes (small circles, tileable)
  const foliage = [];
  const fCellW = 40;
  const fCellH = 36;
  for (let gy = 0; gy < HEIGHT / fCellH; gy++) {
    for (let gx = 0; gx < WIDTH / fCellW + 2; gx++) {
      const cx = (gx * fCellW + hash(41, gx, gy) * fCellW) % (WIDTH + 40) - 20;
      const cy = gy * fCellH + hash(43, gx, gy) * fCellH * 0.5;
      const rad = 8 + hash(47, gx, gy) * 16;
      foliage.push({ cx, cy, rad });
    }
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const idx = (y * WIDTH + x) * 4;
      let r = pixels[idx];
      let g = pixels[idx + 1];
      let b = pixels[idx + 2];

      for (const f of foliage) {
        const dx = x - f.cx;
        const dy = Math.min(Math.abs(y - f.cy), Math.abs(y - f.cy - HEIGHT), Math.abs(y - f.cy + HEIGHT));
        const d = Math.sqrt(dx * dx + dy * dy);
        const fall = softCircle(d, f.rad);
        if (fall > 0) {
          const leaf = hash(53, f.cx, f.cy) > 0.6 ? NEAR_SAGE : NEAR_COPPER;
          r = Math.round(lerp(r, leaf.r, fall * 0.5));
          g = Math.round(lerp(g, leaf.g, fall * 0.5));
          b = Math.round(lerp(b, leaf.b, fall * 0.5));
        }
      }

      // Filigree-like paths (thin copper lines)
      const lineNoise = noise(x * 4, y * 2);
      if (lineNoise > 0.48 && lineNoise < 0.52) {
        r = Math.round(lerp(r, NEAR_COPPER.r, 0.3));
        g = Math.round(lerp(g, NEAR_COPPER.g, 0.3));
        b = Math.round(lerp(b, NEAR_COPPER.b, 0.3));
      }

      setPixel(pixels, idx, Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b)));
    }
  }

  const outPath = path.join(OUT_DIR, 'parallax_near.png');
  await sharp(pixels, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } })
    .png()
    .toFile(outPath);
  return outPath;
}

async function main() {
  ensureDir(OUT_DIR);
  const [far, mid, near] = await Promise.all([
    generateFar(),
    generateMid(),
    generateNear(),
  ]);
  console.log('Phase 5.1.B — Created procedural tileable parallax layers:');
  console.log('  ', far);
  console.log('  ', mid);
  console.log('  ', near);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
