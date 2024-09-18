import { ColorSchemeName, useColorScheme } from 'react-native'
import { schemes } from './themeV2'
import { colorSchemas } from './colorSchemas'

export const getColors = (colorScheme: NonNullable<ColorSchemeName>) => {
  const mat = schemes[colorScheme]

  const primary = colorSchemas.purple
  const accent = colorSchemas.coral
  const neutral = colorSchemas.neutral

  const prev = {
    primary: primary.hue600,
    primaryLight: colorScheme === 'light' ? primary.hue300 : primary.hue400,
    primaryLighter: colorScheme === 'light' ? primary.hue100 : primary.hue300,

    accent: accent.hue600,
    accentLight: colorScheme === 'light' ? accent.hue300 : accent.hue400,
    accentLightest:
      colorScheme === 'light' ? accent.hue100 : colorSchemas.coral.hue300,

    neutralDarkest:
      colorScheme === 'light' ? colorSchemas.black : neutral.hue600,
    neutralDarker: colorScheme === 'light' ? neutral.hue900 : neutral.hue700,
    neutralDark: neutral.hue800,
    neutral: colorScheme === 'light' ? neutral.hue700 : neutral.hue900,
    neutralLight: colorScheme === 'light' ? neutral.hue500 : colorSchemas.black,
    neutralLighter: colorScheme === 'light' ? neutral.hue300 : 'rgb(32,32,32)',
    neutralLightest: colorScheme === 'light' ? neutral.hue100 : 'rgb(16,16,16)',

    critical: colorSchemas.pink.hue900,
    tertiary: 'transparent',
    primaryText: neutral.hue100,
    accentText: neutral.hue100,
    criticalText: neutral.hue100,
    neutralText: colorScheme === 'light' ? neutral.hue900 : neutral.hue100,
    tertiaryText: colorScheme === 'light' ? neutral.hue800 : neutral.hue900,
    disabled: neutral.hue600,
  }

  // const adjusted = {
  //   primary: mat.primary,
  //   primaryLight: mat.primaryContainer,
  //   primaryLighter: mat.inversePrimary,

  //   accent: mat.secondary,
  //   accentLight: mat.secondaryContainer,
  //   accentLighter: mat.secondaryContainer, // ! TODO

  //   neutralDarkest: mat.surfaceContainerLowest,
  //   neutralDarker: mat.surface,
  //   neutralDark: mat.surfaceContainerLow,
  //   neutral: mat.surfaceContainer,
  //   neutralLight: mat.surfaceContainerHigh, // ! TODO
  //   neutralLighter: mat.surfaceContainerHigh,
  //   neutralLightest: mat.surfaceContainerHighest,

  //   critical: mat.error,
  //   // tertiary: matScheme.secondary, // !TODO
  //   tertiary: mat.surface, // !TODO
  //   primaryText: mat.onPrimary,
  //   accentText: mat.onTertiary,
  //   criticalText: mat.onError,
  //   neutralText: mat.onSurface,
  //   // tertiaryText: matScheme.onSecondary,
  //   tertiaryText: mat.onSurfaceVariant,
  //   disabled: mat.onSurfaceVariant,
  // }

  return { mat, ...prev }
}

export function useColors() {
  const colorScheme = useColorScheme()!

  return getColors(colorScheme)
}
