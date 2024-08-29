import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef } from 'react'

import { useStores } from 'app/db/helpers/useStores'
import { getDateRange } from 'app/utils/date'
import { HorizontalScreenList } from 'designSystem'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import WorkoutDayView from './WorkoutDayView'

function WorkoutHorizontalList() {
  const { stateStore } = useStores()
  const workoutList = useRef<FlashList<string>>(null)

  const dates = useMemo(() => {
    const from = stateStore.firstRenderedDate
    const to = stateStore.lastRenderedDate

    return getDateRange(from, to)
  }, [])

  function onScreenChange(index: number) {
    const newDate = dates[index]
    if (stateStore.openedDate !== newDate) {
      stateStore.setOpenedDate(newDate)
    }
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
