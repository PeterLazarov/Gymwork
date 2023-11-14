import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView } from 'react-native'

import WorkoutExerciseHistoryDayItem from './WorkoutExerciseHistoryDayItem'
import { useStores } from '../../db/helpers/useStores'
import { Workout } from '../../db/models'

type Props = {
  workouts: Workout[]
}
const WorkoutExerciseHistoryList: React.FC<Props> = ({ workouts }) => {
  const { workoutStore } = useStores()

  return (
    <ScrollView style={{ marginTop: -24, flexBasis: 0 }}>
      {workouts?.map((workout, i) => (
        <WorkoutExerciseHistoryDayItem
          key={`${workout.date}_${i}`}
          date={workout.date}
          sets={workout.sets.filter(
            e => e.exercise.guid === workoutStore.openedExerciseGuid
          )}
        />
      ))}
    </ScrollView>
  )
}

export default observer(WorkoutExerciseHistoryList)
