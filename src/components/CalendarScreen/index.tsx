import { DateTime } from "luxon"
import React, { useEffect, useMemo, useState } from "react"
import { useWindowDimensions } from "react-native"
import { Calendar } from "react-native-calendario"
import { MarkedDays } from "react-native-month"
import { Menu } from "react-native-paper"

import { WorkoutModal } from "@/components/CalendarScreen/WorkoutModal"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { useAllWorkoutsQuery, WorkoutResult } from "@/db/queries/useAllWorkoutIdsQuery"
import { useWorkoutFullQuery } from "@/db/queries/useWorkoutFullQuery"
import { fontSize, Header, Icon, IconButton, useColors } from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { AppStackScreenProps, useRouteParams } from "@/navigators/navigationTypes"
import { msToIsoDate, translate } from "@/utils"

export type CalendarScreenParams = {
  copyWorkoutMode?: boolean
}
interface CalendarScreenProps extends AppStackScreenProps<"Calendar"> {}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const colors = useColors()

  const { openedDateObject, setOpenedDate } = useOpenedWorkout()
  const getWorkouts = useAllWorkoutsQuery()
  const workoutFullQuery = useWorkoutFullQuery()
  const [markedDates, setMarkedDates] = useState<MarkedDays>({})

  const { copyWorkoutMode } = useRouteParams("Calendar")
  const [openedWorkout, setOpenedWorkout] = useState<WorkoutModel | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const [workouts, setWorkouts] = useState<WorkoutResult[]>([])

  useEffect(() => {
    getWorkouts().then((results: WorkoutResult[]) => {
      setWorkouts(results)

      setMarkedDates(
        results.reduce((acc, curr) => {
          const isoDate = msToIsoDate(curr.date!)
          if (!(isoDate in acc)) {
            acc[isoDate] = {}
          }
          acc[isoDate]!.dots = [
            {
              color: colors.tertiary,
              selectedColor: colors.onTertiary,
            },
          ]

          return acc
        }, {} as MarkedDays),
      )
    })
  }, [])

  const firstRenderedDate = useMemo(() => {
    if (workouts.length === 0) return null
    return DateTime.fromMillis(workouts[0].date!)
  }, [workouts])

  const startingMonth = useMemo(() => {
    if (!firstRenderedDate) {
      const now = DateTime.now()
      const today = now.set({ hour: 0, minute: 0, second: 0 })
      return today.minus({ month: 1 })
    }

    return firstRenderedDate?.minus({ month: 1 })
  }, [firstRenderedDate])

  const lastDayOfNextMonth = useMemo(
    () => DateTime.now().plus({ month: 1 }).endOf("month").toJSDate(),
    [],
  )

  function onBackPress() {
    navigation.navigate("Workout")
  }

  function handleCalendarDayPress(date: Date) {
    const dateLuxon = DateTime.fromISO(date.toISOString())
    const dateString = dateLuxon.toISODate()!
    const didWorkoutOnDate = Object.keys(markedDates).includes(dateString)

    if (didWorkoutOnDate) {
      workoutFullQuery(dateLuxon.toMillis()).then((workout) => {
        setOpenedWorkout(WorkoutModel.from(workout!))
      })
    } else {
      goToDay(dateString)
    }
  }

  function goToDay(date: string) {
    setOpenedDate(date)
    navigation.navigate("Workout")
  }

  function goToFeedback() {
    setMenuOpen(false)
    navigation.navigate("UserFeedback", { referrerPage: activeRoute ?? "?" })
  }

  // ! must be a whole number
  const monthsToRender = useMemo(() => {
    if (!firstRenderedDate) return 3

    const end = DateTime.fromMillis(workouts[workouts.length - 1].date!)
    const diff = end.diff(firstRenderedDate)

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
      {openedWorkout && (
        <WorkoutModal
          open={!!openedWorkout}
          workout={openedWorkout}
          onClose={() => setOpenedWorkout(null)}
          mode={copyWorkoutMode ? "copy" : "view"}
        />
      )}
    </>
  )
}
