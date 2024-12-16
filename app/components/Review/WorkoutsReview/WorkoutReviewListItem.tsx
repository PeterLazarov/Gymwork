import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { Workout } from 'app/db/models'
import { Text } from 'designSystem'
import WorkoutCommentsCard from 'app/components/Workout/WorkoutCommentsCard'
import { formatDateIso } from 'app/utils/date'

type Props = {
  workout: Workout
  onPress: () => void
}

const WorkoutReviewListItem: React.FC<Props> = ({ workout, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.item}
    >
      <Text style={styles.text}>{formatDateIso(workout.date, 'long')}</Text>
      {workout.hasComments && (
        <WorkoutCommentsCard
          onPress={onPress}
          workout={workout}
          compactMode
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 8,
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    textAlign: 'center',
  },
})

export default WorkoutReviewListItem
