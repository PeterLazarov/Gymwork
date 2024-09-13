import React from 'react'
import { observer } from 'mobx-react-lite'
import { computed } from 'mobx'

import SetListItem from './SetListItem'
import { WorkoutSet, WorkoutStep } from 'app/db/models'
import { useStores } from 'app/db/helpers/useStores'

export type StepSetsList = {
  step: WorkoutStep
  splitSupersets?: boolean
  focusedExerciseGuid?: string
}

const StepSetsList: React.FC<StepSetsList> = ({
  step,
  splitSupersets = false,
  focusedExerciseGuid,
}) => {
  const { stateStore, recordStore } = useStores()

  const exerciseSets =
    step.exerciseSetsMap[
      focusedExerciseGuid || stateStore.focusedExerciseGuid!
    ] || []
  const sets = splitSupersets ? exerciseSets : step.sets

  const getLetterForSet = (set: WorkoutSet) => {
    if (step.type === 'straightSet' || splitSupersets) return

    return step.exerciseLettering[set.exercise.guid]
  }
  const getNumberForSet = (set: WorkoutSet) => {
    if (set.isWarmup) return

    if (step.type === 'straightSet') return step.workSets.indexOf(set) + 1

    const workSets = step.exerciseWorkSetsMap[set.exercise.guid] || []
    return workSets.indexOf(set) + 1
  }

  const stepRecordGuids = computed(() =>
    recordStore.getRecordGuidsForStep(step)
  ).get()

  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          measurements={set.exercise.measurements}
          isRecord={stepRecordGuids.includes(set)}
          isFocused={stateStore.focusedSetGuid === set.guid}
          number={getNumberForSet(set)}
          letter={getLetterForSet(set)}
        />
      ))}
    </>
  )
}

export default observer(StepSetsList)
