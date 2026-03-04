# Combat Systems Memory

Player movement, weapons, enemies, balancing. Combat Systems reads this before weapon/enemy work.

## Entries

- **2026-03-04 (Core C# First):** Specs target Vimanas.Core. Damage formulas, fire rate, wave composition live in Core (CombatMath, GameLoop, WaveComposition). Design locks feed Core implementation.
- **2025-03-03 (CEO):** 2.A.1 Sparrow design lock approved. Stats (HP 14, Def 12, Atk 20, Mana 19, Spd 35), visual lock (cobalt/cyan, #00FFFF propulsion), P0 mocks considered.
- **2025-03-03 (CEO):** 2.A.3 Basic gun design approved. Damage formula (Attack × 0.25 / defense), fire rate 0.15s, projectile speed 12 u/s; VFX cyan core (#00FFFF), trail. Gates 2.3 Basic gun and 2.4 Projectile pooling.

## Still true?

- [ ] Review and prune stale items periodically
