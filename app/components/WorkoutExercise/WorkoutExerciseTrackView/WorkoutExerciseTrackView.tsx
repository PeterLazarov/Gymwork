import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'

import WorkoutExerciseSetEditList from './WorkoutExerciseSetEditList'
import WorkoutExerciseSetEditControls from './WorkoutExerciseSetEditControls'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet, WorkoutSetModel, WorkoutSetTrackData } from 'app/db/models'
import { KeyboardAvoiderView } from '@good-react-native/keyboard-avoider'
import { WorkoutExerciseSetEditActions } from './WorkoutExerciseSetEditActions'

function getDefaultSet(): WorkoutSetTrackData {
  return {
    distanceMm: 0,
    durationMs: 0,
    reps: 0,
    weightUg: 0,
  }
}

const WorkoutExerciseTrackView: React.FC = () => {
  const { workoutStore, stateStore } = useStores()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  // todo check default params

  const [draftSet, setDraftSet] = useState<WorkoutSetTrackData>(getDefaultSet())
  useEffect(() => {
    if (selectedSet) {
      const { guid, ...copiedSet } = selectedSet
      setDraftSet(copiedSet)
    }
  }, [selectedSet])

  function handleSubmit() {
    // TODO
  }
  function handleAdd() {
    const set = WorkoutSetModel.create({
      ...draftSet,
      exercise: stateStore.openedExercise?.guid!,
    })
    workoutStore.addSet(set)
  }
  function handleUpdate() {
    workoutStore.updateWorkoutExerciseSet(
      WorkoutSetModel.create({ ...selectedSet, ...draftSet })
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

      <WorkoutExerciseSetEditControls
        value={draftSet}
        onChange={setDraftSet}
        onSubmit={handleSubmit}
        openedExercise={stateStore.openedExercise!}
      />

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
