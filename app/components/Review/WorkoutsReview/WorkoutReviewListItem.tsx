import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { MuscleMap } from 'app/components/MuscleMap/MuscleMap'
import { discomfortOptions, Workout } from 'app/db/models'
import { translate } from 'app/i18n'
import { formatDateIso } from 'app/utils/date'
import { fontSize, palettes, spacing, Text, useColors } from 'designSystem'

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

  // Memoize MuscleMap props to avoid unnecessary re-renders
  const muscles = useMemo(() => workout.muscles, [workout.muscles])
  const muscleAreas = useMemo(() => workout.muscleAreas, [workout.muscleAreas])

  // Move dynamic styles to useMemo
  const muscleMapContainerStyle = useMemo(
    () => [styles.muscleMapContainer],
    [styles]
  )
  const rowStyle = useMemo(() => [styles.row], [styles])
  const betweenStyle = useMemo(() => [styles.between], [styles])

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
    >
      <View>
        <View style={betweenStyle}>
          <View>
            <Text style={styles.title}>
              {formatDateIso(workout.date, 'long')}
            </Text>
          </View>

          <View style={rowStyle}>
            <View style={muscleMapContainerStyle}>
              <MuscleMap
                muscles={muscles}
                muscleAreas={muscleAreas}
                back={false}
                activeColor={palettes.gold['80']}
                inactiveColor={colors.outline}
                baseColor={colors.bodyBase}
              />
            </View>
            <View style={muscleMapContainerStyle}>
              <MuscleMap
                muscles={muscles}
                muscleAreas={muscleAreas}
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
    muscleMapContainer: {
      height: 80,
      width: 60,
    },
    row: {
      flexDirection: 'row',
    },
    between: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  })

// Wrap with React.memo in addition to observer
export default React.memo(observer(WorkoutReviewListItem))
