import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'
import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from 'react-native-paper'
import { MD3Theme } from 'react-native-paper/lib/typescript/types'

import { colors } from './colors'

function getPaperTheme(theme: 'light' | 'dark'): MD3Theme {
  const matTheme = colors[theme]
  const defaultPaperTheme = theme === 'light' ? MD3LightTheme : MD3DarkTheme

  return {
    ...defaultPaperTheme,
    colors: {
      ...defaultPaperTheme.colors,
      ...matTheme,
      elevation: {
        level0: 'transparent',
        level1: matTheme.surfaceContainerLowest,
        level2: matTheme.surfaceContainerLow,
        level3: matTheme.surfaceContainer,
        level4: matTheme.surfaceContainerHigh,
        level5: matTheme.surfaceContainerHighest,
      },
    },
  }
}

export const paperThemes = {
  light: getPaperTheme('light'),
  dark: getPaperTheme('dark'),
}

export const navThemes = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: paperThemes.light,
  materialDark: paperThemes.dark,
})
