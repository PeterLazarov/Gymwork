// Choose your preferred renderer
import { SkiaRenderer, SvgChart } from '@wuba/react-native-echarts'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  // TimelineComponent,
} from 'echarts/components'
import { use, ECharts, init } from 'echarts/core'
import { DateInput, DateTime, Interval } from 'luxon'
import { observer } from 'mobx-react-lite'
import { useRef, useEffect, useState, useMemo } from 'react'
import { Dimensions, View } from 'react-native'
import { computed } from 'mobx'

import { useStores } from 'app/db/helpers/useStores'
import useChartConfig from './useChartConfig'
import seriesSetup from './seriesSetup'
import { Exercise } from 'app/db/models'

// Docs
// https://echarts.apache.org/en/option.html#title

// Register extensions
use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  SkiaRenderer,
  LegendComponent,
  // TimelineComponent,
  // ...
  LineChart,
])

function getPastDays(n: number) {
  return Array.from({ length: n }).map((_, i) => {
    return DateTime.now()
      .set({ hour: 0, minute: 0, second: 0 })
      .minus({ days: n - 1 - i })
  })
}

export const CHART_VIEWS = {
  '30D': '30D',
  '3M': '3M',
  '6M': '6M',
  ALL: 'ALL', // (Linear)
} as const
export type CHART_VIEW_KEY = keyof typeof CHART_VIEWS
export type CHART_VIEW = (typeof CHART_VIEWS)[CHART_VIEW_KEY]

type Props = {
  view: CHART_VIEW
  height?: number
  width?: number
  exercise: Exercise
}
const ExerciseHistoryChart: React.FC<Props> = ({
  view,
  height,
  width,
  exercise,
}) => {
  const { workoutStore, stateStore, settingsStore } = useStores()

  const chartElRef = useRef<any>(null)
  const eChartRef = useRef<ECharts>()

  const symbolSize: number = useMemo(
    () =>
    ((
      {
        '30D': 10,
        '3M': 5,
        '6M': 5,
        ALL: 5,
      } satisfies Record<CHART_VIEW, number>
    )[view]),
    [view]
  )

  const viewDays: DateTime[] = useMemo(() => {
    const fallback = getPastDays(1)

    switch (view) {
      case '30D':
        return getPastDays(30)
      case '3M':
        return getPastDays(90)
      case '6M':
        return getPastDays(180)
      case 'ALL': {
        const workouts = workoutStore.exerciseWorkoutsHistoryMap[exercise.guid]!
        const range = [workouts.at(-1)!.date, workouts[0]!.date] as const

        // TODO grey out tab when no history
        if (range.some(x => x === undefined)) {
          break
        }

        const interval = Interval.fromDateTimes(
          ...(range.map(iso => DateTime.fromISO(iso)) as [DateInput, DateInput])
        )

        return interval
          .splitBy({ days: 1 })
          .map(d => d.start)
          .concat(DateTime.fromISO(range[1]))
          .filter(Boolean)
      }

      default:
        return fallback
    }

    return fallback
  }, [view, exercise])

  const xAxis = useMemo(() => {
    return viewDays.map(d => d.toFormat('dd LLL'))
  }, [view, exercise])

  const setsByDay = useMemo(() => {
    return computed(() =>
      viewDays.map(date => {
        const workout = workoutStore.dateWorkoutMap[date.toISODate()!]

        return workout?.exerciseSetsMap[exercise.guid] || []
      })
    ).get()
  }, [exercise, viewDays, workoutStore.workouts])

  const { getChartSeries } = seriesSetup({ data: setsByDay })

  const series = getChartSeries(exercise, settingsStore.measureRest)

  const { getViewOptions, feedChartSeriesData } = useChartConfig({
    series,
    symbolSize,
    xAxis,
  })
  const chartHeight = useMemo(() => height ?? 400, [height])
  const chartWidth = useMemo(
    () => width ?? Dimensions.get('window').width,
    [width]
  )

  const onHighlight = (data: unknown) => {
    // @ts-ignore
    const dateIndex = data.batch?.[0]?.dataIndex as number
    const date = viewDays[dateIndex]

    if (!date || !dateIndex) {
      setSelectedDate(undefined)
      return
    }

    const workout = workoutStore.workouts.find(w => w.date === date.toISODate())

    if (!workout) {
      setSelectedDate(undefined)
      return
    }

    // TODO set only if there's a workout there
    setSelectedDate(dateIndex && date ? date.toISODate()! : undefined)
  }

  // TODO this would be odd with multiple workouts+lines per day
  const [selectedDate, setSelectedDate] = useState<string>()

  useEffect(() => {
    if (chartElRef.current) {
      eChartRef.current = init(chartElRef.current, 'light', {
        renderer: 'skia',
        width,
        height,
      })

      eChartRef.current.setOption(getViewOptions())

      // highlight and downplay catch both exact dot-clicks and non-exact ones
      eChartRef.current?.on('highlight', onHighlight)
    }

    return () => eChartRef.current?.dispose()
  }, [exercise, view, width, height])

  useEffect(() => {
    eChartRef.current?.setOption({
      series: feedChartSeriesData(setsByDay),
    })
  }, [exercise, view, workoutStore.workouts, width, height])

  // TODO does not highlight set in question
  function linkToWorkoutDate() {
    stateStore.setOpenedDate(selectedDate!)
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
        {/* Select exercise */}
        {/* Select view */}
        <SvgChart
          ref={chartElRef}
          useRNGH
        />
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

export default observer(ExerciseHistoryChart)
