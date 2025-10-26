import React, { useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"

import { useDialogContext } from "@/context/DialogContext"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { useInsertWorkoutQuery } from "@/db/queries/useInsertWorkoutQuery"
import { useUpdateWorkoutQuery } from "@/db/queries/useUpdateWorkoutQuery"
import { Workout } from "@/db/schema"
import {
  Button,
  Header,
  Icon,
  IconButton,
  Text,
  fontSize,
  spacing,
  useColors,
} from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { AppStackScreenProps, useRouteParams } from "@/navigators/navigationTypes"
import { translate } from "@/utils"
import { HelperText, TextInput } from "react-native-paper"

export type TemplateSaveScreenParams = {
  edittingTemplate?: WorkoutModel
}
interface TemplateSaveScreenProps extends AppStackScreenProps<"TemplateSave"> {}

export const TemplateSaveScreen: React.FC<TemplateSaveScreenProps> = ({ navigation }) => {
  const colors = useColors()

  const { openedWorkout } = useOpenedWorkout()
  const { edittingTemplate } = useRouteParams("TemplateSave")
  const insertWorkout = useInsertWorkoutQuery()
  const updateWorkout = useUpdateWorkoutQuery()

  const [template, setTemplate] = useState<Partial<WorkoutModel>>(
    edittingTemplate ? { ...edittingTemplate } : { name: "", isTemplate: true },
  )
  const [templateSteps, setTemplateSteps] = useState<WorkoutStepModel[]>(
    edittingTemplate?.workoutSteps || openedWorkout?.workoutSteps || [],
  )

  if (!edittingTemplate && !openedWorkout?.workoutSteps) {
    console.warn("REDIRECT - No openedworkout steps")
    navigation.navigate("Workout")
    return null
  }
  const [formValid, setFormValid] = useState(
    !!edittingTemplate?.name && edittingTemplate.name !== "",
  )
  const { showConfirm, showSnackbar } = useDialogContext()

  function onBackPress() {
    showConfirm?.({
      message: translate("workoutWillNotBeSaved"),
      onClose: () => showConfirm?.(undefined),
      onConfirm: onBackConfirmed,
    })
  }

  function onBackConfirmed() {
    showConfirm?.(undefined)
    navigation.goBack()
  }

  function onUpdate(updated: Partial<Workout>, isValid: boolean) {
    setTemplate(updated)
    setFormValid(isValid)
  }

  function onComplete() {
    if (edittingTemplate) {
      updateWorkout(template.id!, template, true)
    } else {
      insertWorkout({
        name: template.name,
        workoutSteps: templateSteps,
      })
    }
    showSnackbar!({
      text: translate("templateSaved"),
    })
    navigation.goBack()
  }

  return (
    <BaseLayout>
      <Header>
        <IconButton onPress={onBackPress}>
          <Icon
            icon="chevron-back"
            color={colors.onPrimary}
          />
        </IconButton>
        <Header.Title title={translate("saveTemplate")} />
        <IconButton
          onPress={onComplete}
          disabled={!formValid}
        >
          <Icon
            icon="checkmark"
            size="large"
            color={colors.onPrimary}
          />
        </IconButton>
      </Header>
      <View style={{ flex: 1 }}>
        <EditTemplateForm
          template={template}
          steps={templateSteps}
          onUpdateSteps={(steps) => setTemplateSteps(steps)}
          onUpdate={onUpdate}
        />
      </View>
      <Button
        variant="primary"
        onPress={onComplete}
        disabled={!formValid}
        text={translate("save")}
      />
    </BaseLayout>
  )
}

type EditTemplateFormProps = {
  template: Partial<Workout>
  steps: WorkoutStepModel[]
  onUpdate: (template: Partial<Workout>, isValid: boolean) => void
  onUpdateSteps: (steps: WorkoutStepModel[]) => void
}

const EditTemplateForm: React.FC<EditTemplateFormProps> = ({
  template,
  steps,
  onUpdate,
  onUpdateSteps,
}) => {
  const [nameError, setNameError] = useState("")

  function runValidCheck(data: Partial<Workout>) {
    const nameInvalid = data.name!.trim() === ""

    setNameError(nameInvalid ? "Exercise name cannot be empty." : "")

    return !nameInvalid
  }

  function onNameChange(value: string) {
    const updated = { ...template, name: value }
    const valid = runValidCheck(updated)
    onUpdate(updated, valid)
  }

  function onStepRemove(stepId: number) {
    const filtered = steps.filter((s) => s.id !== stepId)
    onUpdateSteps(filtered)
  }

  return (
    <View style={{ flex: 1, gap: spacing.xs, padding: spacing.xs }}>
      <TextInput
        label="Name"
        value={template.name || ""}
        onChangeText={onNameChange}
        error={nameError !== ""}
      />
      {nameError !== "" && (
        <HelperText
          type="error"
          visible={nameError !== ""}
        >
          {nameError}
        </HelperText>
      )}
      {steps.length > 0 && (
        <TemplateStepsList
          steps={steps}
          onStepRemove={onStepRemove}
        />
      )}
    </View>
  )
}

type Props = {
  steps: WorkoutStepModel[]
  onStepRemove: (stepId: number) => void
}

const TemplateStepsList: React.FC<Props> = ({ steps, onStepRemove }) => {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])

  return (
    <>
      <Text style={{ fontSize: fontSize.lg }}>{translate("exercises")}</Text>
      <View style={styles.exerciseList}>
        {steps.map((step) => (
          <TemplateStepsListItem
            key={step.id}
            step={step}
            onStepRemove={onStepRemove}
          />
        ))}
      </View>
    </>
  )
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    exerciseList: {
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: 8,
      paddingHorizontal: spacing.xs,
      paddingVertical: spacing.xxs,
      gap: spacing.xxs,
    },
  })

type TemplateStepsListItemProps = {
  step: WorkoutStepModel
  onStepRemove: (stepId: number) => void
}

const TemplateStepsListItem: React.FC<TemplateStepsListItemProps> = ({ step, onStepRemove }) => {
  const isSuperset = step.stepType === "superset"
  return (
    <View
      key={step.id}
      style={listItemStyles.item}
    >
      <View style={listItemStyles.nameContainer}>
        {step.exercises.map((exercise) => (
          <Text key={exercise.id}>
            {isSuperset && `${step.exerciseLettering[exercise.id!]}: `}
            {exercise.name}
          </Text>
        ))}
      </View>
      <IconButton onPress={() => onStepRemove(step.id)}>
        <Icon icon="delete" />
      </IconButton>
    </View>
  )
}

const listItemStyles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center" },
  nameContainer: {
    flex: 1,
  },
})
