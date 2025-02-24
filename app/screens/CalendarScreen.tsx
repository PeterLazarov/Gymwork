import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { MenuView } from '@react-native-menu/menu'
import { useNavigation, type StaticScreenProps } from '@react-navigation/native'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { useMemo, useRef, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Calendar } from 'react-native-calendario'
import { MarkedDays } from 'react-native-month'

import { useAppTheme } from '@/utils/useAppTheme'
import WorkoutSheet from 'app/components/WorkoutModal'
import { useStores } from 'app/db/helpers/useStores'
import { translate } from 'app/i18n'
import { EmptyLayout } from 'app/layouts/EmptyLayout'
import { HeaderRight, Icon, IconButton, fontSize } from 'designSystem'

export type CalendarScreenParams = StaticScreenProps<{
  copyWorkoutMode?: boolean
}>

export const CalendarScreen: React.FC<CalendarScreenParams> = observer(
  ({ route: { params } }) => {
    const {
      theme: { colors },
    } = useAppTheme()

    const { workoutStore, stateStore } = useStores()

    const { navigate } = useNavigation()

    const { copyWorkoutMode } = params

    const workoutSheetRef = useRef<TrueSheet>(null)
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

    function handleCalendarDayPress(date: Date) {
      console.log({ date })
      const dateString = DateTime.fromISO(date.toISOString()).toISODate()!
      const didWorkoutOnDate = Object.keys(markedDates).includes(dateString)
      if (didWorkoutOnDate) {
        setOpenedWorkoutDialogDate(dateString)
        workoutSheetRef.current?.present()
      } else {
        goToDay(dateString)
      }
    }
    function goToDay(date: string) {
      console.log('goToDay', date)
      stateStore.setOpenedDate(date)

      navigate('Home', {
        screen: 'WorkoutStack',
        params: {
          screen: 'Workout',
          params: {
            workoutDate: date,
          },
        },
      })
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
          <HeaderRight>
            <MenuView
              onPressAction={({ nativeEvent }) => {
                navigate('UserFeedback', { referrerPage: 'CalendarScreen' })
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
          </HeaderRight>

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

        <WorkoutSheet
          ref={workoutSheetRef}
          workout={workoutStore.dateWorkoutMap[openedWorkoutDialogDate]!}
          onDismiss={() => setOpenedWorkoutDialogDate('')}
          mode={copyWorkoutMode ? 'copy' : 'view'}
        />
      </>
    )
  }
)
