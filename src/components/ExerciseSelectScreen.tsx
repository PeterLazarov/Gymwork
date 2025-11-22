import React, { useState } from "react"
import { View } from "react-native"

import { ExerciseSelectLists } from "@/components/shared/ExerciseSelectLists"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useInsertWorkout, useInsertWorkoutStep } from "@/db/hooks"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { WorkoutStep } from "@/db/schema"
import { FAB, Header, Icon, IconButton, useColors } from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { AppStackScreenProps, useRouteParams } from "@/navigators/navigationTypes"
import { translate } from "@/utils"

export type ExerciseSelectScreenParams = {
  selectMode: WorkoutStep["step_type"]
}
interface ExerciseSelectScreenProps extends AppStackScreenProps<"ExerciseSelect"> {}

export const ExerciseSelectScreen: React.FC<ExerciseSelectScreenProps> = ({ navigation }) => {
  const colors = useColors()

  const [selectedExercises, setSelectedExercises] = useState<ExerciseModel[]>([])
  const { openedWorkout, openedDateMs } = useOpenedWorkout()
  const { mutateAsync: insertWorkout } = useInsertWorkout()
  const { mutateAsync: insertExerciseInWorkout } = useInsertWorkoutStep()
  const { selectMode } = useRouteParams("ExerciseSelect")

  async function createExercisesStep(exercises: ExerciseModel[]) {
    let workoutId = openedWorkout?.id
    if (!workoutId) {
      const result = await insertWorkout({ date: openedDateMs })
      workoutId = result[0].id
    }

    await insertExerciseInWorkout({ exercises, workoutId })

    navigation.navigate("Workout")
  }

  function onBackPress() {
    navigation.navigate("Workout")
  }

  function onAddExercisePress() {
    navigation.navigate("ExerciseEdit", {})
  }

  const supersetTitle =
    selectedExercises.length > 0
      ? translate("selectedCount", { count: selectedExercises.length })
      : translate("selectExercises")

  return (
    <BaseLayout>
      <Header>
        <IconButton
          onPress={onBackPress}
          underlay="darker"
        >
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title
          title={selectMode === "plain" ? translate("selectExercise") : supersetTitle}
        />
        <IconButton
          onPress={onAddExercisePress}
          underlay="darker"
        >
          <Icon
            icon="add"
            size="large"
            color={colors.onPrimary}
          />
        </IconButton>
      </Header>

      <View style={{ flex: 1 }}>
        <ExerciseSelectLists
          multiselect={selectMode === "superset"}
          selected={selectedExercises}
          onChange={selectMode === "superset" ? setSelectedExercises : createExercisesStep}
        />
      </View>
      {selectMode === "superset" && (
        <FAB
          icon="check"
          disabled={selectedExercises.length < 2}
          onPress={() => createExercisesStep(selectedExercises)}
        />
      )}
    </BaseLayout>
  )
}
