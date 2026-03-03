using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace Vimanas.UI
{
    /// <summary>
    /// Main menu controller. Provides New Game button that loads Gameplay scene.
    /// Uses build index (not scene name) per unity_learnings.md for standalone build reliability.
    /// </summary>
    public class MainMenuController : MonoBehaviour
    {
        [SerializeField] private int _gameplayBuildIndex = 2;

        private void Awake()
        {
            try
            {
                CreateMenuUI();
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"[MainMenuController] CreateMenuUI failed: {ex.Message}\n{ex.StackTrace}");
            }
        }

        private void CreateMenuUI()
        {
            var canvasObj = new GameObject("Canvas");
            var canvas = canvasObj.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1920, 1080);
            scaler.referencePixelsPerUnit = 100f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var buttonObj = new GameObject("NewGameButton");
            buttonObj.transform.SetParent(canvasObj.transform, false);

            var rectTransform = buttonObj.AddComponent<RectTransform>();
            rectTransform.anchorMin = new Vector2(0.5f, 0.5f);
            rectTransform.anchorMax = new Vector2(0.5f, 0.5f);
            rectTransform.sizeDelta = new Vector2(200, 50);
            rectTransform.anchoredPosition = Vector2.zero;

            var image = buttonObj.AddComponent<Image>();
            image.color = new Color(0.2f, 0.4f, 0.8f);

            var button = buttonObj.AddComponent<Button>();
            button.onClick.AddListener(OnNewGameClicked);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(buttonObj.transform, false);

            var textRect = textObj.AddComponent<RectTransform>();
            textRect.anchorMin = Vector2.zero;
            textRect.anchorMax = Vector2.one;
            textRect.offsetMin = Vector2.zero;
            textRect.offsetMax = Vector2.zero;

            var text = textObj.AddComponent<Text>();
            text.text = "New Game";
            var font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf") ?? Resources.GetBuiltinResource<Font>("Arial");
            if (font != null) text.font = font;
            text.fontSize = 24;
            text.alignment = TextAnchor.MiddleCenter;
            text.color = Color.white;

            var eventSystemObj = new GameObject("EventSystem");
            eventSystemObj.AddComponent<UnityEngine.EventSystems.EventSystem>();
            eventSystemObj.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
        }

        private void OnNewGameClicked()
        {
            SceneManager.LoadScene(_gameplayBuildIndex);
        }
    }
}
