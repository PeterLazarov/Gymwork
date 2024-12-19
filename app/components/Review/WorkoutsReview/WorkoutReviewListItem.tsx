import { observer } from 'mobx-react-lite'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useStores } from '@/db/helpers/useStores'
import { useAppTheme } from '@/utils/useAppTheme'
import WorkoutCommentsCard from 'app/components/Workout/WorkoutCommentsCard'
import { Workout } from 'app/db/models'
import { formatDateIso } from 'app/utils/date'
import { Text } from 'designSystem'

type WorkoutReviewListItemProps = {
  workout: Workout
  onPress: () => void
}

const WorkoutReviewListItem: React.FC<WorkoutReviewListItemProps> = ({
  workout,
  onPress,
}) => {
  const { theme } = useAppTheme()

  const { settingsStore } = useStores()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.item}
    >
      <Text style={styles.text}>{formatDateIso(workout.date, 'long')}</Text>

      {settingsStore.enableDetailedWorkoutSummary && (
        <View>
          {workout.exercises.map(exercise => (
            <Text
              key={exercise.guid}
              style={{ fontSize: theme.typography.fontSize.xs }}
            >
              {exercise.name}
            </Text>
          ))}
        </View>
      )}

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

export default observer(WorkoutReviewListItem)
