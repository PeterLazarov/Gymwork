import { useNavigation } from '@react-navigation/native'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useAppTheme } from '@/utils/useAppTheme'
import { useStores } from 'app/db/helpers/useStores'
import { capitalize } from 'app/utils/string'
import { Icon, IconButton, Text, fontSize, spacing } from 'designSystem'

type Props = {
  duration?: string
}
const DayControl: React.FC<Props> = ({ duration }) => {
  const {
    theme: { colors, boxShadows },
  } = useAppTheme()

  const { stateStore } = useStores()

  const { navigate } = useNavigation()

  const luxonDate = DateTime.fromISO(stateStore.openedDate)
  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0 })
  const todayDiff = Math.round(luxonDate.diff(today, 'days').days)
  const dateLabel =
    Math.abs(todayDiff) < 2
      ? luxonDate.toRelativeCalendar({ unit: 'days' })!
      : luxonDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
  const label = duration ? `${dateLabel} - ${duration}` : dateLabel

  const isEarliestDate = stateStore.openedDate === stateStore.firstRenderedDate
  const isLastDate = stateStore.openedDate === stateStore.lastRenderedDate

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceContainerLowest,
        padding: spacing.xxs,
        ...boxShadows.default,
      }}
    >
      <IconButton
        onPress={stateStore.decrementCurrentDate}
        disabled={isEarliestDate}
      >
        <Icon icon="chevron-back" />
      </IconButton>
      <TouchableOpacity
        onPress={() => navigate('Calendar', {})}
        style={{ flex: 1 }}
      >
        <Text style={{ fontSize: fontSize.lg }}>{capitalize(label)}</Text>
      </TouchableOpacity>
      <IconButton
        onPress={stateStore.incrementCurrentDate}
        disabled={isLastDate}
      >
        <Icon icon="chevron-forward" />
      </IconButton>
    </View>
  )
}

export default observer(DayControl)
