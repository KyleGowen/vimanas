# Platform Learnings

**Status:** Active  
**Audience:** Platform/Release, DevOps  
**Source:** CI.1 implementation (2025-03-04)

---

## GitHub Actions — Required Secrets

The `.github/workflows/build.yml` workflow builds the Unity project for macOS (StandaloneOSX) using GameCI `unity-builder@v4`. Configure one of the two license options:

### Personal license (one-time activation)

1. [Acquire and activate](https://game.ci/docs/github/activation) your Unity Personal license file.
2. Add these GitHub Secrets (Settings → Secrets and variables → Actions):

| Secret         | Description                                      |
|----------------|--------------------------------------------------|
| `UNITY_LICENSE` | Contents of the activated `Unity_v*.ulf` file   |
| `UNITY_EMAIL`   | Email for your Unity account                     |
| `UNITY_PASSWORD`| Password for your Unity account                  |

**Note:** Avoid special characters in `UNITY_PASSWORD`; use mixed-case alphanumeric only if activation fails.

### Professional license

Add these GitHub Secrets:

| Secret          | Description                    |
|-----------------|--------------------------------|
| `UNITY_SERIAL`  | Serial provided by Unity       |
| `UNITY_EMAIL`   | Email for your Unity account   |
| `UNITY_PASSWORD`| Password for your Unity account|

---

## Build Failure Logs

On build failure, the full Unity log (including CS#### errors, file, and line) appears in the workflow run output. Open the failed job in GitHub Actions and expand the **Build** step to view the complete log.

---

## Still true?

- [ ] Revisit if GameCI or Unity licensing changes
