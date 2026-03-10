# Combat Systems Memory

Player movement, weapons, enemies, balancing. Combat Systems reads this before weapon/enemy work.

## Entries

- **2025-03-03 (CEO):** 2.A.1 Sparrow design lock approved. Stats (HP 14, Def 12, Atk 20, Mana 19, Spd 35), visual lock (cobalt/cyan, #00FFFF propulsion), P0 mocks considered.
- **2025-03-03 (CEO):** 2.A.3 Basic gun design approved. Damage formula (Attack × 0.25 / defense), fire rate 0.15s, projectile speed 12 u/s; VFX cyan core (#00FFFF), trail. Gates 2.3 Basic gun and 2.4 Projectile pooling.
- **2026-03-05 (CEO):** 3.A.1 Scout design lock approved. Stats: HP 15, Defense 1 (3 hits from Sparrow); movement pattern (from above, formations per Level/Encounter); damage formula application. Gates 3.A.2 (Scout sprite sheet), 3.1 (First enemy).
- **2026-03-06 (Sparrow secondary):** Secondary fire (J) consumes mana (1/ring). Mana regen 3/s when not firing. Energy rings: muzzle spawn, straight travel, radius grows 100 px/s, lifetime 1 s. Damage via weaponStrength(attack). No cone spread. See src/effects/ENERGY_RING_CONTEXT.md.
- **2026-03-06 (Turtle primary):** Arc shot: curved beam, 0.4 s fire rate, 0.3125 s duration, 160×298 px. Persists after hit (can hit multiple enemies); each enemy hit only once per arc via hitTargets Set. Damage weaponStrength×1.15. See src/arc-shot/CONTEXT.md.
- **2026-03-06 (Turtle secondary):** Spread shot: 8 spheres, dual-ring VFX (inner shield-style, outer arc-style). 72 px diameter, 135 px/s, 1.875 s lifetime. Origin 30% down ship. Damage weaponStrength×1 + 1. Mana 5, cooldown 1.5 s. See drawTurtleShieldSphere in src/effects/turtle-shield-effect.ts.
- **2026-03-07 (7.P.1):** Pilot stats: mana, crit, persuasion, maneuvering, attraction. Ship stats: HP, defense, speed, fire power, weapon/shield types. Extensible via JSON. See pilot_ship_stat_design_lock.md.
- **2026-03-09 (8.A.5):** Enemy type & style taxonomy CEO signed off. Hierarchy: Scout (light, swarm-like), Medium (fewer, stronger interesting weapons), Elite (scout/medium base + more HP, different color, one extra shot), Mini-boss, Boss. Extensible; list will expand over time.

## Still true?

- [ ] Review and prune stale items periodically
