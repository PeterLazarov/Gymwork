import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'

import { useStores } from 'app/db/helpers/useStores'
import { getDateRange } from 'app/utils/date'
import WorkoutDayView from './WorkoutDayView'
import WorkoutBottomControls from './WorkoutBottomControls'
import PagerView from 'react-native-pager-view'

const WorkoutHorizontalList = () => {
  const { stateStore } = useStores()
  const workoutList = useRef<PagerView>(null)

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

  useEffect(() => {
    const index = dates.indexOf(stateStore.openedDate)

    if (index < 0 || index >= dates.length) {
      // should not happen
      return
    }

    if (stateStore.openedDate === dates[currentIndex.current]) return

    workoutList.current?.setPageWithoutAnimation(index)
  }, [stateStore.openedDate])

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={workoutList}
        style={{ flex: 1 }}
        initialPage={currentIndex.current}
        onPageSelected={e => {
          onScreenChange(e.nativeEvent.position)
        }}
      >
        {dates.map(date => (
          <View key={date}>
            <WorkoutDayView date={date} />
          </View>
        ))}
      </PagerView>

      <WorkoutBottomControls />
    </View>
  )
}

export default observer(WorkoutHorizontalList)
