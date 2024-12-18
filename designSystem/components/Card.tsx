import React from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'
import { Pressable, PressableProps } from 'react-native-gesture-handler'

import { useAppTheme } from '@/utils/useAppTheme'
import { ThemedStyle } from 'designSystem/theme'

import { Text } from '.'

export type CardProps = Omit<PressableProps, 'containerStyle'> & {
  title?: string
  content: React.ReactNode
  containerStyle?: ViewStyle
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  containerStyle = {},
  style,
  onPress,
  ...otherProps
}) => {
  const {
    theme: { colors, spacing },
    themed,
  } = useAppTheme()

  return (
    <Pressable
      style={[themed($card), containerStyle]}
      onPress={onPress}
      disabled={!onPress}
      {...otherProps}
    >
      {props => (
        <View
          style={[
            themed($content),
            style,
            { opacity: props.pressed ? 0.5 : 1 },
          ]}
        >
          {title && <Text style={$title}>{title}</Text>}
          <View>{content}</View>
        </View>
      )}
    </Pressable>
  )
}

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.surface,
  borderRadius: 8,
})
const $content: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  gap: spacing.xxs,
  padding: spacing.md,
})
const $title: TextStyle = {
  fontWeight: 'bold',
}

export default Card
