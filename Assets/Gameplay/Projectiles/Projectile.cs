using UnityEngine;
using Vimanas.Core;

namespace Vimanas.Gameplay.Projectiles
{
    /// <summary>
    /// Simple projectile that moves in a direction and despawns off-screen.
    /// Uses pool if available, otherwise destroys.
    /// </summary>
    public class Projectile : MonoBehaviour
    {
        [SerializeField] private float _speed = 12f;
        [SerializeField] private float _lifetime = 3f;
        [SerializeField] private float _damage = 5f;

        private Vector2 _direction;

        public float Damage => _damage;
        private float _spawnTime;

        public void SetDirection(Vector2 direction)
        {
            _direction = direction.normalized;
        }

        private void OnEnable()
        {
            _spawnTime = Time.time;
        }

        private void Update()
        {
            transform.position += (Vector3)(_direction * _speed * Time.deltaTime);

            if (Time.time - _spawnTime > _lifetime)
            {
                Despawn();
            }
        }

        private void OnBecameInvisible()
        {
            Despawn();
        }

        private void Despawn()
        {
            var pooled = GetComponent<PooledProjectile>();
            if (pooled?.Pool != null)
            {
                pooled.Pool.Return(this);
            }
            else
            {
                Object.Destroy(gameObject);
            }
        }
    }
}
