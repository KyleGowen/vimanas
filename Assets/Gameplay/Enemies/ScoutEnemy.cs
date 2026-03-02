using UnityEngine;
using Vimanas.Gameplay.Projectiles;

namespace Vimanas.Gameplay.Enemies
{
    /// <summary>
    /// Scout enemy - small, moves toward player, fires at player. Takes damage from player projectiles.
    /// </summary>
    [RequireComponent(typeof(Damageable))]
    [RequireComponent(typeof(Collider2D))]
    public class ScoutEnemy : MonoBehaviour
    {
        [SerializeField] private float _moveSpeed = 2f;
        [SerializeField] private string _playerTag = "Player";
        [SerializeField] private EnemyProjectile _projectilePrefab;
        [SerializeField] private float _fireRate = 1.5f;
        [SerializeField] private float _fireRange = 8f;

        private Transform _player;
        private Damageable _damageable;
        private float _nextFireTime;

        private void Awake()
        {
            _damageable = GetComponent<Damageable>();
        }

        private void Start()
        {
            var playerObj = GameObject.FindWithTag(_playerTag);
            _player = playerObj != null ? playerObj.transform : null;
        }

        private void Update()
        {
            if (_player != null)
            {
                var dir = (_player.position - transform.position).normalized;
                transform.position += (Vector3)((Vector2)dir * _moveSpeed * Time.deltaTime);

                var dist = Vector2.Distance(transform.position, _player.position);
                if (_projectilePrefab != null && dist < _fireRange && Time.time >= _nextFireTime)
                {
                    _nextFireTime = Time.time + _fireRate;
                    var proj = Instantiate(_projectilePrefab, transform.position, Quaternion.identity);
                    proj.SetDirection((Vector2)(_player.position - transform.position));
                }
            }
        }

        private void OnTriggerEnter2D(Collider2D other)
        {
            var projectile = other.GetComponent<Projectile>();
            if (projectile != null && _damageable != null)
            {
                _damageable.TakeDamage(projectile.Damage);
                var pooled = projectile.GetComponent<Core.PooledProjectile>();
                if (pooled?.Pool != null)
                    pooled.Pool.Return(projectile);
                else
                    Destroy(projectile.gameObject);
            }
        }
    }
}
