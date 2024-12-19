import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { getParentOfType } from 'mobx-state-tree'
import React, { useCallback, useMemo } from 'react'

import { useStores } from 'app/db/helpers/useStores'
import {
  Exercise,
  Workout,
  WorkoutModel,
  WorkoutSet,
  WorkoutStep,
} from 'app/db/models'

import ExerciseHistoryListItem from './ExerciseHistoryListItem'

type Props = {
  workouts: Workout[]
  exercise: Exercise
}
const ExerciseHistoryList: React.FC<Props> = ({ workouts, exercise }) => {
  const {
    stateStore,
    navStore: { navigate },
  } = useStores()

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<WorkoutStep>) => {
      const workout = getParentOfType(item, WorkoutModel)

      return (
        <ExerciseHistoryListItem
          key={item.guid}
          date={workout.date}
          step={item}
          sets={stepSets[item.guid]!}
          onPress={() => {
            navigate('WorkoutStack', { screen: 'Workout' })
            stateStore.setOpenedDate(workout.date)
          }}
        />
      )
    },
    []
  )

  const steps = useMemo(() => {
    return workouts.flatMap(w => w.exerciseStepsMap[exercise.guid]!)
  }, [workouts])

  const stepSets = useMemo(() => {
    return steps.reduce(
      (acc, step) => {
        acc[step.guid] = step.exerciseSetsMap[exercise.guid]!
        return acc
      },
      {} as Record<string, WorkoutSet[]>
    )
  }, [steps])

  return (
    <FlashList
      data={steps}
      renderItem={renderItem}
      keyExtractor={(s, i) => `${s.guid}_${i}`}
      estimatedItemSize={190}
    />
  )
}

export default ExerciseHistoryList
