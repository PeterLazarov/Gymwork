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
  const { stateStore, workoutStore } = useStores()
  const exerciseToUse = exercise || stateStore.openedExercise!

  const exerciseActualRecords = useMemo(
    () => (exercise ? workoutStore.getExerciseRecords(exerciseToUse.guid) : []),
    [exerciseToUse.guid]
  )

  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          exercise={exerciseToUse}
          number={i + 1}
          records={exerciseActualRecords}
        />
      ))}
    </>
  )
}

export default observer(WorkoutExerciseSetList)
