using System.Numerics;
using Vimanas.Core;
using Vimanas.Core.Abstractions;
using Vimanas.Core.Tests.Abstractions;
using Xunit;

namespace Vimanas.Core.Tests.Integration;

/// <summary>
/// Integration test: spawn 6 scouts, fire continuously, verify at least 1 scout dies.
/// Scout: HP 10, Defense 1. Sparrow: Attack 20 → 5 damage/shot. 2 shots per scout to kill.
/// </summary>
public class CombatIntegrationTests
{
    [Fact]
    public void Spawn6Scouts_FireContinuously_AtLeastOneScoutDies()
    {
        var state = new GameState();
        var input = new MockInputProvider { FirePressed = true };
        var time = new MockTimeProvider { Time = 0, DeltaTime = 0.016f };

        var loop = new GameLoop(state, input, time);
        loop.InitPlayer(new ShipStats(Attack: 20), new Vector2(0, -4));
        loop.SpawnWave(new Vector2(0, 4), count: 6, scoutHp: 10f, scoutDefense: 1f, scoutSpeed: 0f);

        // Run ~3s at 60fps; projectiles travel toward scouts
        for (var i = 0; i < 180; i++)
        {
            time.Advance(0.016f);
            loop.Update();
        }

        var alive = state.Enemies.Count(e => e.IsAlive);
        Assert.True(alive < 6, $"Expected at least 1 scout dead, got {6 - alive} dead");
    }
}
