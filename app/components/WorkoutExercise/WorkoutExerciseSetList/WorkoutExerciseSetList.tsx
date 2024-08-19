import { observer } from 'mobx-react-lite'
import React from 'react'

import SetListItem from './SetListItem'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, WorkoutSet } from 'app/db/models'

type Props = {
  sets: WorkoutSet[]
  exercise?: Exercise
}

const WorkoutExerciseSetList: React.FC<Props> = ({ sets, exercise }) => {
  const { stateStore } = useStores()
  const exerciseToUse = exercise || stateStore.openedExercise!

  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          exercise={exerciseToUse}
          number={i + 1}
        />
      ))}
    </>
  )
}

export default observer(WorkoutExerciseSetList)
