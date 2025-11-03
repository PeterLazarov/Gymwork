import { useDialogContext } from "@/context/DialogContext"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { useRemoveWorkoutStepQuery } from "@/db/queries/useRemoveWorkoutStepQuery"
import { useUpdateExerciseQuery } from "@/db/queries/useUpdateExerciseQuery"
import { useUpdateWorkoutStepExerciseQuery } from "@/db/queries/useUpdateWorkoutStepExerciseQuery"
import {
  boxShadows,
  fontSize,
  Header,
  Icon,
  IconButton,
  spacing,
  Text,
  useColors,
} from "@/designSystem"
import { WorkoutStepTabScreenProps } from "@/navigators/navigationTypes"
import { navigate } from "@/navigators/navigationUtilities"
import { translate } from "@/utils"
import React, { useMemo, useState } from "react"
import { View } from "react-native"
import { Menu } from "react-native-paper"
import { ExerciseSelectLists } from "@/components/shared/ExerciseSelectLists"
import { TrackView } from "./TrackView"
import { HistoryView } from "./HistoryView"
import { RecordsView } from "./RecordsView"
import { ChartView } from "./ChartView"
import { BaseLayout } from "@/layouts/BaseLayout"

export type WorkoutStepScreenParams = {
  focusedStep: WorkoutStepModel
}

export const WorkoutStepScreen: React.FC<
  WorkoutStepTabScreenProps<"Track" | "History" | "Chart" | "Records">
> = ({ route }) => {
  const { focusedStep: routeStep } = route.params
  const { openedWorkout } = useOpenedWorkout()
  const focusedStep = openedWorkout?.workoutSteps.find((s) => s.id === routeStep.id) || routeStep

  const [exerciseSelectOpen, setExerciseSelectOpen] = useState(false)
  const [focusedStepIndex, setFocusedStepIndex] = useState(0)
  const updateWorkoutStepExercise = useUpdateWorkoutStepExerciseQuery()
  const focusedExercise = focusedStep.exercises[focusedStepIndex]

  function switchExercise(exercise: ExerciseModel) {
    if (focusedExercise) {
      updateWorkoutStepExercise(focusedStep.id, focusedExercise.id!, exercise)
      setExerciseSelectOpen(false)
    }
  }

  return (
    <BaseLayout>
      <StepHeader
        step={focusedStep}
        focusedExercise={focusedExercise}
        onSwitchExercise={() => setExerciseSelectOpen(true)}
      />

      {exerciseSelectOpen && (
        <ExerciseSelectLists
          multiselect={false}
          selected={[]}
          onChange={([e]) => {
            if (e) {
              switchExercise(e)
            }
          }}
        />
      )}

      {!exerciseSelectOpen && (
        <>
          {focusedStep?.stepType === "superset" && (
            <ExerciseControl
              selectedIndex={focusedExercise ? focusedStep.exercises.indexOf(focusedExercise) : -1}
              options={focusedStep.exercises}
              onChange={setFocusedStepIndex}
            />
          )}

          {route.name === "Track" && (
            <TrackView
              exercise={focusedExercise}
              step={focusedStep}
              moveToNextExercise={() =>
                setFocusedStepIndex((prev) =>
                  prev === focusedStep.exercises.length - 1 ? 0 : prev + 1,
                )
              }
            />
          )}
          {route.name === "History" && <HistoryView exercise={focusedExercise} />}
          {route.name === "Records" && <RecordsView exercise={focusedExercise} />}
          {route.name === "Chart" && <ChartView exercise={focusedExercise} />}
        </>
      )}
    </BaseLayout>
  )
}

export type StepHeaderProps = {
  step: WorkoutStepModel
  focusedExercise: ExerciseModel
  onSwitchExercise: () => void
}

