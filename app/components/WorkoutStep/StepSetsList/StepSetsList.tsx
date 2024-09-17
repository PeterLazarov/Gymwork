import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { computed } from 'mobx'

import SetListItem from './SetListItem'
import { WorkoutSet, WorkoutStep } from 'app/db/models'
import { useStores } from 'app/db/helpers/useStores'

export type StepSetsList = {
  step: WorkoutStep
  sets: WorkoutSet[]
  hideSupersetLetters?: boolean
}

const StepSetsList: React.FC<StepSetsList> = ({
  step,
  sets,
  hideSupersetLetters = false,
}) => {
  const { stateStore, recordStore } = useStores()

  const getLetterForSet = (set: WorkoutSet) => {
    if (step.type === 'straightSet' || hideSupersetLetters) return

    return step.exerciseLettering[set.exercise.guid]
  }
  const getNumberForSet = (set: WorkoutSet) => {
    if (set.isWarmup) return

    if (step.type === 'straightSet') return step.workSets.indexOf(set) + 1

    const workSets = step.exerciseWorkSetsMap[set.exercise.guid] || []
    return workSets.indexOf(set) + 1
  }

  // const [stepRecords, setStepRecords] = useState<WorkoutSet[]>([])

  // useEffect(() => {
  //   setTimeout(() => {
  //     setStepRecords(recordStore.getRecordsForStep(step))
  //   }, 0)
  // }, [step])
  const stepRecords = computed(() => recordStore.getRecordsForStep(step)).get()

  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          measurements={set.exercise.measurements}
          isRecord={stepRecords.some(({ guid }) => guid === set.guid)}
          isFocused={stateStore.highlightedSetGuid === set.guid}
          number={getNumberForSet(set)}
          letter={getLetterForSet(set)}
        />
      ))}
    </>
  )
}

export default observer(StepSetsList)
