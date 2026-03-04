using System.Numerics;

namespace Vimanas.Core.Abstractions;

/// <summary>
/// Provides input for movement and fire. Abstraction over Unity Input System or mock.
/// </summary>
public interface IInputProvider
{
    /// <summary>Movement direction (-1 to 1 on each axis)</summary>
    Vector2 Move { get; }

    /// <summary>True when fire button is pressed</summary>
    bool FirePressed { get; }
}
