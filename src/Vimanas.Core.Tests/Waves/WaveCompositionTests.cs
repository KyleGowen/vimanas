using System.Numerics;
using Vimanas.Core.Waves;
using Xunit;

namespace Vimanas.Core.Tests.Waves;

public class WaveCompositionTests
{
    [Fact]
    public void GetSpawnPositions_ReturnsCorrectCount()
    {
        var positions = WaveComposition.GetSpawnPositions(Vector2.Zero, 6);
        Assert.Equal(6, positions.Count);
    }

    [Fact]
    public void GetSpawnPositions_CenteredOnGivenPoint()
    {
        var center = new Vector2(10, 5);
        var positions = WaveComposition.GetSpawnPositions(center, 6);
        var avgX = positions.Average(p => p.X);
        var avgY = positions.Average(p => p.Y);
        // V-formation spreads within spawnRadius of center
        Assert.InRange(avgX, 6f, 14f);
        Assert.InRange(avgY, 1f, 9f);
    }
}
