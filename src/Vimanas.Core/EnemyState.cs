using System.Numerics;

namespace Vimanas.Core;

/// <summary>
/// State of an enemy. Pure C#—no Unity.
/// </summary>
public class EnemyState
{
    public int Id { get; }
    public Vector2 Position { get; set; }
    public float Speed { get; }
    public float MaxHp { get; }
    public float Defense { get; }
    public float CurrentHp { get; set; }

    public EnemyState(int id, Vector2 position, float speed, float maxHp, float defense)
    {
        Id = id;
        Position = position;
        Speed = speed;
        MaxHp = maxHp;
        Defense = defense;
        CurrentHp = maxHp;
    }

    public bool IsAlive => CurrentHp > 0;
}
