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

## allowDirtyBuild

GameCI refuses to build when the working tree has uncommitted changes ("Branch is dirty"). With Git LFS (LFS replaces pointers with actual files on checkout) and Unity (modifies ProjectSettings, .meta, etc. during build), the tree appears dirty. The workflow uses `allowDirtyBuild: true` to allow builds in this case.

---

## CI Verification (CEO directive)

When pushing code for macOS-specific build checks: **use the GitHub MCP to monitor the build and ensure it passes before saying a change is ready.** Do not report "ready" until the workflow run has succeeded. Tools: `get_pull_request_status`, `list_commits` + Actions run status, or equivalent.

---

## Still true?

- [ ] Revisit if GameCI or Unity licensing changes
