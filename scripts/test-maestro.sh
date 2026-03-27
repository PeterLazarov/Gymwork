#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.maestro/bin:$PATH"

FLOW="${1:-}"

if ! command -v maestro >/dev/null 2>&1; then
  cat >&2 <<'EOF'
Maestro CLI is not installed or not on PATH.

Install it, then retry:
  curl -Ls "https://get.maestro.mobile.dev" | bash

The script already checks:
  $HOME/.maestro/bin
EOF
  exit 127
fi

if [ -z "$FLOW" ]; then
  maestro test -e MAESTRO_APP_ID=com.gymwork .maestro/flows
else
  maestro test -e MAESTRO_APP_ID=com.gymwork ".maestro/flows/${FLOW}.yaml"
fi
