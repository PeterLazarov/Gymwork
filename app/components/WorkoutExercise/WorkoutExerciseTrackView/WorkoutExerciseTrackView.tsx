import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { getSnapshot } from 'mobx-state-tree'

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
    if (selectedSet) {
      const { guid, exercise, ...rest } = selectedSet
      const clonedSet = { exercise: exercise.guid, ...rest }
      stateStore.setProp('draftSet', clonedSet)
    } else {
      const draftSetSnapshot = getSnapshot(stateStore.openedExerciseNextSet)
      stateStore.setProp('draftSet', draftSetSnapshot)
    }
  }, [selectedSet])

  function handleAdd() {
    if (stateStore.draftSet) {
      const { guid, ...draftCopy } = stateStore.draftSet
      const fromDraft = WorkoutSetModel.create({
        ...draftCopy,
        exercise: stateStore.openedExerciseGuid,
      })
      workoutStore.addSet(fromDraft)
    }

    if (stateStore.openedExercise.measurements.rest) {
      restTimer.start()
    }
  }

  useEffect(() => {
    if (stateStore.openedExercise.measurements.rest) {
      stateStore.draftSet!.setProp(
        'restMs',
        restTimer.timeElapsed.as('milliseconds')
      )
    }
  }, [restTimer.timeElapsed, stateStore.openedExercise])

  function handleUpdate() {
    workoutStore.updateWorkoutExerciseSet(
      WorkoutSetModel.create({
        ...getSnapshot(stateStore.draftSet!),
        exercise: selectedSet?.exercise.guid!,
        guid: selectedSet!.guid,
      })
    )

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
        borderRadius: 8,
        flexDirection: 'column',
        flexGrow: 1,
        display: 'flex',
      }}
    >
      <WorkoutExerciseSetEditList
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
      />

      {stateStore.draftSet && (
        <WorkoutExerciseSetEditControls
          value={stateStore.draftSet}
          onSubmit={handleAdd}
        />
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
