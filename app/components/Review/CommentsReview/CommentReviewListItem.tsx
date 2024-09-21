import React from 'react'
import { StyleSheet } from 'react-native'

import { Workout } from 'app/db/models'
import { TouchableOpacity } from 'react-native'
import { Text } from 'designSystem'
import WorkoutCommentsCard from 'app/components/Workout/WorkoutCommentsCard'

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
      <Text style={styles.text}>{workout.date}</Text>
      <WorkoutCommentsCard
        workout={workout}
        compactMode
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    paddingTop: 8,
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    textAlign: 'center',
  },
})

export default CommentReviewListItem
