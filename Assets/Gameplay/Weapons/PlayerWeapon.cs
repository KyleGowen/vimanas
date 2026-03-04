using UnityEngine;
using Vimanas.Core;
using Vimanas.Gameplay.Player;
using Vimanas.Gameplay.Projectiles;

namespace Vimanas.Gameplay.Weapons
{
    /// <summary>
    /// Fires projectiles on fire input. Uses pool when available.
    /// </summary>
    public class PlayerWeapon : MonoBehaviour
    {
        [SerializeField] private Projectile _projectilePrefab;
        [SerializeField] private ProjectilePool _projectilePool;
        [SerializeField] private InputService _inputService;
        [SerializeField] private float _fireRate = 0.15f;
        [SerializeField] private Vector2 _fireOffset = new Vector2(0, 0.1f);

        private InputService _input;
        private float _nextFireTime;

        private void Awake()
        {
            _input = _inputService != null ? _inputService : FindFirstObjectByType<InputService>();
            if (_projectilePool == null) _projectilePool = FindFirstObjectByType<ProjectilePool>();
        }

        private void Update()
        {
            if (_input == null) return;
            if (_projectilePool == null && _projectilePrefab == null) return;
            if (!_input.FirePressed) return;
            if (Time.time < _nextFireTime) return;

            _nextFireTime = Time.time + _fireRate;
            Fire();
        }

        private void Fire()
        {
            var pos = (Vector2)transform.position + _fireOffset;
            var rot = transform.rotation;
            Projectile projectile = null;
            if (_projectilePool != null)
                projectile = _projectilePool.Get();
            if (projectile == null && _projectilePrefab != null)
                projectile = Object.Instantiate(_projectilePrefab, pos, rot);
            if (projectile == null) return;
            projectile.transform.SetPositionAndRotation(pos, rot);
            projectile.SetDirection(transform.up);

            var shipStats = GetComponent<ShipStats>();
            if (shipStats != null)
            {
                float weaponStrength = shipStats.Attack * 0.25f;
                projectile.SetDamage(weaponStrength);
            }
            // If ShipStats absent, projectile keeps _damage fallback (5f)
        }
    }
}
