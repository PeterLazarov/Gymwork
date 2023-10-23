import React, { useMemo } from 'react'
import { Text, View } from 'react-native'
import Nav from '../components/Nav'
import { Calendar } from 'react-native-calendars'
import { useAtom, useAtomValue } from 'jotai'
import { dateAtom, workoutHistoryAtom } from '../atoms'
import { MarkedDates } from 'react-native-calendars/src/types'
import { DateTime } from 'luxon'
import { useRouter } from 'expo-router'

const CalendarPage = () => {
  const workoutHistory = useAtomValue(workoutHistoryAtom)
  const [globalDay, setGlobalDay] = useAtom(dateAtom)

  const markedDates = useMemo((): MarkedDates => {
    return Object.fromEntries(
      Object.entries(workoutHistory).map(([date]) => [date, { marked: true }])
    )
  }, [workoutHistory])

  const router = useRouter()

  function handleCalendarDayPress(dateString: string) {
    // Set global day, navigate to workout screen
    setGlobalDay(DateTime.fromISO(dateString))
    router.push('/')
  }

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

export default CalendarPage
