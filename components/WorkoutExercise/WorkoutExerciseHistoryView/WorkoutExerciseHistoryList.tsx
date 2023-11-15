import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo } from 'react'
import { FlatList } from 'react-native'

import WorkoutExerciseHistoryDayItem from './WorkoutExerciseHistoryListItem'
import { useStores } from '../../../db/helpers/useStores'
import { Workout } from '../../../db/models'

type Props = {
  workouts: Workout[]
}
const WorkoutExerciseHistoryList: React.FC<Props> = ({ workouts }) => {
  const { workoutStore } = useStores()

  const exerciseFilteredWorkouts = useMemo(
    () =>
      workouts.map(workout => ({
        ...workout,
        sets: workout.sets.filter(
          e => e.exercise.guid === workoutStore.openedExerciseGuid
        ),
      })) as Workout[],
    [workouts]
  )

  const renderItem = useCallback(
    ({ item, index }: { item: Workout; index: number }) => {
      return (
        <WorkoutExerciseHistoryDayItem
          date={item.date}
          sets={item.sets}
        />
      )
    },
    []
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
      data={exerciseFilteredWorkouts}
      renderItem={renderItem}
      keyExtractor={(w, i) => `${w.date}_${i}`}
      getItemLayout={getItemLayout}
      initialNumToRender={5}
    />
  )
}

export default observer(WorkoutExerciseHistoryList)
