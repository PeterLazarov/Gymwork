import { oneRepMaxEpley } from 'fitness-calc'

import {
  DistanceUnit,
  Exercise,
  WorkoutSet,
  isImperialDistance,
  measurementUnits,
} from 'app/db/models'
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

  const speedFormatter = (distanceUnit: DistanceUnit) => {
    return data.map(
      sets =>
        sets?.reduce(
          (max, set) => Number(Math.max(max, set.speed).toFixed(2)),
          0
        ) || null
    )
  }

  const getChartSeries = (exercise: Exercise) => {
    const series: Record<string, SeriesItem> = {}
    const colorsStack = [colors.tealDark, colors.secondary, colors.primary]

    if (exercise.measurements?.weight) {
      series.Weight = {
        data: singleMetricFormatter('weight'),
        color: colorsStack.pop()!,
        initiallySelected: true,
        unit: exercise.measurements.weight.unit,
      }
      if (exercise.measurements?.reps) {
        series['Predicted 1RM'] = {
          data: oneRepMaxFormatter(),
          color: colorsStack.pop()!,
          initiallySelected: true,
          unit: exercise.measurements.weight.unit,
        }
      }
    }
    if (exercise.measurements?.distance) {
      series.Distance = {
        data: singleMetricFormatter('distance'),
        color: colorsStack.pop()!,
        initiallySelected: true,
        unit: exercise.measurements.distance.unit,
      }
      if (exercise.measurements?.duration) {
        const isImperial = isImperialDistance(
          exercise.measurements.distance.unit
        )
        const distanceUnit = isImperial
          ? measurementUnits.distance.mile
          : measurementUnits.distance.km
        const durationUnit = measurementUnits.duration.h

        series.Speed = {
          data: speedFormatter(distanceUnit),
          color: colorsStack.pop()!,
          initiallySelected: false,
          unit: `${distanceUnit}/${durationUnit}`,
        }
      }
    }
    if (exercise.measurements?.duration) {
      series.Duration = {
        data: singleMetricFormatter('duration'),
        color: colorsStack.pop()!,
        initiallySelected: false,
        unit: exercise.measurements.duration.unit,
      }
    }
    if (exercise.measurements?.rest) {
      series.Rest = {
        data: singleMetricFormatter('rest'),
        color: colorsStack.pop()!,
        initiallySelected: false,
        unit: exercise.measurements.rest.unit,
      }
    }

    return series
  }

  return {
    getChartSeries,
  }
}

export default seriesSetup
