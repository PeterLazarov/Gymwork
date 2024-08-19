import { Exercise, WorkoutSet } from 'app/db/models'
import { colors } from 'designSystem'
import { oneRepMaxEpley } from 'fitness-calc'

type Props = {
  data: WorkoutSet[][]
}
const seriesSetup = ({ data }: Props) => {
  const singleMetricFormatter = (metric: keyof WorkoutSet) => {
    return data.map(
    sets => sets?.reduce((max, set) => Math.max(max, set[metric]), 0) || null
    )
  }  
  const singleRepMaxFormatter = () => {
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
    if (exercise.hasWeightMeasument) {
      const weightSeries = {
        Weight: {
          data: singleMetricFormatter('weight'),
          color: colors.primary,
        },
        'Predicted 1RM': {
          data: singleRepMaxFormatter(),
          color: colors.tealDark,
        },
      }

      return weightSeries
    }
    // else if (exercise.hasDistanceMeasument) {
      const distanceSeries = {
        Distance: {
          data: singleMetricFormatter('distance'),
          color: colors.primary,
        },
        Speed: {
          data: speedFormatter(),
          color: colors.tealDark
        }
      }

      return distanceSeries
    // }

    // return null
  }

  return {
    getChartSeries,
  }
}

export default seriesSetup
