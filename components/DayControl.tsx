import { useRouter } from 'expo-router'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Appbar } from 'react-native-paper'

import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'

const DayControl = () => {
  const { workoutStore } = useStores()
  const router = useRouter()

  const luxonDate = DateTime.fromISO(workoutStore.currentWorkoutDate)
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(luxonDate.diff(today, 'days').days)
  const label =
    Math.abs(todayDiff) < 2
      ? luxonDate.toRelativeCalendar()
      : luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  function openCalendar() {
    router.push('/Calendar')
  }

  return (
    <Appbar.Header>
      <Appbar.Action
        icon={() => <Icon icon="chevron-back" />}
        onPress={workoutStore.incrementCurrentDate}
        animated={false}
      />
      <Appbar.Content
        title={label}
        onPress={openCalendar}
      />
      <Appbar.Action
        icon={() => <Icon icon="chevron-forward" />}
        onPress={workoutStore.incrementCurrentDate}
        animated={false}
      />
    </Appbar.Header>
  )
}

export default observer(DayControl)
