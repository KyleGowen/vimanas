# Summary

Vimanas is a top down 2D space ship shooter where 1-4 players must pilot ships through waves of enemy ships to reach the boss at the end of the level.  Levels are sequential and follow a loose narrative of an insectoid alien invasion in humanity's ancient civilization era.

The game is targeted at Steam, Nintendo Switch, and for me to test.. Mac OS.

The game will be built entirely using Agents with specific personas coordinated by a director agent.  I, the human, will interact with the director.  The director will decide which agents on the team to spin up and if their work should be done in parrallel or sequentially.

Coding sessions will be capped at milestone moments where the human is required to approve or deny the latest changes.

This workflow should me adjustable as workloads or worktypes change.


# Agent Profiles

The human will only interact with the Director Agent.
The director configures subagents in sequential or parallel work streams.
Each agent profile does work its specialized for.  
Each agent has a persona that we will develop over time.  The persona is described in the agents biography.
If at any time a persona file is becomes too large we will stop work and prune it.
Agents work style and preferences are built from their influences.  Influences are listed in their agent profile.  
Personas can grow and develop over time but must always keep the core values established in this init file.
We will never add new agents without a human requesting and approving it.

When initializing agent profiles, research their influences on the web and use the findings to create their initial biography and influences context.


The Agent profiles and their seed influences and biographies are as follows:
- Creative Director Agent
  - routes work
  - owns canon docs
  - decides which specialists spin up
  - is fond of MVPs and POCs but refuses to let them stay that way.
  - wants proof before moving on to new priorities
  - likes to keep 2-4 features in flight at a time.
  - prefers to let the CEO (human) evaluate progress at major milestones.
- Combat Systems Agent
  - player movement
  - weapons
  - enemy behaviors
  - balancing formulas
  - Influenced by 80s cartoons like transformers, voltron, and gundam
  - Loves Dragon Ball Z for the special effects and energy blasts
  - Street fighter 2 was a big influence in character design
  - big star fox 64 player
- Level / Encounter Agent
  - wave composition
  - pacing
  - spawn layouts
  - wants games where difficulty ramps
  - Interested in insect behavior
  - studies bird migratory patterns
  - fan of unusual surprises
- Narrative Agent
  - faction lore
  - pilots
  - mission briefings
  - NPCs
  - Into mythology
  - fan of ancient aliens and flying machine myths
  - like the movie Stargate
  - Likes steampunk
  - Historian
  - Writes super hero comic like narratives and plot lines
- Visual Design Agent
  - ships
  - enemies
  - UI mood
  - VFX language
  - Influenced by super-nintendo era 2d shooters like gradius, r-type, 1943, earth defense force, etc.
  - Into illustrated, sleek art—high-fidelity 2D, NOT pixel art or 16-bit (see sparrow sprite sheet)
  - Likes chiptunes like Anamanagucci
  - Likes steampunk
- Unity Gameplay Engineer Agent
  - C# implementation
  - prefabs
  - ScriptableObject schemas
  - scene wiring
- Platform / Release Agent
  - Steam config
  - build scripts
  - controller compliance checklists
  - save-system/platform integration notes
  - Likes staying out of business logic
  - provides foundational non-specific capabilities like controller input or multiplayer networking
  - handles infrastructure like ci/cd pipelines, aws, datastores, etc.

## The Director Agent
Make agents/director.md the only agent you talk to by default.

### Director responsibilities:
Interpret intent ("new character", "new level", "rebalance weapons")
Select specialist agents (based on a routing table)
Create a task file under tasks/active/FEATURE_*.md
Enforce artifact contracts:

Visual: concept sheet + asset list
Narrative: bio + VO lines + quest hooks
Engineering: data model + implementation plan + PR checklist
End every session with:

a short "handoff summary"
updates to memory (director_memory.md + relevant specialist memory; see memory/shared_memory.md)
a dated entry in logs/ship_log.md

This is what makes multi-session work feel "persistent".

## Information Layers

### Stable Cannon (Layer A)

Things that shouldn't drift:

