import React, { useMemo } from "react"
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from "react-native"

import { spacing, useColors } from "../tokens"
import { Text } from "./Text"

export type CardProps = Omit<PressableProps, "containerStyle" | "style"> & {
  header?: React.ReactNode
  content: React.ReactNode
  containerStyle?: ViewStyle
  style?: StyleProp<ViewStyle>
}

export const Card: React.FC<CardProps> & {
  Title: React.FC<TitleProps>
} = ({
  header,
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
          {header}
          <View>{content}</View>
        </View>
      )}
    </Pressable>
  )
}

type TitleProps = {
  tx: string
}
const Title: React.FC<TitleProps> = ({ tx }) => {
  return <Text style={titleStyle.title}>{tx}</Text>
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

const titleStyle = StyleSheet.create({
  title: {
    fontWeight: "bold",
  },
})

Card.Title = Title