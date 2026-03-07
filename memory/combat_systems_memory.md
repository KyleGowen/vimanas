# Combat Systems Memory

Player movement, weapons, enemies, balancing. Combat Systems reads this before weapon/enemy work.

## Entries

- **2026-03-04 (Core C# First):** Specs target Vimanas.Core. Damage formulas, fire rate, wave composition live in Core (CombatMath, GameLoop, WaveComposition). Design locks feed Core implementation.
- **2025-03-03 (CEO):** 2.A.1 Sparrow design lock approved. Stats (HP 14, Def 12, Atk 20, Mana 19, Spd 35), visual lock (cobalt/cyan, #00FFFF propulsion), P0 mocks considered.
- **2025-03-03 (CEO):** 2.A.3 Basic gun design approved. Damage formula (Attack × 0.25 / defense), fire rate 0.15s, projectile speed 12 u/s; VFX cyan core (#00FFFF), trail. Gates 2.3 Basic gun and 2.4 Projectile pooling.
- **2026-03-05 (CEO):** 3.A.1 Scout design lock approved. Stats: HP 15, Defense 1 (3 hits from Sparrow); movement pattern (from above, formations per Level/Encounter); damage formula application. Gates 3.A.2 (Scout sprite sheet), 3.1 (First enemy).
- **2026-03-06 (Sparrow secondary):** Secondary fire (J) consumes mana (1/ring). Mana regen 3/s when not firing. Energy rings: muzzle spawn, straight travel, radius grows 100 px/s, lifetime 1 s. Damage via weaponStrength(attack). No cone spread. See src/effects/ENERGY_RING_CONTEXT.md.
- **2026-03-06 (Turtle primary):** Arc shot: curved beam, 0.4 s fire rate, 0.3125 s duration, 160×298 px. Persists after hit (can hit multiple enemies); each enemy hit only once per arc via hitTargets Set. Damage weaponStrength×1.15. See src/arc-shot/CONTEXT.md.

## Still true?

- [ ] Review and prune stale items periodically
