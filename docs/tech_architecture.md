# Tech Architecture

## Engine / Framework

- **Engine:** Custom (no game framework)
- **Rendering:** HTML5 Canvas 2D API
- **Language:** TypeScript
- **Build:** Vite (dev server, HMR, production bundle)
- **Data:** JSON + typed interfaces
- **Input:** Keyboard events + Gamepad API
- **Audio:** Web Audio API
- **Target:** Web (primary), Steam/Switch deferred

## Target Platforms

- Web (first — browser playable)
- Steam (deferred — Tauri/Electron wrapper)
- Nintendo Switch (deferred)
- Mac OS (testing via browser)

## Patterns

- **Data:** JSON config files; typed interfaces; no instance variables
- **Input:** InputService abstraction over keyboard + gamepad
- **UI:** Canvas-drawn or DOM overlay
- **Audio:** Web Audio API
- **Source control:** Git
- **Build/CI:** Vite; `npm run build` for production
- **Distribution:** Web first; Steamworks/Switch later

## Folder Layout

```
src/
  main.ts           # Entry, game loop
  game.ts           # Game state, scene management
  input/            # Input service
  render/           # Canvas 2D renderer, sprite draw
  assets/           # Image paths, loaders
  effects/          # Thruster, Projectile beam, future VFX (explosions, hit effects)
  speed-boost/      # Configurable speed boost (key + multiplier)
  scenes/           # Boot, Gameplay
public/
  images/           # Sprites (ships, projectiles, enemies)
index.html
docs/               # Canon, concepts, design
agents/             # Specialist agent definitions
memory/             # Session memory
plans/              # Roadmap, tasks
```

## Development Standards

- [Engine Learnings](dev_standards/engine_learnings.md) — Canvas 2D, input, game loop gotchas.

## Content Types (JSON / TypeScript)

- player ships (stats, sprites)
- enemy archetypes
- weapon definitions
- wave patterns
- level sectors
- powerups
- loot tables
- dialogue / mission briefings

## Performance (Core Rule)

A top-down shooter lives or dies on feel, clarity, and performance more than engine fancy stuff.

- 60 FPS target
- Object pooling for bullets, enemies, effects
- Fixed gameplay resolution strategy; viewport: north = top of screen (see [game_bible.md](game_bible.md#viewport))
- Minimal runtime allocations during combat
- Controller-first UX

## Build / Test Commands

- **Dev:** `npm run dev` — Vite dev server; open localhost in browser
- **Test:** `npm run test` — Vitest unit/integration tests (Director requires coverage)
- **Build:** `npm run build` — Production bundle
- **Full instructions:** See [HOW_TO_START.md](HOW_TO_START.md)
- **Flow:** Boot (title) → Enter/click → Gameplay

## Still true?

- [ ] Review and prune stale items periodically
