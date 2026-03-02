# GitHub Push Setup

## 1. Revoke the exposed token (do this first)

Your GitHub token was exposed in a command output. **Revoke it now:**

1. Go to https://github.com/settings/tokens
2. Find the token (or any token you're not sure about)
3. Click **Delete** or **Revoke**

## 2. Create a new personal access token

1. Go to https://github.com/settings/tokens/new
2. **Note:** e.g. "Vimanas push (Cursor)"
3. **Expiration:** 90 days or No expiration
4. **Scopes:** Check `repo` (full control of private repositories)
5. Click **Generate token**
6. Copy the token (starts with `ghp_`). You won't see it again.

## 3. Clear old credentials and update Git

Run these in your terminal (replace `YOUR_NEW_TOKEN` with the token you copied):

```bash
# Remove old GitHub credentials from the store
git config --global credential.helper store
# Remove the credential file (clears old token)
rm -f ~/.git-credentials

# Set your GitHub username for this repo (if not already set)
cd /Users/kyle/vimanas
git config user.name "KyleGowen"   # or your GitHub username
git config user.email "kyle@measurabl.com"
```

## 4. Push (will prompt for credentials)

```bash
cd /Users/kyle/vimanas
git push
```

When prompted:
- **Username:** Your GitHub username (e.g. `KyleGowen` or `kgowen`)
- **Password:** Paste your **new token** (not your GitHub password)

Git will store these in `~/.git-credentials` for future pushes.

## 5. Alternative: Use GitHub CLI (easier)

```bash
gh auth login
```

Then choose:
- GitHub.com
- HTTPS
- Login with a web browser

Follow the prompts. After authenticating:

```bash
cd /Users/kyle/vimanas
git push
```

---

## Troubleshooting

**"Permission denied to kyle-gowen"**  
Your stored credentials are for a different account. Clear them with `rm ~/.git-credentials` and push again with the correct account's token.

**"Repository not found"**  
The repo might be under a different org/user. Double-check: `git remote -v` should show `https://github.com/KyleGowen/vimanas.git` if that's your repo.
