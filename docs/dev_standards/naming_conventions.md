# Naming Conventions

**Status:** Active  
**Audience:** Full Stack Engineer, all specialists contributing code

---

## Files

- **kebab-case:** `wolf-ship.ts`, `combat-hud.ts`, `level-scroll-controller.ts`
- One primary export per file when practical; co-locate related types and constants

---

## TypeScript

### Classes and interfaces

- **PascalCase:** `WolfShip`, `CombatHUD`, `LevelScrollController`, `PlayAreaBounds`

### Functions and variables

- **camelCase:** `createDefaultShip`, `getMoveAxis`, `scrollOffset`
- **Private members:** prefix with `private`; name in camelCase

### Constants

- **UPPER_SNAKE_CASE:** `WOLF_SHIP_SIZE`, `PLAY_AREA_PADDING`, `SCROLL_SPEED_PX_S`
- Use for configuration values, magic numbers, and exported constants

### Unused parameters

- **Prefix with underscore:** `_deltaTime`, `_width`, `_height`
- ESLint `argsIgnorePattern: '^_'` allows these

---

## Assets

- **Paths:** `/images/ships/{ship}/{ship}_{pose}.png` (e.g. `wolf_facing_n.png`)
- **Snake_case** for asset filenames
- See [sprite_swap_standard.md](sprite_swap_standard.md) for sprite naming

---

## Still true?

- [ ] Review as project matures
