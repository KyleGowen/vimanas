# Delegation Template

**Use this structure when launching specialist subagents via `mcp_task`.** Subagents do NOT automatically load agent files—the Director must inject persona and influences into the prompt.

## Protocol

1. **Read the specialist's agent file** (`agents/<specialist>.md`) before delegating.
2. **Inject the full agent file contents** into the mcp_task prompt (or at minimum: Biography, Influences, Responsibilities).
3. **Follow the template structure** below so the subagent has clear context and task.

## Template Structure

```
You are the [Specialist Name] agent for Vimanas. Embody this persona fully.

--- AGENT FILE (inject full contents of agents/<specialist>.md) ---
[PASTE agents/<specialist>.md HERE]
--- END AGENT FILE ---

**Canon to follow:** [List relevant docs: game_bible, narrative_bible, art_style_guide, tech_architecture, etc.]

**Learnings to check:** [If domain has a learnings doc, add it. E.g. Unity Engineer → docs/dev_standards/unity_learnings.md. Instruct: read before implementing; avoid repeating known issues.]

**Task:** [Specific, actionable request with expected output format and file path if applicable]
```

**Rule:** Director MUST add a "Learnings to check" block when a learnings doc exists for the specialist's domain. See agents/director.md "Learning from Sessions."

## Specialist → Agent File Mapping

| Specialist        | Agent File                    | Learnings Doc (if exists)              |
|-------------------|-------------------------------|----------------------------------------|
| Narrative         | agents/narrative.md           | —                                      |
| Visual Design     | agents/visual_design.md       | —                                      |
| Level / Encounter | agents/level_encounter.md     | —                                      |
| Combat Systems    | agents/combat_systems.md      | —                                      |
| Creative Director | agents/creative_director.md  | —                                      |
| Unity Gameplay Engineer | agents/unity_gameplay_engineer.md | docs/dev_standards/unity_learnings.md |
| Platform / Release| agents/platform_release.md    | docs/dev_standards/platform_learnings.md (create when needed) |

## Attachments

`mcp_task` attachments are for video files only (video-review subagents). For generalPurpose and explore subagents, **always inject agent file contents into the prompt text**—there is no automatic file loading.

## Example (Narrative)

```
You are the Narrative agent for Vimanas. Embody this persona fully.

--- AGENT FILE ---
# Narrative Agent
## Responsibilities
- Faction lore
- Pilots (bios, personalities)
...
## Biography
The Narrative Agent is a historian and mythologist at heart...
## Influences
- Stargate (1994): Ancient astronaut theory...
--- END AGENT FILE ---

**Canon to follow:** docs/game_bible.md, docs/narrative_bible.md

**Task:** Write the opening to the story (2–4 paragraphs). Establish world, stakes, tone, hook. Output to docs/concepts/p0_mocks/p0_6_narrative/sample_narrative.md.
```
