import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { View } from 'react-native'

import WorkoutExerciseSetEditList from './WorkoutExerciseSetEditList'
import WorkoutExerciseSetEditPanel from './WorkoutExerciseSetEditPanel'
import { useStores } from '../../db/helpers/useStores'
import { WorkoutSet } from '../../db/models'

const WorkoutExerciseTrackView: React.FC = () => {
  const { workoutStore } = useStores()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedSet, setSelectedSet] = useState<WorkoutSet | null>(null)

  async function addSet(setToAdd: Pick<WorkoutSet, 'reps' | 'weight'>) {
    workoutStore.addSet({
      ...setToAdd,
      exercise: workoutStore.openedExerciseGuid,
    })
  }

  function removeSet(setToRemove: WorkoutSet) {
    const sets = workoutStore.currentWorkoutOpenedExerciseSets
    const i = sets.indexOf(setToRemove)
    const nextSet = sets[i + 1]
    const prevSet = sets[i - 1]
    setSelectedSet(nextSet ?? prevSet ?? null)
    workoutStore.removeSet(setToRemove.guid)
  }

  function updateSet(updatedSet: WorkoutSet) {
    workoutStore.updateWorkoutExerciseSet(updatedSet)
  }

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 8,
        gap: 24,
        flexDirection: 'column',
        flexGrow: 1,
        display: 'flex',
      }}
    >
      <WorkoutExerciseSetEditPanel
        selectedSet={selectedSet}
        addSet={addSet}
        updateSet={updateSet}
        removeSet={removeSet}
      />

      <WorkoutExerciseSetEditList
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
      />
    </View>
  )
}

export default observer(WorkoutExerciseTrackView)
