#!/usr/bin/env bash
set -euo pipefail

if [ "${SKIP_TESTS:-}" = "1" ]; then
  echo "Tests skipped (SKIP_TESTS=1)"
  exit 0
fi

pnpm compile
pnpm test

export PATH="$HOME/.maestro/bin:$PATH"

if ! command -v maestro >/dev/null 2>&1; then
  echo "Skipping Maestro E2E gate: Maestro CLI not found on PATH."
  echo "Install it to re-enable E2E gating, or run pnpm test:maestro explicitly."
  exit 0
fi

# Start Metro in the background for E2E tests
EXPO_PUBLIC_SKIP_WORKOUT_SEEDS=true expo start --dev-client >/dev/null 2>&1 &
METRO_PID=$!

cleanup() { kill "$METRO_PID" 2>/dev/null; wait "$METRO_PID" 2>/dev/null; }
trap cleanup EXIT

TIMEOUT=60
ELAPSED=0
echo "Waiting for Metro (timeout ${TIMEOUT}s)..."
while ! curl -s http://localhost:8081/status >/dev/null 2>&1; do
  sleep 2
  ELAPSED=$((ELAPSED + 2))
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "Metro failed to start within ${TIMEOUT}s" >&2
    exit 1
  fi
done
echo "Metro ready"

pnpm test:maestro
