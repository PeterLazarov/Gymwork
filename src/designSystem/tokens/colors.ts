import { ColorSchemeName, useColorScheme } from 'react-native'
import { schemes } from './theme'
import { resolveColorScheme } from '@/utils/colorScheme'

export const getColors = (colorScheme: ColorSchemeName | undefined) => {
  return schemes[resolveColorScheme(colorScheme)]
}

export function useColors() {
  const colorScheme = useColorScheme()

  return getColors(colorScheme)
}

export type AppColors = ReturnType<typeof useColors>
