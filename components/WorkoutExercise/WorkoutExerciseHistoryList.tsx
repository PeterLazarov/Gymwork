import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { ScrollView } from 'react-native'

import WorkoutExerciseHistoryDayItem from './WorkoutExerciseHistoryDayItem'
import { useStores } from '../../db/helpers/useStores'
import { Workout } from '../../db/models'

type Props = {
  workouts: Workout[]
}
const WorkoutExerciseHistoryList: React.FC<Props> = ({ workouts }) => {
  const { workoutStore } = useStores()

  const exerciseFilteredWorkouts = useMemo(
    () =>
      workouts.map(workout => ({
        ...workout,
        sets: workout.sets.filter(
          e => e.exercise.guid === workoutStore.openedExerciseGuid
        ),
      })),
    [workouts]
  )

  return (
    <ScrollView style={{ marginTop: -24, flexBasis: 0 }}>
      {exerciseFilteredWorkouts.map((workout, i) => (
        <WorkoutExerciseHistoryDayItem
          key={`${workout.date}_${i}`}
          date={workout.date}
          sets={workout.sets}
        />
      ))}
    </ScrollView>
  )
}

export default observer(WorkoutExerciseHistoryList)
