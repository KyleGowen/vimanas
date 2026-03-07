# Design System

## Viewport

Fixed top-down view of the player ship fighting enemy ships. Directional mapping:

- **Forward (North):** top of screen
- **Backward (South):** bottom of screen
- **Banking left:** player ship moves toward left side of screen
- **Banking right:** player ship moves toward right side of screen

## UI Components

- Menus: MainMenu, Hangar/Upgrade/Meta
- HUD: ship stats, HP, mana, weapons
- Results screen

## Typography Rules

TBD — establish when UI is implemented.

## Ship Stats (Class) vs Pilot Stats (Subclass)

Ship = class; Pilot = subclass. See [pilot_ship_stat_design_lock.md](concepts/pilot_ship_stat_design_lock.md).

**Ship-owned (enhanced by parts/items with materials):** HP, Defense, Attack, Speed, Fire Power, Weapon Types, Shield types, Fire Speed, forward thrust.

**Pilot-owned (level up):** Mana total, Mana regen, Mana discounts, Persuasion, Critical hit rate/multiplier, Maneuvering, Attraction of dropped materials.

All 4 ships start with the same number of stat points but allocated differently.

## Ship Controls

- **Movement:** up, down, left, right (d-pad; analog stick). Up = forward (north/top); down = backward (south/bottom); left/right = banking toward screen edges (see Viewport)
- **Weapons:** regular guns, strong guns (mana), bombs (invincible + large area damage)
- **Swapping:** guns swappable at whim during gameplay; immediate switch
- **Combining:** 2–4 ships merge into one; players assign roles (pilot, gunner, shielder)
- **Roles:** 2 ships = pilot + gunner; 3 = pilot + gunner + shielder; 4 = pilot + 2 gunners + shielder (or 2x2)
- **Role swap:** players can swap roles at any time

## Interactions

- Controller: d-pad/analog for movement; buttons for shooting, bombs, merging, swapping; secondary analog for aiming

## Level Structure

- Vertical scrolling panes with waves of enemies
- Start: ships take off from base, fly out to meet invaders
- Waves: enemy ships in flight formations, shooting at players
- Boss: large, unique, varying firing patterns, unique abilities
- Mini bosses: challenging, rewarding for resources

## Still true?

- [ ] Review and prune stale items periodically
