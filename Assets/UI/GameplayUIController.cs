using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.InputSystem.UI;
using Vimanas.Core;
using Vimanas.Gameplay.Player;
using Vimanas.Gameplay.Projectiles;

namespace Vimanas.UI
{
    /// <summary>
    /// macOS workaround: Mirrors SparrowShip and player projectiles as UI when SpriteRenderer/2D world
    /// does not render in standalone builds. Single source of truth: SparrowShip and Projectile.
    /// See unity_learnings.md.
    /// </summary>
    [DefaultExecutionOrder(0)]
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

        // Projectile mirror (macOS: SpriteRenderer projectiles may not render)
        [SerializeField] private bool _debugProjectileMirror;
        private Sprite _laserSprite;
        private Sprite _fallbackWhiteSprite; // Image with null sprite does not render; need sprite for solid color
        private readonly Dictionary<Projectile, (RectTransform rect, Image image)> _projectileToUI = new Dictionary<Projectile, (RectTransform, Image)>();
        private readonly Queue<(RectTransform rect, Image image)> _projectileUIPool = new Queue<(RectTransform, Image)>();
        private Transform _projectilesContainer;
        private bool _hasLoggedProjectileCount;
        private int _frameCount;

        private void Awake()
        {
            _input = FindFirstObjectByType<InputService>();
            _mainCam = Camera.main;

            if (_shipToMirror == null)
            {
                var player = FindFirstObjectByType<PlayerShipController>();
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
            canvas.sortingOrder = 100;

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
            var fallbackSprite = Resources.Load<Sprite>("Sprites/Ships/sparrow_facing_n");
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

            // Projectile mirror container (macOS: SpriteRenderer projectiles may not render)
            var containerObj = new GameObject("ProjectileMirrors");
            containerObj.transform.SetParent(canvasObj.transform, false);
            var containerRect = containerObj.AddComponent<RectTransform>();
            containerRect.anchorMin = Vector2.zero;
            containerRect.anchorMax = Vector2.one;
            containerRect.offsetMin = Vector2.zero;
            containerRect.offsetMax = Vector2.zero;
            _projectilesContainer = containerObj.transform;
            _projectilesContainer.SetAsLastSibling(); // Ensure projectile mirrors draw on top
            _laserSprite = Resources.Load<Sprite>("Sprites/Projectiles/sparrow_laser_beam");
            if (_laserSprite == null)
                Debug.LogWarning("[GameplayUIController] Laser sprite not found at Sprites/Projectiles/sparrow_laser_beam. Using solid cyan fallback.");
            if (_debugProjectileMirror && (Application.isEditor || Debug.isDebugBuild))
                Debug.Log($"[GameplayUIController] Awake: _laserSprite={(_laserSprite != null ? "loaded" : "NULL")}");
            // Unity UI Image with sprite=null does not render. Create 1x1 white sprite for solid-color fallback.
            var tex = Texture2D.whiteTexture;
            if (tex != null)
                _fallbackWhiteSprite = Sprite.Create(tex, new Rect(0, 0, 1, 1), new Vector2(0.5f, 0.5f));

            // EventSystem for Canvas. Use InputSystemUIInputModule (not StandaloneInputModule)
            // so Space/fire input reaches InputService; StandaloneInputModule can consume or conflict.
            if (FindFirstObjectByType<UnityEngine.EventSystems.EventSystem>() == null)
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
                var fallback = Resources.Load<Sprite>("Sprites/Ships/sparrow_facing_n");
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

            // Retry laser sprite load if null (e.g. Resources not ready at Awake)
            if (_laserSprite == null)
                _laserSprite = Resources.Load<Sprite>("Sprites/Projectiles/sparrow_laser_beam");
            if (_fallbackWhiteSprite == null && Texture2D.whiteTexture != null)
                _fallbackWhiteSprite = Sprite.Create(Texture2D.whiteTexture, new Rect(0, 0, 1, 1), new Vector2(0.5f, 0.5f));

            // Mirror projectiles to UI (macOS: SpriteRenderer may not render). Run even if _laserSprite null (solid cyan fallback).
            if (_shipToMirror != null && _canvasRect != null && _mainCam != null && _projectilesContainer != null)
            {
                UpdateProjectileMirrors();
            }
            // Ensure projectile mirrors draw on top every frame when projectiles exist
            if (_projectilesContainer != null && _projectileToUI.Count > 0)
                _projectilesContainer.SetAsLastSibling();
        }

        private void LateUpdate()
        {
            _frameCount++;
            if (_frameCount <= 5 && _laserSprite == null)
                _laserSprite = Resources.Load<Sprite>("Sprites/Projectiles/sparrow_laser_beam");
        }

        private void UpdateProjectileMirrors()
        {
            var allProjectiles = Object.FindObjectsByType<Projectile>(FindObjectsSortMode.None);
            // Only mirror active projectiles (exclude pooled/inactive)
            var activeList = new List<Projectile>();
            foreach (var p in allProjectiles)
            {
                if (p != null && p.gameObject.activeInHierarchy)
                    activeList.Add(p);
            }
            var projectiles = activeList;
            var activeSet = new HashSet<Projectile>(projectiles);

            if (_debugProjectileMirror && projectiles.Count > 0 && !_hasLoggedProjectileCount && (Application.isEditor || Debug.isDebugBuild))
            {
                Debug.Log($"[GameplayUIController] Projectile mirror: {projectiles.Count} active projectiles, laserSprite={_laserSprite != null}");
                _hasLoggedProjectileCount = true;
                try
                {
                    var path = System.IO.Path.Combine(Application.persistentDataPath, "projectile_mirror_log.txt");
                    System.IO.File.WriteAllText(path, $"{System.DateTime.UtcNow:u} projectiles={projectiles.Count} laserSprite={_laserSprite != null}\n");
                }
                catch { /* ignore */ }
            }

            // Return despawned projectiles' UI to pool
            var toRemove = new List<Projectile>();
            foreach (var kv in _projectileToUI)
            {
                if (kv.Key == null || !activeSet.Contains(kv.Key))
                {
                    toRemove.Add(kv.Key);
                    kv.Value.rect.gameObject.SetActive(false);
                    _projectileUIPool.Enqueue(kv.Value);
                }
            }
            foreach (var p in toRemove)
                _projectileToUI.Remove(p);

            // Update or create UI for each active projectile
            foreach (var p in projectiles)
            {
                if (p == null) continue;

                if (!_projectileToUI.TryGetValue(p, out var ui))
                {
                    ui = GetOrCreateProjectileUI();
                    _projectileToUI[p] = ui;
                }

                ui.rect.gameObject.SetActive(true);
                ui.image.sprite = _laserSprite != null ? _laserSprite : _fallbackWhiteSprite; // Image needs sprite to render
                ui.image.color = new Color(0f, 1f, 1f, 1f);
                ui.image.preserveAspect = false; // stretch beam to sizeDelta

                var worldPos = p.transform.position;
                var screenPos = _mainCam.WorldToScreenPoint(worldPos);
                if (RectTransformUtility.ScreenPointToLocalPointInRectangle(
                    _canvasRect, screenPos, null, out var localPos))
                {
                    ui.rect.anchoredPosition = localPos;
                }
                ui.rect.localEulerAngles = new Vector3(0, 0, p.transform.eulerAngles.z);
            }
        }

        private (RectTransform rect, Image image) GetOrCreateProjectileUI()
        {
            if (_projectileUIPool.Count > 0)
            {
                var ui = _projectileUIPool.Dequeue();
                return ui;
            }

            var obj = new GameObject("ProjectileMirror");
            obj.transform.SetParent(_projectilesContainer, false);

            var rect = obj.AddComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.sizeDelta = new Vector2(48, 120);
            rect.anchoredPosition = Vector2.zero;

            var image = obj.AddComponent<Image>();
            image.sprite = _laserSprite != null ? _laserSprite : _fallbackWhiteSprite; // Image needs sprite to render
            image.color = new Color(0f, 1f, 1f, 1f);
            image.preserveAspect = false; // stretch beam to sizeDelta
            image.raycastTarget = false;

            return (rect, image);
        }
    }
}
