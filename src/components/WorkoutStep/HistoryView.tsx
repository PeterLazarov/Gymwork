import { Pressable, StyleSheet, View } from "react-native"

import { StepSetsList } from "@/components/shared/StepSetsList"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { SetModel } from "@/db/models/SetModel"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { useExerciseHistoryQuery } from "@/db/queries/useExerciseHistoryQuery"
import { AppColors, Divider, EmptyState, spacing, Text, useColors } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { msToIsoDate, translate } from "@/utils"
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list"
import { DateTime } from "luxon"
import { useCallback, useMemo } from "react"

type HistoryViewProps = {
  exercise: ExerciseModel
}

export const HistoryView: React.FC<HistoryViewProps> = ({ exercise }) => {
  const colors = useColors()

  const styles = useMemo(() => makeStyles(colors), [colors])
  const { workouts: rawWorkouts } = useExerciseHistoryQuery(exercise.id!)

  const workouts = useMemo(() => rawWorkouts.map((item) => new WorkoutModel(item)), [rawWorkouts])

  return (
    <View style={styles.container}>
      {exercise && workouts?.length ? (
        <HistoryList
          workouts={workouts}
          exercise={exercise}
        />
      ) : (
        <EmptyState text={translate("historyLogEmpty")} />
      )}
    </View>
  )
}

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
      gap: spacing.lg,
      flexDirection: "column",
      display: "flex",
      flexGrow: 1,
    },
  })

type HistoryListProps = {
  workouts: WorkoutModel[]
  exercise: ExerciseModel
}
const HistoryList: React.FC<HistoryListProps> = ({ workouts, exercise }) => {
  const { setOpenedDate } = useOpenedWorkout()

  const stepsWithWorkout = useMemo(() => {
    return workouts.flatMap((workout) =>
      workout.workoutSteps.map((step: any) => ({
        step,
        workout,
      })),
    )
  }, [workouts])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<{ step: any; workout: any }>) => {
      return (
        <ListItem
          key={item.step.id}
          date={item.workout.date}
          step={item.step}
          sets={item.step.sets || []}
          workout={item.workout}
          onPress={() => {
            navigate("Workout")
            setOpenedDate(msToIsoDate(item.workout.date))
          }}
        />
      )
    },
    [setOpenedDate],
  )

  return (
    <FlashList
      data={stepsWithWorkout}
      renderItem={renderItem}
      keyExtractor={(item, i) => `${item.step.id}_${i}`}
    />
  )
}

type ListItemProps = {
  date: number
  step: WorkoutStepModel
  sets: SetModel[]
  workout: WorkoutModel
  onPress?(): void
}
const ListItem: React.FC<ListItemProps> = ({ date, step, sets, workout, onPress }) => {
  const colors = useColors()

  const styles = useMemo(() => makeItemStyles(colors), [colors])

  return (
    <Pressable
      style={styles.item}
      key={date}
      onPress={onPress}
    >
      <>
        <Text style={styles.itemDate}>
          {DateTime.fromMillis(date).toLocaleString(DateTime.DATE_MED)}
        </Text>
        <Divider
          orientation="horizontal"
          variant="neutral"
        />
        <View style={{ padding: spacing.xxs }}>
          <StepSetsList
            step={step}
            sets={sets}
            workout={workout}
            hideSupersetLetters
          />
        </View>
      </>
    </Pressable>
  )
}

const makeItemStyles = (colors: AppColors) =>
  StyleSheet.create({
    item: {
      gap: spacing.xs,
      marginBottom: spacing.sm,
      borderRadius: spacing.xs,
      borderColor: colors.onSurfaceVariant,
      borderWidth: 1,
    },
    itemDate: {
      textAlign: "center",
      paddingTop: spacing.xxs,
    },
  })
