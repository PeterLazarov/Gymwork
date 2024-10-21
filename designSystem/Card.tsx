import React, { useMemo } from 'react'
import {
  StyleSheet,
  View,
  ViewStyle,
  // ! Switching these imports to RNGH makes children non-pressable
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
} from 'react-native'

import { Text, useColors } from '.'

export type CardProps = Omit<
  TouchableWithoutFeedbackProps,
  'containerStyle'
> & {
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
  const colors = useColors()

  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <TouchableOpacity
      style={[styles.card, containerStyle]}
      activeOpacity={0.5}
      onPress={onPress}
      disabled={!onPress}
      {...otherProps}
    >
      <View style={[styles.content, style]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View>{content}</View>
      </View>
    </TouchableOpacity>
  )
  // : (
  // <View
  //   style={[styles.card, containerStyle]}
  //   {...otherProps}
  // >
  //   <View style={[styles.content, style]}>
  //     {title && <Text style={styles.title}>{title}</Text>}
  //     <View>{content}</View>
  //   </View>
  // </View>
  // )
}

const makeStyles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 8,
    },
    content: {
      padding: 15,
      gap: 5,
    },
    title: {
      fontWeight: 'bold',
    },
  })

export default Card
