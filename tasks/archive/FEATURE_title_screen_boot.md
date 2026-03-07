# FEATURE: Title Screen as Boot Screen

## Goal

Replace the current boot screen (plain text "VIMANAS" / "Loading...") with the approved title screen mock (`title_screen_mock_sparrow.png`).

## Status

Done

## Scope

- Boot scene displays the title screen mock image (replaces MainMenu)
- Image scaled to fit canvas (letterbox/pillarbox per aspect ratio)
- Transition to Gameplay: Enter, Space, Start button, or click anywhere
- Asset in `public/images/` for Vite serving

## Reference

- **Mock:** [docs/concepts/p0_mocks/p0_5_title_screen/title_screen_mock_sparrow.png](../docs/concepts/p0_mocks/p0_5_title_screen/title_screen_mock_sparrow.png) — CEO approved 2025-03-02
- **Deliverable:** [title_screen_mocks_deliverable.md](../docs/concepts/p0_mocks/p0_5_title_screen/title_screen_mocks_deliverable.md)
- **Current Boot:** `src/scenes/boot-scene.ts`

## Gate

- `npm run dev` → Boot shows title mock; press Enter/Space/Start or click anywhere → Gameplay
- Tests updated/added for Boot scene
