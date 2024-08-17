import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef } from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { getDateRange } from 'app/utils/date'
import { HorizontalScreenList } from 'designSystem'
import WorkoutExerciseList from './WorkoutExerciseList'
import EmptyState from '../EmptyState'
import {
  FlashList,
  ListRenderItem,
  ListRenderItemInfo,
} from '@shopify/flash-list'
import { View } from 'react-native'

// TODO this breaks BADLY if the date goes outside of this range
const datePaddingCount = 365

function WorkoutHorizontalList() {
  const { stateStore, workoutStore } = useStores()
  const workoutList = useRef<FlashList<string>>(null)

  const dates = useMemo(() => {
    const firstWorkout = workoutStore.workouts[workoutStore.workouts.length - 1]
    const lastWorkout = workoutStore.workouts[0]

    const from = (
      firstWorkout ? DateTime.fromISO(firstWorkout.date) : DateTime.now()
    )
      .minus({ day: datePaddingCount })
      .toISODate()!

    const to = (
      lastWorkout ? DateTime.fromISO(lastWorkout.date) : DateTime.now()
    )
      .plus({ day: datePaddingCount })
      .toISODate()!

    return getDateRange(from, to)
  }, [])

  function onScreenChange(index: number) {
    stateStore.setOpenedDate(dates[index])
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    const date = dates[index]
    const workout = workoutStore.getWorkoutForDate(date)
    console.log('item render')
    return workout ? (
      <View style={{ height: 200 }}>
        <EmptyState text={date} />
      </View>
    ) : (
      // <WorkoutExerciseList workout={workout} />
      <View style={{ height: 200 }}>
        <EmptyState text={translate('workoutLogEmpty')} />
      </View>
    )
  }
  useEffect(() => {
    const index = dates.indexOf(stateStore.openedDate)

    if (index < 0 || index >= dates.length) {
      // should not happen
      return
    }

    // TODO bug. does not react to all scrolls. Throttle or Debounce?
    // Scrolls list from external sources
    workoutList.current?.scrollToIndex({ index, animated: false })
  }, [stateStore.openedDate])

  return (
    <>
      {dates.length > 0 && (
        <HorizontalScreenList
          ref={workoutList}
          data={dates}
          renderItem={renderItem}
          onScreenChange={onScreenChange}
          initialScrollIndex={dates.indexOf(stateStore.openedDate)}
        />
      )}
    </>
  )
}

export default observer(WorkoutHorizontalList)
