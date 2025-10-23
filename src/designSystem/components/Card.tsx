import React, { useMemo } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import { Pressable, PressableProps } from "react-native-gesture-handler"

import { Text } from "./Text"
import { useColors, spacing } from "../tokens"

export type CardProps = Omit<PressableProps, "containerStyle"> & {
  title?: string
  content: React.ReactNode
  containerStyle?: ViewStyle
}

export const Card: React.FC<CardProps> = ({
  title,
  content,
  containerStyle = {},
  style,
  onPress,
  ...otherProps
}) => {
  const colors = useColors()

  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <Pressable
      style={[styles.card, containerStyle]}
      onPress={onPress}
      disabled={!onPress}
      {...otherProps}
    >
      {(props) => (
        <View style={[styles.content, style, { opacity: props.pressed ? 0.5 : 1 }]}>
          {title && <Text style={styles.title}>{title}</Text>}
          <View>{content}</View>
        </View>
      )}
    </Pressable>
  )
}

const makeStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
    },
    content: {
      padding: spacing.md,
      gap: spacing.xxs,
    },
    title: {
      fontWeight: "bold",
    },
  })
