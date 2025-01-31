import { MenuView } from '@react-native-menu/menu'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Calendar } from 'react-native-calendario'
import { MarkedDays } from 'react-native-month'

import { useAppTheme } from '@/utils/useAppTheme'
import WorkoutModal from 'app/components/WorkoutModal'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { useRouteParams } from 'app/navigators'
import { Header, Icon, IconButton, fontSize } from 'designSystem'

export type CalendarScreenParams = {
  copyWorkoutMode?: boolean
}
export const CalendarScreen: React.FC = observer(() => {
  const {
    theme: { colors },
  } = useAppTheme()

  const {
    workoutStore,
    stateStore,
    navStore: { navigate, activeRoute },
  } = useStores()

  const { copyWorkoutMode } = useRouteParams('Calendar')

  const [openedWorkoutDialogDate, setOpenedWorkoutDialogDate] = useState('')

  const markedDates = useMemo(
    () =>
      workoutStore.workouts.reduce((acc, curr) => {
        if (!(curr.date in acc)) {
          acc[curr.date] = {}
        }
        acc[curr.date]!.dots = [
          {
            color: colors.tertiary,
            selectedColor: colors.onTertiary,
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
    navigate('WorkoutStack', { screen: 'Workout' })
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
    navigate('WorkoutStack', { screen: 'Workout' })
  }

  // ! must be a whole number
  const monthsToRender = useMemo(() => {
    const start = DateTime.fromISO(stateStore.firstRenderedDate)
    const end = DateTime.fromISO(stateStore.lastRenderedDate)
    const diff = end.diff(start)

    return Math.ceil(diff.as('months'))
  }, [])

  const dimensions = useWindowDimensions()

  return (
    <>
      <EmptyLayout>
        <Header>
          <MenuView
            onPressAction={({ nativeEvent }) => {
              navigate('UserFeedback', { referrerPage: activeRoute ?? '?' })
            }}
            actions={[
              {
                id: 'goToFeedback',
                title: translate('giveFeedback'),
                titleColor: colors.onSurface,
              },
            ]}
            shouldOpenOnLongPress={false}
          >
            <IconButton>
              <Icon
                icon="ellipsis-vertical"
                color={colors.onSurface}
              />
            </IconButton>
          </MenuView>
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
            todayTextStyle: {
              color: colors.onTertiary,
            },
            todayContainerStyle: {
              backgroundColor: colors.tertiary,
              aspectRatio: 1,
              borderRadius: 500,
            },

            // makes all days a circle, therefore all lines equally tall
            dayContainerStyle: {
              backgroundColor: 'transparent',
              aspectRatio: 1,
              borderRadius: 500,
            },

            monthTitleTextStyle: {
              fontSize: fontSize.lg,
              color: colors.onSurface,
            },
            dayTextStyle: {
              fontSize: fontSize.md,
              color: colors.onSurface,
            },

            activeDayTextStyle: {
              color: colors.onPrimary,
            },
            activeDayContainerStyle: {
              backgroundColor: colors.primary,
            },

            weekColumnTextStyle: {
              color: colors.onSurface,
              fontSize: fontSize.md,
            },
          }}
          disableRange
          monthHeight={dimensions.width * 1.15}
          firstDayMonday
        />
      </EmptyLayout>
      {openedWorkoutDialogDate && (
        <WorkoutModal
          open={!!openedWorkoutDialogDate}
          workout={workoutStore.dateWorkoutMap[openedWorkoutDialogDate]!}
          onClose={() => setOpenedWorkoutDialogDate('')}
          mode={copyWorkoutMode ? 'copy' : 'view'}
        />
      )}
    </>
  )
})
