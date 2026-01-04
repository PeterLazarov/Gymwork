import { ConfigContext, ExpoConfig } from "@expo/config"

/**
 * Use tsx/cjs here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript.
 *
 * See https://docs.expo.dev/config-plugins/plugins/#add-typescript-support-and-convert-to-dynamic-app-config
 */
import "tsx/cjs"

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 *
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []

  return {
    ...config,
    extra: {
      ...config.extra,
      AIRTABLE_URL: process.env.AIRTABLE_URL,
      AIRTABLE_SECRET: process.env.AIRTABLE_SECRET,
      SENTRY_DSN: process.env.SENTRY_DSN,
      RESET_DB: process.env.RESET_DB,
      LOG_RQ: process.env.LOG_RQ,
      LOG_DB: process.env.LOG_DB,
      LOG_DB_SQL: process.env.LOG_DB_SQL,
      LOG_DB_PARAMS: process.env.LOG_DB_PARAMS,
      LOG_SLOW_MS: process.env.LOG_SLOW_MS,
    },
    ios: {
      ...config.ios,
      // This privacyManifests is to get you started.
      // See Expo's guide on apple privacy manifests here:
      // https://docs.expo.dev/guides/apple-privacy/
      // You may need to add more privacy manifests depending on your app's usage of APIs.
      // More details and a list of "required reason" APIs can be found in the Apple Developer Documentation.
      // https://developer.apple.com/documentation/bundleresources/privacy-manifest-files
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"], // CA92.1 = "Access info from same app, per documentation"
          },
        ],
      },
    },
    plugins: existingPlugins,
  }
}
