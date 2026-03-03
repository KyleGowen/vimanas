# Tech Architecture

## Engine / Framework

- **Engine:** Unity 6
- **Language:** C#
- **Rendering:** built-in 2D / URP kept very light

## Target Platforms

- Windows PC (first)
- Nintendo Switch (second)
- Mac OS (testing)

## Patterns

- **Data:** ScriptableObjects for design-time content; JSON/Addressables only where it helps
- **Input:** Unity Input System
- **UI:** Unity UI Toolkit or uGUI
- **Audio:** FMOD for richer pipeline, or Unity audio early on
- **Source control:** Git + Git LFS
- **Build/CI:** GitHub Actions for PC builds; manual/secured console pipeline later
- **Distribution:** Steamworks for PC; Nintendo's standard developer/publishing flow for Switch

## Folder Layout

```
Assets/
  Core/           # game loop, services, save/load, event bus
  Gameplay/
    Player/
    Enemies/
    Weapons/
    Projectiles/
    Waves/
  Content/        # ScriptableObjects for ships, weapons, enemies, levels
  UI/
  Platform/
    Steam/
    Switch/       # later, thin wrappers only
```

## Development Standards

- [Sprite Swap Standard](dev_standards/sprite_swap_standard.md) — ScriptableObject → SpriteApplier → SpriteRenderer; swap art without touching code or prefabs.

## ScriptableObject Types

- player ships
- enemy archetypes
- weapon definitions
- wave patterns
- level sectors
- powerups
- loot tables
- dialogue / mission briefings

## Performance (Core Rule)

A top-down shooter lives or dies on feel, clarity, and performance more than engine fancy stuff.

- 60 FPS target
- Object pooling for bullets, enemies, effects
- Lightweight shaders
- Sprite atlases
- Fixed gameplay resolution strategy; viewport: north = top of screen (see [game_bible.md](game_bible.md#viewport))
- Minimal runtime allocations during combat
- Controller-first UX

## Build / Test Commands

- **Open project:** Open `/Users/kyle/vimanas` in Unity Hub (Unity 6)
- **Play:** Boot scene is first in build order; press Play to test Boot → MainMenu → New Game → Gameplay
- **Build:** File > Build Settings; ensure Boot, MainMenu, Gameplay are in Scenes In Build; Build

## Still true?

- [ ] Review and prune stale items periodically
