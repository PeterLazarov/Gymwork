import { useAtom } from 'jotai'
import { DateTime } from 'luxon'
import React from 'react'
import { View, Text } from 'react-native'

import { dateAtom } from '../atoms'

const Workout = () => {
  const [date] = useAtom(dateAtom)

  return (
    <View>
      <Text>Workout</Text>
      <Text>{date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}</Text>
    </View>
  )
}

export default Workout
