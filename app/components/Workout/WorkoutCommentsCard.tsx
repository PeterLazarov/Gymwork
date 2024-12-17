import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { observer } from 'mobx-react-lite'

import {
  Text,
  Card,
  FeedbackPickerOption,
  fontSize,
  useColors,
  spacing,
} from 'designSystem'
import { discomfortOptions, feelingOptions, Workout } from 'app/db/models'
import { translate } from 'app/i18n'

type Props = {
  workout: Workout
  onPress?(): void
  compactMode?: boolean
}

const WorkoutCommentsCard: React.FC<Props> = ({
  workout,
  onPress,
  compactMode,
}) => {
  const colors = useColors()

  const styles = useMemo(
    () => makeStyles(colors, compactMode),
    [colors, compactMode]
  )

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

const makeStyles = (colors: any, compactMode?: boolean) =>
  StyleSheet.create({
    card: {
      padding: compactMode ? 0 : spacing.xs,
      paddingBottom: compactMode ? spacing.xs : 0,
    },
    cardContent: {
      alignItems: 'center',
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
