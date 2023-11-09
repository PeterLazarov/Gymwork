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
}
export type CHART_VIEW = (typeof CHART_VIEWS)[keyof typeof CHART_VIEWS]

// TODO?
export interface Datapoint {
  day: DateTime
  value: number
  // workout:workou
}

// Component usage
const ExerciseHistoryChart = observer(
  <T extends Datapoint>(props: {
    view: CHART_VIEW
    datapoints: Array<T>
    onFocus(datapoint: T): void
  }) => {
    const router = useRouter()
    const screenWidth = Dimensions.get('window').width

    const chartRef = useRef<any>(null)

    const xAxis7d = getPastDays(7).map(d => d.weekdayShort!)
    const xAxis30d = getPastDays(30).map(d => d.day)

    const { workoutStore } = useStores()

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
          tooltip: { trigger: 'axis' }, // allows you to point at random and mark dots
          legend: {
            data: ['Weight', 'Predicted 1RM'], // the .name of series[number]
            selected: {
              series1: true,
              series2: false,
            },
          },
          yAxis: {
            type: 'value',
          },

          // options:[{}],
          // timeline:[{}],
          xAxis: {
            type: 'category',
            data: xAxis7d, // TODO add options
          },
          series: [
            {
              name: 'Weight',
              type: 'line',
              symbolSize: data => 20,
              showAllSymbol: true,
            },
            {
              name: 'Predicted 1RM',
              type: 'line',
              symbolSize: data => 20,

              showAllSymbol: true,
            },
          ],
        })

        // highlight and downplay catch both exact dot-clicks and non-exact ones
        chart.current?.on('highlight', data => {
          // @ts-ignore
          const dateIndex = data.batch[0].dataIndex as number
          const date = getPastDays(7)[dateIndex]
          setSelectedDate(date.toISODate()!)
        })
      }

      return () => chart.current?.dispose()
    }, [])

    // Feed chart with data
    useEffect(() => {
      const setsPerDay = getPastDays(7).map(date => {
        return workoutStore.workouts
          .find(workout => workout.date === date.toISODate())
          ?.exercises.find(
            e => e.exercise.guid === '43' // TODO prop
          )
          ?.sets.map(set => getSnapshot(set)) // getSnapshot useless save for less bad TS types
      })

      chart.current?.setOption({
        series: [
          {
            // TODO refactor out getPastDays
            data: setsPerDay.map(sets =>
              sets
                ? sets.reduce((max, set) => Math.max(max, set.weight), 0)
                : null
            ),
          },
          {
            data: setsPerDay.map(sets =>
              sets
                ? sets.reduce(
                    (max, set) =>
                      Number(
                        Math.max(
                          max,
                          calculate1RM.adams(set.weight!, set.reps!)
                        ).toFixed(2)
                      ),
                    0
                  )
                : null
            ),
          },
        ],
      })
    }, [workoutStore.workouts])

    // TODO
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
