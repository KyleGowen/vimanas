# Memory

Agent working memory for the Vimanas project. Short, dated, scoped entries. Prune stale items periodically.

## Structure (Flat)

All memory files live in this directory. No subdirectories.

| File | Audience | Purpose |
|------|----------|---------|
| [shared_memory.md](shared_memory.md) | Director | Index of specialist memory files; cross-cutting rules |
| [director_memory.md](director_memory.md) | Director | Process, delegation, CEO sign-offs, milestone completion |
| [acceptance_confidence.md](acceptance_confidence.md) | Director | Interaction count per milestone; confidence heuristic |
| [creative_director_memory.md](creative_director_memory.md) | Creative Director | Canon, P0 mocks, design locks |
| [combat_systems_memory.md](combat_systems_memory.md) | Combat Systems | Weapons, balancing, damage formulas |
| [level_encounter_memory.md](level_encounter_memory.md) | Level / Encounter | Levels, parallax, boss mocks |
| [narrative_memory.md](narrative_memory.md) | Narrative | Pilots, faction lore, mission briefings |
| [visual_design_memory.md](visual_design_memory.md) | Visual Design | Ships, enemies, art style, VFX |
| [full_stack_engineer_memory.md](full_stack_engineer_memory.md) | Full Stack Engineer | TypeScript, Canvas 2D, game loop, input, scenes |
| [platform_release_memory.md](platform_release_memory.md) | Platform / Release | Steam, build scripts, controller compliance |

## Rules

- **Short, dated, scoped, actionable.** Every entry: a rule, decision, constraint, or discovery.
- **Still true?** Each file has a section; remove stale items.
- **Canon changes** require PR/commit. Memory can be direct commits but should be reviewed.
