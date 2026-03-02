using UnityEngine;
using Vimanas.Gameplay.Enemies;

namespace Vimanas.Gameplay.Projectiles
{
    /// <summary>
    /// Projectile fired by enemies. Damages player on contact.
    /// </summary>
    [RequireComponent(typeof(Collider2D))]
    public class EnemyProjectile : MonoBehaviour
    {
        [SerializeField] private float _speed = 6f;
        [SerializeField] private float _damage = 5f;
        [SerializeField] private float _lifetime = 5f;

        private Vector2 _direction;
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
                Destroy(gameObject);
            }
        }

        private void OnTriggerEnter2D(Collider2D other)
        {
            if (other.CompareTag("Player"))
            {
                var damageable = other.GetComponent<IDamageable>();
                if (damageable != null && damageable.IsAlive)
                {
                    damageable.TakeDamage(_damage);
                }
                Destroy(gameObject);
            }
        }
    }
}