const StepHeader: React.FC<StepHeaderProps> = ({ step, focusedExercise, onSwitchExercise }) => {
  const colors = useColors()

  const { openedWorkout } = useOpenedWorkout()
  const [menuOpen, setMenuOpen] = useState(false)
  const { showSnackbar } = useDialogContext()
  const removeWorkoutStep = useRemoveWorkoutStepQuery()
  const updateExercise = useUpdateExerciseQuery()
  // const insertWorkoutStep = useInsertWorkoutStepQuery()

  const deleteSelectedExercises = () => {
    setMenuOpen(false)
    removeWorkoutStep(step.id)
    navigate("Workout")
    showSnackbar!({
      text: "Exercise was removed from workout",
      actionText: "Undo",
      action: () => {
        // TODO undo delete workout step
        // insertWorkoutStep(step)
      },
    })
  }

  const toggleFavoriteExercise = () => {
    setMenuOpen(false)
    updateExercise(focusedExercise.id!, { isFavorite: !focusedExercise.isFavorite })
  }

  function onSwitchExercisePress() {
    setMenuOpen(false)
    onSwitchExercise()
  }

  function onEditExercisePress() {
    setMenuOpen(false)
    navigate("ExerciseEdit", { edittedExercise: focusedExercise })
  }
  function goToFeedback() {
    setMenuOpen(false)
    navigate("UserFeedback", { referrerPage: "WorkoutStep" })
  }
  function goToInstructions() {
    setMenuOpen(false)
    navigate("ExerciseDetails", { exerciseId: step.exercise.id! })
  }
  function goBack() {
    navigate("Workout")
  }

  const focusedStepName = useMemo(() => {
    const name = step.stepType === "plain" ? step.exercise.name : "Superset"
    let similarSteps = openedWorkout?.workoutSteps.filter((s) => s.stepType === step.stepType) || []

    if (step.stepType === "plain") {
      similarSteps = similarSteps.filter((s) => s.exercises.includes(focusedExercise))
    }

    const n = similarSteps.indexOf(step) + 1

    return `${name} ${similarSteps.length > 1 ? n : ""}`
  }, [step.exercise.id, step.exercises])

  return (
    <Header>
      <IconButton
        onPress={goBack}
        underlay="darker"
      >
        <Icon
          color={colors.onPrimary}
          icon="chevron-back"
        />
      </IconButton>
      <Header.Title
        title={focusedStepName}
        numberOfLines={1}
      />

      <Menu
        visible={menuOpen}
        onDismiss={() => setMenuOpen(false)}
        anchorPosition="bottom"
        anchor={
          <IconButton
            onPress={() => setMenuOpen(true)}
            underlay="darker"
          >
            <Icon
              icon="ellipsis-vertical"
              color={colors.onPrimary}
            />
          </IconButton>
        }
      >
        <Menu.Item
          onPress={onSwitchExercisePress}
          title={translate("switchExercise")}
        />
        <Menu.Item
          onPress={onEditExercisePress}
          title={translate("editExercise")}
        />
        <Menu.Item
          onPress={deleteSelectedExercises}
          title={translate("removeFromWorkout")}
        />
        <Menu.Item
          onPress={toggleFavoriteExercise}
          title={translate(focusedExercise.isFavorite ? "removeFavorite" : "setAsFavorite")}
        />
        <Menu.Item
          onPress={goToInstructions}
          title={translate("viewInstructions")}
        />

        <Menu.Item
          onPress={goToFeedback}
          title={translate("giveFeedback")}
        />
      </Menu>
    </Header>
  )
}

type ExerciseControlProps = {
  options: ExerciseModel[]
  selectedIndex: number
  onChange: (index: number) => void
}

const ExerciseControl: React.FC<ExerciseControlProps> = ({ options, selectedIndex, onChange }) => {
  const colors = useColors()

  const exercise = options[selectedIndex]!
  const atStart = selectedIndex === 0
  const atEnd = selectedIndex === options.length - 1

  const getPrev = () => {
    onChange(atStart ? options.length - 1 : selectedIndex - 1)
  }

  const getNext = () => {
    onChange(atEnd ? 0 : selectedIndex + 1)
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.surfaceContainerLowest,
        padding: spacing.xxs,
        ...boxShadows.default,
      }}
    >
      <IconButton onPress={getPrev}>
        <Icon icon="chevron-back" />
      </IconButton>

      <Text
        style={{ fontSize: fontSize.lg, flex: 1 }}
        numberOfLines={1}
      >
        {exercise.name}
      </Text>

      <IconButton onPress={getNext}>
        <Icon icon="chevron-forward" />
      </IconButton>
    </View>
  )
}
