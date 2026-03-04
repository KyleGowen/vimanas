using System.Collections.Generic;
using System.Numerics;

namespace Vimanas.Core;

/// <summary>
/// Full game state. Pure C#—no Unity. Core owns all state.
/// </summary>
public class GameState
{
    public Bounds2 PlayArea { get; set; }
    public PlayerShipState? Player { get; set; }
    public IReadOnlyList<ProjectileState> Projectiles => _projectiles;
    public IReadOnlyList<EnemyState> Enemies => _enemies;

    private readonly List<ProjectileState> _projectiles = new();
    private readonly List<EnemyState> _enemies = new();

    internal List<ProjectileState> ProjectilesMutable => _projectiles;
    internal List<EnemyState> EnemiesMutable => _enemies;
}
