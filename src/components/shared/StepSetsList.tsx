import { useSetting } from "@/context/SettingContext"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { SetModel } from "@/db/models/SetModel"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { useRecordIdsQuery } from "@/db/queries/useRecordIdsQuery"
import { useSettingsQuery } from "@/db/queries/useSettingsQuery"
import { AppColors, Icon, Text, fontSize, palettes, spacing, useColors } from "@/designSystem"
import { getFormatedDuration, translate } from "@/utils"
import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"

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
  const { settings } = useSettingsQuery()
  const { recordIds } = useRecordIdsQuery(step.id)
  const showSetComplete = settings?.manual_set_completion && workout.hasIncompleteSets

  return (
    <>
      {sets.map((set, i) => (
        <SetItem
          key={set.id}
          set={set}
          exercise={set.exercise}
          isRecord={recordIds.some(({ id }) => id === set.id)}
          letter={hideSupersetLetters ? undefined : step.exerciseLettering[set.exercise.id!]}
          number={step.setsNumberMap[set.id!]}
          showSetComplete={showSetComplete}
        />
      ))}
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
  const { settings } = useSettingsQuery()
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
          value={set.reps ?? 0}
          unit={translate("reps")}
        />
      )}
      {exercise.hasMetricType("weight") && (
        <SetMetricLabel
          value={set.weight ?? 0}
          unit={exercise.getMetricByType("weight")!.unit}
        />
      )}
      {exercise.hasMetricType("distance") && (
        <SetMetricLabel
          value={set.distance ?? 0}
          unit={exercise.getMetricByType("distance")!.unit}
        />
      )}
      {exercise.hasMetricType("duration") && (
        <SetMetricLabel value={getFormatedDuration(set.durationMs ?? 0)} />
      )}
      {settings?.measure_rest && set.rest && (
        <SetMetricLabel
          value={getFormatedDuration(set.rest, true)}
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

type SetMetricLabelProps = {
  value?: string | number
  unit?: string
  fontSize?: keyof typeof fontSize
  fixDecimals?: boolean
}

const SetMetricLabel: React.FC<SetMetricLabelProps> = ({
  value,
  unit,
  fontSize: fontSizeProp,
  fixDecimals,
}) => {
  const colors = useColors()
  const styles = useMemo(() => makeMetricLabelStyles(colors, fontSizeProp), [colors, fontSizeProp])

  return (
    <View style={styles.container}>
      <Text style={styles.value}>
        {typeof value === "number" && fixDecimals ? value.toFixed(2) : value}
      </Text>
      {unit && <Text style={styles.unit}>{unit}</Text>}
    </View>
  )
}

const makeMetricLabelStyles = (colors: AppColors, fontSizeProp?: keyof typeof fontSize) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: spacing.xxs,
      // TODO: render metrics as grid instead of fixed width
      minWidth: spacing.xxl,
    },
    value: {
      fontWeight: "bold",
      color: colors.onSurface,
      fontSize: fontSizeProp ? fontSize[fontSizeProp] : fontSize.xs,
    },
    unit: {
      color: colors.onSurface,
      fontSize: fontSizeProp ? fontSize[fontSizeProp] : fontSize.xs,
    },
  })
