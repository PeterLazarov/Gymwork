import React, { useMemo } from "react"
import { View } from "react-native"

import { TargetForm } from "@/components/shared/TargetForm"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useCreateExercisesStep, useExercise } from "@/db/hooks"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import type { TargetMetric } from "@/db/schema"
import { useDatabaseService } from "@/db/useDB"
import { Button, Modal, spacing, useColors } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { translate } from "@/utils"

type Props = {
  exerciseId: number
  onClose: () => void
}

export const TargetConfigModal: React.FC<Props> = ({ exerciseId, onClose }) => {
  const colors = useColors()

  const { data: exerciseRow } = useExercise(exerciseId)
  const exercise = useMemo(
    () => (exerciseRow ? ExerciseModel.from(exerciseRow) : null),
    [exerciseRow],
  )

  const db = useDatabaseService()
  const { openedDateMs } = useOpenedWorkout()
  const { mutateAsync: createStep } = useCreateExercisesStep()

  async function onStart(metric: TargetMetric, valueBase: number) {
    if (!exercise) return

    const { stepId } = await createStep({
      exercises: [exercise],
      stepType: "target",
      target: { metric, valueBase },
    })

    const workout = openedDateMs ? await db.getWorkoutByDate(openedDateMs) : undefined
    const rawStep = workout?.workoutSteps.find((step) => step.id === stepId)
    onClose()
    if (rawStep) {
      navigate("WorkoutStep", { focusedStep: WorkoutStepModel.from(rawStep) })
    } else {
      navigate("Workout")
    }
  }

  const hasOptions = (exercise?.getTargetableMetrics().length ?? 0) > 0

  return (
    <Modal
      open
      onClose={onClose}
      containerStyle={{ alignItems: "center", justifyContent: "center", marginHorizontal: spacing.xs }}
    >
      <View style={{ backgroundColor: colors.surface, padding: 0, alignSelf: "stretch" }}>
        <Modal.Header title={translate("setTarget")} />
        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.md,
            gap: spacing.md,
          }}
        >
          {!exercise || !hasOptions ? (
            <Button
              variant="tertiary"
              onPress={onClose}
              text={translate("cancel")}
            />
          ) : (
            <TargetForm
              exercise={exercise}
              submitText={translate("setTarget")}
              onSubmit={onStart}
              onCancel={onClose}
            />
          )}
        </View>
      </View>
    </Modal>
  )
}
