using UnityEngine;

namespace Vimanas.Gameplay.Enemies
{
    /// <summary>
    /// Interface for objects that can take damage. HP lost = weapon strength / defense.
    /// </summary>
    public interface IDamageable
    {
        void TakeDamage(float damage);
        bool IsAlive { get; }
    }

    /// <summary>
    /// Base component for damageable entities with HP and defense.
    /// </summary>
    public class Damageable : MonoBehaviour, IDamageable
    {
        [SerializeField] private float _maxHp = 10f;
        [SerializeField] private float _defense = 1f;

        private float _currentHp;

        public bool IsAlive => _currentHp > 0;
        public float MaxHp => _maxHp;
        public float CurrentHp => _currentHp;

        private void Awake()
        {
            _currentHp = _maxHp;
        }

        public void TakeDamage(float damage)
        {
            if (!IsAlive) return;
            var actualDamage = Mathf.Max(0.1f, damage / _defense);
            _currentHp -= actualDamage;
            if (!IsAlive)
            {
                OnDeath();
            }
        }

        protected virtual void OnDeath()
        {
            Destroy(gameObject);
        }
    }
}
