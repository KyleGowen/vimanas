/**
 * Scout movement behaviors derived from attack pattern reference.
 * Position is a function of (spawnX, spawnY, spawnTime, gameTime) for frame-rate independence.
 */

import type { MovementBehaviorId } from '../levels/attack-pattern-resolver';

/** Base speed south (px/s). Matches scout-enemy.ts SCOUT_SPEED_PX_S. */
export const SCOUT_SPEED_PX_S = 150;

/** Optional context for behaviors that need screen center (e.g. pincer_swoop). */
export interface ScoutMovementContext {
  centerX?: number;
}

/**
 * Compute scout position from spawn and game time.
 * Frame-rate independent: no accumulation drift.
 */
export function applyMovement(
  behaviorId: MovementBehaviorId,
  spawnX: number,
  spawnY: number,
  spawnTime: number,
  gameTime: number,
  context?: ScoutMovementContext
): { x: number; y: number } {
  const t = Math.max(0, gameTime - spawnTime);
  const centerX = context?.centerX ?? spawnX;

  switch (behaviorId) {
    case 'straight':
      return straight(spawnX, spawnY, t);
    case 'zig_zag':
      return zigZag(spawnX, spawnY, t);
    case 'scatter_converge':
      return scatterConverge(spawnX, spawnY, t, centerX);
    case 'pincer_swoop':
      return pincerSwoop(spawnX, spawnY, t, centerX);
    case 'swoop_in_out':
      return swoopInOut(spawnX, spawnY, t, centerX);
    case 'dive_arc':
      return diveArc(spawnX, spawnY, t, centerX);
    case 'sniper_pause':
      return sniperPause(spawnX, spawnY, t);
    case 'column_advance':
      return straight(spawnX, spawnY, t);
    default:
      return straight(spawnX, spawnY, t);
  }
}

function straight(spawnX: number, spawnY: number, t: number): { x: number; y: number } {
  return {
    x: spawnX,
    y: spawnY + SCOUT_SPEED_PX_S * t,
  };
}

/** Zig-zag: lateral sine wave while moving south. Amplitude 135px, period ~4s (slower left-right). */
const ZIG_ZAG_AMPLITUDE = 135;
const ZIG_ZAG_ANGULAR_FREQ = Math.PI / 2; // rad/s → period 4s

function zigZag(spawnX: number, spawnY: number, t: number): { x: number; y: number } {
  const x = spawnX + ZIG_ZAG_AMPLITUDE * Math.sin(ZIG_ZAG_ANGULAR_FREQ * t);
  const y = spawnY + SCOUT_SPEED_PX_S * t;
  return { x, y };
}

/** Scatter & converge: spread out then curve back toward center. Phase 1: 1.5s spread, then converge. */
const SCATTER_PHASE_S = 1.5;
const SCATTER_SPREAD_PX = 130;
const CONVERGE_RATE = 2; // 1 - exp(-k*t) for x blend to center

function scatterConverge(
  spawnX: number,
  spawnY: number,
  t: number,
  centerX: number
): { x: number; y: number } {
  const sign = spawnX > centerX ? 1 : spawnX < centerX ? -1 : 0;
  let x: number;
  if (t <= SCATTER_PHASE_S) {
    const phase = t / SCATTER_PHASE_S;
    x = spawnX + sign * SCATTER_SPREAD_PX * phase;
  } else {
    const convergeT = t - SCATTER_PHASE_S;
    const spreadX = spawnX + sign * SCATTER_SPREAD_PX;
    const blend = 1 - Math.exp(-CONVERGE_RATE * convergeT * 0.5);
    x = spreadX + (centerX - spreadX) * Math.min(1, blend);
  }
  const y = spawnY + SCOUT_SPEED_PX_S * t;
  return { x, y };
}

/** Pincer swoop: from sides curve toward center while descending. */
const PINCER_CONVERGE_K = 0.8;

function pincerSwoop(
  spawnX: number,
  spawnY: number,
  t: number,
  centerX: number
): { x: number; y: number } {
  const blend = 1 - Math.exp(-PINCER_CONVERGE_K * t);
  const x = spawnX + (centerX - spawnX) * blend;
  const y = spawnY + SCOUT_SPEED_PX_S * t;
  return { x, y };
}

/** In & out: swoop toward center then back out. In 1.2s, hold 0.3s, out 1.2s. */
const SWOOP_IN_S = 1.2;
const SWOOP_HOLD_S = 0.3;
const SWOOP_OUT_S = 1.2;

function swoopInOut(
  spawnX: number,
  spawnY: number,
  t: number,
  centerX: number
): { x: number; y: number } {
  let x: number;
  if (t <= SWOOP_IN_S) {
    const phase = t / SWOOP_IN_S;
    x = spawnX + (centerX - spawnX) * phase;
  } else if (t <= SWOOP_IN_S + SWOOP_HOLD_S) {
    x = centerX;
  } else if (t <= SWOOP_IN_S + SWOOP_HOLD_S + SWOOP_OUT_S) {
    const outT = t - SWOOP_IN_S - SWOOP_HOLD_S;
    const phase = outT / SWOOP_OUT_S;
    x = centerX + (spawnX - centerX) * phase;
  } else {
    x = spawnX;
  }
  const y = spawnY + SCOUT_SPEED_PX_S * t;
  return { x, y };
}

/** Dive arc: parabolic arc toward center from sides. */
const DIVE_ARC_STRENGTH = 0.6;

function diveArc(
  spawnX: number,
  spawnY: number,
  t: number,
  centerX: number
): { x: number; y: number } {
  const blend = 1 - Math.exp(-DIVE_ARC_STRENGTH * t);
  const x = spawnX + (centerX - spawnX) * blend;
  const y = spawnY + SCOUT_SPEED_PX_S * t;
  return { x, y };
}

/** Sniper pause: move down, pause 1.5s at ~2s in, then resume. */
const SNIPER_PAUSE_START_S = 2;
const SNIPER_PAUSE_DURATION_S = 1.5;

function sniperPause(spawnX: number, spawnY: number, t: number): { x: number; y: number } {
  let y: number;
  if (t <= SNIPER_PAUSE_START_S) {
    y = spawnY + SCOUT_SPEED_PX_S * t;
  } else if (t <= SNIPER_PAUSE_START_S + SNIPER_PAUSE_DURATION_S) {
    y = spawnY + SCOUT_SPEED_PX_S * SNIPER_PAUSE_START_S;
  } else {
    const movingT = t - SNIPER_PAUSE_START_S - SNIPER_PAUSE_DURATION_S;
    y = spawnY + SCOUT_SPEED_PX_S * SNIPER_PAUSE_START_S + SCOUT_SPEED_PX_S * movingT;
  }
  return { x: spawnX, y };
}
