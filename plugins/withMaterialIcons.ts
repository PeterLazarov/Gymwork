import {
  ConfigPlugin,
  withStringsXml,
  AndroidConfig,
  withAndroidStyles,
  withInfoPlist,
} from 'expo/config-plugins'

// Used for icons on iOS on native tabs

const withMaterialIcons: ConfigPlugin = config => {
  config = withInfoPlist(config, config => {
    const existingFonts = config.modResults.UIAppFonts || []
    config.modResults.UIAppFonts = Array.isArray(existingFonts)
      ? [...existingFonts, 'MaterialIcons.ttf']
      : ['MaterialIcons.ttf']
    return config
  })

  return config
}

export default withMaterialIcons
