import { observer } from 'mobx-react-lite'
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { MuscleMap } from '@/components/MuscleMap/MuscleMap'
import { useStores } from '@/db/helpers/useStores'
import { useAppTheme } from '@/utils/useAppTheme'
import WorkoutCommentsCard from 'app/components/Workout/WorkoutCommentsCard'
import { Workout } from 'app/db/models'
import { formatDateIso } from 'app/utils/date'
import { Text, ThemedStyle } from 'designSystem'
import { palettes } from 'designSystem/theme/colors'

type WorkoutReviewListItemProps = {
  workout: Workout
  onPress: () => void
}

const WorkoutReviewListItem: React.FC<WorkoutReviewListItemProps> = ({
  workout,
  onPress,
}) => {
  const { theme, themed } = useAppTheme()

  const { settingsStore } = useStores()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.item}
    >
      <Text style={themed($title)}>{formatDateIso(workout.date, 'long')}</Text>

      {settingsStore.enableDetailedWorkoutSummary && (
        <View style={{ gap: theme.spacing.sm }}>
          {/* Muscles */}
          <View
            // eslint-disable-next-line react-native/no-color-literals
            style={themed($section)}
          >
            <Text style={{ flex: 1, textAlign: 'center' }}>Muscles</Text>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  maxHeight: 200,
                  flex: 1,
                }}
              >
                <MuscleMap
                  muscles={workout.muscles}
                  back={false}
                  activeColor={palettes.gold['80']}
                  inactiveColor={theme.colors.outline}
                  baseColor={theme.colors.shadow}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  maxHeight: 200,
                }}
              >
                <MuscleMap
                  muscles={workout.muscles}
                  back={true}
                  activeColor={palettes.gold['80']}
                  inactiveColor={theme.colors.outline}
                  baseColor={theme.colors.shadow}
                />
              </View>
            </View>
          </View>

          {/* Duration */}
          <View style={themed($section)}>
            <Text>Duration: {workout?.duration?.toFormat('hh:mm:ss')}</Text>
            <Text>
              Start: {workout.firstAddedSet.createdAt.toLocaleTimeString()}
            </Text>
            <Text>
              End: {workout.lastAddedSet?.createdAt.toLocaleTimeString()}
            </Text>
          </View>

          {/* Exercises */}
          <View style={themed($section)}>
            <View>
              <Text>Exercises:</Text>
            </View>
            <View>
              {workout.exercises.map(exercise => (
                <Text
                  key={exercise.guid}
                  // style={{ fontSize: theme.typography.fontSize.xs }}
                >
                  {exercise.name}
                </Text>
              ))}
            </View>
          </View>
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
})

const $section: ThemedStyle<ViewStyle> = theme => ({
  backgroundColor: theme.colors.surfaceContainer,
  borderRadius: theme.spacing.sm,
  padding: theme.spacing.lg,
})
const $title: ThemedStyle<TextStyle> = theme => ({
  fontSize: theme.typography.fontSize.xl,
  lineHeight: theme.typography.fontSize.xl * 3,
  textAlign: 'center',
})

export default observer(WorkoutReviewListItem)
