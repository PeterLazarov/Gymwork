// Choose your preferred renderer
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts'
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
import { oneRepMaxEpley } from 'fitness-calc'
import { useRef, useEffect, useState, useMemo } from 'react'
import { Dimensions, View } from 'react-native'

import { useStores } from '../db/helpers/useStores'
import { WorkoutSet } from '../db/models'

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
export type CHART_VIEW = (typeof CHART_VIEWS)[keyof typeof CHART_VIEWS]

const series = {
  Weight: 'Weight',
  'Predicted 1RM': 'Predicted 1RM',
} as const

// Component usage
const ExerciseHistoryChart = observer(
  (props: {
    view: CHART_VIEW
    exerciseID: string
    height?: number
    width?: number
  }) => {
    const { workoutStore, stateStore } = useStores()

    const chartElRef = useRef<any>(null)
    const eChartRef = useRef<ECharts>()

    const viewDays: DateTime[] = useMemo(() => {
      const fallback = getPastDays(1)

      switch (props.view) {
        case '7D':
          return getPastDays(7)
        case '30D':
          return getPastDays(30)
        case 'ALL': {
          const range = [
            workoutStore.exerciseWorkouts[props.exerciseID]?.at(-1)?.date!,
            workoutStore.exerciseWorkouts[props.exerciseID]?.[0]?.date,
          ] as const

          // TODO grey out tab when no history
          if (range.some(x => x === undefined)) {
            console.warn('exercise was never performed?')
            break
          }

          const interval = Interval.fromDateTimes(
            ...(range.map(iso => DateTime.fromISO(iso)) as [
              DateInput,
              DateInput
            ])
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

    const xAxis = useMemo(
      () =>
        props.view === '7D'
          ? viewDays.map(d => d.weekdayShort!)
          : viewDays.map(d => d.toISODate()),
      [props.view]
    )

    const height = useMemo(() => props.height ?? 400, [props.height])
    const width = useMemo(
      () => props.width ?? Dimensions.get('window').width,
      [props.width]
    )

    // TODO this would be odd with multiple workouts+lines per day
    const [selectedDate, setSelectedDate] = useState<string>()

    useEffect(() => {
      if (chartElRef.current) {
        eChartRef.current = init(chartElRef.current, 'light', {
          renderer: 'svg',
          width,
          height,
        })

        // Set default options
        eChartRef.current.setOption({
          animation: true,
          tooltip: {
            // allows you to point at random and mark dots
            trigger: 'axis',
            axisPointer: { type: 'cross' }, // Pointer gains access and highlight
          },
          legend: {
            data: [series.Weight, series['Predicted 1RM']], // the .name of series[number]
            selected: {
              [series.Weight]: true,
              [series['Predicted 1RM']]: true,
            },
          },
          yAxis: {
            type: 'value',
            // axisLabel: { formatter: '{value} KG' }, // ! breaks styling
            axisPointer: {
              snap: true,
            },
          },

          // options:[{}],
          // timeline: [{}],
          xAxis: {
            type: 'category',
            data: xAxis,
            boundaryGap: false,
          },
          series: [
            {
              name: series.Weight,
              type: 'line',
              symbolSize,
              showAllSymbol: true,
              connectNulls: true,
            },
            {
              name: series['Predicted 1RM'],
              type: 'line',
              symbolSize,
              showAllSymbol: true,
              connectNulls: true,
            },
          ],
        })

        // highlight and downplay catch both exact dot-clicks and non-exact ones
        eChartRef.current?.on('highlight', data => {
          // @ts-ignore
          const dateIndex = data.batch?.[0]?.dataIndex as number
          const date = viewDays[dateIndex]

          if (!date || !dateIndex) {
            setSelectedDate(undefined)
            return
          }

          const workout = workoutStore.workouts.find(
            w => w.date === date.toISODate()
          )

          if (!workout) {
            setSelectedDate(undefined)
            return
          }

          // TODO set only if there's a workout there
          setSelectedDate(dateIndex && date ? date.toISODate()! : undefined)
        })
      }

      return () => eChartRef.current?.dispose()
    }, [props.view])

    // Feed chart with data
    useEffect(() => {
      const setsByDay = viewDays.map(date => {
        const dayExerciseSets = workoutStore.workouts
          .filter(workout => workout.date === date.toISODate())
          .flatMap(({ sets }) => sets) as WorkoutSet[]

        return dayExerciseSets.filter(
          set => set.exercise.guid === props.exerciseID
        )
      })

      const numberOfPoints = setsByDay
        .filter(d => d.filter(Boolean))
        .flat().length

      eChartRef.current?.setOption({
        series: [
          // Weight series
          {
            data: setsByDay.map(
              sets =>
                sets?.reduce((max, set) => Math.max(max, set.weight), 0) || null
            ),
            symbol: numberOfPoints > 50 ? 'none' : 'circle', // has a large performance impact
          },

          // 1RM series
          {
            data: setsByDay.map(
              sets =>
                sets?.reduce(
                  (max, set) =>
                    Number(
                      Math.max(
                        max,
                        oneRepMaxEpley(set.weight!, set.reps!)
                      ).toFixed(2)
                    ),
                  0
                ) || null
            ),
            symbol: numberOfPoints > 50 ? 'none' : 'circle', // has a large performance impact
          },
        ],
      })
    }, [workoutStore.workouts])

    // TODO does not highlight set in question
    function linkToWorkoutDate() {
      stateStore.setProp('openedDate', selectedDate)
      // navigate to workout screen
    }

    return (
      <View
        style={{
          height,
          width,
        }}
      >
        {/* Select exercise */}
        {/* Select view */}
        <SkiaChart ref={chartElRef} />
        {/* <Button
          disabled={!selectedDate}
          onPress={handleBtnPress}
        >
          {texts.goToWorkout}
        </Button> */}
      </View>
    )
  }
)

export default ExerciseHistoryChart
