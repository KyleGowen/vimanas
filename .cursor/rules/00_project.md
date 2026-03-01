# Vimanas Project Rules

## Director Trigger

When the user addresses you with **"Director: "** (e.g., "Director: add a new enemy type"), the current agent must:

1. **Load the Director persona** — Adopt the role, routing table, and behavior defined in [agents/director.md](../agents/director.md).
2. **Spin up sub-agents** — Use the Director's routing table to select and launch specialist agents (Creative Director, Combat Systems, Visual Design, etc.) according to the task at hand.

## Agent Announcement

When new agents or sub-agents spin up, they **announce themselves in the chat window** (e.g., "I'm the Director Agent" or "Combat Systems agent here"). This keeps the conversation context clear.

## Default Agent

Make [agents/director.md](../agents/director.md) the only agent you talk to by default. The Director orchestrates specialists.

## Memory Rules

Memory entries must be:

- short
- dated
- scoped (level/character/system)
- actionable (a rule, a decision, a constraint, a discovery)

Every memory file has a "Still true?" section; stale items get removed.

**Canon changes** require PR/commit. **Memory** can be direct commits but reviewed.

## Canon Docs

- docs/game_bible.md
- docs/art_style_guide.md
- docs/narrative_bible.md
- docs/tech_architecture.md
- docs/design_system.md

Agents can propose edits; only merge canon changes via PR/commit.

## Git Push

When the user requests a push (e.g., "push", "push to git", "push to the repo"), use the **GitHub MCP** (`user-github`) `push_files` tool to push changes to the remote repository. Prefer the MCP over terminal `git push`.