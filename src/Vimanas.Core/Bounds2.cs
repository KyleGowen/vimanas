using System.Numerics;

namespace Vimanas.Core;

/// <summary>
/// 2D axis-aligned bounds. Min/max in world units.
/// </summary>
public readonly struct Bounds2
{
    public Vector2 Min { get; }
    public Vector2 Max { get; }

    public Bounds2(Vector2 center, Vector2 size)
    {
        var half = size * 0.5f;
        Min = center - half;
        Max = center + half;
    }

    public Bounds2(float minX, float minY, float maxX, float maxY)
    {
        Min = new Vector2(minX, minY);
        Max = new Vector2(maxX, maxY);
    }

    /// <summary>Default play area: 18×10 centered at origin (from PlayerShipController)</summary>
    public static Bounds2 DefaultPlayArea => new(Vector2.Zero, new Vector2(18, 10));
}
