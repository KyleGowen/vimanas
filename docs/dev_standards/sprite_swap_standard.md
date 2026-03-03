# Sprite Swap Standard

**Status:** Draft (design only—implementation delegated separately)  
**Canon references:** [tech_architecture.md](../tech_architecture.md), [design_system.md](../design_system.md), [art_style_guide.md](../art_style_guide.md)

## Purpose

Enable artists and designers to swap sprites for on-screen objects (ships, enemies, projectiles, powerups, etc.) **without touching code or prefab internals**. ScriptableObjects are the source of truth; prefabs reference them. Runtime swapping (ship variants, damage states) is supported.

---

## Core Pattern

```
ScriptableObject (sprite reference)  →  SpriteApplier component  →  SpriteRenderer
```

1. **ScriptableObject** holds the sprite reference(s) in `Assets/Content/`.
2. **SpriteApplier** component on the prefab reads from the ScriptableObject and applies to a `SpriteRenderer` at runtime (or in editor via `[ExecuteAlways]`).
3. **Prefab** has a `SpriteRenderer` but no hardcoded `m_Sprite`; the SpriteApplier populates it from the ScriptableObject.

**Design principle:** Artists change the ScriptableObject asset; the prefab and code stay untouched.

---

## ScriptableObject Schema

### Base: `SpriteAppearanceData`

A minimal ScriptableObject that holds one or more sprite references. Used for all sprite-based objects.

```csharp
// Conceptual schema—not implemented yet
[CreateAssetMenu(fileName = "NewSpriteAppearance", menuName = "Vimanas/Sprite Appearance")]
public class SpriteAppearanceData : ScriptableObject
{
    [SerializeField] private Sprite _defaultSprite;           // Primary sprite
    [SerializeField] private Sprite[] _variantSprites;        // Optional: ship variants, etc.
    [SerializeField] private Sprite _damagedSprite;           // Optional: damage state
    [SerializeField] private Color _tint = Color.white;       // Optional: per-asset tint override

    public Sprite DefaultSprite => _defaultSprite;
    public Sprite GetVariant(int index) => _variantSprites != null && index < _variantSprites.Length ? _variantSprites[index] : _defaultSprite;
    public Sprite DamagedSprite => _damagedSprite != null ? _damagedSprite : _defaultSprite;
    public Color Tint => _tint;
}
```

