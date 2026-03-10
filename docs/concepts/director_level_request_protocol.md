# Director Level Request Protocol

**Phase 9 · 9.A.7**

How CEO phrases level requests; how Director interprets and delegates; structured output format. Defines the CEO → Director → Level/Encounter → level spec flow. Gates 9.6 (Director level generation flow).

---

## 1. CEO Request Format

CEO can describe levels in natural language. Example:

> "I want a new level of medium to medium-hard difficulty. It should be roughly 1 minute before the mini-boss, then 1 minute until the boss appears. It should have a city metropolis level background. I want 5 waves of 2 squads of 4 enemies per squad. And the enemies should focus on swarm style. The boss should look like Root-Seeker and behave in a phase-based way."

---

## 2. Interpreted Fields

| CEO phrase | Mapped field | Source doc |
|------------|--------------|------------|
| "easy" / "medium" / "medium-hard" / "hard" | `difficulty` | [difficulty_curve_design.md](difficulty_curve_design.md) |
| "1 minute before mini-boss" | `timing.preMiniBossSeconds: 60` | [level_spec_schema.md](level_spec_schema.md) |
| "1 minute until boss" | `timing.preBossSeconds: 120` (if mini at 60) or `preBossSeconds: 60` (if no mini) | [level_spec_schema.md](level_spec_schema.md) |
| "forest" / "industrial" / "sky" / "city metropolis" | `theme` | [level_theme_taxonomy.md](level_theme_taxonomy.md) |
| "X waves" | `waves.length === X` | [wave_composition_schema.md](wave_composition_schema.md) |
| "Y squads of Z enemies" | Per wave: `squads: Y`, `enemiesPerSquad: Z` | [wave_composition_schema.md](wave_composition_schema.md) |
| "swarm" / "aggressive" / "defensive" / "mixed" | `enemyStyle` | [enemy_style_taxonomy.md](enemy_style_taxonomy.md) |
| "boss like Root-Seeker" | `boss.archetypeId: "root_seeker"` | [boss_archetype_library.md](boss_archetype_library.md) |
| "phase-based" | (Inferred from archetype) | [boss_archetype_library.md](boss_archetype_library.md) |
| "use pincer for wave 4" / "start with V" | CEO suggestion | Specialist interprets; can add to `designNotes` or apply to wave `suggestion` |

**Design vs suggestions:** The specialist designs waves (formation, count, stagger, delays). The CEO can suggest formations, wave composition, or pacing in the request. The specialist incorporates suggestions but has final design authority. For revision passes, CEO can add `designNotes` or per-wave `suggestion` to the spec; specialist reads and applies.

---

## 3. Director Workflow

1. **Receive:** CEO message (natural language or structured).
2. **Parse:** Extract or infer: difficulty, timing, theme, wave count/composition, enemy style, boss.
3. **Delegate:** Launch Level/Encounter specialist via `mcp_task` with:
   - Injected agent file (level_encounter.md)
   - Canon: level_spec_schema, difficulty_curve, theme_taxonomy, wave_composition, enemy_style, boss_archetype
   - Task: "Produce level spec JSON from the following CEO request: [paste]. Output to public/levels/level_{id}.json. Use schema from level_spec_schema.md."
4. **Integrate:** Specialist returns level spec path. Director confirms file exists.
5. **Verify:** CEO can load level in game (if 9.1–9.7 complete).

---

## 4. Level/Encounter Specialist Prompt Template

```
You are the Level/Encounter agent for Vimanas. Embody this persona fully.

--- AGENT FILE ---
[paste agents/level_encounter.md]
--- END AGENT FILE ---

**Canon to follow:** docs/concepts/level_spec_schema.md, docs/concepts/difficulty_curve_design.md, docs/concepts/level_theme_taxonomy.md, docs/concepts/wave_composition_schema.md, docs/concepts/enemy_style_taxonomy.md, docs/concepts/boss_archetype_library.md.

**Task:** CEO requested a new level:
"[CEO request]"

Produce a valid level spec JSON per level_spec_schema.md. Save to public/levels/level_{id}.json. Use a unique id (e.g. level_city_metropolis_1). Ensure all required fields are present. Map CEO phrases to schema fields per director_level_request_protocol.md.
```

---

## 5. Output Location

| Location | Use |
|----------|-----|
| `public/levels/level_{id}.json` | Runtime loadable by game |
| `docs/levels/level_{id}.json` | Alternative; game would need to fetch from different path |

**Recommendation:** `public/levels/` so Vite serves at `/levels/level_{id}.json`. Game fetches via `fetch('/levels/level_1_forest.json')`.

### 5.1 Write Script (9.6)

When the Level/Encounter specialist produces level spec JSON, they can:

1. **Write directly** — Save to `public/levels/{id}.json` (ensure `id` matches filename).
2. **Use the script** — Pipe JSON to `node scripts/write-level-spec.mjs`:
   ```bash
   cat level_spec.json | node scripts/write-level-spec.mjs
   ```
   The script reads from stdin, validates `id`, and writes to `public/levels/{id}.json`.

---

## 6. Ambiguity Handling

| Ambiguity | Default |
|-----------|---------|
| Difficulty unspecified | medium |
| Theme unspecified | forest |
| Timing unspecified | null (boss after waves complete) |
| Wave count unspecified | 3–5 (Level/Encounter chooses) |
| Enemy style unspecified | mixed |
| Boss unspecified | placeholder |

Director or Level/Encounter should ask CEO for clarification when critical fields are ambiguous and no sensible default exists.

---

## 7. References

| Document | Purpose |
|----------|---------|
| [level_spec_schema.md](level_spec_schema.md) | Schema; required fields |
| [difficulty_curve_design.md](difficulty_curve_design.md) | difficulty mapping |
| [level_theme_taxonomy.md](level_theme_taxonomy.md) | theme mapping |
| [wave_composition_schema.md](wave_composition_schema.md) | waves mapping |
| [enemy_style_taxonomy.md](enemy_style_taxonomy.md) | enemyStyle mapping |
| [boss_archetype_library.md](boss_archetype_library.md) | boss mapping |
| [agents/director.md](../agents/director.md) | Delegation protocol |

---

## Gate

This document gates:
- **9.6** — Director level generation flow
