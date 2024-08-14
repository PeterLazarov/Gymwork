module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      /** react-native-reanimated web support @see https://docs.swmansion.com/react-native-reanimated/docs/guides/web-support/ */
      "@babel/plugin-transform-export-namespace-from",
      "babel-plugin-transform-typescript-metadata",
      "react-native-reanimated/plugin",
      "react-native-paper/babel",
    ],
  };
};
