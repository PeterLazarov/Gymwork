// Choose your preferred renderer
import { SVGRenderer, SvgChart } from '@wuba/react-native-echarts'
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
import chartConfig from './chartConfig'
import seriesSetup from './seriesSetup'

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
  '7D': '7D',
  '30D': '30D',
  ALL: 'ALL', // (Linear)
} as const
export type CHART_VIEW_KEY = keyof typeof CHART_VIEWS
export type CHART_VIEW = (typeof CHART_VIEWS)[CHART_VIEW_KEY]

// Component usage
const ExerciseHistoryChart = (props: {
  view: CHART_VIEW
  height?: number
  width?: number
}) => {
  const { workoutStore, stateStore } = useStores()
  const openedExercise = stateStore.openedExercise

  const chartElRef = useRef<any>(null)
  const eChartRef = useRef<ECharts>()

  const symbolSize: number = useMemo(
    () =>
      ((
        {
          '30D': 10,
          '7D': 15,
          ALL: 5,
        } satisfies Record<CHART_VIEW, number>
      )[props.view]),
    [props.view]
  )

  const viewDays: DateTime[] = useMemo(() => {
    const fallback = getPastDays(1)

    switch (props.view) {
      case '7D':
        return getPastDays(7)
      case '30D':
        return getPastDays(30)
      case 'ALL': {
        const range = [
          workoutStore.exerciseWorkoutsHistoryMap[openedExercise!.guid]?.at(-1)
            ?.date!,
          workoutStore.exerciseWorkoutsHistoryMap[openedExercise!.guid]?.[0]
            ?.date,
        ] as const

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
  }, [props.view])

  const xAxis = useMemo(() => {
    return props.view === '7D'
      ? viewDays.map(d => d.toFormat('EEE'))
      : viewDays.map(d => d.toFormat('dd LLL'))
  }, [props.view])

  const setsByDay = useMemo(() => {
    return computed(() =>
      viewDays.map(date => {
        const workout = workoutStore.dateWorkoutMap[date.toISODate()!]

        return workout?.exerciseSetsMap[openedExercise!.guid] || []
      })
    ).get()
  }, [viewDays, workoutStore.workouts])

  const { getChartSeries } = seriesSetup({ data: setsByDay })

  const series = getChartSeries(openedExercise!)

  const { getViewOptions, feedChartSeriesData } = chartConfig({
    series,
    symbolSize,
    xAxis,
  })
  const height = useMemo(() => props.height ?? 400, [props.height])
  const width = useMemo(
    () => props.width ?? Dimensions.get('window').width,
    [props.width]
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
        renderer: 'svg',
        width,
        height,
      })

      eChartRef.current.setOption(getViewOptions())

      // highlight and downplay catch both exact dot-clicks and non-exact ones
      eChartRef.current?.on('highlight', onHighlight)
    }

    return () => eChartRef.current?.dispose()
  }, [props.view, props.width, props.height])

  useEffect(() => {
    eChartRef.current?.setOption({
      series: feedChartSeriesData(setsByDay),
    })
  }, [props.view, workoutStore.workouts, props.width, props.height])

  // TODO does not highlight set in question
  function linkToWorkoutDate() {
    stateStore.setProp('openedDate', selectedDate)
    // navigate to workout screen
  }

  return (
    <>
      <View
        style={{
          height: height ? height - 48 : undefined,
          width,
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
