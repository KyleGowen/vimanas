using UnityEngine;
using Vimanas.Core;

namespace Vimanas.Gameplay.Player
{
    /// <summary>
    /// Controls player ship movement and firing. Top-down, clamped to play area.
    /// </summary>
    [RequireComponent(typeof(Rigidbody2D))]
    [RequireComponent(typeof(Collider2D))]
    public class PlayerShipController : MonoBehaviour
    {
        [SerializeField] private float _moveSpeed = 5f;
        [SerializeField] private InputService _inputService;
        [SerializeField] private Bounds _playArea = new Bounds(Vector3.zero, new Vector3(18, 10, 0));

        private Rigidbody2D _rb;
        private InputService _input;

        private void Awake()
        {
            _rb = GetComponent<Rigidbody2D>();
            _rb.gravityScale = 0;
            _rb.constraints = RigidbodyConstraints2D.FreezeRotation;
            _rb.collisionDetectionMode = CollisionDetectionMode2D.Continuous;

            _input = _inputService != null ? _inputService : FindObjectOfType<InputService>();
        }

        private void FixedUpdate()
        {
            if (_input == null) return;

            var move = _input.Move;
            var velocity = new Vector2(move.x, move.y) * _moveSpeed;
            _rb.linearVelocity = velocity;

            var pos = transform.position;
            pos.x = Mathf.Clamp(pos.x, _playArea.min.x, _playArea.max.x);
            pos.y = Mathf.Clamp(pos.y, _playArea.min.y, _playArea.max.y);
            transform.position = pos;
        }
    }
}
