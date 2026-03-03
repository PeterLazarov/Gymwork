#!/usr/bin/env bash
set -euo pipefail

FLOW="${1:-}"

if [ -z "$FLOW" ]; then
  maestro test -e MAESTRO_APP_ID=com.gymwork .maestro/flows
else
  maestro test -e MAESTRO_APP_ID=com.gymwork ".maestro/flows/${FLOW}.yaml"
fi
