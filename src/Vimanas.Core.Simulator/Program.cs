using System.Numerics;
using Vimanas.Core;
using Vimanas.Core.Simulator;

// Run N seconds of gameplay, log state. Agents verify via assertions.
// Usage: dotnet run --project src/Vimanas.Core.Simulator [--duration 5]

var duration = 5f;
var cmdArgs = Environment.GetCommandLineArgs();
for (var i = 0; i < cmdArgs.Length - 1; i++)
{
    if (cmdArgs[i] == "--duration" && float.TryParse(cmdArgs[i + 1], out var d))
    {
        duration = d;
        break;
    }
}

var state = new GameState();
var input = new SimulatorInput();
var time = new SimulatorTime(0.016f);

var loop = new GameLoop(state, input, time);
loop.InitPlayer(new ShipStats(Attack: 20), new Vector2(0, -4));
loop.SpawnWave(new Vector2(0, 4), count: 6);

var ticks = (int)(duration / time.DeltaTime);
Console.WriteLine($"Simulating {duration}s ({ticks} ticks). Player at (0,-4), 6 scouts at (0,4).");
Console.WriteLine();

for (var t = 0; t < ticks; t++)
{
    time.Advance();
    loop.Update();

    if (t % 60 == 0 || state.Player!.Position.Y > 4 || state.Enemies.Count(e => e.IsAlive) < 6)
    {
        var alive = state.Enemies.Count(e => e.IsAlive);
        Console.WriteLine($"t={time.Time:F2}: Player pos=({state.Player!.Position.X:F2},{state.Player.Position.Y:F2}) projectiles={state.Projectiles.Count} enemies_alive={alive}");
    }
}

var finalAlive = state.Enemies.Count(e => e.IsAlive);
Console.WriteLine();
Console.WriteLine($"Done. Enemies alive: {finalAlive}/6. Projectiles: {state.Projectiles.Count}.");
