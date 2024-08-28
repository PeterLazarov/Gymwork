import React, { useCallback } from 'react'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import WorkoutExerciseHistoryListItem from './WorkoutExerciseHistoryListItem'
import { Exercise, ExerciseRecord, Workout } from 'app/db/models'

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
    ({ item }: ListRenderItemInfo<Workout>) => {
      const sets = item.exerciseSetsMap[exercise.guid]

      return (
        <WorkoutExerciseHistoryListItem
          key={item.guid}
          date={item.date}
          sets={sets}
          records={records}
          exercise={exercise}
        />
      )
    },
    [records]
  )

  return (
    <FlashList
      data={workouts}
      renderItem={renderItem}
      keyExtractor={(w, i) => `${w.date}_${i}`}
      estimatedItemSize={190}
    />
  )
}

export default WorkoutExerciseHistoryList
