import { observer } from 'mobx-react-lite'
import React from 'react'
import { ScrollView } from 'react-native'

import { Workout } from 'app/db/models'
import WorkoutExerciseCard from '../WorkoutExercise/WorkoutExerciseCard'

type Props = {
  workout: Workout
}

const WorkoutExerciseList: React.FC<Props> = ({ workout }) => {
  console.log('sets', workout.sets.toJSON())
  console.log('ex', workout.exercises)
  return (
    <ScrollView
      style={{ flex: 1 }}
      nestedScrollEnabled
    >
      {workout.exercises.map(exercise => (
        <WorkoutExerciseCard
          key={`${workout!.date}_${exercise.guid}`}
          workout={workout!}
          exercise={exercise}
        />
      ))}
    </ScrollView>
  )
}
export default observer(WorkoutExerciseList)
