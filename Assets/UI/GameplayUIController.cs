using UnityEngine;
using UnityEngine.UI;
using UnityEngine.InputSystem.UI;
using Vimanas.Core;

namespace Vimanas.UI
{
    /// <summary>
    /// macOS workaround: Renders play area and ship as UI when SpriteRenderer/2D world
    /// does not render in standalone builds. Canvas uses same pipeline as MainMenu.
    /// See unity_learnings.md.
    /// </summary>
    public class GameplayUIController : MonoBehaviour
    {
        [SerializeField] private float _moveSpeed = 400f;
        [SerializeField] private Vector2 _playAreaSize = new Vector2(1600, 900);

        private RectTransform _shipRect;
        private RectTransform _muzzleFlashRect;
        private InputService _input;
        private Vector2 _shipPosition;
        private float _muzzleFlashEndTime;
        private float _lastMuzzleFlashTime;

        private void Awake()
        {
            _input = FindObjectOfType<InputService>();
            try
            {
                CreateGameplayUI();
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"[GameplayUIController] CreateGameplayUI failed: {ex.Message}\n{ex.StackTrace}");
            }
        }

        private void CreateGameplayUI()
        {
            var canvasObj = new GameObject("GameplayCanvas");
            var canvas = canvasObj.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1920, 1080);
            scaler.referencePixelsPerUnit = 100f;

            canvasObj.AddComponent<GraphicRaycaster>();

            // Background: warm brown full screen (art_style_guide)
            var bgObj = new GameObject("PlayAreaBackground");
            bgObj.transform.SetParent(canvasObj.transform, false);

            var bgRect = bgObj.AddComponent<RectTransform>();
            bgRect.anchorMin = Vector2.zero;
            bgRect.anchorMax = Vector2.one;
            bgRect.offsetMin = Vector2.zero;
            bgRect.offsetMax = Vector2.zero;

            var bgImage = bgObj.AddComponent<Image>();
            bgImage.color = new Color(0.28f, 0.22f, 0.14f, 1f);

            // Ship: cyan rectangle (Sparrow canonical color)
            var shipObj = new GameObject("ShipUI");
            shipObj.transform.SetParent(canvasObj.transform, false);

            _shipRect = shipObj.AddComponent<RectTransform>();
            _shipRect.anchorMin = new Vector2(0.5f, 0.5f);
            _shipRect.anchorMax = new Vector2(0.5f, 0.5f);
            _shipRect.sizeDelta = new Vector2(40, 40);
            _shipRect.anchoredPosition = Vector2.zero;

            var shipImage = shipObj.AddComponent<Image>();
            shipImage.color = new Color(0f, 0.8f, 1f, 1f);

            // Muzzle flash: visible fire feedback when SpriteRenderer projectiles may not render (macOS)
            var flashObj = new GameObject("MuzzleFlash");
            flashObj.transform.SetParent(shipObj.transform, false);
            _muzzleFlashRect = flashObj.AddComponent<RectTransform>();
            _muzzleFlashRect.anchorMin = new Vector2(0.5f, 0.5f);
            _muzzleFlashRect.anchorMax = new Vector2(0.5f, 0.5f);
            _muzzleFlashRect.sizeDelta = new Vector2(12, 24);
            _muzzleFlashRect.anchoredPosition = new Vector2(0, 30);
            var flashImage = flashObj.AddComponent<Image>();
            flashImage.color = new Color(1f, 0.9f, 0.3f, 0.9f);
            flashObj.SetActive(false);

            _shipPosition = Vector2.zero;

            // EventSystem for Canvas. Use InputSystemUIInputModule (not StandaloneInputModule)
            // so Space/fire input reaches InputService; StandaloneInputModule can consume or conflict.
            if (FindObjectOfType<UnityEngine.EventSystems.EventSystem>() == null)
            {
                var eventSystemObj = new GameObject("EventSystem");
                eventSystemObj.AddComponent<UnityEngine.EventSystems.EventSystem>();
                eventSystemObj.AddComponent<InputSystemUIInputModule>();
            }
        }

        private void Update()
        {
            if (_shipRect == null || _input == null) return;

            var move = _input.Move;
            var delta = move * (_moveSpeed * Time.deltaTime);
            _shipPosition += delta;

            var half = _playAreaSize * 0.5f;
            _shipPosition.x = Mathf.Clamp(_shipPosition.x, -half.x, half.x);
            _shipPosition.y = Mathf.Clamp(_shipPosition.y, -half.y, half.y);

            _shipRect.anchoredPosition = _shipPosition;

            // Muzzle flash: show when Fire pressed (visible feedback on macOS when projectiles may not render)
            if (_input.FirePressed && _muzzleFlashRect != null && Time.time >= _lastMuzzleFlashTime + 0.1f)
            {
                _muzzleFlashRect.gameObject.SetActive(true);
                _muzzleFlashEndTime = Time.time + 0.08f;
                _lastMuzzleFlashTime = Time.time;
            }
            if (_muzzleFlashRect != null && _muzzleFlashRect.gameObject.activeSelf && Time.time >= _muzzleFlashEndTime)
            {
                _muzzleFlashRect.gameObject.SetActive(false);
            }
        }
    }
}
