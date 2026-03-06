#!/usr/bin/env node
/**
 * Makes white/near-white pixels transparent in a PNG.
 * Usage: node scripts/make-transparent.js <input> [output]
 * If output omitted, overwrites input.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const input = process.argv[2];
const output = process.argv[3] || input;

if (!input) {
  console.error('Usage: node scripts/make-transparent.js <input> [output]');
  process.exit(1);
}

const inputPath = path.resolve(input);
const outputPath = path.resolve(output);

if (!fs.existsSync(inputPath)) {
  console.error('File not found:', inputPath);
  process.exit(1);
}

// Threshold: pixels with R,G,B all >= this become transparent
const WHITE_THRESHOLD = 250;

async function main() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8ClampedArray(data);

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      pixels[i + 3] = 0; // alpha
    }
  }

  await sharp(pixels, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toFile(outputPath);

  console.log('Saved:', outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
