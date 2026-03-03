using UnityEngine;
using Vimanas.Core;

namespace Vimanas.Gameplay.Player
{
    /// <summary>
    /// Swaps Sparrow ship sprite based on input: firing > boost (forward) > idle/brake.
    /// Ship always faces north; uses sparrow_facing_n for idle, sparrow_boost for forward, sparrow_firing when firing.
    /// </summary>
    [RequireComponent(typeof(SpriteRenderer))]
    public class SparrowSpriteController : MonoBehaviour
    {
        [SerializeField] private Sprite _idleSprite;
        [SerializeField] private Sprite _boostSprite;
        [SerializeField] private Sprite _firingSprite;
        [SerializeField] private InputService _inputService;

        private SpriteRenderer _spriteRenderer;
        private InputService _input;

        private void Awake()
        {
            _spriteRenderer = GetComponent<SpriteRenderer>();
            _input = _inputService != null ? _inputService : FindObjectOfType<InputService>();

            // Resources fallback: serialized refs can be lost on reimport/script recompile
            if (_idleSprite == null)
            {
                _idleSprite = Resources.Load<Sprite>("Sprites/Sparrow/sparrow_facing_n");
                if (_idleSprite != null) Debug.LogWarning("[SparrowSpriteController] _idleSprite was null; using Resources fallback.");
            }
            if (_boostSprite == null) _boostSprite = Resources.Load<Sprite>("Sprites/Sparrow/sparrow_boost");
            if (_firingSprite == null) _firingSprite = Resources.Load<Sprite>("Sprites/Sparrow/sparrow_firing");
        }

        private void Update()
        {
            if (_spriteRenderer == null || _input == null) return;

            var move = _input.Move;
            var firePressed = _input.FirePressed;

            Sprite targetSprite;
            if (firePressed && _firingSprite != null)
            {
                targetSprite = _firingSprite;
            }
            else if (move.y > 0.1f && _boostSprite != null)
            {
                targetSprite = _boostSprite;
            }
            else
            {
                targetSprite = _idleSprite;
            }

            if (targetSprite != null && _spriteRenderer.sprite != targetSprite)
            {
                _spriteRenderer.sprite = targetSprite;
            }
        }
    }
}
