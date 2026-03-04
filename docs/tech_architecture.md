# Tech Architecture

## Core Library + Unity Shell

- **Vimanas.Core:** Pure C# (.NET 8) game logic—no Unity references. Runs and verifies outside Unity.
- **Unity shell:** Thin presentation layer; reads `GameState`, draws via Canvas/UI only (see unity_learnings and Core C# First architecture).
- **Build/verify Core:** `dotnet build src/Vimanas.Core/Vimanas.Core.csproj`, `dotnet test src/Vimanas.Core.Tests/`, `dotnet run --project src/Vimanas.Core.Simulator`

## Engine / Framework

- **Engine:** Unity 6
- **Language:** C#
- **Rendering:** built-in 2D / URP kept very light; gameplay entities use Canvas/UI only (macOS workaround)

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
src/
  Vimanas.Core/       # pure C# game logic (ShipStats, CombatMath, GameState, GameLoop)
  Vimanas.Core.Tests/ # xUnit tests
  Vimanas.Core.Simulator/ # headless console app for verification
Assets/
  Core/           # Unity game loop bridge, services, save/load, event bus
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
- [Build Verification](dev_standards/build_verification.md) — Development Build for standalone debugging; meta GUID format (Unity 6).
- [Unity Learnings](dev_standards/unity_learnings.md) — Scene loading (build index), EditorBuildSettings, camera m_TargetEye on macOS.

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

- **Core (no Unity):** `dotnet build src/Vimanas.Core/`, `dotnet test src/Vimanas.Core.Tests/`, `dotnet run --project src/Vimanas.Core.Simulator [--duration 5]`
- **Open project:** Open `/Users/kyle/vimanas` in Unity Hub (Unity 6)
- **Play:** Boot scene is first in build order; press Play to test Boot → MainMenu → New Game → Gameplay
- **Build:** File > Build Settings; ensure Boot, MainMenu, Gameplay are in Scenes In Build; Build

## Still true?

- [ ] Review and prune stale items periodically
