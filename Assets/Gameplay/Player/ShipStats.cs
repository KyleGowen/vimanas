using UnityEngine;

namespace Vimanas.Gameplay.Player
{
    /// <summary>
    /// Ship stats used for combat and movement. Attack drives weapon strength (weaponStrength = Attack × 0.25).
    /// </summary>
    public class ShipStats : MonoBehaviour
    {
        [SerializeField] private int _attack = 20;
        [SerializeField] private int _hp = 14;
        [SerializeField] private int _defense = 12;
        [SerializeField] private int _mana = 19;
        [SerializeField] private int _speed = 35;

        public int Attack => _attack;
        public int Hp => _hp;
        public int Defense => _defense;
        public int Mana => _mana;
        public int Speed => _speed;
    }
}
