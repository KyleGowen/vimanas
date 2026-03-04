using System.Numerics;
using Vimanas.Core;

namespace Vimanas.Core.Movement;

/// <summary>
/// Movement logic. Clamp position to bounds. Pure C#—no Unity.
/// </summary>
public static class MovementSystem
{
    /// <summary>
    /// Clamp position to play area bounds.
    /// </summary>
    public static Vector2 ClampToBounds(Vector2 position, Bounds2 bounds)
    {
        var x = Math.Clamp(position.X, bounds.Min.X, bounds.Max.X);
        var y = Math.Clamp(position.Y, bounds.Min.Y, bounds.Max.Y);
        return new Vector2(x, y);
    }

    /// <summary>
    /// Apply velocity for one frame and clamp to bounds.
    /// </summary>
    public static Vector2 MoveAndClamp(Vector2 position, Vector2 velocity, float deltaTime, Bounds2 bounds)
    {
        var next = position + velocity * deltaTime;
        return ClampToBounds(next, bounds);
    }
}
