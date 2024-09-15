import { ColorSchemeName, useColorScheme } from 'react-native'
import { colorSchemas } from './colorSchemas'

const primary = colorSchemas.purple
const accent = colorSchemas.coral
const neutral = colorSchemas.neutral

export const getColors = (colorScheme: ColorSchemeName) => ({
  primary: primary.hue600,
  primaryLight: colorScheme === 'light' ? primary.hue300 : primary.hue400,
  primaryLighter: colorScheme === 'light' ? primary.hue100 : primary.hue300,

  accent: accent.hue600,
  accentLight: colorScheme === 'light' ? accent.hue300 : accent.hue400,
  accentLightest:
    colorScheme === 'light' ? accent.hue100 : colorSchemas.coral.hue300,

  neutralDarkest:
    colorScheme === 'light' ? colorSchemas.black : 'rgb(192,192,192)',
  neutralDarker: colorScheme === 'light' ? neutral.hue900 : 'rgb(160,160,160)',
  neutralDark: colorScheme === 'light' ? neutral.hue800 : 'rgb(128,128,128)',
  neutral: colorScheme === 'light' ? neutral.hue700 : 'rgb(96,96,96)',
  neutralLight: colorScheme === 'light' ? neutral.hue500 : colorSchemas.black,
  neutralLighter: colorScheme === 'light' ? neutral.hue300 : 'rgb(32,32,32)',
  neutralLightest: colorScheme === 'light' ? neutral.hue100 : 'rgb(16,16,16)',

  critical: colorSchemas.pink.hue900,
  tertiary: 'transparent',
  primaryText: neutral.hue100,
  secondaryText: neutral.hue100,
  criticalText: neutral.hue100,
  neutralText: colorScheme === 'light' ? neutral.hue900 : neutral.hue100,
  tertiaryText: colorScheme === 'light' ? neutral.hue800 : neutral.hue900,
  disabled: neutral.hue600,
})

export function useColors() {
  const colorScheme = useColorScheme()

  return getColors(colorScheme)
}
