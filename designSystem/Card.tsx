import React, { useMemo } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { Text, useColors } from '.'
import {
  TouchableOpacity,
  TouchableWithoutFeedbackProps,
} from 'react-native-gesture-handler'

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
  ...otherProps
}) => {
  const colors = useColors()

  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <TouchableOpacity
      style={{ ...styles.card, ...containerStyle }}
      activeOpacity={0.5}
      {...otherProps}
    >
      <View style={styles.content}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View>{content}</View>
      </View>
    </TouchableOpacity>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.mat.surface,
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
      fontWeight: 'bold',
    },
  })

export default Card
