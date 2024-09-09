import React, { useCallback, useMemo } from 'react'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import ExerciseHistoryListItem from './ExerciseHistoryListItem'
import {
  Exercise,
  ExerciseRecord,
  Workout,
  WorkoutModel,
  WorkoutStep,
} from 'app/db/models'
import { getParentOfType } from 'mobx-state-tree'

type Props = {
  workouts: Workout[]
  records: ExerciseRecord
  exercise: Exercise
}
const WorkoutExerciseHistoryList: React.FC<Props> = ({
  workouts,
  records,
  exercise,
}) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<WorkoutStep>) => {
      const workout = getParentOfType(item, WorkoutModel)

      return (
        <ExerciseHistoryListItem
          key={item.guid}
          date={workout.date}
          step={item}
          records={records}
          exercise={exercise}
        />
      )
    },
    [records]
  )

  const steps = useMemo(() => {
    return workouts.flatMap(w => w.exerciseStepsMap[exercise.guid])
  }, [workouts])

  return (
    <FlashList
      data={steps}
      renderItem={renderItem}
      keyExtractor={(s, i) => `${s.guid}_${i}`}
      estimatedItemSize={190}
    />
  )
}

export default WorkoutExerciseHistoryList
