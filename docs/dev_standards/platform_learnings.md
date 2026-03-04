# Platform Learnings

**Status:** Active  
**Audience:** Platform/Release, DevOps  
**Source:** CI.1 implementation (2025-03-04)

---

## GitHub Actions — Required Secrets

The `.github/workflows/build.yml` workflow builds the Unity project for Linux (StandaloneLinux64) using GameCI `unity-builder@v4`. Both Personal and Professional use `UNITY_SERIAL` + `UNITY_EMAIL` + `UNITY_PASSWORD`.

### Personal license (extract serial from .ulf)

**Unity no longer supports manual activation of Personal licenses** (license.unity3d.com). Use serial extraction from your Unity Hub–activated `.ulf`:

1. Activate in Unity Hub locally (Preferences → Licenses → Add → Get a free personal license).
2. Extract the serial:
   ```bash
   grep DeveloperData /Library/Application\ Support/Unity/Unity_lic.ulf | sed -E 's/.*Value="([^"]+)".*/\1/' | base64 -d
   ```
3. Add these GitHub Secrets:

| Secret          | Description                                      |
|-----------------|--------------------------------------------------|
| `UNITY_SERIAL`  | Output from step 2 (e.g. XX-XXXX-XXXX-XXXX-XXXX-XXXX) |
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

## License activation failure

If the build fails with "There was an error while trying to activate the Unity license", troubleshoot as follows.

### Personal license

1. **Primary path:** Extract serial from your `.ulf` (see Required Secrets above). Ensure `UNITY_SERIAL`, `UNITY_EMAIL`, and `UNITY_PASSWORD` are set.
2. **Legacy (UNITY_LICENSE):** If you have an existing `.ulf` from before the change, you can still use `UNITY_LICENSE` (raw content) or `UNITY_LICENSE_BASE64`. The build workflow supports both. Prefer serial extraction for Personal.

### Professional license

Verify `UNITY_SERIAL` format: `XX-XXXX-XXXX-XXXX-XXXX-XXXX` (exactly six groups). Typos or extra spaces will cause activation to fail.

### Deprecated

- **Request Unity License workflow** and **license.unity3d.com**: Unity no longer supports manual activation of Personal licenses. See [Unity Discussions](https://discussions.unity.com/t/unity-no-longer-supports-manual-activation-of-personal-licenses/926760).

### Further help

- [GameCI activation](https://game.ci/docs/github/activation)
- [GameCI common issues](https://game.ci/docs/troubleshooting/common-issues)

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
