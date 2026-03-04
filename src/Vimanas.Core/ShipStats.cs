namespace Vimanas.Core;

/// <summary>
/// Ship stats used for combat and movement. Attack drives weapon strength (weaponStrength = Attack × 0.25).
/// Pure C# POCO—no Unity references.
/// </summary>
public record ShipStats(
    int Attack = 20,
    int Hp = 14,
    int Defense = 12,
    int Mana = 19,
    int Speed = 35)
{
    /// <summary>Weapon strength per basic_gun_design_lock: Attack × 0.25</summary>
    public float WeaponStrength => Attack * 0.25f;
}
