import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { View } from 'react-native'

import SetEditList from './SetEditList'
import SetEditControls from './SetEditControls'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet, WorkoutSetModel } from 'app/db/models'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'
import { SetEditActions } from './SetEditActions'
import useTimer from 'app/db/stores/useTimer'
import { colors } from 'designSystem'

const ExerciseTrackView: React.FC = () => {
  const { stateStore } = useStores()
  const restTimer = useTimer()
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  const step = stateStore.focusedStep!
  const focusedExercise = stateStore.focusedExercise!

  useEffect(() => {
    if (selectedSet && focusedExercise.guid !== selectedSet.exercise.guid) {
      setSelectedSet(null)
    }
  }, [focusedExercise])

  useEffect(() => {
    const lastSet = step.exerciseSetsMap[focusedExercise.guid].at(-1)
    const setToClone = selectedSet || lastSet

    if (setToClone) {
      const { guid, exercise, ...rest } = setToClone
      stateStore.setProp('draftSet', {
        exercise: focusedExercise.guid,
        ...rest,
      })
    } else {
      stateStore.setProp('draftSet', {
        exercise: focusedExercise.guid,
        reps: focusedExercise.hasRepMeasument ? 10 : undefined,
      })
    }
  }, [selectedSet, focusedExercise])

  useEffect(() => {
    if (focusedExercise.measurements.rest) {
      stateStore.draftSet!.setProp(
        'restMs',
        restTimer.timeElapsed.as('milliseconds')
      )
    }
  }, [restTimer.timeElapsed, focusedExercise])

  function handleAdd() {
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
  }

  function handleUpdate() {
    const updatedSet = {
      ...getSnapshot(stateStore.draftSet!),
      exercise: selectedSet!.exercise.guid,
      guid: selectedSet!.guid,
      date: selectedSet!.date,
    }

    step.updateSet(updatedSet)

    setSelectedSet(null)
  }
  function handleRemove() {
    setSelectedSet(null)
    step.removeSet(selectedSet!.guid)
  }

  console.log('StepExerciseForm render for', focusedExercise.name)

  return (
    <KeyboardAvoiderView
      avoidMode="focused-input"
      style={{
        flexDirection: 'column',
        flexGrow: 1,
        gap: 8,
        display: 'flex',
        backgroundColor: colors.neutralLighter,
      }}
    >
      <View style={{ padding: 8, flex: 1 }}>
        <SetEditList
          sets={step.exerciseSetsMap[focusedExercise.guid]}
          selectedSet={selectedSet}
          setSelectedSet={setSelectedSet}
        />
      </View>

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
