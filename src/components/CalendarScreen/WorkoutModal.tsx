import { DateTime } from "luxon"
import { useState } from "react"
import { ScrollView, View } from "react-native"
import { Modal, Portal } from "react-native-paper"

import { CommentsCard } from "@/components/shared/CommentsCard"
import { StepSetsList } from "@/components/shared/StepSetsList"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { useWorkoutCopy } from "@/db/queries/useWorkoutCopy"
import { Button, Divider, Text, ToggleSwitch, fontSize, spacing, useColors } from "@/designSystem"
import { navigate } from "@/navigators/navigationUtilities"
import { msToIsoDate, translate } from "@/utils"

type Props = {
  open: boolean
  workout: WorkoutModel
  onClose: () => void
  mode: "copy" | "view"
  showComments?: boolean
}
export const WorkoutModal: React.FC<Props> = ({ open, workout, onClose, mode, showComments }) => {
  const [includeSets, setIncludeSets] = useState(true)
  const { setOpenedDate } = useOpenedWorkout()
  const copyWorkout = useWorkoutCopy()

  const luxonDate = DateTime.fromMillis(workout.date!)
  const label = luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  const colors = useColors()

  const onActionPress = () => {
    if (mode === "copy") {
      copyWorkout(workout!, includeSets)
    } else if (mode === "view") {
      setOpenedDate(msToIsoDate(workout.date!))
    }
    navigate("Workout")
    onClose()
  }

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          marginVertical: spacing.xs,
          marginHorizontal: spacing.md,
          flex: 1,
        }}
      >
        <View style={{ height: "100%" }}>
          <Text
            style={{
              fontSize: fontSize.lg,
              textAlign: "center",
              padding: spacing.md,
            }}
          >
            {label}
          </Text>
          <Divider
            orientation="horizontal"
            variant="primary"
          />
          <View style={{ flex: 1 }}>
            {showComments && workout.hasComments && (
              <CommentsCard
                workout={workout}
                compactMode
              />
            )}
            <ScrollView>
              {workout.workoutSteps.map((step) => (
                <StepItem
                  key={step.id}
                  step={step}
                  workout={workout}
                />
              ))}
            </ScrollView>
            {mode === "copy" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: spacing.xxs,
                  gap: spacing.xs,
                }}
              >
                <Text style={{ color: colors.onSurface }}>{translate("includeSets")}</Text>
                <ToggleSwitch
                  variant="primary"
                  value={includeSets}
                  onValueChange={setIncludeSets}
                />
              </View>
            )}
          </View>
          <Divider
            orientation="horizontal"
            variant="primary"
          />
          <View style={{ flexDirection: "row" }}>
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={onClose}
              text={translate("cancel")}
            />
            <Button
              variant="tertiary"
              style={{ flex: 1 }}
              onPress={onActionPress}
              text={translate(mode === "copy" ? "copyWorkout" : "goToWorkout")}
            />
          </View>
        </View>
      </Modal>
    </Portal>
  )
}

type StepItemProps = {
  step: WorkoutStepModel
  workout: WorkoutModel
}
const StepItem: React.FC<StepItemProps> = ({ step, workout }) => {
  const colors = useColors()

  return (
    <>
      {step.exercises.map((exercise) => (
        <View
          key={exercise.id}
          style={{ padding: spacing.xs }}
        >
          <Text
            style={{
              color: colors.onSurface,
              marginBottom: spacing.xs,
              textAlign: "center",
            }}
            key={exercise.id}
          >
            {exercise.name}
          </Text>
          <StepSetsList
            step={step}
            sets={step.exerciseSetsMap[exercise.id!]}
            workout={workout}
            hideSupersetLetters
          />
        </View>
      ))}
    </>
  )
}
