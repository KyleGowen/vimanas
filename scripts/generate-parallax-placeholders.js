#!/usr/bin/env node
/**
 * Generates placeholder parallax assets for Level 1 (forest).
 * Milestone 4.A.2 — unblocks 4.1/4.2 tech.
 * CEO can replace with final art later.
 *
 * Output: public/images/level1/parallax_far.png, parallax_mid.png, parallax_near.png
 * Resolution: 1280×720
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const WIDTH = 1280;
const HEIGHT = 720;
const OUT_DIR = path.resolve(process.cwd(), 'public/images/level1');

// Palette from level_1_forest_design.md
const DARK_GREEN = '#2d6a2d';
const OLIVE_GREEN = '#6b8e23';
const LIGHT_SAGE = '#8fbc8f';
const EARTH_BROWN = '#8B7355';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateFar() {
  // Far layer: distant canopy, sky gaps. Dark greens, subtle.
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="farGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${DARK_GREEN};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${OLIVE_GREEN};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${DARK_GREEN};stop-opacity:1" />
        </linearGradient>
        <radialGradient id="farGaps" cx="30%" cy="20%" r="40%">
          <stop offset="0%" style="stop-color:${LIGHT_SAGE};stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:${DARK_GREEN};stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#farGrad)" />
      <rect width="100%" height="100%" fill="url(#farGaps)" />
    </svg>
  `;
  const outPath = path.join(OUT_DIR, 'parallax_far.png');
  await sharp(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
    .png()
    .toFile(outPath);
  return outPath;
}

async function generateMid() {
  // Mid layer: dense tree tops. Greens #6b8e23, #8fbc8f, earth brown.
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="midGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${OLIVE_GREEN}" />
          <stop offset="33%" style="stop-color:${LIGHT_SAGE}" />
          <stop offset="66%" style="stop-color:${EARTH_BROWN};stop-opacity:0.4" />
          <stop offset="100%" style="stop-color:${OLIVE_GREEN}" />
        </linearGradient>
        <linearGradient id="midGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${LIGHT_SAGE};stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:${OLIVE_GREEN}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#midGrad1)" />
      <rect width="100%" height="100%" fill="url(#midGrad2)" opacity="0.7" />
    </svg>
  `;
  const outPath = path.join(OUT_DIR, 'parallax_mid.png');
  await sharp(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
    .png()
    .toFile(outPath);
  return outPath;
}

async function generateNear() {
  // Near layer: leaves, branches. Lighter greens #8fbc8f, detail.
  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${LIGHT_SAGE};stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:${OLIVE_GREEN}" />
          <stop offset="100%" style="stop-color:${LIGHT_SAGE};stop-opacity:0.85" />
        </linearGradient>
        <pattern id="nearDetail" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="8" fill="${LIGHT_SAGE}" opacity="0.3" />
          <circle cx="60" cy="50" r="6" fill="${OLIVE_GREEN}" opacity="0.25" />
          <ellipse cx="40" cy="70" rx="12" ry="4" fill="${EARTH_BROWN}" opacity="0.15" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#nearGrad)" />
      <rect width="100%" height="100%" fill="url(#nearDetail)" />
    </svg>
  `;
  const outPath = path.join(OUT_DIR, 'parallax_near.png');
  await sharp(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
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
  console.log('Created:');
  console.log('  ', far);
  console.log('  ', mid);
  console.log('  ', near);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
