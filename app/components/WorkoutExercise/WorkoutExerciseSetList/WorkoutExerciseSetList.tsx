import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import SetListItem from './SetListItem'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, WorkoutSet } from 'app/db/models'

type Props = {
  sets: WorkoutSet[]
  exercise?: Exercise
}

const WorkoutExerciseSetList: React.FC<Props> = ({ sets, exercise }) => {
  const { stateStore, recordStore } = useStores()
  const exerciseToUse = exercise || stateStore.openedExercise!

  const exerciseRecord = useMemo(() => {
    return exercise
      ? recordStore.getExerciseRecords(exerciseToUse.guid)
      : undefined
  }, [recordStore.records])

  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          exercise={exerciseToUse}
          exerciseRecord={exerciseRecord}
          number={i + 1}
        />
      ))}
    </>
  )
}

export default observer(WorkoutExerciseSetList)
