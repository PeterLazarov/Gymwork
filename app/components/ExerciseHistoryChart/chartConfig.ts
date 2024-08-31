import { WorkoutSet } from 'app/db/models'

// Docs
// https://echarts.apache.org/en/option.html#title

export type SeriesItem = {
  data: Array<number | null>
  color: string
  initiallySelected: boolean
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
        Object.assign({ [curr]: series[curr].initiallySelected })
      ),
    },
    yAxis: {
      type: 'value',
      min: ({ min }: { min: number }) => Math.floor(min * 0.95),
      max: ({ max }: { max: number }) => Math.ceil(max * 1.05),

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
      name,
      type: 'line',
      symbolSize,
      symbol: 'circle',
      showAllSymbol: true,
      connectNulls: true,
      lineStyle: { color: series[name].color },
    })),
  })

  const feedChartSeriesData = (data: WorkoutSet[][]) => {
    const numberOfPoints = data.filter(d => d.filter(Boolean)).flat().length

    const _series = Object.values(series).map(seriesItem => {
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
    feedChartSeriesData,
  }
}

export default chartConfig
