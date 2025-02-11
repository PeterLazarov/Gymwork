import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// https://github.com/react-native-menu/menu/issues/545#issuecomment-2499092245
const withChangeNativeAndroidTextToWhite: ConfigPlugin = expoConfig =>
  withDangerousMod(expoConfig, [
    'android',
    modConfig => {
      if (modConfig.modRequest.platform === 'android') {
        const stylesXmlPath = join(
          modConfig.modRequest.platformProjectRoot,
          'app',
          'src',
          'main',
          'res',
          'values',
          'styles.xml'
        )

        if (existsSync(stylesXmlPath)) {
          let stylesXml = readFileSync(stylesXmlPath, 'utf8')
          stylesXml = stylesXml.replace(
            /@android:color\/black/g,
            '@android:color/white'
          )
          writeFileSync(stylesXmlPath, stylesXml, { encoding: 'utf8' })
        } else {
          throw new Error(`${stylesXmlPath} does not exist!`)
        }
      }
      return modConfig
    },
  ])

export default withChangeNativeAndroidTextToWhite
