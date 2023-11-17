import { useRouter } from 'expo-router'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

import { useStores } from '../db/helpers/useStores'
import { Divider, Icon } from '../designSystem'
import { capitalize } from '../utils/string'

const DayControl = () => {
  const { openedDate, incrementCurrentDate, decrementCurrentDate } = useStores()
  const router = useRouter()

  const luxonDate = DateTime.fromISO(openedDate)
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(luxonDate.diff(today, 'days').days)
  const label =
    Math.abs(todayDiff) < 2
      ? luxonDate.toRelativeCalendar()!
      : luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  function openCalendar() {
    router.push('/Calendar')
  }

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Appbar.Action
          icon={() => <Icon icon="chevron-back" />}
          onPress={decrementCurrentDate}
          animated={false}
        />
        <Appbar.Content
          title={capitalize(label)}
          onPress={openCalendar}
        />
        <Appbar.Action
          icon={() => <Icon icon="chevron-forward" />}
          onPress={incrementCurrentDate}
          animated={false}
        />
      </View>
      <Divider />
    </>
  )
}

export default observer(DayControl)
