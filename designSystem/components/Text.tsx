import { TextProps, Text as TextRN, TextStyle } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { ThemedStyle } from 'designSystem/theme'
// eslint-disable-next-line no-restricted-imports

export const Text: React.FC<TextProps> = ({ style, ...otherProps }) => {
  const { themed } = useAppTheme()
  return (
    <TextRN
      style={[themed($default), style]}
      {...otherProps}
    />
  )
}

const $default: ThemedStyle<TextStyle> = ({
  colors,
  typography: { fontSize },
}) => ({
  color: colors.onSurface,
  fontSize: fontSize.md,
})
