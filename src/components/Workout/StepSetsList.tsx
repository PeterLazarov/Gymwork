import { WorkoutStep, Set, ExerciseMetric } from "@/db/schema"
import { Icon, Text, fontSize, palettes, spacing, useColors } from "@/designSystem"
import { getFormatedDuration, translate } from "@/utils"
import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"

export type StepSetsListProps = {
  step: WorkoutStep
  sets: Set[]
  hideSupersetLetters?: boolean
}

export const StepSetsList: React.FC<StepSetsListProps> = ({
  step,
  sets,
  hideSupersetLetters = false,
}) => {
  const stepRecords = computed(() => recordStore.getRecordsForStep(step)).get()
  // TODO deduplicate
  const showSetCompletion =
    settingsStore.showSetCompletion && getParentOfType(step, WorkoutModel).hasIncompleteSets

  return (
    <>
      {sets.map((set, i) => (
        <SetItem
          key={set.id}
          set={set}
          metrics={set.exercise.metrics}
          isRecord={stepRecords.some(({ id }) => id === set.id)}
          isFocused={stateStore.highlightedSetGuid === set.id}
          letter={hideSupersetLetters ? undefined : step.exerciseLettering[set.exercise.id]}
          number={step.setNumberMap[set.id]}
          showSetCompletion={showSetCompletion}
        />
      ))}
    </>
  )
}

type SetItemProps = {
  set: Set
  metrics: ExerciseMetric
  letter?: string
  number?: number
  isFocused?: boolean
  isRecord?: boolean
  showSetCompletion?: boolean
}

const SetItem: React.FC<SetItemProps> = ({
  set,
  metrics,
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
      {metrics.reps && (
        <SetMetricLabel
          value={set.reps}
          unit={translate("reps")}
          isFocused={isFocused}
        />
      )}
      {metrics.weight && (
        <SetMetricLabel
          value={set.weight}
          unit={metrics.weight!.unit}
          isFocused={isFocused}
        />
      )}
      {metrics.distance && (
        <SetMetricLabel
          value={set.distance}
          unit={metrics.distance.unit}
          isFocused={isFocused}
        />
      )}
      {metrics.duration && set.duration !== undefined && (
        <SetMetricLabel
          value={getFormatedDuration(set.duration)}
          isFocused={isFocused}
        />
      )}
      {metrics.measureRest && set.rest !== undefined && (
        <SetMetricLabel
          value={getFormatedDuration(set.rest)}
          isFocused={isFocused}
        />
      )}

      {showSetCompletion && (
        <Icon
          size="small"
          icon={"check"}
          color={set.completed ? color : colors.outlineVariant}
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
  colors: any,
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
