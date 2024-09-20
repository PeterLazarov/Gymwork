import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef } from 'react'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import { useStores } from 'app/db/helpers/useStores'
import { getDateRange } from 'app/utils/date'
import { HorizontalScreenList } from 'designSystem'
import WorkoutDayView from './WorkoutDayView'
import { View } from 'react-native'
import AddStepMenu from './AddStepMenu'

const WorkoutHorizontalList = () => {
  const { stateStore } = useStores()
  const workoutList = useRef<FlashList<string>>(null)

  const dates = useMemo(() => {
    const from = stateStore.firstRenderedDate
    const to = stateStore.lastRenderedDate

    return getDateRange(from, to)
  }, [])

  function onScreenChange(index: number) {
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

    workoutList.current?.scrollToIndex({ index, animated: false })
  }, [stateStore.openedDate])

  return (
    <View style={{ flex: 1 }}>
      <HorizontalScreenList
        ref={workoutList}
        data={dates}
        renderItem={renderItem}
        onScreenChange={onScreenChange}
        initialScrollIndex={dates.indexOf(stateStore.openedDate)}
      />
      <AddStepMenu />
    </View>
  )
}

export default observer(WorkoutHorizontalList)
