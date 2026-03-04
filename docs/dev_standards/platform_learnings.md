# Platform Learnings

**Status:** Active  
**Audience:** Platform/Release, DevOps  
**Source:** CI.1 implementation (2025-03-04)

---

## GitHub Actions — Required Secrets

The `.github/workflows/build.yml` workflow builds the Unity project for Linux (StandaloneLinux64) using GameCI `unity-builder@v4`. Both Personal and Professional use `UNITY_SERIAL` + `UNITY_EMAIL` + `UNITY_PASSWORD`.

### Personal license

**Preferred: use the .ulf file directly** (avoids login; no 401 errors):

1. Activate in Unity Hub locally (Preferences → Licenses → Add → Get a free personal license).
2. Base64-encode your `.ulf` file:
   ```bash
   base64 -i "/Library/Application Support/Unity/Unity_lic.ulf" | tr -d '\n' | pbcopy
   ```
   (On Mac: `pbcopy` copies to clipboard; paste into GitHub Secret. Or redirect to a file.)
3. Add GitHub Secret `UNITY_LICENSE_BASE64` with that value.

**Alternative: serial + credentials** (can fail with 401 if login rejected):

1. Extract serial from `.ulf`:
   ```bash
   grep DeveloperData /Library/Application\ Support/Unity/Unity_lic.ulf | sed -E 's/.*Value="([^"]+)".*/\1/' | base64 -d
   ```
2. Add secrets: `UNITY_SERIAL`, `UNITY_EMAIL`, `UNITY_PASSWORD`.

**Note:** The `%` at end of serial output is zsh prompt—do not include it. **Google SSO:** Set a password via [login.unity.com](https://login.unity.com) → Forgot password. Avoid special characters in password; use mixed-case alphanumeric if activation fails.

### Professional license

Add these GitHub Secrets:

| Secret          | Description                    |
|-----------------|--------------------------------|
| `UNITY_SERIAL`  | Serial provided by Unity       |
| `UNITY_EMAIL`   | Email for your Unity account   |
| `UNITY_PASSWORD`| Password for your Unity account|

---

## License activation failure

If the build fails with "There was an error while trying to activate the Unity license" or **"Failed to login - please check your username or password" (HTTP 401)**, troubleshoot as follows.

### Personal license

1. **Primary path:** Use `UNITY_LICENSE_BASE64` (base64 of your `.ulf` file). This bypasses login and avoids 401 errors. See Required Secrets above.
2. **Alternative (serial+credentials):** If you prefer, use `UNITY_SERIAL` + `UNITY_EMAIL` + `UNITY_PASSWORD`. If you get 401: set a password at [login.unity.com](https://login.unity.com) (Google SSO users: Forgot password), and avoid special characters in the password.

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

## GitHub Actions — secrets in conditions

The `secrets` context **cannot** be used in `if` conditions or in expression evaluation (e.g. `secrets.X != ''`). It is only available when passed to a step's `env` block. For conditional logic: pass the secret via `env`, then check inside the `run` script (e.g. `if [ -n "$VAR" ]; then ...`).

## unity-request-activation-file limitations

- Does **not** support Unity 6 (6000.x): "Invalid version 6000.3.10f1"
- Does **not** support darwin (macOS): "Currently darwin-platform is not supported"
- license.unity3d.com no longer supports Personal license manual activation

---

## CI Verification (CEO directive)

When pushing code for macOS-specific build checks: **use the GitHub MCP to monitor the build and ensure it passes before saying a change is ready.** Do not report "ready" until the workflow run has succeeded. Tools: `get_pull_request_status`, `list_commits` + Actions run status, or equivalent.

---

## Still true?

- [ ] Revisit if GameCI or Unity licensing changes
