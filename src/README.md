# Vimanas Core (Pure C#)

Game logic in pure C#—no Unity. Verify without Unity or CEO.

## Build & Test

```bash
dotnet build src/Vimanas.Core/Vimanas.Core.csproj
dotnet test src/Vimanas.Core.Tests/Vimanas.Core.Tests.csproj
dotnet run --project src/Vimanas.Core.Simulator -- --duration 5
```

## Structure

- **Vimanas.Core** — ShipStats, CombatMath, GameState, GameLoop, Movement, Waves
- **Vimanas.Core.Tests** — xUnit tests (damage formula, fire rate, bounds, integration)
- **Vimanas.Core.Simulator** — Headless console app; run N seconds, log state

## Requirements

.NET 8 SDK. Install from https://dotnet.microsoft.com/download
