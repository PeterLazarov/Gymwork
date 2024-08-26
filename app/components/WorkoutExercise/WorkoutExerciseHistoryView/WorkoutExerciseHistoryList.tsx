import React, { useCallback } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'

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
    ({ item, index }: ListRenderItemInfo<Workout>) => {
      return (
        <WorkoutExerciseHistoryListItem
          key={item.guid}
          date={item.date}
          sets={item.sets}
          records={records}
          exercise={exercise}
        />
      )
    },
    [records]
  )
  const ITEM_SET_HEIGHT = 20
  const getItemLayout = (
    data: ArrayLike<Workout> | null | undefined,
    index: number
  ) => {
    const arr = Array.from(data!)
    const prevWorkouts = arr.slice(0, index)
    const prevWorkoutSets = prevWorkouts.flatMap(w => w.sets)
    const item = arr[index]
    return {
      length: (item.sets.length + 1) * ITEM_SET_HEIGHT,
      offset:
        (prevWorkoutSets.length + prevWorkouts.length) *
        ITEM_SET_HEIGHT *
        index,
      index,
    }
  }
  return (
    <FlatList
      style={{ flex: 1 }}
      data={workouts}
      renderItem={renderItem}
      keyExtractor={(w, i) => `${w.date}_${i}`}
      getItemLayout={getItemLayout}
      initialNumToRender={5}
    />
  )
}

export default WorkoutExerciseHistoryList
