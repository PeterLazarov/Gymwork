import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'
import { Appbar } from 'react-native-paper'

import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'
import texts from '../texts'

const CalendarPage: React.FC = () => {
  const { workoutStore } = useStores()

  const markedDates = useMemo(
    () =>
      workoutStore.workouts.reduce(
        (acc, curr) => {
          if (!(curr.date in acc)) {
            acc[curr.date] = {}
          }
          acc[curr.date].marked = true
          return acc
        },
        {
          [workoutStore.currentWorkoutDate]: {
            selected: true,
          },
        } as MarkedDates
      ),
    [
      workoutStore.workouts,
      workoutStore.currentWorkoutDate,
      workoutStore.currentWorkout,
    ]
  )

  const router = useRouter()

  function onBackPress() {
    router.push('/')
  }

  function handleCalendarDayPress(dateString: string) {
    // Set global day, navigate to workout screen
    workoutStore.setProp('currentWorkoutDate', dateString)
    router.push('/')
  }

  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBackPress} />
        <Appbar.Content title={texts.calendar} />
        <Appbar.Action
          icon={() => <Icon icon="ellipsis-vertical" />}
          onPress={() => {}}
          animated={false}
        />
      </Appbar.Header>

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
