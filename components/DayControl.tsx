import { Link } from 'expo-router'
import { DateTime } from 'luxon'
import { onPatch } from 'mobx-state-tree'
import React, { useState } from 'react'
import { View } from 'react-native'

import { Icon, IconButtonContainer } from '../designSystem'
import { HeadingLabel } from '../designSystem/Label'
import { useStores } from '../models/helpers/useStores'

const DayControl = () => {
  const { workoutStore } = useStores()
  const [currentDate, setCurrentDate] = useState(
    workoutStore.currentWorkoutDate
  )

  onPatch(workoutStore, patch => {
    if (patch.path === '/currentWorkoutDate') {
      setCurrentDate(workoutStore.currentWorkoutDate)
    }
  })

  const luxonDate = DateTime.fromISO(currentDate)
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(luxonDate.diff(today, 'days').days)
  const label =
    Math.abs(todayDiff) < 2
      ? luxonDate.toRelativeCalendar()
      : luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  return (
    <View
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <IconButtonContainer onPress={workoutStore.decrementCurrentDate}>
        <Icon icon="chevron-back" />
      </IconButtonContainer>
      <Link
        href="/Calendar"
        style={{ flex: 1 }}
      >
        <HeadingLabel>{label}</HeadingLabel>
      </Link>
      <IconButtonContainer onPress={workoutStore.incrementCurrentDate}>
        <Icon icon="chevron-forward" />
      </IconButtonContainer>
    </View>
  )
}

export default DayControl
