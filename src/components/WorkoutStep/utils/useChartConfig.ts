import { SetModel } from "@/db/models/SetModel"
import { useColors } from "@/designSystem"
import { useMemo } from "react"

export type SeriesItem = {
  data: (number | null)[]
  color: string
  initiallySelected: boolean
  unit: string
}
type ChartConfigParams = {
  series: Record<string, SeriesItem>
  symbolSize: number
  xAxis: string[]
}
export const useChartConfig = ({ series, symbolSize, xAxis }: ChartConfigParams) => {
  const colors = useColors()

  const getViewOptions = useMemo(
    () => ({
      animation: true,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          snap: true,
        },
        confine: true,
      },
      legend: {
        data: Object.keys(series),
        selected: Object.keys(series).reduce(
          (obj, curr) => {
            obj[curr] = series[curr]?.initiallySelected
            return obj
          },
          {} as Record<string, boolean | undefined>,
        ),
        textStyle: {
          color: colors.onSurface,
        },
        inactiveColor: colors.outline,
        inactiveBorderColor: colors.outline,
        icon: "roundRect",
      },
      yAxis: {
        type: "value",
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
        type: "category",
        data: xAxis,
        boundaryGap: false,
      },
      series: Object.keys(series).map((name, i) => ({
        name,
        type: "line",
        symbolSize,
        symbol: "circle",
        showAllSymbol: true,
        connectNulls: true,
        lineStyle: { color: series[name]!.color },
      })),
    }),
    [series, symbolSize, xAxis, colors],
  )

  const feedChartSeriesData = useMemo(
    () => (data: SetModel[][]) => {
      const numberOfPoints = data.filter((d) => d.filter(Boolean)).flat().length

      const _series = Object.values(series).map((seriesItem) => {
        return {
          data: seriesItem.data,
          symbol: numberOfPoints > 50 ? "none" : "circle",
          itemStyle: { color: seriesItem.color },
          tooltip: {
            valueFormatter: (value: string) => (value ? `${value} ${seriesItem.unit}` : "-"),
          },
        }
      })

      return _series
    },
    [series],
  )

  return {
    getViewOptions,
    feedChartSeriesData,
  }
}
