namespace Vimanas.Core.Combat;

/// <summary>
/// Combat formulas per basic_gun_design_lock.
/// actualDamage = Max(0.1, weaponStrength / targetDefense)
/// </summary>
public static class CombatMath
{
    /// <summary>
    /// Apply damage to a target. actualDamage = Max(0.1, weaponStrength / targetDefense).
    /// </summary>
    /// <param name="weaponStrength">From ship Attack × 0.25</param>
    /// <param name="targetDefense">Target's defense stat</param>
    /// <returns>Actual damage dealt (minimum 0.1)</returns>
    public static float ApplyDamage(float weaponStrength, float targetDefense)
    {
        if (targetDefense <= 0) return weaponStrength;
        return Math.Max(0.1f, weaponStrength / targetDefense);
    }

    /// <summary>
    /// Compute weapon strength from ship Attack stat. weaponStrength = Attack × 0.25
    /// </summary>
    public static float WeaponStrength(int attack) => attack * 0.25f;
}
