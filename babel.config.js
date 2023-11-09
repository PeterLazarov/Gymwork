module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'jotai/babel/plugin-react-refresh',
      'babel-plugin-transform-typescript-metadata',
      'react-native-reanimated/plugin',
      'react-native-paper/babel',
    ],
  }
}
