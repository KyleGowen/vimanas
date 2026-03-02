using UnityEngine;
using UnityEngine.SceneManagement;

namespace Vimanas.Core
{
    /// <summary>
    /// Boot scene loader. Initializes minimal services and transitions to MainMenu.
    /// </summary>
    public class BootLoader : MonoBehaviour
    {
        [SerializeField] private float _delayBeforeTransition = 1.5f;
        [SerializeField] private string _mainMenuSceneName = "MainMenu";

        private float _elapsed;

        private void Update()
        {
            _elapsed += Time.deltaTime;
            if (_elapsed >= _delayBeforeTransition)
            {
                SceneManager.LoadScene(_mainMenuSceneName);
            }
        }
    }
}
