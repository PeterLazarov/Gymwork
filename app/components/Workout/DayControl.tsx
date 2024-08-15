import { Link } from '@react-navigation/native'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'

import { useStores } from '../../db/helpers/useStores'
import { Divider, Icon } from '../../../designSystem'
import colors from '../../../designSystem/colors'
import { capitalize } from '../../utils/string'

const DayControl = () => {
  const { stateStore } = useStores()

  const luxonDate = DateTime.fromISO(stateStore.openedDate)
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(luxonDate.diff(today, 'days').days)
  const label =
    Math.abs(todayDiff) < 2
      ? luxonDate.toRelativeCalendar({ unit: 'days' })!
      : luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.lightgray,
        }}
      >
        <Appbar.Action
          icon={() => <Icon icon="chevron-back" />}
          onPress={stateStore.decrementCurrentDate}
          animated={false}
        />
        <Appbar.Content
          title={
            <Link
              to={{ screen: 'Calendar' }}
              style={{ fontSize: 22 }}
            >
              {capitalize(label)}
            </Link>
          }
        />
        <Appbar.Action
          icon={() => <Icon icon="chevron-forward" />}
          onPress={stateStore.incrementCurrentDate}
          animated={false}
        />
      </View>
      <Divider orientation="horizontal" />
    </>
  )
}

export default observer(DayControl)
