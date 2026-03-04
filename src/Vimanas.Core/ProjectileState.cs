using System.Numerics;

namespace Vimanas.Core;

/// <summary>
/// State of a projectile. Pure C#—no Unity.
/// </summary>
public class ProjectileState
{
    public int Id { get; }
    public Vector2 Position { get; set; }
    public Vector2 Direction { get; set; }
    public float Speed { get; }
    public float Damage { get; }
    public float SpawnTime { get; }
    public float Lifetime { get; }
    public bool IsPlayer { get; }

    public ProjectileState(
        int id,
        Vector2 position,
        Vector2 direction,
        float speed,
        float damage,
        float spawnTime,
        float lifetime,
        bool isPlayer = true)
    {
        Id = id;
        Position = position;
        Direction = direction;
        Speed = speed;
        Damage = damage;
        SpawnTime = spawnTime;
        Lifetime = lifetime;
        IsPlayer = isPlayer;
    }

    public bool IsExpired(float currentTime) => currentTime - SpawnTime > Lifetime;
}
