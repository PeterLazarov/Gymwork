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
  const datePaddingCount = 5

  // Initially 11 ISO Dates

  const [dates, setDates] = useState(
    Array.from({ length: 2 * datePaddingCount + 1 }, (_, i) => {
      const newDate = initialOpendate.current.plus({
        days: i - datePaddingCount,
      })
      return newDate.toISODate()!
    })
  )

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

  function prependDays() {
    // console.log('prependDays')
    // debugger
    // setDates(
    //   Array.from({ length: 5 })
    //     .map((_, i) => {
    //       return DateTime.fromISO(dates[0])
    //         .minus({ days: 5 - i })
    //         .toISODate()!
    //     })
    //     .concat(dates)
    // )
  }

  function appendDays() {
    console.log('appendDays')
    debugger
    setDates(
      dates.concat(
        Array.from({ length: 5 }).map((_, i) => {
          return DateTime.fromISO(dates[dates.length - 1])
            .plus({ days: i + 1 })
            .toISODate()!
        })
      )
    )
  }

  return (
    <HorizontalScreenList
      data={dates}
      renderItem={renderItem}
      onScreenChange={onScreenChange}
      initialScrollIndex={datePaddingCount}
      onStartReached={prependDays}
      onEndReached={appendDays}
    />
  )
}

export default observer(WorkoutHorizontalList)
