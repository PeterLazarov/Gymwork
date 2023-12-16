import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef } from 'react'
import { FlatList, ListRenderItemInfo, Text } from 'react-native'

import WorkoutExerciseList from './WorkoutExerciseList'
import { useStores } from '../../db/helpers/useStores'
import HorizontalScreenList from '../../designSystem/HorizontalScreenList'
import { getDateRange } from '../../utils/date'

const datePaddingCount = 365

function WorkoutHorizontalList() {
  const { stateStore, workoutStore } = useStores()
  const workoutList = useRef<FlatList<string>>(null)

  const dates = useMemo(() => {
    const firstWorkout = workoutStore.workouts[workoutStore.workouts.length - 1]
    const lastWorkout = workoutStore.workouts[0]
    const from = DateTime.fromISO(firstWorkout.date)
      .minus({ day: datePaddingCount })
      .toISODate()!
    const to = DateTime.fromISO(lastWorkout.date)
      .plus({ day: datePaddingCount })
      .toISODate()!

    return getDateRange(from, to)
  }, [])

  function onScreenChange(index: number) {
    stateStore.setOpenedDate(dates[index])
  }

  // TODO render workout scre
  const renderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    const workout = workoutStore.getWorkoutForDate(dates[index])
    return workout ? (
      <WorkoutExerciseList workout={workout} />
    ) : (
      // TODO prettier fallback
      <Text>No workout Found</Text>
    )
  }
  useEffect(() => {
    const index = dates.indexOf(stateStore.openedDate)
    workoutList.current?.scrollToIndex({ index })
  }, [stateStore.openedDate])

  return (
    <HorizontalScreenList
      ref={workoutList}
      data={dates}
      renderItem={renderItem}
      onScreenChange={onScreenChange}
      initialScrollIndex={dates.indexOf(stateStore.openedDate)}
    />
  )
}

export default observer(WorkoutHorizontalList)
