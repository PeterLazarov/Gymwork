import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { Calendar } from 'react-native-calendario'
import { MarkedDays } from 'react-native-month'

import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { navigate, useRouteParams } from 'app/navigators'
import { EmptyLayout } from 'app/layouts/EmptyLayouts'
import { Header, Icon, IconButton, colors, fontSize } from 'designSystem'
import CalendarWorkoutModal from 'app/components/CalendarWorkoutModal'

export type CalendarScreenParams = {
  copyWorkoutMode?: boolean
}
const CalendarScreen: React.FC = () => {
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
            color: colors.secondary,
            selectedColor: colors.secondaryText,
          },
        ]

        return acc
      }, {} as MarkedDays),
    [workoutStore.workouts, stateStore.openedDate, stateStore.openedWorkout]
  )

  const startingMonth = useMemo(
    () => DateTime.fromISO(stateStore.firstRenderedDate).minus({ month: 1 }),
    [stateStore.firstRenderedDate]
  )

  const lastDayOfNextMonth = useMemo(
    () => DateTime.now().plus({ month: 1 }).endOf('month').toJSDate(),
    []
  )

  const activeDate = useMemo(
    () => DateTime.fromISO(stateStore.openedDate),
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

  function onModalAction() {
    setOpenedWorkoutDialogDate('')
    navigate('Workout')
  }

  // ! must be a whole number
  const monthsToRender = useMemo(() => {
    const start = DateTime.fromISO(stateStore.firstRenderedDate)
    const end = DateTime.fromISO(stateStore.lastRenderedDate)
    const diff = end.diff(start)

    return Math.ceil(diff.as('months'))
  }, [])

  return (
    <>
      <EmptyLayout>
        <Header>
          <IconButton
            onPress={onBackPress}
            underlay="darker"
          >
            <Icon
              icon="chevron-back"
              color={colors.primaryText}
            />
          </IconButton>
          <Header.Title title={translate('calendar')} />
          <IconButton
            onPress={() => {}}
            underlay="darker"
          >
            <Icon
              icon="ellipsis-vertical"
              color={colors.primaryText}
            />
          </IconButton>
        </Header>

        <Calendar
          onPress={date => {
            handleCalendarDayPress(date)
          }}
          startDate={activeDate.toJSDate()}
          startingMonth={startingMonth.toISO()!}
          endDate={lastDayOfNextMonth}
          markedDays={markedDates}
          numberOfMonths={monthsToRender}
          theme={{
            startDateContainerStyle: {
              backgroundColor: colors.secondary,
              aspectRatio: 1,
            },
            dayContainerStyle: {
              backgroundColor: colors.neutralLighter,
            },
            todayContainerStyle: {
              backgroundColor: colors.secondaryLighter,
              aspectRatio: 1,
              borderRadius: 50,
            },
            monthTitleTextStyle: {
              fontSize: fontSize.lg,
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
          calendarAction={onModalAction}
          mode={copyWorkoutMode ? 'copy' : 'view'}
        />
      )}
    </>
  )
}

export default observer(CalendarScreen)
