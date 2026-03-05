#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.maestro/bin:$PATH"

FLOW="${1:-}"

if [ -z "$FLOW" ]; then
  maestro test -e MAESTRO_APP_ID=com.gymwork .maestro/flows
else
  maestro test -e MAESTRO_APP_ID=com.gymwork ".maestro/flows/${FLOW}.yaml"
fi
