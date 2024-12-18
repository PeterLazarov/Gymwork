import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import WorkoutCommentsCard from 'app/components/Workout/WorkoutCommentsCard'
import { Workout } from 'app/db/models'
import { formatDateIso } from 'app/utils/date'
import { Text } from 'designSystem'

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
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  text: {
    textAlign: 'center',
  },
})

export default WorkoutReviewListItem
