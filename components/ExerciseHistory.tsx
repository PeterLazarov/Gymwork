// Choose your preferred renderer
import { SvgChart, SVGRenderer } from '@wuba/react-native-echarts'
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

// Component usage
export default function ExerciseHistory3() {
  const screenWidth = Dimensions.get('window').width

  const chartRef = useRef<any>(null)
  const chartRef2 = useRef<any>(null)

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
          text: 'tooltipText',
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
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
              return 20
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
      <SvgChart ref={chartRef} />
    </View>
  )
}
