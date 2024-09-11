import React from 'react'
import { observer } from 'mobx-react-lite'

import SetListItem from './SetListItem'
import { WorkoutSet, WorkoutStep } from 'app/db/models'
import { useStores } from 'app/db/helpers/useStores'

type Props = {
  step: WorkoutStep
  splitSupersets?: boolean
}

const StepSetsList: React.FC<Props> = ({ step, splitSupersets = false }) => {
  const { stateStore } = useStores()

  const exerciseSets =
    step.exerciseSetsMap[stateStore.focusedExerciseGuid!] || []
  const sets = splitSupersets ? exerciseSets : step.sets

  const getLetterForSet = (set: WorkoutSet) => {
    if (step.type === 'straightSet' || splitSupersets) return

    return step.exerciseLettering[set.exercise.guid]
  }
  const getNumberForSet = (set: WorkoutSet) => {
    if (set.isWarmup) return

    if (step.type === 'straightSet') return step.workSets.indexOf(set) + 1

    const exerciseSets = step.exerciseSetsMap[set.exercise.guid] || []
    const workSets = exerciseSets.filter(s => !s.isWarmup)
    return workSets.indexOf(set) + 1
  }

  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          exercise={set.exercise!}
          isRecord={step.recordSetGuids.includes(set.guid)}
          isFocused={stateStore.focusedSetGuid === set.guid}
          number={getNumberForSet(set)}
          letter={getLetterForSet(set)}
        />
      ))}
    </>
  )
}

export default observer(StepSetsList)
