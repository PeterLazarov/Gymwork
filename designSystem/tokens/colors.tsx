import { useColorScheme } from 'react-native'
import { colorSchemas } from './colorSchemas'

export const lightColors = {
  primary: colorSchemas.purple.hue600,
  primaryLight: colorSchemas.purple.hue300,
  primaryLighter: colorSchemas.purple.hue100,

  accent: colorSchemas.coral.hue600,
  accentLight: colorSchemas.coral.hue300,
  accentLightest: colorSchemas.coral.hue100,

  neutralDarkest: colorSchemas.black,
  neutralDarker: colorSchemas.neutral.hue900,
  neutralDark: colorSchemas.neutral.hue800,
  neutral: colorSchemas.neutral.hue700,
  neutralLight: colorSchemas.neutral.hue500,
  neutralLighter: colorSchemas.neutral.hue300,
  neutralLightest: colorSchemas.neutral.hue100,

  critical: colorSchemas.pink.hue900,
  tertiary: 'transparent',
  primaryText: colorSchemas.neutral.hue100,
  secondaryText: colorSchemas.neutral.hue100,
  criticalText: colorSchemas.neutral.hue100,
  neutralText: colorSchemas.neutral.hue900,
  tertiaryText: colorSchemas.neutral.hue900,
  disabled: colorSchemas.neutral.hue600,
} as const

export const darkColors = {
  primary: colorSchemas.purple.hue600,
  primaryLight: colorSchemas.purple.hue400,
  primaryLighter: colorSchemas.purple.hue300,

  accent: colorSchemas.coral.hue600,
  accentLight: colorSchemas.coral.hue400,
  accentLightest: colorSchemas.coral.hue300,

  neutralDarkest: 'rgb(192,192,192)',
  neutralDarker: 'rgb(160,160,160)',
  neutralDark: 'rgb(128,128,128)',
  neutral: 'rgb(96,96,96)',
  neutralLight: colorSchemas.black, // The background color
  neutralLighter: 'rgb(32,32,32)',
  neutralLightest: 'rgb(16,16,16)',

  critical: colorSchemas.pink.hue900,
  tertiary: 'transparent',
  primaryText: colorSchemas.neutral.hue100,
  secondaryText: colorSchemas.neutral.hue100,
  criticalText: colorSchemas.neutral.hue100,
  neutralText: colorSchemas.neutral.hue900,
  tertiaryText: colorSchemas.neutral.hue900,
  disabled: colorSchemas.neutral.hue600,
} as const

export function useColors() {
  const colorScheme = useColorScheme()

  return colorScheme === 'light' ? lightColors : darkColors
}
