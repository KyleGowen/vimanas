# Level Theme Taxonomy — Context for Code

**Phase 8 · 8.A.3**

Expandable context file for theme taxonomy and implementation. When adding themes or changing asset paths, update the files listed here. See [level_theme_taxonomy.md](../concepts/level_theme_taxonomy.md) for the full spec.

---

## Design → Code Mapping

| Concept | Code File | What to Update |
|---------|-----------|----------------|
| **ThemeId** | `src/levels/level-spec.ts` | `ThemeId` type |
| **Theme → layers** | `src/levels/theme-layers.ts` | `getLayerConfigsForTheme(themeId)` switch cases |
| **Validation** | `src/levels/level-loader.ts` | `isThemeId()` |
| **Parallax** | `src/parallax/parallax-controller.ts` | `setTheme()`; theme ID from GameplayScene |

---

## File Reference

| File | Purpose |
|------|---------|
| `docs/concepts/level_theme_taxonomy.md` | Theme registry; parallax paths; palette per theme |
| `docs/concepts/p8_mocks/8_a3_themes/theme_samples_deliverable.md` | Visual Design samples per theme |
| `src/levels/theme-layers.ts` | Theme ID → parallax layer configs |
| `src/levels/level-spec.ts` | `ThemeId` type |
| `public/images/level1/`, `level2/`, `level3/`, `level4/` | Parallax assets per theme |

---

## Extending: Add New Theme

1. `docs/concepts/level_theme_taxonomy.md` — Add to §1 registry, §2 layer config
2. `docs/schemas/level-spec.schema.json` — Add to `theme.enum`
3. `src/levels/level-spec.ts` — Add to `ThemeId`
4. `src/levels/level-loader.ts` — Add to `isThemeId()`
5. `src/levels/theme-layers.ts` — Add case to `getLayerConfigsForTheme()`
6. `public/images/level{N}/` — Add parallax_far/mid/near.png
7. Visual Design — Add sample to p8_mocks/8_a3_themes/

---

## Still true?

- Update this file when adding theme-related code
- P8 theme samples in docs/concepts/p8_mocks/8_a3_themes/