- **`_defaultSprite`** — Required. The main sprite for the object.
- **`_variantSprites`** — Optional. For runtime swapping (e.g., ship skins, alternate looks).
- **`_damagedSprite`** — Optional. For damage-state visuals (enemies, ships).
- **`_tint`** — Optional. Per-asset color override (e.g., propulsion glow per ship per [art_style_guide](../art_style_guide.md#ship-propulsion-glow-colors-canonical)).

### Domain-Specific ScriptableObjects

Higher-level content ScriptableObjects (ShipData, EnemyArchetypeData, WeaponData, etc.) can **embed** or **reference** `SpriteAppearanceData`:

- **ShipData** — References `SpriteAppearanceData` for hull; may add thruster/engine sprites.
- **EnemyArchetypeData** — References `SpriteAppearanceData` for body; optional damaged sprite.
- **WeaponData** — References `SpriteAppearanceData` for projectile sprite.
- **PowerupData** — References `SpriteAppearanceData` for pickup icon.

This keeps a single pattern: **sprite references live in ScriptableObjects**, not in prefabs.

---

## SpriteApplier Component

A lightweight component that reads from a ScriptableObject and applies the sprite to a `SpriteRenderer`.

```csharp
// Conceptual—not implemented yet
[RequireComponent(typeof(SpriteRenderer))]
public class SpriteApplier : MonoBehaviour
{
    [SerializeField] private SpriteAppearanceData _appearance;
    [SerializeField] private SpriteRenderer _targetRenderer;  // Optional; defaults to GetComponent

    private void Awake()
    {
        if (_targetRenderer == null) _targetRenderer = GetComponent<SpriteRenderer>();
        Apply(_appearance?.DefaultSprite, _appearance?.Tint ?? Color.white);
    }

    public void Apply(Sprite sprite, Color? tint = null)
    {
        if (_targetRenderer == null) return;
        if (sprite != null) _targetRenderer.sprite = sprite;
        if (tint.HasValue) _targetRenderer.color = tint.Value;
    }

    public void ApplyVariant(int index)
    {
        if (_appearance != null) Apply(_appearance.GetVariant(index));
    }

    public void ApplyDamaged()
    {
        if (_appearance != null) Apply(_appearance.DamagedSprite);
    }
}
```

- **Awake** — Applies default sprite and tint so the object looks correct on spawn.
- **Apply / ApplyVariant / ApplyDamaged** — Public API for runtime swapping (ship variants, damage states).
- **`_targetRenderer`** — Optional; if null, uses `GetComponent<SpriteRenderer>()` on the same GameObject.

---

## Naming Conventions

### Sprite Assets (raw textures)

| Object Type | Folder | Naming | Example |
|-------------|--------|--------|---------|
| Player ship | `Content/Sprites/Ships/` | `{ShipName}_{variant?}.png` | `Sparrow_Default.png`, `Sparrow_Damaged.png` |
| Enemy | `Content/Sprites/Enemies/` | `{EnemyType}_{variant?}.png` | `Scout_Default.png`, `Scout_Damaged.png` |
| Projectile | `Content/Sprites/Projectiles/` | `{WeaponOrSource}_{type}.png` | `PlayerBullet.png`, `EnemyPlasma.png` |
| Powerup | `Content/Sprites/Powerups/` | `{PowerupName}.png` | `HealthPickup.png`, `ManaPickup.png` |
| VFX / misc | `Content/Sprites/VFX/` | `{EffectName}.png` | `Explosion_Small.png` |

### ScriptableObjects (SpriteAppearanceData)

| Object Type | Folder | Naming | Example |
|-------------|--------|--------|---------|
| Ship | `Content/Ships/` | `{ShipName}Appearance.asset` | `SparrowAppearance.asset` |
| Enemy | `Content/Enemies/` | `{EnemyType}Appearance.asset` | `ScoutAppearance.asset` |
| Projectile | `Content/Weapons/` or `Content/Projectiles/` | `{Source}ProjectileAppearance.asset` | `PlayerProjectileAppearance.asset` |
| Powerup | `Content/Powerups/` | `{PowerupName}Appearance.asset` | `HealthPickupAppearance.asset` |

---

## Folder Structure

```
Assets/
  Content/
    Sprites/
      Ships/           # Raw ship sprites
      Enemies/         # Raw enemy sprites
      Projectiles/     # Raw projectile sprites
      Powerups/        # Raw powerup sprites
      VFX/             # Explosions, hit effects, etc.
    Ships/             # ShipData, SpriteAppearanceData for ships
    Enemies/           # EnemyArchetypeData, SpriteAppearanceData for enemies
    Weapons/           # WeaponData, projectile SpriteAppearanceData
    Powerups/          # PowerupData, SpriteAppearanceData for powerups
    Prefabs/           # Prefabs (reference ScriptableObjects, not raw sprites)
  Gameplay/
    Player/
    Enemies/
    Weapons/
    Projectiles/
    ...
```

Prefabs in `Content/Prefabs/` reference ScriptableObjects (e.g., `SparrowAppearance.asset`). They do **not** hardcode `m_Sprite` GUIDs in the SpriteRenderer.

---

## Workflow: Adding or Swapping Sprites

### Adding a new sprite-based object

1. **Create the sprite** — Place in `Content/Sprites/{Type}/` with the naming convention.
2. **Create SpriteAppearanceData** — Right-click in `Content/{Type}/` → Create → Vimanas → Sprite Appearance. Assign the sprite(s).
3. **Create or update prefab** — Add `SpriteApplier` component; assign the SpriteAppearanceData. Leave SpriteRenderer's sprite slot empty (SpriteApplier will fill it at runtime).
4. **Wire domain logic** — If the object uses a domain ScriptableObject (ShipData, etc.), reference the SpriteAppearanceData there too.

### Swapping art for an existing object

1. **Replace the sprite asset** — Overwrite or add a new sprite in `Content/Sprites/{Type}/`.
2. **Update SpriteAppearanceData** — Open the asset; change the sprite reference to the new sprite. Save.
3. **Done** — No prefab edits, no code changes. Next play/build uses the new art.

### Runtime swapping (ship variants, damage states)

- **Ship variants:** Call `SpriteApplier.ApplyVariant(index)` when the player selects a skin or the game applies a variant.
- **Damage states:** Call `SpriteApplier.ApplyDamaged()` when HP drops below a threshold (e.g., from `Damageable` or ship controller).
- **Projectiles:** Usually no runtime swap; the correct SpriteAppearanceData is chosen when spawning (from WeaponData).

---

## Object Coverage

| Object Type | ScriptableObject | SpriteApplier | Notes |
|-------------|------------------|---------------|-------|
| Player ships | ShipData → SpriteAppearanceData | On ship prefab | Variants for skins; damaged sprite optional |
| Enemies | EnemyArchetypeData → SpriteAppearanceData | On enemy prefab | Damaged sprite for feedback |
| Player projectiles | WeaponData → SpriteAppearanceData | On projectile prefab | One sprite per weapon |
| Enemy projectiles | EnemyArchetypeData or WeaponData | On projectile prefab | Per-enemy or per-weapon |
| Powerups | PowerupData → SpriteAppearanceData | On powerup prefab | Single sprite |
| VFX / explosions | Optional SpriteAppearanceData | On VFX prefab | Or use Animation/Animator for sequences |

---

## Code Examples

### Prefab setup (conceptual)

```
SparrowShip (Prefab)
├── Transform
├── SpriteRenderer        ← sprite = (empty; SpriteApplier fills it)
├── CircleCollider2D
├── Rigidbody2D
├── SpriteApplier         ← appearance = SparrowAppearance.asset
└── PlayerShipController
```

### Applying at spawn (pooled projectile)

```csharp
// When spawning from pool, apply weapon's sprite
var applier = projectile.GetComponent<SpriteApplier>();
if (applier != null && _weaponData?.ProjectileAppearance != null)
    applier.Apply(_weaponData.ProjectileAppearance.DefaultSprite);
```

### Damage state (enemy)

```csharp
// In Damageable or ScoutEnemy, when HP drops below threshold
var applier = GetComponent<SpriteApplier>();
if (applier != null && _damageable.CurrentHp < _damageable.MaxHp * 0.5f)
    applier.ApplyDamaged();
```

---

## Checklist for New Sprite-Based Objects

- [ ] Sprite asset created in `Content/Sprites/{Type}/` with correct naming
- [ ] `SpriteAppearanceData` ScriptableObject created in `Content/{Type}/`
- [ ] SpriteAppearanceData references the sprite (and variants/damaged if needed)
- [ ] Prefab has `SpriteApplier` component with SpriteAppearanceData assigned
- [ ] Prefab's SpriteRenderer has no hardcoded sprite (or SpriteApplier overwrites it)
- [ ] If domain ScriptableObject exists (ShipData, etc.), it references the SpriteAppearanceData
- [ ] Runtime swapping (if any) uses `Apply`, `ApplyVariant`, or `ApplyDamaged` as appropriate

---

## Migration from Current State

The current prefabs (SparrowShip, Projectile, ScoutEnemy, EnemyProjectile) have `m_Sprite` hardcoded. Migration steps:

1. Create `SpriteAppearanceData` assets for each (SparrowAppearance, PlayerProjectileAppearance, ScoutAppearance, EnemyProjectileAppearance).
2. Assign the existing placeholder sprites to those assets.
3. Add `SpriteApplier` to each prefab; assign the corresponding SpriteAppearanceData.
4. Clear or leave `m_Sprite` on SpriteRenderer (SpriteApplier will override at runtime).
5. Remove hardcoded GUIDs once SpriteApplier is verified.

---

## Still true?

- [ ] Review after implementation; adjust if pooling or Addressables change sprite loading
- [ ] Confirm with art pipeline (sprite atlases, import settings) when asset workflow is finalized
