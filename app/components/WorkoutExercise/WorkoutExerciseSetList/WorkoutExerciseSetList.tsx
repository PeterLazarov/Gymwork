import React from 'react'

import SetListItem from './SetListItem'
import { Exercise, ExerciseRecord, WorkoutSet } from 'app/db/models'

type Props = {
  sets: WorkoutSet[]
  exercise: Exercise
  records?: ExerciseRecord
}

const WorkoutExerciseSetList: React.FC<Props> = ({
  sets,
  exercise,
  records,
}) => {
  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          exercise={exercise!}
          isRecord={
            records ? records.recordSetsMap.hasOwnProperty(set.guid) : false
          }
          number={i + 1}
        />
      ))}
    </>
  )
}

export default WorkoutExerciseSetList
