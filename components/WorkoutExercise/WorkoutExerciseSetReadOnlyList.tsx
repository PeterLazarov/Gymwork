import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import WorkoutExerciseSetListItem from './WorkoutExerciseSetReadOnlyListItem'
import { useStores } from '../../db/helpers/useStores'
import { Exercise, WorkoutSet } from '../../db/models'

type Props = {
  sets: WorkoutSet[]
  exercise?: Exercise
}

const WorkoutExerciseSetEditList: React.FC<Props> = ({ sets, exercise }) => {
  const { openedExercise } = useStores()
  const exerciseToUse = exercise || openedExercise!

  const warmupSets = useMemo(() => sets.filter(e => e.isWarmup), [sets])
  const actualSets = useMemo(() => sets.filter(e => !e.isWarmup), [sets])

  return (
    <>
      {warmupSets.map(set => (
        <WorkoutExerciseSetListItem
          key={set.guid}
          set={set}
          exercise={exerciseToUse}
        />
      ))}
      {actualSets.map((set, i) => (
        <WorkoutExerciseSetListItem
          key={set.guid}
          set={set}
          exercise={exerciseToUse}
          number={i + 1}
        />
      ))}
    </>
  )
}

export default observer(WorkoutExerciseSetEditList)