import { Duration } from "luxon"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { TextInput, View } from "react-native"

import { DistanceEditor } from "@/components/WorkoutStep/components/DistanceEditor"
import { DistanceUnit } from "@/constants/units"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useSetting } from "@/context/SettingContext"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { SetModel } from "@/db/models/SetModel"
import { WorkoutStepModel } from "@/db/models/WorkoutStepModel"
import { useExerciseLastSetQuery } from "@/db/queries/useExerciseLastSetQuery"
import { useInsertSetQuery } from "@/db/queries/useInsertSetQuery"
import { useRemoveSetQuery } from "@/db/queries/useRemoveSetQuery"
import { useUpdateSetQuery } from "@/db/queries/useUpdateSetQuery"
import { Set } from "@/db/schema"
import {
  Button,
  Divider,
  DurationInput,
  fontSize,
  IncrementNumericEditor,
  spacing,
  Text,
  useColors,
} from "@/designSystem"
import { convertWeightToBase, manageInputFocus, translate } from "@/utils"
import { RestInput } from "./components/RestInput"
import { SetTrackList } from "./components/SetTrackList"

type TrackViewProps = {
  step: WorkoutStepModel
  exercise: ExerciseModel
  moveToNextExercise: () => void
}

export const TrackView: React.FC<TrackViewProps> = ({
  exercise: focusedExercise,
  moveToNextExercise,
  step,
}) => {
  const colors = useColors()

  const [draftSet, setDraftSet] = useState<Partial<SetModel> | null>(null)
  const { openedDateMs } = useOpenedWorkout()
  const { manualSetCompletion } = useSetting()
  const insertSet = useInsertSetQuery()
  const updateSet = useUpdateSetQuery()
  const removeSet = useRemoveSetQuery()
  const lastSetQuery = useExerciseLastSetQuery()
  // const { timerStore } = useStores()
  // const timer = useMemo(() => {
  //   return stateStore.openedWorkout?.isToday
  //     ? timerStore.exerciseTimers.get(`timer_${focusedExercise.guid}`)
  //     : undefined
  // }, [focusedExercise, timerStore.exerciseTimers.size])

  const [selectedSet, setSelectedSet] = useState<SetModel | null>(null)

  useEffect(() => {
    if (selectedSet && focusedExercise.id !== selectedSet.exercise.id) {
      setSelectedSet(null)
    }
  }, [focusedExercise])

  useEffect(() => {
    if (selectedSet) {
      setDraftSet(selectedSet)
    } else {
      lastSetQuery(focusedExercise.id!).then((lastSet) => {
        if (lastSet) {
          setDraftSet(new SetModel(lastSet))
        } else {
          setDraftSet(
            SetModel.createDefaultForExercise({
              exercise: focusedExercise,
              workoutStepId: step.id,
              date: openedDateMs,
            }),
          )
        }
      })
    }
  }, [selectedSet, focusedExercise, step.id, openedDateMs])

  const handleAdd = useCallback(() => {
    if (draftSet) {
      const { id, exercise, ...draftCopy } = draftSet

      insertSet(
        {
          ...draftCopy,
          exercise: focusedExercise,
          workoutStepId: step.id,
          exerciseId: focusedExercise.id,
          date: openedDateMs,
        },
        manualSetCompletion,
      )
    }

    // if (settingsStore.measureRest && timer) {
    //   timer.setProp("type", "rest")

    //   timer.start()

    //   stateStore.draftSet?.setDuration(0)
    // }

    if (step.stepType === "superset") {
      moveToNextExercise()
    }
  }, [draftSet, insertSet, step, focusedExercise, openedDateMs, moveToNextExercise])

  const handleUpdate = useCallback(() => {
    const { completedAt, exercise, ...updatedSet } = {
      ...draftSet,
      id: selectedSet!.id,
    }

    updateSet(updatedSet)

    setSelectedSet(null)
  }, [draftSet, selectedSet, updateSet])

  const handleRemove = useCallback(() => {
    removeSet(selectedSet!.id)
    setSelectedSet(null)
  }, [selectedSet, removeSet])

  return (
    <View
      style={[
        {
          flexDirection: "column",
          flexGrow: 1,
          gap: spacing.xs,
          display: "flex",
          backgroundColor: colors.surfaceContainerLow,
        },
      ]}
    >
      <SetTrackList
        step={step}
        sets={step?.exerciseSetsMap[focusedExercise.id!] ?? []}
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
        draftSet={draftSet}
      />

      {draftSet && (
        <View style={{ paddingHorizontal: spacing.xs }}>
          <SetEditControls
            value={draftSet}
            onSubmit={handleAdd}
            onUpdate={(updates) =>
              setDraftSet((prev) => new SetModel({ ...prev!.raw_data!, ...updates }))
            }
          />
        </View>
      )}
      <SetEditActions
        mode={selectedSet ? "edit" : "add"}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
    </View>
  )
}

type SetEditControlsProps = {
  value: Partial<SetModel>
  onSubmit(): void
  // TODO: use SetModel instead
  onUpdate: (updated: Partial<Set>) => void
}

