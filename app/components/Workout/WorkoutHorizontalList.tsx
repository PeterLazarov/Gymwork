import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef } from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { getDateRange } from 'app/utils/date'
import { HorizontalScreenList } from 'designSystem'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import WorkoutDayView from './WorkoutDayView'

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
    return <WorkoutDayView date={dates[index]} />
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
