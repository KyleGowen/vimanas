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

## Still true?

- [ ] Review as engine matures
- [ ] Add Web Audio API learnings when audio is implemented
