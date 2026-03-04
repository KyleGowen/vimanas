using Vimanas.Core.Abstractions;

namespace Vimanas.Core.Tests.Abstractions;

public class MockTimeProvider : ITimeProvider
{
    public float Time { get; set; }
    public float DeltaTime { get; set; }

    public void Advance(float dt)
    {
        Time += dt;
        DeltaTime = dt;
    }
}
