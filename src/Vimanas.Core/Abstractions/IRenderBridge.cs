using Vimanas.Core;

namespace Vimanas.Core.Abstractions;

/// <summary>
/// Optional bridge for rendering. Core does not require it; Unity adapter can implement
/// to sync GameState to sprites/UI. Headless simulator uses no-op.
/// </summary>
public interface IRenderBridge
{
    /// <summary>Called after each game loop update. Adapter syncs GameState to view.</summary>
    void SyncFromState(GameState state);
}
