import React, { useMemo } from "react"
import { View } from "react-native"

import { TargetForm } from "@/components/shared/TargetForm"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useExercise, useUpdateWorkoutStepTarget } from "@/db/hooks"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import type { TargetMetric } from "@/db/schema"
import { Button, Modal, spacing, useColors } from "@/designSystem"
import { translate } from "@/utils"

type Props = {
  step: WorkoutStepModel
  exercise: ExerciseModel
  onClose: () => void
}

export const EditTargetModal: React.FC<Props> = ({ step, exercise, onClose }) => {
  const colors = useColors()
  const { openedDateMs } = useOpenedWorkout()
  const { mutate: updateTarget } = useUpdateWorkoutStepTarget()

  // Exercise select lists don't load metric relations; resolve full metrics here
  // so the forced re-edit path (new exercise from select) offers correct options.
  const { data: exerciseRow } = useExercise(exercise.id!)
  const fullExercise = useMemo(
    () => (exerciseRow ? ExerciseModel.from(exerciseRow) : null),
    [exerciseRow],
  )

  function onSubmit(metric: TargetMetric, valueBase: number) {
    updateTarget({
      workoutStepId: step.id,
      targetMetric: metric,
      targetValueBase: valueBase,
      date: openedDateMs,
    })
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      containerStyle={{
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: spacing.xs,
      }}
    >
      <View style={{ backgroundColor: colors.surface, padding: 0, alignSelf: "stretch" }}>
        <Modal.Header title={translate(step.stepType === "target" ? "editTarget" : "setTarget")} />
        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.md,
          }}
        >
          {!fullExercise ? (
            <Button
              variant="tertiary"
              onPress={onClose}
              text={translate("cancel")}
            />
          ) : (
            <TargetForm
              exercise={fullExercise}
              initialMetric={step.targetMetric}
              initialValueBase={step.targetValueBase}
              submitText={translate("save")}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          )}
        </View>
      </View>
    </Modal>
  )
}
