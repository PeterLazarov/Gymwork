import React from 'react'
import { observer } from 'mobx-react-lite'

import SetListItem from './SetListItem'
import { ExerciseRecord, WorkoutSet, WorkoutStep } from 'app/db/models'
import { useStores } from 'app/db/helpers/useStores'

type Props = {
  step: WorkoutStep
  records?: ExerciseRecord
  splitSupersets?: boolean
}

const StepSetsList: React.FC<Props> = ({
  step,
  records,
  splitSupersets = false,
}) => {
  const { stateStore } = useStores()

  const sets = splitSupersets
    ? step.exerciseSetsMap[records!.exercise.guid]
    : step.sets

  const getLetterForSet = (set: WorkoutSet) => {
    if (step.type === 'straightSet' || splitSupersets) return

    return step.exerciseLettering[set.exercise.guid]
  }
  const getNumberForSet = (set: WorkoutSet) => {
    if (set.isWarmup) return

    if (step.type === 'straightSet') return step.workSets.indexOf(set) + 1

    const workSets = step.exerciseSetsMap[set.exercise.guid].filter(
      s => !s.isWarmup
    )
    return workSets.indexOf(set) + 1
  }

  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          exercise={set.exercise!}
          isRecord={
            records ? records.recordSetsMap.hasOwnProperty(set.guid) : false
          }
          isFocused={stateStore.focusedSetGuid === set.guid}
          number={getNumberForSet(set)}
          letter={getLetterForSet(set)}
        />
      ))}
    </>
  )
}

export default observer(StepSetsList)
