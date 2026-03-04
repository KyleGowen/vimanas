using System.Numerics;
using Vimanas.Core;
using Vimanas.Core.Abstractions;
using Vimanas.Core.Tests.Abstractions;
using Xunit;

namespace Vimanas.Core.Tests;

public class GameLoopTests
{
    [Fact]
    public void FireRate_015s_AllowsFireAfterCooldown()
    {
        var state = new GameState();
        var input = new MockInputProvider { FirePressed = true };
        var time = new MockTimeProvider { Time = 0, DeltaTime = 0.016f };

        var loop = new GameLoop(state, input, time);
        loop.InitPlayer(new ShipStats(Attack: 20), Vector2.Zero);

        loop.Update();
        Assert.Single(state.Projectiles);

        time.Advance(0.1f); // not yet 0.15
        loop.Update();
        Assert.Single(state.Projectiles);

        time.Advance(0.06f); // total 0.16 since first fire
        loop.Update();
        Assert.Equal(2, state.Projectiles.Count);
    }

    [Fact]
    public void PlayerMoves_ClampedToPlayArea()
    {
        var state = new GameState();
        var input = new MockInputProvider { Move = new Vector2(1, 1) };
        var time = new MockTimeProvider { Time = 0, DeltaTime = 1f };

        var loop = new GameLoop(state, input, time);
        loop.InitPlayer(new ShipStats(Speed: 35), Vector2.Zero);

        for (var i = 0; i < 20; i++)
        {
            time.Advance(1f);
            loop.Update();
        }

        Assert.NotNull(state.Player);
        Assert.True(state.Player!.Position.X <= 9);
        Assert.True(state.Player.Position.Y <= 5);
    }

    [Fact]
    public void SpawnWave_CreatesEnemiesInVFormation()
    {
        var state = new GameState();
        var input = new MockInputProvider();
        var time = new MockTimeProvider { Time = 0, DeltaTime = 0.016f };

        var loop = new GameLoop(state, input, time);
        var count = loop.SpawnWave(new Vector2(0, 5), count: 6);

        Assert.Equal(6, count);
        Assert.Equal(6, state.Enemies.Count);
    }
}
