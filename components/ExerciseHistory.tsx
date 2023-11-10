// Choose your preferred renderer
import { SvgChart, SVGRenderer, SkiaChart } from '@wuba/react-native-echarts'
import * as echarts from 'echarts/core'
import { useRef, useEffect, useState } from 'react'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  // TimelineComponent,
} from 'echarts/components'
import { Dimensions, View } from 'react-native'
import { DateTime } from 'luxon'
import { useStores } from '../db/helpers/useStores'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { calculate1RM } from 'onerepmax.js'
import { Button } from 'react-native-paper'
import texts from '../texts'
import { useRouter } from 'expo-router'

// Docs
// https://echarts.apache.org/en/option.html#title

// Register extensions
echarts.use([
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
  (props: { view: CHART_VIEW; exerciseID: string }) => {
    const router = useRouter()
    const { workoutStore } = useStores()
    const screenWidth = Dimensions.get('window').width

    const chartRef = useRef<any>(null)

    // TODO not reactive!
    const viewDays = getPastDays(
      (
        {
          '7D': 7,
          '30D': 30,
          ALL: Math.ceil(
            Math.abs(
              DateTime.fromISO(
                workoutStore.workouts.findLast(w =>
                  w.exercises.find(
                    ({ exercise }) => exercise.guid === props.exerciseID
                  )
                )?.date!
              )
                .diffNow()
                .as('days')
            )
          ),
        } satisfies Record<CHART_VIEW, number>
      )[props.view]
    )
    console.log()

    const symbolSize: number = (
      {
        '30D': 10,
        '7D': 15,
        ALL: 3,
      } satisfies Record<CHART_VIEW, number>
    )[props.view]
    const xAxis =
      props.view === '7D'
        ? viewDays.map(d => d.weekdayShort!)
        : viewDays.map(d => d.toISODate())

    // TODO this would be odd with multiple workouts+lines per day
    const [selectedDate, setSelectedDate] = useState<string>()

    let chart = useRef<echarts.ECharts>()
    useEffect(() => {
      if (chartRef.current) {
        chart.current = echarts.init(chartRef.current, 'light', {
          renderer: 'svg',
          width: screenWidth,
          height: 400,
        })

        // Set default options
        chart.current.setOption({
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
            data: xAxis, // TODO add options
            boundaryGap: false,
          },
          series: [
            {
              name: series.Weight,
              type: 'line',
              symbolSize: data => symbolSize,
              showAllSymbol: true,
            },
            {
              name: series['Predicted 1RM'],
              type: 'line',
              symbolSize: data => symbolSize,
              showAllSymbol: true,
            },
          ],
        })

        // highlight and downplay catch both exact dot-clicks and non-exact ones
        chart.current?.on('highlight', data => {
          // @ts-ignore
          const dateIndex = data.batch?.[0]?.dataIndex as number
          const date = viewDays[dateIndex]

          if (dateIndex && date) {
            setSelectedDate(date.toISODate()!)
          }
        })
      }

      return () => chart.current?.dispose()
    }, [])

    // Feed chart with data
    useEffect(() => {
      const setsPerDay = viewDays.map(date => {
        return workoutStore.workouts
          .find(workout => workout.date === date.toISODate())
          ?.exercises.find(
            e => e.exercise.guid === props.exerciseID // TODO prop
          )
          ?.sets.map(set => getSnapshot(set)) // getSnapshot useless save for less bad TS types
      })

      // Uses this technique to connect disconnected points
      // https://echarts.apache.org/handbook/en/how-to/chart-types/line/basic-line/#line-chart-in-cartesian-coordinate-system
      chart.current?.setOption({
        series: [
          // Weight series
          {
            data: setsPerDay
              .map((sets, i) => [
                xAxis[i],
                sets?.reduce((max, set) => Math.max(max, set.weight), 0),
              ])
              .filter(([, pt]) => pt),
          },

          // 1RM series
          {
            data: setsPerDay
              .map((sets, i) => [
                xAxis[i],
                sets?.reduce(
                  (max, set) =>
                    Number(
                      Math.max(
                        max,
                        calculate1RM.adams(set.weight!, set.reps!)
                      ).toFixed(2)
                    ),
                  0
                ),
              ])
              .filter(([, pt]) => pt),
          },
        ],
      })
    }, [workoutStore.workouts])

    // TODO does not highlight set in question
    function handleBtnPress() {
      workoutStore.setProp('currentWorkoutDate', selectedDate)
      router.push('/')
    }

    // Choose your preferred chart component
    return (
      <View>
        <SkiaChart ref={chartRef} />
        <Button onPress={handleBtnPress}>{texts.goToWorkout}</Button>
      </View>
    )
  }
)

export default ExerciseHistoryChart
