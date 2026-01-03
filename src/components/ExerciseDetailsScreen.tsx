import { FC, useState } from "react"
import { Image, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native"

import { useDeleteExercise, useExercise, useUpdateExercise, useWorkoutsForExercise } from "@/db/hooks"
import { Exercise } from "@/db/schema"
import { Button, fontSize, Header, Icon, IconButton, Menu, spacing, Text, useColors } from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { AppStackScreenProps, useRouteParams } from "@/navigators/navigationTypes"
import { msToIsoDate, translate } from "@/utils"
import { exerciseImages } from "@/utils/exerciseImages"
import { useDialogContext } from "@/context/DialogContext"
import { TextInput } from "react-native-paper"

export type ExerciseDetailsScreenParams = {
  exerciseId: Exercise["id"]
}
interface ExerciseDetailsScreenProps extends AppStackScreenProps<"ExerciseDetails"> {}

export const ExerciseDetailsScreen: FC<ExerciseDetailsScreenProps> = ({ navigation }) => {
  const { exerciseId } = useRouteParams("ExerciseDetails")
  const { data: exercise } = useExercise(exerciseId)
  const { data: exerciseHistoryRaw } = useWorkoutsForExercise(exerciseId)
  const { mutateAsync: deleteExercise } = useDeleteExercise()
  const { mutateAsync: updateExercise } = useUpdateExercise()
  const { showConfirm } = useDialogContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

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
    setEditMode(true)
    setMenuOpen(false)
  }

  function onSaveInstructions(instructions: string[], tips: string[]) {
    updateExercise({ id: exerciseId, updates: { instructions, tips } })
    setEditMode(false)
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

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>{exercise?.name}</Text>
        {(exercise && !editMode) && <InstructionsPanel exercise={exercise} />}
        {(exercise && editMode) && <InstructionsEditor exercise={exercise} onSave={onSaveInstructions} />}
      </ScrollView>
    </BaseLayout>
  )
}
const InstructionsPanel = ({ exercise }: { exercise: Exercise }) => {
  return (
    <>
      {!!exercise.instructions?.length && (
        <View
          style={{
            gap: spacing.md,
            padding: spacing.xs,
          }}
        >
          <Text style={styles.label}>{translate("instructions")}</Text>

          <View style={styles.panel}>
            {exercise.instructions.map((instruction, i) => (
              <Text style={styles.text} key={i + instruction} text={instruction} />
            ))}
          </View>
        </View>
      )}

      {!!exercise.tips?.length && (
        <View
          style={{
            gap: spacing.md,
            padding: spacing.xs,
          }}
        >
          <Text style={styles.label}>{translate("tips")}</Text>

          <View style={styles.panel}>
            {exercise.tips.map((tip, i) => (
              <Text style={styles.text} key={i + tip} text={tip} />
            ))}
          </View>
        </View>
      )}
    </>
  )
}

function InstructionsEditor({ exercise, onSave }: { exercise: Exercise, onSave: (instructions: string[], tips: string[]) => void }) {
  const [instructions, setInstructions] = useState(exercise.instructions || [])
  const [tips, setTips] = useState(exercise.tips || [])
  
  return (
    <>
      <View style={styles.formContainer}>
        <View>
          <Text style={styles.label}>{translate("instructions")}</Text>

          <TextInput
            multiline
            value={instructions.join("\n")}
            onChangeText={(text) => {
              setInstructions(text.split("\n"))
            }}
          />
          </View>
        <View>
          <Text style={styles.label}>{translate("tips")}</Text>

          <TextInput
            multiline
            value={tips.join("\n")}
            onChangeText={(text) => {
              setTips(text.split("\n"))
            }}
          />
        </View>
      </View>
      <Button
        variant="primary"
        text={translate("save")}
        onPress={() => onSave(instructions, tips)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  formContainer: {
    gap: spacing.md,
    flex: 1,
  },
  label: { fontSize: fontSize.lg },
  panel: { gap: spacing.xs },
  text: { fontSize: fontSize.sm },
})
