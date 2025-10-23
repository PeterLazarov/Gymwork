import { DateTime } from "luxon"
import React, { useMemo, useState } from "react"
import { Calendar } from "react-native-calendario"
import { MarkedDays } from "react-native-month"
import { useWindowDimensions } from "react-native"
import { Menu } from "react-native-paper"

import { Header, Icon, IconButton, useColors, fontSize } from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { translate } from "@/utils"
import { AppStackScreenProps, useRouteParams } from "@/navigators/navigationTypes"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { WorkoutModal } from "@/components/Workout/WorkoutModal"

export type CalendarScreenParams = {
  copyWorkoutMode?: boolean
}
interface CalendarScreenProps extends AppStackScreenProps<"Calendar"> {}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const colors = useColors()

  const { workoutStore, stateStore } = useStores()
  const { openedDate, openedDateObject, openedWorkout } = useOpenedWorkout()

  const { copyWorkoutMode } = useRouteParams("Calendar")
  const [openedWorkoutDialogDate, setOpenedWorkoutDialogDate] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

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
    [workoutStore.workouts, openedDate, openedWorkout],
  )

  const startingMonth = useMemo(
    () => DateTime.fromISO(stateStore.firstRenderedDate).minus({ month: 1 }),
    [stateStore.firstRenderedDate],
  )

  const lastDayOfNextMonth = useMemo(
    () => DateTime.now().plus({ month: 1 }).endOf("month").toJSDate(),
    [],
  )

  function onBackPress() {
    navigation.navigate("Workout")
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
    navigation.navigate("Workout")
  }

  function goToFeedback() {
    setMenuOpen(false)
    navigation.navigate("UserFeedback", { referrerPage: activeRoute ?? "?" })
  }

  // ! must be a whole number
  const monthsToRender = useMemo(() => {
    const start = DateTime.fromISO(stateStore.firstRenderedDate)
    const end = DateTime.fromISO(stateStore.lastRenderedDate)
    const diff = end.diff(start)

    return Math.ceil(diff.as("months"))
  }, [])

  const dimensions = useWindowDimensions()

  return (
    <>
      <BaseLayout>
        <Header>
          <IconButton
            onPress={onBackPress}
            underlay="darker"
          >
            <Icon
              icon="chevron-back"
              color={colors.onPrimary}
            />
          </IconButton>
          <Header.Title title={translate("calendar")} />
          <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            anchorPosition="bottom"
            anchor={
              <IconButton
                onPress={() => setMenuOpen(true)}
                underlay="darker"
              >
                <Icon
                  icon="ellipsis-vertical"
                  color={colors.onPrimary}
                />
              </IconButton>
            }
          >
            <Menu.Item
              onPress={goToFeedback}
              title={translate("giveFeedback")}
            />
          </Menu>
        </Header>

        <Calendar
          onPress={(date) => {
            handleCalendarDayPress(date)
          }}
          startDate={openedDateObject.toJSDate()}
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
              backgroundColor: "transparent",
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
      </BaseLayout>
      {openedWorkoutDialogDate && (
        <WorkoutModal
          open={!!openedWorkoutDialogDate}
          workout={workoutStore.dateWorkoutMap[openedWorkoutDialogDate]!}
          onClose={() => setOpenedWorkoutDialogDate("")}
          mode={copyWorkoutMode ? "copy" : "view"}
        />
      )}
    </>
  )
}
