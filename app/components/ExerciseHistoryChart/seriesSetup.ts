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
            Number(
              Math.max(max, set.distance! / set.duration!).toFixed(2)
            ),
          0
        ) || null
      )
  }

  const getChartSeries = (exercise: Exercise) => {
    const series: Record<string, SeriesItem> = {}
    const colorsStack = [colors.tealDark, colors.primary]

    if (exercise.hasWeightMeasument) {
      series.Weight = {
        data: singleMetricFormatter('weight'),
        color: colorsStack.pop()!,
      }
      if (exercise.hasRepMeasument) {
        series['Predicted 1RM'] = {
          data: oneRepMaxFormatter(),
          color: colorsStack.pop()!,
        }
      }
    }
    if (exercise.hasDistanceMeasument) {
      series.Distance = {
        data: singleMetricFormatter('distance'),
        color: colorsStack.pop()!,
      }
      if (exercise.hasTimeMeasument) {
        series.Speed = {
          data: speedFormatter(),
          color: colorsStack.pop()!
        }
      }
    }

    return series
  }

  return {
    getChartSeries,
  }
}

export default seriesSetup