const SetEditControls: React.FC<SetEditControlsProps> = ({ value, onSubmit, onUpdate }) => {
  // TODO add more input options
  const input0 = useRef<TextInput>(null)
  const input1 = useRef<TextInput>(null)
  const input2 = useRef<TextInput>(null)
  const input3 = useRef<TextInput>(null)
  const input4 = useRef<TextInput>(null)
  const input5 = useRef<TextInput>(null)
  const inputRefs = [input1, input2, input3, input4, input5]
  const { onHandleSubmit, isLastInput } = manageInputFocus(inputRefs, onSubmit)
  const { measureRest } = useSetting()

  return (
    <View style={{ gap: spacing.xs }}>
      {measureRest && (
        <SetEditPanelSection text={translate("rest")}>
          <RestInput
            ref={input0}
            value={value.restMs ? Duration.fromMillis(value.restMs) : undefined}
            onSubmit={() => onHandleSubmit(input0)}
            onChange={(rest) => onUpdate({ rest_ms: rest.as("milliseconds") })}
          />
        </SetEditPanelSection>
      )}

      {value.exercise?.hasMetricType("reps") && (
        <SetEditPanelSection text={translate("reps")}>
          <IncrementNumericEditor
            value={value.reps}
            onChange={(reps) => onUpdate({ reps })}
            onSubmitEditing={() => onHandleSubmit(input1)}
            ref={input1}
            returnKeyType={isLastInput(input1) ? "default" : "next"}
            maxDecimals={0}
          />
        </SetEditPanelSection>
      )}

      {value.exercise?.hasMetricType("weight") && (
        <SetEditPanelSection
          text={translate("weight")}
          unit={value.exercise!.getMetricByType("weight")!.unit}
        >
          <IncrementNumericEditor
            value={value.weight}
            onChange={(weight) => {
              onUpdate({
                weight_mcg: convertWeightToBase(
                  weight!,
                  value.exercise!.getMetricByType("weight")!.unit!,
                ),
              })
            }}
            step={value.exercise.getMetricByType("weight")!.step_value}
            onSubmitEditing={() => onHandleSubmit(input2)}
            ref={input2}
            returnKeyType={isLastInput(input2) ? "default" : "next"}
          />
        </SetEditPanelSection>
      )}

      {value.exercise?.hasMetricType("distance") && (
        <SetEditPanelSection text={translate("distance")}>
          <DistanceEditor
            value={value.distance}
            onChange={(distance) => onUpdate({ distance_mm: distance })}
            unit={value.exercise.getMetricByType("distance")!.unit as DistanceUnit}
            onSubmitEditing={() => onHandleSubmit(input3)}
            ref={input3}
            returnKeyType={isLastInput(input3) ? "default" : "next"}
          />
        </SetEditPanelSection>
      )}

      {value.exercise?.hasMetricType("duration") && (
        <SetEditPanelSection text={translate("duration")}>
          <DurationInput
            value={value.durationMs ? Duration.fromMillis(value.durationMs) : undefined}
            onUpdate={(duration) => onUpdate({ duration_ms: duration.toMillis() })}
            onSubmitEditing={() => onHandleSubmit(input4)}
            // timer={timer}
            ref={input4}
          />
        </SetEditPanelSection>
      )}

      {/* {value.exercise.hasMetricType("speed") && (
        <SetEditPanelSection text={translate("speed")}>
          <IncrementNumericEditor
            value={value.speedKph}
            onChange={(speed) => value.setProp("speedKph", speed)}
            onSubmit={() => onHandleSubmit(input5)}
            ref={input5}
            returnKeyType={isLastInput(input1) ? "default" : "next"}
            maxDecimals={2}
            label={value.exercise.getMetricByType("speed")!.unit}
            placeholder={
              !value.speedKph && value.inferredSpeed
                ? String(value.inferredSpeed.toFixed(2))
                : undefined
            }
          />
        </SetEditPanelSection>
      )} */}
    </View>
  )
}

type SetEditPanelSectionProps = {
  text: string
  unit?: string
  children: ReactNode
}

const SetEditPanelSection: React.FC<SetEditPanelSectionProps> = ({ text, unit, children }) => {
  return (
    <View style={{ gap: spacing.xxs }}>
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: fontSize.xs,
              textTransform: "uppercase",
              marginVertical: spacing.xxs,
            }}
          >
            {text}
          </Text>
          {unit && (
            <Text
              style={{
                fontSize: fontSize.xs,
                textTransform: "uppercase",
                marginVertical: spacing.xxs,
              }}
            >
              {unit}
            </Text>
          )}
        </View>
        <Divider
          orientation="horizontal"
          variant="neutral"
        />
      </View>
      {children}
    </View>
  )
}

type SetEditActionsProps = {
  mode: "edit" | "add"
  onUpdate(): void
  onAdd(): void
  onRemove(): void
}

const SetEditActions: React.FC<SetEditActionsProps> = ({ mode, onAdd, onRemove, onUpdate }) => (
  <View
    style={{
      flexDirection: "row",
      gap: spacing.xxs,
      paddingHorizontal: spacing.xs,
    }}
  >
    {mode === "add" ? (
      <Button
        variant="primary"
        onPress={onAdd}
        style={{ flex: 1 }}
        text={translate("completeSet")}
      />
    ) : (
      <>
        <Button
          variant="primary"
          onPress={onUpdate}
          style={{ flex: 1 }}
          text={translate("updateSet")}
        />
        <Button
          variant="critical"
          onPress={onRemove}
          style={{ flex: 1 }}
          text={translate("remove")}
        />
      </>
    )}
  </View>
)
