#if UNITY_EDITOR
namespace Vimanas.Editor
{
    /// <summary>
    /// Documents script execution order for projectile mirror (Milestone 2.3).
    /// PlayerWeapon must fire before GameplayUIController mirrors projectiles.
    /// Order is set via [DefaultExecutionOrder] attribute on the scripts:
    /// - PlayerWeapon: -100
    /// - GameplayUIController: 0
    /// No manual Project Settings step required; attributes are sufficient.
    /// Manual override (if needed): Edit > Project Settings > Script Execution Order.
    /// </summary>
    public static class DefaultExecutionOrder
    {
    }
}
#endif