- `docs/game_bible.md`: (premise, tone, pillars, target platform, rating)
- `docs/art_style_guide.md`: (palette, shapes, UI style, refs)
- `docs/narrative_bible.md`: (world rules, factions, timeline)
- `docs/tech_architecture.md`: (engine/framework, patterns, folder layout, build/test commands)
- `docs/design_system.md`: (UI components, typography rules, interactions)

**Rule:** agents can propose edits, but only merge canon changes via PR/commit.

### Working Memory (Layer B)

Agent-learned, changes often. Short, structured, and regularly pruned:

- decisions, constraints discovered, "gotchas", naming conventions, pipeline quirks
- "what we tried and why it failed"
- "current direction for X"

### Task State (Layer C)

Right Now:

- `plans/roadmap.md`
- `tasks/active/*.md`: (one per feature)
- `logs/ship_log.md`: (dated entries, what changed, why)

This is what lets you resume cleanly after a day/week.

## Add these rules to CLAUDE.md and .cursor/rules/00_project.md:

Memory entries must be:
short
dated
scoped (level/character/system)
actionable (a rule, a decision, a constraint, a discovery)
Every memory file has a "Still true?" section; stale items get removed.
Canon changes require PR/commit; memory can be direct commits but reviewed.

This keeps agents from accumulating contradictory beliefs.

# Technology Stack

- Engine: Unity 6
- Language: C#
- Rendering: built-in 2D / URP kept very light
- Target platforms first: Windows PC, then Switch
- Input: Unity Input System
- UI: Unity UI Toolkit or uGUI if you want the simpler/common route
- Audio: FMOD if you want a richer pipeline, otherwise Unity audio is enough early on
- Source control: Git + Git LFS
- Build/CI: GitHub Actions for PC builds, manual/secured console pipeline later
- Data: ScriptableObjects for design-time content + JSON/Addressables only where it helps
- Distribution: Steamworks for PC, Nintendo's standard developer/publishing flow for Switch

# Architecture

- Scenes
  - Boot
  - MainMenu
  - Hangar / Upgrade / Meta
  - Gameplay
  - Results
- Code structure
  - `Core/` — game loop, services, save/load, event bus
  - `Gameplay/Player/`
  - `Gameplay/Enemies/`
  - `Gameplay/Weapons/`
  - `Gameplay/Projectiles/`
  - `Gameplay/Waves/`
  - `Content/` — ScriptableObjects for ships, weapons, enemies, levels
  - `UI/`
  - `Platform/Steam/`
  - `Platform/Switch/` (later, thin wrappers only)

# Data/content

Use **ScriptableObjects** for:

- player ships
- enemy archetypes
- weapon definitions
- wave patterns
- level sectors
- powerups
- loot tables
- dialogue / mission briefings

This is especially good for your AI-agent setup because non-code agents can generate/edit structured content specs that a coding agent turns into ScriptableObjects or JSON importers.

# What I would optimize for technically

For your specific genre, I'd bias toward:

- 60 FPS target
- object pooling for bullets, enemies, effects
- lightweight shaders
- sprite atlases
- fixed gameplay resolution strategy
- minimal runtime allocations during combat
- controller-first UX

**Core rule:** A top-down shooter lives or dies on feel, clarity, and performance more than engine fancy stuff.

# Repository Initialization

And make them persistent via repo files:

- `CLAUDE.md`
- `.cursor/rules/*.md`
- `/agents/*.md`
- `/docs/*.md`
- `/memory/*.md`
- `/tasks/active/*.md`

That gives you durable memory across sessions and makes the agents improve without becoming vague.

# Story

Loose plot that explains the big bad guy and why the pilots have to defeat it.  The big bad should be a race of insect hive mind like aliens invading earth in earth's ancient civilization period.  In this world earth has flying machines that are capable of fighting back against the alien invasion.  Some how the pilots are special chosen citizens who are destined to be Vimana pilots.  They are more capable than the average human.   The pilots fly Vimanas, flying machines, which resemble steampunk spaceships.  Vimanas are capable of fighting back against the invasion but only if they team up to overcome seemingly insurmountable challenges.  

Each new level in the game should have a new development in the story as the pilot heroes get closer to stopping the invasion at its source, the Mother Ship.

# Characters

- pilots with modifying abilities
- 4 pilots to start with

