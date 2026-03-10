# Spec → Code Sync Contract

**Phase 7.5 · 7.5.A.3**

When you edit a spec file, these are the code files and config locations that agents should update to match. Specs are the source of truth.

---

## Field → Code Mapping

| Spec Field | Code Location | Notes |
|------------|---------------|-------|
| `modifiers.speed_mult` | `src/config/pilot-registry.ts` | `applyPilotModifiers()` switch cases; multiply speed, forwardSpeed, backwardSpeed, leftSpeed, rightSpeed |
| `modifiers.defense_mult` | `src/config/pilot-registry.ts` | `stats.defense *= mult` |
| `modifiers.attack_mult` | `src/config/pilot-registry.ts` | `stats.attack *= mult` |
| `modifiers.hp_mult` | `src/config/pilot-registry.ts` | `stats.hp *= mult` |
| `ship_image` | `src/scenes/ship-select-scene.ts` | `SHIP_IMAGES` map; also `src/ships/*-ship.ts` `SPRITE_PATH` / sprite config |
| `pilot_image` | `src/scenes/ship-select-scene.ts` | `PILOT_IMAGES` map |
| `primary_fire_sprite` | Ship weapon modules, sprite config | Per-ship; e.g. `src/ships/sparrow-ship.ts`, weapon VFX |
| `secondary_fire_sprite` | Ship weapon modules | Per-ship secondary weapon sprite |
| `shield_sprite` | Ship shield effect, sprite config | Per-ship; e.g. `src/effects/` shield rendering |
| `nickname` | Display strings, ship select UI | Optional; for combo nickname (e.g. "Fledgling") |
| `combo_id` | Config keys, JSON | `{ship}-{pilot}` format; use as key in pairing config |

---

## File Reference

| File | Purpose |
|------|---------|
| `src/config/pilot-registry.ts` | Pilot modifier application; `applyPilotModifiers(stats, pilotId)` |
| `src/config/ship-registry.ts` | Ship factory, stats; `createShip(id)`, `getShipMaxHp`, etc. |
| `src/scenes/ship-select-scene.ts` | Ship and pilot image paths for selection UI |
| `src/ships/sparrow-ship.ts` | Sparrow sprite path, stats |
| `src/ships/turtle-ship.ts` | Turtle sprite path, stats |
| `src/ships/wolf-ship.ts` | Wolf sprite path, stats |
| `src/ships/dragon-ship.ts` | Dragon sprite path, stats |

---

## Modifier Implementation Detail

Current `pilot-registry.ts` applies modifiers by `pilotId` only (not per combo). Modifier values are identical for all ships with the same pilot. If specs later diverge (e.g. sparrow-speed has different mult than turtle-speed), the code would need to switch from `pilotId` to `combo_id` lookup.

**Current behavior:** One modifier set per pilot. Specs document the same values per pilot across ships for consistency.

---

## Asset Path Convention

- Spec paths: relative to `public/images/` (e.g. `ships/sparrow/sparrow_facing_n.png`)
- Code paths: `/images/` prefix for Vite (e.g. `/images/ships/sparrow/sparrow_facing_n.png`)

When syncing: prepend `/images/` to spec path for code use.

---

## Workflow

1. Edit spec (e.g. change `modifiers.attack_mult` from 1.2 to 1.25)
2. Agent reads spec frontmatter
3. Agent updates `pilot-registry.ts` to match
4. Run tests; verify modifier application
