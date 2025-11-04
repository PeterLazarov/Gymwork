import { ColorSchemeName, useColorScheme } from 'react-native'
import { schemes } from './theme'

export const getColors = (colorScheme: NonNullable<ColorSchemeName>) => {
  return schemes[colorScheme]
}

export function useColors() {
  const colorScheme = useColorScheme()!

  return getColors(colorScheme)
}

export type AppColors = ReturnType<typeof useColors>