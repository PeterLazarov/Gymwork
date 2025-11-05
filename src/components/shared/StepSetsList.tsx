import { useSetting } from "@/context/SettingContext"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { SetModel } from "@/db/models/SetModel"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { useRecordIdsQuery } from "@/db/queries/useRecordIdsQuery"
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
  const { showSetCompletion: showSetCompletionSetting } = useSetting()
  const { recordIds } = useRecordIdsQuery(step.id)
  // TODO deduplicate
  const showSetCompletion = showSetCompletionSetting && workout.hasIncompleteSets

  return (
    <>
      {sets.map((set, i) => (
        <SetItem
          key={set.id}
          set={set}
          exercise={set.exercise}
          isRecord={recordIds.some(({ id }) => id === set.id)}
          // isFocused={stateStore.highlightedSetGuid === set.id}
          letter={hideSupersetLetters ? undefined : step.exerciseLettering[set.exercise.id!]}
          number={step.setsNumberMap[set.id!]}
          showSetCompletion={showSetCompletion}
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
  showSetCompletion?: boolean
}

const SetItem: React.FC<SetItemProps> = ({
  set,
  exercise,
  isFocused,
  isRecord,
  letter,
  number,
  showSetCompletion,
}) => {
  const colors = useColors()
  const color = isFocused ? colors.tertiary : colors.onSurface
  const styles = useMemo(() => makeSetItemStyles(color), [color])

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
            color={color}
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
          isFocused={isFocused}
        />
      )}
      {exercise.hasMetricType("weight") && (
        <SetMetricLabel
          value={set.weight ?? 0}
          unit={exercise.getMetricByType("weight")!.unit}
          isFocused={isFocused}
        />
      )}
      {exercise.hasMetricType("distance") && (
        <SetMetricLabel
          value={set.distance ?? 0}
          unit={exercise.getMetricByType("distance")!.unit}
          isFocused={isFocused}
        />
      )}
      {exercise.hasMetricType("duration") && (
        <SetMetricLabel
          value={getFormatedDuration(set.durationMs ?? 0)}
          isFocused={isFocused}
        />
      )}
      {exercise.hasMetricType("rest") && (
        <SetMetricLabel
          value={getFormatedDuration(set.restMs!)}
          isFocused={isFocused}
        />
      )}

      {showSetCompletion && (
        <Icon
          size="small"
          icon={"check"}
          color={set.isComplete ? color : colors.outlineVariant}
        />
      )}
    </View>
  )
}

const makeSetItemStyles = (textColor: string) =>
  StyleSheet.create({
    item: {
      display: "flex",
      flexDirection: "row",
      gap: spacing.md,
      justifyContent: "space-around",
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
      color: textColor,
      fontWeight: "bold",
      marginLeft: spacing.xs,
    },
    setLetter: {
      fontSize: fontSize.sm,
      color: textColor,
      fontWeight: "bold",
    },
  })

type SetMetricLabelProps = {
  value?: string | number
  unit?: string
  isFocused?: boolean
  fontSize?: keyof typeof fontSize
  fixDecimals?: boolean
}

const SetMetricLabel: React.FC<SetMetricLabelProps> = ({
  value,
  unit,
  isFocused,
  fontSize: fontSizeProp,
  fixDecimals,
}) => {
  const colors = useColors()
  const styles = useMemo(
    () => makeMetricLabelStyles(colors, isFocused, fontSizeProp),
    [colors, isFocused, fontSizeProp],
  )

  return (
    <View style={styles.container}>
      <Text style={styles.value}>
        {typeof value === "number" && fixDecimals ? value.toFixed(2) : value}
      </Text>
      {unit && <Text style={styles.unit}>{unit}</Text>}
    </View>
  )
}

const makeMetricLabelStyles = (
  colors: AppColors,
  isFocused?: boolean,
  fontSizeProp?: keyof typeof fontSize,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      gap: spacing.xxs,
      justifyContent: "center",
    },
    value: {
      fontWeight: "bold",
      color: isFocused ? colors.tertiary : colors.onSurface,
      fontSize: fontSizeProp ? fontSize[fontSizeProp] : fontSize.xs,
    },
    unit: {
      color: isFocused ? colors.tertiary : colors.onSurface,
      fontSize: fontSizeProp ? fontSize[fontSizeProp] : fontSize.xs,
    },
  })
