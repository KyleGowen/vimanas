using System.Numerics;
using Vimanas.Core.Abstractions;
using Vimanas.Core.Combat;
using Vimanas.Core.Movement;
using Vimanas.Core.Waves;

namespace Vimanas.Core;

/// <summary>
/// Main game loop. Updates game state from input and time. Pure C#—no Unity.
/// </summary>
public class GameLoop
{
    private readonly GameState _state;
    private readonly IInputProvider _input;
    private readonly ITimeProvider _time;
    private readonly IRenderBridge? _render;

    // Weapon constants per basic_gun_design_lock
    private const float FireRate = 0.15f;
    private const float ProjectileSpeed = 12f;
    private const float ProjectileLifetime = 3f;

    private float _nextFireTime;
    private int _nextProjectileId;
    private int _nextEnemyId;

    public GameLoop(GameState state, IInputProvider input, ITimeProvider time, IRenderBridge? render = null)
    {
        _state = state;
        _input = input;
        _time = time;
        _render = render;
    }

    public GameState State => _state;

    /// <summary>
    /// Run one frame. Call each tick (e.g. FixedUpdate).
    /// </summary>
    public void Update()
    {
        var dt = _time.DeltaTime;
        var now = _time.Time;

        UpdatePlayer(now, dt);
        UpdateProjectiles(now, dt);
        UpdateEnemies(now, dt);
        ResolveCollisions(now);

        _render?.SyncFromState(_state);
    }

    private void UpdatePlayer(float now, float dt)
    {
        var player = _state.Player;
        if (player == null || !player.IsAlive) return;

        var move = _input.Move;
        var speedScale = player.Stats.Speed / 35f; // Sparrow Speed 35 = baseline
        var moveSpeed = 5f * speedScale;
        var velocity = move * moveSpeed;

        player.Position = MovementSystem.MoveAndClamp(player.Position, velocity, dt, _state.PlayArea);
        player.Facing = move.LengthSquared() > 0.0001f ? Vector2.Normalize(move) : player.Facing;

        if (_input.FirePressed && now >= _nextFireTime)
        {
            _nextFireTime = now + FireRate;
            var weaponStrength = CombatMath.WeaponStrength(player.Stats.Attack);
            var pos = player.Position + player.Facing * 0.1f;
            var proj = new ProjectileState(
                _nextProjectileId++,
                pos,
                player.Facing,
                ProjectileSpeed,
                weaponStrength,
                now,
                ProjectileLifetime,
                isPlayer: true);
            _state.ProjectilesMutable.Add(proj);
        }
    }

    private void UpdateProjectiles(float now, float dt)
    {
        for (var i = _state.ProjectilesMutable.Count - 1; i >= 0; i--)
        {
            var p = _state.ProjectilesMutable[i];
            if (p.IsExpired(now))
            {
                _state.ProjectilesMutable.RemoveAt(i);
                continue;
            }
            p.Position += p.Direction * p.Speed * dt;
        }
    }

    private void UpdateEnemies(float now, float dt)
    {
        var player = _state.Player;
        if (player == null || !player.IsAlive) return;

        foreach (var enemy in _state.EnemiesMutable)
        {
            if (!enemy.IsAlive) continue;
            var dir = Vector2.Normalize(player.Position - enemy.Position);
            enemy.Position += dir * enemy.Speed * dt;
        }
    }

    private void ResolveCollisions(float now)
    {
        var player = _state.Player;
        if (player == null) return;

        foreach (var proj in _state.ProjectilesMutable)
        {
            if (!proj.IsPlayer) continue; // player projectiles only for now

            foreach (var enemy in _state.EnemiesMutable)
            {
                if (!enemy.IsAlive) continue;
                if (!AabbOverlap(proj.Position, 0.2f, enemy.Position, 0.8f)) continue;

                var damage = CombatMath.ApplyDamage(proj.Damage, enemy.Defense);
                enemy.CurrentHp -= damage;

                proj.Position = new Vector2(float.MaxValue, float.MaxValue); // mark for removal
                break;
            }
        }

        _state.ProjectilesMutable.RemoveAll(p => p.Position.X > 1e6);
    }

    private static bool AabbOverlap(Vector2 aPos, float aRadius, Vector2 bPos, float bRadius)
    {
        var dx = Math.Abs(aPos.X - bPos.X);
        var dy = Math.Abs(aPos.Y - bPos.Y);
        return dx < aRadius + bRadius && dy < aRadius + bRadius;
    }

    /// <summary>
    /// Spawn a wave of enemies at center. Returns count spawned.
    /// </summary>
    public int SpawnWave(Vector2 center, int count = 6, float scoutHp = 10f, float scoutDefense = 1f, float scoutSpeed = 2f)
    {
        var positions = WaveComposition.GetSpawnPositions(center, count);
        foreach (var pos in positions)
        {
            _state.EnemiesMutable.Add(new EnemyState(_nextEnemyId++, pos, scoutSpeed, scoutHp, scoutDefense));
        }
        return count;
    }

    /// <summary>
    /// Initialize player ship. Call before first Update.
    /// </summary>
    public void InitPlayer(ShipStats stats, Vector2 startPosition)
    {
        _state.Player = new PlayerShipState(0, startPosition, stats);
        _state.PlayArea = Bounds2.DefaultPlayArea;
    }
}
