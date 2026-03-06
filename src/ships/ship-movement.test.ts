import { describe, it, expect } from 'vitest';
import { getSpeedX, getSpeedY, MOVE_SCALE } from './ship-movement';

describe('ship-movement', () => {
  it('MOVE_SCALE is 10', () => {
    expect(MOVE_SCALE).toBe(10);
  });

  it('getSpeedX returns rightSpeed when moving right', () => {
    const config = { speed: 35, rightSpeed: 50 };
    expect(getSpeedX(config, 1)).toBe(50);
  });

  it('getSpeedX returns leftSpeed when moving left', () => {
    const config = { speed: 35, leftSpeed: 25 };
    expect(getSpeedX(config, -1)).toBe(25);
  });

  it('getSpeedX returns speed when no override', () => {
    const config = { speed: 35 };
    expect(getSpeedX(config, 1)).toBe(35);
    expect(getSpeedX(config, -1)).toBe(35);
  });

  it('getSpeedY returns forwardSpeed when moving north', () => {
    const config = { speed: 35, forwardSpeed: 40 };
    expect(getSpeedY(config, -1)).toBe(40);
  });

  it('getSpeedY returns backwardSpeed when moving south', () => {
    const config = { speed: 35, backwardSpeed: 20 };
    expect(getSpeedY(config, 1)).toBe(20);
  });

  it('getSpeedY returns speed when no override', () => {
    const config = { speed: 35 };
    expect(getSpeedY(config, -1)).toBe(35);
    expect(getSpeedY(config, 1)).toBe(35);
  });
});
