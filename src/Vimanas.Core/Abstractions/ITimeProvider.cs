namespace Vimanas.Core.Abstractions;

/// <summary>
/// Provides time for the game loop. Abstraction over Unity Time or mock.
/// </summary>
public interface ITimeProvider
{
    /// <summary>Time in seconds since game start</summary>
    float Time { get; }

    /// <summary>Delta time since last frame</summary>
    float DeltaTime { get; }
}
