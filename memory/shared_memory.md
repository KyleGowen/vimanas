# Shared Memory

**Index of specialist memory files.** Each specialist has a dedicated memory file. Director reads `director_memory.md`; when delegating, inject the specialist's memory file into the prompt.

## Specialist Memory Files

| Specialist | Memory File | Scope |
|------------|-------------|-------|
| Director | [director_memory.md](director_memory.md) | Process, delegation, CEO sign-offs, milestone completion |
| Creative Director | [creative_director_memory.md](creative_director_memory.md) | Canon, P0 mocks, design locks |
| Combat Systems | [combat_systems_memory.md](combat_systems_memory.md) | Weapons, balancing, damage formulas |
| Level / Encounter | [level_encounter_memory.md](level_encounter_memory.md) | Levels, parallax, boss mocks |
| Narrative | [narrative_memory.md](narrative_memory.md) | Pilots, faction lore, mission briefings |
| Visual Design | [visual_design_memory.md](visual_design_memory.md) | Ships, enemies, art style, VFX |
| Unity Gameplay Engineer | [unity_gameplay_engineer_memory.md](unity_gameplay_engineer_memory.md) | C#, prefabs, scenes, builds, learnings |
| Platform / Release | [platform_release_memory.md](platform_release_memory.md) | Steam, build scripts, controller compliance |

## Cross-Cutting Rules

- **Director:** When CEO signs off a milestone, update `plans/roadmap.md` immediately. Run Session End Checklist (memory save, learning capture, ship_log).
- **All specialists:** New learnings go to the specialist's domain (e.g., Unity → unity_learnings.md) and to the specialist's memory file when relevant.

## Still true?

- [ ] Review and prune stale items periodically
