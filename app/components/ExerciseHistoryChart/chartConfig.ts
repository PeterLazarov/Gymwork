import { WorkoutSet } from 'app/db/models'

// Docs
// https://echarts.apache.org/en/option.html#title

type SeriesItem = {
  data: Array<number | null>
  color: string
}
type ChartConfigParams = {
  series: Record<string, SeriesItem>
  symbolSize: number
  xAxis: string[]
}
const chartConfig = ({ series, symbolSize, xAxis }: ChartConfigParams) => {
  const getViewOptions = () => ({
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
    series: Object.keys(series).map((name, i) => ({
        name: name,
        type: 'line',
        symbolSize,
        symbol: 'circle',
        showAllSymbol: true,
        connectNulls: true,
        lineStyle: { color: series[name].color }
      })
    ),
  })

  const createChartSeries = (data: WorkoutSet[][]) => {
    const numberOfPoints = data.filter(d => d.filter(Boolean)).flat().length

    const _series = Object.values(series).map((seriesItem, i) => {
      return {
        data: seriesItem.data,
        symbol: numberOfPoints > 50 ? 'none' : 'circle',
        itemStyle: { color: seriesItem.color },
      }
    })

    return _series
  }

  return {
    getViewOptions,
    createChartSeries,
  }
}

export default chartConfig
