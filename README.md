# Gymwork

A React Native workout tracking app built with Expo.

## Getting Started

```bash
pnpm install
pnpm start
```

Build for a local simulator or device using the `build:*` scripts in `package.json`:

```bash
pnpm build:ios:prod
pnpm build:android:preview
pnpm build:android:prod
```

## Testing

### Unit tests

```bash
pnpm test            # run once
pnpm test:watch      # watch mode
```

### E2E tests (Maestro)

Requires [Maestro CLI](https://maestro.mobile.dev/) and a Java runtime.

**Terminal 1** — start Metro in E2E mode (skips workout seeds):

```bash
pnpm start:e2e
```

**Terminal 2** — run tests against a running iOS simulator or Android emulator:

```bash
export JAVA_HOME=$(/usr/libexec/java_home)

# Run all flows
pnpm test:maestro

# Run a single flow (.maestro/flows/ prefix is inferred)
pnpm test:maestro create_exercise_shows_in_list
```

Test flows live in `.maestro/flows/`, shared setup flows in `.maestro/shared/`.

### Pre-build test gate

Every `build:*` script runs a test gate first (`prebuild:gate`, implemented in `scripts/prebuild-gate.sh`). The gate runs, in order:

1. `pnpm compile` — TypeScript type-check
2. `pnpm test` — Jest unit tests
3. Starts Metro in E2E mode automatically (output silenced)
4. `pnpm test:maestro` — Maestro E2E flows
5. Shuts Metro down after tests complete

If any step fails the build is blocked.

**Prerequisites:** a simulator/emulator with a dev build installed. Metro is started and stopped automatically — no manual server needed.

To skip the gate entirely:

```bash
SKIP_TESTS=1 pnpm build:android:prod
```

`SKIP_TESTS=1` bypasses all checks.
