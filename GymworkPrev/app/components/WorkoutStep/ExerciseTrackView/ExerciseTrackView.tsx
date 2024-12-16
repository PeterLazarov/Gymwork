import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { View } from 'react-native'

import SetEditList from './SetEditList'
import SetEditControls from './SetEditControls'
import { useStores } from 'app/db/helpers/useStores'
import {
  Exercise,
  WorkoutSet,
  WorkoutSetModel,
  WorkoutStep,
} from 'app/db/models'
import { SetEditActions } from './SetEditActions'
import { useColors } from 'designSystem'
import { spacing } from 'designSystem/tokens/spacing'

const defaultReps = 10

export type ExerciseTrackViewProps = {
  step: WorkoutStep
  exercise: Exercise
}

const ExerciseTrackView: React.FC<ExerciseTrackViewProps> = ({
  exercise: focusedExercise,
  step,
}) => {
  const colors = useColors()

  const { stateStore, settingsStore, workoutStore } = useStores()

  const { timerStore } = useStores()
  const timer = useMemo(() => {
    return stateStore.openedWorkout?.isToday
      ? timerStore.exerciseTimers.get(`timer_${focusedExercise.guid}`)
      : undefined
  }, [focusedExercise, timerStore.exerciseTimers.size])

  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  // TODO optimize. Toggle selected set to see that it's slow
  useEffect(() => {
    if (selectedSet && focusedExercise.guid !== selectedSet.exercise.guid) {
      setSelectedSet(null)
    }
  }, [focusedExercise])

  // TODO optimize. Toggle selected set to see that it's slow
  useEffect(() => {
    const lastWorkout =
      workoutStore.exerciseWorkoutsHistoryMap[focusedExercise.guid]?.[0]
    const lastSet = lastWorkout?.exerciseSetsMap[focusedExercise.guid]?.at(-1)

    const setToClone = selectedSet || lastSet

    const { guid, date, exercise, reps, ...rest } = setToClone || {}

    stateStore.setProp('draftSet', {
      exercise: focusedExercise.guid,
      reps:
        reps || (focusedExercise.measurements.reps ? defaultReps : undefined),
      ...rest,
      durationMs: selectedSet?.durationMs || 0,
      completedAt: null,
    })
  }, [selectedSet, focusedExercise])

  const handleAdd = useCallback(() => {
    if (stateStore.draftSet) {
      const { guid, ...draftCopy } = stateStore.draftSet
      const fromDraft = WorkoutSetModel.create({
        ...draftCopy,
        exercise: focusedExercise.guid,
        date: stateStore.openedDate,
        completedAt: undefined,
      })
      step.addSet(fromDraft)
    }

    if (settingsStore.measureRest && timer) {
      timer.setProp('type', 'rest')

      timer.start()

      stateStore.draftSet?.setDuration(0)
    }

    if (step.type === 'superSet') {
      const index = step.exercises.indexOf(focusedExercise)
      const isLastSet = index === step.exercises.length - 1
      const nextExercise = step.exercises[isLastSet ? 0 : index + 1]!
      stateStore.setProp('focusedExerciseGuid', nextExercise.guid)
    }
  }, [focusedExercise])

  const handleUpdate = useCallback(() => {
    const { completedAt, ...updatedSet } = {
      ...getSnapshot(stateStore.draftSet!),
      exercise: selectedSet!.exercise.guid,
      guid: selectedSet!.guid,
    }

    step.updateSet(updatedSet)

    setSelectedSet(null)
  }, [stateStore.draftSet, selectedSet])

  const handleRemove = useCallback(() => {
    setSelectedSet(null)
    step.removeSet(selectedSet!.guid)
  }, [selectedSet])

  return (
    <View
      style={[
        {
          flexDirection: 'column',
          flexGrow: 1,
          gap: spacing.xs,
          display: 'flex',
          backgroundColor: colors.surfaceContainerLow,
        },
      ]}
    >
      <SetEditList
        step={step}
        sets={step?.exerciseSetsMap[focusedExercise.guid] ?? []}
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
      />

      {stateStore.draftSet && (
        <View style={{ paddingHorizontal: spacing.xs }}>
          <SetEditControls
            value={stateStore.draftSet}
            onSubmit={handleAdd}
            timer={timer}
          />
        </View>
      )}
      <SetEditActions
        mode={selectedSet ? 'edit' : 'add'}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
    </View>
  )
}

export default observer(ExerciseTrackView)
