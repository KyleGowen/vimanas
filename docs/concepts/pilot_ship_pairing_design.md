# Pilot–Ship Pairing Design

**Phase 7 · 7.A.1 · Narrative + Combat Systems**

Defines each ship–pilot combination: combo ID, optional nickname, flavor, and interaction. Per [pilot_ship_stat_design_lock.md](pilot_ship_stat_design_lock.md) and [pilot_mocks_deliverable.md](p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md). Gates 7.A.2 (ship selection UI with pilots) and 7.1 (ship selection tech).

---

## Naming Convention

- **Combo ID:** `{ship}-{pilot}` lowercase, hyphenated (e.g. `sparrow-rookie`, `dragon-speed`). Use for code, config, and reference.
- **Nickname:** Optional display name for CEO/player reference (e.g. "Fledgling" for sparrow-rookie). CEO can add or change nicknames.
- **Reference:** CEO can say "sparrow-rookie" or "Fledgling" interchangeably.

---

## Pairwise Matrix


|             | Speed                           | Weapon                            | Defensive                               | Rookie                            |
| ----------- | ------------------------------- | --------------------------------- | --------------------------------------- | --------------------------------- |
| **Sparrow** | [sparrow-speed](#sparrow-speed) | [sparrow-weapon](#sparrow-weapon) | [sparrow-defensive](#sparrow-defensive) | [sparrow-rookie](#sparrow-rookie) |
| **Turtle**  | [turtle-speed](#turtle-speed)   | [turtle-weapon](#turtle-weapon)   | [turtle-defensive](#turtle-defensive)   | [turtle-rookie](#turtle-rookie)   |
| **Wolf**    | [wolf-speed](#wolf-speed)       | [wolf-weapon](#wolf-weapon)       | [wolf-defensive](#wolf-defensive)       | [wolf-rookie](#wolf-rookie)       |
| **Dragon**  | [dragon-speed](#dragon-speed)   | [dragon-weapon](#dragon-weapon)   | [dragon-defensive](#dragon-defensive)   | [dragon-rookie](#dragon-rookie)   |


**Expandability:** To add a ship, add a row and 4 new flavor entries. To add a pilot, add a column and 4 new flavor entries. Combo ID format stays `{ship}-{pilot}`.

---

## Flavor Entries

### sparrow-speed

**Flavor:** All-in speed. Sparrow's already the fastest ship; Speed pilot pushes it further—blur on the screen, evasion over everything. Glass cannon in motion.

**Interaction:** Speed pilot increases forward/lateral speed and maneuvering; reduces defense. Sparrow's low HP/Def gets lower; speed gets extreme. High risk, high mobility.

---

### sparrow-weapon

**Flavor:** Swift striker. Sparrow's agility meets Weapon pilot's firepower—dash in, hit hard, dash out. Hit-and-run perfected.

**Interaction:** Weapon pilot boosts attack, fire speed, crit. Sparrow stays fast; damage output rises. Fragile but punishing.

---

### sparrow-defensive

**Flavor:** Contrast pairing. Sparrow's fragility softened by Defensive pilot—still nimble, but survivable. The fast ship that can take a hit.

**Interaction:** Defensive pilot increases HP, defense; reduces speed. Sparrow becomes less extreme, more forgiving. Balanced Sparrow.

---

### sparrow-rookie — "Fledgling"

**Flavor:** The learner's first ride. Sparrow's speed without veteran tweaks—raw, eager, unrefined. Perfect for newcomers.

**Interaction:** Rookie applies no modifiers; Sparrow's base stats shine through. Pure ship identity.

---

### turtle-speed

**Flavor:** Unexpected twist. The tank that moves. Turtle's bulk meets Speed pilot's urgency—slow ship, faster pilot. Deliberate but not sluggish.

**Interaction:** Speed pilot increases lateral speed and maneuvering; reduces defense. Turtle stays slow forward (ship thrust); gains agility. Tank with better dodging.

---

### turtle-weapon

**Flavor:** Fortress with teeth. Turtle holds the line; Weapon pilot makes that line hurt. Slow, heavy, punishing.

**Interaction:** Weapon pilot boosts attack, fire speed. Turtle's low attack rises; tank identity intact. Hold position, output damage.

---

### turtle-defensive

**Flavor:** Peak tank. Turtle doubled down—maximum durability. The immovable object. "I hold the line" personified.

**Interaction:** Defensive pilot increases HP, defense; reduces speed. Turtle becomes the ultimate tank. Slowest, toughest.

---

### turtle-rookie

**Flavor:** Pure turtle. No pilot tweaks—just the ship. Reliable, armored, deliberate. The baseline tank experience.

**Interaction:** Rookie applies no modifiers. Turtle's base stats: high HP, high defense, low speed.

---

### wolf-speed

**Flavor:** Balanced with a kick. Wolf's versatility gains Speed pilot's edge—jack-of-all-trades that leans into mobility.

**Interaction:** Speed pilot increases speed, maneuvering; reduces defense. Wolf stays balanced but shifts toward agility. Slightly faster, slightly frailer.

---

### wolf-weapon

**Flavor:** Balanced with bite. Wolf's reliability meets Weapon pilot's firepower—no weakness, solid damage. The dependable gunship.

**Interaction:** Weapon pilot boosts attack, fire speed. Wolf's moderate attack rises. Versatile and threatening.

---

### wolf-defensive

**Flavor:** Balanced with bulk. Wolf gains Defensive pilot's toughness—the all-rounder that can absorb more. Steady, unshakeable.

**Interaction:** Defensive pilot increases HP, defense; reduces speed. Wolf becomes tankier without losing versatility. Balanced tank.

---

### wolf-rookie

**Flavor:** Pure wolf. The baseline. No specialization, no weakness. Reliable, versatile, predictable.

**Interaction:** Rookie applies no modifiers. Wolf's balanced stats (all 20s) unchanged. Ideal for players who want a neutral starting point.

---

### dragon-speed

**Flavor:** Glass cannon in motion. Dragon's mana focus meets Speed pilot's agility—burst damage, then reposition. Strike and fade.

**Interaction:** Speed pilot increases maneuvering; reduces defense. Dragon stays mana-heavy; gains lateral mobility. Fragile but evasive.

---

### dragon-weapon

**Flavor:** Peak expression. Dragon's mana gunship meets Weapon pilot's firepower—maximum damage output. The gunship perfected.

**Interaction:** Weapon pilot boosts attack, fire speed, crit. Dragon's already high damage rises further. All-in on offense.

---

### dragon-defensive

**Flavor:** Contrast pairing. Dragon's glass cannon gets a shield. Still mana-focused, still dangerous—but survivable. The caster that can take a hit.

**Interaction:** Defensive pilot increases HP, defense; reduces speed. Dragon becomes less fragile. Mana ship with staying power.

---

### dragon-rookie

**Flavor:** Pure dragon. Mana ship identity unchanged—high mana, high regen, glass cannon. No pilot tweaks.

**Interaction:** Rookie applies no modifiers. Dragon's base stats: high mana, fast regen, lower HP/Def. Pure mana archetype.

---

## P0 Mocks Considered


| P0 Mock                  | Path                                                                          | What it informs                                                                 |
| ------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Pilot mocks**          | [pilot_mocks_deliverable.md](p0_mocks/p0_2_pilots/pilot_mocks_deliverable.md) | Speed, Weapon, Defensive, Rookie. Personality and modifier direction per pilot. |
| **Pilot–ship stat lock** | [pilot_ship_stat_design_lock.md](pilot_ship_stat_design_lock.md)              | Class/subclass model; ship vs pilot stat ownership.                             |
| **Ship design locks**    | [p0_1_ships](p0_mocks/p0_1_ships/)                                            | Sparrow (fast), Turtle (tank), Wolf (balanced), Dragon (mana).                  |


---

## Platform / Engine Gotchas

See [engine_learnings.md](../../dev_standards/engine_learnings.md). When implementing: combo IDs map to config keys; nicknames are display-only. JSON config for pairings should use combo ID as key.

---

## Still true?

- CEO can add/change nicknames for any combo
- Review when 7.1 (ship selection with pilots) implements modifier application

