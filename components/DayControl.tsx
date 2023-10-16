import { useAtom } from 'jotai'
import { DateTime } from 'luxon'
import React from 'react'
import { View, Text, Button } from 'react-native'

import { dateAtom } from '../atoms'

const DayControl = () => {
  const [date, setDate] = useAtom(dateAtom)

  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(date.diff(today, 'days').days)
  const label =
    Math.abs(todayDiff) < 2
      ? date.toRelativeCalendar()
      : date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  return (
    <View>
      <Text>{label}</Text>
      <Button
        title="-"
        onPress={() => setDate(date.minus({ days: 1 }))}
      />
      <Button
        title="+"
        onPress={() => setDate(date.plus({ days: 1 }))}
      />
    </View>
  )
}

export default DayControl
