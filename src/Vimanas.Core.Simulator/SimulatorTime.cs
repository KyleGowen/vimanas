using Vimanas.Core.Abstractions;

namespace Vimanas.Core.Simulator;

/// <summary>
/// Time provider for simulator. Advances each tick.
/// </summary>
public class SimulatorTime : ITimeProvider
{
    public float Time { get; private set; }
    public float DeltaTime { get; }

    public SimulatorTime(float deltaTime = 0.016f)
    {
        DeltaTime = deltaTime;
    }

    public void Advance()
    {
        Time += DeltaTime;
    }
}
