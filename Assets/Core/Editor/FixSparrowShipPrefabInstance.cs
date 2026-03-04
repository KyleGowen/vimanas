using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using Vimanas.Core;
using Vimanas.Gameplay.Player;
using Vimanas.Gameplay.Weapons;
using Vimanas.UI;

namespace Vimanas.Core.Editor
{
    /// <summary>
    /// One-time fix: Replace standalone SparrowShip in Gameplay scene with prefab instance.
    /// Resolves type mismatch errors (BoxCollider2D/Animator) caused by scene/prefab drift.
    /// Run via menu: Tools > Fix SparrowShip Prefab Instance
    /// </summary>
    public static class FixSparrowShipPrefabInstance
    {
        private const string GameplayScenePath = "Assets/Scenes/Gameplay.unity";
        private const string SparrowShipPrefabPath = "Assets/Content/Prefabs/SparrowShip.prefab";

        [MenuItem("Tools/Fix SparrowShip Prefab Instance")]
        public static void Execute()
        {
            var scene = EditorSceneManager.OpenScene(GameplayScenePath);
            if (!scene.IsValid())
            {
                Debug.LogError("[FixSparrowShip] Failed to open Gameplay scene.");
                return;
            }

            var rootObjects = scene.GetRootGameObjects();
            GameObject oldSparrow = null;
            foreach (var go in rootObjects)
            {
                if (go.name == "SparrowShip")
                {
                    oldSparrow = go;
                    break;
                }
            }

            if (oldSparrow == null)
            {
                Debug.LogWarning("[FixSparrowShip] No SparrowShip found in scene. Nothing to fix.");
                return;
            }

            var prefab = AssetDatabase.LoadAssetAtPath<GameObject>(SparrowShipPrefabPath);
            if (prefab == null)
            {
                Debug.LogError("[FixSparrowShip] SparrowShip prefab not found.");
                return;
            }

            var inputService = Object.FindFirstObjectByType<InputService>();
            var projectilePool = Object.FindFirstObjectByType<ProjectilePool>();
            var gameplayUI = Object.FindFirstObjectByType<GameplayUIController>();

            var oldTransform = oldSparrow.transform;
            var position = oldTransform.position;
            var parent = oldTransform.parent;

            Object.DestroyImmediate(oldSparrow);

            var instance = (GameObject)PrefabUtility.InstantiatePrefab(prefab);
            instance.name = "SparrowShip";
            instance.transform.SetParent(parent);
            instance.transform.position = position;

            var playerController = instance.GetComponent<PlayerShipController>();
            var playerWeapon = instance.GetComponent<PlayerWeapon>();

            if (playerController != null && inputService != null)
            {
                var so = new SerializedObject(playerController);
                so.FindProperty("_inputService").objectReferenceValue = inputService;
                so.ApplyModifiedPropertiesWithoutUndo();
            }

            if (playerWeapon != null && projectilePool != null)
            {
                var so = new SerializedObject(playerWeapon);
                so.FindProperty("_projectilePool").objectReferenceValue = projectilePool;
                so.ApplyModifiedPropertiesWithoutUndo();
            }

            if (gameplayUI != null)
            {
                var so = new SerializedObject(gameplayUI);
                so.FindProperty("_shipToMirror").objectReferenceValue = instance.transform;
                so.ApplyModifiedPropertiesWithoutUndo();
            }

            EditorSceneManager.MarkSceneDirty(scene);
            Debug.Log("[FixSparrowShip] Replaced standalone SparrowShip with prefab instance. Position, InputService, ProjectilePool, _shipToMirror preserved.");
        }
    }
}
