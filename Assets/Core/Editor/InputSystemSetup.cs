using UnityEditor;
using UnityEngine;

namespace Vimanas.Core.Editor
{
    /// <summary>
    /// Ensures the project uses the new Input System. Run once on load.
    /// </summary>
    [InitializeOnLoad]
    public static class InputSystemSetup
    {
        static InputSystemSetup()
        {
            // Set Active Input Handling to Input System Package (1) or Both (2)
            if (PlayerSettings.activeInputHandler != ActiveInputHandler.InputSystemPackage)
            {
                PlayerSettings.activeInputHandler = ActiveInputHandler.InputSystemPackage;
                Debug.Log("Vimanas: Set Active Input Handling to Input System Package. Restart Unity if prompted.");
            }
        }
    }
}
