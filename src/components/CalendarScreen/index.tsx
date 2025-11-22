import { useFocusEffect } from "@react-navigation/native"
import { DateTime } from "luxon"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useWindowDimensions } from "react-native"
import { Calendar } from "react-native-calendario"
import { MarkedDays } from "react-native-month"

import { WorkoutModal } from "@/components/CalendarScreen/WorkoutModal"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useAllWorkoutIds } from "@/db/hooks/useWorkoutsActions"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { useDatabaseService } from "@/db/useDB"
import { fontSize, Header, Icon, IconButton, Menu, useColors } from "@/designSystem"
import { BaseLayout } from "@/layouts/BaseLayout"
import { AppStackScreenProps, useRouteParams } from "@/navigators/navigationTypes"
import { msToIsoDate, translate } from "@/utils"

type WorkoutResult = {
  id: number
  date: number
}

export type CalendarScreenParams = {
  copyWorkoutMode?: boolean
}
interface CalendarScreenProps extends AppStackScreenProps<"Calendar"> {}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const colors = useColors()

  const { openedDateObject, setOpenedDate } = useOpenedWorkout()
  const { data: workoutIdsData } = useAllWorkoutIds()
  const db = useDatabaseService()
  const [markedDates, setMarkedDates] = useState<MarkedDays>({})

  const { copyWorkoutMode } = useRouteParams("Calendar")
  const [openedWorkout, setOpenedWorkout] = useState<WorkoutModel | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useFocusEffect(
    useCallback(() => {
      return () => setMenuOpen(false)
    }, []),
  )

  const [workouts, setWorkouts] = useState<WorkoutResult[]>([])

  useEffect(() => {
    if (!workoutIdsData) return
    const results: WorkoutResult[] = workoutIdsData
      .filter((w) => w.date !== null)
      .map((w) => ({ id: w.id, date: w.date as number }))
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
  }, [workoutIdsData, colors])

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
      db.getWorkoutByDate(dateLuxon.toMillis()).then((workout: any) => {
        if (workout) setOpenedWorkout(WorkoutModel.from(workout))
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
    requestAnimationFrame(() => navigation.navigate("UserFeedback", { referrerPage: "Calendar" }))
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
            position="bottom-right"
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
