import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"

import { Text, Card, FeedbackPicker, fontSize, useColors, spacing } from "@/designSystem"
import { translate } from "@/utils"
import { Workout } from "@/db/schema"
import { discomfortOptions, feelingOptions } from "@/db/enums"

type Props = {
  workout: Workout
  onPress?(): void
  compactMode?: boolean
}

export const WorkoutCommentsCard: React.FC<Props> = ({ workout, onPress, compactMode }) => {
  const colors = useColors()

  const styles = useMemo(() => makeStyles(colors, compactMode), [colors, compactMode])

  return (
    <Card
      style={styles.card}
      onPress={onPress}
      content={
        <View style={styles.cardContent}>
          {workout.notes !== "" && (
            <View style={styles.notesContainer}>
              <Text style={styles.notes}>{workout.notes}</Text>
            </View>
          )}

          <View style={styles.stickerPanel}>
            {workout.rpe !== undefined && (
              <Text style={styles.difficultyLabel}>
                {translate("diffValue", { rpe: workout.rpe })}
              </Text>
            )}
            {workout.pain && (
              <FeedbackPicker.Option
                option={discomfortOptions[workout.pain as keyof typeof discomfortOptions]}
                isSelected
                style={styles.sticker}
                compactMode={compactMode}
              />
            )}
            {workout.feeling && (
              <FeedbackPicker.Option
                option={feelingOptions[workout.feeling as keyof typeof feelingOptions]}
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
      gap: spacing.xs,
    },
    notesContainer: {
      flexDirection: "row",
      gap: spacing.sm,
      paddingTop: spacing.xs,
      paddingHorizontal: compactMode ? spacing.xs : 0,
    },
    notes: {
      fontSize: fontSize.sm,
      color: colors.onSurface,
    },
    stickerPanel: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
    },
    difficultyLabel: {
      flex: 1,
      textAlign: "center",
    },
    sticker: {
      backgroundColor: "transparent",
      flex: 1,
    },
  })
