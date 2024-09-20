import React from 'react'
import { StyleSheet } from 'react-native'

import { Workout } from 'app/db/models'
import { TouchableOpacity } from 'react-native'
import { Text } from 'designSystem'

type Props = {
  workout: Workout
  onPress: () => void
}

const CommentReviewListItem: React.FC<Props> = ({ workout, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.item}
    >
      <Text>{workout.date}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
    flex: 1,
  },
})

export default CommentReviewListItem
