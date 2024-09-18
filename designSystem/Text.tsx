import { useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Text as TextRN, TextProps, StyleSheet } from 'react-native'

import { fontSize, useColors } from './tokens'

export const Text: React.FC<TextProps> = ({ style, ...otherProps }) => {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  return (
    <TextRN
      style={[styles.default, style]}
      {...otherProps}
    />
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    default: {
      color: colors.onSurface,
      fontSize: fontSize.md,
    },
  })
