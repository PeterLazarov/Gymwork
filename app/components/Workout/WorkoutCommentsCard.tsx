import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { discomfortOptions, feelingOptions, Workout } from 'app/db/models'
import { translate } from 'app/i18n'
import {
  Card,
  FeedbackPickerOption,
  fontSize,
  spacing,
  Text,
} from 'designSystem'

export type WorkoutCommentsCardProps = {
  workout: Workout
  onPress?(): void
  compactMode?: boolean
}

const WorkoutCommentsCard: React.FC<WorkoutCommentsCardProps> = ({
  workout,
  onPress,
  compactMode,
}) => {
  const {
    theme: { colors },
  } = useAppTheme()

  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <Card
      style={styles.card}
      onPress={onPress}
      content={
        <View style={styles.cardContent}>
          {workout.notes !== '' && (
            <View style={styles.notesContainer}>
              <Text style={styles.notes}>{workout.notes}</Text>
            </View>
          )}

          <View style={styles.stickerPanel}>
            {workout.rpe !== undefined && (
              <Text style={styles.difficultyLabel}>
                {translate('diffValue', { rpe: workout.rpe })}
              </Text>
            )}
            {workout.pain && (
              <FeedbackPickerOption
                option={discomfortOptions[workout.pain]}
                isSelected
                style={styles.sticker}
                compactMode={compactMode}
              />
            )}
            {workout.feeling && (
              <FeedbackPickerOption
                option={feelingOptions[workout.feeling]}
                isSelected
                style={styles.sticker}
                compactMode={compactMode}
              />
            )}
          </View>
        </View>
      }
    />
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      paddingTop: 0,
      paddingHorizontal: spacing.xs,
      paddingBottom: spacing.xs,
    },
    cardContent: {
      // alignItems: 'center',
      gap: spacing.xs,
    },
    difficultyLabel: {
      flex: 1,
      textAlign: 'center',
    },
    notes: {
      color: colors.onSurface,
      fontSize: fontSize.sm,
    },
    notesContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingTop: spacing.xs,
    },
    sticker: {
      backgroundColor: 'transparent',
      flex: 1,
    },
    stickerPanel: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
  })

export default observer(WorkoutCommentsCard)
