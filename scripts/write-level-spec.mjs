#!/usr/bin/env node
/**
 * Write level spec JSON to public/levels/.
 * Usage: node scripts/write-level-spec.mjs < level_spec.json
 * Or: cat level_spec.json | node scripts/write-level-spec.mjs
 *
 * Reads JSON from stdin, validates it has an "id" field, writes to public/levels/{id}.json.
 * Per docs/concepts/director_level_request_protocol.md (9.6).
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LEVELS_DIR = join(ROOT, 'public', 'levels');

function main() {
  let input;
  try {
    input = readFileSync(0, 'utf-8');
  } catch (e) {
    console.error('Failed to read stdin:', e.message);
    process.exit(1);
  }

  let spec;
  try {
    spec = JSON.parse(input);
  } catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(1);
  }

  if (!spec.id || typeof spec.id !== 'string') {
    console.error('Level spec must have an "id" field (string)');
    process.exit(1);
  }

  const outPath = join(LEVELS_DIR, `${spec.id}.json`);
  try {
    writeFileSync(outPath, JSON.stringify(spec, null, 2), 'utf-8');
    console.log(`Wrote ${outPath}`);
  } catch (e) {
    console.error('Failed to write:', e.message);
    process.exit(1);
  }
}

main();
