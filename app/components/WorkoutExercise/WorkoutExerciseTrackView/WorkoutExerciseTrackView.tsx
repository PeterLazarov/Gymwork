import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { getSnapshot } from 'mobx-state-tree'
import { View } from 'react-native'

import WorkoutExerciseSetEditList from './WorkoutExerciseSetEditList'
import WorkoutExerciseSetEditControls from './WorkoutExerciseSetEditControls'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet, WorkoutSetModel } from 'app/db/models'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'
import { WorkoutExerciseSetEditActions } from './WorkoutExerciseSetEditActions'
import useTimer from 'app/db/stores/useTimer'

const WorkoutExerciseTrackView: React.FC = () => {
  const { workoutStore, stateStore } = useStores()
  const restTimer = useTimer()
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  useEffect(() => {
    const setToClone = selectedSet || stateStore.openedExerciseLastSet

    if (setToClone) {
      const { guid, exercise, ...rest } = setToClone
      stateStore.setProp('draftSet', { exercise: exercise.guid, ...rest })
    } else {
      stateStore.setProp('draftSet', {
        exercise: stateStore.openedExerciseGuid,
        reps: stateStore.openedExercise?.hasRepMeasument ? 10 : undefined,
      })
    }
  }, [selectedSet])

  function handleAdd() {
    if (stateStore.draftSet) {
      const { guid, ...draftCopy } = stateStore.draftSet
      const fromDraft = WorkoutSetModel.create({
        ...draftCopy,
        exercise: stateStore.openedExerciseGuid,
        date: stateStore.openedDate,
      })
      workoutStore.addSet(fromDraft)
    }

    if (stateStore.openedExercise?.measurements.rest) {
      restTimer.start()
    }
  }

  useEffect(() => {
    if (stateStore.openedExercise?.measurements.rest) {
      stateStore.draftSet!.setProp(
        'restMs',
        restTimer.timeElapsed.as('milliseconds')
      )
    }
  }, [restTimer.timeElapsed, stateStore.openedExercise])

  function handleUpdate() {
    const updatedSet = {
      ...getSnapshot(stateStore.draftSet!),
      exercise: selectedSet?.exercise.guid!,
      guid: selectedSet!.guid,
      date: selectedSet!.date,
    }

    workoutStore.updateSet(updatedSet)

    setSelectedSet(null)
  }
  function handleRemove() {
    workoutStore.removeSet(selectedSet!.guid)
    setSelectedSet(null)
  }

  return (
    <KeyboardAvoiderView
      avoidMode="focused-input"
      style={{
        flexDirection: 'column',
        flexGrow: 1,
        gap: 8,
        display: 'flex',
      }}
    >
      <View style={{ padding: 8, flex: 1 }}>
        <WorkoutExerciseSetEditList
          selectedSet={selectedSet}
          setSelectedSet={setSelectedSet}
        />
      </View>

      {stateStore.draftSet && (
        <View style={{ paddingHorizontal: 8 }}>
          <WorkoutExerciseSetEditControls
            value={stateStore.draftSet}
            onSubmit={handleAdd}
          />
        </View>
      )}

      <WorkoutExerciseSetEditActions
        mode={selectedSet ? 'edit' : 'add'}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
    </KeyboardAvoiderView>
  )
}

export default observer(WorkoutExerciseTrackView)
