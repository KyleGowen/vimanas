#!/bin/bash
# Push to GitHub. Uses GITHUB_TOKEN if set.
# Usage: GITHUB_TOKEN=ghp_xxx ./scripts/push.sh
# Or: export GITHUB_TOKEN=ghp_xxx; ./scripts/push.sh

set -e
cd "$(dirname "$0")/.."

if [ -n "$GITHUB_TOKEN" ]; then
  git push "https://kyle-gowen:${GITHUB_TOKEN}@github.com/KyleGowen/vimanas.git" main
else
  echo "Set GITHUB_TOKEN and run again, or run 'git push' in your terminal."
  exit 1
fi
