# Wave Composition Schema

**Phase 9 · 9.A.4**

Extends [level_spec_schema.md](level_spec_schema.md) with detailed wave composition semantics. Supports "X waves of Y squads of Z enemies per squad" from CEO requests. Gates 9.2 (WaveSpawner refactor).

---

## 1. Schema Location

Wave config is defined in [level_spec_schema.md](level_spec_schema.md) §2 Wave Config Schema. This doc clarifies composition semantics.

---

## 2. Composition Modes

### 2.1 Explicit Count

```json
{ "formation": "v", "enemyType": "scout", "count": 5, "staggerSeconds": 0.6, "betweenWaveDelaySeconds": 4.5 }
```

Total enemies = `count`. Formation layout may constrain (e.g. V expects 5). If count ≠ formation default, use count and adapt layout or log warning.

### 2.2 Squads × Enemies Per Squad

```json
{ "formation": "pincer", "enemyType": "scout", "squads": 2, "enemiesPerSquad": 3, "staggerSeconds": 0.6, "betweenWaveDelaySeconds": 3 }
```

Total enemies = `squads × enemiesPerSquad` = 6. Pincer = 2 wings (squads) × 3 per wing.

### 2.3 Formation-Derived (Implicit)

If neither `count` nor `squads`/`enemiesPerSquad` specified, use formation default:

| Formation | Default Count | Layout |
|-----------|---------------|--------|
| v | 5 | 1 leader + 2 per wing |
| staggered_wedge | 7 | 1 leader + 2 rows of 3 |
| pincer | 6 | 2 wings × 3 |

---

## 3. CEO Request Mapping

| CEO says | Schema |
|----------|--------|
| "5 waves" | `waves.length === 5` |
| "2 squads per wave" | Each wave: `squads: 2` (or formation implies it, e.g. pincer) |
| "4 enemies per squad" | Each wave: `enemiesPerSquad: 4` |
| "X waves of Y squads of Z enemies" | X waves; each: `squads: Y`, `enemiesPerSquad: Z` |

---

## 4. Formation ↔ Count Compatibility

| Formation | Supported counts | Notes |
|-----------|------------------|-------|
| v | 5 (default), 3, 7 | Odd numbers; leader + symmetric wings |
| staggered_wedge | 7 (default), 4, 10 | 1 + 3n rows |
| pincer | 6 (default), 4, 8 | 2 × n per wing |

WaveSpawner uses formation layout functions (getVFormationPositions, etc.). For non-default counts, either extend layout functions or clamp to nearest supported.

---

## 5. References

| Document | Purpose |
|----------|---------|
| [level_spec_schema.md](level_spec_schema.md) | WaveConfig schema |
| [wave_design_spec.md](wave_design_spec.md) | Formation layouts; spacing |
| [wave_sequence_design.md](wave_sequence_design.md) | Level 1 sequence |

---

## Gate

This document gates:
- **9.2** — WaveSpawner reads wave config; supports count/squads/enemiesPerSquad
