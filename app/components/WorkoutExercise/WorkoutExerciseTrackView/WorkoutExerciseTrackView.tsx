import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { getSnapshot } from 'mobx-state-tree'

import WorkoutExerciseSetEditList from './WorkoutExerciseSetEditList'
import WorkoutExerciseSetEditControls from './WorkoutExerciseSetEditControls'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet, WorkoutSetModel } from 'app/db/models'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'
import { WorkoutExerciseSetEditActions } from './WorkoutExerciseSetEditActions'

const WorkoutExerciseTrackView: React.FC = () => {
  const { workoutStore, stateStore } = useStores()
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  useEffect(() => {
    if (selectedSet) {
      const { guid, exercise, ...rest } = selectedSet
      const clonedSet = { exercise: exercise.guid, ...rest }
      stateStore.setProp('draftSet', clonedSet)
    } else {
      // @ts-ignore
      stateStore.setProp('draftSet', stateStore.openedExerciseNextSet)
    }
  }, [selectedSet])

  function handleSubmit() {
    // TODO
  }
  function handleAdd() {
    if (stateStore.draftSet) {
      const { guid, ...draftCopy } = stateStore.draftSet
      const fromDraft = WorkoutSetModel.create({
        ...draftCopy,
        exercise: stateStore.openedExerciseGuid,
      })
      workoutStore.addSet(fromDraft)
    }
  }

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
        gap: 24,
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
          onChange={changed => {
            stateStore.setProp('draftSet', changed)
          }}
          onSubmit={handleSubmit}
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
