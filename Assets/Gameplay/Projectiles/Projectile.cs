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
        private float? _runtimeDamage;

        /// <summary>Damage used for DealDamage. Set via SetDamage at fire time; otherwise uses serialized _damage (e.g. enemy projectiles).</summary>
        public float Damage => _runtimeDamage ?? _damage;

        /// <summary>Override damage at fire time. Call before first use. If not called, _damage fallback is used.</summary>
        public void SetDamage(float damage)
        {
            _runtimeDamage = damage;
        }
        private float _spawnTime;

        public void SetDirection(Vector2 direction)
        {
            _direction = direction.normalized;
            // Rotate beam sprite to face travel direction
            float angle = Mathf.Atan2(_direction.x, _direction.y) * Mathf.Rad2Deg;
            transform.eulerAngles = new Vector3(0, 0, angle);
        }

        private void OnEnable()
        {
            _spawnTime = Time.time;
            _runtimeDamage = null; // Reset so each spawn uses SetDamage or _damage fallback

            // Fallback: serialized sprite ref can be lost on build stripping (unity_learnings)
            var sr = GetComponent<SpriteRenderer>();
            if (sr != null && sr.sprite == null)
            {
                var fallback = Resources.Load<Sprite>("Sprites/Projectiles/sparrow_laser_beam");
                if (fallback != null)
                    sr.sprite = fallback;
            }
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
