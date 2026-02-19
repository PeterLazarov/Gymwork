/* eslint-env node */
// Learn more https://docs.expo.io/guides/customizing-metro
const path = require("path")
const { getDefaultConfig } = require("expo/metro-config")
const { resolve } = require("metro-resolver")

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.transformer.getTransformOptions = async () => ({
  transform: {
    // Inline requires are very useful for deferring loading of large dependencies/components.
    // For example, we use it in app.tsx to conditionally load Reactotron.
    // However, this comes with some gotchas.
    // Read more here: https://reactnative.dev/docs/optimizing-javascript-loading
    // And here: https://github.com/expo/expo/issues/27279#issuecomment-1971610698
    inlineRequires: true,
  },
})

// This is a temporary fix that helps fixing an issue with axios/apisauce.
// See the following issues in Github for more details:
// https://github.com/infinitered/apisauce/issues/331
// https://github.com/axios/axios/issues/6899
// The solution was taken from the following issue:
// https://github.com/facebook/metro/issues/1272
config.resolver.unstable_conditionNames = ["require", "default", "browser"]

// Ensure echarts can import tslib in Metro (avoid ESM/CJS interop issues)
const tslibESM = path.resolve(__dirname, "node_modules/tslib/tslib.es6.js")
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  tslib: tslibESM,
}
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "tslib") {
    return resolve(context, tslibESM, platform)
  }
  return resolve(context, moduleName, platform)
}

// This helps support certain popular third-party libraries
// such as Firebase that use the extension cjs.
config.resolver.sourceExts.push("cjs")
config.resolver.sourceExts.push("sql")

module.exports = config
