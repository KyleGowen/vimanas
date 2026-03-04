using System.Numerics;
using Vimanas.Core.Abstractions;

namespace Vimanas.Core.Simulator;

/// <summary>
/// Simple input for simulator: hold fire, move up. Deterministic for testing.
/// </summary>
public class SimulatorInput : IInputProvider
{
    public Vector2 Move { get; set; } = new(0, 1);
    public bool FirePressed { get; set; } = true;
}
