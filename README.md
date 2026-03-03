# Welcome to your new ignited app!

> The latest and greatest boilerplate for Infinite Red opinions

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our React Native stack.

- [Quick start documentation](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/Boilerplate.md)
- [Full documentation](https://github.com/infinitered/ignite/blob/master/docs/README.md)

## Getting Started

```bash
yarn
yarn start
```

To make things work on your local simulator, or on your phone, you need first to [run `eas build`](https://github.com/infinitered/ignite/blob/master/docs/expo/EAS.md). We have many shortcuts on `package.json` to make it easier:

```bash
yarn build:ios:sim # build for ios simulator
yarn build:ios:device # build for ios device
yarn build:ios:prod # build for ios device
```

### `./assets` directory

This directory is designed to organize and store various assets, making it easy for you to manage and use them in your application. The assets are further categorized into subdirectories, including `icons` and `images`:

```tree
assets
├── icons
└── images
```

**icons**
This is where your icon assets will live. These icons can be used for buttons, navigation elements, or any other UI components. The recommended format for icons is PNG, but other formats can be used as well.

Ignite comes with a built-in `Icon` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/boilerplate/app/components/Icon.md).

**images**
This is where your images will live, such as background images, logos, or any other graphics. You can use various formats such as PNG, JPEG, or GIF for your images.

Another valuable built-in component within Ignite is the `AutoImage` component. You can find detailed usage instructions in the [docs](https://github.com/infinitered/ignite/blob/master/docs/Components-AutoImage.md).

How to use your `icon` or `image` assets:

```typescript
import { Image } from 'react-native';

const MyComponent = () => {
  return (
    <Image source={require('assets/images/my_image.png')} />
  );
};
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
SKIP_TESTS=1 pnpm build:ios:sim
```

`SKIP_TESTS=1` bypasses all checks.

## Next Steps

### Ignite Cookbook

[Ignite Cookbook](https://ignitecookbook.com/) is an easy way for developers to browse and share code snippets (or “recipes”) that actually work.

### Upgrade Ignite boilerplate

Read our [Upgrade Guide](https://ignitecookbook.com/docs/recipes/UpdatingIgnite) to learn how to upgrade your Ignite project.

## Community

⭐️ Help us out by [starring on GitHub](https://github.com/infinitered/ignite), filing bug reports in [issues](https://github.com/infinitered/ignite/issues) or [ask questions](https://github.com/infinitered/ignite/discussions).

💬 Join us on [Slack](https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1f137np4h-zPTq_CbaRFUOR_glUFs2UA) to discuss.

📰 Make our Editor-in-chief happy by [reading the React Native Newsletter](https://reactnativenewsletter.com/).
