using UnityEngine;
using UnityEngine.SceneManagement;

namespace Vimanas.Core
{
    /// <summary>
    /// Boot scene loader. Transitions to MainMenu after a brief delay.
    /// Uses build index (not scene name) for reliable loading in standalone builds.
    /// </summary>
    public class BootLoader : MonoBehaviour
    {
        [SerializeField] private float _delayBeforeTransition = 1.5f;
        [SerializeField] private int _mainMenuBuildIndex = 1;

        private float _elapsed;

        private void Update()
        {
            _elapsed += Time.deltaTime;
            if (_elapsed >= _delayBeforeTransition)
            {
                Debug.Log($"[BootLoader] Transitioning to MainMenu (build index {_mainMenuBuildIndex})");
                SceneManager.LoadScene(_mainMenuBuildIndex);
            }
        }
    }
}
