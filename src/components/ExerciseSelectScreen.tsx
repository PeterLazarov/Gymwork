import React, { useState } from "react"
import { View } from "react-native"

import { ExerciseSelectLists } from "@/components/shared/ExerciseSelectLists"
import { useCreateExercisesStep } from "@/db/hooks"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { WorkoutStep } from "@/db/schema"
import { FAB, Header, Icon, IconButton, Menu, spacing, useColors } from "@/designSystem"
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
  const { mutateAsync: createStep } = useCreateExercisesStep()
  const { selectMode } = useRouteParams("ExerciseSelect")
  const [menuOpen, setMenuOpen] = useState(false)

  async function createExercisesStep(exercises: ExerciseModel[]) {
    await createStep(exercises)

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

  function goToFeedback() {
    setMenuOpen(false)
    requestAnimationFrame(() => navigation.navigate("UserFeedback", { referrerPage: "ExerciseSelect" }))
  }

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
        <Menu
          visible={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          position="bottom-right"
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
            onPress={goToFeedback}
            title={translate("giveFeedback")}
          />
        </Menu>
      </Header>

      <View style={{ flex: 1 }}>
        <ExerciseSelectLists
          multiselect={selectMode === "superset"}
          selected={selectedExercises}
          onChange={selectMode === "superset" ? setSelectedExercises : createExercisesStep}
        />
      </View>

      {selectMode === "superset" && (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            bottom: spacing.lg,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FAB
            icon="check"
            disabled={selectedExercises.length < 2}
            onPress={() => createExercisesStep(selectedExercises)}
            style={{
              position: "relative",
              left: undefined,
              right: undefined,
            }}
          />
        </View>
      )}

    </BaseLayout>
  )
}
