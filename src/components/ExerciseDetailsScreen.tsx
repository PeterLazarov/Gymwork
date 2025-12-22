import { FC, useState } from "react"
import { Image, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native"

import { useDeleteExercise, useExercise, useWorkoutsForExercise } from "@/db/hooks"
import { Exercise } from "@/db/schema"
import { fontSize, Header, Icon, IconButton, Menu, spacing, Text, useColors } from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { AppStackParamList, AppStackScreenProps, useRouteParams } from "@/navigators/navigationTypes"
import { msToIsoDate, translate } from "@/utils"
import { exerciseImages } from "@/utils/exerciseImages"
import { useDialogContext } from "@/context/DialogContext"

export type ExerciseDetailsScreenParams = {
  exerciseId: Exercise["id"]
}
interface ExerciseDetailsScreenProps extends AppStackScreenProps<"ExerciseDetails"> {}

export const ExerciseDetailsScreen: FC<ExerciseDetailsScreenProps> = ({ navigation }) => {
  const { exerciseId } = useRouteParams("ExerciseDetails")
  const { data: exercise } = useExercise(exerciseId)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: exerciseHistoryRaw } = useWorkoutsForExercise(exerciseId)
  const { mutateAsync: deleteExercise } = useDeleteExercise()
  const { showConfirm } = useDialogContext()

  const colors = useColors()
  const { width } = useWindowDimensions()
  const imgHeight = (width / 16) * 9

  const imageUri = exercise?.images?.[0]

  function onBackPress() {
    navigation.goBack()
  }

  function goBackSkipStepDetails() {
    const prevScreen = navigation.getState().routes[navigation.getState().routes.length - 2].name
    if (prevScreen === "WorkoutStep") {
      navigation.goBack()
    }
    navigation.goBack()
  }

  function onDeleteExercisePress() {
    if (exerciseHistoryRaw && exerciseHistoryRaw.length > 0) {
      showConfirm?.({
        message: translate("exerciseInUse", { dates: exerciseHistoryRaw.map((w) => msToIsoDate(w.date!)).join(", ") }),
        onConfirm: async () => {
          deleteExercise({ id: exerciseId })
          goBackSkipStepDetails()
        },
      })
    } else {
      deleteExercise({ id: exerciseId })
      goBackSkipStepDetails()
    }
  }

  function onEditInstructionsPress() {
    
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
        <Header.Title title={translate("exerciseDetails")} />
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
            onPress={onEditInstructionsPress}
            title={translate("editInstructions")}
          />
          <Menu.Item
            onPress={onDeleteExercisePress}
            title={translate("deleteExercise")}
          />
        </Menu>
      </Header>
      <Image
        style={{ width, height: imgHeight }}
        source={imageUri && imageUri in exerciseImages ? exerciseImages[imageUri] : exerciseImages["Image Missing"]}
      />

      <ScrollView style={styles.container}>
        {!!exercise?.instructions?.length && (
          <View
            style={{
              gap: spacing.md,
              padding: spacing.xs,
            }}
          >
            <Text style={styles.label}>{translate("instructions")}</Text>

            <View style={styles.panel}>
              {exercise.instructions.map((p) => (
                <Text
                  style={styles.text}
                  key={p}
                >
                  {p}
                </Text>
              ))}
            </View>
          </View>
        )}

        {!!exercise?.tips?.length && (
          <View
            style={{
              gap: spacing.md,
              padding: spacing.xs,
            }}
          >
            <Text style={styles.label}>{translate("tips")}</Text>

            <View style={styles.panel}>
              {exercise.tips.map((p) => (
                <Text
                  style={styles.text}
                  key={p}
                >
                  {p}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </BaseLayout>
  )
}
const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  label: { fontSize: fontSize.lg },
  panel: { gap: spacing.xs },
  text: { fontSize: fontSize.sm },
})
