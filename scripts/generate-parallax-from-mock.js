#!/usr/bin/env node
/**
 * Phase 5.1.A — Slice the p0 forest mock into tileable parallax layers.
 * Uses level_mock_2_forest.png as source; outputs Far, Mid, Near to public/images/level1/.
 *
 * Per plan: Far = upper third (blur, desaturate); Mid = middle; Near = lower.
 * Applies vertical edge blending for tileability (top/bottom match when stacked).
 */

import path from 'path';
import sharp from 'sharp';

const WIDTH = 1280;
const HEIGHT = 720;
const MOCK_PATH = path.resolve(
  process.cwd(),
  'docs/concepts/p0_mocks/p0_3_levels/level_mock_2_forest.png'
);
const OUT_DIR = path.resolve(process.cwd(), 'public/images/level1');

// Blend zone: top and bottom N% of image. Crossfade toward opposite edge.
const BLEND_ZONE = 0.18;

/** Smoothstep for gradual transition (avoids linear harshness) */
function smoothstep(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * (3 - 2 * t);
}

async function loadMock() {
  return sharp(MOCK_PATH);
}

async function cropBand(img, topPercent, heightPercent) {
  const meta = await img.metadata();
  const w = meta.width ?? 1920;
  const h = meta.height ?? 1080;
  const top = Math.round(h * topPercent);
  const bandHeight = Math.round(h * heightPercent);
  return img
    .extract({ left: 0, top, width: w, height: bandHeight })
    .resize(WIDTH, HEIGHT);
}

/**
 * Apply vertical edge blending so top and bottom match when tiled.
 * Crossfade: top zone blends toward bottom row; bottom zone blends toward top row.
 * This creates symmetry so top edge = bottom edge when stacked.
 */
async function makeVerticallyTileable(img) {
  const blendPx = Math.round(HEIGHT * BLEND_ZONE);
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    let blendFactor;
    let oppositeY;
    if (y < blendPx) {
      const t = 1 - y / blendPx;
      blendFactor = smoothstep(t);
      oppositeY = height - 1 - y; // mirror: row 0 <-> row height-1
    } else if (y >= height - blendPx) {
      const t = (y - (height - blendPx)) / blendPx;
      blendFactor = smoothstep(t);
      oppositeY = height - 1 - y;
    } else {
      continue;
    }

    const oppositeIdx = (oppositeY * width) * channels;

    for (let x = 0; x < width; x++) {
      const currIdx = (y * width + x) * channels;
      const oppIdx = oppositeIdx + x * channels;

      for (let c = 0; c < channels; c++) {
        const orig = pixels[currIdx + c];
        const opp = pixels[oppIdx + c];
        pixels[currIdx + c] = Math.round(orig * (1 - blendFactor) + opp * blendFactor);
      }
    }
  }

  return sharp(pixels, { raw: { width, height, channels } }).png();
}

async function generateFar() {
  const mock = await loadMock();
  let img = await cropBand(mock, 0, 1 / 3);
  img = await img
    .blur(8)
    .modulate({ saturation: 0.6, brightness: 0.9 });
  img = await makeVerticallyTileable(img);
  const outPath = path.join(OUT_DIR, 'parallax_far.png');
  await img.toFile(outPath);
  return outPath;
}

async function generateMid() {
  const mock = await loadMock();
  let img = await cropBand(mock, 1 / 3, 1 / 3);
  img = await makeVerticallyTileable(img);
  const outPath = path.join(OUT_DIR, 'parallax_mid.png');
  await img.toFile(outPath);
  return outPath;
}

async function generateNear() {
  const mock = await loadMock();
  let img = await cropBand(mock, 2 / 3, 1 / 3);
  img = await makeVerticallyTileable(img);
  const outPath = path.join(OUT_DIR, 'parallax_near.png');
  await img.toFile(outPath);
  return outPath;
}

async function main() {
  const [far, mid, near] = await Promise.all([
    generateFar(),
    generateMid(),
    generateNear(),
  ]);
  console.log('Phase 5.1.A — Created tileable parallax layers from forest mock:');
  console.log('  ', far);
  console.log('  ', mid);
  console.log('  ', near);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
