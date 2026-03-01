#!/usr/bin/env python3
"""
Push 14 PNG files to KyleGowen/vimanas on branch main via GitHub API.
Requires GITHUB_TOKEN environment variable.

Usage: GITHUB_TOKEN=ghp_xxx python3 scripts/push_pngs_to_github.py
"""
import base64
import json
import os
import urllib.request
import urllib.error

OWNER = "KyleGowen"
REPO = "vimanas"
BRANCH = "main"
MESSAGE = "Add reference and concept images (PNGs)"

FILES = [
    "docs/concepts/sparrow_ship_blue_v2.png",
    "docs/concepts/vimanas_title_screen.png",
    "docs/references/1943_ref_1.png",
    "docs/references/1943_ref_2.png",
    "docs/references/aero_fighters_ref_1.png",
    "docs/references/aero_fighters_ref_2.png",
    "docs/references/aero_fighters_ref_3.png",
    "docs/references/sophisticated_ref_1.png",
    "docs/references/sophisticated_ref_2.png",
    "docs/references/sophisticated_ref_3.png",
    "docs/references/sophisticated_ref_4.png",
    "docs/references/sophisticated_ref_5.png",
    "docs/references/sophisticated_ref_6.png",
    "docs/references/sophisticated_ref_7.png",
]


def api_request(method: str, path: str, data: dict | None = None) -> dict:
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise SystemExit("GITHUB_TOKEN environment variable is required")
    url = f"https://api.github.com{path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    if body:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise SystemExit(f"GitHub API error {e.code}: {body}")


def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(base_dir)

    # Get ref
    ref = api_request("GET", f"/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}")
    sha = ref["object"]["sha"]

    # Get base tree
    commit = api_request("GET", f"/repos/{OWNER}/{REPO}/git/commits/{sha}")
    base_tree = commit["tree"]["sha"]

    # Create blobs and tree entries
    tree_entries = []
    for path in FILES:
        with open(path, "rb") as f:
            content = base64.b64encode(f.read()).decode("ascii")
        blob = api_request("POST", f"/repos/{OWNER}/{REPO}/git/blobs", {
            "content": content,
            "encoding": "base64",
        })
        tree_entries.append({
            "path": path,
            "mode": "100644",
            "type": "blob",
            "sha": blob["sha"],
        })

    # Create tree
    tree = api_request("POST", f"/repos/{OWNER}/{REPO}/git/trees", {
        "base_tree": base_tree,
        "tree": tree_entries,
    })

    # Create commit
    commit = api_request("POST", f"/repos/{OWNER}/{REPO}/git/commits", {
        "message": MESSAGE,
        "tree": tree["sha"],
        "parents": [sha],
    })

    # Update ref
    api_request("PATCH", f"/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}", {
        "sha": commit["sha"],
    })

    print(f"Pushed commit {commit['sha'][:7]} with 14 PNG files to {OWNER}/{REPO} on {BRANCH}")


if __name__ == "__main__":
    main()