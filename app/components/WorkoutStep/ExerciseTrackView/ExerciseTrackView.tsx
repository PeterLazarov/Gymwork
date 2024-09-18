import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useState } from 'react'
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
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'
import { SetEditActions } from './SetEditActions'
import { useTimer } from 'app/contexts/TimerContext'
import { useColors } from 'designSystem'

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

  const { stateStore } = useStores()
  const restTimer = useTimer()
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  useEffect(() => {
    if (selectedSet && focusedExercise.guid !== selectedSet.exercise.guid) {
      setSelectedSet(null)
    }
  }, [focusedExercise])

  useEffect(() => {
    const lastSet = step.exerciseSetsMap[focusedExercise.guid]?.at(-1)
    const setToClone = selectedSet || lastSet

    const { guid, exercise, reps, ...rest } = setToClone || {}

    stateStore.setProp('draftSet', {
      exercise: focusedExercise.guid,
      reps: reps || (focusedExercise.hasRepMeasument ? defaultReps : undefined),
      ...rest,
    })
  }, [selectedSet, focusedExercise])

  useEffect(() => {
    if (focusedExercise.measurements.rest) {
      stateStore.draftSet!.setProp(
        'restMs',
        restTimer.timeElapsed.as('milliseconds')
      )
    }
  }, [restTimer.timeElapsed, focusedExercise])

  const handleAdd = useCallback(() => {
    if (stateStore.draftSet) {
      const { guid, ...draftCopy } = stateStore.draftSet
      const fromDraft = WorkoutSetModel.create({
        ...draftCopy,
        exercise: focusedExercise.guid,
        date: stateStore.openedDate,
      })
      step.addSet(fromDraft)
    }

    if (focusedExercise.measurements.rest) {
      restTimer.start()
    }
  }, [focusedExercise])

  const handleUpdate = useCallback(() => {
    const updatedSet = {
      ...getSnapshot(stateStore.draftSet!),
      exercise: selectedSet!.exercise.guid,
      guid: selectedSet!.guid,
      date: selectedSet!.date,
    }

    step.updateSet(updatedSet)

    setSelectedSet(null)
  }, [stateStore.draftSet, selectedSet])

  const handleRemove = useCallback(() => {
    setSelectedSet(null)
    step.removeSet(selectedSet!.guid)
  }, [selectedSet])

  console.log('StepExerciseForm render for', focusedExercise.name)

  return (
    <KeyboardAvoiderView
      avoidMode="focused-input"
      style={{
        flexDirection: 'column',
        flexGrow: 1,
        gap: 8,
        display: 'flex',
        backgroundColor: colors.mat.surfaceContainerLow,
      }}
    >
      <SetEditList
        sets={step?.exerciseSetsMap[focusedExercise.guid] ?? []}
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
      />

      {stateStore.draftSet && (
        <View style={{ paddingHorizontal: 8 }}>
          <SetEditControls
            value={stateStore.draftSet}
            onSubmit={handleAdd}
          />
        </View>
      )}

      <SetEditActions
        mode={selectedSet ? 'edit' : 'add'}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
    </KeyboardAvoiderView>
  )
}

export default observer(ExerciseTrackView)
