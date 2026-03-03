using System.Collections.Generic;
using UnityEngine;
using Vimanas.Gameplay.Projectiles;

namespace Vimanas.Core
{
    /// <summary>
    /// Object pool for projectiles. Zero allocations during combat.
    /// </summary>
    public class ProjectilePool : MonoBehaviour
    {
        [SerializeField] private Projectile _prefab;
        [SerializeField] private int _initialSize = 50;

        private readonly Queue<Projectile> _available = new Queue<Projectile>();
        private Transform _container;

        private void Awake()
        {
            if (_prefab == null)
            {
                Debug.LogWarning("[ProjectilePool] Prefab not assigned; pool disabled. Fire will not work until prefab is set.");
                enabled = false;
                return;
            }
            _container = new GameObject("ProjectilePool").transform;
            _container.SetParent(transform);

            for (int i = 0; i < _initialSize; i++)
            {
                var p = CreateNew();
                p.gameObject.SetActive(false);
                _available.Enqueue(p);
            }
        }

        private Projectile CreateNew()
        {
            var p = Instantiate(_prefab, _container);
            var pooled = p.gameObject.AddComponent<PooledProjectile>();
            pooled.Pool = this;
            pooled.Projectile = p;
            return p;
        }

        public Projectile Get()
        {
            if (_prefab == null || !enabled) return null;
            Projectile p;
            if (_available.Count > 0)
            {
                p = _available.Dequeue();
                p.gameObject.SetActive(true);
            }
            else
            {
                p = CreateNew();
            }
            return p;
        }

        public void Return(Projectile p)
        {
            if (p == null) return;
            p.gameObject.SetActive(false);
            p.transform.SetParent(_container);
            _available.Enqueue(p);
        }
    }

    /// <summary>
    /// Attached to pooled projectiles. Holds pool reference for Projectile to use.
    /// </summary>
    public class PooledProjectile : MonoBehaviour
    {
        public ProjectilePool Pool { get; set; }
        public Projectile Projectile { get; set; }
    }
}
