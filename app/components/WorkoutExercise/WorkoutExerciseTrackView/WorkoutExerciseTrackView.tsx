import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'

import WorkoutExerciseSetEditList from './WorkoutExerciseSetEditList'
import WorkoutExerciseSetEditPanel from './WorkoutExerciseSetEditPanel'
import { useStores } from 'app/db/helpers/useStores'
import { WorkoutSet } from 'app/db/models'

const WorkoutExerciseTrackView: React.FC = () => {
  const { workoutStore, stateStore } = useStores()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  async function addSet(setToAdd: Pick<WorkoutSet, 'reps' | 'weight'>) {
    workoutStore.addSet({
      ...setToAdd,
      exercise: stateStore.openedExerciseGuid,
    })
  }

  function removeSet(setToRemove: WorkoutSet) {
    setSelectedSet(null)
    workoutStore.removeSet(setToRemove.guid)
  }

  function updateSet(updatedSet: WorkoutSet) {
    workoutStore.updateWorkoutExerciseSet(updatedSet)
    setSelectedSet(null)
  }

  return (
    <ScrollView
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
      <WorkoutExerciseSetEditPanel
        selectedSet={selectedSet}
        addSet={addSet}
        updateSet={updateSet}
        removeSet={removeSet}
      />
    </ScrollView>
  )
}

export default observer(WorkoutExerciseTrackView)
