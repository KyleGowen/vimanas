# Pilot–Ship Stat Design Lock

**Phase 7 · Preliminary Design · 2026-03-07**

Defines how pilots and ship stats interact, which stats belong to ship vs pilot, and how they evolve. Gates 7.A.1 and all Phase 7 tech. **CEO approved.**

---

## Class / Subclass Model

Think of games with classes and subclasses: **the ship is the class, the pilot is the subclass** which influences the ship state and behavior.

- **Ship (class):** Base stats, upgrades via parts and items purchased with materials. The chassis.
- **Pilot (subclass):** Levels up; modifiers affect ship behavior; gains unique abilities. The soul.

---

## Ship-Owned Stats (Class)

Ships level up with **parts and items** purchased with **materials** (materials = currency). Ship enhancements affect:

| Stat | Description |
|------|-------------|
| Speed | Forward thrust; top speed |
| Defense | Damage reduction |
| HP | Hit points |
| Fire Power | Base attack / damage |
| Weapon Types | Primary, secondary, bomb options |
| Shield Types | Shield mechanics per ship |
| Fire Speed | Rate of fire |
| Forward thrust | Acceleration in travel direction (ship-based) |

---

## Pilot-Owned Stats (Subclass)

Pilots level up; their stats affect the ship they fly:

| Stat | Description |
|------|-------------|
| Mana total | Max mana pool |
| Mana regen | Mana regeneration rate |
| Mana discounts | Reduced mana cost for abilities/weapons |
| Persuasion | Discounts on materials (shop); reduces enemy firing rate ("they scared") |
| Critical hit rate | Chance to land a critical hit |
| Critical hit multiplier | Damage multiplier on crit (default 1.5x) |
| Maneuvering | Left/right speed and braking. **Not** forward acceleration (that's thrust, ship-based) |
| Attraction of dropped materials | Pull radius or attraction for loot pickups |

### Critical Hits

- Critical hits do **1.5x damage by default**
- Pilot can increase the critical hit multiplier via level-up

### Persuasion

- Affects discounts on materials (shop economy)
- Can reduce enemy firing rate—enemies are scared

### Maneuvering

- Affects lateral (left/right) speed and braking only
- Forward acceleration is thrust and ship-based

---

## Pilot Abilities

Pilots gain **special abilities** as they reach higher levels. Abilities cost mana to use.

- **Unique per pilot archetype:** Speed, Weapon, Defensive, Rookie each have distinct abilities
- **Example (Speed):** Teleport one ship-length in the direction you're traveling for a mana cost

---

## Materials vs Currency

**Materials = currency.** Same resource. Used to purchase parts and items for ship upgrades.

---

## Extensibility

The class/subclass system must remain **easily modifiable** so we can add statistics and modifications in the future with new features.

- **Data-driven:** JSON config files for stats; typed interfaces
- **Extensible stat/modifier lists:** New stats can be added without major refactors
- See [tech_architecture.md](../../tech_architecture.md) for content types and patterns

---

## P0 Mocks Considered

- [pilot_mocks_deliverable.md](p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md) — Four pilots: Speed, Weapon, Defensive, Neutral (Rookie). Kaladesh aesthetic. Each archetype influences ship via subclass model.

---

## Platform / Engine Gotchas

See [engine_learnings.md](../../dev_standards/engine_learnings.md):

- Asset paths from `public/`; image loading via `new Image()`
- JSON configs for ship/pilot data; typed interfaces
- 60 FPS target; object pooling for projectiles, enemies, effects

---

## Still true?

- [ ] Review when Phase 7 tech implementation begins
- [ ] Reconcile with existing `ShipStatsBase` (mana/manaRegen move to pilot)
