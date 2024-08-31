import { oneRepMaxEpley } from 'fitness-calc'

import { Exercise, WorkoutSet } from 'app/db/models'
import { colors } from 'designSystem'
import { SeriesItem } from './chartConfig'

type Props = {
  data: WorkoutSet[][]
}
const seriesSetup = ({ data }: Props) => {
  const singleMetricFormatter = (metric: keyof WorkoutSet) => {
    return data.map(
      sets => sets?.reduce((max, set) => Math.max(max, set[metric]), 0) || null
    )
  }
  const oneRepMaxFormatter = () => {
    return data.map(
      sets =>
        sets?.reduce(
          (max, set) =>
            Number(
              Math.max(max, oneRepMaxEpley(set.weight!, set.reps!)).toFixed(2)
            ),
          0
        ) || null
    )
  }

  const speedFormatter = () => {
    return data.map(
      sets =>
        sets?.reduce(
          (max, set) =>
            Number(Math.max(max, set.distance! / set.duration!).toFixed(2)),
          0
        ) || null
    )
  }

  const getChartSeries = (exercise: Exercise) => {
    const series: Record<string, SeriesItem> = {}
    const colorsStack = [colors.tomato, colors.tealDark, colors.primary]

    if (exercise.measurements.weight) {
      series.Weight = {
        data: singleMetricFormatter('weight'),
        color: colorsStack.pop()!,
        initiallySelected: true,
      }
      if (exercise.measurements.reps) {
        series['Predicted 1RM'] = {
          data: oneRepMaxFormatter(),
          color: colorsStack.pop()!,
          initiallySelected: true,
        }
      }
    }
    if (exercise.measurements.distance) {
      series.Distance = {
        data: singleMetricFormatter('distance'),
        color: colorsStack.pop()!,
        initiallySelected: true,
      }
      if (exercise.measurements.duration) {
        series.Speed = {
          data: speedFormatter(),
          color: colorsStack.pop()!,
          initiallySelected: false,
        }
      }
    }
    if (exercise.measurements.rest) {
      series.Rest = {
        data: singleMetricFormatter('rest'),
        color: colorsStack.pop()!,
        initiallySelected: false,
      }
    }

    return series
  }

  return {
    getChartSeries,
  }
}

export default seriesSetup
