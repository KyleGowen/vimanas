import { describe, it, expect } from 'vitest';
import {
  LevelScrollController,
  SCROLL_SPEED_PX_S,
  PLAYER_BOTTOM_OFFSET_PX,
} from './level-scroll-controller';

describe('LevelScrollController', () => {
  it('starts with scroll offset 0', () => {
    const ctrl = new LevelScrollController();
    ctrl.setScreenSize(1280, 720);
    expect(ctrl.getScrollOffset()).toBe(0);
  });

  it('advances scroll by deltaTime', () => {
    const ctrl = new LevelScrollController();
    ctrl.setScreenSize(1280, 720);
    ctrl.update(1);
    expect(ctrl.getScrollOffset()).toBe(SCROLL_SPEED_PX_S);
    ctrl.update(0.5);
    expect(ctrl.getScrollOffset()).toBe(SCROLL_SPEED_PX_S * 1.5);
  });

  it('reset sets scroll to 0', () => {
    const ctrl = new LevelScrollController();
    ctrl.setScreenSize(1280, 720);
    ctrl.update(1);
    ctrl.reset();
    expect(ctrl.getScrollOffset()).toBe(0);
  });

  it('worldToScreenY converts correctly', () => {
    const ctrl = new LevelScrollController();
    ctrl.setScreenSize(1280, 720);
    expect(ctrl.worldToScreenY(0)).toBe(0);
    ctrl.update(1);
    expect(ctrl.worldToScreenY(SCROLL_SPEED_PX_S)).toBe(0);
    expect(ctrl.worldToScreenY(SCROLL_SPEED_PX_S + 100)).toBe(100);
  });

  it('screenToWorldY converts correctly', () => {
    const ctrl = new LevelScrollController();
    ctrl.setScreenSize(1280, 720);
    ctrl.update(1);
    expect(ctrl.screenToWorldY(0)).toBe(SCROLL_SPEED_PX_S);
  });

  it('getPlayerWorldY returns world Y for bottom-third position', () => {
    const ctrl = new LevelScrollController();
    ctrl.setScreenSize(1280, 720);
    expect(ctrl.getPlayerWorldY()).toBe(720 - PLAYER_BOTTOM_OFFSET_PX);
    ctrl.update(1);
    expect(ctrl.getPlayerWorldY()).toBe(
      SCROLL_SPEED_PX_S + 720 - PLAYER_BOTTOM_OFFSET_PX
    );
  });

  it('getSpawnWorldYAboveViewport returns Y above top', () => {
    const ctrl = new LevelScrollController();
    ctrl.setScreenSize(1280, 720);
    expect(ctrl.getSpawnWorldYAboveViewport(50)).toBe(-50);
    ctrl.update(1);
    expect(ctrl.getSpawnWorldYAboveViewport(50)).toBe(
      SCROLL_SPEED_PX_S - 50
    );
  });

  it('isBelowViewport returns true when world Y is past bottom', () => {
    const ctrl = new LevelScrollController();
    ctrl.setScreenSize(1280, 720);
    expect(ctrl.isBelowViewport(800)).toBe(true);
    expect(ctrl.isBelowViewport(719)).toBe(false);
    ctrl.update(1);
    expect(ctrl.isBelowViewport(SCROLL_SPEED_PX_S + 720)).toBe(false);
    expect(ctrl.isBelowViewport(SCROLL_SPEED_PX_S + 721)).toBe(true);
  });

  it('isAboveViewport returns true when world Y is above top', () => {
    const ctrl = new LevelScrollController();
    ctrl.setScreenSize(1280, 720);
    expect(ctrl.isAboveViewport(-1)).toBe(true);
    expect(ctrl.isAboveViewport(0)).toBe(false);
  });
});
