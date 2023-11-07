import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Text, View } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'

import { useStores } from '../db/helpers/useStores'

const CalendarPage: React.FC = () => {
  const { workoutStore } = useStores()

  const markedDates = Object.fromEntries(
    Object.entries(workoutStore.workouts).map(([_, { date }]) => [
      date,
      { marked: true },
    ])
  )

  const router = useRouter()

  function handleCalendarDayPress(dateString: string) {
    // Set global day, navigate to workout screen
    workoutStore.setProp('currentWorkoutDate', dateString)
    router.push('/')
  }
  console.log(markedDates)
  return (
    <View>
      <Text>Calendar Page</Text>

      <Calendar
        onDayPress={({ dateString }) => {
          handleCalendarDayPress(dateString)
        }}
        markedDates={markedDates}
      />
    </View>
  )
}

export default observer(CalendarPage)