- Speed specialist
  - makes ships move faster but have less defense
  - Could affect weapon or shield speed, or mana regeneration, not just distance over time.
  - hasty/impatient personality
- weapon specialist
  - makes ships have stronger, faster, or bigger attacks. sacrifices other statistics to accommodate.
  - Could make weapons stronger, different, mana usage, bomb size or strength, etc.
  - loves blowing shit up.
  - cowboy attitude
- defensive specialist
  - makes ships tougher and have more hp but slower over all
  - Could make shields wider, stronger, more regenerative, whatever.
  - Could make weaponry more defensive, like causing it to spread around instead of shoot forward.
  - zen attitude
  - brave, immovable fortitude.
- neutral
  - has no modifying affect on ships.
  - rookie with a can-do attitude

# Ships

- ships with stats points that can be added to
  - All 4 ships start with the same number of stat points but allocated differently
- Stats that can be adjusted and added to
  - Hit Points
  - Defense
  - Attack
  - Mana
  - Speed
- 4 ships to start with, multiple pilots can choose the same ships
  - Fast ship but low defense
    - Starts with High Speed and Mana, Low Defense
    - sleek stylish and nimble looking
    - has a sparrow like design
  - slow ship with high defense
    - Starts with High Defense and Hit Points, Low Speed
    - tank like appearance
    - turtle like design
  - neutral stat ship
    - All stat points are relatively equal, one or two could be higher.
    - ship looks unspecialized when compared to the others.
    - Has a wolf like design and theme
  - high attack ship with average speed and defense
    - Starts with High Attack and High Mana, low defense
    - lots of guns
    - has a dragon like design

## Ship Controls and Abilities

- Ships can move around the screen using up, down, left, right controls.
  - Up moves the ship vertically up the screen, and so on.
- Ships can shoot regular guns, strong guns that use some sort of mana, and bombs that make the player invincible and do a large amount of damage to a large area of the screen.
  - Ships might have multiple choices per regular gun or multiple strong guns.
  - This needs to be able to be swapped at the whim of the player during gameplay
  - Immediately switches the firing to the new gun choice.
- Player ships can combine into a single ship where different players control different aspects of the combined ship.
  - the ship is an entirely new ship that has aspects of both ships and is stylistically a combination of the combined ships.
  - combinations for 2, 3, or 4 ships:
    - 2 ships = 1 player controls the ship (pilot) the other controls the weaponry (gunner)
    - 3 ships = 1 pilot, 1 gunner, 1 shielder (adds a moveable shield to the combined ship)
    - 4 ships = 1 pilot, 2 gunners, 1 shielder
    - OR 2x2 ships
  - players can swap roles at any time.
    - maybe for starters any player can just take over a role whenever they want.
- handles controller input.
  - d-pad, analog stick for movement
  - buttons for shooting, bombs, merging, swapping, etc.
  - secondary analog stick for aiming things

# Game Play

- Player and enemy ships fly around the screen
- player and enemy ships have hit points
- ships can fire guns
- when gun fire hits ships it lowers their hit points
  - hit points lost = strength of weapon / defense of receiving ship
- Different ships have their own unique weapons.
  - Some ships, player or enemy, could have multiple types of guns
- Experience points, money, items and mana are earned from defeating different enemies.
  - enemies drop items that are picked up when destroyed
    - different enemies provide different resource types.
    - sometimes they drop items or hit point restoration
- Pilots Gain Exp and level up their impact on their ship
- Ships can be upgraded with $ and get more stat points or different guns or bombs.
- Players can merge their ships at any time and are automatically assigned roles
- Players can split up again at any time for free as well.

# Levels and Enemy Waves

- levels are essentially vertical scrolling panes with waves of enemies
- They start with the player ships taking off from a base and flying out to take on the waves of invaders.
- waves are how enemy ships approach the player(s)
- waves move across the screen in flight formations shooting at the player ships
- All levels have a big boss at the end
  - The boss is large and unique
  - Has varying and interesting firing patterns
  - Can have other unique abilities to make them interesting and challenging to defeat.
- Some levels have mini bosses or unique battles along the way
  - These are not as hard as the boss fights but are challenging but very rewarding for resources.
