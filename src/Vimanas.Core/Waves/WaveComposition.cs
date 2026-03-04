using System.Collections.Generic;
using System.Numerics;

namespace Vimanas.Core.Waves;

/// <summary>
/// Wave spawn positions. V-formation per WaveSpawner. Pure C#—no Unity.
/// </summary>
public static class WaveComposition
{
    /// <summary>
    /// Get spawn positions for a V-formation. angle = (i - count/2) * 25° per WaveSpawner.
    /// </summary>
    /// <param name="center">Center of formation</param>
    /// <param name="count">Number of units</param>
    /// <param name="spawnRadius">Radius from center</param>
    public static IReadOnlyList<Vector2> GetSpawnPositions(Vector2 center, int count, float spawnRadius = 4f)
    {
        var positions = new List<Vector2>(count);
        for (var i = 0; i < count; i++)
        {
            var angle = (i - count / 2f) * 25f * (float)(Math.PI / 180);
            var offset = new Vector2((float)Math.Sin(angle) * spawnRadius, (float)Math.Cos(angle) * spawnRadius);
            positions.Add(center + offset);
        }
        return positions;
    }
}
