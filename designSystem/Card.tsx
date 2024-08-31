import React from 'react'
import { StyleSheet, View, Text, ViewStyle } from 'react-native'

import { colors, fontSize } from './tokens'
import {
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
} from 'react-native-gesture-handler'

type CardProps = Omit<TouchableWithoutFeedbackProps, 'containerStyle'> & {
  title: string
  content: React.ReactNode
  containerStyle?: ViewStyle
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  containerStyle = {},
  ...otherProps
}) => {
  return (
    <TouchableOpacity
      style={{ ...styles.card, ...containerStyle }}
      activeOpacity={0.5}
      {...otherProps}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View>{content}</View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLighter,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  content: {
    padding: 15,
    gap: 5,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
  },
})

export default Card
