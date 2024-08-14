import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import { Calendar } from 'react-native-calendario'
import { MarkedDays } from 'react-native-month'
import { Appbar } from 'react-native-paper'

import CalendarWorkoutModal from '../components/CalendarWorkoutModal'
import { useStores } from '../db/helpers/useStores'
import { Icon } from '../../designSystem'
import colors from '../../designSystem/colors'
import texts from '../texts'

const CalendarPage: React.FC = () => {
  const { workoutStore, stateStore } = useStores()

  const [openedWorkoutDialogDate, setOpenedWorkoutDialogDate] = useState('')

  const markedDates = useMemo(
    () =>
      workoutStore.workouts.reduce((acc, curr) => {
        if (!(curr.date in acc)) {
          acc[curr.date] = {}
        }
        acc[curr.date].dots = [
          {
            color: colors.primary,
            selectedColor: colors.primaryText,
          },
        ]

        return acc
      }, {} as MarkedDays),
    [workoutStore.workouts, stateStore.openedDate, stateStore.openedWorkout]
  )

  const startingMonth = useMemo(
    () => DateTime.now().minus({ month: 6 }).toFormat('yyyy-MM-dd'),
    []
  )
  const today = useMemo(() => DateTime.now().toJSDate(), [])

  // const router = useRouter();

  function onBackPress() {
    router.push('/')
  }

  function handleCalendarDayPress(date: Date) {
    const dateString = DateTime.fromISO(date.toISOString()).toISODate()!
    if (Object.keys(markedDates).includes(dateString)) {
      setOpenedWorkoutDialogDate(dateString)
    }
  }
  function goGoDay() {
    stateStore.setOpenedDate(openedWorkoutDialogDate)
    setOpenedWorkoutDialogDate('')
    router.push('/')
  }
  return (
    <>
      <View>
        <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
          <Appbar.BackAction onPress={onBackPress} />
          <Appbar.Content title={texts.calendar} />
          <Appbar.Action
            icon={() => <Icon icon="ellipsis-vertical" />}
            onPress={() => {}}
            animated={false}
          />
        </Appbar.Header>

        <Calendar
          onPress={date => {
            handleCalendarDayPress(date)
          }}
          startDate={today}
          startingMonth={startingMonth}
          markedDays={markedDates}
          theme={{
            startDateContainerStyle: {
              backgroundColor: colors.primary,
              width: 39,
              flex: 0,
            },
          }}
          disableRange
          monthHeight={370}
          numberOfMonths={24}
          firstDayMonday
        />
      </View>
      {openedWorkoutDialogDate !== '' && (
        <CalendarWorkoutModal
          open={openedWorkoutDialogDate !== ''}
          workoutDate={openedWorkoutDialogDate}
          onClose={() => setOpenedWorkoutDialogDate('')}
          onConfirm={goGoDay}
          confirmButtonText={texts.goToWorkout}
        />
      )}
    </>
  )
}

export default observer(CalendarPage)
