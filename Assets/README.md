# Vimanas Unity Assets

Folder structure per [docs/tech_architecture.md](../docs/tech_architecture.md):

- **Core/** — game loop, services, save/load, event bus
- **Gameplay/Player/** — player ship logic
- **Gameplay/Enemies/** — enemy AI and behaviors
- **Gameplay/Weapons/** — weapon systems
- **Gameplay/Projectiles/** — projectile logic
- **Gameplay/Waves/** — wave composition and spawning
- **Content/** — ScriptableObjects for ships, weapons, enemies, levels
- **UI/** — UI components
- **Platform/Steam/** — Steamworks integration
- **Platform/Switch/** — Switch-specific (later, thin wrappers)

Create a Unity 6 project and place this structure under Assets/, or merge with an existing Unity project.
