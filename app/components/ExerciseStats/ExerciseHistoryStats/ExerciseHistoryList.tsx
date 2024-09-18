import React, { useCallback, useMemo } from 'react'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import ExerciseHistoryListItem from './ExerciseHistoryListItem'
import {
  Exercise,
  Workout,
  WorkoutModel,
  WorkoutSet,
  WorkoutStep,
} from 'app/db/models'
import { getParentOfType } from 'mobx-state-tree'
import { useStores } from 'app/db/helpers/useStores'

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
            navigate('Workout')
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
    return steps.reduce((acc, step) => {
      acc[step.guid] = step.exerciseSetsMap[exercise.guid]!
      return acc
    }, {} as Record<string, WorkoutSet[]>)
  }, [steps])

  console.log('ExerciseHistoryList')
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
