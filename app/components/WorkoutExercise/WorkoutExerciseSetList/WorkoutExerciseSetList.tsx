import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import SetListItem from './SetListItem'
import { useStores } from 'app/db/helpers/useStores'
import { Exercise, WorkoutSet } from 'app/db/models'
import { computed } from 'mobx'
import { isCurrentRecord } from 'app/services/workoutRecordsCalculator'

type Props = {
  sets: WorkoutSet[]
  exercise?: Exercise
}

const WorkoutExerciseSetList: React.FC<Props> = ({ sets, exercise }) => {
  const { stateStore, recordStore } = useStores()
  const exerciseToUse = exercise || stateStore.openedExercise!

  const setRecordFlagMap = useMemo(
    () =>
      computed(() => {
        const records = recordStore.getExerciseRecords(exerciseToUse.guid)
        return sets.reduce((acc, set) => {
          const isSetRecord = isCurrentRecord(records, set)
          acc[set.guid] = isSetRecord

          return acc
        }, {} as Record<string, boolean>)
      }),
    [sets]
  ).get()

  return (
    <>
      {sets.map((set, i) => (
        <SetListItem
          key={set.guid}
          set={set}
          exercise={exerciseToUse}
          isRecord={setRecordFlagMap[set.guid]}
          number={i + 1}
        />
      ))}
    </>
  )
}

export default observer(WorkoutExerciseSetList)
