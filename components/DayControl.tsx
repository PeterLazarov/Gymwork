import { Link } from 'expo-router'
import { useAtom } from 'jotai'
import { DateTime } from 'luxon'
import React from 'react'
import { View } from 'react-native'

import { dateAtom } from '../atoms'
import { Icon, IconButtonContainer } from '../designSystem'
import { HeadingLabel } from '../designSystem/Label'

const DayControl = () => {
  const [date, setDate] = useAtom(dateAtom)

  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(date.diff(today, 'days').days)
  const label =
    Math.abs(todayDiff) < 2
      ? date.toRelativeCalendar()
      : date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  return (
    <View
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <IconButtonContainer onPress={() => setDate(date.minus({ days: 1 }))}>
        <Icon icon="chevron-back" />
      </IconButtonContainer>
      <Link
        href="/Calendar"
        style={{ flex: 1 }}
      >
        <HeadingLabel>{label}</HeadingLabel>
      </Link>
      <IconButtonContainer onPress={() => setDate(date.plus({ days: 1 }))}>
        <Icon icon="chevron-forward" />
      </IconButtonContainer>
    </View>
  )
}

export default DayControl
