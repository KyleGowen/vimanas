using UnityEditor;
using UnityEngine;

namespace Vimanas.Core.Editor
{
    /// <summary>
    /// Placeholder for Input System setup. In Unity 6, Active Input Handling is set via
    /// Edit > Project Settings > Player > Other Settings > Active Input Handling.
    /// Ensure "Input System Package (New)" or "Both" is selected.
    /// </summary>
    [InitializeOnLoad]
    public static class InputSystemSetup
    {
        static InputSystemSetup()
        {
            // PlayerSettings.activeInputHandler was removed in Unity 6.
            // Configure via Edit > Project Settings > Player if needed.
        }
    }
}
