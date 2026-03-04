# Platform Learnings

**Status:** Active  
**Audience:** Platform/Release, DevOps  
**Source:** CI.1 implementation (2025-03-04)

---

## GitHub Actions — Required Secrets

The `.github/workflows/build.yml` workflow builds the Unity project for Linux (StandaloneLinux64) using GameCI `unity-builder@v4`. Personal license works; macOS build requires Professional license (request-activation-file does not support darwin). Configure one of the two license options:

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

## License activation failure

If the build fails with "There was an error while trying to activate the Unity license", troubleshoot as follows.

**Check:** If using Personal license, ensure `UNITY_SERIAL` is **not** set. The workflow no longer passes it for Personal; having it set can cause activation to fail.

**Personal license + macOS:** The `unity-request-activation-file` action does **not** support darwin (macOS). It only runs on ubuntu. The `.ulf` from Request Unity License is machine-bound to the ubuntu runner, so it will **not** work on macos-latest. **Workaround:** The Build workflow uses **StandaloneLinux64** on ubuntu-latest so Personal license works. Run Request Unity License to get a fresh `.ulf`, then CI will pass. Build for macOS locally.

### Personal license

1. **Primary path:** Follow [GameCI activation docs](https://game.ci/docs/github/activation). Activate locally in Unity Hub (Preferences → Licenses → Add → Get a free personal license), then copy the contents of the `.ulf` file into the `UNITY_LICENSE` secret. Per v4 docs, the `.ulf` from Unity Hub should work.
2. **If that fails:** Run the `.github/workflows/request-license.yml` workflow (manual, workflow_dispatch). Uses Unity 2022.3.0f1 on ubuntu-latest. Download the `.alf` artifact, upload at [license.unity3d.com](https://license.unity3d.com/manual), obtain the `.ulf`, add contents to `UNITY_LICENSE`. Works for Linux builds (CI); not for macOS (action does not support darwin).
3. **Base64 workaround:** If raw `.ulf` content fails (multi-line encoding, "digital signature invalid"), use `UNITY_LICENSE_BASE64` instead. Encode locally: `base64 -i Unity_lic.ulf | pbcopy`, paste into a new secret `UNITY_LICENSE_BASE64`. The build workflow decodes it automatically. See [GameCI common issues](https://game.ci/docs/troubleshooting/common-issues).

### Professional license

Verify `UNITY_SERIAL` format: `XX-XXXX-XXXX-XXXX-XXXX-XXXX` (exactly six groups). Typos or extra spaces will cause activation to fail.

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
