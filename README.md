# Testing Databases

## MMKV

## MMKV (reactive)

## [OP SQLite + Drizzle](https://github.com/OP-Engineering/op-sqlite)

https://orm.drizzle.team/docs/connect-op-sqlite

## [Nitro SQLite ? Drizzle](https://github.com/margelo/react-native-nitro-sqlite)

## [Turbo SQLite ? drizzle](https://github.com/hsjoberg/react-native-turbo-sqlite)

## [Expo SQLite + Drizzle?](https://github.com/expo/expo/tree/main/packages/expo-sqlite)

https://expo.dev/blog/modern-sqlite-for-react-native-apps
https://orm.drizzle.team/docs/connect-expo-sqlite

## Components to try

// TO TRY https://rnas.vercel.app/

## Reordering components to try

- https://github.com/computerjazz/react-native-draggable-flatlist
- https://github.com/computerjazz/react-native-swipeable-item

- https://github.com/MatiPl01/react-native-sortables
- https://github.com/entropyconquers/react-native-reanimated-dnd
- https://github.com/SHISME/react-native-draggable-grid

## Other SQLite + reactivity approaches

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

## Running Maestro end-to-end tests

Follow our [Maestro Setup](https://ignitecookbook.com/docs/recipes/MaestroSetup) recipe.

## Next Steps

### Ignite Cookbook

[Ignite Cookbook](https://ignitecookbook.com/) is an easy way for developers to browse and share code snippets (or “recipes”) that actually work.

### Upgrade Ignite boilerplate

Read our [Upgrade Guide](https://ignitecookbook.com/docs/recipes/UpdatingIgnite) to learn how to upgrade your Ignite project.

## Community

⭐️ Help us out by [starring on GitHub](https://github.com/infinitered/ignite), filing bug reports in [issues](https://github.com/infinitered/ignite/issues) or [ask questions](https://github.com/infinitered/ignite/discussions).

💬 Join us on [Slack](https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1f137np4h-zPTq_CbaRFUOR_glUFs2UA) to discuss.

📰 Make our Editor-in-chief happy by [reading the React Native Newsletter](https://reactnativenewsletter.com/).
https://github.com/livestorejs/livestore
