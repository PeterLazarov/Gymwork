// Choose your preferred renderer
import { SvgChart, SVGRenderer, SkiaChart } from '@wuba/react-native-echarts'
import * as echarts from 'echarts/core'
import { useRef, useEffect } from 'react'
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

const style = {
  // focus: 'series1',
  label: {
    show: true,
    // formatter: function (param) {
    //   // return param.data[3];
    //   return 'idk'
    // },
    position: 'top',
  },

  shadowBlur: 10,
  shadowColor: 'rgba(0, 0, 255, 0.5)',
  shadowOffsetY: 5,
  color: {
    type: 'radial',
    x: 0.4,
    y: 0.3,
    r: 1,
    colorStops: [
      {
        offset: 0,
        color: 'rgb(255, 0, 0)',
      },
    ],
  },
}

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

export interface Datapoint {
  day: DateTime
  value: number
  // workout:workou
}

// Component usage
const ExerciseHistory = observer(
  <T extends Datapoint>(props: {
    view: CHART_VIEW
    datapoints: Array<T>
    onFocus(datapoint: T): void
  }) => {
    const screenWidth = Dimensions.get('window').width

    const chartRef = useRef<any>(null)

    const xAxis7d = getPastDays(7).map(d => d.weekdayShort)
    const xAxis30d = getPastDays(30).map(d => d.day)

    const { workoutStore, exerciseStore } = useStores()

    useEffect(() => {
      console.log('exercises', exerciseStore.exercises)
      console.log('workouts', workoutStore.workouts)
    })
    // workoutStore.openedExerciseHistory

    useEffect(() => {
      let chart: echarts.ECharts

      if (chartRef.current) {
        chart = echarts.init(chartRef.current, 'light', {
          renderer: 'svg',
          width: screenWidth,
          height: 400,
        })

        chart.setOption({
          animation: true,
          title: {
            text: 'title text',
          },
          tooltip: {
            // allows you to point at random and mark dots
            // text: console.log,
            trigger: 'axis',
          },
          legend: {
            data: ['series1', 'series2'], // the .name of series[number]
            selected: {
              series1: true,
              series2: false,
            },
          },
          // options:[{}],
          // timeline:[{}],
          xAxis: {
            type: 'category',
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: xAxis7d,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'series1',
              data: [120, 200, 150, 80, undefined, 110, 130],
              type: 'line',
              symbolSize: function (data) {
                // return Math.sqrt(data[2]) / 5e2;
                return 10
              },
              emphasis: {
                focus: 'series1',
                ...style,
              },

              itemStyle: style,
            },
            {
              name: 'series2',
              data: [12, 20, 15, 8, 7, 11, undefined],
              type: 'line',
            },
          ],
        })

        chart.on('click', console.log)
        // chart.on('mousemove',console.log)
      }

      return () => chart?.dispose()
    }, [])

    // Choose your preferred chart component
    return (
      <View>
        <SkiaChart ref={chartRef} />
      </View>
    )
  }
)

export default ExerciseHistory
