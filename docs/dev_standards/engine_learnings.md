# Engine Learnings

**Status:** Active  
**Audience:** Full Stack Engineer, Platform/Release  
**Source:** Framework-free pivot (2026-03-05)

---

## Canvas 2D

- **Context:** Use `canvas.getContext('2d')` for 2D rendering. No WebGL for initial implementation.
- **Resolution:** Dynamic resolution from common 16:9 list (640×360 up to 3840×2160); pick largest that fits viewport. HTML fallback 1280×720; JS overrides on init and resize.
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

- **Images:** Use `new Image()`; set `src`; await `onload`. Paths from `public/` are at root: `/images/ships/sparrow/sparrow_facing_n.png`.
- **CORS:** Assets in `public/` are same-origin when served by Vite; no CORS issues.
- **Loading state:** Show loading screen until critical assets (ship, projectile) are loaded.

---

## Projectiles (Basic Gun)

- **Speed/lifetime (2026-03-05):** CEO feedback—shots felt too slow. Doubled speed (120 → 240 px/s). Lifetime 1.5s → 3s (2026-03-07) for 2× range (720 px). See `PROJECTILE_SPEED_PX_S`, `PROJECTILE_LIFETIME_S` in `src/projectiles/player-projectile.ts`.

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

## Enemy Firing (2026-03-07)

**Rule: Enemy ships do not fire until they are on screen.** Check `scout.y >= scrollOffset && scout.y <= scrollOffset + height` before calling `tryFire`. Prevents off-screen enemies from shooting before the player can see them.

---

## Projectile Lifetime (2026-03-07)

**Use gameTime for projectile age, not performance.now().** Player projectiles receive `spawnTime` from gameTime. Age must be `gameTime - spawnTime`; using `performance.now()/1000 - spawnTime` mixes time bases. When gameTime=5 and performance.now()=30s, age would be 25s and projectiles despawn immediately. Pass `gameTime` in bounds to `PlayerProjectile.update()`.

---

## Parallax (2026-03-07)

**Tile vertically for infinite scroll.** Parallax layers draw a single image that scrolls off-screen; without tiling, the background disappears after ~1 screen height. ParallaxLayer must tile vertically (draw multiple copies at `offsetY + k * screenHeight` for k in range) so the background repeats as the level scrolls. Per roadmap 4.2.6: "Tile or repeat as needed per asset dimensions."

**Boss phase slowdown (2026-03-06):** When boss enters, parallax scroll eases to halt over 5s (BOSS_PARALLAX_DECAY_DURATION_S) instead of stopping immediately. Gameplay scroll stops at boss phase; parallax uses separate `parallaxScrollOffset` that advances with linear decay: `velocity = SCROLL_SPEED × (1 - elapsed / 5)`. Adds ominous feel to boss encounter.

**Procedural assets (5.1.B):** Cancelled. CEO preferred Option A. Script remains at scripts/generate-parallax-procedural.js if needed later.

---

## Boss Sprites (2026-03-07)

**Boss sprite MUST have transparent background (alpha channel).** Per boss_placeholder_spec.md: no solid fill behind the ship shape. Opaque background breaks layering over parallax. PNG with alpha required. Fallback: dark brown block if sprite fails to load.

---

## Energy Ring VFX (2026-03-06)

**Ellipses vs circles:** Energy rings support both via `radiusXScale` and `radiusYScale` (1 = circle). Sparrow uses ellipses (1.4, 0.45) for a squatter, shorter look.

**Elliptical rings:** Use `ctx.translate` + `ctx.scale` so the radial gradient is transformed with the shape. A circular gradient in scaled space becomes elliptical on screen and matches the ellipse boundary. Draw circle at origin, fill donut; avoid stroking an ellipse with a circular gradient (causes visual mismatch).

---

## Shield Effect (2026-03-06)

**Sprite-outline glow:** Use `ctx.shadowBlur` + `ctx.shadowColor` + `ctx.drawImage(sprite, ...)` to create a glow that follows the sprite's alpha silhouette. No edge detection or marching ants needed—the shadow naturally outlines non-transparent pixels.

**Draw order:** Draw the shield glow **before** the ship. Otherwise the glow pass draws the sprite on top of the thruster and hides it. Correct order: shield glow → ship → thruster.

**Fallback:** When sprite is null (e.g. before load or rect placeholder), use radial gradient circle centered on ship bounds.

**Turtle shield force-field (2026-03-06):** Distinct from Sparrow glow. Segmented outer ring: N arc segments (donut slices) with radial gradient (tip→mid→core). Each segment's opacity varies with `sin(gameTime * freq + i * phase)`. Radius pulse: `0.98 + 0.02 * sin(gameTime * 1.5)`. Ship drawn after shield so it remains visible inside. See src/effects/turtle-shield-effect.ts.

**Turtle spread sphere (2026-03-06):** Dual-ring design. Inner ring: shield-style segmented donut (thruster palette), opposite rotation (-EDGE_FREQ). Outer ring: arc-shot style — 4 stroked layers, TURTLE_ARC_PALETTE, radial gradient, shadowBlur. Origin shipY + shipSize*0.8. Fade baseOpacity 0.85–1.0. See drawTurtleShieldSphere in src/effects/turtle-shield-effect.ts.

---

## Turtle Thruster Scaling (2026-03-06)

**Rule: Thruster north/south scales via config.** `northWidthScale`, `northHeightScale`, `southWidthScale`, `southHeightScale` in `ThrusterConfig`. Turtle: north +15% width, +20% length; south −15% width, −20% length. Pass `moveAxis` to `Thruster.draw()`; `moveAxis.y < 0` = north, `moveAxis.y > 0` = south.

---

## Arc Shot (Turtle Primary) (2026-03-06)

**Multi-hit, one damage per enemy:** Arc persists after hitting an enemy. Use `hitTargets: Set<object>` to track which enemies this arc has already damaged. Before applying damage, check `!arc.hitTargets.has(enemy)`; on hit, `arc.hitTargets.add(enemy)`. Clear `hitTargets` in `reset()` when arc is returned to pool.

**Moving-energy VFX:** Draw multiple overlapping strokes (4 layers) with time-based `sin`/`cos` for layerScale and widthScale. Each layer pulses independently (different phase offsets). Creates thruster-like "living" energy feel. Use `shadowBlur` + `shadowColor` for glow.

**Bezier arc:** Quadratic Bezier P0=(-w/2,0), P1=(0,-length), P2=(w/2,0). North = up. Hit detection uses conservative AABB (arc bounds), not point-in-curve.

---

## Still true?

- [ ] Review as engine matures
- [ ] Add Web Audio API learnings when audio is implemented
