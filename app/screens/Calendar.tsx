import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { Calendar } from 'react-native-calendario'
import { MarkedDays } from 'react-native-month'
import { Appbar } from 'react-native-paper'

import CalendarWorkoutModal from 'app/components/CalendarWorkoutModal'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { navigate } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { Icon, colors } from 'designSystem'

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

  function onBackPress() {
    navigate('Workout')
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
    navigate('Workout')
  }
  return (
    <>
      <EmptyLayout>
        <Appbar.Header style={{ backgroundColor: colors.lightgray }}>
          <Appbar.BackAction onPress={onBackPress} />
          <Appbar.Content title={translate('calendar')} />
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
              aspectRatio: 1,
            },
            dayContainerStyle: {
              backgroundColor: colors.secondary,
            },
          }}
          disableRange
          monthHeight={370}
          numberOfMonths={24}
          firstDayMonday
        />
      </EmptyLayout>
      {openedWorkoutDialogDate !== '' && (
        <CalendarWorkoutModal
          open={openedWorkoutDialogDate !== ''}
          workoutDate={openedWorkoutDialogDate}
          onClose={() => setOpenedWorkoutDialogDate('')}
          onConfirm={goGoDay}
          confirmButtonText={translate('goToWorkout')}
        />
      )}
    </>
  )
}

export default observer(CalendarPage)
