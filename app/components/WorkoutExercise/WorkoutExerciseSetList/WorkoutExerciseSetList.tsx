import React from 'react'
import { observer } from 'mobx-react-lite'

import SetListItem from './SetListItem'
import { Exercise, ExerciseRecord, WorkoutSet } from 'app/db/models'
import { useStores } from 'app/db/helpers/useStores'

type Props = {
  sets: WorkoutSet[]
  exercise: Exercise
  records: ExerciseRecord
}

const WorkoutExerciseSetList: React.FC<Props> = ({
  sets,
  exercise,
  records,
}) => {
  const { stateStore } = useStores()

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
          isFocused={stateStore.focusedSetGuid === set.guid}
          number={i + 1}
        />
      ))}
    </>
  )
}

export default observer(WorkoutExerciseSetList)
