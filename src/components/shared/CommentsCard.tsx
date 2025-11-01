import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"

import { Discomfort, Feeling, discomfortOptions, feelingOptions } from "@/constants/enums"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { Card, FeedbackPicker, fontSize, spacing, Text, useColors } from "@/designSystem"
import { translate } from "@/utils"

type Props = {
  workout: WorkoutModel
  onPress?(): void
  compactMode?: boolean
}

export const CommentsCard: React.FC<Props> = ({ workout, onPress, compactMode }) => {
  const colors = useColors()

  const styles = useMemo(() => makeStyles(colors, compactMode), [colors, compactMode])

  return (
    <Card
      style={styles.card}
      onPress={onPress}
      content={
        <View style={styles.cardContent}>
          {!!workout.name?.trim() && (
            <View style={styles.notesContainer}>
              <Text style={styles.name}>{workout.name}</Text>
            </View>
          )}
          {!!workout.notes?.trim() && (
            <View style={styles.notesContainer}>
              <Text style={styles.notes}>{workout.notes}</Text>
            </View>
          )}

          <View style={styles.stickerPanel}>
            {workout.rpe && (
              <Text style={styles.difficultyLabel}>
                {translate("diffValue", { rpe: workout.rpe })}
              </Text>
            )}
            {workout.pain && (
              <FeedbackPicker.Option
                option={discomfortOptions[workout.pain as Discomfort]}
                isSelected
                style={styles.sticker}
                compactMode={compactMode}
              />
            )}
            {workout.feeling && (
              <FeedbackPicker.Option
                option={feelingOptions[workout.feeling as Feeling]}
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
    name: {
      fontSize: fontSize.md,
      color: colors.onSurface,
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
