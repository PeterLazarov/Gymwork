import { useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import { CalendarList } from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'
import { Appbar } from 'react-native-paper'

import CalendarWorkoutModal from '../components/CalendarWorkoutModal'
import { useStores } from '../db/helpers/useStores'
import { Icon } from '../designSystem'
import colors from '../designSystem/colors'
import texts from '../texts'

const CalendarPage: React.FC = () => {
  const { workoutStore, stateStore } = useStores()

  const [openedWorkoutDialogDate, setOpenedWorkoutDialogDate] = useState('')

  const markedDates = useMemo(
    () =>
      workoutStore.workouts.reduce(
        (acc, curr) => {
          if (!(curr.date in acc)) {
            acc[curr.date] = {}
          }
          acc[curr.date].marked = true
          acc[curr.date].dotColor = colors.primary

          return acc
        },
        {
          [stateStore.openedDate]: {
            selected: true,
          },
        } as MarkedDates
      ),
    [workoutStore.workouts, stateStore.openedDate, stateStore.openedWorkout]
  )

  const router = useRouter()

  function onBackPress() {
    router.push('/')
  }

  function handleCalendarDayPress(dateString: string) {
    setOpenedWorkoutDialogDate(dateString)
  }
  function goGoDay() {
    stateStore.setOpenedDate(openedWorkoutDialogDate)
    setOpenedWorkoutDialogDate('')
    router.push('/')
  }
  return (
    <>
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

        <CalendarList
          onDayPress={({ dateString }) => {
            handleCalendarDayPress(dateString)
          }}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: colors.primary,
            arrowColor: colors.primary,
          }}
          pastScrollRange={12}
          futureScrollRange={1}
          calendarHeight={360}
          animateScroll
        />
      </View>
      {openedWorkoutDialogDate !== '' && (
        <CalendarWorkoutModal
          open={openedWorkoutDialogDate !== ''}
          workoutDate={openedWorkoutDialogDate}
          onClose={() => setOpenedWorkoutDialogDate('')}
          onConfirm={goGoDay}
          confirmButtonText="Go to"
        />
      )}
    </>
  )
}

export default observer(CalendarPage)
