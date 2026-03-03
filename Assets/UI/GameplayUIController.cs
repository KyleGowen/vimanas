using UnityEngine;
using UnityEngine.UI;
using UnityEngine.InputSystem.UI;
using Vimanas.Core;
using Vimanas.Gameplay.Player;

namespace Vimanas.UI
{
    /// <summary>
    /// macOS workaround: Mirrors SparrowShip as UI when SpriteRenderer/2D world
    /// does not render in standalone builds. Single source of truth: SparrowShip.
    /// See unity_learnings.md.
    /// </summary>
    public class GameplayUIController : MonoBehaviour
    {
        [SerializeField] private Transform _shipToMirror;

        private RectTransform _shipRect;
        private Image _shipImage;
        private RectTransform _muzzleFlashRect;
        private InputService _input;
        private SpriteRenderer _shipSpriteRenderer;
        private RectTransform _canvasRect;
        private Camera _mainCam;
        private float _muzzleFlashEndTime;
        private float _lastMuzzleFlashTime;

        private void Awake()
        {
            _input = FindObjectOfType<InputService>();
            _mainCam = Camera.main;

            if (_shipToMirror == null)
            {
                var player = FindObjectOfType<PlayerShipController>();
                _shipToMirror = player != null ? player.transform : null;
            }

            if (_shipToMirror != null)
                _shipSpriteRenderer = _shipToMirror.GetComponent<SpriteRenderer>();

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

            _canvasRect = canvasObj.GetComponent<RectTransform>();

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

            // Ship: mirrors SparrowShip sprite and position
            var shipObj = new GameObject("ShipUI");
            shipObj.transform.SetParent(canvasObj.transform, false);

            _shipRect = shipObj.AddComponent<RectTransform>();
            _shipRect.anchorMin = new Vector2(0.5f, 0.5f);
            _shipRect.anchorMax = new Vector2(0.5f, 0.5f);
            _shipRect.sizeDelta = new Vector2(80, 80);
            _shipRect.anchoredPosition = Vector2.zero;

            _shipImage = shipObj.AddComponent<Image>();
            _shipImage.color = Color.white;

            // Fallback sprite if SparrowShip not found yet
            var fallbackSprite = Resources.Load<Sprite>("Sprites/Sparrow/sparrow_facing_n");
            if (fallbackSprite != null)
                _shipImage.sprite = fallbackSprite;
            else
                _shipImage.color = new Color(0f, 0.8f, 1f, 1f);

            // Muzzle flash: visible fire feedback when SpriteRenderer projectiles may not render (macOS)
            var flashObj = new GameObject("MuzzleFlash");
            flashObj.transform.SetParent(shipObj.transform, false);
            _muzzleFlashRect = flashObj.AddComponent<RectTransform>();
            _muzzleFlashRect.anchorMin = new Vector2(0.5f, 0.5f);
            _muzzleFlashRect.anchorMax = new Vector2(0.5f, 0.5f);
            _muzzleFlashRect.sizeDelta = new Vector2(12, 24);
            _muzzleFlashRect.anchoredPosition = new Vector2(0, 50);
            var flashImage = flashObj.AddComponent<Image>();
            flashImage.color = new Color(1f, 0.9f, 0.3f, 0.9f);
            flashObj.SetActive(false);

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
            if (_shipRect == null || _shipImage == null) return;

            // Mirror sprite from SparrowShip (SparrowSpriteController drives it)
            if (_shipSpriteRenderer != null && _shipSpriteRenderer.sprite != null)
            {
                if (_shipImage.sprite != _shipSpriteRenderer.sprite)
                    _shipImage.sprite = _shipSpriteRenderer.sprite;
            }
            else
            {
                // Fallback: SparrowShip not found or SpriteRenderer has no sprite
                var fallback = Resources.Load<Sprite>("Sprites/Sparrow/sparrow_facing_n");
                if (fallback != null && _shipImage.sprite != fallback)
                    _shipImage.sprite = fallback;
            }

            // Mirror position from SparrowShip
            if (_shipToMirror != null && _mainCam != null && _canvasRect != null)
            {
                var worldPos = _shipToMirror.position;
                var screenPos = _mainCam.WorldToScreenPoint(worldPos);
                if (RectTransformUtility.ScreenPointToLocalPointInRectangle(
                    _canvasRect, screenPos, null, out var localPos))
                {
                    _shipRect.anchoredPosition = localPos;
                }
            }

            // Muzzle flash: show when Fire pressed (visible feedback on macOS when projectiles may not render)
            if (_input != null && _input.FirePressed && _muzzleFlashRect != null && Time.time >= _lastMuzzleFlashTime + 0.1f)
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
