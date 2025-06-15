import { observer } from 'mobx-react-lite'
import { TouchableOpacity, View, StyleSheet } from 'react-native'

import { MuscleMap } from 'app/components/MuscleMap/MuscleMap'
import { discomfortOptions, Workout } from 'app/db/models'
import { formatDateIso } from 'app/utils/date'
import { fontSize, palettes, spacing, Text, useColors } from 'designSystem'
import { translate } from 'app/i18n'

type WorkoutReviewListItemProps = {
  workout: Workout
  onPress: () => void
}

const WorkoutReviewListItem: React.FC<WorkoutReviewListItemProps> = ({
  workout,
  onPress,
}) => {
  const colors = useColors()
  const styles = makeStyles(colors)

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
    >
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={styles.title}>
              {formatDateIso(workout.date, 'long')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                height: 80,
                width: 60,
              }}
            >
              <MuscleMap
                muscles={workout.muscles}
                muscleAreas={workout.muscleAreas}
                back={false}
                activeColor={palettes.gold['80']}
                inactiveColor={colors.outline}
                baseColor={colors.bodyBase}
              />
            </View>
            <View
              style={{
                height: 80,
                width: 60,
              }}
            >
              <MuscleMap
                muscles={workout.muscles}
                muscleAreas={workout.muscleAreas}
                back={true}
                activeColor={palettes.gold['80']}
                inactiveColor={colors.outline}
                baseColor={colors.bodyBase}
              />
            </View>
          </View>
        </View>
      </View>

      {/* 3col */}
      <View style={styles.stats}>
        {workout.duration !== undefined && (
          <View style={styles.surface}>
            <Text
              numberOfLines={1}
              style={styles.surfaceTitle}
            >
              {translate('duration')}
            </Text>

            <Text
              numberOfLines={1}
              style={styles.surfaceBodyBold}
            >
              {translate('durationMinutes' as any, {
                count: Math.ceil(workout.duration?.as('minutes')),
              })}
            </Text>
          </View>
        )}

        {workout.rpe && (
          <View style={styles.surface}>
            <Text
              numberOfLines={1}
              style={styles.surfaceTitle}
            >
              {translate('difficulty')}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.surfaceBodyBold}
            >
              {translate('diffValue', { rpe: workout.rpe })}
            </Text>
          </View>
        )}

        {workout.pain && (
          <View style={styles.surface}>
            <Text
              numberOfLines={1}
              style={styles.surfaceTitle}
            >
              {translate('discomfort')}
            </Text>

            <Text
              numberOfLines={1}
              style={styles.surfaceBodyBold}
            >
              {discomfortOptions[workout.pain].label}
            </Text>
          </View>
        )}
      </View>

      {workout.comments.notes.length > 0 && (
        <View style={styles.surface}>
          <Text>{workout.comments.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      padding: spacing.xs,
      gap: spacing.sm,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: '500',
      marginLeft: spacing.sm,
      textAlign: 'center',
    },
    stats: { flex: 1, gap: spacing.xs, flexDirection: 'row' },
    surface: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: spacing.sm,
      padding: spacing.sm,
      flex: 1,
    },
    surfaceTitle: {
      fontSize: fontSize.xs,
      color: colors.onSurfaceVariant,
      textTransform: 'capitalize',
    },
    surfaceBodyBold: {
      fontSize: fontSize.sm,
      fontWeight: '500',
      color: colors.onSurface,
    },
  })

export default observer(WorkoutReviewListItem)
