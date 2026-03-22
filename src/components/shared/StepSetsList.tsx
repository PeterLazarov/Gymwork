import { durationFormats } from "@/constants/enums"
import { useRecords, useSettings } from "@/db/hooks"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { SetModel } from "@/db/models/SetModel"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { AppColors, Icon, Text, fontSize, palettes, spacing, useColors } from "@/designSystem"
import { getFormatedDuration, translate } from "@/utils"
import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { SetMetricLabel } from "./SetMetricLabel"

export type StepSetsListProps = {
  step: WorkoutStepModel
  sets: SetModel[]
  hideSupersetLetters?: boolean
  workout: WorkoutModel
}

export const StepSetsList: React.FC<StepSetsListProps> = ({
  step,
  sets,
  hideSupersetLetters = false,
  workout,
}) => {
  const { data: settings } = useSettings()
  const { data: records } = useRecords(step.id)
  const showSetComplete = settings?.manual_set_completion && workout.hasIncompleteSets

  return (
    <>
      {sets.map((set, i) => {
        const record = records?.find(({ id }) => id === set.id)
        return (
          <SetItem
            key={set.id}
            set={set}
            exercise={set.exercise}
            isRecord={!!record && !record.isWeakAss}
            letter={hideSupersetLetters ? undefined : step.exerciseLettering[set.exercise.id!]}
            number={step.setsNumberMap[set.id!]}
            showSetComplete={showSetComplete}
          />
        )
      })}
    </>
  )
}

type SetItemProps = {
  set: SetModel
  exercise: ExerciseModel
  letter?: string
  number?: number
  isFocused?: boolean
  isRecord?: boolean
  showSetComplete?: boolean
}

const SetItem: React.FC<SetItemProps> = ({
  set,
  exercise,
  isRecord,
  letter,
  number,
  showSetComplete,
}) => {
  const colors = useColors()
  const { data: settings } = useSettings()
  const styles = useMemo(() => makeSetItemStyles(colors), [colors])

  return (
    <View style={styles.item}>
      <View style={styles.indexColumn}>
        {!set.isWarmup && (
          <Text
            style={styles.setNumber}
            text={`${number}.`}
          />
        )}
        {set.isWarmup && (
          <Icon
            icon="yoga"
            color={colors.onSurface}
          />
        )}
        {letter && <Text style={styles.setLetter}>{letter}</Text>}
        {isRecord && (
          <Icon
            icon="trophy"
            color={palettes.gold["80"]}
          />
        )}
      </View>
      {exercise.hasMetricType("reps") && (
        <SetMetricLabel
          testID={number != null ? `set-${number}-reps` : undefined}
          value={set.reps ?? 0}
          unit={translate("measurements.reps")}
        />
      )}
      {exercise.hasMetricType("weight") && (
        <SetMetricLabel
          testID={number != null ? `set-${number}-weight` : undefined}
          value={set.weight ?? 0}
          unit={exercise.getMetricByType("weight")!.unit}
        />
      )}
      {exercise.hasMetricType("distance") && (
        <SetMetricLabel
          testID={number != null ? `set-${number}-distance` : undefined}
          value={set.distance ?? 0}
          unit={exercise.getMetricByType("distance")!.unit}
        />
      )}
      {exercise.hasMetricType("duration") && (
        <SetMetricLabel
          testID={number != null ? `set-${number}-duration` : undefined}
          value={getFormatedDuration(
            set.durationMs ?? 0,
            exercise.getMetricByType("duration")!.duration_format,
          )}
        />
      )}
      {settings?.measure_rest && set.rest && (
        <SetMetricLabel
          testID={number != null ? `set-${number}-rest` : undefined}
          value={getFormatedDuration(set.rest, durationFormats.mm_ss)}
          unit={translate("rest")}
        />
      )}

      {showSetComplete && (
        <Icon
          size="small"
          icon={"check"}
          color={set.completedAt ? colors.primary : colors.outlineVariant}
        />
      )}
    </View>
  )
}

const makeSetItemStyles = (colors: AppColors) =>
  StyleSheet.create({
    item: {
      display: "flex",
      flexDirection: "row",
      gap: spacing.md,
      alignItems: "center",
      height: 24,
    },
    indexColumn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xxs,
    },
    setNumber: {
      fontSize: fontSize.sm,
      color: colors.onSurface,
      fontWeight: "bold",
      marginLeft: spacing.xs,
    },
    setLetter: {
      fontSize: fontSize.sm,
      color: colors.onSurface,
      fontWeight: "bold",
    },
  })
