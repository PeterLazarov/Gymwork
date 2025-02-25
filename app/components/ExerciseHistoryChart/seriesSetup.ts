import { oneRepMaxEpley } from 'fitness-calc'

import {
  Exercise,
  WorkoutSet,
  isImperialDistance,
  measurementUnits,
} from 'app/db/models'
import { palettes } from 'designSystem'

import { SeriesItem } from './useChartConfig'

type Props = {
  data: WorkoutSet[][]
}
const seriesSetup = ({ data }: Props) => {
  const singleMetricFormatter = (metric: keyof WorkoutSet) => {
    return data.map(sets =>
      sets.length > 0
        ? sets.reduce((max, set) => Math.max(max, set[metric]), 0)
        : null
    )
  }
  const oneRepMaxFormatter = () => {
    return data.map(sets =>
      sets.length > 0
        ? sets.reduce(
            (max, set) =>
              Number(
                Math.max(max, oneRepMaxEpley(set.weight!, set.reps!)).toFixed(2)
              ),
            0
          )
        : null
    )
  }

  const speedFormatter = () => {
    return data.map(sets =>
      sets.length > 0
        ? sets.reduce(
            (max, set) => Number(Math.max(max, set.speed).toFixed(2)),
            0
          )
        : null
    )
  }

  const totalTonnageFormatter = () => {
    return data.map(sets =>
      sets.length > 0
        ? sets.reduce((acc, set) => (acc += set.reps * set.weight), 0)
        : null
    )
  }

  const totalVolumeFormatter = () => {
    return data.map(sets => sets.reduce((acc, { reps }) => acc + reps, 0))
  }

  const workSetsFormatter = () => {
    return data.map(sets => sets.filter(s => !s.isWarmup).length)
  }

  const getChartSeries = (exercise: Exercise, measureRest = false) => {
    const series: Record<string, SeriesItem> = {}
    const colorsStack = [
      palettes.tertiary['40'],
      palettes.coolSlateBlue.hue600,
      palettes.teal.hue600,
      palettes.error['80'],
      palettes.green['60'],
      palettes.coolMintGreen.hue600,
      palettes.amber.hue800,
      palettes.blue.hue600,
      palettes.coral.hue600,
      palettes.primary['60'],
    ]

    if (exercise.measurements?.weight) {
      series['Max Weight'] = {
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
        // series.Sets = {
        //   data: workSetsFormatter(),
        //   color: colorsStack.pop()!,
        //   initiallySelected: false,
        //   unit: 'sets',
        // }
        series.Tonnage = {
          data: totalTonnageFormatter(),
          color: colorsStack.pop()!,
          initiallySelected: false,
          unit: exercise.measurements.weight.unit,
        }
        series.Volume = {
          data: totalVolumeFormatter(),
          color: colorsStack.pop()!,
          initiallySelected: false,
          unit: 'reps',
        }
      }
    }
    if (exercise.measurements?.distance) {
      series['Max Distance'] = {
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

        series['Max Speed'] = {
          data: speedFormatter(),
          color: colorsStack.pop()!,
          initiallySelected: false,
          unit: `${distanceUnit}/${durationUnit}`,
        }
      }
    }
    if (exercise.measurements?.duration) {
      series['Max Duration'] = {
        data: singleMetricFormatter('duration'),
        color: colorsStack.pop()!,
        initiallySelected: false,
        unit: exercise.measurements.duration.unit,
      }
    }

    // if (measureRest) {
    //   series['Max Rest'] = {
    //     data: singleMetricFormatter('rest'),
    //     color: colorsStack.pop()!,
    //     initiallySelected: false,
    //     unit: 's', // ?
    //   }
    // }

    return series
  }

  return {
    getChartSeries,
  }
}

export default seriesSetup
