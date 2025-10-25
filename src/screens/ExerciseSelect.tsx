import React, { useState } from "react"
import { View } from "react-native"

import { translate } from "@/utils"
import { FAB, Header, Icon, IconButton, useColors } from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { AppStackScreenProps, useRouteParams } from "@/navigators/navigationTypes"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { WorkoutStep } from "@/db/schema"
import { ExerciseSelectLists } from "@/components/Exercise/ExerciseSelectListTabs"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { useInsertWorkoutQuery } from "@/db/queries/useInsertWorkoutQuery"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { useInsertExerciseInWorkoutQuery } from "@/db/queries/useInsertExerciseInWorkoutQuery"

export type ExerciseSelectScreenParams = {
  selectMode: WorkoutStep["step_type"]
}
interface ExerciseSelectScreenProps extends AppStackScreenProps<"ExerciseSelect"> {}

export const ExerciseSelectScreen: React.FC<ExerciseSelectScreenProps> = ({ navigation }) => {
  const colors = useColors()

  const [selectedExercises, setSelectedExercises] = useState<ExerciseModel[]>([])
  const { openedWorkout, openedDateObject } = useOpenedWorkout()
  const insertWorkout = useInsertWorkoutQuery()
  const insertExerciseInWorkout = useInsertExerciseInWorkoutQuery()
  const { selectMode } = useRouteParams("ExerciseSelect")

  async function createExercisesStep(exercises: ExerciseModel[]) {
    let workout = openedWorkout
    if (!workout) {
      const result = await insertWorkout({ date: openedDateObject.toMillis() })
      workout = new WorkoutModel(result)
    }

    await insertExerciseInWorkout(exercises[0].id, workout.id)

    navigation.navigate("Workout")
  }

  function onBackPress() {
    navigation.navigate("Workout")
  }

  function onAddExercisePress() {
    // navigation.navigate("ExerciseEdit", {
    //   createMode: true,
    // })
  }

  const supersetTitle =
    selectedExercises.length > 0
      ? translate("selectedCount", { count: selectedExercises.length })
      : translate("selectExercises")

  return (
    <BaseLayout>
      <View style={{ flex: 1, alignItems: "center" }}>
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
      </View>
    </BaseLayout>
  )
}
