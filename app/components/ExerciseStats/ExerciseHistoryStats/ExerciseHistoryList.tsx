import React, { useCallback, useMemo } from 'react'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'

import ExerciseHistoryListItem from './ExerciseHistoryListItem'
import { Exercise, Workout, WorkoutModel, WorkoutStep } from 'app/db/models'
import { getParentOfType } from 'mobx-state-tree'
import { useStores } from 'app/db/helpers/useStores'
import { navigate } from 'app/navigators'

type Props = {
  workouts: Workout[]
  exercise: Exercise
}
const ExerciseHistoryList: React.FC<Props> = ({ workouts, exercise }) => {
  const { stateStore } = useStores()

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<WorkoutStep>) => {
      const workout = getParentOfType(item, WorkoutModel)

      return (
        <ExerciseHistoryListItem
          key={item.guid}
          date={workout.date}
          step={item}
          exercise={exercise}
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
