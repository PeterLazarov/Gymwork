import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef } from 'react'
import { FlatList, ListRenderItemInfo, View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { getDateRange } from 'app/utils/date'
import { HorizontalScreenList } from 'designSystem'

import WorkoutBottomControls from './WorkoutBottomControls'
import WorkoutDayView from './WorkoutDayView'

const WorkoutHorizontalList = () => {
  const { stateStore } = useStores()
  const workoutList = useRef<FlatList<string>>(null)

  const dates = useMemo(() => {
    const from = stateStore.firstRenderedDate
    const to = stateStore.lastRenderedDate

    return getDateRange(from, to)
  }, [])

  const currentIndex = useRef(dates.indexOf(stateStore.openedDate))
  function onScreenChange(index: number) {
    currentIndex.current = index
    stateStore.setOpenedDate(dates[index]!)
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    return <WorkoutDayView date={dates[index]!} />
  }
  useEffect(() => {
    const index = dates.indexOf(stateStore.openedDate)

    if (index < 0 || index >= dates.length) {
      // should not happen
      return
    }

    if (stateStore.openedDate === dates[currentIndex.current]) return

    workoutList.current?.scrollToIndex({ index, animated: false })
  }, [stateStore.openedDate])

  return (
    <View style={{ flex: 1 }}>
      <HorizontalScreenList
        ref={workoutList}
        data={dates}
        renderItem={renderItem}
        onScreenChange={onScreenChange}
        initialScrollIndex={currentIndex.current}
      />
      <WorkoutBottomControls />
    </View>
  )
}

export default observer(WorkoutHorizontalList)
