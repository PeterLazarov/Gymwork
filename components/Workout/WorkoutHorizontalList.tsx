import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import { ListRenderItemInfo, Text, View } from 'react-native'

import { useStores } from '../../db/helpers/useStores'
import HorizontalScreenList from '../../designSystem/HorizontalScreenList'
// ... (other imports)

function usePrevious(value: any) {
  const prevValueRef = useRef()

  useEffect(() => {
    prevValueRef.current = value
  }, [value])

  return prevValueRef.current
}

function WorkoutHorizontalList() {
  const { stateStore } = useStores()

  const initialOpendate = useRef(DateTime.fromISO(stateStore.openedDate))
  const prevOpenedDate = usePrevious(stateStore.openedDate)
  const datePaddingCount = 5
  const datesRef = useRef<string[]>(
    Array.from({ length: 2 * datePaddingCount + 1 }, (_, i) => {
      const newDate = initialOpendate.current.plus({
        days: i - datePaddingCount,
      })
      return newDate.toISODate()!
    })
  )

  const [dates, setDates] = useState(datesRef.current)

  function onScreenChange(index: number, isLeftSwipe: boolean) {
    if (isLeftSwipe) {
      stateStore.decrementCurrentDate()
    } else {
      stateStore.incrementCurrentDate()
    }
  }

  const renderItem = ({ item, index }: ListRenderItemInfo<string>) => (
    <View style={{ backgroundColor: 'cyan', margin: 10 }}>
      <Text key={index}>{item}</Text>
    </View>
  )

  function onDatesEndReached(atEnd: boolean) {
    console.log('end', atEnd)
    const baseDate = datesRef.current[atEnd ? datesRef.current.length - 1 : 0]
    const offset = atEnd ? 1 : -1

    const newDates = Array.from(
      { length: 5 },
      (_, index) =>
        DateTime.fromISO(baseDate)
          .plus({ days: offset * (index + 1) })
          .toISODate()!
    )

    datesRef.current = atEnd
      ? [...datesRef.current, ...newDates]
      : [...newDates, ...datesRef.current]
    setDates(datesRef.current)
  }

  return (
    <HorizontalScreenList
      data={dates}
      renderItem={renderItem}
      onScreenChange={onScreenChange}
      initialScrollIndex={datePaddingCount}
      onStartReached={() => onDatesEndReached(false)}
      onEndReached={() => onDatesEndReached(true)}
    />
  )
}

export default observer(WorkoutHorizontalList)
