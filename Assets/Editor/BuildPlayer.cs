#if UNITY_EDITOR
using UnityEditor;
using UnityEditor.Build.Reporting;

namespace Vimanas.Editor
{
    /// <summary>
    /// Batchmode build entry point. Run: Unity -quit -batchmode -projectPath . -buildTarget StandaloneOSX -executeMethod Vimanas.Editor.BuildPlayer.BuildMac
    /// </summary>
    public static class BuildPlayer
    {
        public static void BuildMac()
        {
            var options = new BuildPlayerOptions
            {
                scenes = new[] { "Assets/Scenes/Boot.unity", "Assets/Scenes/MainMenu.unity", "Assets/Scenes/Gameplay.unity" },
                locationPathName = "Builds/Vimanas.app",
                target = BuildTarget.StandaloneOSX,
                options = BuildOptions.None
            };
            var report = BuildPipeline.BuildPlayer(options);
            if (report.summary.result == BuildResult.Succeeded)
                UnityEngine.Debug.Log($"[Build] Succeeded: {report.summary.totalSize} bytes");
            else
                UnityEngine.Debug.LogError($"[Build] Failed: {report.summary.result}");
        }
    }
}
#endif
