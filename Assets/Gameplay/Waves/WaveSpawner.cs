using System.Collections;
using UnityEngine;
using Vimanas.Gameplay.Enemies;

namespace Vimanas.Gameplay.Waves
{
    /// <summary>
    /// Spawns a wave of Scouts in V-formation. Fires wave complete when all destroyed.
    /// </summary>
    public class WaveSpawner : MonoBehaviour
    {
        [SerializeField] private ScoutEnemy _scoutPrefab;
        [SerializeField] private int _scoutCount = 6;
        [SerializeField] private float _spawnRadius = 4f;
        [SerializeField] private float _spawnDelay = 0.2f;

        public event System.Action OnWaveComplete;

        private int _aliveCount;

        private void Start()
        {
            if (_scoutPrefab == null)
            {
                Debug.LogWarning("[WaveSpawner] Scout prefab not assigned; wave spawning disabled.");
                return;
            }
            SpawnWave();
        }

        public void SpawnWave()
        {
            if (_scoutPrefab == null) return;
            StartCoroutine(SpawnWaveCoroutine());
        }

        private IEnumerator SpawnWaveCoroutine()
        {
            _aliveCount = 0;
            var center = transform.position;

            for (int i = 0; i < _scoutCount; i++)
            {
                var angle = (i - _scoutCount / 2f) * 25f * Mathf.Deg2Rad;
                var offset = new Vector2(Mathf.Sin(angle) * _spawnRadius, Mathf.Cos(angle) * _spawnRadius);
                var pos = center + (Vector3)offset;

                var scout = Instantiate(_scoutPrefab, pos, Quaternion.identity);
                scout.transform.SetParent(transform);

                var damageable = scout.GetComponent<Damageable>();
                if (damageable != null)
                {
                    _aliveCount++;
                    StartCoroutine(TrackEnemy(damageable));
                }

                yield return new WaitForSeconds(_spawnDelay);
            }
        }

        private IEnumerator TrackEnemy(Damageable d)
        {
            while (d != null && d.IsAlive)
            {
                yield return null;
            }
            _aliveCount--;
            if (_aliveCount <= 0)
            {
                OnWaveComplete?.Invoke();
            }
        }
    }
}
