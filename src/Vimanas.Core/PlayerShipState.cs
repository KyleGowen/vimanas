using System.Numerics;

namespace Vimanas.Core;

/// <summary>
/// State of the player ship. Pure C#—no Unity.
/// </summary>
public class PlayerShipState
{
    public int Id { get; }
    public Vector2 Position { get; set; }
    public Vector2 Facing { get; set; }
    public ShipStats Stats { get; }
    public float CurrentHp { get; set; }

    public PlayerShipState(int id, Vector2 position, ShipStats stats)
    {
        Id = id;
        Position = position;
        Facing = new Vector2(0, 1); // north
        Stats = stats;
        CurrentHp = stats.Hp;
    }

    public bool IsAlive => CurrentHp > 0;
}
