import { describe, it, expect } from 'vitest';
import {
  isValidPilotId,
  applyPilotModifiers,
  DEFAULT_PILOT,
} from './pilot-registry';
import type { ShipStatsBase } from '../ships/ship-types';

describe('pilot-registry', () => {
  it('isValidPilotId returns true for valid pilot ids', () => {
    expect(isValidPilotId('speed')).toBe(true);
    expect(isValidPilotId('weapon')).toBe(true);
    expect(isValidPilotId('defensive')).toBe(true);
    expect(isValidPilotId('rookie')).toBe(true);
  });

  it('isValidPilotId returns false for invalid values', () => {
    expect(isValidPilotId('invalid')).toBe(false);
    expect(isValidPilotId(undefined)).toBe(false);
    expect(isValidPilotId(null)).toBe(false);
    expect(isValidPilotId(1)).toBe(false);
  });

  it('DEFAULT_PILOT is rookie', () => {
    expect(DEFAULT_PILOT).toBe('rookie');
  });

  it('applyPilotModifiers (rookie) leaves stats unchanged', () => {
    const stats: ShipStatsBase = {
      hp: 20,
      defense: 10,
      attack: 15,
      mana: 50,
      manaRegenRate: 2,
      speed: 10,
    };
    applyPilotModifiers(stats, 'rookie');
    expect(stats.hp).toBe(20);
    expect(stats.defense).toBe(10);
    expect(stats.attack).toBe(15);
    expect(stats.speed).toBe(10);
  });

  it('applyPilotModifiers (speed) increases speed and reduces defense', () => {
    const stats: ShipStatsBase = {
      hp: 20,
      defense: 10,
      attack: 15,
      mana: 50,
      manaRegenRate: 2,
      speed: 10,
    };
    applyPilotModifiers(stats, 'speed');
    expect(stats.speed).toBeCloseTo(11.5);
    expect(stats.defense).toBeCloseTo(8.5);
  });

  it('applyPilotModifiers (weapon) increases attack', () => {
    const stats: ShipStatsBase = {
      hp: 20,
      defense: 10,
      attack: 15,
      mana: 50,
      manaRegenRate: 2,
      speed: 10,
    };
    applyPilotModifiers(stats, 'weapon');
    expect(stats.attack).toBe(18);
  });

  it('applyPilotModifiers (defensive) increases hp and defense, reduces speed', () => {
    const stats: ShipStatsBase = {
      hp: 20,
      defense: 10,
      attack: 15,
      mana: 50,
      manaRegenRate: 2,
      speed: 10,
    };
    applyPilotModifiers(stats, 'defensive');
    expect(stats.hp).toBeCloseTo(23);
    expect(stats.defense).toBeCloseTo(11.5);
    expect(stats.speed).toBeCloseTo(9);
  });
});
