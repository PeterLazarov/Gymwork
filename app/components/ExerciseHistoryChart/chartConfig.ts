import { oneRepMaxEpley } from 'fitness-calc'

import { WorkoutSet } from 'app/db/models'
import { colors } from 'designSystem'

// Docs
// https://echarts.apache.org/en/option.html#title

type ChartConfigParams = {
  series: Record<string, Array<number | null>>
  symbolSize: number
  xAxis: string[]
}
const chartConfig = ({ series, symbolSize, xAxis }: ChartConfigParams) => {
  const defaultOptions = {
    animation: true,
    tooltip: {
      // allows you to point at random and mark dots
      trigger: 'axis',
      axisPointer: { type: 'cross' }, // Pointer gains access and highlight
    },
    legend: {
      data: Object.keys(series), // the .name of series[number]
      selected: Object.keys(series).reduce((obj, curr) =>
        Object.assign({ [curr]: true })
      ),
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
    series: Object.keys(series).map((name, i) => {
      const conf = {
        name: name,
        type: 'line',
        symbolSize,
        symbol: 'circle',
        showAllSymbol: true,
        connectNulls: true,
      }

      // first line. TODO configurable colors
      if (i === 0) {
        conf.lineStyle = { color: colors.primary }
      }

      return conf
    }),
  }

  const createChartSeries = (data: WorkoutSet[][]) => {
    const numberOfPoints = data.filter(d => d.filter(Boolean)).flat().length

    const _series = Object.values(series).map((data, i) => {
      return {
        data,
        itemStyle: i === 0 ? { color: colors.primary } : undefined,
        symbol: numberOfPoints > 50 ? 'none' : 'circle',
      }
    })

    return _series
  }

  return {
    defaultOptions,
    createChartSeries,
  }
}

export default chartConfig
