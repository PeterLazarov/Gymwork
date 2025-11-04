import { useMemo } from "react"
import { Text as TextRn, TextProps as TextRnProps, StyleSheet } from "react-native"

import { AppColors, fontSize, useColors } from "../tokens"

type TextProps = TextRnProps & {
  text?: string
}
export const Text: React.FC<TextProps> = ({ style, children, text, ...otherProps }) => {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const content = text || children
  return (
    <TextRn
      style={[styles.default, style]}
      {...otherProps}
    >
      {content}
    </TextRn>
  )
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    default: {
      color: colors.onSurface,
      fontSize: fontSize.md,
    },
  })
