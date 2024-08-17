import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { Calendar } from 'react-native-calendario'
import { MarkedDays } from 'react-native-month'
import { Appbar } from 'react-native-paper'

import CalendarWorkoutModal from 'app/components/CalendarWorkoutModal'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { navigate, useRouteParams } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { Icon, colors } from 'designSystem'

export type CalendarPageParams = {
  copyWorkoutMode?: boolean
}
const CalendarPage: React.FC = () => {
  const { workoutStore, stateStore } = useStores()

  const { copyWorkoutMode } = useRouteParams('Calendar')
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

  const monthBeforeFirstWorkout = useMemo(
    () =>
      DateTime.fromISO(
        workoutStore.workouts.at(-1)?.date ?? new Date().toISOString()
      )
        .minus({ month: 1 })
        .toISO() ?? undefined,
    []
  )

  const lastDayOfNextMonth = useMemo(
    () => DateTime.now().plus({ month: 1 }).endOf('month').toJSDate(),
    []
  )

  const activeDate = useMemo(
    () => DateTime.fromISO(stateStore.openedDate).toJSDate(),
    [stateStore.openedDate]
  )

  function onBackPress() {
    navigate('Workout')
  }

  function handleCalendarDayPress(date: Date) {
    const dateString = DateTime.fromISO(date.toISOString()).toISODate()!
    const didWorkoutOnDate = Object.keys(markedDates).includes(dateString)
    if (didWorkoutOnDate) {
      setOpenedWorkoutDialogDate(dateString)
    } else {
      goToDay(dateString)
    }
  }
  function goToDay(date: string) {
    stateStore.setOpenedDate(date)
    navigate('Workout')
  }

  function handleModalAction() {
    setOpenedWorkoutDialogDate('')

    if (copyWorkoutMode) {
      const workout = workoutStore.getWorkoutForDate(openedWorkoutDialogDate)

      workoutStore.copyWorkout(workout!)
      navigate('Workout')
    } else {
      goToDay(openedWorkoutDialogDate)
    }
  }

  return (
    <>
      <EmptyLayout>
        <Appbar.Header style={{ backgroundColor: colors.primary }}>
          <Appbar.BackAction
            onPress={onBackPress}
            color={colors.primaryText}
          />
          <Appbar.Content
            title={translate('calendar')}
            color={colors.primaryText}
          />
          <Appbar.Action
            icon={() => (
              <Icon
                icon="ellipsis-vertical"
                color={colors.primaryText}
              />
            )}
            onPress={() => {}}
            animated={false}
          />
        </Appbar.Header>

        <Calendar
          onPress={date => {
            handleCalendarDayPress(date)
          }}
          startDate={activeDate}
          startingMonth={monthBeforeFirstWorkout}
          endDate={lastDayOfNextMonth}
          markedDays={markedDates}
          theme={{
            startDateContainerStyle: {
              backgroundColor: colors.primary,
              aspectRatio: 1,
            },
            dayContainerStyle: {
              backgroundColor: colors.secondary,
            },
            todayContainerStyle: {
              backgroundColor: colors.primaryLighter,
              aspectRatio: 1,
              borderRadius: 50,
            },
          }}
          disableRange
          monthHeight={370}
          firstDayMonday
        />
      </EmptyLayout>
      {openedWorkoutDialogDate && (
        <CalendarWorkoutModal
          open={!!openedWorkoutDialogDate}
          workoutDate={openedWorkoutDialogDate}
          onClose={() => setOpenedWorkoutDialogDate('')}
          action={handleModalAction}
          actionText={translate(
            copyWorkoutMode ? 'copyWorkout' : 'goToWorkout'
          )}
        />
      )}
    </>
  )
}

export default observer(CalendarPage)
