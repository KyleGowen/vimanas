# Engine Learnings

**Status:** Active  
**Audience:** Full Stack Engineer, Platform/Release  
**Source:** Framework-free pivot (2026-03-05)

---

## Canvas 2D

- **Context:** Use `canvas.getContext('2d')` for 2D rendering. No WebGL for initial implementation.
- **Resolution:** Fixed internal resolution (e.g. 1280×720); scale to window with CSS or canvas width/height attributes.
- **Aspect ratio:** Letterbox or pillarbox when window aspect differs; maintain consistent gameplay area.
- **Clear:** Call `ctx.clearRect(0, 0, width, height)` or `ctx.fillRect` at start of each frame.

---

## Game Loop

- **requestAnimationFrame:** Use for 60 FPS target. Pass delta time to update logic.
- **Delta time:** `performance.now()` for frame timing; multiply movement by delta for frame-rate independence.
- **Pause:** Stop the loop when tab is hidden or game is paused; resume on focus.

---

## Input

- **Keyboard:** `keydown` / `keyup`; prevent default for game keys (WASD, Space) to avoid scroll/zoom.
- **Gamepad:** `navigator.getGamepads()`; poll each frame. Map buttons (A=fire, D-pad/stick=move).
- **Focus:** Canvas must be focused for keyboard input. Consider auto-focus on click or require user click to start.

---

## Asset Loading

- **Images:** Use `new Image()`; set `src`; await `onload`. Paths from `public/` are at root: `/images/ships/sparrow_facing_n.png`.
- **CORS:** Assets in `public/` are same-origin when served by Vite; no CORS issues.
- **Loading state:** Show loading screen until critical assets (ship, projectile) are loaded.

---

## Projectiles (Basic Gun)

- **Speed/lifetime (2026-03-05):** CEO feedback—shots felt too slow. Doubled speed (120 → 240 px/s), halved lifetime (3s → 1.5s). See `PROJECTILE_SPEED_PX_S`, `PROJECTILE_LIFETIME_S` in `src/projectiles/player-projectile.ts`.

---

## Vertical Scroll / Coordinate System (2026-03-07)

**Rule: Player ship uses screen coordinates for position.** Enemies, projectiles, spawn points use world Y. The player controls where they are on screen; when idle, the ship must not drift.

### Bugs fixed (do not repeat)

1. **Locked vertical movement:** Setting `minY = maxY = playerWorldY` in play area bounds forces the ship to a single Y and removes N/S movement. Use a range: `minY = padding`, `maxY = height - padding - shipSize` (screen bounds for player).

2. **"Idle forward" drift:** If the player ship uses world Y while the world scrolls, `screenY = worldY - scrollOffset` decreases each frame, so the ship appears to drift upward on screen even when idle. Fix: player ship stores screen Y; convert to world only when needed (fire spawn, collision). Draw at `(ship.x, ship.y)` directly.

3. **Coordinate clarity:** X = screen (no horizontal scroll). Y: player = screen; enemies/projectiles/spawn = world. `worldToScreenY(worldY) = worldY - scrollOffset`. For collision with player, use `shipWorldY = scrollOffset + ship.screenY`.

### Reference

- `LevelScrollController`: `getScrollOffset()`, `worldToScreenY()`, `getPlayerWorldY()`, `getSpawnWorldYAboveViewport()`, `isBelowViewport()`
- Player ship: `ship.y` = screen Y. Bounds in screen space. Convert to world for fire/collision.

---

## Still true?

- [ ] Review as engine matures
- [ ] Add Web Audio API learnings when audio is implemented
