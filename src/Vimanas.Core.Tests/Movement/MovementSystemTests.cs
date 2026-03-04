using System.Numerics;
using Vimanas.Core;
using Vimanas.Core.Movement;
using Xunit;

namespace Vimanas.Core.Tests.Movement;

public class MovementSystemTests
{
    [Fact]
    public void ClampToBounds_WithinBounds_ReturnsSame()
    {
        var bounds = new Bounds2(0, 0, 10, 10);
        var pos = new Vector2(5, 5);
        var result = MovementSystem.ClampToBounds(pos, bounds);
        Assert.Equal(pos, result);
    }

    [Fact]
    public void ClampToBounds_OutsideMax_ClampsToMax()
    {
        var bounds = new Bounds2(0, 0, 10, 10);
        var pos = new Vector2(15, 15);
        var result = MovementSystem.ClampToBounds(pos, bounds);
        Assert.Equal(new Vector2(10, 10), result);
    }

    [Fact]
    public void ClampToBounds_OutsideMin_ClampsToMin()
    {
        var bounds = new Bounds2(0, 0, 10, 10);
        var pos = new Vector2(-5, -5);
        var result = MovementSystem.ClampToBounds(pos, bounds);
        Assert.Equal(new Vector2(0, 0), result);
    }

    [Fact]
    public void DefaultPlayArea_MatchesPlayerShipController()
    {
        var bounds = Bounds2.DefaultPlayArea;
        // PlayerShipController: Bounds(center zero, size 18, 10, 0) → min -9,-5 max 9,5
        Assert.Equal(-9f, bounds.Min.X);
        Assert.Equal(-5f, bounds.Min.Y);
        Assert.Equal(9f, bounds.Max.X);
        Assert.Equal(5f, bounds.Max.Y);
    }
}
