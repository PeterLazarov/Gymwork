import { SVGRenderer, SvgChart } from "@wuba/react-native-echarts"
import { LineChart, BarChart } from "echarts/charts"
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components"
import { ECharts, init, use } from "echarts/core"
import { DateTime, Interval } from "luxon"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Dimensions, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { CHART_VIEW } from "@/constants/chartViews"
import { useOpenedWorkout } from "@/context/OpenedWorkoutContext"
import { useSetting } from "@/context/SettingContext"
import { ExerciseModel } from "@/db/models/ExerciseModel"
import { SetModel } from "@/db/models/SetModel"
import { WorkoutModel } from "@/db/models/WorkoutModel"
import { seriesSetup } from "../utils/seriesSetup"
import { useChartConfig } from "../utils/useChartConfig"

// Docs
// https://echarts.apache.org/en/option.html#title

// Register extensions
use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  SVGRenderer,
  LegendComponent,
  // TimelineComponent,
  BarChart,
  LineChart,
])

function getPastDays(n: number) {
  return Array.from({ length: n }).map((_, i) => {
    return DateTime.now()
      .set({ hour: 0, minute: 0, second: 0 })
      .minus({ days: n - 1 - i })
  })
}

type ExerciseStatsChartProps = {
  view: CHART_VIEW
  height?: number
  width?: number
  exercise: ExerciseModel
  exerciseHistory: WorkoutModel[]
}
export const ExerciseStatsChart: React.FC<ExerciseStatsChartProps> = ({
  view,
  height,
  width,
  exercise,
  exerciseHistory,
}) => {
  const { setOpenedDate } = useOpenedWorkout()
  const { measureRest } = useSetting()
  const chartElRef = useRef<any>(null)
  const eChartRef = useRef<ECharts>(null)

  const symbolSize: number = useMemo(
    () =>
      (
        ({
          "30D": 10,
          "3M": 5,
          "6M": 5,
          "ALL": 5,
        }) satisfies Record<CHART_VIEW, number>
      )[view],
    [view],
  )

  const viewDays: DateTime[] = useMemo(() => {
    const fallback = getPastDays(1)

    switch (view) {
      case "30D":
        return getPastDays(30)
      case "3M":
        return getPastDays(90)
      case "6M":
        return getPastDays(180)
      case "ALL": {
        if (!exerciseHistory || exerciseHistory.length === 0) {
          return fallback
        }

        const firstWorkout = exerciseHistory[exerciseHistory.length - 1]
        const lastWorkout = exerciseHistory[0]

        if (!firstWorkout?.date || !lastWorkout?.date) {
          return fallback
        }

        const interval = Interval.fromDateTimes(
          DateTime.fromMillis(firstWorkout.date),
          DateTime.fromMillis(lastWorkout.date),
        )

        return [
          ...interval.splitBy({ days: 1 }).map((d) => d.start!),
          DateTime.fromMillis(lastWorkout.date),
        ]
      }

      default:
        return fallback
    }
  }, [view, exercise, exerciseHistory])

  const xAxis = useMemo(() => {
    return viewDays.map((d) => d.toFormat("dd LLL"))
  }, [view, exercise])

  const dateWorkoutMap = useMemo(() => {
    const map = new Map<string, WorkoutModel>()
    exerciseHistory.forEach((workout) => {
      if (workout.date) {
        const dateKey = DateTime.fromMillis(workout.date).toISODate()
        if (dateKey) {
          map.set(dateKey, workout)
        }
      }
    })
    return map
  }, [exerciseHistory])

  const setsByDay = useMemo(() => {
    return viewDays.map((date) => {
      const dateKey = date.toISODate()
      if (!dateKey) return []

      const workout = dateWorkoutMap.get(dateKey)
      if (!workout) return []

      const sets: SetModel[] = []
      workout.workoutSteps.forEach((step) => {
        const exerciseSets = step.sets.filter((set) => set.exerciseId === exercise.id)
        sets.push(...exerciseSets)
      })

      return sets
    })
  }, [exercise, viewDays, dateWorkoutMap])

  const { getChartSeries } = seriesSetup({ data: setsByDay })

  const series = getChartSeries(exercise, measureRest)

  const { getViewOptions, feedChartSeriesData } = useChartConfig({
    series,
    symbolSize,
    xAxis,
  })
  const chartHeight = useMemo(() => height ?? 400, [height])
  const chartWidth = useMemo(() => width ?? Dimensions.get("window").width, [width])

  const [selectedDate, setSelectedDate] = useState<string>()

  const onHighlight = useCallback(
    (data: unknown) => {
      // @ts-ignore TODO: fix this
      const dateIndex = data.batch?.[0]?.dataIndex as number
      const date = viewDays[dateIndex]

      if (!date || dateIndex === undefined) {
        setSelectedDate(undefined)
        return
      }

      const dateKey = date.toISODate()
      if (!dateKey) {
        setSelectedDate(undefined)
        return
      }

      const workout = dateWorkoutMap.get(dateKey)

      if (!workout) {
        setSelectedDate(undefined)
        return
      }

      setSelectedDate(dateKey)
    },
    [viewDays, dateWorkoutMap],
  )

  useEffect(() => {
    if (chartElRef.current && !eChartRef.current) {
      eChartRef.current = init(chartElRef.current, "light", {
        renderer: "svg",
        width,
        height,
      })

      eChartRef.current?.on("highlight", onHighlight)
    }

    return () => {
      if (eChartRef.current) {
        eChartRef.current.dispose()
        eChartRef.current = null as any
      }
    }
  }, [width, height, onHighlight])

  useEffect(() => {
    if (eChartRef.current) {
      eChartRef.current.setOption(getViewOptions, { notMerge: true })
    }
  }, [getViewOptions, exercise, view])

  useEffect(() => {
    if (eChartRef.current) {
      eChartRef.current.setOption({
        series: feedChartSeriesData(setsByDay),
      })
    }
  }, [feedChartSeriesData, setsByDay])

  // TODO does not highlight set in question
  function linkToWorkoutDate() {
    setOpenedDate(selectedDate!)
    // navigate to workout screen
  }

  return (
    <>
      <View
        style={{
          height: chartHeight ? chartHeight - 48 : undefined,
          width: chartWidth,
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SvgChart ref={chartElRef} />
        </GestureHandlerRootView>
        {/* <Button
          disabled={!selectedDate}
          onPress={handleBtnPress}
        >
          {texts.goToWorkout}
        </Button> */}
      </View>
    </>
  )
}
