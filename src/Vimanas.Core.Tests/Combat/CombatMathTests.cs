using Vimanas.Core.Combat;
using Xunit;

namespace Vimanas.Core.Tests.Combat;

public class CombatMathTests
{
    [Fact]
    public void ApplyDamage_SparrowVsScout_Deals5Damage()
    {
        // Sparrow Attack 20 → weaponStrength 5; Scout Defense 1
        var weaponStrength = CombatMath.WeaponStrength(20);
        Assert.Equal(5f, weaponStrength);

        var actual = CombatMath.ApplyDamage(weaponStrength, 1f);
        Assert.Equal(5f, actual);
    }

    [Fact]
    public void ApplyDamage_MinimumDamage_Is01()
    {
        var actual = CombatMath.ApplyDamage(1f, 100f);
        Assert.Equal(0.1f, actual);
    }

    [Theory]
    [InlineData(20, 5f)]
    [InlineData(40, 10f)]
    [InlineData(0, 0f)]
    public void WeaponStrength_AttackTimes025(int attack, float expected)
    {
        Assert.Equal(expected, CombatMath.WeaponStrength(attack));
    }
}
