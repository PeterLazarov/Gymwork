import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

import { colors, fontSize } from './tokens'

type CardProps = {
  title: string
  content: React.ReactNode
  onPress?: () => void
}

const Card: React.FC<CardProps> = ({ title, content, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.5}
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
