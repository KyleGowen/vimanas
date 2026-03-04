using System.Numerics;
using Vimanas.Core.Abstractions;

namespace Vimanas.Core.Tests.Abstractions;

public class MockInputProvider : IInputProvider
{
    public Vector2 Move { get; set; }
    public bool FirePressed { get; set; }
}
