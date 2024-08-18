import { oneRepMaxEpley } from 'fitness-calc'

import { WorkoutSet } from 'app/db/models'
import { colors } from 'designSystem'

// Docs
// https://echarts.apache.org/en/option.html#title

type Props = {
  series: {
    Weight: string
    'Predicted 1RM': string
  }
  symbolSize: number
  xAxis: string[]
}
const useChartBackend = ({ series, symbolSize, xAxis }: Props) => {
  const defaultOptions = {
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
      min: ({ min }) => (min * 0.95).toFixed(0),
      max: ({ max }) => (max * 1.05).toFixed(0),

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
        symbol: 'circle',
        showAllSymbol: true,
        connectNulls: true,
        lineStyle: { color: colors.primary },
      },
      {
        name: series['Predicted 1RM'],
        type: 'line',
        symbolSize,
        symbol: 'circle',
        showAllSymbol: true,
        connectNulls: true,

        // areaStyle: {
        //   color: 'rgba(230, 231, 231,0.8)',
        // },
      },
    ],
  }

  const createChartSeries = (data: WorkoutSet[][]) => {
    const numberOfPoints = data.filter(d => d.filter(Boolean)).flat().length

    const series = [
      // Weight series
      {
        data: data.map(
          sets =>
            sets?.reduce((max, set) => Math.max(max, set.weight), 0) || null
        ),
        symbol: numberOfPoints > 50 ? 'none' : 'circle',
        itemStyle: { color: colors.primary },
      },

      // 1RM series
      {
        data: data.map(
          sets =>
            sets?.reduce(
              (max, set) =>
                Number(
                  Math.max(max, oneRepMaxEpley(set.weight!, set.reps!)).toFixed(
                    2
                  )
                ),
              0
            ) || null
        ),
        symbol: numberOfPoints > 50 ? 'none' : 'circle',
      },
    ]

    return series
  }

  return {
    defaultOptions,
    createChartSeries,
  }
}

export default useChartBackend
