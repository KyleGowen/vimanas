using UnityEngine;
using UnityEngine.InputSystem;

namespace Vimanas.Core
{
    /// <summary>
    /// Provides input for movement and fire. Uses Unity Input System.
    /// </summary>
    public class InputService : MonoBehaviour
    {
        [SerializeField] private InputActionAsset _inputActions;

        private InputAction _moveAction;
        private InputAction _fireAction;

        public Vector2 Move => _moveAction?.ReadValue<Vector2>() ?? Vector2.zero;
        public bool FirePressed => _fireAction?.IsPressed() ?? false;

        private void Awake()
        {
            if (_inputActions == null)
            {
                _inputActions = Resources.Load<InputActionAsset>("VimanasInputActions");
            }
            if (_inputActions == null)
            {
                Debug.LogError("InputService: InputActionAsset not assigned and not found in Resources.");
                return;
            }

            var gameplayMap = _inputActions.FindActionMap("Gameplay");
            _moveAction = gameplayMap?.FindAction("Move");
            _fireAction = gameplayMap?.FindAction("Fire");

            if (_moveAction != null && _fireAction != null)
            {
                gameplayMap.Enable();
            }
        }

        private void OnDestroy()
        {
            _inputActions?.FindActionMap("Gameplay")?.Disable();
        }
    }
}
