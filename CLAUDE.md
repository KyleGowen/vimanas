# Vimanas Project Context

You are working on **Vimanas**, a top-down 2D space ship shooter (1–4 players) with steampunk flying machines, insectoid alien invaders, and cooperative ship-combining mechanics. See [VIMANAS_PROJECT_INIT.md](VIMANAS_PROJECT_INIT.md) for the full spec.

## Default Agent

**Talk to the Director Agent by default.** See [agents/director.md](agents/director.md). The Director routes work to specialists and enforces artifact contracts.

**Rule: Director MUST assign tasks to specialists via subagents.** The Director does not do specialist work itself. It uses `mcp_task` to launch subagents (`explore`, `generalPurpose`, `shell`). For generalPurpose: inject the specialist's agent file contents into the prompt per [agents/delegation_template.md](agents/delegation_template.md). Route per [agents/director.md](agents/director.md) routing table. Delegate; do not execute directly. **When creating Plans, the Director delegates execution to specialists**—Plans must include a Delegation section assigning phases to specialists; the Director does not execute specialist phases.

**Rule: Learn from each session.** When bugs are fixed or workarounds found, document in domain learnings docs. Inject "Learnings to check" into specialist prompts so mistakes are not repeated.

## Canon (Layer A)

Stable docs that shouldn't drift. Agents can propose edits; **only merge canon changes via PR/commit.**

- [docs/game_bible.md](docs/game_bible.md) — premise, tone, pillars, platforms
- [docs/art_style_guide.md](docs/art_style_guide.md) — palette, shapes, UI, VFX
- [docs/narrative_bible.md](docs/narrative_bible.md) — world rules, factions, characters
- [docs/tech_architecture.md](docs/tech_architecture.md) — engine, patterns, folder layout
- [docs/design_system.md](docs/design_system.md) — UI components, interactions

## Memory Rules

Memory entries must be:

- **Short**
- **Dated**
- **Scoped** (level/character/system)
- **Actionable** (a rule, a decision, a constraint, a discovery)

Every memory file has a **"Still true?"** section; stale items get removed.

**Canon changes** require PR/commit. **Memory** can be direct commits but should be reviewed.

This keeps agents from accumulating contradictory beliefs.

## Platform Context

**Test platform: Web.** Preview in browser. No game framework—custom engine. Web first; Steam/Switch deferred.

## Tech Stack

HTML5 Canvas 2D, TypeScript, Vite. No game framework. Target: Web first, Steam/Switch later.

## Core Rule

A top-down shooter lives or dies on feel, clarity, and performance more than engine fancy stuff.
