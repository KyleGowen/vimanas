# Ship+Pilot Spec Sheets

**Phase 7.5 · Spec-as-Source-of-Truth**

Each ship–pilot combo has a spec file. Edit the spec; agents can update code and config to match. Per [pilot_ship_pairing_design.md](../concepts/pilot_ship_pairing_design.md) and [pilot_ship_stat_design_lock.md](../concepts/pilot_ship_stat_design_lock.md).

---

## Format

### YAML Frontmatter (machine-parseable)

All spec files use YAML frontmatter for data. Agents read this to sync `pilot-registry.ts`, asset config, and ship config.

| Field | Type | Description |
|-------|------|--------------|
| `combo_id` | string | `{ship}-{pilot}` lowercase, hyphenated (e.g. `sparrow-speed`) |
| `ship_id` | string | `sparrow` \| `turtle` \| `wolf` \| `dragon` |
| `pilot_id` | string | `speed` \| `weapon` \| `defensive` \| `rookie` |
| `nickname` | string | Optional display name (e.g. "Fledgling" for sparrow-rookie) |
| `ship_image` | string | Path to ship sprite, relative to `public/images/` |
| `pilot_image` | string | Path to pilot portrait, relative to `public/images/` |
| `primary_fire_sprite` | string | Path to ship firing primary weapon |
| `secondary_fire_sprite` | string | Path to ship firing secondary weapon |
| `shield_sprite` | string | Path to ship shielding |
| `modifiers` | object | Pilot stat multipliers applied to ship when this pilot is selected |

### Modifier Keys

Modifiers multiply ship base stats. Keys align with [pilot-registry.ts](../../src/config/pilot-registry.ts):

| Key | Description | Default |
|-----|-------------|---------|
| `speed_mult` | speed, forwardSpeed, backwardSpeed, leftSpeed, rightSpeed | 1.0 |
| `defense_mult` | defense | 1.0 |
| `attack_mult` | attack | 1.0 |
| `hp_mult` | hp | 1.0 |

Rookie uses all 1.0. Speed: speed_mult 1.15, defense_mult 0.85. Weapon: attack_mult 1.2. Defensive: hp_mult 1.15, defense_mult 1.15, speed_mult 0.9.

### Visual Display (Markdown)

Below the frontmatter, each spec includes:

- **Header** — `# {Ship} + {Pilot}` with optional nickname
- **Ship | Pilot table** — Inline images of ship and pilot (renders in Preview)
- **Modifiers table** — Stat multipliers in a readable table
- **Ship** — Ship description (from design locks)
- **Pilot** — Pilot description (from pilot mocks)
- **Pairing** — Flavor text for this combo (from pilot_ship_pairing_design)

---

## Template

```yaml
---
combo_id: {ship}-{pilot}
ship_id: {ship}
pilot_id: {pilot}
nickname: ""

ship_image: ships/{ship}/{ship}_facing_n.png
pilot_image: pilots/pilot_{pilot}_specialist.png
primary_fire_sprite: ships/{ship}/{ship}_firing.png
secondary_fire_sprite: ships/{ship}/{ship}_firing_secondary.png
shield_sprite: ships/{ship}/{ship}_shield.png

modifiers:
  speed_mult: 1.0
  defense_mult: 1.0
  attack_mult: 1.0
  hp_mult: 1.0
---

# {Ship} + {Pilot}

| Ship | Pilot |
|------|-------|
| ![{ship}](assets/ships/{ship}/{ship}_facing_n.png) | ![{pilot}](assets/pilots/pilot_{pilot}_specialist.png) |

## Modifiers

| Stat | Multiplier |
|------|------------|
| Speed | {speed_mult} |
| Defense | {defense_mult} |
| Attack | {attack_mult} |
| HP | {hp_mult} |

## Ship

{ship description}

## Pilot

{pilot description}

## Pairing

{flavor + interaction}
```

**Note:** Image paths use `assets/` (symlinks in each ship folder point to `public/images/`). This avoids parent-directory paths that VS Code's Markdown preview blocks. Rookie pilot uses `pilot_neutral_rookie.png`.

---

## File Layout

```
docs/specs/
  README.md           # This file
  SYNC_CONTRACT.md    # Spec → code mapping
  ships/
    sparrow/
      sparrow_speed.md
      sparrow_weapon.md
      sparrow_defensive.md
      sparrow_rookie.md
    turtle/
      turtle_speed.md
      ...
    wolf/
      wolf_speed.md
      ...
    dragon/
      dragon_speed.md
      ...
```

16 files total, one per ship–pilot combo.

---

## Asset Path Convention

Paths are relative to `public/images/`. In code, prepend `/images/` for Vite serving (e.g. `ships/sparrow/sparrow_facing_n.png` → `/images/ships/sparrow/sparrow_facing_n.png`).

---

## Asset Symlinks

Each ship folder contains `assets/` with symlinks to `public/images/` so Markdown preview can load images. VS Code blocks image paths that use `../` (parent directories). The `assets/ships/{ship}/` and `assets/pilots/` symlinks avoid that.

## Placeholders

Primary fire, secondary fire, and shield sprites currently use the ship's `facing_n` image as a placeholder until final art exists. Replace with ship-specific firing/shield poses when available.

---

## References

- [pilot_ship_pairing_design.md](../concepts/pilot_ship_pairing_design.md) — Flavor and interaction text
- [pilot_ship_stat_design_lock.md](../concepts/pilot_ship_stat_design_lock.md) — Stat ownership
- [pilot-registry.ts](../../src/config/pilot-registry.ts) — Modifier implementation
- [SYNC_CONTRACT.md](SYNC_CONTRACT.md) — Spec → code mapping
